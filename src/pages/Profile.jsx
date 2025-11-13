import React, { useState } from "react";
import {
  Camera,
  User,
  Pencil,
  University,
  Bitcoin,
  X,
  FileUp,
  Info,
  Home,
  IdCard,
} from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80"
  );

  // 🔹 Bank & Crypto States
  const [bankDetails, setBankDetails] = useState(null);
  const [cryptoDetails, setCryptoDetails] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);

  // 🔹 Identity & Residential Verification States
  const [identityFile, setIdentityFile] = useState(null);
  const [residentialFile, setResidentialFile] = useState(null);

  const inputClass =
    "w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-yellow-400 placeholder-gray-500";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 🔶 Banner Section */}
      <div className="relative w-full h-56 md:h-64">
        <img
          src={bannerImage}
          alt="Banner"
          className="w-full h-full object-cover rounded-b-2xl"
        />
        <button
          onClick={() => document.getElementById("bannerUpload").click()}
          className="absolute top-3 right-3 bg-yellow-400 text-black p-2 rounded-full hover:bg-yellow-500 transition"
        >
          <Pencil size={18} />
        </button>
        <input
          type="file"
          id="bannerUpload"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setBannerImage(reader.result);
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>

      {/* 👤 Profile Info */}
      <div className="relative flex flex-col items-center -mt-16 px-4">
        <div
          className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg cursor-pointer bg-gray-800"
          onClick={() => document.getElementById("profileUpload").click()}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <User size={48} />
            </div>
          )}
          <input
            type="file"
            id="profileUpload"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setProfileImage(reader.result);
                reader.readAsDataURL(file);
              }
            }}
          />
          <button
            className="absolute bottom-1 right-1 bg-yellow-400 text-black p-1 rounded-full hover:bg-yellow-500"
            onClick={(e) => e.stopPropagation()}
          >
            <Camera size={16} />
          </button>
        </div>

        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold text-yellow-400">{user.name}</h2>
            <button className="bg-yellow-400 text-black p-1 rounded-full hover:bg-yellow-500">
              <Pencil size={16} />
            </button>
          </div>
          <p className="text-gray-300">{user.email}</p>
          <p className="text-gray-400">{user.phone}</p>
        </div>
      </div>

      {/* 📊 Account Summary */}
      <div className="max-w-3xl mx-auto mt-10 grid grid-cols-3 gap-4 text-center px-4">
        {[
          { label: "Live Account", value: "2" },
          { label: "Demo Account", value: "4" },
          { label: "IB Status", value: "Pending" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-lg border border-gray-700 py-5 hover:border-yellow-400 hover:scale-105 transition-transform"
          >
            <p className="text-2xl font-semibold text-yellow-400">
              {item.value}
            </p>
            <p className="text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* 🪪 Identity & 🏠 Residential Verification */}
      <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {/* Identity Verification */}
        <div className="relative p-6 bg-gray-900 rounded-xl border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-yellow-400 flex items-center gap-2 text-lg font-semibold">
              <IdCard size={20} /> Identity Verification
            </h3>
            <div className="relative group">
              <Info
                size={20}
                className="text-yellow-400 cursor-pointer hover:text-yellow-500"
              />
              <span className="absolute right-0 top-6 bg-gray-800 text-sm text-gray-300 px-3 py-1 rounded-md border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity w-52">
                Upload government ID proof (Aadhar, Passport, or Driver’s License)
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            {identityFile ? (
              <div className="text-gray-300 text-center">
                <p className="text-yellow-400 font-semibold">
                  File Uploaded: {identityFile.name}
                </p>
                <p className="text-sm mt-1">Status: Verified</p>
              </div>
            ) : (
              <label className="cursor-pointer bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-500">
                <FileUp size={18} className="inline mr-2" />
                Upload ID Proof
                <input
                  type="file"
                  accept="image/*,.pdf"
                  hidden
                  onChange={(e) => setIdentityFile(e.target.files[0])}
                />
              </label>
            )}
          </div>
        </div>

        {/* Residential Verification */}
        <div className="relative p-6 bg-gray-900 rounded-xl border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-yellow-400 flex items-center gap-2 text-lg font-semibold">
              <Home size={20} /> Residential Verification
            </h3>
            <div className="relative group">
              <Info
                size={20}
                className="text-yellow-400 cursor-pointer hover:text-yellow-500"
              />
              <span className="absolute right-0 top-6 bg-gray-800 text-sm text-gray-300 px-3 py-1 rounded-md border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity w-52">
                Upload address proof (Electricity Bill, Rent Agreement, or Bank Statement)
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            {residentialFile ? (
              <div className="text-gray-300 text-center">
                <p className="text-yellow-400 font-semibold">
                  File Uploaded: {residentialFile.name}
                </p>
                <p className="text-sm mt-1">Status: Verified</p>
              </div>
            ) : (
              <label className="cursor-pointer bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-500">
                <FileUp size={18} className="inline mr-2" />
                Upload Address Proof
                <input
                  type="file"
                  accept="image/*,.pdf"
                  hidden
                  onChange={(e) => setResidentialFile(e.target.files[0])}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* 🏦 Bank & Crypto Section */}
      <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {/* 🏦 Bank Verification */}
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-yellow-400 flex items-center gap-2 text-lg font-semibold">
              <University size={20} /> Bank Verification
            </h3>
            <button
              onClick={() => setShowBankModal(true)}
              className="bg-yellow-400 text-black px-4 py-1 rounded-md font-semibold hover:bg-yellow-500"
            >
              {bankDetails ? "Edit Details" : "Add Details"}
            </button>
          </div>

          {bankDetails ? (
            <div className="text-gray-300 space-y-1">
              <p><strong>Bank Name:</strong> {bankDetails.bankName}</p>
              <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
              <p><strong>IFSC Code:</strong> {bankDetails.ifscCode}</p>
              <p><strong>Branch:</strong> {bankDetails.branch}</p>
              <p><strong>Status:</strong> {bankDetails.status}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No bank details added yet.</p>
          )}
        </div>

        {/* 💰 Crypto Verification */}
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-yellow-400 flex items-center gap-2 text-lg font-semibold">
              <Bitcoin size={20} /> Crypto Verification
            </h3>
            <button
              onClick={() => setShowCryptoModal(true)}
              className="bg-yellow-400 text-black px-4 py-1 rounded-md font-semibold hover:bg-yellow-500"
            >
              {cryptoDetails ? "Edit Details" : "Add Details"}
            </button>
          </div>

          {cryptoDetails ? (
            <div className="text-gray-300 space-y-1">
              <p><strong>Wallet ID:</strong> {cryptoDetails.walletId}</p>
              <p><strong>Currency:</strong> {cryptoDetails.currency}</p>
              <p><strong>Status:</strong> {cryptoDetails.status}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No crypto details added yet.</p>
          )}
        </div>
      </div>

      {/* 🏦 Bank Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 w-full max-w-md relative">
            <button
              onClick={() => setShowBankModal(false)}
              className="absolute top-3 right-3 text-yellow-400 hover:text-yellow-500"
            >
              <X size={20} />
            </button>
            <h3 className="text-yellow-400 text-lg font-semibold mb-4">
              {bankDetails ? "Edit Bank Details" : "Add Bank Details"}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Bank Name"
                defaultValue={bankDetails?.bankName || ""}
                className={inputClass}
                id="bankName"
              />
              <input
                type="text"
                placeholder="Account Number"
                defaultValue={bankDetails?.accountNumber || ""}
                className={inputClass}
                id="accountNumber"
              />
              <input
                type="text"
                placeholder="IFSC Code"
                defaultValue={bankDetails?.ifscCode || ""}
                className={inputClass}
                id="ifscCode"
              />
              <input
                type="text"
                placeholder="Branch"
                defaultValue={bankDetails?.branch || ""}
                className={inputClass}
                id="branch"
              />
              <button
                onClick={() => {
                  const newDetails = {
                    bankName: document.getElementById("bankName").value,
                    accountNumber: document.getElementById("accountNumber").value,
                    ifscCode: document.getElementById("ifscCode").value,
                    branch: document.getElementById("branch").value,
                    status: "Verified",
                  };
                  setBankDetails(newDetails);
                  setShowBankModal(false);
                }}
                className="mt-4 w-full bg-yellow-400 text-black py-2 rounded-md font-semibold hover:bg-yellow-500"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💰 Crypto Modal */}
      {showCryptoModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 w-full max-w-md relative">
            <button
              onClick={() => setShowCryptoModal(false)}
              className="absolute top-3 right-3 text-yellow-400 hover:text-yellow-500"
            >
              <X size={20} />
            </button>
            <h3 className="text-yellow-400 text-lg font-semibold mb-4">
              {cryptoDetails ? "Edit Crypto Details" : "Add Crypto Details"}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Wallet ID"
                defaultValue={cryptoDetails?.walletId || ""}
                className={inputClass}
                id="walletId"
              />
              <input
                type="text"
                placeholder="Currency (e.g. USDT, BTC)"
                defaultValue={cryptoDetails?.currency || ""}
                className={inputClass}
                id="currency"
              />
              <button
                onClick={() => {
                  const newDetails = {
                    walletId: document.getElementById("walletId").value,
                    currency: document.getElementById("currency").value,
                    status: "Verified",
                  };
                  setCryptoDetails(newDetails);
                  setShowCryptoModal(false);
                }}
                className="mt-4 w-full bg-yellow-400 text-black py-2 rounded-md font-semibold hover:bg-yellow-500"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
