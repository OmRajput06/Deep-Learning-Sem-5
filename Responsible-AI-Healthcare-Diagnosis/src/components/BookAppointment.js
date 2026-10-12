import { logout } from "../utils/session";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Stethoscope,
  CalendarCheck,
  UserRound,
} from "lucide-react";

// Fixed time grid; slots are marked booked per-doctor via index
const TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
];
const makeSlots = (bookedIdx = []) =>
  TIME_SLOTS.map((time, i) => ({ time, booked: bookedIdx.includes(i) }));

// Doctor roster grouped by the disease type selected on the Dashboard,
// so patients see specialists relevant to their diagnosis.
const DOCTORS_BY_DISEASE = {
  "Brain Tumor (MRI)": [
    { id: 1, name: "Dr. Ayesha Khan", specialty: "Neurologist", age: 42, experience: 15, fee: 800, color: "bg-blue-600", slots: makeSlots([1, 4]) },
    { id: 2, name: "Dr. Karan Malhotra", specialty: "Neurosurgeon", age: 48, experience: 18, fee: 1200, color: "bg-indigo-600", slots: makeSlots([0, 3]) },
    { id: 3, name: "Dr. Neha Kapoor", specialty: "Neuro-Oncologist", age: 39, experience: 11, fee: 950, color: "bg-cyan-600", slots: makeSlots([2, 5]) },
    { id: 4, name: "Dr. Suresh Iyer", specialty: "Neuro-Radiologist", age: 51, experience: 24, fee: 700, color: "bg-sky-600", slots: makeSlots([1, 2]) },
  ],
  "Skin Cancer (Image)": [
    { id: 5, name: "Dr. Priya Sharma", specialty: "Dermatologist", age: 40, experience: 14, fee: 600, color: "bg-purple-600", slots: makeSlots([0, 4]) },
    { id: 6, name: "Dr. Rohan Mehta", specialty: "Oncologist", age: 38, experience: 12, fee: 1000, color: "bg-emerald-600", slots: makeSlots([2, 5]) },
    { id: 7, name: "Dr. Meera Nair", specialty: "Dermato-Oncologist", age: 45, experience: 19, fee: 900, color: "bg-pink-600", slots: makeSlots([1, 3]) },
    { id: 8, name: "Dr. Farhan Ali", specialty: "Skin Surgeon", age: 43, experience: 16, fee: 850, color: "bg-fuchsia-600", slots: makeSlots([0, 5]) },
  ],
  "Bone Fracture (X-ray)": [
    { id: 9, name: "Dr. Arjun Verma", specialty: "Orthopedic Surgeon", age: 50, experience: 22, fee: 900, color: "bg-orange-600", slots: makeSlots([2, 4]) },
    { id: 10, name: "Dr. Simran Kaur", specialty: "Orthopedist", age: 36, experience: 9, fee: 650, color: "bg-amber-600", slots: makeSlots([0, 1]) },
    { id: 11, name: "Dr. Vikram Rao", specialty: "Trauma Specialist", age: 47, experience: 20, fee: 1100, color: "bg-red-600", slots: makeSlots([3, 5]) },
    { id: 12, name: "Dr. Ananya Desai", specialty: "Musculoskeletal Radiologist", age: 41, experience: 13, fee: 700, color: "bg-rose-600", slots: makeSlots([1, 4]) },
  ],
  "Lung Cancer (Image)": [
    { id: 13, name: "Dr. Sameer Joshi", specialty: "Pulmonologist", age: 44, experience: 17, fee: 800, color: "bg-teal-600", slots: makeSlots([0, 3]) },
    { id: 14, name: "Dr. Ritu Bansal", specialty: "Oncologist", age: 39, experience: 12, fee: 1000, color: "bg-lime-600", slots: makeSlots([2, 5]) },
    { id: 15, name: "Dr. Alok Trivedi", specialty: "Thoracic Surgeon", age: 52, experience: 23, fee: 1300, color: "bg-green-600", slots: makeSlots([1, 4]) },
    { id: 16, name: "Dr. Divya Menon", specialty: "Chest Radiologist", age: 37, experience: 10, fee: 700, color: "bg-emerald-500", slots: makeSlots([0, 2]) },
  ],
  default: [
    { id: 17, name: "Dr. Manish Gupta", specialty: "General Physician", age: 45, experience: 18, fee: 500, color: "bg-blue-600", slots: makeSlots([1, 3]) },
    { id: 18, name: "Dr. Kavita Reddy", specialty: "General Physician", age: 39, experience: 12, fee: 500, color: "bg-purple-600", slots: makeSlots([0, 4]) },
    { id: 19, name: "Dr. Anil Kumar", specialty: "Internal Medicine", age: 50, experience: 21, fee: 550, color: "bg-orange-600", slots: makeSlots([2, 5]) },
    { id: 20, name: "Dr. Shalini Rao", specialty: "Family Medicine", age: 42, experience: 15, fee: 500, color: "bg-teal-600", slots: makeSlots([0, 3]) },
  ],
};

const TODAY = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

// Static doctor avatar icon in a colored circle matching their specialty accent color
function DoctorAvatar({ color, size = "w-20 h-20", iconSize = 36 }) {
  return (
    <div
      className={`${size} rounded-full ${color} text-white flex items-center justify-center shadow-md`}
    >
      <UserRound size={iconSize} />
    </div>
  );
}

function BookAppointment() {
  const navigate = useNavigate();
  const savedPatient = JSON.parse(localStorage.getItem("patientData") || localStorage.getItem("currentPatient") || "null");
  const FIELDS = Object.keys(DOCTORS_BY_DISEASE).filter((k) => k !== "default");
  const [disease, setDisease] = useState(FIELDS.includes(savedPatient?.disease) ? savedPatient.disease : "");
  // only specialists for the selected field; nothing is listed until a field is chosen
  const doctors = disease ? DOCTORS_BY_DISEASE[disease] : [];

  const [step, setStep] = useState("select"); // select -> slots -> confirmed
  const [doctor, setDoctor] = useState(null);
  const [slot, setSlot] = useState(null);
  const [patientName, setPatientName] = useState(savedPatient?.name || "");
  const [reason, setReason] = useState("");
  const [appointment, setAppointment] = useState(null);

  const handleConsult = (doc) => {
    setDoctor(doc);
    setSlot(null);
    setStep("slots");
  };

  const handleConfirm = () => {
    if (!patientName.trim()) {
      alert("Please enter the patient's name to continue.");
      return;
    }
    if (!slot) {
      alert("Please select an available time slot.");
      return;
    }
    setAppointment({
      id: `CUR-${Date.now().toString().slice(-6)}`,
      doctor,
      slot,
      patientName: patientName.trim(),
      reason: reason.trim(),
      date: TODAY,
    });
    setStep("confirmed");
  };

  const handleBookAnother = () => {
    setDoctor(null);
    setSlot(null);
    setReason("");
    setAppointment(null);
    setStep("select");
  };

  return (
    <div
      className="min-h-screen font-sora bg-center bg-no-repeat text-black relative"
      style={{
        backgroundImage: "url('assets/cells2.jpg')",
        backgroundSize: "100% auto",
      }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-10 py-4 border-b border-black bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div onClick={() => (window.location.href = "/")} className="cursor-pointer">
            <h1 className="text-2xl font-bold">CureIt.AI</h1>
            <p className="text-sm text-gray-600">Healthcare Platform</p>
          </div>
          <h2 className="text-lg font-semibold">Book Appointment</h2>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>

        <div className="max-w-6xl mx-auto py-10 px-6">
          {/* STEP 1: Doctor selection */}
          {step === "select" && (
            <>
              <button
                onClick={() => navigate("/diagnosis")}
                className="flex items-center gap-2 mb-6 text-gray-700 hover:text-black transition"
              >
                <ArrowLeft size={18} /> Back to Diagnosis Portal
              </button>

              <div className="bg-white/70 border border-gray-300 rounded-xl shadow-md p-8 backdrop-blur-md mb-8">
                <h2 className="text-2xl font-bold mb-2">
                  Consult a Specialist
                </h2>
                <p className="text-gray-600">
                  {disease
                    ? `Showing only ${disease} specialists.`
                    : "Select the medical field to see the relevant specialists."}
                </p>
                <select
                  value={disease}
                  onChange={(e) => { setDisease(e.target.value); setDoctor(null); }}
                  className="mt-3 px-4 py-2 border rounded-md bg-white"
                >
                  <option value="">Select field</option>
                  {FIELDS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white/80 border border-gray-300 rounded-xl shadow-md p-6 backdrop-blur-md flex flex-col items-center text-center hover:shadow-lg transition"
                  >
                    <div className="mb-4">
                      <DoctorAvatar color={doc.color} />
                    </div>
                    <h3 className="text-lg font-bold">{doc.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {doc.specialty}
                    </p>

                    <div className="w-full text-sm text-left space-y-1 mb-5">
                      <p className="flex justify-between">
                        <span className="text-gray-600">Age</span>
                        <span className="font-medium">{doc.age} yrs</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Experience</span>
                        <span className="font-medium">
                          {doc.experience} yrs
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Consultation Fee</span>
                        <span className="font-medium">₹{doc.fee}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleConsult(doc)}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      <Stethoscope size={16} /> Consult Now
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* STEP 2: Slot selection */}
          {step === "slots" && doctor && (
            <>
              <button
                onClick={() => setStep("select")}
                className="flex items-center gap-2 mb-6 text-gray-700 hover:text-black transition"
              >
                <ArrowLeft size={18} /> Choose a different doctor
              </button>

              <div className="bg-white/70 border border-gray-300 rounded-xl shadow-md p-8 backdrop-blur-md">
                <div className="flex items-center gap-4 mb-6">
                  <DoctorAvatar
                    color={doctor.color}
                    size="w-14 h-14"
                    iconSize={26}
                  />
                  <div>
                    <h2 className="text-xl font-bold">{doctor.name}</h2>
                    <p className="text-sm text-gray-600">
                      {doctor.specialty} • {doctor.experience} yrs exp • ₹
                      {doctor.fee} consultation
                    </p>
                  </div>
                </div>

                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  <Clock size={18} /> Available Slots — {TODAY}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Greyed-out slots are already booked.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
                  {doctor.slots.map((s) => (
                    <button
                      key={s.time}
                      disabled={s.booked}
                      onClick={() => setSlot(s.time)}
                      className={`px-3 py-2 rounded-md border text-sm transition ${
                        s.booked
                          ? "border-gray-300 text-gray-400 line-through cursor-not-allowed bg-gray-100"
                          : slot === s.time
                          ? "bg-black text-white border-black"
                          : "border-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block font-medium mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter patient name"
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">
                      Reason for Visit (optional)
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. Follow-up, second opinion"
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleConfirm}
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    <CalendarCheck size={18} /> Confirm Appointment
                  </button>
                </div>
              </div>
            </>
          )}

          {/* STEP 3: Confirmation */}
          {step === "confirmed" && appointment && (
            <div className="bg-white/80 border border-gray-300 rounded-xl shadow-md p-10 backdrop-blur-md text-center max-w-2xl mx-auto">
              <CheckCircle2 size={56} className="mx-auto text-green-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Thank you for choosing us!
              </h2>
              <p className="text-gray-600 mb-8">
                Your appointment has been booked successfully.
              </p>

              <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 text-left space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Appointment ID</span>
                  <span className="font-semibold">{appointment.id}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Patient Name</span>
                  <span className="font-semibold">
                    {appointment.patientName}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Doctor</span>
                  <span className="font-semibold">
                    {appointment.doctor.name}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Specialty</span>
                  <span className="font-semibold">
                    {appointment.doctor.specialty}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold">{appointment.date}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Time Slot</span>
                  <span className="font-semibold">{appointment.slot}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-semibold">
                    ₹{appointment.doctor.fee}
                  </span>
                </p>
                {appointment.reason && (
                  <p className="flex justify-between">
                    <span className="text-gray-600">Reason for Visit</span>
                    <span className="font-semibold">{appointment.reason}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <button
                  onClick={handleBookAnother}
                  className="px-6 py-2 border border-black rounded-md hover:bg-gray-100 transition"
                >
                  Book Another Appointment
                </button>
                <button
                  onClick={() => navigate("/diagnosis")}
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  Back to Diagnosis Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
