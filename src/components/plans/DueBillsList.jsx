import React, { useState, useEffect } from "react";
import api from "../../services/api";

const DueDatesList = () => {
    const [dueExpenses, setDueExpenses] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDueExpenses();
    }, []); // ✅ Fetch expenses only once on mount

    // ✅ Fetch recurring expenses from API
    const fetchDueExpenses = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("No authentication token found.");

            const response = await api.get("/api/expenses/recurring", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setDueExpenses(response.data);
        } catch (err) {
            setError("Error fetching due expenses.");
            console.error("❌ Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle updating due date
    const handleUpdateNextDue = async (id, newNextDue) => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return setError("Authentication required.");

            const formattedDate = new Date(newNextDue).toISOString();
            const response = await api.patch(`/api/expenses/recurring/${id}`, { nextDue: formattedDate }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setDueExpenses((prevExpenses) =>
                    prevExpenses.map(expense =>
                        expense._id === id ? { ...expense, nextDue: formattedDate } : expense
                    )
                );
            } else {
                throw new Error("Failed to update next due date.");
            }
        } catch (err) {
            console.error("❌ Error updating nextDue:", err);
            setError("Error updating next due date.");
        }
    };

    // ✅ Handle deleting an expense
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return setError("Authentication required.");

            await api.delete(`/api/expenses/recurring/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setDueExpenses((prevExpenses) => prevExpenses.filter(expense => expense._id !== id));
        } catch (err) {
            console.error("❌ Error deleting expense:", err);
            setError("Error deleting expense.");
        }
    };

    return (
        <section className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 max-w-4xl">
            <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Due Dates List</h2>

            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : dueExpenses.length > 0 ? (
                <table className="min-w-full table-auto text-left border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-sm text-gray-700 border">Amount</th>
                            <th className="px-4 py-2 text-sm text-gray-700 border">Category</th>
                            <th className="px-4 py-2 text-sm text-gray-700 border">Next Due</th>
                            <th className="px-4 py-2 text-sm text-gray-700 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dueExpenses.map((expense) => (
                            <tr key={expense._id} className="border-b">
                                <td className="px-4 py-2 border">₹{expense.amount}</td>
                                <td className="px-4 py-2 border">{expense.category}</td>
                                <td className="px-4 py-2 border">
                                    {expense.nextDue ? new Date(expense.nextDue).toLocaleDateString("en-GB") : "No Due Date"}
                                </td>
                                <td className="px-4 py-2 border flex gap-2">
                                    <input
                                        type="date"
                                        className="border border-gray-300 rounded p-1 text-sm"
                                        onChange={(e) => handleUpdateNextDue(expense._id, e.target.value)}
                                    />
                                    <button
                                        onClick={() => handleDelete(expense._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-500">No due expenses found.</p>
            )}
        </section>
    );
};

export default DueDatesList;
