import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import API from "../api"; // axios instance → baseURL = http://localhost:5000/api

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // register fields
  const [name, setName] = useState("");
  const [license, setLicense] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // ---------------- LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // Save token + doctor details
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("doctor", JSON.stringify(res.data.doctor));

      alert("Login Successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  // ---------------- REGISTER ----------------
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const payload = {
        name,
        email,
        password,
        phone,
        license_number: license,
        photo_url: null,       // optional fields
        signature_url: null,   // optional fields
      };

      const res = await API.post("/auth/register", payload);

      if (res?.data?.message === "Registered successfully") {
        alert("Registered successfully! Please login.");
        setIsLogin(true);
      } else {
        alert("Registration failed. " + JSON.stringify(res.data));
      }

    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  // ---------- FORGOT PASSWORD SCREEN ----------
  if (showForgot) {
    return (
      <div
        className="min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('assets/doct.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div onClick={() => (window.location.href = "/")} className="absolute top-6 left-8 text-3xl font-bold z-50 text-white cursor-pointer">
          CureIt.AI
        </div>

        <div className="relative flex items-center justify-center min-h-screen px-6 z-10">
          <ForgotPassword goBack={() => setShowForgot(false)} />
        </div>
      </div>
    );
  }

  // ---------- AUTH UI ----------
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('assets/doct.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div onClick={() => (window.location.href = "/")} className="absolute top-6 left-8 text-3xl font-bold z-50 text-white cursor-pointer">
        CureIt.AI
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-6 z-10">
        <div className="w-full max-w-md bg-white/10 p-8 rounded-lg shadow-lg backdrop-blur-sm text-white">

          <h2 className="text-3xl font-bold mb-6 text-center">
            {isLogin ? "Login" : "Register"}
          </h2>

          {/* ---------------- LOGIN FORM ---------------- */}
          {isLogin ? (
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-white">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-black"
                />
              </div>

              <div>
                <label className="block text-white">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-black"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 cursor-pointer text-gray-300"
                  >
                    👁
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
              >
                Login
              </button>

              <p
                className="text-sm text-blue-400 cursor-pointer mt-2 text-center"
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </p>
            </form>
          ) : (
            // ---------------- REGISTER FORM ----------------
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-white">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-black"
                />
              </div>

              <div>
                <label className="block text-white">License Number</label>
                <input
                  type="text"
                  required
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-black"
                />
              </div>

              <div>
                <label className="block text-white">Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-black"
                />
              </div>

              <div>
                <label className="block text-white">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-black"
                />
              </div>

              <div>
                <label className="block text-white">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-black"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 cursor-pointer text-gray-300"
                  >
                    👁
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-white">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-black"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
              >
                Register
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 ml-1 cursor-pointer"
            >
              {isLogin ? "Register" : "Login"}
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default AuthPage;
