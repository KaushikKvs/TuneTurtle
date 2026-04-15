import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "tune-dark");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // For backwards compatibility on previous state
    let safeTheme = theme;
    if (theme === "dark") safeTheme = "tune-dark";
    if (theme === "light") safeTheme = "tune-light";

    document.documentElement.setAttribute("data-theme", safeTheme);
    localStorage.setItem("theme", safeTheme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, isSidebarOpen, toggleSidebar }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
