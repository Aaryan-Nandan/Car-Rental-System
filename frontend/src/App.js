import {
    BrowserRouter,
    Routes,
    Route
}
from "react-router-dom";

import Home
from "./pages/Home";

import BookingPage
from "./pages/BookingPage";

import RegisterPage
from "./pages/RegisterPage";

import LoginPage
from "./pages/LoginPage";

import MyBookings
from "./pages/MyBookings";

import MyPayments
from "./pages/MyPayments";

import AdminDashboard
from "./pages/AdminDashboard";

import AdminLogin
from "./pages/AdminLogin";

import ProfilePage
from "./pages/ProfilePage";

import ManageCars
from "./pages/ManageCars";

import ManageReviews
from "./pages/ManageReviews";

import PaymentPage
from "./pages/PaymentPage";

import ReviewPage
from "./pages/ReviewPage";

import Navbar
from "./components/Navbar";

import ProtectedRoute
from "./components/ProtectedRoute";

import AdminProtectedRoute
from "./components/AdminProtectedRoute";

import ForgotPasswordPage
from "./pages/ForgotPasswordPage";

import SuccessRegistration
from "./pages/SuccessRegistration";

import "./App.css";
import ChatBot from "./components/ChatBot";


function App() {

    return (

        <BrowserRouter>

            <Navbar />
 <ChatBot />
            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />


                <Route
                    path="/register"
                    element={<RegisterPage />}
                />


                <Route
                    path="/login"
                    element={<LoginPage />}
                />


                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                />


                <Route
                    path="/admin-login"
                    element={<AdminLogin />}
                />


                <Route
                    path="/registration-success"
                    element={<SuccessRegistration />}
                />


                <Route
                    path="/booking/:id"
                    element={
                        <ProtectedRoute>
                            <BookingPage />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/my-bookings"
                    element={
                        <ProtectedRoute>
                            <MyBookings />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/my-payments"
                    element={
                        <ProtectedRoute>
                            <MyPayments />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/payment/:bookingId/:amount"
                    element={
                        <ProtectedRoute>
                            <PaymentPage />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/review/:variantId"
                    element={
                        <ProtectedRoute>
                            <ReviewPage />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/admin-dashboard"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                />


                <Route
                    path="/manage-cars"
                    element={
                        <AdminProtectedRoute>
                            <ManageCars />
                        </AdminProtectedRoute>
                    }
                />


                <Route
                    path="/manage-reviews"
                    element={
                        <AdminProtectedRoute>
                            <ManageReviews />
                        </AdminProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;