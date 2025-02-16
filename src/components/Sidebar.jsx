import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMoneyBillWave, FaClipboardList, FaWallet, FaBullseye, FaChartPie, FaFileExport } from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginState = () => setIsLoggedIn(!!localStorage.getItem("authToken"));

    checkLoginState();
    window.addEventListener("storage", checkLoginState);
    return () => window.removeEventListener("storage", checkLoginState);
  }, []);

  if (!isLoggedIn) return null;

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4 fixed top-18 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul className="space-y-2">
        <li>
          <button onClick={() => toggleSection("budget")} className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded">
            <span className="flex items-center gap-2">
              <FaMoneyBillWave /> Budget
            </span>
            <span>{openSections.budget ? "▲" : "▼"}</span>
          </button>
          {openSections.budget && (
            <ul className="pl-6 space-y-1">
              <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => navigate("/budget/form")}>Form</li>
              <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => navigate("/budget/list")}>List</li>
              <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => navigate("/budget/chart")}>Chart</li>
              <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => navigate("/budget/export")}>Export Data</li>
            </ul>
          )}
        </li>

        {/* Expense Section */}
        <li>
          <button onClick={() => toggleSection("expense")} className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded">
            <span className="flex items-center gap-2">
              <FaClipboardList /> Expense
            </span>
            <span>{openSections.expense ? "▲" : "▼"}</span>
          </button>
          {openSections.expense && (
            <ul className="pl-6 space-y-1">
              <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => navigate("/expense/recording")}>Expense Form</li>
              <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => navigate("/expense/list")}>List</li>
              <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => navigate("/expense/chart")}>Chart</li>
              <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => navigate("/expense/recurring")}>Recurring</li>
              <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => navigate("/expense/recurring-list")}>Recurring List</li>
            </ul>
          )}
        </li>

        {/* Goals Section */}
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer flex items-center gap-2" onClick={() => navigate("/goals")}>
          <FaBullseye /> Goals
        </li>

        {/* Income Section */}
        <li>
          <button onClick={() => toggleSection("income")} className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded">
            <span className="flex items-center gap-2">
              <FaWallet /> Income
            </span>
            <span>{openSections.income ? "▲" : "▼"}</span>
          </button>
          {openSections.income && (
            <ul className="pl-6 space-y-1">
              <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => navigate("/income/form")}>Form</li>
              <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => navigate("/income/list")}>List</li>
              <li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => navigate("/income/report")}>Report</li>
            </ul>
          )}
        </li>

        {/* Financial Reports Section */}
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer flex items-center gap-2" onClick={() => navigate("/financialReports")}>
          <FaChartPie /> All Reports
        </li>

        {/* Due Bill List Section */}
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer flex items-center gap-2" onClick={() => navigate("/due-bill-list")}>
          <FaFileExport /> Due Bill List
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

