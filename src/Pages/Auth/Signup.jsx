import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/input';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone_number: '', 
        address: '',      
        password: ''
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.password || !formData.email) {
            setError('Please fill in all required fields');
            return;
        }

        const result = await signup(formData);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-red-500 h-24 flex items-center justify-center">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight italic">zomato</h1>
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an account</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Input
                            name="username"
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="h-10"
                        />

                        <Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="h-10"
                        />

                        <Input
                            name="phone_number"
                            type="text"
                            placeholder="Phone Number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="h-10"
                        />

                        <Input
                            name="address"
                            type="text"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="h-10"
                        />

                        <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="h-10"
                        />

                        <Button
                            type="submit"
                            className="w-full bg-red-500 hover:bg-red-600 text-white h-12 text-lg font-semibold rounded-lg mt-2"
                        >
                            Sign up
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-red-500 font-semibold hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
