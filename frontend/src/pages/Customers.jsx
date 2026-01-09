import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X, Phone, MapPin, User } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        nama: '',
        no_hp: '',
        alamat: ''
    });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get((import.meta.env.VITE_API_URL || '') + '/api/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await axios.put((import.meta.env.VITE_API_URL || '') + `/api/customers/${editingItem.id}`, formData);
            } else {
                await axios.post((import.meta.env.VITE_API_URL || '') + '/api/customers', formData);
            }
            setShowModal(false);
            setEditingItem(null);
            setFormData({ nama: '', no_hp: '', alamat: '' });
            fetchCustomers();
        } catch (error) {
            console.error('Error saving customer', error);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            nama: item.nama,
            no_hp: item.no_hp || '',
            alamat: item.alamat || ''
        });
        setShowModal(true);
    };

    const openDeleteModal = (customer) => {
        setCustomerToDelete(customer);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!customerToDelete) return;
        try {
            await axios.delete((import.meta.env.VITE_API_URL || '') + `/api/customers/${customerToDelete.id}`);
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer', error);
        } finally {
            setDeleteModalOpen(false);
            setCustomerToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl shadow-sm border border-neutral-100">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Customer Management</h2>
                    <p className="text-neutral-500 text-sm">Manage your customer database</p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({ nama: '', no_hp: '', alamat: '' });
                        setShowModal(true);
                    }}
                    className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Customer</span>
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-neutral-50 border-b border-neutral-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Address</th>
                            <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {customers.map((item) => (
                            <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                                            {item.nama.charAt(0).toUpperCase()}
                                        </div>
                                        <span>{item.nama}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-neutral-600">
                                    <div className="flex items-center space-x-2">
                                        <Phone className="w-4 h-4 text-neutral-400" />
                                        <span>{item.no_hp || '-'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-neutral-600">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4 text-neutral-400" />
                                        <span>{item.alamat || '-'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(item)}
                                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {customers.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-neutral-500">
                                    No customers found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {customers.map((item) => (
                    <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                                    {item.nama.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-neutral-900">{item.nama}</h3>
                                    <p className="text-xs text-neutral-500">ID: #{item.id}</p>
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => openDeleteModal(item)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm text-neutral-600 bg-neutral-50 p-4 rounded-2xl">
                            <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-neutral-400" />
                                <span>{item.no_hp || 'No phone'}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-4 h-4 text-neutral-400" />
                                <span>{item.alamat || 'No address'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-neutral-900">{editingItem ? 'Edit Customer' : 'Add Customer'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600 p-1 rounded-full hover:bg-neutral-100">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    value={formData.no_hp}
                                    onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Address</label>
                                <textarea
                                    className="w-full border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    value={formData.alamat}
                                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 text-neutral-600 hover:bg-neutral-100 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-600/20 transition-colors"
                                >
                                    Save Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Delete Customer"
                message={`Are you sure you want to delete "${customerToDelete?.nama}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => { setDeleteModalOpen(false); setCustomerToDelete(null); }}
            />
        </div>
    );
};

export default Customers;
