export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export function logout() {
  ["token", "doctor", "currentPatient", "patientData"].forEach((k) => localStorage.removeItem(k));
  window.location.href = "/auth";
}

export function setCurrentPatient(p) {
  const patient = {
    patient_id: p.patient_id,
    name: p.name,
    disease: p.disease ?? p.disease_type,
  };
  localStorage.setItem("currentPatient", JSON.stringify(patient));
  localStorage.setItem("patientData", JSON.stringify(patient));
}
