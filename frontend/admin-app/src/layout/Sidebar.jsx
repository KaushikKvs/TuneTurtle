import React from "react";
import { useAuth } from "../context/AuthContext";
import { Music, FolderHeart, PlusCircle, LogOut, Users } from "lucide-react";
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
            {/* Logo */}
            <div className="p-6 mb-2">
                <div className="premium-tracer bg-[var(--bg-card)] rounded-xl p-4 flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
                    <div 
                        className="w-8 h-8 shrink-0 animate-pulse-slow"
                        style={{
                            backgroundColor: 'var(--accent)',
                            maskImage: `url(${assets.logo})`,
                            WebkitMaskImage: `url(${assets.logo})`,
                            maskSize: 'contain',
                            WebkitMaskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskPosition: 'center',
                            filter: 'drop-shadow(0 0 8px var(--accent-glow))'
                        }}
                    />
                    <h1 className="text-lg font-extrabold text-[var(--text-primary)] tracking-tighter group-hover:text-[var(--accent)] transition-colors">
                        Admin<span className="text-[var(--accent)]">Panel</span>
                    </h1>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                                isActive 
                                ? "bg-[var(--accent)] text-[var(--bg-base)] shadow-lg shadow-[var(--accent-glow)]" 
                                : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--border-subtle)]"
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "text-[var(--bg-base)]" : "text-[var(--accent)]"}`} />
                            {item.name}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
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
