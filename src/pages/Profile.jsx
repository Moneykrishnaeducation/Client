import React, { useState, useEffect } from "react";
import { API_BASE_URL, apiCall } from "../utils/api";
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
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profileImage, setProfileImage] = useState('');
  const [bannerImage, setBannerImage] = useState(null);

  const [bankDetails, setBankDetails] = useState(null);
  const [cryptoDetails, setCryptoDetails] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [identityStatus, setIdentityStatus] = useState('not_uploaded');
  const [residentialStatus, setResidentialStatus] = useState('not_uploaded');
  const [identityFileName, setIdentityFileName] = useState('');
  const [residentialFileName, setResidentialFileName] = useState('');
  const [identityLoading, setIdentityLoading] = useState(false);
  const [residentialLoading, setResidentialLoading] = useState(false);
  const [identityError, setIdentityError] = useState('');
  const [residentialError, setResidentialError] = useState('');

  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [bankLoading, setBankLoading] = useState(false);
  const [bankError, setBankError] = useState('');
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [cryptoError, setCryptoError] = useState('');

  const inputClass = `w-full p-2 ${isDarkMode ? 'bg-[#1a1a1a] border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-black'} border rounded-md focus:outline-none focus:border-[#FFD700] placeholder-gray-500`;

  const fetchBanner = async () => {
    try {
      const data = await apiCall('api/profile/banner/', {
        method: 'GET'
      });
      if (data && data.banner_url) {
        setBannerImage(data.banner_url);
      } else {
        setBannerImage(null);
      }
    } catch (err) {
      console.error('Error fetching banner:', err);
      setBannerImage(null);
    }
  };

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const data = await apiCall('api/profile/');
        setUser({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          dob: data.dob || '',
          address: data.address || '',
        });
        setProfileImage(data.profile_pic || `${API_BASE_URL}static/client/images/default-profile.jpg`);
        setError(null);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    const fetchBankDetails = async () => {
      try {
        const data = await apiCall('api/profile/bank-details/');
        if (data && Object.keys(data).length > 0) {
          setBankDetails({
            bankName: data.bank_name || '',
            accountNumber: data.account_number || '',
            ifscCode: data.ifsc_code || '',
            branch: data.branch_name || '',
            status: data.status || 'pending',
          });
        } else {
          setBankDetails(null);
        }
      } catch (err) {
        console.error('Error fetching bank details:', err);
        setBankDetails(null);
      }
    };

    const fetchCryptoDetails = async () => {
      try {
        const data = await apiCall('api/profile/crypto-details/');
        if (data && Object.keys(data).length > 0) {
          setCryptoDetails({
            walletId: data.wallet_id || '',
            currency: data.currency || '',
            status: data.status || 'pending',
          });
        } else {
          setCryptoDetails(null);
        }
      } catch (err) {
        console.error('Error fetching crypto details:', err);
        setCryptoDetails(null);
      }
    };

    const fetchDocuments = async () => {
      try {
        const data = await apiCall('api/profile/documents/');
        if (data && data.length > 0) {
          const identityDoc = data.find(doc => doc.document_type === 'identity');
          const residentialDoc = data.find(doc => doc.document_type === 'residence');
          if (identityDoc) {
            setIdentityStatus(identityDoc.status || 'pending');
            setIdentityFileName(identityDoc.document || '');
          }
          if (residentialDoc) {
            setResidentialStatus(residentialDoc.status || 'pending');
            setResidentialFileName(residentialDoc.document || '');
          }
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    };

    fetchUserProfile();
    fetchBanner();
    fetchBankDetails();
    fetchCryptoDetails();
    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto"></div>
          <p className="mt-4 text-[#FFD700]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#FFD700] text-black px-4 py-2 rounded-md font-semibold hover:bg-white transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
    onChange={async (e) => {
      const file = e.target.files[0];
      if (file) {
        // Immediate preview
        const reader = new FileReader();
        reader.onloadend = () => setBannerImage(reader.result);
        reader.readAsDataURL(file);

        // Upload to API
        const formData = new FormData();
        formData.append('banner', file);
        try {
          await apiCall('api/profile/banner/', {
            method: 'POST',
            body: formData,
          });
          // Refetch to ensure persistence
          fetchBanner();
        } catch (err) {
          console.error('Error uploading banner image:', err);
          // Optionally show error to user
        }
        finally {
          e.target.value = ''; // Reset file input 
        }
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
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                // Immediate preview
                const reader = new FileReader();
                reader.onloadend = () => setProfileImage(reader.result);
                reader.readAsDataURL(file);

                // Upload to API
                const formData = new FormData();
                formData.append('profile_pic', file);
                try {
                  await apiCall('api/profile/image/', {
                    method: 'POST',
                    body: formData,
                  });
                  // No refetch needed, preview is already set
                } catch (err) {
                  console.error('Error uploading profile image:', err);
                  // Optionally show error to user
                }
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
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'} text-sm`}>Address: {user.address}</p>
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
    {identityStatus !== 'not_uploaded' ? (
      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>
        <p className="text-[#FFD700] font-semibold">
          Document Uploaded
        </p>
        {identityFileName && <p className="text-sm mt-1">File: {identityFileName.split('/').pop()}</p>}
        <p className="text-sm mt-1">Status: Pending</p>
        {identityError && <p className="text-red-500 text-sm mt-1">{identityError}</p>}
      </div>
    ) : (
      <label className={`cursor-pointer px-4 py-2 rounded-md font-semibold ${identityLoading ? 'bg-gray-500 cursor-not-allowed' : (isDarkMode ? 'bg-gray-700 text-white hover:bg-[#FFD700] hover:text-black' : 'bg-gray-200 text-black hover:bg-[#FFD700]')} transition-colors duration-300`}>
        {identityLoading ? 'Uploading...' : (
          <>
            <FileUp size={18} className="inline mr-2" />
            Upload Document
          </>
        )}
        <input
          type="file"
          accept="image/*,.pdf"
          hidden
          disabled={identityLoading}
          onChange={async (e) => {
            const file = e.target.files[0];
            if (file) {
              setIdentityLoading(true);
              setIdentityError('');
              const formData = new FormData();
              formData.append('document', file);
              try {
                await apiCall('documents/identity/', {
                  method: 'POST',
                  body: formData,
                });
                // Refetch documents to update status
                const data = await apiCall('api/profile/documents/');
                if (data && data.length > 0) {
                  const identityDoc = data.find(doc => doc.document_type === 'identity');
                  if (identityDoc) {
                    setIdentityStatus(identityDoc.status || 'pending');
                  }
                }
              } catch (err) {
                console.error('Error uploading identity document:', err);
                let errorMsg = 'Failed to upload document';
                try {
                  const parsed = JSON.parse(err.message);
                  if (parsed.error) {
                    errorMsg = parsed.error;
                  }
                } catch {
                  errorMsg = err.message || 'Failed to upload document';
                }
                setIdentityError(errorMsg);
              } finally {
                setIdentityLoading(false);
              }
            }
          }}
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
    {residentialStatus !== 'not_uploaded' ? (
      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>
        <p className="text-[#FFD700] font-semibold">
          Document Uploaded
        </p>
        {residentialFileName && <p className="text-sm mt-1">File: {residentialFileName.split('/').pop()}</p>}
        <p className="text-sm mt-1">Status: Pending</p>
        {residentialError && <p className="text-red-500 text-sm mt-1">{residentialError}</p>}
      </div>
    ) : (
      <label className={`cursor-pointer px-4 py-2 rounded-md font-semibold ${residentialLoading ? 'bg-gray-500 cursor-not-allowed' : (isDarkMode ? 'bg-gray-700 text-white hover:bg-[#FFD700] hover:text-black' : 'bg-gray-200 text-black hover:bg-[#FFD700]')} transition-colors duration-300`}>
        {residentialLoading ? 'Uploading...' : (
          <>
            <FileUp size={18} className="inline mr-2" />
            Upload Document
          </>
        )}
        <input
          type="file"
          accept="image/*,.pdf"
          hidden
          disabled={residentialLoading}
          onChange={async (e) => {
            const file = e.target.files[0];
            if (file) {
              setResidentialLoading(true);
              setResidentialError('');
              const formData = new FormData();
              formData.append('document', file);
              try {
                await apiCall('documents/residence/', {
                  method: 'POST',
                  body: formData,
                });
                // Refetch documents to update status
                const data = await apiCall('api/profile/documents/');
                if (data && data.length > 0) {
                  const residentialDoc = data.find(doc => doc.document_type === 'residence');
                  if (residentialDoc) {
                    setResidentialStatus(residentialDoc.status || 'pending');
                  }
                }
              } catch (err) {
                console.error('Error uploading residential document:', err);
                let errorMsg = 'Failed to upload document';
                try {
                  const parsed = JSON.parse(err.message);
                  if (parsed.error) {
                    errorMsg = parsed.error;
                  }
                } catch {
                  errorMsg = err.message || 'Failed to upload document';
                }
                setResidentialError(errorMsg);
              } finally {
                setResidentialLoading(false);
              }
            }
          }}
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
        {bankError && <p className="text-red-500 text-sm">{bankError}</p>}
        <button
          onClick={async () => {
            const bankName = document.getElementById("bankName").value.trim();
            const accountNumber = document.getElementById("accountNumber").value.trim();
            const ifscCode = document.getElementById("ifscCode").value.trim();
            const branch = document.getElementById("branch").value.trim();

            if (!bankName || !accountNumber || !ifscCode || !branch) {
              setBankError('All fields are required.');
              return;
            }

            setBankLoading(true);
            setBankError('');

            try {
              await apiCall('api/profile/bank-details/', {
                method: 'POST',
                body: JSON.stringify({
                  bank_name: bankName,
                  account_number: accountNumber,
                  ifsc_code: ifscCode,
                  branch_name: branch,
                })
              });

              // Refresh bank details after successful save
              const updatedData = await apiCall('api/profile/bank-details/');
              if (updatedData && Object.keys(updatedData).length > 0) {
                setBankDetails({
                  bankName: updatedData.bank_name || '',
                  accountNumber: updatedData.account_number || '',
                  ifscCode: updatedData.ifsc_code || '',
                  branch: updatedData.branch_name || '',
                  status: updatedData.status || 'pending',
                });
              }

              setShowBankModal(false);
            } catch (err) {
              console.error('Error saving bank details:', err);
              setBankError(err.message || 'Failed to save bank details');
            } finally {
              setBankLoading(false);
            }
          }}
          disabled={bankLoading}
          className={`mt-4 w-full py-2 rounded-md font-semibold ${bankLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#FFD700] text-black hover:bg-white'} transition-colors duration-300`}
        >
          {bankLoading ? 'Saving...' : 'Save Details'}
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
        {cryptoError && <p className="text-red-500 text-sm">{cryptoError}</p>}
        <button
          onClick={async () => {
            const walletId = document.getElementById("walletId").value.trim();
            const currency = document.getElementById("currency").value.trim();

            if (!walletId || !currency) {
              setCryptoError('Both fields are required.');
              return;
            }

            setCryptoLoading(true);
            setCryptoError('');

            try {
              await apiCall('api/profile/crypto-details/', {
                method: 'POST',
                body: JSON.stringify({
                  wallet_address: walletId,
                  currency: currency,
                })
              });

              // Refresh crypto details after successful save
              const updatedData = await apiCall('api/profile/crypto-details/');
              if (updatedData && Object.keys(updatedData).length > 0) {
                setCryptoDetails({
                  walletId: updatedData.wallet_id || '',
                  currency: updatedData.currency || '',
                  status: updatedData.status || 'pending',
                });
              }

              setShowCryptoModal(false);
            } catch (err) {
              console.error('Error saving crypto details:', err);
              setCryptoError(err.message || 'Failed to save crypto details');
            } finally {
              setCryptoLoading(false);
            }
          }}
          disabled={cryptoLoading}
          className={`mt-4 w-full py-2 rounded-md font-semibold ${cryptoLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#FFD700] text-black hover:bg-white'} transition-colors duration-300`}
        >
          {cryptoLoading ? 'Saving...' : 'Save Details'}
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
                disabled
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
              <input
                type="text"
                placeholder="Address"
                defaultValue={user.address}
                className={inputClass}
                id="editAddress"
              />
              {editError && <p className="text-red-500 text-sm">{editError}</p>}
              <button
                onClick={async () => {
                  const phone = document.getElementById("editPhone").value;
                  const dob = document.getElementById("editDob").value;
                  const address = document.getElementById("editAddress").value;

                  if (!phone && !dob && !address) {
                    setEditError('At least one field (phone, dob, address) is required.');
                    return;
                  }

                  setEditLoading(true);
                  setEditError('');

                  try {
                    await apiCall('profile/edit/', {
                      method: 'POST',
                      body: JSON.stringify({
                        phone: phone,
                        dob: dob,
                        address: address
                      })
                    });
                    setShowEditModal(false);
                  } catch (err) {
                    console.error('Error submitting change request:', err);
                    if (err.message && err.message.includes('unique_pending_request_per_user')) {
                      setEditError('You already have a pending change request. Please wait for it to be processed before submitting another one.');
                    } else if (err.message === 'You already have a pending personal info change request') {
                      setEditError('You already have a pending personal info change request');
                    } else {
                      setEditError(err.message || 'Failed to submit change request');
                    }
                    setEditLoading(false);
                  }
                }}
                disabled={editLoading}
                className={`mt-4 w-full py-2 rounded-md font-semibold ${editLoading ? 'bg-gray-500 cursor-not-allowed' : (isDarkMode ? 'bg-gray-700 text-white hover:bg-[#FFD700] hover:text-black' : 'bg-gray-200 text-black hover:bg-[#FFD700]')} transition-colors duration-300`}
              >
                {editLoading ? 'Submitting...' : 'Submit Change Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
