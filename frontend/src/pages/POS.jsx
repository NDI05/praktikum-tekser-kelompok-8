import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingBag, Minus, Plus, Trash2, X, ChevronRight, Coffee, ArrowRight, User } from 'lucide-react';

const POS = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showMobileCart, setShowMobileCart] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Customer Selection State
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(''); // '' means Guest
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchMenu();
        fetchCustomers();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await axios.get((import.meta.env.VITE_API_URL || '') + '/api/menu');
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await axios.get((import.meta.env.VITE_API_URL || '') + '/api/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers', error);
        }
    };

    const addToCart = (item) => {
        const existingItem = cart.find((c) => c.id === item.id);
        if (existingItem) {
            setCart(cart.map((c) =>
                c.id === item.id ? { ...c, qty: c.qty + 1 } : c
            ));
        } else {
            setCart([...cart, { ...item, qty: 1 }]);
            setIsCartOpen(true);
        }
    };

    const updateQty = (id, delta) => {
        setCart(cart.map((item) => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                return newQty > 0 ? { ...item, qty: newQty } : item;
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + (item.harga * item.qty), 0);
    };

    const handleCheckoutClick = () => {
        if (cart.length === 0) return;
        setIsCheckoutModalOpen(true);
    };

    const confirmCheckout = async () => {
        try {
            if (!user.karyawanId) {
                alert('Error: You must be logged in as a Karyawan to perform transactions.');
                return;
            }

            const transactionData = {
                items: cart.map(item => ({ menuId: item.id, qty: item.qty })),
                karyawanId: user.karyawanId,
                pelangganId: selectedCustomerId ? parseInt(selectedCustomerId) : null
            };

            await axios.post((import.meta.env.VITE_API_URL || '') + '/api/transactions', transactionData);
            alert('Transaction successful!');
            setCart([]);
            setShowMobileCart(false);
            setIsCartOpen(false);
            setIsCheckoutModalOpen(false);
            setSelectedCustomerId(''); // Reset to Guest
        } catch (error) {
            console.error('Checkout failed', error);
            alert('Checkout failed');
        }
    };

    const filteredMenu = menuItems.filter(item =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === 'All' || item.jenis === selectedCategory)
    );

    return (
        <div className="h-[calc(100vh-2rem)] flex gap-4">
            {/* Left Side - Menu Grid */}
            <div className="flex-1 flex flex-col min-w-0 bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900">Point of Sale</h2>
                        <p className="text-xs text-neutral-500">Select items to add to order</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search menu..."
                            className="pl-9 pr-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar bg-neutral-50/50">
                    {['All', 'MAKANAN', 'MINUMAN', 'SNACK'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredMenu.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => addToCart(item)}
                                className="bg-white p-3 rounded-2xl border border-neutral-100 hover:border-emerald-500/50 hover:shadow-md cursor-pointer transition-all group"
                            >
                                <div className="aspect-square rounded-xl bg-neutral-100 mb-3 overflow-hidden relative">
                                    {item.gambar ? (
                                        <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                            <Coffee className="w-8 h-8" />
                                        </div>
                                    )}
                                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="font-bold text-neutral-900 text-sm truncate">{item.nama}</h3>
                                <p className="text-emerald-600 font-bold text-sm">Rp {item.harga.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Cart */}
            <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 lg:relative lg:transform-none lg:w-96 lg:shadow-sm lg:rounded-3xl lg:border lg:border-neutral-100 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white rounded-t-3xl">
                    <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                        Current Order
                    </h2>
                    <button onClick={() => setIsCartOpen(false)} className="lg:hidden p-2 hover:bg-neutral-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4">
                            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 opacity-50" />
                            </div>
                            <p className="text-sm">Your cart is empty</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                    {item.gambar ? (
                                        <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                            <Coffee className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-neutral-900 text-sm truncate">{item.nama}</h4>
                                        <p className="text-xs font-medium text-neutral-500">Rp {(item.harga * item.qty).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-3 bg-white rounded-lg border border-neutral-200 px-2 py-1">
                                            <button onClick={() => updateQty(item.id, -1)} className="text-neutral-400 hover:text-red-500 transition-colors">
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                            <button onClick={() => updateQty(item.id, 1)} className="text-neutral-400 hover:text-emerald-500 transition-colors">
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-red-500 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-white border-t border-neutral-100 rounded-b-3xl">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm text-neutral-500">
                            <span>Subtotal</span>
                            <span>Rp {getTotal().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-neutral-900">
                            <span>Total</span>
                            <span>Rp {getTotal().toLocaleString()}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleCheckoutClick}
                        disabled={cart.length === 0 || loading}
                        className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <span>Checkout</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Checkout Modal */}
            {isCheckoutModalOpen && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-neutral-900">Confirm Order</h3>
                            <button onClick={() => setIsCheckoutModalOpen(false)} className="text-neutral-400 hover:text-neutral-600 p-1 rounded-full hover:bg-neutral-100">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                                <div className="flex justify-between text-sm text-neutral-500 mb-2">
                                    <span>Total Items</span>
                                    <span>{cart.reduce((acc, item) => acc + item.qty, 0)} items</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-neutral-900">
                                    <span>Total Amount</span>
                                    <span>Rp {getTotal().toLocaleString()}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Select Customer</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                    <select
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white appearance-none transition-all"
                                        value={selectedCustomerId}
                                        onChange={(e) => setSelectedCustomerId(e.target.value)}
                                    >
                                        <option value="">Guest (No Customer)</option>
                                        {customers.map((customer) => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.nama} {customer.no_hp ? `(${customer.no_hp})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <ChevronRight className="w-4 h-4 text-neutral-400 rotate-90" />
                                    </div>
                                </div>
                                <p className="text-xs text-neutral-500 mt-2 ml-1">
                                    Select a registered customer or proceed as Guest.
                                </p>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    onClick={() => setIsCheckoutModalOpen(false)}
                                    className="flex-1 py-3 text-neutral-600 hover:bg-neutral-100 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmCheckout}
                                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                                >
                                    Confirm Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default POS;
