import React, { useState } from "react";
import api from "../../../services/api";

const BudgetForm = ({ setBudgets }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/budgets", { category, amount });
      if (response.status === 201) {
        alert("Budget recorded successfully!");
        setCategory("");
        setAmount("");
        setError("");

        // ✅ Fetch updated budgets after adding
        const updatedBudgets = await api.get("/api/budgets");
        setBudgets(updatedBudgets.data);
      }
    } catch (err) {
      console.error("Error Budget Recording:", err);
      setError("Error recording budget");
    }
  };

  return (
    <section className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-2">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-8">Budget Form</h2>
        <input
          type="text"
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full border border-gray-300 p-3 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          value={amount}
          required
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full border border-gray-300 p-3 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
          Add Budget
        </button>
      </form>
    </section>
  );
};

export default BudgetForm;
