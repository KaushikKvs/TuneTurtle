import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { PlayerContextProvider } from "./context/PlayerContext.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";

import { ThemeProvider } from "./context/ThemeContext.jsx";

// wrapping authprovider searprovider playercontext provider so...
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <PlayerContextProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
        </PlayerContextProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
