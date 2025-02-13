import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import api from "../../services/api";

const COLORS = ["#4CAF50", "#F44336", "#2196F3", "#FF9800"];

const Dashboard = () => {
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("authToken");
  
    if (!token) {
      console.warn("No token found. Retrying in 1 second...");
      
      setTimeout(() => {
        token = localStorage.getItem("authToken");
  
        if (!token) {
          console.error("No token after retry. Redirecting...");
         window.location.href = "/login";
        } else {
          console.log("Token retrieved after retry:", token);
          fetchTotals(token);
        }
      }, 1000);
    } else {
      console.log("Token found:", token);
      fetchTotals(token);
    }
  }, []);
  

  const fetchTotals = async (token) => {
    try {
      console.log("Fetching Dashboard Data...");
      const response = await api.get("/api/transactions/total", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = response.data; // Axios response data
      setTotals(data);
      checkFinancialStatus(data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized. Redirecting to login...");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      } else {
        console.error("Error fetching totals:", error);
        setError(error.message);
      }
      setLoading(false);
    }
  };
  

  const checkFinancialStatus = (data) => {
    let newNotifications = [];
    if (data.income < data.expense) newNotifications.push("⚠️ Warning: Your expenses exceed your income!");
    if (data.expense > data.budget) newNotifications.push("🚨 Alert: Your expenses exceed your budget!");
    if (data.goal > data.budget) newNotifications.push("🔔 Reminder: Your goal amount is greater than your budget!");
    setNotifications(newNotifications);
  };

  const financialData = totals
    ? [
        { name: "Income", value: totals.income },
        { name: "Expense", value: totals.expense },
        { name: "Budget", value: totals.budget },
        { name: "Goal", value: totals.goal },
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Financial Dashboard</h2>
      {error && <p className="text-red-500">❌ {error}</p>}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <>
          {/* Notification Bell */}
          <div className="relative flex justify-end mb-4">
            <button
              className="p-3 bg-gray-200 rounded-full relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotifications && notifications.length > 0 && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-3 z-10">
                {notifications.map((note, index) => (
                  <div key={index} className="text-red-600 text-sm p-2 border-b">
                    {note}
                  </div>
                ))}
                <button
                  className="mt-2 w-full bg-red-500 text-white p-2 rounded-md"
                  onClick={() => setNotifications([])}
                >
                  Clear Notifications
                </button>
              </div>
            )}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-100 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-2">Financial Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={financialData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {financialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-2">Expense vs Budget</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-100 p-6 rounded-lg mt-6 shadow">
            <h3 className="text-xl font-bold">Financial Summary</h3>
            {totals && (
              <>
                <p className="text-gray-700">
                  Income: <strong className="text-green-600">${totals.income}</strong>
                </p>
                <p className="text-gray-700">
                  Expense: <strong className="text-red-600">${totals.expense}</strong>
                </p>
                <p className="text-gray-700">
                  Budget: <strong className="text-blue-600">${totals.budget}</strong>
                </p>
                <p className="text-gray-700">
                  Goal: <strong className="text-orange-600">${totals.goal}</strong>
                </p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
