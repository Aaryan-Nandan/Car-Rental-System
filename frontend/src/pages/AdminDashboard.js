import {
    useEffect,
    useRef,
    useState
} from "react";

import axios from "axios";

import {
    useNavigate
} from "react-router-dom";

import API_URL from "../config";

import DashboardCharts
    from "../components/charts/DashboardCharts";

import jsPDF
    from "jspdf";

import autoTable
    from "jspdf-autotable";


// =========================================================
// STAT CARD
// =========================================================

function StatCard({ title, value }) {

    return (
        <div
            style={{
                backgroundColor: "white",
                border: "1px solid #e1e1e1",
                borderRadius: "10px",
                padding: "18px",
                boxShadow:
                    "0 2px 8px rgba(0,0,0,0.05)"
            }}
        >

            <p
                style={{
                    margin: "0 0 8px",
                    color: "#777",
                    fontSize: "14px"
                }}
            >
                {title}
            </p>

            <h2
                style={{
                    margin: "0",
                    fontSize: "28px",
                    color: "#111827"
                }}
            >
                {value}
            </h2>

        </div>
    );
}


// =========================================================
// ADMIN DASHBOARD
// =========================================================

function AdminDashboard() {

    const navigate = useNavigate();

    const API = API_URL;


    // =====================================================
    // STATES
    // =====================================================

    const [
        payments,
        setPayments
    ] = useState([]);

    const [
        customers,
        setCustomers
    ] = useState([]);

    const [
        dashboardData,
        setDashboardData
    ] = useState({});

    const [
        loadingPayments,
        setLoadingPayments
    ] = useState(false);

    const [
        loadingCustomers,
        setLoadingCustomers
    ] = useState(false);

    const [
        customerIdSearch,
        setCustomerIdSearch
    ] = useState("");

    const [
        customerNameSearch,
        setCustomerNameSearch
    ] = useState("");

    const [
        phoneSearch,
        setPhoneSearch
    ] = useState("");

    const [
        dateSearch,
        setDateSearch
    ] = useState("");

    const [
        paymentStatusFilter,
        setPaymentStatusFilter
    ] = useState("ALL");


    // =====================================================
    // CHART REFS
    // =====================================================

    const chartSectionRef =
        useRef(null);

    const chartContentRef =
        useRef(null);


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchDashboardData();

        fetchPayments();

        fetchCustomers();

    }, []);


    // =====================================================
    // FETCH DASHBOARD
    // =====================================================

    const fetchDashboardData = () => {

        axios
            .get(
                `${API}/admin/dashboard`
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

                setDashboardData({});

            });

    };


    // =====================================================
    // FETCH PAYMENTS
    // =====================================================

    const fetchPayments = () => {

        setLoadingPayments(true);

        axios
            .get(
                `${API}/payment/all`
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

                setPayments([]);

            })
            .finally(() => {

                setLoadingPayments(false);

            });

    };


    // =====================================================
    // FETCH CUSTOMERS
    // =====================================================

    const fetchCustomers = () => {

        setLoadingCustomers(true);

        axios
            .get(
                `${API}/customer/all`
            )
            .then((response) => {

                if (
                    Array.isArray(
                        response.data
                    )
                ) {

                    setCustomers(
                        response.data
                    );

                } else {

                    setCustomers([]);

                }

            })
            .catch((error) => {

                console.error(
                    "Customer Error:",
                    error
                );

                setCustomers([]);

            })
            .finally(() => {

                setLoadingCustomers(false);

            });

    };


    // =====================================================
    // REFRESH
    // =====================================================

    const refreshDashboard = () => {

        fetchDashboardData();

        fetchPayments();

        fetchCustomers();

    };


    // =====================================================
    // REJECT / REFUND PAYMENT
    // =====================================================

    const rejectPayment = (
        paymentId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to reject/refund this payment?"
            );

        if (!confirmed) {
            return;
        }

        axios
            .put(
                `${API}/payment/reject/${paymentId}`
            )
            .then(() => {

                alert(
                    "Payment rejected/refunded successfully."
                );

                fetchPayments();

                fetchDashboardData();

            })
            .catch((error) => {

                console.error(
                    "Reject Payment Error:",
                    error
                );

                alert(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Unable to reject payment."
                );

            });

    };


    // =====================================================
    // CHART SCROLL ANIMATION
    // =====================================================

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
                startPoint -
                endPoint;

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
                (
                    0.28 *
                    limitedProgress
                );

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


    // =====================================================
    // SORT PAYMENTS
    // =====================================================

    const sortedPayments = [
        ...payments
    ].sort(
        (a, b) => {

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
                dateA !== dateB
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


    // =====================================================
    // FILTER CUSTOMERS
    // =====================================================

    const filteredCustomers =
        customers.filter(
            (customer) => {

                const idMatch =
                    !customerIdSearch ||
                    String(
                        customer?.id || ""
                    )
                        .toLowerCase()
                        .includes(
                            customerIdSearch
                                .toLowerCase()
                        );


                const nameMatch =
                    !customerNameSearch ||
                    String(
                        customer?.name || ""
                    )
                        .toLowerCase()
                        .includes(
                            customerNameSearch
                                .toLowerCase()
                        );


                const phoneMatch =
                    !phoneSearch ||
                    String(
                        customer?.phone || ""
                    )
                        .toLowerCase()
                        .includes(
                            phoneSearch
                                .toLowerCase()
                        ) ||
                    String(
                        customer?.alternatePhone ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            phoneSearch
                                .toLowerCase()
                        );


                return (
                    idMatch &&
                    nameMatch &&
                    phoneMatch
                );

            }
        );


    // =====================================================
    // FILTER PAYMENTS
    // =====================================================

    const filteredPayments =
        sortedPayments.filter(
            (payment) => {

                const customer =
                    payment?.customer ||
                    payment?.booking?.customer ||
                    null;


                if (
                    customerIdSearch
                ) {

                    const id =
                        String(
                            customer?.id ||
                            ""
                        )
                            .toLowerCase();

                    if (
                        !id.includes(
                            customerIdSearch
                                .toLowerCase()
                        )
                    ) {

                        return false;

                    }

                }


                if (
                    customerNameSearch
                ) {

                    const name =
                        String(
                            customer?.name ||
                            ""
                        )
                            .toLowerCase();

                    if (
                        !name.includes(
                            customerNameSearch
                                .toLowerCase()
                        )
                    ) {

                        return false;

                    }

                }


                if (
                    phoneSearch
                ) {

                    const phone =
                        String(
                            customer?.phone ||
                            ""
                        )
                            .toLowerCase();

                    const alternatePhone =
                        String(
                            customer?.alternatePhone ||
                            ""
                        )
                            .toLowerCase();

                    const search =
                        phoneSearch
                            .toLowerCase();

                    if (
                        !phone.includes(
                            search
                        ) &&
                        !alternatePhone.includes(
                            search
                        )
                    ) {

                        return false;

                    }

                }


                if (
                    paymentStatusFilter !==
                    "ALL"
                ) {

                    const status =
                        String(
                            payment?.paymentStatus ||
                            ""
                        )
                            .toUpperCase();

                    if (
                        status !==
                        paymentStatusFilter
                    ) {

                        return false;

                    }

                }


                if (
                    dateSearch
                ) {

                    const paymentDate =
                        payment?.paymentDate
                            ? String(
                                payment.paymentDate
                            ).substring(
                                0,
                                10
                            )
                            : "";

                    if (
                        paymentDate !==
                        dateSearch
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );


    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {

        setCustomerIdSearch("");

        setCustomerNameSearch("");

        setPhoneSearch("");

        setDateSearch("");

        setPaymentStatusFilter(
            "ALL"
        );

    };


    // =====================================================
    // PAYMENT STATUS COLOR
    // =====================================================

    const getPaymentStatusColor =
        (status) => {

            const value =
                String(
                    status || ""
                ).toUpperCase();


            if (
                value === "PAID"
            ) {
                return "green";
            }


            if (
                value === "FAILED" ||
                value === "REJECTED"
            ) {
                return "red";
            }


            if (
                value === "CREATED" ||
                value === "PENDING"
            ) {
                return "orange";
            }


            return "#555";

        };


    // =====================================================
    // BOOKING STATUS COLOR
    // =====================================================

    const getBookingStatusColor =
        (status) => {

            const value =
                String(
                    status || ""
                ).toUpperCase();


            if (
                value === "APPROVED" ||
                value === "CONFIRMED" ||
                value === "COMPLETED"
            ) {
                return "green";
            }


            if (
                value === "REJECTED" ||
                value === "CANCELLED" ||
                value === "FAILED"
            ) {
                return "red";
            }


            if (
                value === "PENDING" ||
                value === "CREATED"
            ) {
                return "orange";
            }


            return "#555";

        };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (
        date
    ) => {

        if (!date) {
            return "N/A";
        }

        const parsed =
            new Date(date);


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return String(date);
        }


        return parsed.toLocaleString(
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


   // =====================================================
// DOWNLOAD PAYMENT PDF
// =====================================================

const downloadPaymentPDF = (payment) => {

    const pdf = new jsPDF();

    const customer =
        payment?.customer ||
        payment?.booking?.customer ||
        null;

    const booking =
        payment?.booking ||
        null;

    const carVariant =
        booking?.carVariant ||
        null;

    const car =
        booking?.car ||
        null;


    // =====================================================
    // IMPORTANT:
    // Use actual payment amount.
    // Do NOT use a fixed amount.
    // =====================================================

    const paymentAmount =
        Number(payment?.amount ?? 0);

    const bookingTotalAmount =
        Number(
            booking?.totalAmount ??
            paymentAmount
        );


    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (value) => {

        const number =
            Number(value ?? 0);

        if (Number.isNaN(number)) {
            return "Rs. 0";
        }

        return `Rs. ${number.toLocaleString("en-IN", {
            maximumFractionDigits: 0
        })}`;
    };


    // =====================================================
    // PDF TITLE
    // =====================================================

    pdf.setFontSize(18);

    pdf.text(
        "CarRental",
        14,
        18
    );


    pdf.setFontSize(14);

    pdf.text(
        "Customer Booking Detail",
        14,
        30
    );


    // =====================================================
    // PAYMENT INFORMATION
    // =====================================================

    autoTable(
        pdf,
        {
            startY: 38,

            head: [
                [
                    "Payment Information",
                    "Details"
                ]
            ],

            body: [

                [
                    "Payment ID",
                    payment?.id ?? "N/A"
                ],

                [
                    "Amount",
                    formatMoney(paymentAmount)
                ],

                [
                    "Status",
                    payment?.paymentStatus || "N/A"
                ],

                [
                    "Payment Method",
                    payment?.paymentMethod || "N/A"
                ],

                [
                    "Payment Date",
                    formatDate(
                        payment?.paymentDate
                    )
                ]

            ]
        }
    );


    let nextY =
        pdf.lastAutoTable.finalY + 10;


    // =====================================================
    // CUSTOMER INFORMATION
    // =====================================================

    autoTable(
        pdf,
        {
            startY: nextY,

            head: [
                [
                    "Customer Information",
                    "Details"
                ]
            ],

            body: [

                [
                    "Customer ID",
                    customer?.id ?? "N/A"
                ],

                [
                    "Name",
                    customer?.name || "N/A"
                ],

                [
                    "Email",
                    customer?.email || "N/A"
                ],

                [
                    "Phone",
                    customer?.phone || "N/A"
                ],

                [
                    "Alternate Phone",
                    customer?.alternatePhone || "N/A"
                ],

                [
                    "Blood Group",
                    customer?.bloodGroup || "N/A"
                ],

                [
                    "Permanent Address",
                    customer?.address || "N/A"
                ]

            ]
        }
    );


    nextY =
        pdf.lastAutoTable.finalY + 10;


    // =====================================================
    // BOOKING INFORMATION
    // =====================================================

    autoTable(
        pdf,
        {
            startY: nextY,

            head: [
                [
                    "Booking Information",
                    "Details"
                ]
            ],

            body: [

                [
                    "Booking ID",
                    booking?.id ?? "N/A"
                ],

                [
                    "Booking Status",
                    booking?.bookingStatus || "N/A"
                ],

                [
                    "From Date",
                    booking?.fromDate || "N/A"
                ],

                [
                    "To Date",
                    booking?.toDate || "N/A"
                ],

                [
                    "Total Amount",
                    formatMoney(bookingTotalAmount)
                ],

                [
                    "Pickup Address",
                    booking?.pickupAddress || "N/A"
                ]

            ]
        }
    );


    nextY =
        pdf.lastAutoTable.finalY + 10;


    // =====================================================
    // VEHICLE INFORMATION
    // =====================================================

    autoTable(
        pdf,
        {
            startY: nextY,

            head: [
                [
                    "Vehicle Information",
                    "Details"
                ]
            ],

            body: [

                [
                    "Car",
                    carVariant?.variantName || "N/A"
                ],

                [
                    "Fuel Type",
                    carVariant?.fuelType || "N/A"
                ],

                [
                    "Price Per Day",
                    formatMoney(
                        carVariant?.pricePerDay ?? 0
                    )
                ],

                [
                    "Registration Number",
                    car?.registrationNumber ||
                    "Not Assigned"
                ],

                [
                    "Color",
                    car?.color || "N/A"
                ]

            ]
        }
    );


    nextY =
        pdf.lastAutoTable.finalY + 10;


    // =====================================================
    // RAZORPAY DETAILS
    // =====================================================

    autoTable(
        pdf,
        {
            startY: nextY,

            head: [
                [
                    "Razorpay Details",
                    "Details"
                ]
            ],

            body: [

                [
                    "Order ID",
                    payment?.razorpayOrderId ||
                    "N/A"
                ],

                [
                    "Razorpay Payment ID",
                    payment?.razorpayPaymentId ||
                    "N/A"
                ],

                [
                    "Signature",
                    payment?.razorpaySignature ||
                    "N/A"
                ],

                [
                    "UTR / Transaction ID",
                    payment?.upiTransactionId ||
                    "N/A"
                ]
                

            ]
            
        }
    );


    // =====================================================
    // SAVE PDF
    // =====================================================

    pdf.save(
        `CarRental-Customer-Booking-${payment?.id || "details"}.pdf`
    );

};


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f7f7f7",
                padding: "30px",
                boxSizing: "border-box"
            }}
        >


            {/* =================================================
                QUICK CONTROLS
            ================================================= */}

            <section
                style={{
                    background:
                        "linear-gradient(135deg, #111827, #1f2937)",
                    borderRadius: "14px",
                    padding: "22px",
                    marginBottom: "25px",
                    color: "white",
                    boxShadow:
                        "0 8px 25px rgba(0,0,0,0.15)"
                }}
            >

                <div
                    style={{
                        marginBottom: "18px"
                    }}
                >

                    <h2
                        style={{
                            margin: "0 0 5px",
                            fontSize: "24px",
                            fontWeight: "700"
                        }}
                    >
                        Admin Quick Controls
                    </h2>

                    <p
                        style={{
                            margin: "0",
                            color: "#d1d5db",
                            fontSize: "14px"
                        }}
                    >
                        Manage cars and monitor
                        customer reviews
                    </p>

                </div>


                <div
                    className="admin-quick-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: "15px"
                    }}
                >

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/manage-cars"
                            )
                        }
                        style={{
                            border: "none",
                            borderRadius: "10px",
                            padding: "20px",
                            background: "white",
                            color: "#111827",
                            cursor: "pointer",
                            textAlign: "left"
                        }}
                    >

                        <div
                            style={{
                                fontSize: "32px",
                                marginBottom: "8px"
                            }}
                        >
                            
                        </div>

                        <h3
                            style={{
                                margin: "0 0 7px",
                                fontSize: "19px"
                            }}
                        >
                            Manage Cars
                        </h3>

                        <p
                            style={{
                                margin: "0",
                                color: "#6b7280",
                                lineHeight: "1.5",
                                fontSize: "14px"
                            }}
                        >
                            Add cars, model/variant,
                            registration number,
                            color and manage
                            availability.
                        </p>

                        <div
                            style={{
                                marginTop: "12px",
                                color: "#2563eb",
                                fontWeight: "700"
                            }}
                        >
                            Open Car Management →
                        </div>

                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/manage-reviews"
                            )
                        }
                        style={{
                            border: "none",
                            borderRadius: "10px",
                            padding: "20px",
                            background: "white",
                            color: "#111827",
                            cursor: "pointer",
                            textAlign: "left"
                        }}
                    >

                        <div
                            style={{
                                fontSize: "32px",
                                marginBottom: "8px"
                            }}
                        >
                            
                        </div>

                        <h3
                            style={{
                                margin: "0 0 7px",
                                fontSize: "19px"
                            }}
                        >
                            Customer Reviews
                        </h3>

                        <p
                            style={{
                                margin: "0",
                                color: "#6b7280",
                                lineHeight: "1.5",
                                fontSize: "14px"
                            }}
                        >
                            Read customer ratings,
                            reviews and feedback
                            about your rental service.
                        </p>

                        <div
                            style={{
                                marginTop: "12px",
                                color: "#2563eb",
                                fontWeight: "700"
                            }}
                        >
                            Read Reviews →
                        </div>

                    </button>

                </div>

            </section>


            {/* =================================================
                DASHBOARD HEADER
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "15px",
                    flexWrap: "wrap",
                    marginBottom: "20px"
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: "0 0 5px",
                            fontSize: "32px",
                            fontWeight: "700"
                        }}
                    >
                        Admin Dashboard
                    </h1>

                    <p
                        style={{
                            margin: "0",
                            color: "#777"
                        }}
                    >
                        Monitor customers,
                        cars and payments
                    </p>

                </div>


                <button
                    type="button"
                    onClick={
                        refreshDashboard
                    }
                    style={{
                        padding: "10px 18px",
                        backgroundColor: "#111827",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600"
                    }}
                >
                    Refresh Dashboard
                </button>

            </div>


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div
                className="admin-stat-grid"
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(4, minmax(0, 1fr))",
                    gap: "12px",
                    marginBottom: "20px"
                }}
            >

                <StatCard
                    title="Customers"
                    value={
                        dashboardData.totalCustomers ||
                        customers.length ||
                        0
                    }
                />

                <StatCard
                    title="Cars"
                    value={
                        dashboardData.totalCars ||
                        0
                    }
                />

                <StatCard
                    title="Bookings"
                    value={
                        dashboardData.totalBookings ||
                        0
                    }
                />

                <StatCard
                    title="Payments"
                    value={
                        dashboardData.totalPayments ||
                        payments.length ||
                        0
                    }
                />

            </div>


            {/* =================================================
                DASHBOARD CHART
            ================================================= */}

            <div
                ref={chartSectionRef}
                style={{
                    position: "relative",
                    marginBottom: "30px",
                    width: "100%"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        width: "100%",
                        overflow: "visible"
                    }}
                >

                    <div
                        ref={chartContentRef}
                        style={{
                            width: "100%",
                            maxWidth: "1100px",
                            transform: "scale(0.72)",
                            transformOrigin:
                                "center top",
                            transition:
                                "transform 0.08s linear",
                            willChange:
                                "transform"
                        }}
                    >

                        <DashboardCharts
                            dashboardData={
                                dashboardData
                            }
                        />

                    </div>

                </div>

            </div>


            {/* =================================================
                CUSTOMER DETAILS
            ================================================= */}

            <section
                style={{
                    backgroundColor: "white",
                    border: "1px solid #e1e1e1",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow:
                        "0 2px 8px rgba(0,0,0,0.05)",
                    width: "100%",
                    boxSizing: "border-box"
                }}
            >

                {/* HEADER */}

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        gap: "10px",
                        flexWrap: "wrap"
                    }}
                >

                    <div>

                        <h2
                            style={{
                                margin: "0 0 5px",
                                fontSize: "22px"
                            }}
                        >
                            Customer Details
                        </h2>

                        <p
                            style={{
                                margin: "0",
                                color: "#777",
                                fontSize: "14px"
                            }}
                        >
                            Customer, payment, vehicle
                            and Razorpay transaction
                            details
                        </p>

                    </div>


                    <span
                        style={{
                            backgroundColor: "#f1f1f1",
                            padding: "6px 10px",
                            borderRadius: "15px",
                            fontSize: "13px"
                        }}
                    >
                        {
                            filteredPayments.length
                        } Payments
                    </span>

                </div>


                {/* =================================================
                    SEARCH / FILTER AREA
                ================================================= */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(5, minmax(0, 1fr))",
                        gap: "10px",
                        marginBottom: "20px"
                    }}
                >

                    <input
                        type="text"
                        placeholder="Customer ID"
                        value={
                            customerIdSearch
                        }
                        onChange={(e) =>
                            setCustomerIdSearch(
                                e.target.value
                            )
                        }
                        style={{
                            padding: "10px",
                            border:
                                "1px solid #ccc",
                            borderRadius: "6px",
                            width: "100%",
                            boxSizing:
                                "border-box"
                        }}
                    />


                    <input
                        type="text"
                        placeholder="Customer Name"
                        value={
                            customerNameSearch
                        }
                        onChange={(e) =>
                            setCustomerNameSearch(
                                e.target.value
                            )
                        }
                        style={{
                            padding: "10px",
                            border:
                                "1px solid #ccc",
                            borderRadius: "6px",
                            width: "100%",
                            boxSizing:
                                "border-box"
                        }}
                    />


                    <input
                        type="text"
                        placeholder="Phone"
                        value={
                            phoneSearch
                        }
                        onChange={(e) =>
                            setPhoneSearch(
                                e.target.value
                            )
                        }
                        style={{
                            padding: "10px",
                            border:
                                "1px solid #ccc",
                            borderRadius: "6px",
                            width: "100%",
                            boxSizing:
                                "border-box"
                        }}
                    />


                    <input
                        type="date"
                        value={
                            dateSearch
                        }
                        onChange={(e) =>
                            setDateSearch(
                                e.target.value
                            )
                        }
                        style={{
                            padding: "10px",
                            border:
                                "1px solid #ccc",
                            borderRadius: "6px",
                            width: "100%",
                            boxSizing:
                                "border-box"
                        }}
                    />


                    <select
                        value={
                            paymentStatusFilter
                        }
                        onChange={(e) =>
                            setPaymentStatusFilter(
                                e.target.value
                            )
                        }
                        style={{
                            padding: "10px",
                            border:
                                "1px solid #ccc",
                            borderRadius: "6px",
                            width: "100%",
                            boxSizing:
                                "border-box"
                        }}
                    >

                        <option value="ALL">
                            All Payments
                        </option>

                        <option value="PAID">
                            Paid
                        </option>

                        <option value="FAILED">
                            Failed
                        </option>

                        <option value="REJECTED">
                            Rejected
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="CREATED">
                            Created
                        </option>

                    </select>

                </div>


                <button
                    type="button"
                    onClick={
                        clearFilters
                    }
                    style={{
                        padding: "9px 16px",
                        marginBottom: "20px",
                        backgroundColor:
                            "#6b7280",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    Clear Filters
                </button>


                {/* =================================================
                    LOADING
                ================================================= */}

                {
                    loadingPayments && (

                        <p
                            style={{
                                textAlign:
                                    "center",
                                color: "#777",
                                padding: "30px"
                            }}
                        >
                            Loading customer details...
                        </p>

                    )
                }


                {/* =================================================
                    EMPTY
                ================================================= */}

                {
                    !loadingPayments &&
                    filteredPayments.length === 0 && (

                        <p
                            style={{
                                color: "#777",
                                textAlign: "center",
                                padding: "40px 0"
                            }}
                        >
                            No customer details found.
                        </p>

                    )
                }


                {/* =================================================
                    PAYMENT / CUSTOMER CARDS
                ================================================= */}

                {
                    !loadingPayments &&
                    filteredPayments.length > 0 && (

                        <div>

                            {
                                filteredPayments.map(
                                    (payment) => {

                                        const booking =
                                            payment?.booking ||
                                            null;


                                        const customer =
                                            payment?.customer ||
                                            booking?.customer ||
                                            null;


                                        const carVariant =
                                            booking?.carVariant ||
                                            null;


                                        const car =
                                            booking?.car ||
                                            null;


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
                                                    payment.id
                                                }
                                                style={{
                                                    border:
                                                        "1px solid #ddd",
                                                    borderRadius:
                                                        "10px",
                                                    padding:
                                                        "20px",
                                                    marginBottom:
                                                        "18px",
                                                    backgroundColor:
                                                        "#fafafa"
                                                }}
                                            >

                                                {/* HEADER */}

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems:
                                                            "center",
                                                        gap: "10px",
                                                        flexWrap:
                                                            "wrap",
                                                        marginBottom:
                                                            "18px"
                                                    }}
                                                >

                                                    <h3
                                                        style={{
                                                            margin:
                                                                "0",
                                                            fontSize:
                                                                "20px"
                                                        }}
                                                    >
                                                        Customer Details #
                                                        {
                                                            payment.id
                                                        }
                                                    </h3>


                                                    <span
                                                        style={{
                                                            color:
                                                                getPaymentStatusColor(
                                                                    paymentStatus
                                                                ),
                                                            fontWeight:
                                                                "700",
                                                            fontSize:
                                                                "15px"
                                                        }}
                                                    >
                                                        {
                                                            paymentStatus
                                                        }
                                                    </span>

                                                </div>


                                                {/* =================================================
                                                    LEFT CUSTOMER / RIGHT PAYMENT
                                                ================================================= */}

                                                <div
                                                    className=
                                                        "admin-customer-payment-grid"
                                                    style={{
                                                        display:
                                                            "grid",
                                                        gridTemplateColumns:
                                                            "1fr 1fr",
                                                        gap:
                                                            "15px",
                                                        alignItems:
                                                            "stretch"
                                                    }}
                                                >

                                                    {/* CUSTOMER */}

                                                    <div
                                                        style={{
                                                            backgroundColor:
                                                                "white",
                                                            borderRadius:
                                                                "8px",
                                                            padding:
                                                                "18px",
                                                            border:
                                                                "1px solid #eee"
                                                        }}
                                                    >

                                                        <h4
                                                            style={{
                                                                margin:
                                                                    "0 0 15px",
                                                                fontSize:
                                                                    "18px",
                                                                color:
                                                                    "#111827"
                                                            }}
                                                        >
                                                            Customer Information
                                                        </h4>


                                                        <p>
                                                            <strong>
                                                                Customer ID:
                                                            </strong>{" "}
                                                            {
                                                                customer?.id ||
                                                                "N/A"
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Customer Name:
                                                            </strong>{" "}
                                                            {
                                                                customer?.name ||
                                                                "N/A"
                                                            }
                                                        </p>


                                                        <p
                                                            style={{
                                                                wordBreak:
                                                                    "break-word"
                                                            }}
                                                        >
                                                            <strong>
                                                                Email:
                                                            </strong>{" "}
                                                            {
                                                                customer?.email ||
                                                                "N/A"
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Phone:
                                                            </strong>{" "}
                                                            {
                                                                customer?.phone ||
                                                                customer?.mobile ||
                                                                "N/A"
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Alternate Phone:
                                                            </strong>{" "}
                                                            {
                                                                customer?.alternatePhone ||
                                                                "N/A"
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Blood Group:
                                                            </strong>{" "}
                                                            {
                                                                customer?.bloodGroup ||
                                                                "N/A"
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Permanent Address:
                                                            </strong>{" "}
                                                            {
                                                                customer?.address ||
                                                                "N/A"
                                                            }
                                                        </p>

                                                    </div>


                                                    {/* PAYMENT */}

                                                    <div
                                                        style={{
                                                            backgroundColor:
                                                                "white",
                                                            borderRadius:
                                                                "8px",
                                                            padding:
                                                                "18px",
                                                            border:
                                                                "1px solid #eee"
                                                        }}
                                                    >

                                                        <h4
                                                            style={{
                                                                margin:
                                                                    "0 0 15px",
                                                                fontSize:
                                                                    "18px",
                                                                color:
                                                                    "#111827"
                                                            }}
                                                        >
                                                            Payment Information
                                                        </h4>


                                                        <p>
                                                            <strong>
                                                                Payment ID:
                                                            </strong>{" "}
                                                            {
                                                                payment?.id ||
                                                                "N/A"
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Amount:
                                                            </strong>{" "}
                                                            ₹
                                                            {
                                                                payment?.amount ||
                                                                0
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Status:
                                                            </strong>{" "}

                                                            <span
                                                                style={{
                                                                    color:
                                                                        getPaymentStatusColor(
                                                                            paymentStatus
                                                                        ),
                                                                    fontWeight:
                                                                        "700"
                                                                }}
                                                            >
                                                                {
                                                                    paymentStatus
                                                                }
                                                            </span>
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Payment Method:
                                                            </strong>{" "}
                                                            {
                                                                payment?.paymentMethod ||
                                                                "N/A"
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Payment Date:
                                                            </strong>{" "}
                                                            {
                                                                formatDate(
                                                                    payment?.paymentDate
                                                                )
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Booking ID:
                                                            </strong>{" "}
                                                            {
                                                                booking?.id ||
                                                                "N/A"
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Booking Status:
                                                            </strong>{" "}

                                                            <span
                                                                style={{
                                                                    color:
                                                                        getBookingStatusColor(
                                                                            bookingStatus
                                                                        ),
                                                                    fontWeight:
                                                                        "700"
                                                                }}
                                                            >
                                                                {
                                                                    bookingStatus
                                                                }
                                                            </span>
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* =================================================
                                                    BOOKING + VEHICLE
                                                ================================================= */}

                                                <div
                                                    className=
                                                        "admin-customer-payment-grid"
                                                    style={{
                                                        display:
                                                            "grid",
                                                        gridTemplateColumns:
                                                            "1fr 1fr",
                                                        gap:
                                                            "15px",
                                                        marginTop:
                                                            "15px"
                                                    }}
                                                >

                                                    {/* BOOKING */}

                                                    <div
                                                        style={{
                                                            backgroundColor:
                                                                "white",
                                                            borderRadius:
                                                                "8px",
                                                            padding:
                                                                "18px",
                                                            border:
                                                                "1px solid #eee"
                                                        }}
                                                    >

                                                        <h4
                                                            style={{
                                                                margin:
                                                                    "0 0 15px",
                                                                fontSize:
                                                                    "18px"
                                                            }}
                                                        >
                                                            Booking Information
                                                        </h4>


                                                        <p>
                                                            <strong>
                                                                Booking ID:
                                                            </strong>{" "}
                                                            {
                                                                booking?.id ||
                                                                "N/A"
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                From Date:
                                                            </strong>{" "}
                                                            {
                                                                booking?.fromDate ||
                                                                "N/A"
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                To Date:
                                                            </strong>{" "}
                                                            {
                                                                booking?.toDate ||
                                                                "N/A"
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Total Amount:
                                                            </strong>{" "}
                                                            ₹
                                                            {
                                                                booking?.totalAmount ??
                                                                payment?.amount ??
                                                                0
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Pickup Address:
                                                            </strong>{" "}
                                                            {
                                                                booking?.pickupAddress ||
                                                                "N/A"
                                                            }
                                                        </p>

                                                    </div>


                                                    {/* VEHICLE */}

                                                    <div
                                                        style={{
                                                            backgroundColor:
                                                                "white",
                                                            borderRadius:
                                                                "8px",
                                                            padding:
                                                                "18px",
                                                            border:
                                                                "1px solid #eee"
                                                        }}
                                                    >

                                                        <h4
                                                            style={{
                                                                margin:
                                                                    "0 0 15px",
                                                                fontSize:
                                                                    "18px"
                                                            }}
                                                        >
                                                            Vehicle Information
                                                        </h4>


                                                        <p>
                                                            <strong>
                                                                Car:
                                                            </strong>{" "}
                                                            {
                                                                carVariant?.variantName ||
                                                                "N/A"
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Fuel Type:
                                                            </strong>{" "}
                                                            {
                                                                carVariant?.fuelType ||
                                                                "N/A"
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Price Per Day:
                                                            </strong>{" "}
                                                            ₹
                                                            {
                                                                carVariant?.pricePerDay ||
                                                                0
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Registration Number:
                                                            </strong>{" "}
                                                            {
                                                                car?.registrationNumber ||
                                                                "Not Assigned"
                                                            }
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Color:
                                                            </strong>{" "}
                                                            {
                                                                car?.color ||
                                                                "N/A"
                                                            }
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* =================================================
                                                    RAZORPAY DETAILS
                                                ================================================= */}

                                                <div
                                                    style={{
                                                        backgroundColor:
                                                            "#f8fafc",
                                                        border:
                                                            "1px solid #e2e8f0",
                                                        borderRadius:
                                                            "8px",
                                                        padding:
                                                            "18px",
                                                        marginTop:
                                                            "15px"
                                                    }}
                                                >

                                                    <h4
                                                        style={{
                                                            margin:
                                                                "0 0 15px",
                                                            fontSize:
                                                                "18px"
                                                        }}
                                                    >
                                                        Razorpay Transaction Details
                                                    </h4>


                                                    <div
                                                        style={{
                                                            display:
                                                                "grid",
                                                            gridTemplateColumns:
                                                                "1fr 1fr",
                                                            gap:
                                                                "12px"
                                                        }}
                                                    >

                                                        <p>
                                                            <strong>
                                                                Razorpay Order ID:
                                                            </strong>
                                                            <br />

                                                            <span
                                                                style={{
                                                                    wordBreak:
                                                                        "break-all",
                                                                    color:
                                                                        "#555"
                                                                }}
                                                            >
                                                                {
                                                                    payment?.razorpayOrderId ||
                                                                    "N/A"
                                                                }
                                                            </span>
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Razorpay Payment ID:
                                                            </strong>
                                                            <br />

                                                            <span
                                                                style={{
                                                                    wordBreak:
                                                                        "break-all",
                                                                    color:
                                                                        "#555"
                                                                }}
                                                            >
                                                                {
                                                                    payment?.razorpayPaymentId ||
                                                                    "N/A"
                                                                }
                                                            </span>
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                Razorpay Signature:
                                                            </strong>
                                                            <br />

                                                            <span
                                                                style={{
                                                                    wordBreak:
                                                                        "break-all",
                                                                    color:
                                                                        "#555"
                                                                }}
                                                            >
                                                                {
                                                                    payment?.razorpaySignature ||
                                                                    "N/A"
                                                                }
                                                            </span>
                                                        </p>


                                                        <p>
                                                            <strong>
                                                                UTR / Transaction ID:
                                                            </strong>
                                                            <br />

                                                            <span
                                                                style={{
                                                                    wordBreak:
                                                                        "break-all",
                                                                    color:
                                                                        "#555"
                                                                }}
                                                            >
                                                                {
                                                                    payment?.upiTransactionId ||
                                                                    "N/A"
                                                                }
                                                            </span>
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* =================================================
                                                    PAYMENT VERIFIED
                                                ================================================= */}

                                                {
                                                    paymentStatus ===
                                                    "PAID" && (

                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    "15px",
                                                                padding:
                                                                    "12px",
                                                                backgroundColor:
                                                                    "#e8f5e9",
                                                                color:
                                                                    "#15803d",
                                                                borderRadius:
                                                                    "6px",
                                                                fontWeight:
                                                                    "600",
                                                                textAlign:
                                                                    "center"
                                                            }}
                                                        >
                                                            ✓ Razorpay Payment Verified
                                                        </div>

                                                    )
                                                }


                                                {/* =================================================
                                                    PAYMENT FAILED
                                                ================================================= */}

                                                {
                                                    paymentStatus ===
                                                    "FAILED" && (

                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    "12px",
                                                                padding:
                                                                    "12px",
                                                                backgroundColor:
                                                                    "#ffebee",
                                                                color:
                                                                    "#dc2626",
                                                                borderRadius:
                                                                    "6px",
                                                                fontWeight:
                                                                    "600",
                                                                textAlign:
                                                                    "center"
                                                            }}
                                                        >
                                                            ✕ Payment Failed
                                                        </div>

                                                    )
                                                }


                                                {/* =================================================
                                                    PAYMENT REJECTED
                                                ================================================= */}

                                                {
                                                    paymentStatus ===
                                                    "REJECTED" && (

                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    "12px",
                                                                padding:
                                                                    "12px",
                                                                backgroundColor:
                                                                    "#ffebee",
                                                                color:
                                                                    "#dc2626",
                                                                borderRadius:
                                                                    "6px",
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


                                                {/* =================================================
                                                    REFUND
                                                ================================================= */}

                                                {
                                                    paymentStatus ===
                                                    "PAID" && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                rejectPayment(
                                                                    payment.id
                                                                )
                                                            }
                                                            style={{
                                                                width:
                                                                    "100%",
                                                                padding:
                                                                    "11px",
                                                                marginTop:
                                                                    "10px",
                                                                backgroundColor:
                                                                    "#dc2626",
                                                                color:
                                                                    "white",
                                                                border:
                                                                    "none",
                                                                borderRadius:
                                                                    "6px",
                                                                cursor:
                                                                    "pointer",
                                                                fontWeight:
                                                                    "700"
                                                            }}
                                                        >
                                                            Refund / Reject Payment
                                                        </button>

                                                    )
                                                }


                                                {/* =================================================
                                                    PDF
                                                ================================================= */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        downloadPaymentPDF(
                                                            payment
                                                        )
                                                    }
                                                    style={{
                                                        width:
                                                            "100%",
                                                        padding:
                                                            "11px",
                                                        marginTop:
                                                            "10px",
                                                        backgroundColor:
                                                            "#111827",
                                                        color:
                                                            "white",
                                                        border:
                                                            "none",
                                                        borderRadius:
                                                            "6px",
                                                        cursor:
                                                            "pointer",
                                                        fontWeight:
                                                            "700"
                                                    }}
                                                >
                                                    Download Payment Details
                                                </button>

                                            </div>

                                        );

                                    }
                                )
                            }

                        </div>

                    )
                }

            </section>


            {/* =================================================
                RESPONSIVE CSS
            ================================================= */}

            <style>
                {`

                    .admin-customer-payment-grid {
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                    }


                    @media (max-width: 1100px) {

                        .admin-stat-grid {
                            grid-template-columns:
                                repeat(2, minmax(0, 1fr)) !important;
                        }

                    }


                    @media (max-width: 900px) {

                        .admin-customer-payment-grid {
                            grid-template-columns:
                                1fr !important;
                        }

                        .admin-quick-grid {
                            grid-template-columns:
                                1fr !important;
                        }

                    }


                    @media (max-width: 700px) {

                        .admin-stat-grid {
                            grid-template-columns:
                                1fr !important;
                        }

                        .admin-customer-payment-grid {
                            grid-template-columns:
                                1fr !important;
                        }

                    }


                    @media (max-width: 600px) {

                        .admin-customer-payment-grid {
                            display:
                                block !important;
                        }

                        .admin-customer-payment-grid > div {
                            margin-bottom:
                                15px;
                        }

                    }


                    @media (max-width: 500px) {

                        .admin-customer-payment-grid p {
                            font-size:
                                14px;
                        }

                        .admin-customer-payment-grid h4 {
                            font-size:
                                17px !important;
                        }

                    }

                `}
            </style>

        </div>
    );
}


export default AdminDashboard;