import React from "react";

function HeroSection() {
  return (
    <section id="home" className="relative text-center py-28 px-6">
      {/* Small Badge */}
      <div className="inline-block px-4 py-2 border rounded-full text-sm text-gray-700 shadow-sm mb-6 bg-white/80 backdrop-blur-md">
        World’s Most Adopted Healthcare AI
      </div>

      {/* Heading */}
      <h1 className="text-5xl md:text-6xl font-bold leading-tight">
        Revolutionizing <br />
        <span className="text-black">
          Heal<span className="text-blue-600">thc</span>are with AI
        </span>
      </h1>

      {/* Short description */}
      <p className="mt-8 text-lg text-black-700 max-w-2xl mx-auto">
        CureIt.AI brings the future of healthcare today. Our AI solutions help
        doctors and patients make faster, smarter, and more reliable healthcare
        decisions.
      </p>
    </section>
  );
}

export default HeroSection;
