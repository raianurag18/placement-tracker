const isAdmin = (req, res, next) => {
    // 1. Check if user is logged in
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized: Please login first.' });
    }

    // 2. Check if user has admin role
    if (req.user && req.user.role === 'admin') {
        return next(); // Pass!
    }

    // 3. Block everyone else
    return res.status(403).json({ message: 'Forbidden: Admin access required.' });
};

module.exports = isAdmin;
