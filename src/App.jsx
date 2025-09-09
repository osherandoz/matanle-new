import React from "react";
import { Routes, Route } from "react-router-dom";
import "./theme/globals.css";
import "./components/Layout/Layout.css";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateEventPage from "./pages/CreateEventPage";
import ThankYouPage from "./pages/ThankYouPage";
import Dashboard from "./components/Dashboard/Dashboard";
import EventDetailsPage from "./pages/EventDetailsPage";
import ExpenseTrackingPage from "./pages/ExpenseTrackingPage";
import TasksPage from "./pages/TasksPage";
import GuestsPage from "./pages/GuestsPage";
import GiftsPage from "./pages/GiftsPage";
import TopNavigation from "./components/Layout/TopNavigation";
import Topbar from "./components/Layout/Topbar";
import { ToastProvider } from "./components/Toast/Toast";
import { FirebaseProvider } from "../FirebaseContext.jsx";
import Breadcrumb from "./components/Breadcrumb/Breadcrumb";

// Dashboard Layout Component
const DashboardLayout = ({ children, title, subtitle }) => {
  return (
    <div className="app-container" dir="rtl">
      <TopNavigation />
      <main className="main-container">
        <Topbar
          title={title}
          subtitle={subtitle}
        />
        <div className="page-content">
          <Breadcrumb />
          {children}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <FirebaseProvider>
      <ToastProvider>
        <Routes>
        {/* Landing Page Route - No Dashboard Layout */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Authentication Routes - No Dashboard Layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        
        {/* Dashboard and App Routes - With Dashboard Layout */}
        <Route path="/dashboard" element={
          <DashboardLayout title="דשבורד" subtitle="סקירה מהירה של כל מה שקורה סביב האירוע">
            <Dashboard />
          </DashboardLayout>
        } />
        <Route path="/event" element={
          <DashboardLayout title="פרטי אירוע" subtitle="עריכה וניהול פרטי האירוע">
            <EventDetailsPage />
          </DashboardLayout>
        } />
        <Route path="/expenses" element={
          <DashboardLayout title="מעקב הוצאות" subtitle="ניהול וניטור תקציב האירוע">
            <ExpenseTrackingPage />
          </DashboardLayout>
        } />
        <Route path="/tasks" element={
          <DashboardLayout title="משימות" subtitle="ניהול משימות וזמנים">
            <TasksPage />
          </DashboardLayout>
        } />
        <Route path="/guests" element={
          <DashboardLayout title="מוזמנים" subtitle="ניהול רשימת המוזמנים">
            <GuestsPage />
          </DashboardLayout>
        } />
        <Route path="/gifts" element={
          <DashboardLayout title="מתנות" subtitle="ניהול מתנות לאורחים">
            <GiftsPage />
          </DashboardLayout>
        } />
        <Route path="/settings" element={
          <DashboardLayout title="הגדרות" subtitle="הגדרות מערכת וחשבון">
            <div>הגדרות - בפיתוח</div>
          </DashboardLayout>
        } />
        </Routes>
      </ToastProvider>
    </FirebaseProvider>
  );
}
