import React, { useState, useRef, useEffect } from "react";
import NotificationBell from "../Navbar/NotificationBell";
import ProfileMenu from "../Navbar/ProfileMenu";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const profilePicRef = useRef(null);

  // ✅ Close Profile Menu When Clicking Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        profilePicRef.current &&
        !profilePicRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center w-full fixed  left-0 z-40 shadow-md">
      {/* ✅ Logo Section */}
      <div className="text-lg font-semibold cursor-pointer" onClick={() => navigate("/dashboard")}>
        Finance Manager
      </div>

      {/* ✅ Notification & Profile */}
      <div className="flex items-center space-x-6 relative">
        <NotificationBell />
        <div className="relative">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            ref={profilePicRef}
          />
          {isProfileOpen && (
            <div ref={profileMenuRef} className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
              <ProfileMenu setIsProfileOpen={setIsProfileOpen} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
