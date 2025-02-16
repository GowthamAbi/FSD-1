import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import api from "../../../services/api";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FinancialGoals = () => {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch goals from API
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await api.get("/api/goals");
        setGoals(response.data);
      } catch (err) {
        setError("Failed to load goals");
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  // ✅ Add Goal
  const addGoal = async () => {
    if (!goalName.trim() || !targetAmount.trim()) return;

    const newGoal = {
      goalName: goalName.trim(),
      targetAmount: Number(targetAmount),
      currentSavings: Number(currentSavings) || 0,
    };

    try {
      const response = await api.post("/api/goals", newGoal);
      setGoals([...goals, response.data]);
      setGoalName("");
      setTargetAmount("");
      setCurrentSavings("");
    } catch (err) {
      setError("Failed to add goal");
    }
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
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-xl rounded-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-800 text-center mb-6">🎯 Financial Goals Tracker</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading ? (
        <p className="text-center text-gray-500">Loading goals...</p>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <input className="w-full md:w-1/3 px-4 py-2 border rounded-lg" type="text" placeholder="Goal Name" value={goalName} onChange={(e) => setGoalName(e.target.value)} />
            <input className="w-full md:w-1/3 px-4 py-2 border rounded-lg" type="number" placeholder="Target Amount" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
            <input className="w-full md:w-1/3 px-4 py-2 border rounded-lg" type="number" placeholder="Current Savings" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} />
          </div>
          <div className="flex justify-center gap-4 mb-6">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg" onClick={addGoal}>➕ Add Goal</button>
            <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg" onClick={exportCSV}>📁 Download CSV</button>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <Bar data={data} options={{ responsive: true, plugins: { legend: { position: "top" }, tooltip: { enabled: true } }, scales: { x: { title: { display: true, text: "Goals" } }, y: { title: { display: true, text: "Amount (₹)" }, beginAtZero: true } } }} />
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialGoals;
