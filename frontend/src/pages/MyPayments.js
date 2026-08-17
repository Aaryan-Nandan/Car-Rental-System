import {
    useEffect,
    useState
} from "react";

import axios from "axios";

import jsPDF from "jspdf";

import autoTable
    from "jspdf-autotable";


// ============================================================
// MY PAYMENTS
// ============================================================

function MyPayments() {

    const [
        payments,
        setPayments
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        errorMessage,
        setErrorMessage
    ] = useState("");


    // ========================================================
    // LOAD PAYMENTS
    // ========================================================

    useEffect(
        () => {

            loadPayments();

        },
        []
    );


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDateTime =
        (dateValue) => {

            if (
                !dateValue
            ) {

                return "N/A";
            }


            const date =
                new Date(
                    dateValue
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return String(
                    dateValue
                );
            }


            return date.toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );
        };


    // ========================================================
    // FORMAT DATE ONLY
    // ========================================================

    const formatDate =
        (dateValue) => {

            if (
                !dateValue
            ) {

                return "N/A";
            }


            const date =
                new Date(
                    dateValue
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return String(
                    dateValue
                );
            }


            return date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );
        };


    // ========================================================
    // FORMAT MONEY
    // ========================================================

    const formatMoney =
        (amount) => {

            return Number(
                amount || 0
            ).toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );
        };


    // ========================================================
    // LOAD PAYMENTS
    // ========================================================

    const loadPayments =
        async () => {

            const customerId =
                localStorage.getItem(
                    "customerId"
                );


            const token =
                localStorage.getItem(
                    "token"
                );


            console.log(
                "================================="
            );

            console.log(
                "MY PAYMENTS"
            );

            console.log(
                "Customer ID:",
                customerId
            );


            if (
                !customerId ||
                !token
            ) {

                setErrorMessage(
                    "Please login to view your payments."
                );

                setLoading(
                    false
                );

                return;
            }


            try {

                setErrorMessage(
                    ""
                );


                const response =
                    await axios.get(

                        "http://localhost:8081/payment/all",

                        {
                            headers: {

                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                console.log(
                    "FULL PAYMENT RESPONSE:",
                    response.data
                );


                const allPayments =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : [];


                console.log(
                    "TOTAL PAYMENTS:",
                    allPayments.length
                );


                // =================================================
                // CUSTOMER FILTER
                //
                // First try:
                // payment.booking.customer.id
                //
                // Fallback:
                // payment.customer.id
                // =================================================

                const loggedInCustomerId =
                    Number(
                        customerId
                    );


                const customerPayments =
                    allPayments.filter(
                        (payment) => {

                            const bookingCustomerId =
                                payment
                                    ?.booking
                                    ?.customer
                                    ?.id;


                            const directCustomerId =
                                payment
                                    ?.customer
                                    ?.id;


                            return (

                                Number(
                                    bookingCustomerId
                                ) ===
                                loggedInCustomerId

                            ) ||

                            (

                                Number(
                                    directCustomerId
                                ) ===
                                loggedInCustomerId

                            );
                        }
                    );


                console.log(
                    "CUSTOMER PAYMENTS:",
                    customerPayments
                );


                // =================================================
                // SORT
                //
                // NEWEST PAYMENT FIRST
                //
                // First:
                // paymentDate
                //
                // If same/missing:
                // payment.id
                // =================================================

                const sortedPayments =
                    [
                        ...customerPayments
                    ].sort(
                        (
                            a,
                            b
                        ) => {

                            const dateA =
                                a?.paymentDate
                                    ? new Date(
                                        a.paymentDate
                                    ).getTime()
                                    : 0;


                            const dateB =
                                b?.paymentDate
                                    ? new Date(
                                        b.paymentDate
                                    ).getTime()
                                    : 0;


                            if (
                                dateA !==
                                dateB
                            ) {

                                return (
                                    dateB -
                                    dateA
                                );
                            }


                            return (
                                Number(
                                    b?.id || 0
                                ) -
                                Number(
                                    a?.id || 0
                                )
                            );
                        }
                    );


                console.log(
                    "SORTED PAYMENTS:",
                    sortedPayments
                );


                setPayments(
                    sortedPayments
                );

            } catch (
                error
            ) {

                console.error(
                    "PAYMENT HISTORY ERROR:",
                    error
                );


                if (
                    error.response
                ) {

                    console.error(
                        "BACKEND STATUS:",
                        error.response.status
                    );


                    console.error(
                        "BACKEND DATA:",
                        error.response.data
                    );
                }


                setErrorMessage(
                    "Unable to load payment history."
                );

            } finally {

                setLoading(
                    false
                );
            }
        };


    // ========================================================
    // PAYMENT STATUS COLOR
    // ========================================================

    const getPaymentStatusColor =
        (status) => {

            const value =
                String(
                    status || ""
                ).toUpperCase();


            if (
                value ===
                "PAID"
            ) {

                return "#15803d";
            }


            if (
                value ===
                "CREATED"
            ) {

                return "#2563eb";
            }


            if (
                value ===
                "FAILED"
            ) {

                return "#dc2626";
            }


            if (
                value ===
                "REJECTED"
            ) {

                return "#dc2626";
            }


            if (
                value ===
                "REFUNDED"
            ) {

                return "#7c3aed";
            }


            if (
                value ===
                "VERIFYING"
            ) {

                return "#d97706";
            }


            return "#64748b";
        };


    // ========================================================
    // BOOKING STATUS COLOR
    // ========================================================

    const getBookingStatusColor =
        (status) => {

            const value =
                String(
                    status || ""
                ).toUpperCase();


            if (
                value ===
                "CONFIRMED" ||
                value ===
                "PAID"
            ) {

                return "#15803d";
            }


            if (
                value ===
                "PAYMENT_PENDING"
            ) {

                return "#d97706";
            }


            if (
                value ===
                "PAYMENT_FAILED" ||
                value ===
                "REJECTED"
            ) {

                return "#dc2626";
            }


            if (
                value ===
                "APPROVED"
            ) {

                return "#2563eb";
            }


            return "#64748b";
        };


    // ========================================================
    // GET CUSTOMER
    // ========================================================

    const getCustomer =
        (payment) => {

            return (

                payment
                    ?.booking
                    ?.customer

            ) ||

            (

                payment
                    ?.customer

            ) ||

            {};
        };


    // ========================================================
    // GET BOOKING
    // ========================================================

    const getBooking =
        (payment) => {

            return (
                payment?.booking ||
                {}
            );
        };


    // ========================================================
    // GET CAR VARIANT
    // ========================================================

    const getCarVariant =
        (payment) => {

            return (
                payment
                    ?.booking
                    ?.carVariant ||
                {}
            );
        };


    // ========================================================
    // DOWNLOAD INVOICE
    // ========================================================

    const downloadInvoice =
        (payment) => {

            const customer =
                getCustomer(
                    payment
                );


            const booking =
                getBooking(
                    payment
                );


            const carVariant =
                getCarVariant(
                    payment
                );


            const doc =
                new jsPDF();


            // =================================================
            // HEADER
            // =================================================

            doc.setFontSize(
                22
            );


            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.text(
                "CarRental",
                105,
                18,
                {
                    align:
                        "center"
                }
            );


            doc.setFontSize(
                15
            );


            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.text(
                "PAYMENT RECEIPT / INVOICE",
                105,
                28,
                {
                    align:
                        "center"
                }
            );


            // =================================================
            // PAYMENT SUMMARY BOX
            // =================================================

            autoTable(
                doc,
                {
                    startY:
                        38,

                    theme:
                        "grid",

                    head: [
                        [
                            "Payment Summary",
                            "Details"
                        ]
                    ],

                    body: [

                        [
                            "Invoice Number",
                            "INV-" +
                            (
                                payment?.id ||
                                "N/A"
                            )
                        ],

                        [
                            "Payment ID",
                            payment?.id ||
                            "N/A"
                        ],

                        [
                            "Payment Date",
                            formatDateTime(
                                payment?.paymentDate
                            )
                        ],

                        [
                            "Payment Method",
                            payment?.paymentMethod ||
                            "N/A"
                        ],

                        [
                            "Payment Status",
                            payment?.paymentStatus ||
                            "N/A"
                        ],

                        [
                            "Amount",
                            "Rs. " +
                            formatMoney(
                                payment?.amount
                            )
                        ]
                    ],

                    styles: {

                        fontSize:
                            9,

                        cellPadding:
                            4
                    },

                    headStyles: {

                        fontStyle:
                            "bold"
                    }
                }
            );


            // // =================================================
            // // CUSTOMER DETAILS
            // // =================================================

            // const customerStartY =
            //     doc.lastAutoTable.finalY +
            //     10;


            // autoTable(
            //     doc,
            //     {
            //         startY:
            //             customerStartY,

            //         theme:
            //             "grid",

            //         head: [
            //             [
            //                 "Customer Details",
            //                 "Information"
            //             ]
            //         ],

            //         body: [

            //             [
            //                 "Customer ID",
            //                 customer?.id ||
            //                 "N/A"
            //             ],

            //             [
            //                 "Customer Name",
            //                 customer?.name ||
            //                 "N/A"
            //             ],

            //             [
            //                 "Email",
            //                 customer?.email ||
            //                 "N/A"
            //             ],

            //             [
            //                 "Phone",
            //                 customer?.phone ||
            //                 customer?.mobile ||
            //                 "N/A"
            //             ]
            //         ],

            //         styles: {

            //             fontSize:
            //                 9,

            //             cellPadding:
            //                 4
            //         }
            //     }
            // );


            // =================================================
            // BOOKING DETAILS
            // =================================================

            const bookingStartY =
                doc.lastAutoTable.finalY +
                10;


            autoTable(
                doc,
                {
                    startY:
                        bookingStartY,

                    theme:
                        "grid",

                    head: [
                        [
                            "Booking Details",
                            "Information"
                        ]
                    ],

                    body: [

                        [
                            "Booking ID",
                            booking?.id ||
                            payment?.bookingId ||
                            "N/A"
                        ],

                        [
                            "Car",
                            carVariant?.variantName ||
                            "N/A"
                        ],

                        [
                            "Fuel Type",
                            carVariant?.fuelType ||
                            "N/A"
                        ],

                        [
                            "Car Company",
                            carVariant?.carCompany
                                ?.companyName ||
                            carVariant?.carCompany
                                ?.name ||
                            "N/A"
                        ],

                        [
                            "From Date",
                            formatDate(
                                booking?.fromDate
                            )
                        ],

                        [
                            "To Date",
                            formatDate(
                                booking?.toDate
                            )
                        ],

                        [
                            "Booking Status",
                            booking?.bookingStatus ||
                            "N/A"
                        ],

                        [
                            "Total Booking Amount",
                            "Rs. " +
                            formatMoney(
                                booking?.totalAmount ||
                                payment?.amount
                            )
                        ]
                    ],

                    styles: {

                        fontSize:
                            9,

                        cellPadding:
                            4
                    }
                }
            );


            // =================================================
            // RAZORPAY TRANSACTION DETAILS
            // =================================================

            const razorpayStartY =
                doc.lastAutoTable.finalY +
                10;


            autoTable(
                doc,
                {
                    startY:
                        razorpayStartY,

                    theme:
                        "grid",

                    head: [
                        [
                            "Transaction Details",
                            "Information"
                        ]
                    ],

                    body: [

                        [
                            "Razorpay Order ID",
                            payment?.razorpayOrderId ||
                            "N/A"
                        ],

                        [
                            "Razorpay Payment ID",
                            payment?.razorpayPaymentId ||
                            "N/A"
                        ],

                        [
                            "Razorpay Signature",
                            payment?.razorpaySignature ||
                            "N/A"
                        ],

                        [
                            "UPI Transaction / UTR",
                            payment?.upiTransactionId ||
                            "N/A"
                        ]
                    ],

                    styles: {

                        fontSize:
                            8,

                        cellPadding:
                            4,

                        overflow:
                            "linebreak"
                    }
                }
            );


            // =================================================
            // PICKUP LOCATION
            // =================================================

            if (
                booking?.pickupAddress ||
                booking?.pickupCity ||
                booking?.pickupState ||
                booking?.pickupPincode
            ) {

                const pickupStartY =
                    doc.lastAutoTable.finalY +
                    10;


                const pickupAddress = [

                    booking?.pickupAddress,

                    booking?.pickupLocality,

                    booking?.pickupCity,

                    booking?.pickupDistrict,

                    booking?.pickupState,

                    booking?.pickupPincode

                ]
                    .filter(
                        Boolean
                    )
                    .join(
                        ", "
                    );


                autoTable(
                    doc,
                    {
                        startY:
                            pickupStartY,

                        theme:
                            "grid",

                        head: [
                            [
                                "Pickup Location",
                                "Details"
                            ]
                        ],

                        body: [

                            [
                                "Address",
                                pickupAddress ||
                                "N/A"
                            ],

                            [
                                "Latitude",
                                booking?.pickupLatitude ||
                                "N/A"
                            ],

                            [
                                "Longitude",
                                booking?.pickupLongitude ||
                                "N/A"
                            ]
                        ],

                        styles: {

                            fontSize:
                                9,

                            cellPadding:
                                4
                        }
                    }
                );
            }


            // =================================================
            // FOOTER
            // =================================================

            const footerY =
                doc.lastAutoTable.finalY +
                18;


            doc.setFontSize(
                10
            );


            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.text(
                "Thank you for choosing CarRental !",
                105,
                footerY,
                {
                    align:
                        "center"
                }
            );


            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.setFontSize(
                8
            );


            doc.text(
                "😊 Have a safe and happy journey! ",
                105,
                footerY + 7,
                {
                    align:
                        "center"
                }
            );


            // =================================================
            // SAVE
            // =================================================

            doc.save(
                "CarRental_Payment_Invoice_" +
                (
                    payment?.id ||
                    "N/A"
                ) +
                ".pdf"
            );
        };


    // ========================================================
    // LOADING
    // ========================================================

    if (
        loading
    ) {

        return (

            <div
                style={{
                    minHeight:
                        "calc(100vh - 80px)",

                    display:
                        "flex",

                    justifyContent:
                        "center",

                    alignItems:
                        "center",

                    background:
                        "#f5f7fb"
                }}
            >

                <div
                    style={{
                        background:
                            "white",

                        padding:
                            "35px",

                        borderRadius:
                            "16px",

                        boxShadow:
                            "0 8px 25px rgba(0,0,0,0.08)",

                        textAlign:
                            "center"
                    }}
                >

                    <h2>
                        Loading Payments...
                    </h2>

                    <p
                        style={{
                            color:
                                "#64748b"
                        }}
                    >
                        Please wait while we load
                        your transaction history.
                    </p>

                </div>

            </div>
        );
    }


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <div
            style={{
                minHeight:
                    "calc(100vh - 80px)",

                background:
                    "#f5f7fb",

                padding:
                    "40px 20px"
            }}
        >

            <div
                style={{
                    maxWidth:
                        "1000px",

                    margin:
                        "0 auto"
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    style={{
                        textAlign:
                            "center",

                        marginBottom:
                            "30px"
                    }}
                >

                    <h1
                        style={{
                            margin:
                                "0 0 8px",

                            fontSize:
                                "40px",

                            color:
                                "#1e293b"
                        }}
                    >
                        My Payments
                    </h1>


                    <p
                        style={{
                            margin:
                                "0",

                            color:
                                "#64748b",

                            fontSize:
                                "17px"
                        }}
                    >
                        Your complete Razorpay
                        transaction history
                    </p>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {
                    errorMessage && (

                        <div
                            style={{
                                background:
                                    "#fef2f2",

                                border:
                                    "1px solid #fecaca",

                                color:
                                    "#b91c1c",

                                padding:
                                    "15px",

                                borderRadius:
                                    "10px",

                                marginBottom:
                                    "20px",

                                textAlign:
                                    "center",

                                fontWeight:
                                    "700"
                            }}
                        >
                            {errorMessage}
                        </div>
                    )
                }


                {/* =================================================
                    NO PAYMENTS
                ================================================= */}

                {
                    payments.length === 0 ? (

                        <div
                            style={{
                                background:
                                    "white",

                                padding:
                                    "50px 30px",

                                borderRadius:
                                    "18px",

                                textAlign:
                                    "center",

                                boxShadow:
                                    "0 8px 25px rgba(0,0,0,0.08)"
                            }}
                        >

                            <div
                                style={{
                                    fontSize:
                                        "50px",

                                    marginBottom:
                                        "10px"
                                }}
                            >
                                💳
                            </div>


                            <h2
                                style={{
                                    margin:
                                        "0 0 10px",

                                    color:
                                        "#334155"
                                }}
                            >
                                No Payments Found
                            </h2>


                            <p
                                style={{
                                    color:
                                        "#64748b",

                                    margin:
                                        "0"
                                }}
                            >
                                Your completed or pending
                                payments will appear here.
                            </p>

                        </div>

                    ) : (

                        <>

                            {/* =====================================
                                HISTORY COUNT
                            ===================================== */}

                            <div
                                style={{
                                    background:
                                        "white",

                                    padding:
                                        "15px 20px",

                                    borderRadius:
                                        "12px",

                                    marginBottom:
                                        "20px",

                                    boxShadow:
                                        "0 4px 15px rgba(0,0,0,0.05)",

                                    display:
                                        "flex",

                                    justifyContent:
                                        "space-between",

                                    alignItems:
                                        "center"
                                }}
                            >

                                <strong
                                    style={{
                                        color:
                                            "#334155"
                                    }}
                                >
                                    Payment History
                                </strong>


                                <span
                                    style={{
                                        background:
                                            "#eff6ff",

                                        color:
                                            "#1d4ed8",

                                        padding:
                                            "6px 12px",

                                        borderRadius:
                                            "20px",

                                        fontWeight:
                                            "800"
                                    }}
                                >
                                    {payments.length}
                                    {" "}
                                    Transaction
                                    {
                                        payments.length !==
                                        1
                                            ? "s"
                                            : ""
                                    }
                                </span>

                            </div>


                            {/* =====================================
                                PAYMENTS
                            ===================================== */}

                            {
                                payments.map(
                                    (
                                        payment,
                                        index
                                    ) => {

                                        const customer =
                                            getCustomer(
                                                payment
                                            );


                                        const booking =
                                            getBooking(
                                                payment
                                            );


                                        const carVariant =
                                            getCarVariant(
                                                payment
                                            );


                                        const paymentStatus =
                                            String(
                                                payment?.paymentStatus ||
                                                "N/A"
                                            ).toUpperCase();


                                        const bookingStatus =
                                            String(
                                                booking?.bookingStatus ||
                                                "N/A"
                                            ).toUpperCase();


                                        return (

                                            <div
                                                key={
                                                    payment.id ||
                                                    index
                                                }

                                                style={{
                                                    background:
                                                        "white",

                                                    borderRadius:
                                                        "18px",

                                                    padding:
                                                        "25px",

                                                    marginBottom:
                                                        "22px",

                                                    boxShadow:
                                                        "0 8px 25px rgba(0,0,0,0.08)",

                                                    border:
                                                        index === 0
                                                            ? "2px solid #2563eb"
                                                            : "1px solid #e2e8f0"
                                                }}
                                            >

                                                {/* =================================
                                                    NEWEST LABEL
                                                ================================= */}

                                                {
                                                    index === 0 && (

                                                        <div
                                                            style={{
                                                                display:
                                                                    "inline-block",

                                                                background:
                                                                    "#dbeafe",

                                                                color:
                                                                    "#1d4ed8",

                                                                padding:
                                                                    "5px 12px",

                                                                borderRadius:
                                                                    "20px",

                                                                fontSize:
                                                                    "12px",

                                                                fontWeight:
                                                                    "900",

                                                                marginBottom:
                                                                    "12px"
                                                            }}
                                                        >
                                                            LATEST PAYMENT
                                                        </div>
                                                    )
                                                }


                                                {/* =================================
                                                    TOP ROW
                                                ================================= */}

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",

                                                        justifyContent:
                                                            "space-between",

                                                        alignItems:
                                                            "center",

                                                        gap:
                                                            "15px",

                                                        flexWrap:
                                                            "wrap",

                                                        marginBottom:
                                                            "18px"
                                                    }}
                                                >

                                                    <div>

                                                        <h2
                                                            style={{
                                                                margin:
                                                                    "0 0 5px",

                                                                color:
                                                                    "#0f172a",

                                                                fontSize:
                                                                    "22px"
                                                            }}
                                                        >
                                                            Payment #
                                                            {
                                                                payment.id
                                                            }
                                                        </h2>


                                                        <div
                                                            style={{
                                                                color:
                                                                    "#64748b",

                                                                fontSize:
                                                                    "13px"
                                                            }}
                                                        >
                                                            {formatDateTime(
                                                                payment.paymentDate
                                                            )}
                                                        </div>

                                                    </div>


                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",

                                                            gap:
                                                                "8px",

                                                            flexWrap:
                                                                "wrap"
                                                        }}
                                                    >

                                                        <span
                                                            style={{
                                                                background:
                                                                    getPaymentStatusColor(
                                                                        paymentStatus
                                                                    ) +
                                                                    "18",

                                                                color:
                                                                    getPaymentStatusColor(
                                                                        paymentStatus
                                                                    ),

                                                                padding:
                                                                    "7px 12px",

                                                                borderRadius:
                                                                    "20px",

                                                                fontWeight:
                                                                    "900",

                                                                fontSize:
                                                                    "12px"
                                                            }}
                                                        >
                                                            PAYMENT:
                                                            {" "}
                                                            {paymentStatus}
                                                        </span>


                                                        <span
                                                            style={{
                                                                background:
                                                                    getBookingStatusColor(
                                                                        bookingStatus
                                                                    ) +
                                                                    "18",

                                                                color:
                                                                    getBookingStatusColor(
                                                                        bookingStatus
                                                                    ),

                                                                padding:
                                                                    "7px 12px",

                                                                borderRadius:
                                                                    "20px",

                                                                fontWeight:
                                                                    "900",

                                                                fontSize:
                                                                    "12px"
                                                            }}
                                                        >
                                                            BOOKING:
                                                            {" "}
                                                            {bookingStatus}
                                                        </span>

                                                    </div>

                                                </div>


                                                {/* =================================
                                                    MAIN INFORMATION GRID
                                                ================================= */}

                                                <div
                                                    style={{
                                                        display:
                                                            "grid",

                                                        gridTemplateColumns:
                                                            "repeat(auto-fit,minmax(220px,1fr))",

                                                        gap:
                                                            "14px"
                                                    }}
                                                >

                                                    {/* CUSTOMER */}

                                                    <div
                                                        style={{
                                                            background:
                                                                "#f8fafc",

                                                            padding:
                                                                "16px",

                                                            borderRadius:
                                                                "12px"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "12px",

                                                                color:
                                                                    "#64748b",

                                                                fontWeight:
                                                                    "800",

                                                                marginBottom:
                                                                    "8px"
                                                            }}
                                                        >
                                                            CUSTOMER
                                                        </div>


                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "17px",

                                                                fontWeight:
                                                                    "900",

                                                                color:
                                                                    "#0f172a"
                                                            }}
                                                        >
                                                            {
                                                                customer?.name ||
                                                                "N/A"
                                                            }
                                                        </div>


                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "13px",

                                                                color:
                                                                    "#64748b",

                                                                marginTop:
                                                                    "5px"
                                                            }}
                                                        >
                                                            {
                                                                customer?.email ||
                                                                "N/A"
                                                            }
                                                        </div>


                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "13px",

                                                                color:
                                                                    "#64748b",

                                                                marginTop:
                                                                    "3px"
                                                            }}
                                                        >
                                                            {
                                                                customer?.phone ||
                                                                customer?.mobile ||
                                                                "N/A"
                                                            }
                                                        </div>

                                                    </div>


                                                    {/* CAR */}

                                                    <div
                                                        style={{
                                                            background:
                                                                "#f8fafc",

                                                            padding:
                                                                "16px",

                                                            borderRadius:
                                                                "12px"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "12px",

                                                                color:
                                                                    "#64748b",

                                                                fontWeight:
                                                                    "800",

                                                                marginBottom:
                                                                    "8px"
                                                            }}
                                                        >
                                                            VEHICLE
                                                        </div>


                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "17px",

                                                                fontWeight:
                                                                    "900",

                                                                color:
                                                                    "#0f172a"
                                                            }}
                                                        >
                                                            {
                                                                carVariant?.variantName ||
                                                                "N/A"
                                                            }
                                                        </div>


                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "13px",

                                                                color:
                                                                    "#64748b",

                                                                marginTop:
                                                                    "5px"
                                                            }}
                                                        >
                                                            Fuel:
                                                            {" "}
                                                            {
                                                                carVariant?.fuelType ||
                                                                "N/A"
                                                            }
                                                        </div>

                                                    </div>


                                                    {/* AMOUNT */}

                                                    <div
                                                        style={{
                                                            background:
                                                                "#eff6ff",

                                                            padding:
                                                                "16px",

                                                            borderRadius:
                                                                "12px"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "12px",

                                                                color:
                                                                    "#64748b",

                                                                fontWeight:
                                                                    "800",

                                                                marginBottom:
                                                                    "8px"
                                                            }}
                                                        >
                                                            AMOUNT PAID
                                                        </div>


                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "25px",

                                                                fontWeight:
                                                                    "900",

                                                                color:
                                                                    "#1d4ed8"
                                                            }}
                                                        >
                                                            ₹
                                                            {
                                                                formatMoney(
                                                                    payment.amount
                                                                )
                                                            }
                                                        </div>


                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "13px",

                                                                color:
                                                                    "#64748b",

                                                                marginTop:
                                                                    "5px"
                                                            }}
                                                        >
                                                            {
                                                                payment.paymentMethod ||
                                                                "N/A"
                                                            }
                                                        </div>

                                                    </div>

                                                </div>


                                                {/* =================================
                                                    TRANSACTION DETAILS
                                                ================================= */}

                                                <div
                                                    style={{
                                                        marginTop:
                                                            "18px",

                                                        borderTop:
                                                            "1px solid #e2e8f0",

                                                        paddingTop:
                                                            "18px"
                                                    }}
                                                >

                                                    <h3
                                                        style={{
                                                            margin:
                                                                "0 0 12px",

                                                            fontSize:
                                                                "16px",

                                                            color:
                                                                "#334155"
                                                        }}
                                                    >
                                                        Transaction Details
                                                    </h3>


                                                    <div
                                                        style={{
                                                            display:
                                                                "grid",

                                                            gridTemplateColumns:
                                                                "repeat(auto-fit,minmax(250px,1fr))",

                                                            gap:
                                                                "10px"
                                                        }}
                                                    >

                                                        <div>

                                                            <b>
                                                                Booking ID:
                                                            </b>

                                                            {" "}

                                                            {
                                                                booking?.id ||
                                                                "N/A"
                                                            }

                                                        </div>


                                                        <div>

                                                            <b>
                                                                Razorpay Order ID:
                                                            </b>

                                                            {" "}

                                                            <span
                                                                style={{
                                                                    wordBreak:
                                                                        "break-all"
                                                                }}
                                                            >
                                                                {
                                                                    payment?.razorpayOrderId ||
                                                                    "N/A"
                                                                }
                                                            </span>

                                                        </div>


                                                        <div>

                                                            <b>
                                                                Razorpay Payment ID:
                                                            </b>

                                                            {" "}

                                                            <span
                                                                style={{
                                                                    wordBreak:
                                                                        "break-all"
                                                                }}
                                                            >
                                                                {
                                                                    payment?.razorpayPaymentId ||
                                                                    "N/A"
                                                                }
                                                            </span>

                                                        </div>


                                                        {
                                                            payment?.upiTransactionId && (

                                                                <div>

                                                                    <b>
                                                                        UTR:
                                                                    </b>

                                                                    {" "}

                                                                    {
                                                                        payment.upiTransactionId
                                                                    }

                                                                </div>
                                                            )
                                                        }


                                                        <div>

                                                            <b>
                                                                From:
                                                            </b>

                                                            {" "}

                                                            {
                                                                formatDate(
                                                                    booking?.fromDate
                                                                )
                                                            }

                                                        </div>


                                                        <div>

                                                            <b>
                                                                To:
                                                            </b>

                                                            {" "}

                                                            {
                                                                formatDate(
                                                                    booking?.toDate
                                                                )
                                                            }

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* =================================
                                                    DOWNLOAD
                                                ================================= */}

                                                <button

                                                    type="button"

                                                    onClick={() =>
                                                        downloadInvoice(
                                                            payment
                                                        )
                                                    }

                                                    style={{
                                                        width:
                                                            "100%",

                                                        marginTop:
                                                            "20px",

                                                        height:
                                                            "48px",

                                                        border:
                                                            "none",

                                                        borderRadius:
                                                            "10px",

                                                        background:
                                                            "#2563eb",

                                                        color:
                                                            "white",

                                                        fontWeight:
                                                            "900",

                                                        fontSize:
                                                            "15px",

                                                        cursor:
                                                            "pointer"
                                                    }}
                                                >
                                                    📄 Download Detailed Invoice PDF
                                                </button>

                                            </div>
                                        );
                                    }
                                )
                            }

                        </>
                    )
                }

            </div>

        </div>
    );
}


export default MyPayments;