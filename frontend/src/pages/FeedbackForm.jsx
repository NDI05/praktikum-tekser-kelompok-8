import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const FeedbackForm = () => {
    const { transactionId } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [komentar, setKomentar] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post((import.meta.env.VITE_API_URL || '') + '/api/feedback', {
                transactionId,
                rating,
                komentar
            });
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting feedback', error);
            alert('Failed to submit feedback');
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-green-600" fill="currentColor" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
                    <p className="text-gray-600">Your feedback helps us improve our service.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Rate Your Experience</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center space-x-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`w-10 h-10 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comments (Optional)
                        </label>
                        <textarea
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            rows="4"
                            placeholder="Tell us what you liked or how we can improve..."
                            value={komentar}
                            onChange={(e) => setKomentar(e.target.value)}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={rating === 0}
                        className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;
