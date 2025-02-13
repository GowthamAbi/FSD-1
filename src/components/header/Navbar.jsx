import React, { useState, useEffect, useRef } from 'react';
import NotificationBell from "../Navbar/NotificationBell"; // Use the NotificationBell
import ProfileMenu from "../Navbar/ProfileMenu";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null); 
  const profilePicRef = useRef(null);

  // ✅ Toggle Profile Menu
  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev);
  };

  // ✅ Navigate to Home
  const goHome = () => {
    navigate('/home');
  };

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      {/* ✅ Logo Section */}
      <div className="text-lg font-semibold cursor-pointer" onClick={goHome} aria-label="Go to Home">
        Finance Manager
      </div>

      {/* ✅ Fix Notification Bell Positioning */}
<div className="flex items-center space-x-6 relative">
  <NotificationBell /> {/* ✅ Ensure NotificationBell is inside this flex container */}
  
  <div className="relative">
    <img
      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      alt="Profile"
      className="w-8 h-8 rounded-full cursor-pointer"
      onClick={handleProfileClick}
      ref={profilePicRef}
      aria-label="Open Profile Menu"
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
