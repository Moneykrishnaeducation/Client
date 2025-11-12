import React from "react";
import { FaWindows, FaApple, FaAndroid, FaMobileAlt } from "react-icons/fa";

const DownloadCards = () => {
  const cards = [
    {
      title: "Windows",
      subtitle: "For Windows PC",
      icon: (
        <FaWindows className="text-5xl text-yellow-400 mb-4 transition-transform duration-300 group-hover:text-yellow-500 group-hover:-translate-y-2 group-hover:drop-shadow-[0_0_10px_white]" />
      ),
      link: "https://download.mql5.com/cdn/web/vtindex.llc/mt5/vtindex5setup.exe", // Replace with actual Windows download link
    },
    {
      title: "Mac",
      subtitle: "For Mac Computer",
      icon: (
        <FaApple className="text-5xl text-yellow-400 mb-4 transition-transform duration-300 group-hover:text-yellow-500 group-hover:-translate-y-2 group-hover:drop-shadow-[0_0_10px_white]" />
      ),
      link: "https://download.mql5.com/cdn/web/metaquotes.ltd/mt5/MetaTrader5.pkg.zip?utm_source=www.metatrader5.com&utm_campaign=download.mt5.macos", // Apple Store Link
    },
    {
      title: "Android",
      subtitle: "For Android Phones",
      icon: (
        <FaAndroid className="text-5xl text-yellow-400 mb-4 transition-transform duration-300 group-hover:text-yellow-500 group-hover:-translate-y-2 group-hover:drop-shadow-[0_0_10px_white]" />
      ),
      link: "https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5&pcampaignid=web_share", // Replace with actual Android download link
    },
    {
      title: "iPhone",
      subtitle: "For iPhones",
      icon: (
        <FaMobileAlt className="text-5xl text-yellow-400 mb-4 transition-transform duration-300 group-hover:text-yellow-500 group-hover:-translate-y-2 group-hover:drop-shadow-[0_0_10px_white]" />
      ),
      link: "https://apps.apple.com/us/app/metatrader-5/id413251709?utm_campaign=install.metaquotes&utm_source=www.metatrader5.com", // iPhone Store Link
    },
  ];

  return (
    <div className="min-h-[90vh] bg-black-900 flex flex-col justify-start items-center py-16 px-6">
      <h2 className="text-3xl font-bold text-center text-white mb-12">
        Download Our App
      </h2>

     <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
  {cards.map((card, index) => (
    <a
      key={index}
      href={card.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-black-800 border border-gray-700 rounded-xl p-8 flex flex-col items-center text-center
                 shadow-md transition-transform duration-300 hover:-translate-y-2"
    >
      {/* Icon without shadow */}
      <div className="mb-4">{card.icon}</div>

      <h3 className="text-xl font-semibold text-white mb-2">
        {card.title}
      </h3>
      <p className="text-gray-400 mb-6">
        {card.subtitle}
      </p>

      {/* Download Button */}
      <button className="px-6 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-all duration-300
                         hover:bg-yellow-400 hover:text-white">
        Download
      </button>
    </a>
  ))}
</div>
</div>
  );
};

export default DownloadCards;
