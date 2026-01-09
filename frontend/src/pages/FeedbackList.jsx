import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, MessageSquare } from 'lucide-react';

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get((import.meta.env.VITE_API_URL || '') + '/api/feedback');
                setFeedbacks(response.data);
            } catch (error) {
                console.error('Error fetching feedback', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    if (loading) return <div>Loading feedback...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl shadow-sm border border-neutral-100">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Customer Feedback</h2>
                    <p className="text-neutral-500 text-sm">Manage your customer feedback</p>
                </div>
            </div>

            <div className="grid gap-4">
                {feedbacks.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {item.komentar && (
                            <div className="flex items-start space-x-3 text-gray-700 bg-gray-50 p-4 rounded-lg">
                                <MessageSquare className="w-5 h-5 mt-1 text-gray-400" />
                                <p>{item.komentar}</p>
                            </div>
                        )}

                        <div className="mt-4 text-sm text-gray-500 flex justify-between">
                            <span>Transaction ID: #{item.transaksiId}</span>
                            <span>Customer: {item.transaksi?.pelanggan?.nama || 'Guest'}</span>
                        </div>
                    </div>
                ))}

                {feedbacks.length === 0 && (
                    <div className="text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-100">
                        No feedback received yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackList;
