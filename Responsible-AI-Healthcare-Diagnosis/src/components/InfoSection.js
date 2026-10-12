import React from "react";

const TECH = [
  { title: "Deep Learning", text: "A VGG16-based convolutional neural network classifies brain MRI scans as glioma, meningioma, pituitary tumor or no tumor." },
  { title: "Explainable AI", text: "Grad-CAM heatmaps and a circled region of interest show which part of the scan supports the prediction." },
  { title: "Secure Platform", text: "React front end, Flask API and MySQL database, with JWT-protected doctor accounts and patient records." },
];

const SERVICES = [
  { title: "AI Image Diagnosis", text: "Upload an MRI and get a prediction with confidence and per-class probabilities." },
  { title: "Patient Records", text: "Register patients, search previous visits and keep a history of every diagnosis." },
  { title: "Specialist Appointments", text: "Book consultations with specialists matched to the patient's medical field." },
];

function Cards({ items }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8 text-left">
      {items.map((i) => (
        <div key={i.title} className="bg-white/70 border border-gray-300 rounded-xl p-6 shadow-sm backdrop-blur-md">
          <h3 className="text-xl font-semibold mb-2">{i.title}</h3>
          <p className="text-gray-700">{i.text}</p>
        </div>
      ))}
    </div>
  );
}

function InfoSection() {
  return (
    <>
      <section id="about" className="relative py-20 px-6 text-center scroll-mt-24">
        <h2 className="text-4xl font-bold mb-6">About CureIt.AI</h2>
        <p className="text-lg text-black-700 max-w-3xl mx-auto">
          At CureIt.AI, we harness the power of artificial intelligence to transform healthcare.
          From early disease detection to personalized treatment recommendations, our solutions
          are designed to make healthcare faster, more accurate, and accessible for everyone.
        </p>
      </section>

      <section id="tech" className="relative py-20 px-6 text-center scroll-mt-24">
        <h2 className="text-4xl font-bold mb-2">Technology</h2>
        <p className="text-lg max-w-3xl mx-auto">The AI and engineering behind CureIt.AI.</p>
        <Cards items={TECH} />
      </section>

      <section id="services" className="relative py-20 px-6 text-center scroll-mt-24">
        <h2 className="text-4xl font-bold mb-2">Services</h2>
        <p className="text-lg max-w-3xl mx-auto">What doctors can do with CureIt.AI.</p>
        <Cards items={SERVICES} />
      </section>
    </>
  );
}

export default InfoSection;
