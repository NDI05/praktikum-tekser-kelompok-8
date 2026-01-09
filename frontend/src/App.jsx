import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import POS from './pages/POS';
import Reports from './pages/Reports';
import FeedbackForm from './pages/FeedbackForm';
import FeedbackList from './pages/FeedbackList';
import Menu from './pages/Menu';
import Customers from './pages/Customers';
import Employees from './pages/Employees';
import TransactionDetail from './pages/TransactionDetail';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  if (!token || !user.role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if unauthorized
    if (user.role === 'OWNER') return <Navigate to="/dashboard" replace />;
    if (user.role === 'KARYAWAN') return <Navigate to="/pos" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/feedback/:transactionId" element={<FeedbackForm />} />

        <Route element={<Layout />}>
          {/* Owner Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/employees" element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <Employees />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/transactions/:id" element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <TransactionDetail />
            </ProtectedRoute>
          } />

          {/* Karyawan Routes */}
          <Route path="/pos" element={
            <ProtectedRoute allowedRoles={['KARYAWAN']}>
              <POS />
            </ProtectedRoute>
          } />
          <Route path="/menu" element={
            <ProtectedRoute allowedRoles={['KARYAWAN', 'OWNER']}>
              <Menu />
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute allowedRoles={['KARYAWAN']}>
              <Customers />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute allowedRoles={['KARYAWAN']}>
              <FeedbackList />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
