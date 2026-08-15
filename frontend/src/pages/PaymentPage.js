import React, {
    useEffect,
    useRef,
    useState
} from "react";

import axios from "axios";

import {
    useNavigate,
    useParams
} from "react-router-dom";


// ============================================================
// RAZORPAY CHECKOUT SCRIPT
// ============================================================

const RAZORPAY_SCRIPT =
    "https://checkout.razorpay.com/v1/checkout.js";


// ============================================================
// PAYMENT PAGE
// ============================================================

function PaymentPage() {

    const {
        bookingId,
        amount: routeAmount
    } = useParams();


    const navigate =
        useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        paymentOpening,
        setPaymentOpening
    ] = useState(false);


    const [
        errorMessage,
        setErrorMessage
    ] = useState("");


    const [
        orderData,
        setOrderData
    ] = useState(null);


    const [
        paymentCompleted,
        setPaymentCompleted
    ] = useState(false);


    const cancelRequestSent =
        useRef(false);


    // ========================================================
    // LOAD RAZORPAY SCRIPT
    // ========================================================

    const loadRazorpayScript =
        () => {

            return new Promise(
                (resolve) => {

                    if (
                        window.Razorpay
                    ) {

                        resolve(true);

                        return;
                    }


                    const existingScript =
                        document.querySelector(
                            `script[src="${RAZORPAY_SCRIPT}"]`
                        );


                    if (existingScript) {

                        existingScript.onload =
                            () => resolve(true);

                        existingScript.onerror =
                            () => resolve(false);

                        return;
                    }


                    const script =
                        document.createElement(
                            "script"
                        );


                    script.src =
                        RAZORPAY_SCRIPT;


                    script.async =
                        true;


                    script.onload =
                        () => resolve(true);


                    script.onerror =
                        () => resolve(false);


                    document.body.appendChild(
                        script
                    );
                }
            );
        };


    // ========================================================
    // CANCEL PAYMENT
    // ========================================================

    const cancelPayment =
        async () => {

            if (
                paymentCompleted
            ) {

                return;
            }


            if (
                cancelRequestSent.current
            ) {

                return;
            }


            cancelRequestSent.current =
                true;


            try {

                await axios.delete(
                    `http://localhost:8081/payment/cancel/${bookingId}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

            } catch (error) {

                console.error(
                    "PAYMENT CANCEL ERROR:",
                    error
                );
            }
        };


    // ========================================================
    // VERIFY PAYMENT
    // ========================================================

    const verifyPayment =
        async (
            razorpayResponse
        ) => {

            try {

                setPaymentOpening(
                    false
                );


                const token =
                    localStorage.getItem(
                        "token"
                    );


                const verifyData = {

                    bookingId:
                        Number(
                            bookingId
                        ),

                    razorpayOrderId:
                        razorpayResponse
                            .razorpay_order_id,

                    razorpayPaymentId:
                        razorpayResponse
                            .razorpay_payment_id,

                    razorpaySignature:
                        razorpayResponse
                            .razorpay_signature
                };


                console.log(
                    "RAZORPAY VERIFY DATA:",
                    verifyData
                );


                const response =
                    await axios.post(

                        "http://localhost:8081/payment/verify",

                        verifyData,

                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                console.log(
                    "PAYMENT VERIFY RESPONSE:",
                    response.data
                );


                if (
                    response.data &&
                    response.data.success
                ) {

                    setPaymentCompleted(
                        true
                    );


                    alert(
                        "Payment successful! Your booking is confirmed."
                    );


                    navigate(
                        "/my-bookings"
                    );


                    return;
                }


                throw new Error(
                    response.data?.message ||
                    "Payment verification failed."
                );

            } catch (error) {

                console.error(
                    "PAYMENT VERIFICATION ERROR:",
                    error
                );


                setPaymentOpening(
                    false
                );


                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Payment verification failed.";


                alert(
                    message
                );


                await cancelPayment();


                navigate(
                    "/my-bookings"
                );
            }
        };


    // ========================================================
    // OPEN RAZORPAY
    // ========================================================

    const openRazorpay =
        async (
            order
        ) => {

            try {

                const scriptLoaded =
                    await loadRazorpayScript();


                if (!scriptLoaded) {

                    throw new Error(
                        "Unable to load Razorpay Checkout."
                    );
                }


                if (
                    !window.Razorpay
                ) {

                    throw new Error(
                        "Razorpay Checkout is not available."
                    );
                }


                setPaymentOpening(
                    true
                );


                const options = {

                    key:
                        order.keyId,

                    amount:
                        Math.round(
                            Number(
                                order.amount
                            ) * 100
                        ),

                    currency:
                        order.currency ||
                        "INR",

                    name:
                        "Car Rental System",

                    description:
                        `Car Rental Booking #${bookingId}`,

                    order_id:
                        order.razorpayOrderId,


                    handler:
                        async (
                            response
                        ) => {

                            await verifyPayment(
                                response
                            );
                        },


                    modal: {

                        ondismiss:
                            async () => {

                                console.log(
                                    "RAZORPAY CHECKOUT CLOSED"
                                );


                                if (
                                    !paymentCompleted
                                ) {

                                    await cancelPayment();


                                    setPaymentOpening(
                                        false
                                    );


                                    alert(
                                        "Payment cancelled. Your booking was not confirmed."
                                    );


                                    navigate(
                                        "/my-bookings"
                                    );
                                }
                            }
                    },


                    theme: {

                        color:
                            "#2563eb"
                    }
                };


                const razorpay =
                    new window.Razorpay(
                        options
                    );


                // ------------------------------------------------
                // PAYMENT FAILED EVENT
                // ------------------------------------------------

                razorpay.on(
                    "payment.failed",
                    async (
                        response
                    ) => {

                        console.error(
                            "RAZORPAY PAYMENT FAILED:",
                            response
                        );


                        await cancelPayment();


                        setPaymentOpening(
                            false
                        );


                        alert(
                            response.error?.description ||
                            "Payment failed."
                        );


                        navigate(
                            "/my-bookings"
                        );
                    }
                );


                razorpay.open();

            } catch (error) {

                console.error(
                    "RAZORPAY OPEN ERROR:",
                    error
                );


                setPaymentOpening(
                    false
                );


                setErrorMessage(
                    error.message ||
                    "Unable to open Razorpay."
                );


                await cancelPayment();
            }
        };


    // ========================================================
    // CREATE RAZORPAY ORDER
    // ========================================================

    const createOrder =
        async () => {

            try {

                setLoading(
                    true
                );


                setErrorMessage(
                    ""
                );


                const token =
                    localStorage.getItem(
                        "token"
                    );


                if (!token) {

                    alert(
                        "Please login before making payment."
                    );


                    navigate(
                        "/login"
                    );


                    return;
                }


                if (
                    !bookingId
                ) {

                    throw new Error(
                        "Booking ID is missing."
                    );
                }


                console.log(
                    "CREATING RAZORPAY ORDER FOR BOOKING:",
                    bookingId
                );


                const response =
                    await axios.post(

                        `http://localhost:8081/payment/create-order/${bookingId}`,

                        {},

                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                console.log(
                    "RAZORPAY ORDER RESPONSE:",
                    response.data
                );


                const data =
                    response.data;


                if (
                    !data ||
                    !data.razorpayOrderId ||
                    !data.keyId ||
                    !data.bookingId
                ) {

                    throw new Error(
                        "Invalid Razorpay order response from backend."
                    );
                }


                setOrderData(
                    data
                );


                await openRazorpay(
                    data
                );

            } catch (error) {

                console.error(
                    "CREATE RAZORPAY ORDER ERROR:",
                    error
                );


                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to create Razorpay order.";


                setErrorMessage(
                    message
                );

            } finally {

                setLoading(
                    false
                );
            }
        };


    // ========================================================
    // CREATE ORDER WHEN PAGE OPENS
    // ========================================================

    useEffect(
        () => {

            createOrder();

        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            bookingId
        ]
    );


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <div
            style={{
                minHeight:
                    "calc(100vh - 80px)",

                background:
                    "linear-gradient(135deg,#eef4ff,#f8fafc)",

                display:
                    "flex",

                justifyContent:
                    "center",

                alignItems:
                    "center",

                padding:
                    "30px 20px"
            }}
        >

            <div
                style={{
                    width:
                        "100%",

                    maxWidth:
                        "520px",

                    background:
                        "white",

                    borderRadius:
                        "18px",

                    padding:
                        "30px",

                    boxShadow:
                        "0 12px 35px rgba(15,23,42,0.12)",

                    textAlign:
                        "center"
                }}
            >

                {/* =================================================
                    ICON
                ================================================= */}

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


                {/* =================================================
                    TITLE
                ================================================= */}

                <h1
                    style={{
                        margin:
                            "0 0 10px",

                        color:
                            "#0f172a"
                    }}
                >
                    Complete Payment
                </h1>


                {/* =================================================
                    BOOKING
                ================================================= */}

                <p
                    style={{
                        color:
                            "#64748b",

                        marginBottom:
                            "20px"
                    }}
                >
                    Booking ID:{" "}
                    <strong>
                        {bookingId}
                    </strong>
                </p>


                {/* =================================================
                    AMOUNT
                ================================================= */}

                <div
                    style={{
                        background:
                            "#eff6ff",

                        border:
                            "1px solid #bfdbfe",

                        borderRadius:
                            "12px",

                        padding:
                            "18px",

                        marginBottom:
                            "20px"
                    }}
                >

                    <div
                        style={{
                            fontSize:
                                "11px",

                            fontWeight:
                                "800",

                            color:
                                "#64748b",

                            marginBottom:
                                "5px"
                        }}
                    >
                        PAYMENT AMOUNT
                    </div>


                    <div
                        style={{
                            fontSize:
                                "30px",

                            fontWeight:
                                "900",

                            color:
                                "#1d4ed8"
                        }}
                    >

                        ₹
                        {
                            Number(
                                orderData?.amount ||
                                routeAmount ||
                                0
                            ).toLocaleString(
                                "en-IN"
                            )
                        }

                    </div>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {
                    loading && (

                        <div
                            style={{
                                padding:
                                    "20px",

                                color:
                                    "#475569",

                                fontWeight:
                                    "700"
                            }}
                        >

                            Creating secure Razorpay order...

                        </div>
                    )
                }


                {/* =================================================
                    PAYMENT OPENING
                ================================================= */}

                {
                    paymentOpening && (

                        <div
                            style={{
                                padding:
                                    "20px",

                                background:
                                    "#f0fdf4",

                                border:
                                    "1px solid #bbf7d0",

                                borderRadius:
                                    "10px",

                                color:
                                    "#166534",

                                fontWeight:
                                    "700",

                                marginBottom:
                                    "15px"
                            }}
                        >

                            🔐 Razorpay checkout is opening...

                        </div>
                    )
                }


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

                                borderRadius:
                                    "10px",

                                padding:
                                    "14px",

                                marginBottom:
                                    "15px",

                                fontWeight:
                                    "700"
                            }}
                        >

                            {errorMessage}

                        </div>
                    )
                }


                {/* =================================================
                    RETRY
                ================================================= */}

                {
                    errorMessage && (

                        <button
                            type="button"

                            onClick={
                                createOrder
                            }

                            style={{
                                width:
                                    "100%",

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

                                cursor:
                                    "pointer",

                                marginBottom:
                                    "10px"
                            }}
                        >
                            🔄 Try Payment Again
                        </button>
                    )
                }


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    type="button"

                    onClick={
                        async () => {

                            await cancelPayment();

                            navigate(
                                "/my-bookings"
                            );
                        }
                    }

                    disabled={
                        paymentOpening
                    }

                    style={{
                        width:
                            "100%",

                        height:
                            "46px",

                        border:
                            "1px solid #cbd5e1",

                        borderRadius:
                            "10px",

                        background:
                            "white",

                        color:
                            "#334155",

                        fontWeight:
                            "800",

                        cursor:
                            paymentOpening
                                ? "not-allowed"
                                : "pointer"
                    }}
                >
                    ← Back to My Bookings
                </button>


                {/* =================================================
                    SECURITY MESSAGE
                ================================================= */}

                <p
                    style={{
                        fontSize:
                            "11px",

                        color:
                            "#64748b",

                        marginTop:
                            "15px",

                        lineHeight:
                            "1.5"
                    }}
                >
                    🔒 Your payment is processed securely by
                    Razorpay. Your booking is confirmed only
                    after the payment is verified by the backend.
                </p>

            </div>

        </div>
    );
}


export default PaymentPage;