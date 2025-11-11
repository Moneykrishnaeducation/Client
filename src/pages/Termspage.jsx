import React from "react";

const TermsPage = () => {
  return (
    <div className="w-full px-4 md:px-0"> {/* padding for small screens */}
      {/* Content wrapper with reduced width and centered */}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gold mb-12 text-center animate-pulse">
          Terms & Conditions
        </h1>

        <div className="space-y-8">
          {[
            { title: "Introduction", content: "Welcome to our website..." },
            { title: "User Responsibilities", content: "Users must behave responsibly..." },
            { title: "Privacy Policy", content: "Your privacy matters..." },
            { title: "Limitation of Liability", content: "We are not liable..." }
          ].map((section, idx) => (
            <div
              key={idx}
              className="bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-2 border-transparent hover:border-gold"
            >
              <h2 className="text-2xl font-bold text-gold mb-4 hover:underline hover:underline-offset-4 transition-all duration-300">
                {section.title}
              </h2>
              <p className="text-gray-300">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
