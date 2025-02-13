import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

const ExpenseRecording = ({ refreshExpenses }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('select');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const categories = ['select', 'Groceries', 'Entertainment', 'Utilities', 'Rent', 'Other'];
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("authToken");
    if (!token) {
      alert('Session expired. Please log in.');
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !date || category === 'select' || !description) {
      setError('All fields are required');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Session expired. Please log in.');
      navigate('/login');
      return;
    }

    try {
      const response = await api.post('/api/expenses', { amount, date, category, description }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        alert('Expense recorded successfully!');
        setAmount('');
        setDate('');
        setCategory('select');
        setDescription('');
        setError('');
        refreshExpenses(); // Refresh expense list automatically
      }
    } catch (err) {
      console.error('Error recording expense:', err);
      setError(err.response?.data?.message || 'Error recording expense');
    }
  };

  return (
    <section className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-3xl font-semibold text-center text-gray-700">Record an Expense</h2>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-600">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-600">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-600">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Submit Expense
        </button>
      </form>
    </section>
  );
};

export default ExpenseRecording;
