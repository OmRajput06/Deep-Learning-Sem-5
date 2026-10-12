# app.py
import os
from datetime import timedelta, datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from dotenv import load_dotenv

from db import db, build_db_uri
from models import Doctor, Patient

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = build_db_uri()
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "jwt-secret")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)

    db.init_app(app)
    JWTManager(app)

    # ----------------- CORS FIX -----------------
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )
    # --------------------------------------------

    # Create DB tables
    with app.app_context():
        db.create_all()

    # ---------- ROUTES ----------

    @app.route("/api/health", methods=["GET"])
    def health():
        return {"status": "ok", "time": datetime.utcnow().isoformat()}

    # REGISTER DOCTOR
    @app.route("/api/auth/register", methods=["POST"])
    def register():
        data = request.get_json() or {}
        required = ["name", "email", "password", "license_number"]

        if not all(data.get(field) for field in required):
            return jsonify({"error": "Missing required fields"}), 400

        if Doctor.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already registered"}), 409

        if data.get("license_number") and Doctor.query.filter_by(license_number=data["license_number"]).first():
            return jsonify({"error": "Medical license number already registered"}), 409

        doc = Doctor(
            name=data["name"],
            email=data["email"],
            phone=data.get("phone"),
            license_number=data.get("license_number"),
            photo_url=data.get("photo_url"),
            signature_url=data.get("signature_url"),
        )
        doc.set_password(data["password"])
        try:
            db.session.add(doc)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Database error during registration: {str(e)}"}), 500

        return jsonify({"message": "Registered successfully"}), 201

    # LOGIN DOCTOR → FIXED JWT (identity must be string)
    @app.route("/api/auth/login", methods=["POST"])
    def login():
        data = request.get_json() or {}

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        doc = Doctor.query.filter_by(email=email).first()

        if not doc or not doc.check_password(password):
            return jsonify({"error": "Invalid credentials"}), 401

        # FIX: identity must be string
        token = create_access_token(identity=str(doc.doctor_id))

        return jsonify({
            "token": token,
            "doctor": {
                "doctor_id": doc.doctor_id,
                "name": doc.name,
                "email": doc.email
            }
        }), 200

    # ADD PATIENT (FIXED)
    @app.route("/api/patients", methods=["POST"])
    @jwt_required()
    def add_patient():
        doctor_id = int(get_jwt_identity())

        data = request.get_json() or {}

        if not data.get("name"):
            return jsonify({"error": "Patient name is required"}), 400

        patient = Patient(
            doctor_id=doctor_id,
            name=data.get("name"),
            age=data.get("age"),
            dob=data.get("dob"),
            visit_date=data.get("visitDate"),
            contact=data.get("contact"),
            gender=data.get("gender"),
            disease_type=data.get("disease"),
            notes=data.get("notes")
        )
        db.session.add(patient)
        db.session.commit()

        return jsonify({
            "message": "Patient saved",
            "patient_id": patient.patient_id
        }), 201

    # GET PATIENTS (FIXED)
    @app.route("/api/patients", methods=["GET"])
    @jwt_required()
    def list_patients():
        doctor_id = int(get_jwt_identity())

        query = Patient.query.filter_by(doctor_id=doctor_id).order_by(Patient.created_at.desc())

        results = []
        for p in query:
            results.append({
                "patient_id": p.patient_id,
                "name": p.name,
                "age": p.age,
                "dob": p.dob.isoformat() if p.dob else None,
                "visit_date": p.visit_date.isoformat() if p.visit_date else None,
                "contact": p.contact,
                "gender": p.gender,
                "disease_type": p.disease_type,
                "notes": p.notes,
                "created_at": p.created_at.isoformat() if p.created_at else None,
            })

        return jsonify(results), 200

    from routes_ml import ml_bp
    app.register_blueprint(ml_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
