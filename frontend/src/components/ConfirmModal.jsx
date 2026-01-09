import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-900">{title || 'Confirm Delete'}</h3>
                        <p className="text-sm text-neutral-500 mt-1">{message || 'Are you sure you want to delete this item? This action cannot be undone.'}</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-neutral-400 hover:text-neutral-600 p-1 rounded-full hover:bg-neutral-100 -mt-1 -mr-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2.5 text-neutral-600 hover:bg-neutral-100 rounded-xl font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium shadow-sm shadow-red-600/20 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
