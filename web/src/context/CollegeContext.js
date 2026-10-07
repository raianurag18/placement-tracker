import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * CollegeContext
 *
 * Purpose: Store the current college's metadata (name, slug, logo) globally
 * so all components within a college portal know which college they're in.
 *
 * ⚠️ INTERVIEW TIP: This is similar to how React Router's useParams() works,
 * but CollegeContext also stores the FULL college object (not just the slug)
 * which includes name, logo, and city for display purposes.
 *
 * Usage:
 *   const { college, setCollege } = useCollege();
 *   console.log(college.name); // "BIT Mesra"
 *   console.log(college.slug); // "bitmesra"
 */
const CollegeContext = createContext();

export const CollegeProvider = ({ children }) => {
    // Store the current college object
    // null means we're on a global page (landing, about, pricing)
    const [college, setCollege] = useState(null);
    const [isLoadingCollege, setIsLoadingCollege] = useState(false);

    /**
     * fetchCollege
     * Purpose: When the user navigates to /c/:slug, fetch the college metadata
     * from the backend and store it in context.
     *
     * This runs once when the slug changes (handled by CollegePage component).
     */
    const fetchCollege = async (slug) => {
        if (!slug) return;

        setIsLoadingCollege(true);
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/institutes/${slug}/meta`);

            if (res.ok) {
                const data = await res.json();
                setCollege(data);
            } else {
                // College not found — clear it
                setCollege(null);
            }
        } catch (err) {
            console.error('Failed to fetch college metadata:', err);
            setCollege(null);
        } finally {
            setIsLoadingCollege(false);
        }
    };

    /**
     * clearCollege
     * Purpose: Called when user navigates away from a college portal
     * back to global pages like landing, about, pricing.
     */
    const clearCollege = () => {
        setCollege(null);
    };

    return (
        <CollegeContext.Provider value={{ college, setCollege, fetchCollege, clearCollege, isLoadingCollege }}>
            {children}
        </CollegeContext.Provider>
    );
};

// Custom hook for clean usage in components
export const useCollege = () => {
    return useContext(CollegeContext);
};
