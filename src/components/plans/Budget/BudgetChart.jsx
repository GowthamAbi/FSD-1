import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BudgetChart = () => {
  const [budgets, setBudgets] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    categorizeBudgets(budgets);
  }, [budgets]);

  const fetchBudgets = async () => {
    try {
      let token = localStorage.getItem("authToken");
      if (!token) {
        alert('Session expired. Please log in.');
        navigate('/login');
        return;
      }

      const response = await api.get('/api/budgets', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBudgets(response.data);
    } catch (err) {
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const categorizeBudgets = (budgets) => {
    const categories = budgets.reduce((acc, budget) => {
      acc[budget.category] = (acc[budget.category] || 0) + parseFloat(budget.amount);
      return acc;
    }, {});
    setCategoryData(categories);
  };

  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Budget Allocation',
        data: Object.values(categoryData),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Budget Allocation by Category',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#333',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `₹${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Category',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount (₹)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <section className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">Budget Allocation</h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-full p-4">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </section>
  );
};

export default BudgetChart;
