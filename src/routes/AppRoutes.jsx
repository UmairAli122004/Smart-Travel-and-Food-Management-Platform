import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from './AuthGuard';
import RoleGuard from './RoleGuard';
import PublicRoute from './PublicRoute';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import VendorLayout from '../layouts/VendorLayout';
import PassengerLayout from '../layouts/PassengerLayout';
import Loading from '../components/common/Loading';
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';
import { useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import GlobalCart from '../components/common/GlobalCart';
const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const RegisterPage = lazy(() => import('../pages/Register/RegisterPage'));
const VendorLoginPage = lazy(() => import('../pages/Login/VendorLoginPage'));
const VendorRegisterPage = lazy(() => import('../pages/Register/VendorRegisterPage'));
const OAuth2RedirectHandler = lazy(() => import('../pages/Login/OAuth2RedirectHandler'));
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'));
const AdminRestaurants = lazy(() => import('../pages/Admin/Restaurants'));
const AdminCategoryManagement = lazy(() => import('../pages/Admin/Categories/AdminCategoryManagement'));
const AdminMenuItemManagement = lazy(() => import('../pages/Admin/MenuItems/AdminMenuItemManagement'));
const AdminReviewManagement = lazy(() => import('../pages/Admin/Reviews/AdminReviewManagement'));
const AdminStations = lazy(() => import('../pages/Admin/Stations/AdminStations'));
const AdminOrders = lazy(() => import('../pages/Admin/Orders/AdminOrders'));
const AdminUsers = lazy(() => import('../pages/Admin/Users/UserManagement'));
const AdminComplaintManagement = lazy(() => import('../pages/Admin/Complaints/ComplaintManagement'));
const VendorDashboard = lazy(() => import('../pages/Vendor/Dashboard'));
const VendorRestaurants = lazy(() => import('../pages/Vendor/Restaurants'));
const VendorCategoryManagement = lazy(() => import('../pages/Vendor/Categories/CategoryManagement'));
const VendorMenuItemManagement = lazy(() => import('../pages/Vendor/MenuItems/MenuItemManagement'));
const VendorReviewManagement = lazy(() => import('../pages/Vendor/Reviews/ReviewManagement'));
const VendorComplaintManagement = lazy(() => import('../pages/Vendor/Complaints/ComplaintManagement'));
const VendorOrders = lazy(() => import('../pages/Vendor/Orders/OrderManagement'));
const PassengerDashboard = lazy(() => import('../pages/Passenger/Dashboard'));
const PassengerProfileSetup = lazy(() => import('../pages/Passenger/ProfileSetup'));
const PassengerMyJourneys = lazy(() => import('../pages/Passenger/Journeys/MyJourneys'));
const PassengerJourneySelector = lazy(() => import('../pages/Passenger/OrderFood/JourneySelector'));
const PassengerRestaurantList = lazy(() => import('../pages/Passenger/OrderFood/RestaurantList'));
const PassengerRestaurantDetails = lazy(() => import('../pages/Passenger/OrderFood/RestaurantDetails'));
const PassengerMyOrders = lazy(() => import('../pages/Passenger/Orders/MyOrders'));
const PassengerMyComplaints = lazy(() => import('../pages/Passenger/Complaints/ComplaintList'));
const PlaceOrderPage = lazy(() => import('../pages/Passenger/OrderFood/PlaceOrderPage'));
const LandingPage = lazy(() => import('../pages/Landing/LandingPage'));
const RestaurantDiscoveryPage = lazy(() => import('../pages/Landing/RestaurantDiscoveryPage'));
const FoodTypeMenuPage = lazy(() => import('../pages/Landing/FoodTypeMenuPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CartProvider>
        <Routes>
          {}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/vendor/login" element={<VendorLoginPage />} />
              <Route path="/vendor/register" element={<VendorRegisterPage />} />
            </Route>
          </Route>
          {}
          <Route element={<AuthGuard />}>
            {}
            <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/restaurants" element={<AdminRestaurants />} />
                <Route path="/admin/restaurants/:restaurantId/categories" element={<AdminCategoryManagement />} />
                <Route path="/admin/restaurants/:restaurantId/menu-items" element={<AdminMenuItemManagement />} />
                <Route path="/admin/restaurants/:restaurantId/reviews" element={<AdminReviewManagement />} />
                <Route path="/admin/stations" element={<AdminStations />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/complaints" element={<AdminComplaintManagement />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              </Route>
            </Route>
            {}
            <Route element={<RoleGuard allowedRoles={['VENDOR']} />}>
              <Route element={<VendorLayout />}>
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/vendor/restaurants" element={<VendorRestaurants />} />
                <Route path="/vendor/restaurants/:restaurantId/categories" element={<VendorCategoryManagement />} />
                <Route path="/vendor/categories/:categoryId/menu-items" element={<VendorMenuItemManagement />} />
                <Route path="/vendor/restaurants/:restaurantId/reviews" element={<VendorReviewManagement />} />
                <Route path="/vendor/complaints" element={<VendorComplaintManagement />} />
                <Route path="/vendor/orders" element={<VendorOrders />} />
                <Route path="/vendor" element={<Navigate to="/vendor/dashboard" replace />} />
              </Route>
            </Route>
            {}
            <Route element={<RoleGuard allowedRoles={['PASSENGER']} />}>
              <Route element={<PassengerLayout />}>
                <Route path="/passenger/dashboard" element={<PassengerDashboard />} />
                <Route path="/passenger/profile-setup" element={<PassengerProfileSetup />} />
                <Route path="/passenger/journeys" element={<PassengerMyJourneys />} />
                <Route path="/passenger/orders" element={<PassengerMyOrders />} />
                <Route path="/passenger/complaints" element={<PassengerMyComplaints />} />
                <Route path="/passenger/order" element={<PassengerJourneySelector />} />
                <Route path="/passenger/order/:journeyId/restaurants" element={<PassengerRestaurantList />} />
                <Route path="/passenger/order/:journeyId/restaurants/:restaurantId" element={<PassengerRestaurantDetails />} />
                <Route path="/passenger/place-order" element={<PlaceOrderPage />} />
                <Route path="/passenger" element={<Navigate to="/passenger/dashboard" replace />} />
              </Route>
            </Route>
          </Route>
          {}
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/discover" element={<RestaurantDiscoveryPage />} />
          <Route path="/food-type/:foodType" element={<FoodTypeMenuPage />} />
          {}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <GlobalCart />
      </CartProvider>
    </Suspense>
  );
};
export default AppRoutes;
