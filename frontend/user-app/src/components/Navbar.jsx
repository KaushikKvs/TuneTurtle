import { ChevronLeft, ChevronRight, LogOut, Moon, Sun, User } from "lucide-react";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { label: "All", path: "/" },
    { label: "Artists", path: "/artists" },
    { label: "Music", path: "/music" },
    { label: "Podcasts", path: "/podcasts" },
  ];

  const getTabClass = (path) => {
    const isActive = location.pathname === path;
    return isActive
      ? "bg-[var(--accent)] text-[var(--bg-base)] px-4 py-1 rounded-2xl cursor-pointer shadow-lg transition-all"
      : "bg-[var(--bg-surface)] text-[var(--text-primary)] px-4 py-1 rounded-2xl cursor-pointer hover:bg-[var(--bg-hover)] transition border border-[var(--border-subtle)]";
  };

  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold">
        <div className="flex items-center gap-2">
          <div
            onClick={() => navigate(-1)}
            className="w-8 h-8 bg-[var(--bg-base)] p-2 rounded-2xl cursor-pointer hover:opacity-80 transition-all flex items-center justify-center border border-[var(--border-subtle)]"
          >
            <ChevronLeft className="w-4 h-4 text-[var(--text-primary)]" />
          </div>

          <div
            onClick={() => navigate(1)}
            className="w-8 h-8 bg-[var(--bg-base)] p-2 rounded-2xl cursor-pointer hover:opacity-80 transition-all flex items-center justify-center border border-[var(--border-subtle)]"
          >
            <ChevronRight className="w-4 h-4 text-[var(--text-primary)]" />
          </div>
        </div>
        
        {user?.role !== 'ARTIST' && (
          <div className="flex items-center gap-4">
            {menuItems.map((item) => (
              <p 
                key={item.path}
                onClick={() => navigate(item.path)}
                className={getTabClass(item.path)}
              >
                {item.label}
              </p>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button 
                onClick={toggleTheme}
                className="w-10 h-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] transition-all active:scale-95 shadow-sm"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-[var(--accent)]" /> : <Moon className="w-5 h-5 text-[var(--accent)]" />}
          </button>

          {user?.role === "ARTIST" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--dashboard-accent)]/30 px-6 py-2 rounded-full text-[13px] font-bold hover:bg-[var(--dashboard-accent)] hover:text-[var(--bg-base)] transition-all hover:shadow-[0_0_15px_var(--accent-glow)] active:scale-95"
            >
              Artist Dashboard
            </button>
          )}
          {user?.role === "ADMIN" && (
            <button
              onClick={() => window.open('http://localhost:5174', '_blank')}
              className="bg-[var(--bg-surface)] text-[var(--text-primary)] border border-blue-500/30 px-6 py-2 rounded-full text-[13px] font-bold hover:bg-blue-600 hover:text-white transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] active:scale-95 flex items-center gap-2"
            >
              Admin Panel
            </button>
          )}

          {/* User Profile Badge - Synced with Admin Panel Style */}
          <div className="flex items-center gap-3 pl-2 transition-all">
            <div 
              className="w-9 h-9 bg-[var(--accent)] rounded-lg flex items-center justify-center text-[var(--bg-base)] font-black shadow-lg shadow-[var(--accent-glow)] cursor-default hover:scale-105 transition-transform"
              title={user?.email}
            >
                {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            
            <button
                onClick={handleLogout}
                title="Logout"
                className="text-[var(--text-meta)] hover:text-red-500 transition-colors p-2"
            >
                <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
