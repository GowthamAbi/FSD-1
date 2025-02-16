import React, { useState, useEffect } from "react";
import api from "../../services/api";

const AccountSummary = () => {
  const [user, setUser] = useState({
    profilePic: "",
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    officeName: "",
    newPassword: "",
  });

  useEffect(() => {
    let isMounted = true; // Prevents unwanted updates in Strict Mode

    const fetchUser = async () => {
      try {
        const response = await api.get("/api/auth/account-summary", { withCredentials: true });

        console.log("Fetched User Data:", response.data); // Debugging log

        if (isMounted && response.data) {
          setUser((prevUser) => ({
            ...prevUser,
            ...response.data, // Merge API data correctly
            newPassword: "",  // Clear password field
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();

    return () => {
      isMounted = false; // Cleanup function to prevent setting state on unmounted component
    };
  }, []);

  const handleChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePic", file);

      try {
        const response = await api.post("/api/auth/profile-pic", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });

        setUser((prevUser) => ({
          ...prevUser,
          profilePic: response.data.profilePic, // Ensure API sends back updated profilePic
        }));
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = { ...user };
      if (!updatedUser.newPassword) delete updatedUser.newPassword; // Exclude empty password field

      await api.put("/api/auth/profile", updatedUser, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Account Summary</h2>

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-4">
        <label htmlFor="profilePic">
          <img
            src={user.profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover cursor-pointer"
          />
        </label>
        <input type="file" id="profilePic" className="hidden" onChange={handleProfilePicChange} />
        <p className="text-sm text-gray-600 mt-2">Click to change profile picture</p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-sm font-medium">Name</label>
          <input type="text" name="name" value={user.name} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Email (Cannot be changed)</label>
          <input type="email" name="email" value={user.email} disabled className="w-full p-2 border rounded bg-gray-200" />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Phone</label>
          <input type="text" name="phone" value={user.phone} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Date of Birth</label>
          <input type="date" name="dob" value={user.dob} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Address</label>
          <input type="text" name="address" value={user.address} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Office Name</label>
          <input type="text" name="officeName" value={user.officeName} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Change Password</label>
          <input type="password" name="newPassword" placeholder="New Password" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AccountSummary;
