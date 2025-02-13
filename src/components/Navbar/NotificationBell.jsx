import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import api from "../../services/api";

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const notificationRef = useRef();

    // ✅ Fetch financial data
    const fetchTotals = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.warn("⚠️ No token found, user may not be authenticated.");
                return;
            }

            console.log("🔍 Fetching transactions...");
            const response = await api.get("/api/transactions", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ API Response:", response.data);
            checkFinancialStatus(response.data);
        } catch (error) {
            console.error("❌ Error fetching totals:", error.response ? error.response.data : error.message);

            // ✅ Handle unauthorized token
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login"; // Redirect to login
            }
        }
    };

    // ✅ Runs once when component mounts
    useEffect(() => {
        fetchTotals();

        // ✅ Event listener to close notifications when clicking outside
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Process financial status and create notifications
    const checkFinancialStatus = (data) => {
        if (!data || typeof data !== "object") {
            console.warn("⚠️ Unexpected API response format:", data);
            return;
        }

        let newNotifications = [];

        if (data?.income !== undefined && data?.expense !== undefined && data.income < data.expense) {
            newNotifications.push("Warning: Your expenses are higher than your income!");
        }
        if (data?.expense !== undefined && data?.budget !== undefined && data.expense > data.budget) {
            newNotifications.push("Alert: Your expenses exceed your budget!");
        }
        if (data?.goal !== undefined && data?.budget !== undefined && data.goal > data.budget) {
            newNotifications.push("Reminder: Your goal amount is greater than your budget!");
        }

        setNotifications(newNotifications);
    };

    // ✅ Clear notifications
    const clearNotifications = () => {
        setNotifications([]);
        setShowDropdown(false);
    };

    return (
        <div className="relative" ref={notificationRef}>
            {/* ✅ Notification Bell Button */}
            <button className="p-2 bg-gray-200 rounded-full relative" onClick={() => setShowDropdown(!showDropdown)}>
                🔔
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* ✅ Fix Positioning of Notification Dropdown */}
            {showDropdown && notifications.length > 0 && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-2 z-50">
                    {notifications.map((note, index) => (
                        <div key={index} className="text-red-600 text-sm p-2 border-b">
                            {note}
                        </div>
                    ))}
                    <button className="mt-2 w-full bg-red-500 text-white p-2 rounded-md" onClick={clearNotifications}>
                        Clear Notifications
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
