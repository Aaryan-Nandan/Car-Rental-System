import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

function MyBookings() {


    const [bookings, setBookings] =
        useState([]);


    const [payments, setPayments] =
        useState([]);


    const [searchText, setSearchText] =
        useState("");


    const [statusFilter, setStatusFilter] =
        useState("ALL");


    const navigate =
        useNavigate();


    // ==========================================
    // GET JWT TOKEN
    // ==========================================

    const token =
        localStorage.getItem("token");


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        if (!token) {

            alert(
                "Please login first."
            );

            navigate("/login");

            return;
        }


        loadBookings();

        loadPayments();


    }, [token, navigate]);


    // ==========================================
    // LOAD BOOKINGS
    // ==========================================

    const loadBookings = () => {


        axios

            .get(

                `${API_URL}/booking/all`,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

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

                            booking.customer.id ===
                            Number(customerId)

                    );


                // ==========================================
                // NEWEST BOOKING FIRST
                // ==========================================

                const sortedBookings =
                    [...filteredBookings].sort(
                        (a, b) => b.id - a.id
                    );


                setBookings(
                    sortedBookings
                );

            })

            .catch((error) => {


                console.error(
                    "Booking Error:",
                    error
                );


                if (

                    error.response &&

                    (
                        error.response.status ===
                        401 ||

                        error.response.status ===
                        403
                    )

                ) {

                    localStorage.removeItem(
                        "token"
                    );


                    localStorage.removeItem(
                        "customerId"
                    );


                    alert(
                        "Session expired. Please login again."
                    );


                    navigate(
                        "/login"
                    );

                }

            });

    };


    // ==========================================
    // LOAD PAYMENTS
    // ==========================================

    const loadPayments = () => {


        axios

            .get(

                `${API_URL}/payment/all`,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            )

            .then((response) => {


                setPayments(
                    response.data
                );

            })

            .catch((error) => {


                console.error(
                    "Payment Error:",
                    error
                );


                if (

                    error.response &&

                    (
                        error.response.status ===
                        401 ||

                        error.response.status ===
                        403
                    )

                ) {

                    localStorage.removeItem(
                        "token"
                    );


                    localStorage.removeItem(
                        "customerId"
                    );


                    alert(
                        "Session expired. Please login again."
                    );


                    navigate(
                        "/login"
                    );

                }

            });

    };


    // ==========================================
    // CHECK PAYMENT
    // ==========================================

    const isPaid = (bookingId) => {


        console.log(
            "Booking ID :",
            bookingId
        );


        console.log(
            "Payments :",
            payments
        );


        const paid =
            payments.some(

                (payment) =>

                    payment.booking &&

                    payment.booking.id ===
                    bookingId

            );


        console.log(
            "Paid :",
            paid
        );


        return paid;

    };


    // ==========================================
    // PAGE
    // ==========================================

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


            {/* ==================================
                SEARCH
            ================================== */}

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


            {/* ==================================
                STATUS FILTER
            ================================== */}

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


                <option value="PAYMENT_FAILED">

                    Payment Failed

                </option>


                <option value="CONFIRMED">

                    Confirmed

                </option>


                <option value="REJECTED">

                    Rejected

                </option>

            </select>


            {/* ==================================
                TOTAL BOOKINGS
            ================================== */}

            <h3>

                Total Bookings :{" "}

                {bookings.length}

            </h3>


            <br />


            {/* ==================================
                BOOKINGS
            ================================== */}

            {

                bookings

                    .filter(

                        (booking) =>

                            booking.carVariant
                                ?.variantName
                                .toLowerCase()
                                .includes(
                                    searchText.toLowerCase()
                                )

                    )

                    .filter(

                        (booking) =>

                            statusFilter ===
                            "ALL"

                                ? true

                                : booking.bookingStatus ===
                                  statusFilter

                    )

                    // ==========================================
                    // NEWEST BOOKING FIRST
                    // ==========================================
                    .sort(
                        (a, b) => b.id - a.id
                    )

                    .map(

                        (booking) => (

                            <div

                                key={
                                    booking.id
                                }

                                style={{

                                    border:
                                        "1px solid lightgray",

                                    padding:
                                        "20px",

                                    marginBottom:
                                        "20px",

                                    borderRadius:
                                        "10px",

                                    boxShadow:
                                        "0px 0px 10px lightgray"

                                }}

                            >


                                {/* ==========================
                                    CAR NAME
                                ========================== */}

                                <h2>

                                    {

                                        booking
                                            .carVariant
                                            ?.variantName

                                    }

                                    {" - "}

                                    {

                                        booking
                                            .carVariant
                                            ?.fuelType

                                    }

                                </h2>


                                {/* ==========================
                                    FROM DATE
                                ========================== */}

                                <p>

                                    <b>

                                        From Date:

                                    </b>

                                    {" "}

                                    {

                                        booking.fromDate

                                    }

                                </p>


                                {/* ==========================
                                    TO DATE
                                ========================== */}

                                <p>

                                    <b>

                                        To Date:

                                    </b>

                                    {" "}

                                    {

                                        booking.toDate

                                    }

                                </p>


                                {/* ==========================
                                    TOTAL AMOUNT
                                ========================== */}

                                <p>

                                    <b>

                                        Total Amount:

                                    </b>

                                    {" "}

                                    ₹ {booking.totalAmount}

                                </p>


                                {/* ==========================
                                    STATUS
                                ========================== */}

                                <p>

                                    <b>

                                        Status:

                                    </b>

                                    {" "}


                                    <span

                                        style={{

                                            color:

                                                booking.bookingStatus ===
                                                "CONFIRMED"

                                                    ? "green"

                                                    : booking.bookingStatus ===
                                                      "PAYMENT_FAILED"

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


                                {/* ==========================
                                    ASSIGNED CAR
                                ========================== */}

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


                                {/* ==========================
                                    PAYMENT / REVIEW
                                ========================== */}

                                {

                                    isPaid(
                                        booking.id
                                    )

                                        ? (

                                            <>

                                                {/* <button

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
                                                            "0.8",

                                                        marginRight:
                                                            "10px"

                                                    }}

                                                >

                                                    

                                                </button> */}


                                                <button

                                                    onClick={() =>

                                                        navigate(

                                                            `/review/${booking.carVariant.id}`

                                                        )

                                                    }

                                                    style={{

                                                        backgroundColor:
                                                            "#ff9800",

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

                                                    FEEDBACK❤️

                                                </button>

                                            </>

                                        )

                                        :

                                        booking.bookingStatus ===
                                        "APPROVED"

                                            && (

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

                                                    

                                                </button>

                                            )

                                }


                            </div>

                        )

                    )

            }


        </div>

    );

}


export default MyBookings;