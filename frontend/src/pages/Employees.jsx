import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Search, User, Phone, Mail, Briefcase, Hash } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        noHp: '',
        jabatan: 'KARYAWAN',
        username: '',
        password: '' // Only for creation
    });
    const [editingId, setEditingId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get((import.meta.env.VITE_API_URL || '') + '/api/employees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(response.data);
        } catch (error) {
            console.error('Failed to fetch employees', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put((import.meta.env.VITE_API_URL || '') + `/api/employees/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post((import.meta.env.VITE_API_URL || '') + '/api/employees', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchEmployees();
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Failed to save employee', error);
            alert('Failed to save employee: ' + (error.response?.data?.error || error.message));
        }
    };

    const openDeleteModal = (employee) => {
        setEmployeeToDelete(employee);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!employeeToDelete) return;
        try {
            await axios.delete((import.meta.env.VITE_API_URL || '') + `/api/employees/${employeeToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEmployees();
        } catch (error) {
            console.error('Failed to delete employee', error);
        } finally {
            setDeleteModalOpen(false);
            setEmployeeToDelete(null);
        }
    };

    const resetForm = () => {
        setFormData({
            nama: '',
            email: '',
            noHp: '',
            jabatan: 'KARYAWAN',
            username: '',
            password: ''
        });
        setEditingId(null);
    };

    const openEditModal = (employee) => {
        setFormData({
            nama: employee.nama,
            email: employee.email || '',
            noHp: employee.noHp || '',
            jabatan: employee.jabatan,
            idKaryawan: employee.idKaryawan,
            username: employee.user.username,
            password: '' // Don't populate password
        });
        setEditingId(employee.id);
        setIsModalOpen(true);
    };

    const filteredEmployees = employees.filter(emp =>
        emp.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.idKaryawan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl shadow-sm border border-neutral-100">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Karyawan</h2>
                    <p className="text-neutral-500">Manage your staff members.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Employee</span>
                </button>
            </div>

            <div className="bg-white p-4 rounded-3xl shadow-sm border border-neutral-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => (
                    <div key={employee.id} className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                                {employee.nama.charAt(0)}
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditModal(employee)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => openDeleteModal(employee)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-neutral-900 mb-1">{employee.nama}</h3>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 mb-4">
                            {employee.jabatan}
                        </span>

                        <div className="space-y-2 text-sm text-neutral-500">
                            <div className="flex items-center space-x-2">
                                <Hash className="w-4 h-4" />
                                <span>{employee.idKaryawan}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <User className="w-4 h-4" />
                                <span>{employee.user.username}</span>
                            </div>
                            {employee.noHp && (
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{employee.noHp}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                            <h3 className="text-xl font-bold text-neutral-900">
                                {editingId ? 'Edit Employee' : 'New Employee'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Jabatan</label>
                                <select
                                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    value={formData.jabatan}
                                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                                >
                                    <option value="OWNER">Owner</option>
                                    <option value="HEAD_COOK">Head Cook</option>
                                    <option value="KARYAWAN">Karyawan</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                        value={formData.noHp}
                                        onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                                    />
                                </div>
                            </div>

                            {!editingId && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Username</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 mt-4"
                            >
                                {editingId ? 'Save Changes' : 'Create Employee'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Delete Employee"
                message={`Are you sure you want to delete "${employeeToDelete?.nama}"? This will also delete their user account.`}
                onConfirm={handleDelete}
                onCancel={() => { setDeleteModalOpen(false); setEmployeeToDelete(null); }}
            />
        </div>
    );
};

export default Employees;
