import React, { Suspense, lazy, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/header/Navbar";
import Footer from "./components/footer/Footer";
import Sidebar from "./components/Sidebar";
import NotificationBell from "./components/Navbar/NotificationBell";
import "./index.css";
import BudgetForm from "./components/plans/Budget/BudgetForm";
import BudgetList from "./components/plans/Budget/BudgetList";
import ExportData from "./components/plans/Budget/ExportData";
import ExpenseRecording from "./components/plans/Expense/ExpenseRecording";
import ExpenseList from "./components/plans/Expense/ExpenseList";

const Login = lazy(() => import("./components/pages/Login"));
const Register = lazy(() => import("./components/pages/Register"));
const Home = lazy(() => import("./components/pages/Home"));
const Dashboard = lazy(() => import("./components/pages/Dashboard"));
const BudgetChart = lazy(() => import("./components/plans/Budget/BudgetChart"));
const ExpenseCategorization = lazy(() => import("./components/plans/Expense/ExpenseCategorization"));

const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
  </div>
);

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} /> 

      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        <div className="flex-1 p-4">
          <NotificationBell />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Budget Routes */}
              <Route path="/budget/chart" element={<BudgetChart />} />
              <Route path="/budget/form" element={<BudgetForm/>} />
              <Route path="/budget/list" element={<BudgetList />} />
              <Route path="/budget/export" element={<ExportData />} />

              {/* Budget Routes */}
              <Route path="/expense/recording" element={<ExpenseRecording />} />
              <Route path="/expense/list" element={<ExpenseList/>} />
              <Route path="/budget/list" element={<BudgetList />} />
              <Route path="/budget/export" element={<ExportData />} />
              <Route path="/expense/chart" element={<ExpenseCategorization />} />
            </Routes>
          </Suspense>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default App;
