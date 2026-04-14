import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
    const { token, user } = useAuth();

    // Protection logic
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-8 relative">
                    {/* Page Content */}
                    <Outlet />
                    
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[var(--accent)]/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--accent)]/[0.02] rounded-full blur-[80px] pointer-events-none"></div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
