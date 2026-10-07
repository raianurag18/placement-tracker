import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Try to load from LocalStorage immediately (No loading flash)
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('placerra_user');
            const parsed = stored ? JSON.parse(stored) : null;
            // Ensure collegeSlug is picked up from user object if it exists
            if (parsed && !parsed.collegeSlug) {
                parsed.collegeSlug = localStorage.getItem('placerra_college_slug');
            }
            return parsed;
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
        const slugToSave = userData.collegeSlug || localStorage.getItem('placerra_college_slug');

        const finalUser = { ...userToSave, token: tokenToSave, collegeSlug: slugToSave };

        setUser(finalUser);
        localStorage.setItem('placerra_user', JSON.stringify(finalUser));
        if (tokenToSave) {
            localStorage.setItem('placerra_token', tokenToSave);
        }
        if (slugToSave) {
            localStorage.setItem('placerra_college_slug', slugToSave);
        }
    };

    // 4. Logout: Clear State AND LocalStorage
    const logout = () => {
        setUser(null);
        localStorage.removeItem('placerra_user');
        localStorage.removeItem('placerra_token');
        localStorage.removeItem('placerra_college_slug');
        // JWT is stateless — clearing client storage is logout. No server cookie to kill.
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
