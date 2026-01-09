import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, User, ShoppingBag, CreditCard } from 'lucide-react';

const TransactionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const response = await axios.get(`${(import.meta.env.VITE_API_URL || '')}/api/transactions/${id}`);
                setTransaction(response.data);
            } catch (error) {
                console.error('Error fetching transaction', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse text-neutral-400">Loading transaction details...</div>
        </div>
    );

    if (!transaction) return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <p className="text-neutral-500">Transaction not found</p>
            <button onClick={() => navigate('/reports')} className="text-emerald-600 hover:underline">
                Back to Reports
            </button>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <button
                onClick={() => navigate('/reports')}
                className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-900 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Reports</span>
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">Transaction #{transaction.id}</h1>
                        <div className="flex items-center space-x-2 text-neutral-500 mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(transaction.tgl_transaksi).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-neutral-500">Total Amount</p>
                        <p className="text-2xl font-bold text-emerald-600">Rp {transaction.total_harga.toLocaleString()}</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-neutral-900">Customer</span>
                            </div>
                            <p className="text-neutral-600 ml-11">
                                {transaction.pelanggan ? (
                                    <>
                                        {transaction.pelanggan.nama}
                                        <br />
                                        <span className="text-xs text-neutral-400">{transaction.pelanggan.no_hp || '-'}</span>
                                    </>
                                ) : 'Guest'}
                            </p>
                        </div>

                        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-neutral-900">Cashier</span>
                            </div>
                            <p className="text-neutral-600 ml-11">{transaction.karyawan?.nama}</p>
                        </div>
                    </div>

                    {/* Items List */}
                    <div>
                        <h3 className="font-bold text-neutral-900 mb-4 flex items-center space-x-2">
                            <ShoppingBag className="w-5 h-5 text-neutral-400" />
                            <span>Order Items</span>
                        </h3>
                        <div className="space-y-3">
                            {transaction.detail.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-3 hover:bg-neutral-50 rounded-xl transition-colors border border-transparent hover:border-neutral-100">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center font-bold text-neutral-500 text-sm">
                                            {item.qty}x
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-900">{item.menu.nama}</p>
                                            <p className="text-xs text-neutral-400">@ Rp {item.menu.harga.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-neutral-900">Rp {item.subtotal.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center">
                    <span className="text-neutral-500 font-medium">Grand Total</span>
                    <span className="text-xl font-bold text-neutral-900">Rp {transaction.total_harga.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetail;
