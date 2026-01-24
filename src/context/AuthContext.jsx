import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/utils/api';

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

        if (token) {
            const parsedToken = JSON.parse(token);
            let parsedUser = savedUser ? JSON.parse(savedUser) : {};


            if (!parsedUser.id && parsedToken.access) {
                try {
                    const base64Url = parsedToken.access.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    const payload = JSON.parse(jsonPayload);

                    if (payload.user_id) {
                        parsedUser = { ...parsedUser, id: payload.user_id };
                        localStorage.setItem('zomato-user', JSON.stringify(parsedUser));
                    }
                } catch (e) {
                    console.error("Failed to decode token for user ID", e);
                }
            }

            if (savedUser || parsedUser.id) {
                setUser(parsedUser);
            }
            api.defaults.headers.common['Authorization'] = `Bearer ${parsedToken.access}`;
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/token/', {
                username,
                password
            });

            const { access, refresh } = response.data;


            let userId = null;
            try {
                const base64Url = access.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const payload = JSON.parse(jsonPayload);
                userId = payload.user_id;
            } catch (e) {
                console.error("Failed to decode token", e);
            }

            const userData = { username, id: userId };

            localStorage.setItem('zomato-token', JSON.stringify({ access, refresh }));
            localStorage.setItem('zomato-user', JSON.stringify(userData));

            api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
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
            await api.post('/api/users/', userData);
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
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
