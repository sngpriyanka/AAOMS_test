// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import ProductListing from './pages/ProductListing/ProductListing';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Cart from './pages/Cart/Cart';
import OurStory from './components/OurStory/OurStory';
import Wishlist from './pages/Wishlist/Wishlist';
import Orders from './pages/Orders/Orders';
import './App.css';
import TrackOrder from './pages/TrackOrder/TrackOrder';
import Account from './pages/Account/Account';
import Contact from './pages/Contact/Contact';
import ScrollRestoration from './components/ScrollRestoration';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminPanel/AdminDashboard';
import SuperAdminDashboard from './pages/AdminPanel/SuperAdminDashboard';
import ManageUsers from './pages/AdminPanel/ManageUsers';
import ManageAdmins from './pages/AdminPanel/ManageAdmins';
import ManageProducts from './pages/AdminPanel/ManageProducts';
import UserManagement from './pages/AdminPanel/UserManagement';
import OrderManagement from './pages/AdminPanel/OrderManagement';
import CustomerManagement from './pages/AdminPanel/CustomerManagement';
import PaymentsRevenue from './pages/AdminPanel/PaymentsRevenue';
import AuditLogs from './pages/AdminPanel/AuditLogs';
import Notifications from './pages/AdminPanel/Notifications';
import AdminReports from './pages/AdminPanel/AdminReports';
import Analytics from './pages/AdminPanel/Analytics';
import AdminSettings from './pages/AdminPanel/AdminSettings';
import ReviewsManagement from './pages/AdminPanel/ReviewsManagement';
import AllUsers from './pages/AdminPanel/AllUsers';
import SystemSettings from './pages/AdminPanel/SystemSettings';
import PurchaseHistory from './pages/AdminPanel/PurchaseHistory';


function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollRestoration />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/track-order" element={<TrackOrder/>} />
            <Route path="/account" element={<Account />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/collection" element={<ProductListing />} />
            <Route path="/category/:category" element={<ProductListing />} />
            <Route path="/curated/:category" element={<ProductListing />} />
            <Route path="/collections/:category" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/search" element={<ProductListing />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/track-order" element={<div className="static-page"><h1>Track Order</h1></div>} />
            <Route path="/account" element={<div className="static-page"><h1>My Account</h1></div>} />
            <Route path="/account/orders" element={<div className="static-page"><h1>My Orders</h1></div>} />
            <Route path="/contact" element={<div className="static-page"><h1>Contact Us</h1></div>} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment/success" element={<CheckoutPage />} />
            <Route path="/payment/failure" element={<CheckoutPage />} />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <ManageUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <ManageProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <OrderManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/notifications" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reviews" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <ReviewsManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/customers" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <CustomerManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/payments" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <PaymentsRevenue />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/purchases" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <PurchaseHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminReports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/audit" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AuditLogs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettings />
                </ProtectedRoute>
              } 
            />

            {/* Super Admin Routes */}
            <Route 
              path="/super-admin" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin/users" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin/admins" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <ManageAdmins />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin/products" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <ManageProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin/orders" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <OrderManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin/customers" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <CustomerManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin/payments" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <PaymentsRevenue />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin/purchases" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <PurchaseHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin/reports" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <AdminReports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin/notifications" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin/audit" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <AuditLogs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin/analytics" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin/system" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <SystemSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin/settings" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <AdminSettings />
                </ProtectedRoute>
              } 
            />
          </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;