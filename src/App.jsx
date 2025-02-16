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
import ExpenseRecording from "./components/plans/Expense/ExpenseForm";
import ExpenseList from "./components/plans/Expense/ExpenseList";
import RecurringExpenseForm from "./components/plans/Expense/ExpenseRecurring";
import RecurringExpenseList from "./components/plans/Expense/RecurringExpenseList";
import FinancialGoals from "./components/plans/Goals/FinancialGoals";
import IncomeForm from "./components/plans/Income/IncomeForm";
import IncomeList from "./components/plans/Income/IncomeList";
import IncomeReports from "./components/plans/Income/IncomeReports";
import FinancialReports from "./components/plans/Report/FinancialReports";
import DueDatesList from "./components/plans/DueBillsList";
import AccountSummary from "./components/pages/AccountSummary";

const Login = lazy(() => import("./components/pages/Login"));
const Register = lazy(() => import("./components/pages/Register"));
const Home = lazy(() => import("./components/pages/Home"));
const Dashboard = lazy(() => import("./components/pages/Dashboard"));
const BudgetChart = lazy(() => import("./components/plans/Budget/BudgetChart"));
const ExpenseCategorization = lazy(() => import("./components/plans/Expense/ExpenseChart"));

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
              <Route path="/account-summary" element={<AccountSummary />} />


              {/* Budget Routes */}
              <Route path="/budget/chart" element={<BudgetChart />} />
              <Route path="/budget/form" element={<BudgetForm/>} />
              <Route path="/budget/list" element={<BudgetList />} />
              <Route path="/budget/export" element={<ExportData />} />

              {/* Expense Routes */}
              <Route path="/expense/recording" element={<ExpenseRecording />} />
              <Route path="/expense/list" element={<ExpenseList/>} />
              <Route path="/budget/list" element={<BudgetList />} />
              <Route path="/budget/export" element={<ExportData />} />
              <Route path="/expense/chart" element={<ExpenseCategorization />} />
              <Route path="/expense/recurring" element={<RecurringExpenseForm />} />
              <Route path="/expense/recurring-list" element={<RecurringExpenseList />} />

              {/* Expense Routes */}
              <Route path="/goals" element={<FinancialGoals />} />

              {/* Income Routes */}
              <Route path="/income/form" element={<IncomeForm />} />
              <Route path="/income/list" element={<IncomeList />} />
              <Route path="/income/report" element={<IncomeReports />} />

              <Route path="/financialReports" element={<FinancialReports />} /> 

              <Route path="/due-bill-list" element={<DueDatesList />} />
            </Routes>
          </Suspense>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default App;
