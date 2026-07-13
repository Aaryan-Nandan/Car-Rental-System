import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyBookings() {

    const [bookings, setBookings] =
        useState([]);

    const [payments, setPayments] =
        useState([]);

    const [searchText,
        setSearchText] =
            useState("");

    const [statusFilter,
        setStatusFilter] =
            useState("ALL");

    const navigate =
        useNavigate();

    useEffect(() => {

        loadBookings();

        loadPayments();

    }, []);

    const loadBookings = () => {

        axios
            .get(
                "http://localhost:8081/booking/all"
            )

            .then((response) => {

                const customerId =
                    localStorage.getItem(
                        "customerId"
                    );

                const filteredBookings =
                    response.data.filter(
                        (booking) =>

                            booking.customer &&

                            booking.customer.id === Number(customerId)
                    );

                setBookings(
                    filteredBookings
                );
            });
    };

    const loadPayments = () => {

        axios
            .get(
                "http://localhost:8081/payment/all"
            )

            .then((response) => {

                setPayments(
                    response.data
                );
            });
    };

    const isPaid = (bookingId) => {

        return payments.some(

            (payment) =>

                payment.booking &&
                payment.booking.id ===
                bookingId
        );
    };

    return (

        <div
            style={{
                padding: "30px"
            }}
        >

            <h1>

                My Bookings

            </h1>

            <br />

            <input
                type="text"
                placeholder="Search Car"

                value={searchText}

                onChange={(e) =>
                    setSearchText(
                        e.target.value
                    )
                }

                style={{
                    padding: "10px",
                    width: "250px",
                    marginRight: "10px"
                }}
            />

            <select

                value={statusFilter}

                onChange={(e) =>
                    setStatusFilter(
                        e.target.value
                    )
                }

                style={{
                    padding: "10px"
                }}
            >

                <option value="ALL">
                    All
                </option>

                <option value="PENDING">
                    Pending
                </option>

                <option value="APPROVED">
                    Approved
                </option>

                <option value="REJECTED">
                    Rejected
                </option>

            </select>

            <h3>

                Total Bookings :
                {" "}
                {bookings.length}

            </h3>

            <br />

            {
                bookings

                    .filter((booking) =>

                        booking.carVariant
                            ?.variantName
                            .toLowerCase()
                            .includes(
                                searchText.toLowerCase()
                            )
                    )

                    .filter((booking) =>

                        statusFilter === "ALL"

                            ? true

                            : booking.bookingStatus ===
                            statusFilter
                    )

                    .map((booking) => (

                        <div

                            key={booking.id}

                            style={{
                                border:
                                    "1px solid lightgray",

                                padding: "20px",

                                marginBottom: "20px",

                                borderRadius: "10px",

                                boxShadow:
                                    "0px 0px 10px lightgray"
                            }}
                        >

                            <h2>

                                {
                                    booking.carVariant
                                        ?.variantName
                                }

                                {" - "}

                                {
                                    booking.carVariant
                                        ?.fuelType
                                }

                            </h2>

                            <p>

                                <b>
                                    From Date:
                                </b>

                                {" "}

                                {booking.fromDate}

                            </p>

                            <p>

                                <b>
                                    To Date:
                                </b>

                                {" "}

                                {booking.toDate}

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

                            <p>

                                <b>
                                    Assigned Car:
                                </b>

                                {" "}

                                {
                                    booking.car
                                        ?.registrationNumber
                                }

                            </p>

                            {
                                isPaid(
                                    booking.id
                                ) ? (

                                    <button

                                        disabled

                                        style={{
                                            backgroundColor:
                                                "green",

                                            color:
                                                "white",

                                            border:
                                                "none",

                                            padding:
                                                "10px 20px",

                                            borderRadius:
                                                "5px",

                                            opacity:
                                                "0.8"
                                        }}
                                    >

                                        PAID ✅

                                    </button>

                                ) :

                                    booking.bookingStatus ===
                                    "APPROVED" && (

                                        <button

                                            onClick={() =>
                                                navigate(
                                                    `/payment/${booking.id}/${booking.totalAmount}`
                                                )
                                            }

                                            style={{
                                                backgroundColor:
                                                    "green",

                                                color:
                                                    "white",

                                                border:
                                                    "none",

                                                padding:
                                                    "10px 20px",

                                                borderRadius:
                                                    "5px",

                                                cursor:
                                                    "pointer"
                                            }}
                                        >

                                            Pay Now

                                        </button>
                                    )
                            }

                        </div>
                    ))
            }

        </div>
    );
}

export default MyBookings;