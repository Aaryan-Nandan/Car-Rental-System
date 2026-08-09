import { useEffect, useRef, useState } from "react";
import axios from "axios";

import DashboardCharts from "../components/charts/DashboardCharts";

function AdminDashboard() {

    // ==========================================
    // STATE
    // ==========================================

    const [bookings, setBookings] = useState([]);

    const [payments, setPayments] = useState([]);

    const [dashboardData, setDashboardData] =
        useState({});

    const [searchText, setSearchText] =
        useState("");


    // ==========================================
    // CHART REF
    // ==========================================

    const chartSectionRef =
        useRef(null);

    const chartContentRef =
        useRef(null);


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        fetchBookings();

        fetchDashboardData();

        fetchPayments();

    }, []);


    // ==========================================
    // FETCH BOOKINGS
    // ==========================================

    const fetchBookings = () => {

        axios
            .get(
                "http://localhost:8081/booking/all"
            )

            .then((response) => {

                if (
                    Array.isArray(
                        response.data
                    )
                ) {

                    setBookings(
                        response.data
                    );

                } else {

                    setBookings([]);

                }

            })

            .catch((error) => {

                console.error(
                    "Booking Error:",
                    error
                );

            });

    };


    // ==========================================
    // FETCH DASHBOARD DATA
    // ==========================================

    const fetchDashboardData = () => {

        axios
            .get(
                "http://localhost:8081/admin/dashboard"
            )

            .then((response) => {

                setDashboardData(
                    response.data || {}
                );

            })

            .catch((error) => {

                console.error(
                    "Dashboard Error:",
                    error
                );

            });

    };


    // ==========================================
    // FETCH PAYMENTS
    // ==========================================

    const fetchPayments = () => {

        axios
            .get(
                "http://localhost:8081/payment/all"
            )

            .then((response) => {

                if (
                    Array.isArray(
                        response.data
                    )
                ) {

                    setPayments(
                        response.data
                    );

                } else {

                    setPayments([]);

                }

            })

            .catch((error) => {

                console.error(
                    "Payment Error:",
                    error
                );

            });

    };


    // ==========================================
    // APPROVE BOOKING
    // ==========================================

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

                fetchDashboardData();

            })

            .catch((error) => {

                console.error(
                    "Approve Error:",
                    error
                );

                alert(
                    error.response?.data ||
                    "Unable to approve booking."
                );

            });

    };


    // ==========================================
    // REJECT BOOKING
    // ==========================================

    const rejectBooking = (id) => {

        if (
            !window.confirm(
                "Are you sure you want to reject this booking?"
            )
        ) {

            return;

        }


        axios
            .put(
                `http://localhost:8081/booking/reject/${id}`
            )

            .then(() => {

                alert(
                    "Booking Rejected"
                );

                fetchBookings();

                fetchDashboardData();

            })

            .catch((error) => {

                console.error(
                    "Reject Error:",
                    error
                );

                alert(
                    error.response?.data ||
                    "Unable to reject booking."
                );

            });

    };


    // ==========================================
    // VERIFY PAYMENT
    // ==========================================

    const verifyPayment = (id) => {

        const confirmed =
            window.confirm(
                "Have you checked this UTR in your actual UPI/bank transaction history?\n\nClick OK only if the transaction is genuine."
            );


        if (!confirmed) {

            return;

        }


        axios
            .put(
                `http://localhost:8081/payment/verify/${id}`
            )

            .then(() => {

                alert(
                    "Payment Verified Successfully"
                );

                fetchPayments();

                fetchBookings();

                fetchDashboardData();

            })

            .catch((error) => {

                console.error(
                    "Verify Payment Error:",
                    error
                );

                alert(
                    error.response?.data ||
                    "Unable to verify payment."
                );

            });

    };


    // ==========================================
    // REJECT PAYMENT
    // ==========================================

    const rejectPayment = (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to reject this payment?"
            );


        if (!confirmed) {

            return;

        }


        axios
            .put(
                `http://localhost:8081/payment/reject/${id}`
            )

            .then(() => {

                alert(
                    "Payment Rejected"
                );

                fetchPayments();

                fetchBookings();

                fetchDashboardData();

            })

            .catch((error) => {

                console.error(
                    "Reject Payment Error:",
                    error
                );

                alert(
                    error.response?.data ||
                    "Unable to reject payment."
                );

            });

    };


    // ==========================================
    // SMOOTH CHART SCROLL EFFECT
    // ==========================================

    useEffect(() => {

        const handleScroll = () => {

            if (
                !chartSectionRef.current ||
                !chartContentRef.current
            ) {

                return;

            }


            const section =
                chartSectionRef.current;

            const chart =
                chartContentRef.current;

            const rect =
                section.getBoundingClientRect();

            const viewportHeight =
                window.innerHeight;


            const startPoint =
                viewportHeight * 0.80;

            const endPoint =
                viewportHeight * 0.35;

            const distance =
                startPoint - endPoint;


            const progress =
                (startPoint - rect.top) /
                distance;


            const limitedProgress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        progress
                    )
                );


            const scale =
                0.72 +
                (0.28 * limitedProgress);


            chart.style.transform =
                `scale(${scale})`;

        };


        handleScroll();


        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            handleScroll
        );


        return () => {

            window.removeEventListener(
                "scroll",
                handleScroll
            );

            window.removeEventListener(
                "resize",
                handleScroll
            );

        };

    }, []);


    // ==========================================
    // SORT BOOKINGS
    // NEWEST FIRST
    // ==========================================

    const sortedBookings = [
        ...bookings
    ].sort(
        (a, b) =>
            Number(b.id || 0) -
            Number(a.id || 0)
    );


    // ==========================================
    // SORT PAYMENTS
    // NEWEST FIRST
    // ==========================================

    const sortedPayments = [
        ...payments
    ].sort((a, b) => {

        const dateA =
            a.paymentDate
                ? new Date(
                    a.paymentDate
                ).getTime()
                : 0;


        const dateB =
            b.paymentDate
                ? new Date(
                    b.paymentDate
                ).getTime()
                : 0;


        if (
            dateA !== dateB
        ) {

            return dateB - dateA;

        }


        return (
            Number(b.id || 0) -
            Number(a.id || 0)
        );

    });


    // ==========================================
    // SEARCH BOOKINGS
    // ==========================================

    const filteredBookings =
        sortedBookings.filter(
            (booking) => {

                const customerName =
                    booking.customer &&
                    booking.customer.name
                        ? booking.customer.name
                        : "";


                const carName =
                    booking.carVariant &&
                    booking.carVariant.variantName
                        ? booking.carVariant.variantName
                        : "";


                const search =
                    searchText.toLowerCase();


                return (
                    customerName
                        .toLowerCase()
                        .includes(search)

                    ||

                    carName
                        .toLowerCase()
                        .includes(search)
                );

            }
        );


    // ==========================================
    // PAYMENT STATUS COLOR
    // ==========================================

    const getPaymentStatusColor =
        (status) => {

            if (
                status === "PAID"
            ) {

                return "green";

            }


            if (
                status === "REJECTED" ||
                status === "FAILED"
            ) {

                return "red";

            }


            if (
                status === "VERIFYING"
            ) {

                return "orange";

            }


            return "#555";

        };


    // ==========================================
    // BOOKING STATUS COLOR
    // ==========================================

    const getBookingStatusColor =
        (status) => {

            if (
                status === "APPROVED"
            ) {

                return "green";

            }


            if (
                status === "PAID"
            ) {

                return "green";

            }


            if (
                status === "REJECTED"
            ) {

                return "red";

            }


            return "orange";

        };


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div
            style={{
                minHeight:
                    "100vh",

                backgroundColor:
                    "#f7f7f7",

                padding:
                    "30px",

                boxSizing:
                    "border-box"
            }}
        >


            {/* ==========================================
                PAGE TITLE
            ========================================== */}

            <div
                style={{
                    marginBottom:
                        "25px"
                }}
            >

                <h1
                    style={{
                        margin:
                            "0 0 20px 0",

                        fontSize:
                            "32px",

                        fontWeight:
                            "700"
                    }}
                >
                    Admin Dashboard
                </h1>

            </div>


            {/* ==========================================
                DASHBOARD STAT CARDS
            ========================================== */}

            <div
                style={{
                    display:
                        "grid",

                    gridTemplateColumns:
                        "repeat(4, minmax(0, 1fr))",

                    gap:
                        "12px",

                    marginBottom:
                        "20px"
                }}
            >


                {/* CUSTOMERS */}

                <div
                    style={{
                        backgroundColor:
                            "white",

                        padding:
                            "18px 20px",

                        minHeight:
                            "85px",

                        borderRadius:
                            "10px",

                        border:
                            "1px solid #e5e5e5",

                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.06)"
                    }}
                >

                    <p
                        style={{
                            margin:
                                "0 0 10px",

                            fontSize:
                                "17px",

                            fontWeight:
                                "600"
                        }}
                    >
                        Customers
                    </p>

                    <h2
                        style={{
                            margin:
                                "0",

                            fontSize:
                                "30px"
                        }}
                    >
                        {
                            dashboardData.totalCustomers ||
                            0
                        }
                    </h2>

                </div>


                {/* CARS */}

                <div
                    style={{
                        backgroundColor:
                            "white",

                        padding:
                            "18px 20px",

                        minHeight:
                            "85px",

                        borderRadius:
                            "10px",

                        border:
                            "1px solid #e5e5e5",

                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.06)"
                    }}
                >

                    <p
                        style={{
                            margin:
                                "0 0 10px",

                            fontSize:
                                "17px",

                            fontWeight:
                                "600"
                        }}
                    >
                        Cars
                    </p>

                    <h2
                        style={{
                            margin:
                                "0",

                            fontSize:
                                "30px"
                        }}
                    >
                        {
                            dashboardData.totalCars ||
                            0
                        }
                    </h2>

                </div>


                {/* BOOKINGS */}

                <div
                    style={{
                        backgroundColor:
                            "white",

                        padding:
                            "18px 20px",

                        minHeight:
                            "85px",

                        borderRadius:
                            "10px",

                        border:
                            "1px solid #e5e5e5",

                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.06)"
                    }}
                >

                    <p
                        style={{
                            margin:
                                "0 0 10px",

                            fontSize:
                                "17px",

                            fontWeight:
                                "600"
                        }}
                    >
                        Bookings
                    </p>

                    <h2
                        style={{
                            margin:
                                "0",

                            fontSize:
                                "30px"
                        }}
                    >
                        {
                            dashboardData.totalBookings ||
                            bookings.length
                        }
                    </h2>

                </div>


                {/* PAYMENTS */}

                <div
                    style={{
                        backgroundColor:
                            "white",

                        padding:
                            "18px 20px",

                        minHeight:
                            "85px",

                        borderRadius:
                            "10px",

                        border:
                            "1px solid #e5e5e5",

                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.06)"
                    }}
                >

                    <p
                        style={{
                            margin:
                                "0 0 10px",

                            fontSize:
                                "17px",

                            fontWeight:
                                "600"
                        }}
                    >
                        Payments
                    </p>

                    <h2
                        style={{
                            margin:
                                "0",

                            fontSize:
                                "30px"
                        }}
                    >
                        {
                            dashboardData.totalPayments ||
                            payments.length
                        }
                    </h2>

                </div>

            </div>


            {/* ==========================================
                CHART
            ========================================== */}

            <div
                ref={
                    chartSectionRef
                }

                style={{
                    position:
                        "relative",

                    marginBottom:
                        "30px",

                    width:
                        "100%"
                }}

                className=
                    "admin-chart-scroll-area"
            >

                <div
                    style={{
                        display:
                            "flex",

                        justifyContent:
                            "center",

                        alignItems:
                            "flex-start",

                        width:
                            "100%",

                        overflow:
                            "visible"
                    }}
                >

                    <div
                        ref={
                            chartContentRef
                        }

                        style={{
                            width:
                                "100%",

                            maxWidth:
                                "1100px",

                            transform:
                                "scale(0.72)",

                            transformOrigin:
                                "center top",

                            transition:
                                "transform 0.08s linear",

                            willChange:
                                "transform"
                        }}

                        className=
                            "admin-chart-content"
                    >

                        <DashboardCharts
                            dashboardData={
                                dashboardData
                            }
                        />

                    </div>

                </div>

            </div>


            {/* ==========================================
                TWO MANAGEMENT SECTIONS
            ========================================== */}

            <div
                style={{
                    display:
                        "grid",

                    gridTemplateColumns:
                        "1fr 1fr",

                    gap:
                        "25px",

                    alignItems:
                        "start",

                    marginTop:
                        "30px"
                }}

                className=
                    "admin-management-grid"
            >


                {/* ==================================================
                    BOOKING MANAGEMENT
                ================================================== */}

                <section
                    style={{
                        backgroundColor:
                            "white",

                        border:
                            "1px solid #e1e1e1",

                        borderRadius:
                            "10px",

                        padding:
                            "20px",

                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.05)"
                    }}
                >

                    <div
                        style={{
                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

                            marginBottom:
                                "20px",

                            gap:
                                "10px"
                        }}
                    >

                        <h2
                            style={{
                                margin:
                                    "0",

                                fontSize:
                                    "22px"
                            }}
                        >
                            Booking Management
                        </h2>

                        <span
                            style={{
                                backgroundColor:
                                    "#f1f1f1",

                                padding:
                                    "6px 10px",

                                borderRadius:
                                    "15px",

                                fontSize:
                                    "13px"
                            }}
                        >
                            {
                                filteredBookings.length
                            }
                        </span>

                    </div>


                    {/* SEARCH */}

                    <input
                        type="text"

                        placeholder=
                            "Search customer or car"

                        value={
                            searchText
                        }

                        onChange={
                            (e) =>
                                setSearchText(
                                    e.target.value
                                )
                        }

                        style={{
                            width:
                                "100%",

                            boxSizing:
                                "border-box",

                            padding:
                                "11px",

                            border:
                                "1px solid #ccc",

                            borderRadius:
                                "6px",

                            marginBottom:
                                "20px",

                            fontSize:
                                "14px"
                        }}
                    />


                    {/* BOOKINGS */}

                    {
                        filteredBookings.length === 0

                            ?

                            (

                                <p
                                    style={{
                                        color:
                                            "#777",

                                        textAlign:
                                            "center",

                                        padding:
                                            "30px 0"
                                    }}
                                >
                                    No bookings found.
                                </p>

                            )

                            :

                            (

                                filteredBookings.map(
                                    (booking) => (

                                        <div
                                            key={
                                                booking.id
                                            }

                                            style={{
                                                border:
                                                    "1px solid #ddd",

                                                borderRadius:
                                                    "8px",

                                                padding:
                                                    "15px",

                                                marginBottom:
                                                    "15px",

                                                backgroundColor:
                                                    "#fafafa"
                                            }}
                                        >

                                            <h3
                                                style={{
                                                    margin:
                                                        "0 0 12px",

                                                    fontSize:
                                                        "18px"
                                                }}
                                            >
                                                Booking #
                                                {
                                                    booking.id
                                                }
                                            </h3>


                                            <p>
                                                <strong>
                                                    Customer:
                                                </strong>{" "}

                                                {
                                                    booking.customer &&
                                                    booking.customer.name
                                                        ? booking.customer.name
                                                        : "N/A"
                                                }
                                            </p>


                                            <p>
                                                <strong>
                                                    Email:
                                                </strong>{" "}

                                                {
                                                    booking.customer &&
                                                    booking.customer.email
                                                        ? booking.customer.email
                                                        : "N/A"
                                                }
                                            </p>


                                            <p>
                                                <strong>
                                                    Car:
                                                </strong>{" "}

                                                {
                                                    booking.carVariant &&
                                                    booking.carVariant.variantName
                                                        ? booking.carVariant.variantName
                                                        : "N/A"
                                                }
                                            </p>


                                            <p>
                                                <strong>
                                                    Fuel:
                                                </strong>{" "}

                                                {
                                                    booking.carVariant &&
                                                    booking.carVariant.fuelType
                                                        ? booking.carVariant.fuelType
                                                        : "N/A"
                                                }
                                            </p>


                                            <p>
                                                <strong>
                                                    From Date:
                                                </strong>{" "}

                                                {
                                                    booking.fromDate ||
                                                    "N/A"
                                                }
                                            </p>


                                            <p>
                                                <strong>
                                                    To Date:
                                                </strong>{" "}

                                                {
                                                    booking.toDate ||
                                                    "N/A"
                                                }
                                            </p>


                                            <p>
                                                <strong>
                                                    Total Amount:
                                                </strong>{" "}

                                                ₹
                                                {
                                                    booking.totalAmount ||
                                                    0
                                                }
                                            </p>


                                            <p>
                                                <strong>
                                                    Assigned Car:
                                                </strong>{" "}

                                                {
                                                    booking.car &&
                                                    booking.car.registrationNumber
                                                        ? booking.car.registrationNumber
                                                        : "Not Assigned"
                                                }
                                            </p>


                                            <p>
                                                <strong>
                                                    Status:
                                                </strong>{" "}

                                                <span
                                                    style={{
                                                        color:
                                                            getBookingStatusColor(
                                                                booking.bookingStatus
                                                            ),

                                                        fontWeight:
                                                            "700"
                                                    }}
                                                >
                                                    {
                                                        booking.bookingStatus ||
                                                        "PENDING"
                                                    }
                                                </span>
                                            </p>


                                            {
                                                booking.bookingStatus ===
                                                    "PENDING"

                                                    &&

                                                    (

                                                        <div
                                                            style={{
                                                                display:
                                                                    "flex",

                                                                gap:
                                                                    "10px",

                                                                marginTop:
                                                                    "15px"
                                                            }}
                                                        >

                                                            <button
                                                                onClick={
                                                                    () =>
                                                                        approveBooking(
                                                                            booking.id
                                                                        )
                                                                }

                                                                style={{
                                                                    flex:
                                                                        "1",

                                                                    padding:
                                                                        "10px",

                                                                    backgroundColor:
                                                                        "green",

                                                                    color:
                                                                        "white",

                                                                    border:
                                                                        "none",

                                                                    borderRadius:
                                                                        "5px",

                                                                    cursor:
                                                                        "pointer"
                                                                }}
                                                            >
                                                                Approve
                                                            </button>


                                                            <button
                                                                onClick={
                                                                    () =>
                                                                        rejectBooking(
                                                                            booking.id
                                                                        )
                                                                }

                                                                style={{
                                                                    flex:
                                                                        "1",

                                                                    padding:
                                                                        "10px",

                                                                    backgroundColor:
                                                                        "red",

                                                                    color:
                                                                        "white",

                                                                    border:
                                                                        "none",

                                                                    borderRadius:
                                                                        "5px",

                                                                    cursor:
                                                                        "pointer"
                                                                }}
                                                            >
                                                                Reject
                                                            </button>

                                                        </div>

                                                    )
                                            }

                                        </div>

                                    )
                                )

                            )
                    }

                </section>


                {/* ==================================================
                    PAYMENT MANAGEMENT
                ================================================== */}

                <section
                    style={{
                        backgroundColor:
                            "white",

                        border:
                            "1px solid #e1e1e1",

                        borderRadius:
                            "10px",

                        padding:
                            "20px",

                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.05)"
                    }}
                >

                    {/* PAYMENT HEADER */}

                    <div
                        style={{
                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

                            marginBottom:
                                "20px"
                        }}
                    >

                        <h2
                            style={{
                                margin:
                                    "0",

                                fontSize:
                                    "22px"
                            }}
                        >
                            Payment Management
                        </h2>


                        <span
                            style={{
                                backgroundColor:
                                    "#f1f1f1",

                                padding:
                                    "6px 10px",

                                borderRadius:
                                    "15px",

                                fontSize:
                                    "13px"
                            }}
                        >
                            {
                                sortedPayments.length
                            }
                        </span>

                    </div>


                    {/* PAYMENTS */}

                    {
                        sortedPayments.length === 0

                            ?

                            (

                                <p
                                    style={{
                                        color:
                                            "#777",

                                        textAlign:
                                            "center",

                                        padding:
                                            "30px 0"
                                    }}
                                >
                                    No payments found.
                                </p>

                            )

                            :

                            (

                                sortedPayments.map(
                                    (payment) => (

                                        <div
                                            key={
                                                payment.id
                                            }

                                            style={{
                                                border:
                                                    "1px solid #ddd",

                                                borderRadius:
                                                    "8px",

                                                padding:
                                                    "15px",

                                                marginBottom:
                                                    "15px",

                                                backgroundColor:
                                                    "#fafafa"
                                            }}
                                        >

                                            {/* PAYMENT TITLE */}

                                            <h3
                                                style={{
                                                    margin:
                                                        "0 0 12px",

                                                    fontSize:
                                                        "18px"
                                                }}
                                            >
                                                Payment #
                                                {
                                                    payment.id
                                                }
                                            </h3>


                                            {/* AMOUNT */}

                                            <p>
                                                <strong>
                                                    Amount:
                                                </strong>{" "}

                                                ₹
                                                {
                                                    payment.amount ||
                                                    0
                                                }
                                            </p>


                                            {/* PAYMENT STATUS */}

                                            <p>
                                                <strong>
                                                    Payment Status:
                                                </strong>{" "}

                                                <span
                                                    style={{
                                                        color:
                                                            getPaymentStatusColor(
                                                                payment.paymentStatus
                                                            ),

                                                        fontWeight:
                                                            "700"
                                                    }}
                                                >
                                                    {
                                                        payment.paymentStatus ||
                                                        "VERIFYING"
                                                    }
                                                </span>
                                            </p>


                                            {/* PAYMENT DATE */}

                                            <p>
                                                <strong>
                                                    Payment Date:
                                                </strong>{" "}

                                                {
                                                    payment.paymentDate ||
                                                    "N/A"
                                                }
                                            </p>


                                            {/* UTR */}

                                            <p>
                                                <strong>
                                                    UTR / Transaction ID:
                                                </strong>{" "}

                                                <span
                                                    style={{
                                                        fontWeight:
                                                            "600",

                                                        wordBreak:
                                                            "break-all"
                                                    }}
                                                >
                                                    {
                                                        payment.upiTransactionId ||
                                                        "N/A"
                                                    }
                                                </span>
                                            </p>


                                            {/* PAYMENT METHOD */}

                                            <p>
                                                <strong>
                                                    Payment Method:
                                                </strong>{" "}

                                                {
                                                    payment.paymentMethod ||
                                                    "N/A"
                                                }
                                            </p>


                                            {/* BOOKING ID */}

                                            <p>
                                                <strong>
                                                    Booking ID:
                                                </strong>{" "}

                                                {
                                                    payment.booking &&
                                                    payment.booking.id
                                                        ? payment.booking.id
                                                        : "N/A"
                                                }
                                            </p>


                                            {/* CUSTOMER */}

                                            <p>
                                                <strong>
                                                    Customer:
                                                </strong>{" "}

                                                {
                                                    payment.customer &&
                                                    payment.customer.name
                                                        ? payment.customer.name

                                                        :

                                                        payment.booking &&
                                                        payment.booking.customer &&
                                                        payment.booking.customer.name

                                                            ?

                                                            payment.booking.customer.name

                                                            :

                                                            "N/A"
                                                }
                                            </p>


                                            {/* CUSTOMER EMAIL */}

                                            <p>
                                                <strong>
                                                    Customer Email:
                                                </strong>{" "}

                                                {
                                                    payment.customer &&
                                                    payment.customer.email
                                                        ? payment.customer.email

                                                        :

                                                        payment.booking &&
                                                        payment.booking.customer &&
                                                        payment.booking.customer.email

                                                            ?

                                                            payment.booking.customer.email

                                                            :

                                                            "N/A"
                                                }
                                            </p>


                                            {/* CAR */}

                                            <p>
                                                <strong>
                                                    Car:
                                                </strong>{" "}

                                                {
                                                    payment.booking &&
                                                    payment.booking.carVariant &&
                                                    payment.booking.carVariant.variantName
                                                        ? payment.booking.carVariant.variantName
                                                        : "N/A"
                                                }
                                            </p>


                                            {/* FUEL TYPE */}

                                            <p>
                                                <strong>
                                                    Fuel:
                                                </strong>{" "}

                                                {
                                                    payment.booking &&
                                                    payment.booking.carVariant &&
                                                    payment.booking.carVariant.fuelType
                                                        ? payment.booking.carVariant.fuelType
                                                        : "N/A"
                                                }
                                            </p>


                                            {/* ==========================================
                                                VERIFY / REJECT
                                            ========================================== */}

                                            {
                                                payment.paymentStatus ===
                                                    "VERIFYING"

                                                    &&

                                                    (

                                                        <div
                                                            style={{
                                                                display:
                                                                    "flex",

                                                                gap:
                                                                    "10px",

                                                                marginTop:
                                                                    "18px",

                                                                paddingTop:
                                                                    "15px",

                                                                borderTop:
                                                                    "1px solid #ddd"
                                                            }}
                                                        >

                                                            {/* VERIFY */}

                                                            <button
                                                                onClick={
                                                                    () =>
                                                                        verifyPayment(
                                                                            payment.id
                                                                        )
                                                                }

                                                                style={{
                                                                    flex:
                                                                        "1",

                                                                    padding:
                                                                        "11px",

                                                                    backgroundColor:
                                                                        "green",

                                                                    color:
                                                                        "white",

                                                                    border:
                                                                        "none",

                                                                    borderRadius:
                                                                        "5px",

                                                                    cursor:
                                                                        "pointer",

                                                                    fontWeight:
                                                                        "600"
                                                                }}
                                                            >
                                                                Verify Payment
                                                            </button>


                                                            {/* REJECT */}

                                                            <button
                                                                onClick={
                                                                    () =>
                                                                        rejectPayment(
                                                                            payment.id
                                                                        )
                                                                }

                                                                style={{
                                                                    flex:
                                                                        "1",

                                                                    padding:
                                                                        "11px",

                                                                    backgroundColor:
                                                                        "red",

                                                                    color:
                                                                        "white",

                                                                    border:
                                                                        "none",

                                                                    borderRadius:
                                                                        "5px",

                                                                    cursor:
                                                                        "pointer",

                                                                    fontWeight:
                                                                        "600"
                                                                }}
                                                            >
                                                                Reject Payment
                                                            </button>

                                                        </div>

                                                    )
                                            }


                                            {/* VERIFIED MESSAGE */}

                                            {
                                                payment.paymentStatus ===
                                                    "PAID"

                                                    &&

                                                    (

                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    "15px",

                                                                padding:
                                                                    "10px",

                                                                backgroundColor:
                                                                    "#e8f5e9",

                                                                color:
                                                                    "green",

                                                                borderRadius:
                                                                    "5px",

                                                                fontWeight:
                                                                    "600",

                                                                textAlign:
                                                                    "center"
                                                            }}
                                                        >
                                                            ✓ Payment Verified
                                                        </div>

                                                    )
                                            }


                                            {/* REJECTED MESSAGE */}

                                            {
                                                payment.paymentStatus ===
                                                    "REJECTED"

                                                    &&

                                                    (

                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    "15px",

                                                                padding:
                                                                    "10px",

                                                                backgroundColor:
                                                                    "#ffebee",

                                                                color:
                                                                    "red",

                                                                borderRadius:
                                                                    "5px",

                                                                fontWeight:
                                                                    "600",

                                                                textAlign:
                                                                    "center"
                                                            }}
                                                        >
                                                            ✕ Payment Rejected
                                                        </div>

                                                    )
                                            }

                                        </div>

                                    )
                                )

                            )
                    }

                </section>

            </div>


            {/* ==========================================
                RESPONSIVE STYLE
            ========================================== */}

            <style>
                {`

                    @media (max-width: 900px) {

                        .admin-management-grid {

                            grid-template-columns:
                                1fr !important;

                        }

                    }


                    @media (max-width: 700px) {

                        .admin-management-grid {

                            grid-template-columns:
                                1fr !important;

                        }

                    }


                    @media (max-width: 600px) {

                        .admin-management-grid {

                            grid-template-columns:
                                1fr !important;

                        }

                    }

                `}
            </style>


        </div>

    );

}

export default AdminDashboard;