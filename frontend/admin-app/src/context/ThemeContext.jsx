import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("admin-theme") || "tune-dark");

  useEffect(() => {
    // Backwards compatibility
    let safeTheme = theme;
    if (theme === "dark") safeTheme = "tune-dark";
    if (theme === "light") safeTheme = "tune-light";

    document.documentElement.setAttribute("data-theme", safeTheme);
    localStorage.setItem("admin-theme", safeTheme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
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
