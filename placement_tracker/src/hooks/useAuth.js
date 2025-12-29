import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/auth/current_user`, { credentials: 'include' })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("Error fetching user:", err)
        setUser(null);
      });
  }, []);

  return user;
};

export default useAuth;
