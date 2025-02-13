import React, { useState, useEffect } from "react";

const TotalSum = () => {
  const [totals, setTotals] = useState({ income: 0, expense: 0, budget: 0, goal: 0 });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchTotals = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure token exists
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:5000/api/transactions/totals", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setTotals(data);
      checkFinancialStatus(data);
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };

  useEffect(() => {
    fetchTotals();
    const interval = setInterval(fetchTotals, 10000); // Auto refresh every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const checkFinancialStatus = (data) => {
    let newNotifications = [];

    if (data.income < data.expense) {
      newNotifications.push("⚠️ Warning: Your expenses exceed your income!");
    }
    if (data.expense > data.budget) {
      newNotifications.push("🚨 Alert: Your expenses exceed your budget!");
    }
    if (data.goal > data.budget) {
      newNotifications.push("🔔 Reminder: Your goal amount is greater than your budget!");
    }

    setNotifications(newNotifications);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Profile Settings</h2>

      {/* Notification Bell */}
      <div className="relative inline-block">
        <button 
          className="p-2 bg-gray-200 rounded-full relative" 
          onClick={() => setShowNotifications(!showNotifications)}
        >
          🔔
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {showNotifications && notifications.length > 0 && (
          <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-2 z-10">
            {notifications.map((note, index) => (
              <div key={index} className="text-red-600 text-sm p-2 border-b">
                {note}
              </div>
            ))}
            <button
              className="mt-2 w-full bg-red-500 text-white p-2 rounded-md"
              onClick={clearNotifications}
            >
              Clear Notifications
            </button>
          </div>
        )}
      </div>

      {/* Display Totals */}
      <div className="bg-gray-100 p-4 rounded-md mt-4">
        <h3 className="text-xl font-bold">Financial Summary</h3>
        <p>Income: <strong>${totals.income}</strong></p>
        <p>Expense: <strong>${totals.expense}</strong></p>
        <p>Budget: <strong>${totals.budget}</strong></p>
        <p>Goal: <strong>${totals.goal}</strong></p>
      </div>
    </div>
  );
};

export default TotalSum;
