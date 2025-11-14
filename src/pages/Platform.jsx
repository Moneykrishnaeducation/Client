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
      link: "https://download.mql5.com/cdn/web/vtindex.llc/mt5/vtindex5setup.exe",
    },
    {
      title: "Mac",
      subtitle: "For Mac Computer",
      icon: (
        <FaApple className="text-5xl text-yellow-400 mb-4 transition-transform duration-300 group-hover:text-yellow-500 group-hover:-translate-y-2 group-hover:drop-shadow-[0_0_10px_white]" />
      ),
      link: "https://download.mql5.com/cdn/web/metaquotes.ltd/mt5/MetaTrader5.pkg.zip?utm_source=www.metatrader5.com&utm_campaign=download.mt5.macos",
    },
    {
      title: "Android",
      subtitle: "For Android Phones",
      icon: (
        <FaAndroid className="text-5xl text-yellow-400 mb-4 transition-transform duration-300 group-hover:text-yellow-500 group-hover:-translate-y-2 group-hover:drop-shadow-[0_0_10px_white]" />
      ),
      link: "https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5&pcampaignid=web_share",
    },
    {
      title: "iPhone",
      subtitle: "For iPhones",
      icon: (
        <FaMobileAlt className="text-5xl text-yellow-400 mb-4 transition-transform duration-300 group-hover:text-yellow-500 group-hover:-translate-y-2 group-hover:drop-shadow-[0_0_10px_white]" />
      ),
      link: "https://apps.apple.com/us/app/metatrader-5/id413251709?utm_campaign=install.metaquotes&utm_source=www.metatrader5.com",
    },
  ];

  return (
    <div className="min-h-[90vh] bg-black-900 flex flex-col justify-start items-center pt-8 pb-16 px-6">

      
      {/* Styled Heading */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-center 
               bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 
               bg-clip-text text-transparent animate-pulse 
               drop-shadow-[0_0_15px_#FFD700] mb-12">
  Download Our App
</h2>

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full mx-auto">
        {cards.map((card, index) => (
          <a
            key={index}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-black-800 border border-gray-700 rounded-xl p-8 flex flex-col items-center text-center
                       shadow-md transition-transform duration-300 hover:-translate-y-2
                       w-full sm:w-[260px] md:w-[280px] lg:w-[260px]"
          >
            {/* Icon */}
            <div className="mb-4">{card.icon}</div>

            <h3 className="text-xl font-semibold text-white mb-2">
              {card.title}
            </h3>
            <p className="text-gray-400 mb-6">{card.subtitle}</p>

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
