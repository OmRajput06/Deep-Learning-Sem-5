import React, { useState } from "react";

function ForgotPassword({ goBack }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative px-6"
      style={{
        backgroundImage: "url('assets/doct.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* GLASS CARD */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-xl border border-white/20 text-white">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
            <input
              type="email"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4 bg-white/20 backdrop-blur-sm placeholder-white text-white"
            />
            <button
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
              onClick={() => setStep(2)}
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4 bg-white/20 backdrop-blur-sm placeholder-white text-white"
            />
            <button
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
              onClick={() => setStep(3)}
            >
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Set New Password</h2>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white/20 backdrop-blur-sm placeholder-white text-white"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 cursor-pointer text-gray-200"
              >
                👁
              </span>
            </div>

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4 bg-white/20 backdrop-blur-sm placeholder-white text-white"
            />

            <button
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
              onClick={() => {
                if (newPassword === confirmNewPassword) {
                  alert("Password changed! Please login.");
                  goBack();
                } else {
                  alert("Passwords do not match!");
                }
              }}
            >
              Reset Password
            </button>
          </>
        )}

        <p
          className="mt-4 text-sm text-blue-300 cursor-pointer text-center hover:underline"
          onClick={goBack}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
