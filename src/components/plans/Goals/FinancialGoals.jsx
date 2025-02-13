import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { saveAs } from "file-saver";
import Papa from "papaparse";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FinancialGoals = () => {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");

  // ✅ Load goals from localStorage
  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem("goals")) || [];
    setGoals(savedGoals);
  }, []);

  // ✅ Save goals to localStorage whenever goals state updates
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("goals", JSON.stringify(goals));
    }
  }, [goals]);

  // ✅ Add Goal
  const addGoal = () => {
    if (!goalName.trim() || !targetAmount.trim()) return;

    const newGoal = {
      goalName: goalName.trim(),
      targetAmount: Number(targetAmount),
      currentSavings: Number(currentSavings) || 0,
    };

    setGoals((prevGoals) => [...prevGoals, newGoal]);
    setGoalName("");
    setTargetAmount("");
    setCurrentSavings("");
  };

  // ✅ Export CSV
  const exportCSV = () => {
    const csv = Papa.unparse(goals);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "financial_goals.csv");
  };

  // ✅ Chart Data
  const data = {
    labels: goals.map((g) => g.goalName),
    datasets: [
      { label: "Current Savings", data: goals.map((g) => g.currentSavings), backgroundColor: "#4ade80" },
      { label: "Target Amount", data: goals.map((g) => g.targetAmount), backgroundColor: "#f43f5e" },
    ],
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 transition-all">
      <h2 className="text-3xl font-bold text-blue-800 dark:text-blue
      -200 text-center mb-6">
        🎯 Financial Goals Tracker
      </h2>

      {/* ✅ Goal Form */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <input
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          type="text"
          placeholder="Goal Name"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
        />
        <input
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          type="number"
          placeholder="Target Amount"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
        <input
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          type="number"
          placeholder="Current Savings"
          value={currentSavings}
          onChange={(e) => setCurrentSavings(e.target.value)}
        />
      </div>

      {/* ✅ Action Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
          onClick={addGoal}
        >
          ➕ Add Goal
        </button>
        <button
          className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
          onClick={exportCSV}
        >
          📁 Download CSV
        </button>
      </div>

      {/* ✅ Bar Chart */}
      {goals.length > 0 ? (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md ">
          <Bar
            data={data}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                tooltip: { enabled: true },
              },
              scales: {
                x: { title: { display: true, text: "Goals" } },
                y: { title: { display: true, text: "Amount (₹)" }, beginAtZero: true },
              },
            }}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No goals added yet.</p>
      )}
    </div>
  );
};

export default FinancialGoals;
