import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Bell, Search, Palette, ChevronDown, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const THEMES = [
    { id: "tune-dark", label: "Emerald", color: "#00C950" },
    { id: "tune-light", label: "Espresso", color: "#3D251E" },
    { id: "tune-blue", label: "Cyberpunk", color: "#00E5FF" },
    { id: "tune-red", label: "Crimson", color: "#FF3A39" },
    { id: "tune-scarlet", label: "Scarlet", color: "#ED292C" },
];

const Navbar = () => {
    const { user } = useAuth();
    const { theme, changeTheme } = useTheme();
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowThemeMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0];

    return (
        <header className="h-16 bg-[var(--bg-surface)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)] flex items-center justify-between px-6 z-20">
            {/* Search */}
            <div className="relative w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-meta)] group-focus-within:text-[var(--accent)] transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search music, albums or users..." 
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--accent)]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-meta)] outline-none transition-all focus:shadow-[0_0_15px_var(--accent-glow)]"
                />
            </div>

            <div className="flex items-center gap-4">
                {/* Theme Selector */}
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setShowThemeMenu(!showThemeMenu)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-all text-sm"
                    >
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: currentTheme.color }} />
                        <span className="text-[var(--text-secondary)] font-medium hidden sm:inline">{currentTheme.label}</span>
                        <ChevronDown className={`w-3 h-3 text-[var(--text-meta)] transition-transform ${showThemeMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showThemeMenu && (
                        <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-[fadeSlideUp_0.2s_ease-out]">
                            <div className="p-2 border-b border-[var(--border-subtle)]">
                                <p className="text-[10px] font-bold text-[var(--text-meta)] uppercase tracking-[0.15em] px-2 py-1">Select Theme</p>
                            </div>
                            <div className="p-1.5">
                                {THEMES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { changeTheme(t.id); setShowThemeMenu(false); }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                                            theme === t.id 
                                            ? 'bg-[var(--accent)]/10 text-[var(--text-primary)]' 
                                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                                        }`}
                                    >
                                        <div className="w-4 h-4 rounded-full border-2 border-white/10 shadow-sm shrink-0" 
                                            style={{ backgroundColor: t.color, boxShadow: theme === t.id ? `0 0 10px ${t.color}50` : 'none' }} />
                                        <span className="font-medium flex-1 text-left">{t.label}</span>
                                        {theme === t.id && <Check className="w-3.5 h-3.5 text-[var(--accent)]" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Notification */}
                <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-hover)]">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent)] rounded-full border border-[var(--bg-surface)]"></span>
                </button>
                
                {/* User */}
                <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-subtle)]">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider">{user?.role || "System Admin"}</p>
                        <p className="text-[10px] text-[var(--text-meta)] font-medium">{user?.email}</p>
                    </div>
                    <div className="w-9 h-9 bg-[var(--accent)] rounded-lg flex items-center justify-center text-[var(--bg-base)] font-black text-sm shadow-lg shadow-[var(--accent-glow)]">
                        {user?.email?.charAt(0).toUpperCase() || "A"}
                    </div>
                </div>
            </div>

            {/* Inline animation for dropdown */}
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </header>
    );
};

export default Navbar;
