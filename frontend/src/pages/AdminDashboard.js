import { useEffect, useState }

from "react";

import { useNavigate }

from "react-router-dom";

import axios from "axios";

function AdminDashboard() {

    const navigate =
        useNavigate();

    const [bookings, setBookings] =
        useState([]);

    const [dashboardData,
        setDashboardData] =
            useState({});

    const [searchText,
        setSearchText] =
            useState("");

    useEffect(() => {

        fetchBookings();

        fetchDashboardData();

    }, []);

    const fetchBookings = () => {

        axios
            .get(
                "http://localhost:8081/booking/all"
            )

            .then((response) => {

                setBookings(
                    response.data
                );
            });
    };

    const fetchDashboardData = () => {

        axios
            .get(
                "http://localhost:8081/admin/dashboard"
            )

            .then((response) => {

                setDashboardData(
                    response.data
                );
            });
    };

    const approveBooking = (id) => {

        axios
            .put(
                `http://localhost:8081/booking/approve/${id}`
            )

            .then(() => {

                alert(
                    "Booking Approved"
                );

                fetchBookings();
            });
    };

    const rejectBooking = (id) => {

        axios
            .put(
                `http://localhost:8081/booking/reject/${id}`
            )

            .then(() => {

                alert(
                    "Booking Rejected"
                );

                fetchBookings();
            });
    };

    return (

        <div
            style={{
                padding: "30px"
            }}
        >

            <h1>

                Admin Dashboard

            </h1>

            <br />

            <button

                onClick={() =>
                    navigate(
                        "/manage-cars"
                    )
                }

                style={{
                    backgroundColor:
                        "black",

                    color: "white",

                    border: "none",

                    padding:
                        "12px 20px",

                    borderRadius:
                        "5px",

                    cursor:
                        "pointer"
                }}
            >

                Manage Cars

           </button>

            <r />
            <br />

            <input
                type="text"

                placeholder=
                    "Search By Customer Name"

                value={searchText}

                onChange={(e) =>
                    setSearchText(
                        e.target.value
                    )
                }

                style={{
                    padding: "12px",

                    width: "300px",

                    borderRadius: "5px",

                    border:
                        "1px solid gray"
                }}
            />

            <div
                style={{

                    display: "flex",

                    flexWrap: "wrap",

                    gap: "20px",

                    marginTop: "30px",

                    marginBottom: "40px"
                }}
            >

                <div
                    style={{
                        backgroundColor:
                            "#f1f1f1",

                        padding: "20px",

                        width: "220px",

                        borderRadius: "10px"
                    }}
                >

                    <h2>

                        Customers

                    </h2>

                    <h1>

                        {
                            dashboardData
                                .totalCustomers
                        }

                    </h1>

                </div>

                <div
                    style={{
                        backgroundColor:
                            "#f1f1f1",

                        padding: "20px",

                        width: "220px",

                        borderRadius: "10px"
                    }}
                >

                    <h2>

                        Cars

                    </h2>

                    <h1>

                        {
                            dashboardData
                                .totalCars
                        }

                    </h1>

                </div>

                <div
                    style={{
                        backgroundColor:
                            "#f1f1f1",

                        padding: "20px",

                        width: "220px",

                        borderRadius: "10px"
                    }}
                >

                    <h2>

                        Bookings

                    </h2>

                    <h1>

                        {
                            dashboardData
                                .totalBookings
                        }

                    </h1>

                </div>

                <div
                    style={{
                        backgroundColor:
                            "#f1f1f1",

                        padding: "20px",

                        width: "220px",

                        borderRadius: "10px"
                    }}
                >

                    <h2>

                        Payments

                    </h2>

                    <h1>

                        {
                            dashboardData
                                .totalPayments
                        }

                    </h1>

                </div>

            </div>

            {
                bookings

                .filter((booking) =>

                    booking.customer &&

                    booking.customer.name

                    .toLowerCase()

                    .includes(

                        searchText
                        .toLowerCase()
                    )
                )

                .map((booking) => (

                    <div

                        key={booking.id}

                        style={{
                            border:
                                "1px solid lightgray",

                            padding: "20px",

                            marginBottom: "20px",

                            borderRadius: "10px"
                        }}
                    >

                        <h2>

                            {
                                booking.carVariant
                                    ?.variantName
                            }

                        </h2>

                        <p>

                            <b>
                                Customer:
                            </b>

                            {" "}

                            {
                                booking.customer
                                    ? booking.customer.name
                                    : "No Customer"
                            }

                        </p>

                        <p>

                            <b>
                                Total Amount:
                            </b>

                            {" "}

                            ₹ {booking.totalAmount}

                        </p>

                        <p>

                            <b>
                                Status:
                            </b>

                            {" "}

                            <span
                                style={{

                                    color:

                                        booking.bookingStatus
                                        === "APPROVED"

                                            ? "green"

                                            : booking.bookingStatus
                                              === "REJECTED"

                                            ? "red"

                                            : "orange",

                                    fontWeight:
                                        "bold"
                                }}
                            >

                                {
                                    booking.bookingStatus
                                }

                            </span>

                        </p>

                        <button

                            onClick={() =>
                                approveBooking(
                                    booking.id
                                )
                            }

                            style={{
                                backgroundColor:
                                    "green",

                                color: "white",

                                border: "none",

                                padding: "10px",

                                marginRight: "10px",

                                cursor: "pointer"
                            }}
                        >

                            Approve

                        </button>

                        <button

                            onClick={() =>
                                rejectBooking(
                                    booking.id
                                )
                            }

                            style={{
                                backgroundColor:
                                    "red",

                                color: "white",

                                border: "none",

                                padding: "10px",

                                cursor: "pointer"
                            }}
                        >

                            Reject

                        </button>

                    </div>
                ))
            }

        </div>
    );
}

export default AdminDashboard;