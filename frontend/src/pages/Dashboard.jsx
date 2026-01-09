import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, ShoppingBag, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
    const [summary, setSummary] = useState({ sales: 0, transactions: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await axios.get((import.meta.env.VITE_API_URL || '') + '/api/reports/summary');
                setSummary(response.data);
            } catch (error) {
                console.error('Failed to fetch summary', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${bgClass} opacity-10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110`} />

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                    <p className="text-sm font-medium text-neutral-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-neutral-800 tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${bgClass} ${colorClass} bg-opacity-10 group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                <span>Today's Activity</span>
            </div>
        </div>
    );

    if (loading) return <div className="flex justify-center items-center h-64 text-neutral-400 animate-pulse">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h2>
                    <p className="text-neutral-500 text-sm">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-neutral-600 bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-200">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard
                    title="Total Sales"
                    value={`Rp ${summary.sales.toLocaleString()}`}
                    icon={DollarSign}
                    colorClass="text-emerald-600"
                    bgClass="from-emerald-400 to-emerald-600"
                />
                <StatCard
                    title="Transactions"
                    value={summary.transactions}
                    icon={ShoppingBag}
                    colorClass="text-blue-600"
                    bgClass="from-blue-400 to-blue-600"
                />
            </div>
        </div>
    );
};

export default Dashboard;
