import React from "react";

function Footer() {
  return (
    <footer className="text-center py-6 bg-white/80 backdrop-blur-md">
      <p className="text-gray-700">&copy; {new Date().getFullYear()} CureIt.AI. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
