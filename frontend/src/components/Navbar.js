import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();


    // =========================================================
    // AUTHENTICATION
    // =========================================================

    const customerToken =
        localStorage.getItem("token");

    const adminToken =
        localStorage.getItem("adminToken");


    // =========================================================
    // CUSTOMER LOGOUT
    // =========================================================

    const handleCustomerLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("customerId");

        localStorage.removeItem("customerEmail");

        localStorage.removeItem("customerName");

        navigate("/login");

    };


    // =========================================================
    // ADMIN LOGOUT
    // =========================================================

    const handleAdminLogout = () => {

        localStorage.removeItem("adminToken");

        localStorage.removeItem("adminEmail");

        navigate("/admin-login");

    };


    // =========================================================
    // AUTH STATUS
    // =========================================================

    const isAdmin =
        !!adminToken;

    const isCustomer =
        !!customerToken &&
        !isAdmin;


    return (

        <>

            <style>
                {`

                /* =================================================
                   NAVBAR
                ================================================= */

                .car-rental-navbar {

                    width: 100%;

                    height: 50px;

                    background: #ffffff;

                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    padding: 0 42px;

                    box-sizing: border-box;

                    position: relative;

                    z-index: 1000;

                    border: none;

                    box-shadow:
                        0 2px 10px
                        rgba(0, 0, 0, 0.06);

                }


                /* =================================================
                   BRAND
                ================================================= */

                .car-rental-brand {

                    display: flex;

                    align-items: center;

                    text-decoration: none;

                    color: #111827;

                    font-size: 27px;

                    font-weight: 900;

                    white-space: nowrap;

                }


                .car-rental-brand-icon {

                    font-size: 27px;

                    margin-right: 8px;

                }


                /* =================================================
                   NAVIGATION
                ================================================= */

                .car-rental-nav {

                    display: flex;

                    align-items: center;

                    gap: 27px;

                    height: 100%;

                }


                .car-rental-nav-link {

                    position: relative;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    height: 100%;

                    text-decoration: none;

                    color: #111827;

                    font-size: 15px;

                    font-weight: 750;

                    cursor: pointer;

                    white-space: nowrap;

                    transition:
                        color 0.25s ease;

                }


                /* =================================================
                   HOVER UNDERLINE
                ================================================= */

                .car-rental-nav-link::after {

                    content: "";

                    position: absolute;

                    left: 0;

                    right: 0;

                    bottom: 9px;

                    height: 3px;

                    background: #2563eb;

                    border-radius: 10px;

                    transform:
                        scaleX(0);

                    transition:
                        transform 0.25s ease;

                }


                .car-rental-nav-link:hover {

                    color: #2563eb;

                }


                .car-rental-nav-link:hover::after {

                    transform:
                        scaleX(1);

                }


                /* =================================================
                   ADMIN DASHBOARD LINK
                ================================================= */

                .admin-dashboard-link {

                    font-weight: 850;

                }


                /* =================================================
                   LOGOUT BUTTON
                ================================================= */

                .car-rental-logout {

                    border: none;

                    background: #ef4444;

                    color: white;

                    padding: 8px 16px;

                    border-radius: 8px;

                    font-size: 14px;

                    font-weight: 800;

                    cursor: pointer;

                    transition:
                        all 0.25s ease;

                }


                .car-rental-logout:hover {

                    background: #dc2626;

                    transform:
                        translateY(-2px);

                }


                /* =================================================
                   ADMIN LOGOUT
                ================================================= */

                .admin-logout {

                    background: #111827;

                }


                .admin-logout:hover {

                    background: #000000;

                }


                /* =================================================
                   RESPONSIVE
                ================================================= */

                @media (max-width: 900px) {

                    .car-rental-navbar {

                        height: 62px;

                        padding: 0 25px;

                    }


                    .car-rental-brand {

                        font-size: 24px;

                    }


                    .car-rental-brand-icon {

                        font-size: 24px;

                    }


                    .car-rental-nav {

                        gap: 18px;

                    }


                    .car-rental-nav-link {

                        font-size: 14px;

                    }

                }


                @media (max-width: 650px) {

                    .car-rental-navbar {

                        height: auto;

                        min-height: 68px;

                        padding: 10px 15px;

                        flex-direction: column;

                        gap: 8px;

                    }


                    .car-rental-nav {

                        height: auto;

                        flex-wrap: wrap;

                        justify-content: center;

                    }


                    .car-rental-nav-link {

                        height: 30px;

                    }


                    .car-rental-nav-link::after {

                        bottom: 0;

                    }

                }

                `}
            </style>


            {/* =================================================
                NAVBAR
            ================================================= */}

            <nav className="car-rental-navbar">


                {/* =================================================
                   BRAND
                ================================================= */}

                <Link
                    to={
                        isAdmin
                            ? "/admin-dashboard"
                            : "/"
                    }

                    className="car-rental-brand"
                >

                    <span
                        className=
                            "car-rental-brand-icon"
                    >
                      
                    </span>

                    CarRental

                </Link>


                {/* =================================================
                   NAVIGATION
                ================================================= */}

                <div
                    className=
                        "car-rental-nav"
                >


                    {/* =================================================
                       ADMIN NAVIGATION
                    ================================================= */}

                    {isAdmin && (

                        <>

                            {/* ADMIN HOME
                                Opens the normal customer Home page */}

                            <Link
                                to="/"
                                className=
                                    "car-rental-nav-link"
                            >
                                Home
                            </Link>


                            {/* ADMIN DASHBOARD */}

                            <Link
                                to="/admin-dashboard"
                                className=
                                    "car-rental-nav-link admin-dashboard-link"
                            >
                                Admin Dashboard
                            </Link>


                            {/* ADMIN LOGOUT */}

                            <button
                                type="button"
                                className=
                                    "car-rental-logout admin-logout"
                                onClick={
                                    handleAdminLogout
                                }
                            >
                                Logout
                            </button>

                        </>

                    )}


                    {/* =================================================
                       CUSTOMER NAVIGATION
                    ================================================= */}

                    {isCustomer && (

                        <>

                            <Link
                                to="/"
                                className=
                                    "car-rental-nav-link"
                            >
                                Home
                            </Link>


                            <Link
                                to="/profile"
                                className=
                                    "car-rental-nav-link"
                            >
                                Profile
                            </Link>


                            <Link
                                to="/my-bookings"
                                className=
                                    "car-rental-nav-link"
                            >
                                My Bookings
                            </Link>


                            <Link
                                to="/my-payments"
                                className=
                                    "car-rental-nav-link"
                            >
                                My Payments
                            </Link>


                            <button
                                type="button"
                                className=
                                    "car-rental-logout"
                                onClick={
                                    handleCustomerLogout
                                }
                            >
                                Logout
                            </button>

                        </>

                    )}


                    {/* =================================================
                       PUBLIC NAVIGATION
                    ================================================= */}

                    {!isAdmin &&
                        !isCustomer && (

                        <>

                            <Link
                                to="/"
                                className=
                                    "car-rental-nav-link"
                            >
                                Home
                            </Link>


                            <Link
                                to="/register"
                                className=
                                    "car-rental-nav-link"
                            >
                                Register
                            </Link>


                            <Link
                                to="/login"
                                className=
                                    "car-rental-nav-link"
                            >
                                Login
                            </Link>


                            <Link
                                to="/admin-login"
                                className=
                                    "car-rental-nav-link"
                            >
                                Admin Login
                            </Link>

                        </>

                    )}

                </div>

            </nav>

        </>

    );

}

export default Navbar;