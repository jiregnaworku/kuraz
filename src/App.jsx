import { Routes, Route } from "react-router-dom";

import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Home from "./pages/home";
import ProductDetails from "./pages/ProductDetails";

// Customer Pages
import CustomerOrder from "./pages/Order";
import Collection from "./pages/AllCollection";
import Profile from "./pages/user/Profile";
import UserOrders from "./pages/user/UserOrders";
import Messages from "./pages/user/Messages";
import Notifications from "./pages/user/Notifications";
import Settings from "./pages/user/Settings";

// Admin Pages
import Admin from "./pages/admin/admin";
import AdminOrder from "./pages/admin/AdminOrder";
import Products from "./pages/admin/products";
import Users from "./pages/admin/AdminUser";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Protected Route
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";

function App() {
  return (
    <Routes>
      {/* ================= CUSTOMER WEBSITE ================= */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/signin" element={<Signin />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/profile" element={<Profile />}>
          <Route path="orders" element={<UserOrders />} />

          <Route path="messages" element={<Messages />} />

          <Route path="notifications" element={<Notifications />} />

          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Product Details */}
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Customer Order Page */}
        <Route path="/order/:id" element={<CustomerOrder />} />
      </Route>

      {/* ================= ADMIN DASHBOARD ================= */}

      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Admin />} />

        {/* Products */}
        <Route path="products" element={<Products />} />

        {/* Orders */}
        <Route path="orders" element={<AdminOrder />} />

        {/* Users */}
        <Route path="users" element={<Users />} />
      </Route>

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <div className="mt-40 text-center">
            <h1 className="text-4xl font-bold text-[#24312c]">
              404 - Page Not Found
            </h1>

            <p className="mt-3 text-gray-500">
              The page you're looking for doesn't exist.
            </p>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
