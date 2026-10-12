// // import React, { useState, useEffect } from "react";
// // import { UploadCloud, RefreshCw, LogOut } from "lucide-react";

// // function DiagnosisPage() {
// //   const [file, setFile] = useState(null);
// //   const [result, setResult] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [patient, setPatient] = useState(null);

// //   // ✅ Get patient info stored from Dashboard
// //   useEffect(() => {
// //     const savedPatient = JSON.parse(localStorage.getItem("currentPatient"));
// //     setPatient(savedPatient);
// //   }, []);

// //   // Handle file upload
// //   const handleFileChange = (e) => {
// //     setFile(e.target.files[0]);
// //     setResult(null);
// //   };

// //   // Simulated AI analysis (replace with Flask API later)
// //  const handleReset = () => {
// //     setFile(null);
// //     setResult(null);
// //   };

// //   return (
// //     <div
// //       className="min-h-screen font-sora bg-cover bg-center text-black relative"
// //       style={{
// //         backgroundImage: "url('assets/diagnosis.jpg')", // 👈 put your image in /public/assets
// //         backgroundSize: "cover",
// //         backgroundPosition: "center",
// //       }}
// //     >
// //       {/* Overlay for readability */}
// //       <div className="absolute inset-0 bg-white/10"></div>

// //       <div className="relative z-10">
// //         {/* Navbar */}
// //         <nav className="flex items-center justify-between px-10 py-4 border-b border-black bg-white/80 backdrop-blur-md sticky top-0">
// //           <div>
// //             <h1 className="text-2xl font-bold">CureIt.AI</h1>
// //             <p className="text-sm text-gray-600">Healthcare Platform</p>
// //           </div>
// //           <h2 className="text-lg font-semibold">Diagnosis Portal</h2>
// //           <button className="flex items-center gap-2 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition">
// //             <LogOut size={18} /> Logout
// //           </button>
// //         </nav>

// //         {/* Main Section */}
// //         <div className="max-w-4xl mx-auto py-10 px-6">
// //           <div className="bg-white/55 border border-gray-300 rounded-xl shadow-md p-8 backdrop-blur-md">
// //             <h2 className="text-2xl font-bold mb-2">Medical Image Analysis</h2>
// //             <p className="text-gray-600 mb-8">
// //               Upload patient medical images for AI-powered diagnosis.
// //             </p>

// //             {/* Patient & Disease Info */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
// //               <div>
// //                 <label className="block font-medium mb-2">Patient Name</label>
// //                 <input
// //                   type="text"
// //                   value={patient?.name || "N/A"}
// //                   disabled
// //                   className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block font-medium mb-2">Disease Type</label>
// //                 <input
// //                   type="text"
// //                   value={patient?.disease || "N/A"}
// //                   disabled
// //                   className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
// //                 />
// //               </div>
// //             </div>

// //             {/* File Upload */}
// //             <div className="border-2 border-dashed border-gray-400 rounded-xl p-10 text-center mb-6">
// //               <UploadCloud size={40} className="mx-auto text-gray-500 mb-4" />
// //               {file ? (
// //                 <p className="text-gray-800 font-medium">{file.name}</p>
// //               ) : (
// //                 <p className="text-gray-600 mb-3">
// //                   Drag & drop your image here or
// //                 </p>
// //               )}
// //               <label className="inline-block bg-black text-white px-6 py-2 rounded-md cursor-pointer hover:bg-gray-800 transition">
// //                 Choose File
// //                 <input
// //                   type="file"
// //                   accept="image/*"
// //                   onChange={handleFileChange}
// //                   className="hidden"
// //                 />
// //               </label>
// //             </div>

// //             {/* Buttons */}
// //             <div className="flex justify-end gap-4 mb-6">
// //               <button
// //                 onClick={handleReset}
// //                 className="flex items-center gap-2 border border-black px-6 py-2 rounded-md hover:bg-gray-100 transition"
// //               >
// //                 <RefreshCw size={18} /> Reset
// //               </button>
// //               <button
// //                 onClick={handleAnalyze}
// //                 className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition"
// //                 disabled={loading}
// //               >
// //                 {loading ? "Analyzing..." : "Analyze Image"}
// //               </button>
// //             </div>

// //             {/* AI Result Section */}
// //             {result && (
// //               <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 mt-6 shadow-sm">
// //                 <h3 className="text-xl font-bold mb-4">🧠 Analysis Report</h3>
// //                 <p>
// //                   <span className="font-semibold">Disease: </span>
// //                   {result.disease}
// //                 </p>
// //                 <p>
// //                   <span className="font-semibold">Prediction: </span>
// //                   {result.prediction}
// //                 </p>
// //                 <p>
// //                   <span className="font-semibold">Confidence: </span>
// //                   {result.confidence}
// //                 </p>
// //                 <p className="mt-2 text-gray-700">{result.description}</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default DiagnosisPage;

// import React, { useState, useEffect } from "react";
// import { UploadCloud, RefreshCw, LogOut } from "lucide-react";

// function DiagnosisPage() {
//   const [file, setFile] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [patient, setPatient] = useState(null);

//   // Get stored patient info
//   useEffect(() => {
//     const savedPatient = JSON.parse(localStorage.getItem("currentPatient"));
//     setPatient(savedPatient);
//   }, []);

//   // When file selected
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setResult(null);
//   };

//   // Simulated Acne Detection Model
//   const handleAnalyze = () => {
//     if (!file) {
//       alert("Please upload an image first!");
//       return;
//     }

//     setLoading(true);

//     // Fake Skin Acne Model Output
//     setTimeout(() => {
//       setLoading(false);

//       // Random accuracy between 85% - 98% (looks real)
//       const accuracy = Math.floor(Math.random() * (98 - 85 + 1)) + 85;

//       setResult({
//         disease: "Acne (Skin Disease)",
//         prediction: "Acne Detected",
//         confidence: `${accuracy}%`,
//         description:
//           "The uploaded skin image indicates visible signs of acne. The system predicts acne with high confidence. Consider consulting a dermatologist for further evaluation.",
//       });
//     }, 2000);
//   };

//   // Reset upload
//   const handleReset = () => {
//     setFile(null);
//     setResult(null);
//   };

//   return (
//     <div
//       className="min-h-screen font-sora bg-cover bg-center text-black relative"
//       style={{
//         backgroundImage: "url('assets/diagnosis.jpg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className="absolute inset-0 bg-white/10"></div>

//       <div className="relative z-10">
//         {/* Navbar */}
//         <nav className="flex items-center justify-between px-10 py-4 border-b border-black bg-white/80 backdrop-blur-md sticky top-0">
//           <div>
//             <h1 className="text-2xl font-bold">CureIt.AI</h1>
//             <p className="text-sm text-gray-600">Healthcare Platform</p>
//           </div>
//           <h2 className="text-lg font-semibold">Diagnosis Portal</h2>
//           <button className="flex items-center gap-2 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition">
//             <LogOut size={18} /> Logout
//           </button>
//         </nav>

//         {/* Main Section */}
//         <div className="max-w-4xl mx-auto py-10 px-6">
//           <div className="bg-white/55 border border-gray-300 rounded-xl shadow-md p-8 backdrop-blur-md">
//             <h2 className="text-2xl font-bold mb-2">Skin Disease Analysis</h2>
//             <p className="text-gray-600 mb-8">
//               Upload a skin image for AI-powered acne detection.
//             </p>

//             {/* Patient Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block font-medium mb-2">Patient Name</label>
//                 <input
//                   type="text"
//                   value={patient?.name || "N/A"}
//                   disabled
//                   className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
//                 />
//               </div>

//               <div>
//                 <label className="block font-medium mb-2">Disease Type</label>
//                 <input
//                   type="text"
//                   value={patient?.disease || "Skin Disease"}
//                   disabled
//                   className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
//                 />
//               </div>
//             </div>

//             {/* File Upload */}
//             <div className="border-2 border-dashed border-gray-400 rounded-xl p-10 text-center mb-6">
//               <UploadCloud size={40} className="mx-auto text-gray-500 mb-4" />
//               {file ? (
//                 <p className="text-gray-800 font-medium">{file.name}</p>
//               ) : (
//                 <p className="text-gray-600 mb-3">
//                   Drag & drop your skin image here or
//                 </p>
//               )}
//               <label className="inline-block bg-black text-white px-6 py-2 rounded-md cursor-pointer hover:bg-gray-800 transition">
//                 Choose File
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </label>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end gap-4 mb-6">
//               <button
//                 onClick={handleReset}
//                 className="flex items-center gap-2 border border-black px-6 py-2 rounded-md hover:bg-gray-100 transition"
//               >
//                 <RefreshCw size={18} /> Reset
//               </button>
//               <button
//                 onClick={handleAnalyze}
//                 className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition"
//                 disabled={loading}
//               >
//                 {loading ? "Analyzing..." : "Analyze Image"}
//               </button>
//             </div>

//             {/* Result */}
//             {result && (
//               <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 mt-6 shadow-sm">
//                 <h3 className="text-xl font-bold mb-4">🧠 Acne Detection Report</h3>
//                 <p>
//                   <span className="font-semibold">Disease: </span>
//                   {result.disease}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Prediction: </span>
//                   {result.prediction}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Confidence: </span>
//                   {result.confidence}
//                 </p>
//                 <p className="mt-2 text-gray-700">{result.description}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DiagnosisPage;


import React, { useState, useEffect } from "react";
import { UploadCloud, RefreshCw, LogOut, ArrowLeft, CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/session";

function DiagnosisPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState(null);
  const [uploadCount, setUploadCount] = useState(0); // Track number of uploads

  // Load patient from Dashboard
  useEffect(() => {
    const savedPatient = JSON.parse(localStorage.getItem("currentPatient"));
    setPatient(savedPatient);
    if (savedPatient?.patient_id) loadHistory(savedPatient.patient_id);
  }, []);

  const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const loadHistory = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/patients/${id}/reports`, { headers: authHeader() });
      if (res.ok) setHistory(await res.json());
    } catch (e) {
      // history is optional
    }
  };

  // When file selected
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  // ANALYSIS — Rotating Prediction Logic
  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload an image first!");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append("image", file);
      if (patient?.patient_id) form.append("patient_id", patient.patient_id);
      const res = await fetch("http://localhost:5000/api/diagnose/mri", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
      if (patient?.patient_id) loadHistory(patient.patient_id);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

// //

  // Reset
  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div
      className="min-h-screen font-sora bg-cover bg-center text-black relative"
      style={{
        backgroundImage: "url('assets/diagnosis.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/10"></div>

      <div className="relative z-10">
        {/* NAVBAR */}
        <nav className="flex items-center justify-between px-10 py-4 border-b border-black bg-white/80 backdrop-blur-md sticky top-0">
          <div onClick={() => (window.location.href = "/")} className="cursor-pointer">
            <h1 className="text-2xl font-bold">CureIt.AI</h1>
            <p className="text-sm text-gray-600">Healthcare Platform</p>
          </div>
          <h2 className="text-lg font-semibold">Diagnosis Portal</h2>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition">
            <LogOut size={18} /> Logout
          </button>
        </nav>

        {/* MAIN */}
        <div className="max-w-4xl mx-auto py-10 px-6">
          <div className="bg-white/55 border border-gray-300 rounded-xl shadow-md p-8 backdrop-blur-md">
            
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 mb-4 text-gray-700 hover:text-black transition"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <h2 className="text-2xl font-bold mb-2">AI Medical Image Analysis</h2>
            <p className="text-gray-600 mb-8">
              Upload medical images for AI-based predictions.
            </p>

            {/* PATIENT INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-medium mb-2">Patient Name</label>
                <input
                  type="text"
                  value={patient?.name || "N/A"}
                  disabled
                  className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Disease Type</label>
                <input
                  type="text"
                  value={patient?.disease || "N/A"}
                  disabled
                  className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
                />
              </div>
            </div>

            {/* UPLOAD */}
            <div className="border-2 border-dashed border-gray-400 rounded-xl p-10 text-center mb-6">
              <UploadCloud size={40} className="mx-auto text-gray-500 mb-4" />
              {file ? (
                <p className="text-gray-800 font-medium">{file.name}</p>
              ) : (
                <p className="text-gray-600 mb-3">
                  Drag & drop your image here or
                </p>
              )}
              <label className="inline-block bg-black text-white px-6 py-2 rounded-md cursor-pointer hover:bg-gray-800 transition">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-4 mb-6">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 border border-black px-6 py-2 rounded-md hover:bg-gray-100 transition"
              >
                <RefreshCw size={18} /> Reset
              </button>
              <button
                onClick={handleAnalyze}
                className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze Image"}
              </button>
            </div>

            {history.length > 0 && (
              <div className="mb-6 text-sm">
                <h3 className="font-semibold mb-2">Previous diagnoses for this patient</h3>
                {history.map((h) => (
                  <div key={h.report_id} className="flex justify-between border-b py-1">
                    <span>{h.prediction} ({h.confidence})</span>
                    <span className="text-gray-500">{h.report_date ? new Date(h.report_date).toLocaleString() : ""}</span>
                  </div>
                ))}
              </div>
            )}

            {/* RESULT */}
            {result && (
              <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 mt-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">🧠 AI Diagnosis Report</h3>
                <p><span className="font-semibold">Disease: </span>{result.disease}</p>
                <p><span className="font-semibold">Prediction: </span>{result.prediction}</p>
                <p><span className="font-semibold">Confidence: </span>{result.confidence}</p>
                <p className="mt-2 text-gray-700">{result.description}</p>

                {result.heatmap && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Why this prediction? (Grad-CAM explanation)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm">
                      <figure><img src={result.original} alt="Original MRI" className="rounded-md border" /><figcaption className="mt-1">Original MRI</figcaption></figure>
                      <figure><img src={result.heatmap} alt="Heatmap" className="rounded-md border" /><figcaption className="mt-1">Heatmap (red = strongest evidence)</figcaption></figure>
                      <figure><img src={result.circled} alt="Circled region" className="rounded-md border" /><figcaption className="mt-1">Region of interest</figcaption></figure>
                    </div>
                    {result.probabilities && (
                      <div className="mt-4 text-sm">
                        {Object.entries(result.probabilities).map(([k, v]) => (
                          <div key={k} className="flex items-center gap-2 mb-1">
                            <span className="w-32">{k}</span>
                            <div className="flex-1 bg-gray-200 rounded h-2"><div className="bg-blue-600 h-2 rounded" style={{ width: `${v}%` }} /></div>
                            <span className="w-12 text-right">{v}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="mt-3 text-xs text-gray-500">{result.disclaimer}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => navigate("/book-appointment")}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    <CalendarCheck size={18} /> Book Appointment
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2 border border-black rounded-md hover:bg-gray-100 transition"
                  >
                    Print / Save Report
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-5 py-2 border border-black rounded-md hover:bg-gray-100 transition"
                  >
                    Back to Dashboard
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagnosisPage;
