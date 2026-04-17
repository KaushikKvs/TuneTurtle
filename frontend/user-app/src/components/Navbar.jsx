import { ChevronLeft, ChevronRight, LogOut, Settings, Palette, Check, Menu, User, X, ShoppingCart } from "lucide-react";
import React, { useState, useRef, useEffect, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ProfileModal from "./ProfileModal";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const themes = [
  { id: "tune-dark", label: "Midnight Green", color: "#00C950" },
  { id: "tune-red", label: "Lava Crimson", color: "#FF3A39" },
  { id: "tune-scarlet", label: "Blood Scarlet", color: "#ED292C" },
  { id: "tune-light", label: "Champagne Brown", color: "#3D251E" },
  { id: "tune-blue", label: "Cyberpunk", color: "#00E5FF" },
  { id: "tune-solo", label: "Solo Leveling", color: "#7C3AED" },
];

const Navbar = ({ playerVisible, setPlayerVisible }) => {
  const { user, logout } = useAuth();
  const { cartItems } = useContext(PlayerContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, changeTheme, isSidebarOpen, toggleSidebar } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [themesExpanded, setThemesExpanded] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
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
      <div className="w-full grid grid-cols-3 items-center font-semibold">
        {/* LEFT ZONE: Navigation & Tabs */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div
              onClick={toggleSidebar}
              className={`w-8 h-8 rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-center border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:shadow-[0_0_10px_var(--accent-glow)] ${isSidebarOpen ? 'bg-[var(--bg-surface)] text-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)]' : 'bg-[var(--bg-base)] text-[var(--text-primary)] hover:text-[var(--accent)]'}`}
              title="Toggle Library"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </div>

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
          
          <div className="hidden lg:flex items-center gap-3">
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
        </div>

        {/* CENTER ZONE: The Glowing Turtle (Mathematically Centered) */}
        <div className="flex justify-center items-center">
          {user && (
            <div 
              onClick={() => setPlayerVisible(!playerVisible)}
              className={`w-12 h-12 shrink-0 cursor-pointer transition-all duration-500 hover:scale-110 active:scale-95 ${playerVisible ? 'animate-pulse-slow' : 'opacity-60 hover:opacity-100'}`}
              title={playerVisible ? 'Hide Player' : 'Show Player'}
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
                filter: playerVisible 
                  ? 'drop-shadow(0 0 12px var(--accent-glow)) drop-shadow(0 0 25px var(--accent-glow))' 
                  : 'drop-shadow(0 0 4px var(--accent-glow))'
              }}
            />
          )}
        </div>

        {/* RIGHT ZONE: Cart, Dashboard & Profile */}
        <div className="flex items-center justify-end gap-3 text-sm">
          {user?.role !== "ADMIN" && (
            <button
              onClick={() => navigate("/cart")}
              className="relative bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] px-4 py-2 rounded-full font-bold hover:bg-[var(--bg-hover)] transition-all flex items-center gap-2 group"
            >
              <ShoppingCart className="w-4 h-4 group-hover:text-[var(--accent)] transition-colors" />
              <span className="hidden xl:inline">Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full text-[9px] font-black bg-[var(--accent)] text-[var(--bg-base)] flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]">
                  {cartItems.length}
                </span>
              )}
            </button>
          )}

          {user?.role === "ARTIST" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--dashboard-accent)]/30 px-5 py-2 rounded-full font-bold hover:bg-[var(--dashboard-accent)] hover:text-[var(--bg-base)] transition-all hover:shadow-[0_0_15px_var(--accent-glow)] active:scale-95 hidden sm:block"
            >
              Dashboard
            </button>
          )}
          {user?.role === "ADMIN" && (
            <button
              onClick={() => window.open('http://localhost:5174', '_blank')}
              className="bg-[var(--bg-surface)] text-[var(--text-primary)] border border-blue-500/30 px-5 py-2 rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] active:scale-95 flex items-center gap-2"
            >
              Admin Panel
            </button>
          )}

          {/* User Avatar Dropdown */}
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center text-[var(--bg-base)] font-black shadow-lg shadow-[var(--accent-glow)] hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-white/10"
              title={user?.email}
            >
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 z-50 animate-slide-up">
                <div className="w-full premium-tracer bg-[var(--bg-surface)]/95 backdrop-blur-2xl rounded-2xl shadow-[0_15px_40px_var(--bg-base)] overflow-hidden border border-[var(--border-subtle)]/50">
                  {/* User Info Header with Neon Glow */}
                  <div className="px-5 py-4 border-b border-[var(--border-subtle)] bg-gradient-to-br from-[var(--bg-base)] to-[var(--bg-surface)]">
                    <p className="text-sm font-black text-[var(--text-primary)] truncate drop-shadow-[0_0_8px_var(--accent-glow)]">{user?.email}</p>
                    <p className="text-[11px] text-[var(--accent)] mt-0.5 font-mono uppercase tracking-widest leading-none drop-shadow-md">{user?.role || "User"}</p>
                  </div>

                {/* Profile Section */}
                <div className="px-2 py-2 border-b border-[var(--border-subtle)]">
                  <button 
                    onClick={() => {
                        setDropdownOpen(false);
                        setIsProfileModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-[var(--bg-base)] transition-all font-bold text-left group shadow-inner hover:shadow-[0_0_20px_var(--accent-glow)]"
                  >
                    <User className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span className="text-sm">Profile Configuration</span>
                  </button>
                </div>

                {/* Themes Section - Collapsible */}
                <div className="px-2 py-2 border-b border-[var(--border-subtle)]">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setThemesExpanded(!themesExpanded);
                    }}
                    className="flex justify-between items-center px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[var(--bg-hover)] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Palette className="w-4 h-4 text-[var(--accent)] drop-shadow-[0_0_5px_var(--accent-glow)]" />
                      <span className="text-sm font-bold text-[var(--text-primary)]">Lighting Themes</span>
                    </div>
                    {themesExpanded ? (
                      <ChevronRight className="w-4 h-4 text-[var(--accent)] rotate-90 transition-transform" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[var(--text-meta)] transition-transform group-hover:text-[var(--accent)]" />
                    )}
                  </div>

                  {/* Expandable Theme List */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${themesExpanded ? 'max-h-64 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-1 px-1 pb-1">
                      {themes.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            changeTheme(t.id);
                            setThemesExpanded(false);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                            theme === t.id
                              ? "bg-[var(--bg-hover)] text-[var(--text-primary)] shadow-sm border border-[var(--accent)]/30"
                              : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full flex-shrink-0 border-2 transition-all shadow-[0_0_8px_var(--accent-glow)]"
                            style={{
                              backgroundColor: t.color,
                              borderColor: theme === t.id ? "var(--text-primary)" : "transparent",
                              boxShadow: theme === t.id ? `0 0 10px ${t.color}` : "none",
                            }}
                          />
                          <span className="text-xs font-bold leading-tight flex-1">{t.label}</span>
                          {theme === t.id && (
                            <Check className="w-3 h-3 text-[var(--accent)] drop-shadow-md" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div className="px-2 py-2 bg-[var(--bg-base)]/20">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition-all text-left font-bold border border-transparent hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Disconnect Uplink</span>
                  </button>
                </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render the Overlay Modal if Opened */}
      {isProfileModalOpen && (
          <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
