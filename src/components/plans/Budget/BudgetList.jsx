import React, { useState, useEffect } from 'react';
import api from '../../../services/api'; // API handler

const BudgetList = () => {
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState('');

 // ✅ Add this function
 const fetchBudgets = async () => {
  try {
    let token = localStorage.getItem("authToken");

    if (!token) {
      console.warn("⚠️ No authentication token found. Redirecting to login...");
      window.location.href = "/login"; // Redirect only if token is missing
      return;
    }

    // Ensure "Bearer " is prefixed correctly
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const response = await api.get("/api/budgets", {
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    setBudgets(response.data);
  } catch (error) {
    console.error("❌ Error fetching budgets:", error.response ? error.response.data : error.message);

    // 🔹 Handle token expiration (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn("⚠️ Token expired. Redirecting to login...");
      localStorage.removeItem("authToken"); // Remove expired token
      window.location.href = "/login"; // Redirect to login
    }

    setError("Failed to fetch budgets");
  }
};


// ✅ Now, update useEffect to call fetchBudgets
useEffect(() => {
  fetchBudgets();
}, []);



  // 🛑 Handle Budget Deletion
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/budgets/${id}`); // Backend API call
      setBudgets(budgets.filter((budget) => budget._id !== id)); // Remove from UI
    } catch (err) {
      console.error('❌ Error deleting budget:', err);
      setError('Failed to delete budget');
    }
  };

  return (
    <section className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 max-w-4xl">
      <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Budget List</h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {budgets.length > 0 ? (
        <table className="min-w-full table-auto text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-sm text-gray-700">Amount</th>
              <th className="px-4 py-2 text-sm text-gray-700">Category</th>
              <th className="px-4 py-2 text-sm text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => (
              <tr key={budget._id} className="border-b">
                <td className="px-4 py-2">₹ {budget.amount}</td>
                <td className="px-4 py-2">{budget.category}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No budget found</p>
      )}
    </section>
  );
};

export default BudgetList;
