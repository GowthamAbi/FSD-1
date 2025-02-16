import { useEffect, useState } from "react";
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
  const [preview, setPreview] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const response = await api.get("/api/auth/account-summary", { withCredentials: true });

        if (isMounted && response.data) {
          const formattedDob = response.data.dob
            ? new Date(response.data.dob).toLocaleDateString("en-GB")
            : "";

          setUser((prevUser) => ({
            ...prevUser,
            ...response.data,
            dob: formattedDob,
            newPassword: "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const response = await api.post("/api/auth/profile-pic", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser({ ...user, profilePic: response.data.profilePic });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedUser = { ...user };

      if (updatedUser.dob) {
        const [day, month, year] = updatedUser.dob.split("/");
        updatedUser.dob = `${year}-${month}-${day}`;
      }

      if (!updatedUser.newPassword) delete updatedUser.newPassword;

      await api.put("/api/auth/profile", updatedUser, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Account Summary</h2>

      <div className="flex flex-col items-center mb-4">
        <label htmlFor="profilePic">
          <img
            src={preview || user.profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover cursor-pointer"
          />
        </label>
        <input type="file" id="profilePic" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
        <p className="text-sm text-gray-600 mt-2">Click to change profile picture</p>
      </div>

      <form onSubmit={handleSubmit}>
        {["name", "phone", "dob", "address", "officeName"].map((field) => (
          <div key={field} className="mb-3">
            <label className="block text-sm font-medium capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={field === "dob" ? "text" : "text"}
              name={field}
              value={user[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <div className="mb-3">
          <label className="block text-sm font-medium">Email (Cannot be changed)</label>
          <input type="email" name="email" value={user.email} disabled className="w-full p-2 border rounded bg-gray-200" />
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
