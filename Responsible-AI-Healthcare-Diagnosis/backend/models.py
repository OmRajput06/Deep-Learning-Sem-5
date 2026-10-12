# models.py
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from db import db

class Doctor(db.Model):
    __tablename__ = "doctors"

    doctor_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(20))
    license_number = db.Column(db.String(50), unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    photo_url = db.Column(db.Text)
    signature_url = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    patients = db.relationship("Patient", backref="doctor", lazy=True)

    def set_password(self, raw_password: str):
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password_hash(self.password_hash, raw_password)


class Patient(db.Model):
    __tablename__ = "patients"

    patient_id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.doctor_id"), nullable=False)

    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    dob = db.Column(db.Date)
    visit_date = db.Column(db.Date)
    contact = db.Column(db.String(20))
    gender = db.Column(db.String(10))
    disease_type = db.Column(db.String(50))
    notes = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class DiagnosisReport(db.Model):
    __tablename__ = "diagnosis_reports"

    report_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.patient_id"), nullable=False)
    image_url = db.Column(db.Text)
    prediction = db.Column(db.String(100))
    confidence = db.Column(db.String(20))
    report_date = db.Column(db.DateTime, default=datetime.utcnow)
