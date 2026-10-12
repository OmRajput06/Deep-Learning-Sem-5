from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from db import db
from models import DiagnosisReport, Patient

ml_bp = Blueprint("ml", __name__)


@ml_bp.route("/api/diagnose/mri", methods=["POST"])
@jwt_required()
def diagnose_mri():
    from ml import xai  # lazy import: TensorFlow is heavy
    if not xai.model_available():
        return jsonify({"error": "Model file backend/ml/model.h5 is missing"}), 503
    f = request.files.get("image")
    if not f:
        return jsonify({"error": "No image uploaded"}), 400
    try:
        result = xai.explain(f.stream)
    except Exception as e:
        return jsonify({"error": f"Could not analyse image: {e}"}), 400

    # save the report if the scan belongs to one of this doctor's patients
    pid = request.form.get("patient_id", type=int)
    if pid:
        patient = Patient.query.filter_by(patient_id=pid, doctor_id=int(get_jwt_identity())).first()
        if patient:
            report = DiagnosisReport(patient_id=pid, prediction=result["prediction"], confidence=result["confidence"])
            db.session.add(report)
            db.session.commit()
            result["report_id"] = report.report_id
    return jsonify(result), 200


@ml_bp.route("/api/patients/<int:pid>/reports", methods=["GET"])
@jwt_required()
def patient_reports(pid):
    if not Patient.query.filter_by(patient_id=pid, doctor_id=int(get_jwt_identity())).first():
        return jsonify({"error": "Patient not found"}), 404
    rows = DiagnosisReport.query.filter_by(patient_id=pid).order_by(DiagnosisReport.report_date.desc()).limit(20).all()
    return jsonify([{
        "report_id": r.report_id,
        "prediction": r.prediction,
        "confidence": r.confidence,
        "report_date": r.report_date.isoformat() if r.report_date else None,
    } for r in rows]), 200
