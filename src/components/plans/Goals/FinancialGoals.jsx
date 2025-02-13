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

  // Load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem("goals")) || [];
    setGoals(savedGoals);
  }, []);

  // Save goals to localStorage whenever goals state updates
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("goals", JSON.stringify(goals));
    }
  }, [goals]);

  const addGoal = () => {
    if (!goalName.trim() || !targetAmount.trim()) return;
    
    const newGoal = {
      goalName: goalName.trim(),
      targetAmount: Number(targetAmount),
      currentSavings: Number(currentSavings) || 0,
    };

    setGoals(prevGoals => [...prevGoals, newGoal]);
    setGoalName("");
    setTargetAmount("");
    setCurrentSavings("");
  };

  const exportCSV = () => {
    const csv = Papa.unparse(goals);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "financial_goals.csv");
  };

  const data = {
    labels: goals.map(g => g.goalName),
    datasets: [
      { label: "Current Savings", data: goals.map(g => g.currentSavings), backgroundColor: "#4ade80" },
      { label: "Target Amount", data: goals.map(g => g.targetAmount), backgroundColor: "#f43f5e" }
    ]
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800">Financial Goals Tracker</h2>
      <div className="my-4">
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="Goal Name"
          value={goalName}
          onChange={e => setGoalName(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          type="number"
          placeholder="Target Amount"
          value={targetAmount}
          onChange={e => setTargetAmount(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          type="number"
          placeholder="Current Savings"
          value={currentSavings}
          onChange={e => setCurrentSavings(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addGoal}>
          Add Goal
        </button>
      </div>
      <Bar data={data} />
      <div className="mt-4 flex space-x-2">
        <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={exportCSV}>
          Download CSV
        </button>
      </div>
    </div>
  );
};

export default FinancialGoals;
