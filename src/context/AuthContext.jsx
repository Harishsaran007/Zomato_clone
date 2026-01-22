import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved token on initial load
        const token = localStorage.getItem('zomato-token');
        const savedUser = localStorage.getItem('zomato-user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(token).access}`;
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('/token/', {
                username,
                password
            });

            const { access, refresh } = response.data;

            // Since the login API only returns tokens, we'll store the username locally
            // Ideally, we should fetch user profile after login using the token
            const userData = { username };

            localStorage.setItem('zomato-token', JSON.stringify({ access, refresh }));
            localStorage.setItem('zomato-user', JSON.stringify(userData));

            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            setUser(userData); 

            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return {
                success: false,
                message: error.response?.data?.detail || "Login failed. Please check your credentials."
            };
        }
    };

    const signup = async (userData) => {
        try {
            // The signup endpoint allows creating a user
            await axios.post('/api/users/', userData);
            return { success: true };
        } catch (error) {
            console.error("Signup failed", error);
            return {
                success: false,
                message: error.response?.data?.username?.[0] || "Signup failed. Please try again."
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('zomato-token');
        localStorage.removeItem('zomato-user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
