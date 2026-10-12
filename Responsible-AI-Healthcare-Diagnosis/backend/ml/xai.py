"""Inference + Grad-CAM explanation for the brain-MRI model."""
import base64
import io
import os

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

_MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.h5")
SIZE_IN = 128
_state = {}

LABELS = {
    "glioma": "Glioma",
    "meningioma": "Meningioma",
    "pituitary": "Pituitary tumor",
    "notumor": "No tumor",
}
EXPLAIN = {
    "glioma": "Glioma is suggested by an irregular, diffusely bordered abnormal region inside the brain tissue.",
    "meningioma": "Meningioma is suggested by a well-defined mass at the outer surface of the brain.",
    "pituitary": "Pituitary tumor is suggested by an abnormal mass near the base of the brain (sella region).",
    "notumor": "No focal abnormal region stood out; the model's attention is spread over normal brain structures.",
}
CLASSES = ["pituitary", "glioma", "notumor", "meningioma"]  # model output order


def model_available():
    return os.path.exists(_MODEL_PATH)


def _load():
    """Rebuild the notebook's VGG16 architecture and load weights from the .h5 by layer name
    (the saved file does not deserialize directly under newer Keras)."""
    if "base" not in _state:
        import h5py
        from tensorflow.keras import Model, layers
        from tensorflow.keras.applications import VGG16
        base = VGG16(input_shape=(SIZE_IN, SIZE_IN, 3), include_top=False, weights=None)
        head = [layers.Flatten(), layers.Dropout(0.3), layers.Dense(128, activation="relu"),
                layers.Dropout(0.2), layers.Dense(4, activation="softmax")]
        y = base.output
        for l in head:
            y = l(y)

        def ds(g):
            out = {}
            g.visititems(lambda n, o: out.__setitem__(n.split("/")[-1], o[()]) if hasattr(o, "shape") else None)
            return out

        with h5py.File(_MODEL_PATH, "r") as f:
            w = f["model_weights"]
            for l in base.layers:
                if l.name in w["vgg16"]:
                    d = ds(w["vgg16"][l.name])
                    l.set_weights([d["kernel"], d["bias"]])
            for l, n in zip([h for h in head if isinstance(h, layers.Dense)], ["dense_6", "dense_7"]):
                d = ds(w[n])
                l.set_weights([d["kernel"], d["bias"]])
        _state["base"] = Model(base.input, base.get_layer("block5_conv3").output)
        _state["head"] = [base.get_layer("block5_pool")] + head
    return _state["base"], _state["head"]


def _b64(img):
    buf = io.BytesIO()
    img.save(buf, "PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def _jet(v):
    r = np.clip(1.5 - np.abs(4 * v - 3), 0, 1)
    g = np.clip(1.5 - np.abs(4 * v - 2), 0, 1)
    b = np.clip(1.5 - np.abs(4 * v - 1), 0, 1)
    return (np.stack([r, g, b], -1) * 255).astype(np.uint8)


def explain(file_obj):
    import tensorflow as tf
    base, head = _load()
    classes = CLASSES
    img = Image.open(file_obj).convert("RGB")
    x = np.array(img.resize((SIZE_IN, SIZE_IN)), dtype="float32")[None] / 255.0

    with tf.GradientTape() as tape:
        conv = base(x)
        tape.watch(conv)
        y = conv
        for l in head[:-1]:
            y = l(y, training=False)
        logits = tf.matmul(y, head[-1].kernel) + head[-1].bias  # pre-softmax scores
        probs_t = tf.nn.softmax(logits)
        idx = int(tf.argmax(logits[0]))
        score = logits[0, idx]
    g = tape.gradient(score, conv)
    probs = probs_t[0].numpy()
    cam = tf.nn.relu(tf.reduce_sum(conv[0] * tf.reduce_mean(g[0], axis=(0, 1)), axis=-1)).numpy()
    cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)

    size = 448
    base = img.resize((size, size))
    cam_big = np.array(Image.fromarray((cam * 255).astype(np.uint8)).resize((size, size), Image.BICUBIC)) / 255.0
    overlay = Image.fromarray((np.array(base) * (1 - 0.5 * cam_big[..., None]) + _jet(cam_big) * (0.5 * cam_big[..., None])).astype(np.uint8))

    # circle the most strongly activated region
    labeled, n = ndimage.label(cam_big >= 0.6)
    circled = base.copy()
    where = ""
    if n:
        sizes = ndimage.sum(cam_big, labeled, range(1, n + 1))
        ys, xs = np.where(labeled == int(np.argmax(sizes)) + 1)
        cy, cx = ys.mean(), xs.mean()
        r = max(30, np.sqrt(len(ys) / np.pi) * 1.3)
        ImageDraw.Draw(circled).ellipse([cx - r, cy - r, cx + r, cy + r], outline=(255, 40, 40), width=4)
        v = "upper" if cy < size / 3 else "lower" if cy > 2 * size / 3 else "central"
        hz = "left" if cx < size / 3 else "right" if cx > 2 * size / 3 else "middle"
        where = (f" The strongest evidence is in the {v}-{hz} part of the image (circled), "
                 f"covering about {100 * len(ys) / size ** 2:.0f}% of the scan.")

    key = classes[idx]
    return {
        "disease": "Brain MRI",
        "prediction": LABELS.get(key, key),
        "is_tumor": key != "notumor",
        "confidence": f"{float(probs[idx]) * 100:.1f}%",
        "probabilities": {LABELS.get(c, c): round(float(p) * 100, 1) for c, p in zip(classes, probs)},
        "description": EXPLAIN.get(key, "") + where,
        "heatmap": _b64(overlay),
        "circled": _b64(circled),
        "original": _b64(base),
        "disclaimer": "Decision support only; not a clinical diagnosis. Heatmaps show where the model looked, not proof of pathology.",
    }
