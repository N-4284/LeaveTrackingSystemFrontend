import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return null;

        try {
            const res = await axios.get('http://localhost:5000/user-info', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
            return res.data;
        } catch (err) {
            localStorage.removeItem('authToken');
            setUser(null);
            return null;
        }
    };

    const login = async (email, password) => {
        const response = await axios.post("http://localhost:5000/login", {
            email,
            password,
        });

        const token = response.data.token;
        localStorage.setItem("authToken", token);

        const userInfo = await axios.get("http://localhost:5000/user-info", {
            headers: { Authorization: `Bearer ${token}` }
        });

        setUser(userInfo.data);
        return response.data;
    };

    useEffect(() => {
        fetchUser().finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser, login, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};
