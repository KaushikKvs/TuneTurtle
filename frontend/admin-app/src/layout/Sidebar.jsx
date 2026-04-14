import React from "react";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Music, FolderHeart, PlusCircle, LogOut, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: "All Songs", path: "/list-songs", icon: Music },
        { name: "Add Song", path: "/add-song", icon: PlusCircle },
        { name: "All Albums", path: "/list-albums", icon: FolderHeart },
        { name: "Add Album", path: "/add-album", icon: PlusCircle },
        { name: "Artists", path: "/list-artists", icon: Users },
    ];

    return (
        <div className="w-64 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col h-full overflow-hidden">
            <div className="p-6 mb-4">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
                    <img src={assets.logo} alt="logo" className="w-9 h-9 animate-pulse-slow" />
                    <h1 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tighter group-hover:text-[var(--accent)] transition-colors">Admin<span className="text-[var(--accent)]">Panel</span></h1>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                isActive 
                                ? "bg-[var(--dashboard-accent)] text-[var(--bg-base)] shadow-lg shadow-[var(--accent-glow)] scale-105" 
                                : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--border-subtle)]"
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "text-[var(--bg-base)]" : "text-[var(--accent)]"}`} />
                            {item.name}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[var(--border-subtle)]">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
