import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo from '../../assets/zomato.png'; // Assuming logo exists here or use a text
// Using a red background style similar to the reference image for the header part

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        const result = await login(username, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">

            {/* Header Section mimicking the App feel */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-red-500 h-32 flex items-center justify-center relative">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight italic">zomato</h1>
                    {/* Decorative circles/elements if needed to match image perfectly, keeping it clean for now */}
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">India's #1 Food Delivery and Dining App</h2>
                        <div className="my-4 border-t border-gray-200 relative">
                            <span className="absolute top-[-12px] left-1/2 -translate-x-1/2 bg-white px-2 text-gray-500 text-sm">
                                Log in or sign up
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="h-12 text-lg"
                        />

                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 text-lg"
                        />

                        <Button
                            type="submit"
                            className="w-full bg-red-500 hover:bg-red-600 text-white h-12 text-lg font-semibold rounded-lg"
                        >
                            Continue
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        New to Zomato?{' '}
                        <Link to="/signup" className="text-red-500 font-semibold hover:underline">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
