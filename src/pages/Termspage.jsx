import React, { useState } from "react";
import {
  LineChart,
  TrendingUp,
  Scale,
  Layers,
  Globe2,
  Bitcoin,
  Diamond,
  DollarSign,
  Flame,
  Briefcase,
  FileText,
  Star,
} from "lucide-react";

const TermsPage = () => {
  const [activeTab, setActiveTab] = useState("benefits");

  const benefits = [
    {
      title: "Fixed Leverage",
      content:
        "Enjoy the flexibility of trading with fixed leverage, offering better control over your trades.",
      icon: <Scale className="w-10 h-10 text-yellow-400" />,
    },
    {
      title: "High Leverage",
      content:
        "Access high leverage to maximize your trading potential and opportunities.",
      icon: <TrendingUp className="w-10 h-10 text-yellow-400" />,
    },
    {
      title: "Competitive Spreads",
      content:
        "Trade with tight and competitive spreads to minimize your trading costs.",
      icon: <LineChart className="w-10 h-10 text-yellow-400" />,
    },
    {
      title: "Multiple Scripts",
      content:
        "Expand your portfolio with access to multiple trading scripts across markets.",
      icon: <Layers className="w-10 h-10 text-yellow-400" />,
    },
    {
      title: "Indices",
      content:
        "Trade leading indices from around the world and diversify your investments.",
      icon: <Globe2 className="w-10 h-10 text-yellow-400" />,
    },
    {
      title: "Cryptos",
      content:
        "Explore cryptocurrency trading with a wide range of digital assets available.",
      icon: <Bitcoin className="w-10 h-10 text-yellow-400" />,
    },
    {
      title: "Metals",
      content:
        "Invest in precious metals like gold and silver for long-term value retention.",
      icon: <Diamond className="w-10 h-10 text-yellow-400" />,
    },
    {
      title: "Currencies",
      content:
        "Trade a variety of currency pairs with low spreads and deep liquidity.",
      icon: <DollarSign className="w-10 h-10 text-yellow-400" />,
    },
    {
      title: "Energies",
      content:
        "Get access to global energy markets including oil and natural gas.",
      icon: <Flame className="w-10 h-10 text-yellow-400" />,
    },
    {
      title: "Trade All Assets",
      content:
        "A unified platform to trade indices, cryptos, metals, currencies, and more seamlessly.",
      icon: <Briefcase className="w-10 h-10 text-yellow-400" />,
    },
  ];

  const policies = [
    {
      title: "Introduction",
      content:
        "Welcome to VTIndex! By accessing or using our services, you agree to comply with and be bound by the following terms and conditions.",
    },
    {
      title: "User Responsibilities",
      content: (
        <ul className="list-disc list-inside space-y-1">
          <li>Ensure the accuracy of your personal information.</li>
          <li>Use our services ethically and responsibly.</li>
          <li>Abide by local, national, and international laws.</li>
        </ul>
      ),
    },
    {
      title: "Prohibited Activities",
      content: (
        <ul className="list-disc list-inside space-y-1">
          <li>Hacking, spamming, or distributing malware.</li>
          <li>Using the platform for fraudulent activities.</li>
          <li>Violating intellectual property rights.</li>
        </ul>
      ),
    },
    {
      title: "Risk Warning",
      content:
        "Trading leveraged products, including Forex and CFDs, carries a significant level of risk to your capital and may not be appropriate for all investors.",
    },
    {
      title: "Disclaimer",
      content:
        "An investment in derivatives may mean investors may lose an amount even greater than their original investment. Please seek financial or professional advice before investing.",
    },
    {
      title: "Restricted Regions",
      content:
        "VTIndex does not provide services for citizens/residents of certain regions. The services are not intended for distribution where it would be contrary to local law.",
    },
    {
      title: "AML Policy",
      content:
        "VTIndex follows strict Anti-Money Laundering (AML) regulations. All customers must verify their identity and comply with legal requirements to prevent financial crimes.",
    },
    {
      title: "Contact Us",
      content: (
        <div>
          <p>Email: <span className="text-yellow-400">support@vtindex.com</span></p>
          <p className="mt-2">
            <strong>Registered Address:</strong> Suite #1705, Festival Tower, Dubai Festival City, Dubai, UAE
          </p>
          <p>
            <strong>Operational Address:</strong> Suite #1705, Festival Tower, Dubai Festival City, Dubai, UAE
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-black min-h-screen text-white px-6 py-12">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_15px_#FFD700] mb-12">
        VTIndex — Empower Your Trading
      </h1>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setActiveTab("benefits")}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-lg font-semibold border transition-all duration-300 ${
            activeTab === "benefits"
              ? "bg-yellow-500 text-black border-yellow-400 shadow-[0_0_20px_#FFD700]"
              : "border-yellow-400 text-yellow-400 hover:bg-yellow-600 hover:text-black"
          }`}
        >
          <Star className="w-5 h-5" /> Benefits
        </button>
        <button
          onClick={() => setActiveTab("policies")}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-lg font-semibold border transition-all duration-300 ${
            activeTab === "policies"
              ? "bg-yellow-500 text-black border-yellow-400 shadow-[0_0_20px_#FFD700]"
              : "border-yellow-400 text-yellow-400 hover:bg-yellow-600 hover:text-black"
          }`}
        >
          <FileText className="w-5 h-5" /> Policies
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto transition-all duration-700">
        {activeTab === "benefits" ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((item, i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-xl border border-yellow-500/40 shadow-[0_0_10px_#FFD70040] hover:shadow-[0_0_25px_#FFD700] transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-3">
                  {item.icon}
                  <h3 className="text-xl font-bold text-yellow-400">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-300">{item.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {policies.map((policy, i) => (
              <div
                key={i}
                className="bg-gray-900 p-6 rounded-xl border border-yellow-500/40 hover:border-yellow-500 hover:shadow-[0_0_25px_#FFD700] transition-all duration-500"
              >
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                  {policy.title}
                </h3>
                <div className="text-gray-300 text-sm">{policy.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsPage;
