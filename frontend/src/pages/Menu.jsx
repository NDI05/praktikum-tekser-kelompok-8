import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Renamed from showModal
    const [editingItem, setEditingItem] = useState(null);
    const [filter, setFilter] = useState(''); // '' = All
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [formData, setFormData] = useState({
        nama: '',
        jenis: 'MAKANAN',
        harga: '',
        deskripsi: '',
        gambar: ''
    });

    useEffect(() => {
        fetchMenu();
    }, [filter]); // Re-fetch when filter changes

    const fetchMenu = async () => {
        try {
            const url = filter
                ? `${import.meta.env.VITE_API_URL || ''}/api/menu?jenis=${filter}`
                : (import.meta.env.VITE_API_URL || '') + '/api/menu';
            const response = await axios.get(url);
            setMenuItems(response.data); // Kept setMenuItems, assuming instruction's setMenu was a typo
        } catch (error) {
            console.error('Error fetching menu', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('nama', formData.nama);
            data.append('jenis', formData.jenis);
            data.append('harga', formData.harga);
            data.append('deskripsi', formData.deskripsi);
            if (formData.imageFile) {
                data.append('image', formData.imageFile);
            } else if (formData.gambar) {
                data.append('gambar', formData.gambar);
            }

            if (editingItem) {
                await axios.put((import.meta.env.VITE_API_URL || '') + `/api/menu/${editingItem.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post((import.meta.env.VITE_API_URL || '') + '/api/menu', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setIsModalOpen(false);
            setEditingItem(null);
            setFormData({ nama: '', jenis: 'MAKANAN', harga: '', deskripsi: '', gambar: '', imageFile: null, preview: null });
            fetchMenu();
        } catch (error) {
            console.error('Error saving menu', error);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            nama: item.nama,
            jenis: item.jenis,
            harga: item.harga,
            deskripsi: item.deskripsi || '',
            gambar: item.gambar || ''
        });
        setIsModalOpen(true); // Changed from setShowModal
    };

    const openDeleteModal = (item) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            await axios.delete((import.meta.env.VITE_API_URL || '') + `/api/menu/${itemToDelete.id}`);
            fetchMenu();
        } catch (error) {
            console.error('Error deleting menu', error);
        } finally {
            setDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl shadow-sm border border-neutral-100">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Menu Management</h2>
                    <p className="text-neutral-500 text-sm">Manage your food and drink items</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-neutral-600"
                    >
                        <option value="">All Categories</option>
                        <option value="MAKANAN">Makanan</option>
                        <option value="MINUMAN">Minuman</option>
                        <option value="SNACK">Snack</option>
                    </select>
                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setFormData({ nama: '', jenis: 'MAKANAN', harga: '', deskripsi: '', gambar: '' });
                            setIsModalOpen(true);
                        }}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Item</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {menuItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden group hover:shadow-md transition-all">
                        <div className="h-48 bg-neutral-50 relative overflow-hidden">
                            {item.gambar ? (
                                <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white text-blue-600 transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => openDeleteModal(item)}
                                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white text-red-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-neutral-900">{item.nama}</h3>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ml-2 ${item.jenis === 'MAKANAN' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {item.jenis}
                                </span>
                            </div>
                            <p className="text-sm text-neutral-500 mb-4 min-h-[2.5rem]">{item.deskripsi || 'No description'}</p>
                            <p className="text-lg font-bold text-emerald-600">Rp {item.harga.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-neutral-900">{editingItem ? 'Edit Menu' : 'Add Menu'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-600 p-1 rounded-full hover:bg-neutral-100">
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
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Category</label>
                                <select
                                    className="w-full border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white transition-all"
                                    value={formData.jenis}
                                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                                >
                                    <option value="MAKANAN">Makanan</option>
                                    <option value="MINUMAN">Minuman</option>
                                    <option value="SNACK">Snack</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Price</label>
                                <input
                                    type="number"
                                    className="w-full border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    value={formData.harga}
                                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
                                <textarea
                                    className="w-full border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    value={formData.deskripsi}
                                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                    rows="2"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Image</label>
                                <div className="flex items-center space-x-4">
                                    <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0 border border-neutral-200">
                                        {formData.preview ? (
                                            <img src={formData.preview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : formData.gambar ? (
                                            <img src={formData.gambar} alt="Current" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setFormData({
                                                        ...formData,
                                                        imageFile: file,
                                                        preview: URL.createObjectURL(file)
                                                    });
                                                }
                                            }}
                                        />
                                        <p className="text-xs text-neutral-400 mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-neutral-600 hover:bg-neutral-100 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium shadow-sm shadow-emerald-600/20 transition-colors"
                                >
                                    Save Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Delete Menu Item"
                message={`Are you sure you want to delete "${itemToDelete?.nama}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => { setDeleteModalOpen(false); setItemToDelete(null); }}
            />
        </div>
    );
};

export default Menu;
