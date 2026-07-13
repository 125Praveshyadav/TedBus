import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import Dashboard from "../../pages/admin/Dashboard";
import ManageBuses from "../../pages/admin/ManageBuses";
import AddBus from "../../pages/admin/AddBus";
import EditBus from "../../pages/admin/EditBus";
import ManageRoutes from "../../pages/admin/ManageRoutes";
import ManageBookings from "../../pages/admin/ManageBookings";
import ManageUsers from "../../pages/admin/ManageUsers";
import ManagePayments from "../../pages/admin/ManagePayments";
import ManageReviews from "../../pages/admin/ManageReviews";
import Reports from "../../pages/admin/Reports";
import Settings from "../../pages/admin/Settings";
import AdminProfile from "../../pages/admin/AdminProfile";
import ManageCoupons from "../../pages/admin/ManageCoupons";

// --- Naye Community Admin Pages ---
import CommunityAdmin from "../../pages/admin/CommunityAdmin";
import ManageCommunityPosts from "../../pages/admin/ManageCommunityPosts";
import ManageCommunityForums from "../../pages/admin/ManageCommunityForums";
import ManageCommunityReports from "../../pages/admin/ManageCommunityReports";
import CommunityStats from "../../pages/admin/CommunityStats";
import SendNotification from "../../pages/admin/SendNotification";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="buses" element={<ManageBuses />} />
        <Route path="buses/add" element={<AddBus />} />
        <Route path="buses/edit/:id" element={<EditBus />} />

        <Route path="routes" element={<ManageRoutes />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="users" element={<ManageUsers />} />

        {/* 👉 Naye Community Admin Routes */}
         <Route path="community" element={<CommunityAdmin />} />
        <Route path="community-posts" element={<ManageCommunityPosts />} />
        <Route path="community-stats" element={<CommunityStats />} />
        <Route path="community-forums" element={<ManageCommunityForums />} />
        <Route path="community-reports" element={<ManageCommunityReports />} />

        <Route path="payments" element={<ManagePayments />} />
        <Route path="reviews" element={<ManageReviews />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="coupons" element={<ManageCoupons />} />
        <Route path="send-notification" element={<SendNotification />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;