import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import InfoSection from "./components/InfoSection";
import Footer from "./components/Footer";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import DiagnosisPage from "./components/DiagnosisPage"; // 👈 new page
import BookAppointment from "./components/BookAppointment";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./utils/session";

function RequireAuth({ children }) {
  return isLoggedIn() ? children : <Navigate to="/auth" replace />;
}

function App() {
  return (
    <Routes>
      {/* 🏠 Landing Page */}
      <Route
        path="/"
        element={
          <div
            className="font-sora text-black min-h-screen relative"
            style={{
              backgroundImage: "url('assets/cells2.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Global Overlay */}
            <div className="absolute inset-0 bg-white/35"></div>

            {/* Content */}
            <div className="relative z-10">
              <Navbar />
              <HeroSection />
              <InfoSection />
              <Footer />
            </div>
          </div>
        }
      />

      {/* 🔐 Authentication Page */}
      <Route path="/auth" element={<AuthPage />} />

      {/* 🧾 Doctor Dashboard */}
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

      {/* 🧠 Diagnosis Page */}
      <Route path="/diagnosis" element={<RequireAuth><DiagnosisPage /></RequireAuth>} />

      {/* 📅 Book Appointment */}
      <Route path="/book-appointment" element={<RequireAuth><BookAppointment /></RequireAuth>} />
    </Routes>
  );
}

export default App;
