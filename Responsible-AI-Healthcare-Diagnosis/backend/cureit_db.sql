CREATE DATABASE IF NOT EXISTS cureit_db;
USE cureit_db;

-- DOCTORS
CREATE TABLE IF NOT EXISTS doctors (
  doctor_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  license_number VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  photo_url TEXT,
  signature_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PATIENTS
CREATE TABLE IF NOT EXISTS patients (
  patient_id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INT,
  dob DATE,
  visit_date DATE,
  contact VARCHAR(20),
  gender VARCHAR(10),
  disease_type VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

-- (Optional) DIAGNOSIS REPORTS
CREATE TABLE IF NOT EXISTS diagnosis_reports (
  report_id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  image_url TEXT,
  prediction VARCHAR(100),
  confidence VARCHAR(20),
  report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);
