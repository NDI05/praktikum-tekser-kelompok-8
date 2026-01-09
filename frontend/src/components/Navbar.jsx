import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FileText,
    LogOut,
    Menu as MenuIcon,
    ShoppingBag,
    MessageSquare,
    User,
    X
} from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const NavLink = ({ to, icon: Icon, label, onClick }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                onClick={onClick}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-emerald-600'
                    }`}
            >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                <span className="font-medium">{label}</span>
            </Link>
        );
    };

    const ownerLinks = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/menu', icon: MenuIcon, label: 'Menu' },
        { to: '/employees', icon: Users, label: 'Karyawan' },
        { to: '/reports', icon: FileText, label: 'Laporan' },
    ];

    const employeeLinks = [
        { to: '/pos', icon: ShoppingBag, label: 'POS' },
        { to: '/menu', icon: MenuIcon, label: 'Menu' },
        { to: '/customers', icon: User, label: 'Pelanggan' },
        { to: '/feedback', icon: MessageSquare, label: 'Feedback' },
    ];

    const links = role === 'OWNER' ? ownerLinks : employeeLinks;

    return (
        <nav className="bg-white border-b border-neutral-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Desktop Nav */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">O</span>
                            </div>
                            <span className="font-bold text-xl text-neutral-900 hidden sm:block">Warung Oyako</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:ml-10 md:flex md:space-x-2">
                            {links.map((link) => (
                                <NavLink key={link.to} {...link} />
                            ))}
                        </div>
                    </div>

                    {/* User Profile & Logout (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center space-x-3 px-4 py-2 bg-neutral-50 rounded-xl border border-neutral-100">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                                {user.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-neutral-900">{user.username}</span>
                                <span className="text-xs text-neutral-500">{role}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 focus:outline-none"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <MenuIcon className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-neutral-100 absolute w-full shadow-lg">
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        {/* User Info Mobile */}
                        <div className="flex items-center space-x-3 px-4 py-3 mb-2 bg-neutral-50 rounded-xl">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                                {user.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <p className="font-bold text-neutral-900">{user.username}</p>
                                <p className="text-xs text-neutral-500">{role}</p>
                            </div>
                        </div>

                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                {...link}
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                        ))}

                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleLogout();
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
