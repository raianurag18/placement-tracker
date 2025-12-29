import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Try to load from LocalStorage immediately (No loading flash)
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('placerra_user');
            return stored ? JSON.parse(stored) : null;
        } catch (err) {
            return null;
        }
    });

    // 2. Background Check: If no user in LS, try checking server cookie
    // 2. Background Check: (Removed as we rely on LocalStorage for JWT persistence)

    // 3. Login: Save to State AND LocalStorage
    const login = (userData) => {
        // userData is expected to have { user: {...}, token: "..." } structure from backend
        // Or if backend returns { ...userFields }, but in our case backend now returns { user, token }

        // Handle structure: if userData has user & token properties
        const userToSave = userData.user ? userData.user : userData;
        const tokenToSave = userData.token || userData.token; // Redundant but clear

        // Merge token into user object for convenience, or keep separate. 
        // Best practice: keep separate but for this context, let's attach result.

        const finalUser = { ...userToSave, token: userData.token };

        setUser(finalUser);
        localStorage.setItem('placerra_user', JSON.stringify(finalUser));
        if (userData.token) {
            localStorage.setItem('placerra_token', userData.token);
        }
    };

    // 4. Logout: Clear State AND LocalStorage
    const logout = () => {
        setUser(null);
        localStorage.removeItem('placerra_user');
        localStorage.removeItem('placerra_token');
        // Optional: Notify server to kill cookie too
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/auth/logout`, { method: 'POST' });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading: user === undefined }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
