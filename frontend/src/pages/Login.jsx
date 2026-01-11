import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, AlertCircle, ChefHat, ArrowRight } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await axios.post(`${apiUrl}/api/auth/login`, formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (response.data.user.role === 'OWNER') {
                navigate('/dashboard');
            } else {
                navigate('/pos');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-neutral-50">
            {/* Left Side - Image/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-emerald-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-emerald-800/90"></div>

                <div className="relative z-10 p-12 text-white max-w-lg">
                    <div className="w-20 h-20 bg-emerald-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 border border-emerald-400/30">
                        <ChefHat className="w-10 h-10 text-emerald-100" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Manage Your <span className="text-emerald-300">Warung</span> With Ease.</h1>
                    <p className="text-emerald-100/80 text-lg leading-relaxed">
                        Streamline your operations, track sales, and manage your menu efficiently with the Warmindo Point8 System.
                    </p>
                </div>

                {/* Decorative Circles */}
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                            <UtensilsCrossed className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900">Welcome Back</h2>
                        <p className="text-neutral-500 mt-2">Please sign in to your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 ml-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="w-full px-5 py-3.5 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-neutral-400"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-neutral-700 ml-1">Password</label>
                                <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                name="password"
                                className="w-full px-5 py-3.5 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-neutral-400"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <p className="text-center text-sm text-neutral-500">
                        Don't have an account? <span className="text-emerald-600 font-medium cursor-pointer hover:underline">Contact Administrator</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
