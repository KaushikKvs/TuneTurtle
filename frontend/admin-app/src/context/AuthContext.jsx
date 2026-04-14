import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_BASE_URL = "http://localhost:8080";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("adminToken"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("adminToken");
        const storedUser = localStorage.getItem("adminData");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log("Attempting admin login for:", email);
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                email,
                password,
            });

            console.log("Login response received:", response.status);

            if (response.status === 200) {
                const { token, email: userEmail, role } = response.data;
                console.log("Logged in role:", role);
                
                // Flexible ADMIN role check (case insensitive, ignores ROLE_ prefix)
                const normalizedRole = role ? role.toUpperCase().replace("ROLE_", "") : "";

                if (normalizedRole !== "ADMIN") {
                    console.error("Access denied: Not an admin", role);
                    return { success: false, message: "Access Denied: Admin role required." };
                }

                setToken(token);
                const userData = { id: response.data.userId, email: userEmail, role: normalizedRole };
                setUser(userData);
                
                localStorage.setItem("adminToken", token);
                localStorage.setItem("adminData", JSON.stringify(userData));
                
                return { success: true };
            } else {
                return { success: false, message: response.data.message || "Login Failed" };
            }
        } catch (error) {
            console.error("Login Error:", error);
            return {
                success: false,
                message: error.response?.data || "Network error. Please ensure the backend is running.",
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
    };

    const getAuthHeaders = () => {
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const contextValue = {
        login,
        logout,
        user,
        token,
        loading,
        getAuthHeaders,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
