import React, { useState, useEffect } from "react";
import axios from "axios";

const countryCodes = [
  { code: "+91", name: "India" },
  { code: "+1", name: "USA" },
  { code: "+44", name: "UK" },
];

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    username: "",
    age: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({});
  const [errors, setErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const user = localStorage.getItem("username");

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchProfile();
    console.log(user)
    
  }, []);

  const fetchProfile = async () => {
        
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login");
        navigate("/");
        return;
      }
    try {
      const res = await axios.get("http://localhost:5000/user/profile", getAuthConfig());
      const fullPhone = res.data.phone || "";
      let countryCode = "+91";
      let phone = fullPhone;
      const matchedCode = countryCodes.find((c) => fullPhone.startsWith(c.code));
      if (matchedCode) {
        countryCode = matchedCode.code;
        phone = fullPhone.slice(countryCode.length);
      }
      setProfile({ ...res.data, phone, countryCode });
      setTempProfile({ ...res.data, phone, countryCode });
    } catch (err) {
      console.error("Error fetching profile:", err);
      alert("Failed to fetch profile. Please login again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile({ ...tempProfile, [name]: value });
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!tempProfile.name.trim()) newErrors.name = "Name is required";
    if (!tempProfile.email.trim()) newErrors.email = "Email is required";
    else if (!tempProfile.email.endsWith("@gmail.com"))
      newErrors.email = "Email must be a valid @gmail.com address";

    if (!tempProfile.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{6,15}$/.test(tempProfile.phone))
      newErrors.phone = "Phone number must be 6-15 digits";

    if (!tempProfile.username.trim()) newErrors.username = "Username is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    try {
      const res = await axios.patch(
        "http://localhost:5000/user/update/profile",
        { ...tempProfile, phone: tempProfile.countryCode + tempProfile.phone },
        getAuthConfig()
      );
      if (res.status === 200) {
        setProfile(tempProfile);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
    setErrors({});
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      alert(
        "Password must be at least 6 characters and include 1 uppercase and 1 lowercase letter"
      );
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match!");
      return false;
    }
    return true;
  };

  const handleSavePassword = async () => {
    if (!validatePassword()) return;

    try {
      const res = await axios.patch(
        "http://localhost:5000/user/change-password",
        passwordData,
        getAuthConfig()
      );
      if (res.status === 200) {
        alert("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordChange(false);
      }
    } catch (err) {
      console.error("Error changing password:", err);
      alert("Failed to change password. Make sure your current password is correct.");
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md transition-transform hover:scale-[1.02] duration-300">
        <h2 className="text-3xl font-bold text-sky-600 mb-6 text-center">My Profile</h2>

        {/* Profile Fields */}
        <div className="space-y-4">
          {/* Name & Email */}
          {["name", "email", "username"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-semibold mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={tempProfile[field]}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${
                  isEditing
                    ? "border-sky-400 focus:ring-2 focus:ring-sky-400"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
                readOnly={!isEditing}
              />
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}

          {/* Phone with country code */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Phone</label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={tempProfile.countryCode}
                onChange={handleChange}
                className="px-3 py-2 border rounded-xl"
                disabled={!isEditing}
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="phone"
                value={tempProfile.phone}
                onChange={handleChange}
                className={`flex-1 px-4 py-2 border rounded-xl ${
                  isEditing ? "border-sky-400 focus:ring-2 focus:ring-sky-400" : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
                readOnly={!isEditing}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Age</label>
            <input
              type="text"
              value={profile.age}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-xl cursor-not-allowed"
            />
          </div>
        </div>

        {/* Profile Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveProfile}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
              >
                 Cancel
              </button>
            </>
          )}
        </div>

        {/* Change Password Section */}
        <div className="mt-8">
          {!showPasswordChange ? (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
            >
              🔑 Change Password
            </button>
          ) : (
            <div className="space-y-4 mt-4">
              {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {field === "currentPassword"
                      ? "Current Password"
                      : field === "newPassword"
                      ? "New Password"
                      : "Confirm Password"}
                  </label>
                  <input
                    type="password"
                    name={field}
                    value={passwordData[field]}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  />
                </div>
              ))}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleSavePassword}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
                >
                  💾 Save
                </button>
                <button
                  onClick={() => setShowPasswordChange(false)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;