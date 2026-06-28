import { Routes, Route , useLocation   } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/user/Home";
import "./App.css";
import Navbar from "./components/common/Navbar";
import SearchBus from "./pages/user/SearchBus";
import BusDetails from "./pages/user/BusDetails";
import SeatSelection from "./pages/user/SeatSelection";
// import PassengerInfo from "./pages/user/PassengerInfo";
import Payment from "./pages/user/Payment";
import BookingSuccess from "./pages/user/BookingSuccess";
import MyBookings from "./pages/user/MyBookings";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import OtpVerification from "./pages/auth/OtpVerification";
import ResetPassword from "./pages/auth/ResetPassword";
// import ProtectedRoute from "./components/context/ProtectedRoute";
import Profile from "./pages/user/Profile";
import OffersNav from "./components/common/OffersNav";
import Contact from "./components/home/Contact";
import Booking from "./pages/user/Booking";
import Ticket from "./pages/user/Ticket";
// import NotFound from "./components/common/NotFound";
import AdminRoutes from "./routes/admin/AdminRoutes";
import AdminProtectedRoute from "./routes/admin/AdminProtectedRoutes";

function App() {
   const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

 
  return (
    <>
        {!isAdminRoute && <Navbar />} 
        {/* <Navbar/> */}

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/search-bus" element={<SearchBus />}></Route>

        <Route path="/bus/:id" element={<BusDetails />}></Route>
        <Route path="/seat-selection/:id" element={<SeatSelection />} />
        <Route path="/passenger-info" element={<Booking />}></Route>

        <Route path="/payment" element={<Payment />} />
        <Route path="/booking-success" element={<BookingSuccess />} />

        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>

        <Route path="/forgot-password" element={<ForgotPassword />}>
          {" "}
        </Route>
        <Route path="/verify-otp/:email" element={<OtpVerification />}>
          {" "}
        </Route>

        <Route path="/verify-reset-otp/:email" element={<ResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />}>
          {" "}
        </Route>

        <Route path="/profile" element={<Profile />}></Route>

        <Route path="/offers" element={<OffersNav />}></Route>

        <Route path="/contact" element={<Contact />}></Route>

        <Route path="/booking" element={<Booking />} />

        <Route path="/ticket" element={<Ticket />}></Route>

        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminRoutes />
            </AdminProtectedRoute>
          }
        />

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
