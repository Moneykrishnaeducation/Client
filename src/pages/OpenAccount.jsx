import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // adjust path if needed
import { useTheme } from "../context/ThemeContext";
import { ModalWrapper } from "./Dashboard";
import { apiCall } from "../utils/api";

function OpenAccount({ onClose }) {
  const { isDarkMode } = useTheme();
  const generatePassword = (length = 8) => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*_+?";

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to randomize order
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
  };

  const [formData, setFormData] = useState({
    accountName: "",
    leverage: "50",
    group: "",
    masterPassword: generatePassword(),
    investorPassword: generatePassword(),
  });
  const [showMasterPwd, setShowMasterPwd] = useState(false);
  const [showInvestorPwd, setShowInvestorPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leverages, setLeverages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchOptions = async () => {
      // try {
      //   // Fetch user info
      //   const userData = await apiCall('user-info/');
      //   setUserInfo(userData || {});

      //   // Fetch groups
      //   const groupData = await apiCall('api/trading-groups/?type=real');
      //   setGroups(groupData.groups || []);
      // } catch (error) {
      //   console.error('Failed to fetch options:', error);
      //   // Fallback to static data
      //   setGroups(["Standard", "Pro", "ECN", "VIP"]);
      // }
      setGroups(["Standard", "Pro", "ECN", "VIP"]);
      // Always set static leverages
      setLeverages([1, 2, 5, 10, 20, 50, 100, 200]);
    };

    fetchOptions();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accountData = {
        accountName: formData.accountName,
        masterPassword: formData.masterPassword,
        investorPassword: formData.investorPassword,
        leverage: formData.leverage,
        group: formData.group,
        accountType: 'real'
      };

      const data = await apiCall('create-trading-account/', 'POST', accountData);

      if (data.success) {
        alert(`✅ Account created successfully!\nAccount ID: ${data.account.account_id}\nMaster Password: ${data.account.master_password}\nInvestor Password: ${data.account.investor_password}\n\n📧 An email with your login details has been sent.`);
        onClose();
        // Refresh accounts list after successful creation
        if (window.refreshAccounts) {
          window.refreshAccounts();
        }
      } else {
        throw new Error(data.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      alert(`❌ Failed to create account: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper title="Create New Trading Account" onClose={onClose} isDarkMode={isDarkMode}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Account Name */}
        <div>
          <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="text-red-500">*</span> Account Name
          </label>
          <input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            required
            placeholder="Enter account name"
            className={`w-full p-3 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} border border-[#FFD700] rounded-md focus:ring-2 focus:ring-[#FFD700]`}
          />
        </div>

        {/* Leverage */}
        <div>
          <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="text-red-500">*</span> Leverage
          </label>
          <select
            name="leverage"
            value={formData.leverage}
            onChange={handleChange}
            required
            className={`w-full p-3 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} border border-[#FFD700] rounded-md focus:ring-2 focus:ring-[#FFD700]`}
          >
            <option value="">Select leverage</option>
            {leverages.map((lev, idx) => (
              <option key={idx} value={lev}>
                {lev}x
              </option>
            ))}
          </select>
        </div>

        {/* Group */}
        <div>
          <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="text-red-500">*</span> Group
          </label>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            required
            className={`w-full p-3 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} border border-[#FFD700] rounded-md focus:ring-2 focus:ring-[#FFD700]`}
          >
            <option value="">Select group</option>
            {groups.map((grp, idx) => (
              <option key={grp.id || idx} value={grp.name}>
                {grp.alias || grp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Master Password */}
        <div>
          <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="text-red-500">*</span> Master Password
          </label>
          <div className="relative">
            <input
              type={showMasterPwd ? "text" : "password"}
              name="masterPassword"
              value={formData.masterPassword}
              onChange={handleChange}
              placeholder="Auto-generated secure password"
              required
              minLength={8}
              className={`w-full p-3 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} border border-[#FFD700] rounded-md pr-10 focus:ring-2 focus:ring-[#FFD700]`}
            />
            <button
              type="button"
              onClick={() => setShowMasterPwd(!showMasterPwd)}
              className="absolute right-3 top-3 text-[#FFD700] hover:text-white"
              title={showMasterPwd ? "Hide password" : "Show password"}
            >
              {showMasterPwd ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            The master password allows full control of the trading account.
            Must be at least 8 characters and contain Abcd@123.
          </p>
        </div>

        {/* Investor Password */}
        <div>
          <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="text-red-500">*</span> Investor Password
          </label>
          <div className="relative">
            <input
              type={showInvestorPwd ? "text" : "password"}
              name="investorPassword"
              value={formData.investorPassword}
              onChange={handleChange}
              placeholder="Auto-generated secure password"
              required
              minLength={8}
              className={`w-full p-3 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} border border-[#FFD700] rounded-md pr-10 focus:ring-2 focus:ring-[#FFD700]`}
            />
            <button
              type="button"
              onClick={() => setShowInvestorPwd(!showInvestorPwd)}
              className="absolute right-3 top-3 text-[#FFD700] hover:text-white"
              title={showInvestorPwd ? "Hide password" : "Show password"}
            >
              {showInvestorPwd ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            The investor password allows read-only access.
            Must be at least 8 characters and contain Abcd@123.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FFD700] text-black font-semibold py-3 rounded-md hover:bg-white transition-all flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} />
              Creating Account...
            </>
          ) : (
            "Create Live Account"
          )}
        </button>
      </form>
    </ModalWrapper>
  );
}

export default OpenAccount