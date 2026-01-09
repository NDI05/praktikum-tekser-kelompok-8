import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, MessageSquare, Calendar, Search } from 'lucide-react';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' or 'feedback'
    const [transactions, setTransactions] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'transactions') {
                const response = await axios.get((import.meta.env.VITE_API_URL || '') + '/api/transactions');
                setTransactions(response.data);
            } else {
                const response = await axios.get((import.meta.env.VITE_API_URL || '') + '/api/feedback');
                setFeedback(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-white text-neutral-500 hover:bg-neutral-50 border border-neutral-100'
                }`}
        >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl shadow-sm border border-neutral-100">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Laporan & Feedback</h2>
                    <p className="text-neutral-500">View transactions and customer feedback.</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                    <TabButton id="transactions" label="Transaksi" icon={FileText} />
                    <TabButton id="feedback" label="Feedback" icon={MessageSquare} />
                </div>
                <button
                    onClick={() => window.open((import.meta.env.VITE_API_URL || '') + `/api/reports/${activeTab}/download`, '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                    <FileText className="w-4 h-4" />
                    <span>Download Report</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-neutral-400 animate-pulse">Loading data...</div>
                ) : (
                    <div className="overflow-x-auto">
                        {activeTab === 'transactions' ? (
                            <table className="w-full text-left">
                                <thead className="bg-neutral-50 border-b border-neutral-100">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-neutral-600">ID</th>
                                        <th className="px-6 py-4 font-semibold text-neutral-600">Date</th>
                                        <th className="px-6 py-4 font-semibold text-neutral-600">Total</th>
                                        <th className="px-6 py-4 font-semibold text-neutral-600">Karyawan</th>
                                        <th className="px-6 py-4 font-semibold text-neutral-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {transactions.map((trx) => (
                                        <tr key={trx.id} className="hover:bg-neutral-50/50 transition-colors">
                                            <td className="px-6 py-4 text-neutral-900 font-medium">#{trx.id}</td>
                                            <td className="px-6 py-4 text-neutral-500">
                                                {new Date(trx.tgl_transaksi).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-neutral-900 font-bold">
                                                Rp {trx.total_harga.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-neutral-500">{trx.karyawan?.nama}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => window.location.href = `/transactions/${trx.id}`}
                                                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-neutral-50 border-b border-neutral-100">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-neutral-600">ID</th>
                                        <th className="px-6 py-4 font-semibold text-neutral-600">Date</th>
                                        <th className="px-6 py-4 font-semibold text-neutral-600">Rating</th>
                                        <th className="px-6 py-4 font-semibold text-neutral-600">Comment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {feedback.map((fb) => (
                                        <tr key={fb.id} className="hover:bg-neutral-50/50 transition-colors">
                                            <td className="px-6 py-4 text-neutral-900 font-medium">#{fb.id}</td>
                                            <td className="px-6 py-4 text-neutral-500">
                                                {new Date(fb.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${fb.rating >= 4 ? 'bg-emerald-100 text-emerald-700' :
                                                    fb.rating >= 3 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {fb.rating} / 5
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-neutral-600 max-w-md truncate">
                                                {fb.komentar || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
