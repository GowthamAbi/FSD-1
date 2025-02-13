import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BudgetChart = ({ budgets }) => {
  if (!budgets || budgets.length === 0) return <p className="text-gray-500">No budget data available</p>;

  const data = {
    labels: budgets.map((b) => b.category),
    datasets: [
      {
        label: "Budget (₹)",
        data: budgets.map((b) => b.amount || 0),
        backgroundColor: "blue",
      },
      {
        label: "Spent (₹)",
        data: budgets.map((b) => b.spent || 0),
        backgroundColor: "red",
      },
    ],
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Budget vs Spent Chart</h2>
      <Bar data={data} options={{ responsive: true }} />
    </div>
  );
};

export default BudgetChart;
