import {
    Link,
    useNavigate
}
from "react-router-dom";

function Navbar() {

    const navigate =
        useNavigate();

    const token =
        localStorage.getItem(
            "token"
        );

    const adminToken =
        localStorage.getItem(
            "adminToken"
        );

    const handleLogout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "customerId"
        );

        localStorage.removeItem(
            "adminToken"
        );

        alert(
            "Logout Successful"
        );

        navigate("/login");
    };

    return (

        <div
            style={{

                background:
                    "linear-gradient(90deg,#000,#222)",

                padding:
                    "15px 30px",

                display:
                    "flex",

                justifyContent:
                    "space-between",

                alignItems:
                    "center",

                boxShadow:
                    "0px 2px 10px rgba(0,0,0,0.3)"
            }}
        >

            {/* LOGO */}

            <div
                style={{
                    color: "white",
                    fontSize: "26px",
                    fontWeight: "bold"
                }}
            >

                🚗 CarRental

            </div>

            {/* MENU */}

            <div
                style={{
                    display: "flex",
                    gap: "25px",
                    alignItems: "center"
                }}
            >

                <Link
                    to="/"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontWeight: "bold"
                    }}
                >
                    Home
                </Link>

                {
                    !token &&
                    !adminToken && (

                        <>

                            <Link
                                to="/register"
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontWeight: "bold"
                                }}
                            >
                                Register
                            </Link>

                            <Link
                                to="/login"
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontWeight: "bold"
                                }}
                            >
                                Login
                            </Link>

                            <Link
                                to="/admin-login"
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontWeight: "bold"
                                }}
                            >
                                Admin Login
                            </Link>

                        </>
                    )
                }

                {
                    token && (

                        <>

                            <Link
                                to="/profile"
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontWeight: "bold"
                                }}
                            >
                                Profile
                            </Link>

                            <Link
                                to="/my-bookings"
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontWeight: "bold"
                                }}
                            >
                                My Bookings
                            </Link>

                            <Link
                                to="/my-payments"
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontWeight: "bold"
                                }}
                            >
                                My Payments
                            </Link>

                        </>
                    )
                }

                {
                    adminToken && (

                        <Link
                            to="/admin-dashboard"
                            style={{
                                color: "#4CAF50",
                                textDecoration: "none",
                                fontWeight: "bold"
                            }}
                        >
                            Admin Dashboard
                        </Link>

                    )
                }

                {
                    (token || adminToken) && (

                        <button

                            onClick={
                                handleLogout
                            }

                            style={{

                                backgroundColor:
                                    "#f44336",

                                color:
                                    "white",

                                border:
                                    "none",

                                padding:
                                    "10px 15px",

                                borderRadius:
                                    "8px",

                                fontWeight:
                                    "bold",

                                cursor:
                                    "pointer"
                            }}
                        >

                            Logout

                        </button>

                    )
                }

            </div>

        </div>
    );
}

export default Navbar;