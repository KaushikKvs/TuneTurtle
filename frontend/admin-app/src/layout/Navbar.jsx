import React from "react";
import { useAuth } from "../context/AuthContext";
import { User, Bell, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="h-20 bg-[var(--bg-surface)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] flex items-center justify-between px-8 z-20">
            <div className="relative w-96 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search music, albums or users..." 
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--accent)]/50 rounded-xl pl-10 pr-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none transition-all"
                />
            </div>

            <div className="flex items-center gap-6">
                <button 
                    onClick={toggleTheme}
                    className="p-2 text-[var(--accent)] hover:text-[var(--accent)]/80 transition-all bg-[var(--bg-base)] rounded-lg border border-[var(--border-subtle)]"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent)] rounded-full border border-[var(--bg-base)]"></span>
                </button>
                
                <div className="flex items-center gap-3 pl-6 border-l border-[var(--border-subtle)]">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">{user?.role || "System Admin"}</p>
                        <p className="text-[10px] text-[var(--text-secondary)] font-medium">{user?.email}</p>
                    </div>
                    <div className="w-9 h-9 bg-[var(--accent)] rounded-lg flex items-center justify-center text-[var(--bg-base)] font-black shadow-lg shadow-[var(--accent-glow)]">
                        {user?.email?.charAt(0).toUpperCase() || "A"}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
