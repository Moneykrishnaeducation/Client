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
  Image as ImageIcon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ProfilePage = () => {
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    dob: "1998-06-15",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const [bankDetails, setBankDetails] = useState(null);
  const [cryptoDetails, setCryptoDetails] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [identityFile, setIdentityFile] = useState(null);
  const [residentialFile, setResidentialFile] = useState(null);

  const inputClass = `w-full p-2 ${isDarkMode ? 'bg-[#1a1a1a] border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-black'} border rounded-md focus:outline-none focus:border-[#FFD700] placeholder-gray-500`;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} pb-20`}>
      {/*  Banner Section */}
      <div className={`relative w-full h-56 md:h-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-b-2xl flex items-center justify-center overflow-hidden`}>
  {bannerImage ? (
    <img
      src={bannerImage}
      alt="Banner Preview"
      className="w-full h-full object-cover"
    />
  ) : (
    <div className={`flex flex-col items-center ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
      <ImageIcon size={48} />
      <p className="text-sm">No Banner Uploaded</p>
    </div>
  )}

  <button
    onClick={() => document.getElementById("bannerUpload").click()}
    className={`absolute top-3 right-3 ${isDarkMode ? 'bg-[#111] text-white border border-gray-700' : 'bg-white text-black border border-gray-300'} p-2 rounded-full hover:bg-[#FFD700] hover:text-black transition`}
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
        reader.onloadend = () => setBannerImage(reader.result); // preview immediately
        reader.readAsDataURL(file);
      }
    }}
  />
</div>

      {/*  Profile Info */}
      <div className="relative flex flex-col items-center -mt-16 px-4">
        <div
          className={`relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#FFD700] shadow-lg cursor-pointer ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
          onClick={() => document.getElementById("profileUpload").click()}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`flex items-center justify-center h-full ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
            className={`absolute bottom-1 right-1 p-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-white hover:bg-[#FFD700] hover:text-black' : 'bg-gray-200 text-black hover:bg-[#FFD700]'} transition-colors duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            <Camera size={16} />
          </button>
        </div>

        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold text-[#FFD700]">{user.name}</h2>
            <button
              onClick={() => setShowEditModal(true)}
              className={`p-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-white hover:bg-[#FFD700] hover:text-black' : 'bg-gray-200 text-black hover:bg-[#FFD700]'} transition-colors duration-300`}
            >
              <Pencil size={16} />
            </button>
          </div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user.email}</p>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.phone}</p>
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'} text-sm`}>DOB: {user.dob}</p>
        </div>
      </div>


      {/*  Identity &  Residential Verification */}
      <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {/* Identity Verification */}
       <div className={`relative p-6 ${isDarkMode ? 'bg-[#111]' : 'bg-white'} rounded-xl border border-[#FFD700] hover:border-[#FFD700] transition-all duration-300`}>
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-[#FFD700] flex items-center gap-2 text-lg font-semibold">
      <IdCard size={20} /> Identity Verification
    </h3>
    <div className="relative group">
      <Info
        size={20}
        className="text-[#FFD700] cursor-pointer hover:text-white"
      />
      <span className={`absolute right-0 top-6 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-300' : 'bg-gray-100 text-gray-700'} px-3 py-1 rounded-md border border-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity w-52`}>
        Upload government ID proof (Aadhar, Passport, or Driver’s License)
      </span>
    </div>
  </div>
  <div className="flex flex-col items-center justify-center">
    {identityFile ? (
      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>
        <p className="text-[#FFD700] font-semibold">
          File Uploaded: {identityFile.name}
        </p>
        <p className="text-sm mt-1">Status: Verified</p>
      </div>
    ) : (
      <label className={`cursor-pointer px-4 py-2 rounded-md font-semibold ${isDarkMode ? 'bg-gray-700 text-white hover:bg-[#FFD700] hover:text-black' : 'bg-gray-200 text-black hover:bg-[#FFD700]'} transition-colors duration-300`}>
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
        <div className={`relative p-6 ${isDarkMode ? 'bg-[#111]' : 'bg-white'} rounded-xl border border-[#FFD700] hover:border-[#FFD700] transition-all duration-300`}>
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-[#FFD700] flex items-center gap-2 text-lg font-semibold">
      <Home size={20} /> Residential Verification
    </h3>
    <div className="relative group">
      <Info
        size={20}
        className="text-[#FFD700] cursor-pointer hover:text-white"
      />
      <span className={`absolute right-0 top-6 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-300' : 'bg-gray-100 text-gray-700'} px-3 py-1 rounded-md border border-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity w-52`}>
        Upload address proof (Electricity Bill, Rent Agreement, or Bank Statement)
      </span>
    </div>
  </div>
  <div className="flex flex-col items-center justify-center">
    {residentialFile ? (
      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>
        <p className="text-[#FFD700] font-semibold">
          File Uploaded: {residentialFile.name}
        </p>
        <p className="text-sm mt-1">Status: Verified</p>
      </div>
    ) : (
      <label className={`cursor-pointer px-4 py-2 rounded-md font-semibold ${isDarkMode ? 'bg-gray-700 text-white hover:bg-[#FFD700] hover:text-black' : 'bg-gray-200 text-black hover:bg-[#FFD700]'} transition-colors duration-300`}>
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

      {/*  Bank & Crypto Section */}
      <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {/* Bank Verification */}
        <div className={`p-6 ${isDarkMode ? 'bg-[#111]' : 'bg-white'} rounded-xl border border-[#FFD700] hover:border-[#FFD700] transition-all duration-300`}>
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-[#FFD700] flex items-center gap-2 text-lg font-semibold">
      <University size={20} /> Bank Verification
    </h3>
    <button
      onClick={() => setShowBankModal(true)}
      className={`px-4 py-1 rounded-md font-semibold ${isDarkMode ? 'bg-gray-700 text-white hover:bg-[#FFD700] hover:text-black' : 'bg-gray-200 text-black hover:bg-[#FFD700]'} transition-colors duration-300`}
    >
      {bankDetails ? "Edit" : "Add Details"}
    </button>
  </div>
  {bankDetails ? (
    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1`}>
      <p><strong>Bank Name:</strong> {bankDetails.bankName}</p>
      <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
      <p><strong>IFSC Code:</strong> {bankDetails.ifscCode}</p>
      <p><strong>Branch:</strong> {bankDetails.branch}</p>
      <p><strong>Status:</strong> {bankDetails.status}</p>
    </div>
  ) : (
    <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'} italic`}>No bank details added yet.</p>
  )}
</div>


        {/* Crypto Verification */}
        <div className={`p-6 ${isDarkMode ? 'bg-[#111]' : 'bg-white'} rounded-xl border border-[#FFD700] hover:border-[#FFD700] transition-all duration-300`}>
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-[#FFD700] flex items-center gap-2 text-lg font-semibold">
      <Bitcoin size={20} /> Crypto Verification
    </h3>
    <button
      onClick={() => setShowCryptoModal(true)}
      className={`px-4 py-1 rounded-md font-semibold ${isDarkMode ? 'bg-gray-700 text-white hover:bg-[#FFD700] hover:text-black' : 'bg-gray-200 text-black hover:bg-[#FFD700]'} transition-colors duration-300`}
    >
      {cryptoDetails ? "Edit" : "Add Details"}
    </button>
  </div>
  {cryptoDetails ? (
    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1`}>
      <p><strong>Wallet ID:</strong> {cryptoDetails.walletId}</p>
      <p><strong>Currency:</strong> {cryptoDetails.currency}</p>
      <p><strong>Status:</strong> {cryptoDetails.status}</p>
    </div>
  ) : (
    <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'} italic`}>No crypto details added yet.</p>
  )}
</div>
      </div>

      {/*  Bank Modal */}
      {showBankModal && (
  <div className={`fixed inset-0 ${isDarkMode ? 'bg-black/70' : 'bg-gray-900/70'} flex items-center justify-center z-50`}>
    <div
      className={`${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6 rounded-xl border border-[#FFD700] w-full max-w-md relative hover:border-[#FFD700] transition-all duration-300`}
    >
      <button
        onClick={() => setShowBankModal(false)}
        className="absolute top-3 right-3 text-[#FFD700] hover:text-white"
      >
        <X size={20} />
      </button>
      <h3 className="text-[#FFD700] text-lg font-semibold mb-4">
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
          className="mt-4 w-full bg-[#FFD700] text-black py-2 rounded-md font-semibold hover:bg-white transition-colors duration-300"
        >
          Save Details
        </button>
      </div>
    </div>
  </div>
)}


      {/*  Crypto Modal */}
      {showCryptoModal && (
  <div className={`fixed inset-0 ${isDarkMode ? 'bg-black/70' : 'bg-gray-900/70'} flex items-center justify-center z-50`}>
    <div className={`${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6 rounded-xl border border-[#FFD700] w-full max-w-md relative hover:border-[#FFD700] transition-all duration-300`}>
      <button
        onClick={() => setShowCryptoModal(false)}
        className="absolute top-3 right-3 text-[#FFD700] hover:text-white"
      >
        <X size={20} />
      </button>
      <h3 className="text-[#FFD700] text-lg font-semibold mb-4">
        {cryptoDetails ? "Edit Crypto Details" : "Add Crypto Details"}
      </h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Crypto Wallet ID"
          defaultValue={cryptoDetails?.walletId || ""}
          className={inputClass}
          id="walletId"
        />
        <input
          type="text"
          placeholder="Currency (e.g., BTC, USDT)"
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
          className="mt-4 w-full bg-[#FFD700] text-black py-2 rounded-md font-semibold hover:bg-white transition-colors duration-300"
        >
          Save Details
        </button>
      </div>
    </div>
  </div>
)}


      {/* Edit Personal Info Modal */}
      {showEditModal && (
        <div className={`fixed inset-0 ${isDarkMode ? 'bg-black/70' : 'bg-gray-900/70'} flex items-center justify-center z-50`}>
          <div className={`${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6 rounded-xl border border-[#FFD700] w-full max-w-md relative`}>
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-[#FFD700] hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-[#FFD700] text-lg font-semibold mb-4">
              Edit Personal Information
            </h3>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                defaultValue={user.email}
                className={inputClass}
                id="editEmail"
              />
              <input
                type="text"
                placeholder="Phone Number"
                defaultValue={user.phone}
                className={inputClass}
                id="editPhone"
              />
              <input
                type="date"
                placeholder="Date of Birth"
                defaultValue={user.dob}
                className={inputClass}
                id="editDob"
              />
              <button
                onClick={() => {
                  setUser({
                    ...user,
                    email: document.getElementById("editEmail").value,
                    phone: document.getElementById("editPhone").value,
                    dob: document.getElementById("editDob").value,
                  });
                  setShowEditModal(false);
                }}
                className={`mt-4 w-full py-2 rounded-md font-semibold ${isDarkMode ? 'bg-gray-700 text-white hover:bg-[#FFD700] hover:text-black' : 'bg-gray-200 text-black hover:bg-[#FFD700]'} transition-colors duration-300`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
