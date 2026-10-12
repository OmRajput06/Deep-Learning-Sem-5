import React from "react";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-6 bg-white/90 backdrop-blur-md shadow-sm border-b border-black sticky top-0 z-50">
      {/* Logo */}
      <h1 onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-2xl font-bold cursor-pointer">CureIt.AI</h1>

      {/* Nav Links */}
      <div className="hidden md:flex space-x-10 font-medium">
        <a href="#home" className="hover:text-blue-600">Home</a>
        <a href="#about" className="hover:text-blue-600">About</a>
        <a href="#tech" className="hover:text-blue-600">Technology</a>
        <a href="#services" className="hover:text-blue-600">Services</a>
      </div>

      {/* Get Started Button */}
      <button
        onClick={() => window.open("/auth", "_blank")}
        className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
      >
        Get Started
      </button>
    </nav>
  );
}

export default Navbar;
