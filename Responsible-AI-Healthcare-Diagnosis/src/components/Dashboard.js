import { logout, setCurrentPatient } from "../utils/session";
import React, { useState, useEffect } from "react";
import { LogOut, UserPlus, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addPatient, getPatients } from "../api/patientApi";

function Dashboard() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    dob: "",
    visitDate: "",
    contact: "",
    gender: "",
    disease: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [patientsList, setPatientsList] = useState([]);
  const [search, setSearch] = useState("");

  // Load patients on mount
  useEffect(() => {
    loadPatients();
  }, []);

  // ✅ FIXED — Always send token in call
  const loadPatients = async (query = "") => {
    const token = localStorage.getItem("token");
    const res = await getPatients(token, query);

    if (Array.isArray(res)) {
      setPatientsList(res);
    } else {
      console.error("Backend error:", res);
      setPatientsList([]);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  // Save patient
  const handleSubmit = async () => {
    if (!patient.name || !patient.age || !patient.disease || !patient.visitDate) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    const token = localStorage.getItem("token");

    // FIXED — token added
    const res = await addPatient(patient, token);

    if (res.patient_id) {
      alert("✅ Patient saved successfully!");
      setCurrentPatient({ patient_id: res.patient_id, name: patient.name, disease: patient.disease });
      setSubmitted(true);
      loadPatients();

      // Reset form
      setPatient({
        name: "",
        age: "",
        dob: "",
        visitDate: "",
        contact: "",
        gender: "",
        disease: "",
        notes: "",
      });
    } else {
      alert("❌ Could not save patient.");
      console.error(res);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative text-black font-sora"
      style={{ backgroundImage: "url('assets/dashboard-bg2.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/10"></div>

      <div className="relative z-10">
        {/* NAVBAR */}
        <nav className="flex items-center justify-between px-10 py-4 border-b border-black bg-white/50 backdrop-blur-md">
          <div onClick={() => (window.location.href = "/")} className="cursor-pointer">
            <h1 className="text-2xl font-bold">CureIt.AI</h1>
            <p className="text-sm text-gray-700">Healthcare Platform</p>
          </div>
          <h2 className="text-lg font-semibold">Doctor Dashboard</h2>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>

        {/* SEARCH SECTION */}
        <div className="max-w-6xl mx-auto px-6 mt-8">
          <div className="bg-white/10 border rounded-xl p-6 backdrop-blur-md mb-8">
            <h2 className="text-xl font-bold mb-4">Search Previous Patients</h2>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search by name, disease, contact..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              />
              <button
                onClick={() => loadPatients(search)}
                className="px-6 py-2 bg-black text-white rounded-md"
              >
                Search
              </button>
            </div>

            {/* RESULTS */}
            <div className="mt-6 space-y-4 max-h-64 overflow-y-auto">
              {patientsList.length === 0 ? (
                <p className="text-gray-700">No patients found.</p>
              ) : (
                patientsList.map((p) => (
                  <div
                    key={p.patient_id}
                    className="p-4 border rounded-lg bg-white/50 backdrop-blur-sm"
                  >
                    <p className="font-bold">{p.name}</p>
                    <p>Age: {p.age}</p>
                    <p>Disease: {p.disease_type}</p>
                    <p>Visit: {p.visit_date}</p>
                    <p className="text-gray-700">{p.notes}</p>
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => { setCurrentPatient(p); navigate("/diagnosis"); }}
                        className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Diagnose
                      </button>
                      <button
                        onClick={() => { setCurrentPatient(p); navigate("/book-appointment"); }}
                        className="px-4 py-1 border border-black rounded-md hover:bg-gray-100 text-sm"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* PATIENT FORM */}
        <div className="max-w-6xl mx-auto py-10 px-6">
          <section className="bg-white/10 border rounded-xl p-8 shadow-md backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="text-black" />
              <h2 className="text-2xl font-bold">Patient Details</h2>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="font-medium">Patient Name *</label>
                <input
                  type="text"
                  name="name"
                  value={patient.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2"
                />
              </div>

              <div>
                <label className="font-medium">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={patient.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2"
                />
              </div>

              <div>
                <label className="font-medium">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={patient.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2"
                />
              </div>

              <div>
                <label className="font-medium">Date of Visit *</label>
                <input
                  type="date"
                  name="visitDate"
                  value={patient.visitDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2"
                />
              </div>

              <div>
                <label className="font-medium">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={patient.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2"
                />
              </div>

              <div>
                <label className="font-medium">Gender</label>
                <select
                  name="gender"
                  value={patient.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2"
                >
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="font-medium">Disease Type *</label>
                <select
                  name="disease"
                  value={patient.disease}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2"
                >
                  <option value="">Select diagnostic type</option>
                  <option>Brain Tumor (MRI)</option>
                  <option>Skin Cancer (Image)</option>
                  <option>Bone Fracture (X-ray)</option>
                  <option>Lung Cancer (Image)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="font-medium">Description / Notes</label>
                <textarea
                  name="notes"
                  value={patient.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md mt-2 h-24"
                ></textarea>
              </div>

            </form>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() =>
                  setPatient({
                    name: "",
                    age: "",
                    dob: "",
                    visitDate: "",
                    contact: "",
                    gender: "",
                    disease: "",
                    notes: "",
                  })
                }
                className="px-6 py-2 border border-black rounded-md hover:bg-gray-100 transition"
              >
                Reset
              </button>

              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
              >
                <UserPlus size={18} /> Save Details
              </button>
            </div>

            {submitted && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/diagnosis")}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-md mx-auto hover:bg-blue-700 transition"
                >
                  <Stethoscope size={20} /> Go to Diagnosis Page
                </button>
              </div>
            )}

          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
