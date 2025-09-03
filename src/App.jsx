import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./theme/globals.css";
import "./components/Layout/Layout.css";
import Dashboard from "./components/Dashboard/Dashboard";
import EventDetailsPage from "./pages/EventDetailsPage";
import ExpenseTrackingPage from "./pages/ExpenseTrackingPage";
import VendorsPage from "./pages/VendorsPage";
import TasksPage from "./pages/TasksPage";
import Sidebar from "./components/Layout/Sidebar";
import Topbar from "./components/Layout/Topbar";
import { ToastProvider } from "./components/Toast/Toast";
import Breadcrumb from "./components/Breadcrumb/Breadcrumb";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <ToastProvider>
      <div className={`app${isSidebarOpen ? "" : " app--collapsed"}`} dir="rtl">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="main">
          <Topbar
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(o => !o)}
          />
          <div className="main-content">
            <Breadcrumb />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/event" element={<EventDetailsPage />} />
              <Route path="/expenses" element={<ExpenseTrackingPage />} />
              <Route path="/vendors" element={<VendorsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/guests" element={<div>מוזמנים - בפיתוח</div>} />
              <Route path="/gifts" element={<div>מתנות - בפיתוח</div>} />
              <Route path="/settings" element={<div>הגדרות - בפיתוח</div>} />
            </Routes>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
