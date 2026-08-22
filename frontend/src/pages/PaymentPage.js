import React, {
    useEffect,
    useRef,
    useState
} from "react";

import axios from "axios";

import API_URL from "../config";

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


    // ========================================================
    // IMPORTANT FLAGS
    // ========================================================

    const cancelRequestSent =
        useRef(false);


    const orderCreationStarted =
        useRef(false);


    const razorpayInstance =
        useRef(null);


    const paymentSuccessStarted =
        useRef(false);


    const navigationStarted =
        useRef(false);


    // ========================================================
    // NEW:
    // PAYMENT STATUS POLLING
    // ========================================================

    const paymentPollingInterval =
        useRef(null);


    const paymentPollingAttempts =
        useRef(0);


    const paymentPollingActive =
        useRef(false);


    // ========================================================
    // CLEAN USER-FRIENDLY ERROR MESSAGE
    // ========================================================

    const getSafeErrorMessage =
        (error, defaultMessage) => {

            const backendMessage =
                error?.response?.data?.message;


            const backendString =
                typeof backendMessage === "string"
                    ? backendMessage
                    : "";


            const lowerMessage =
                backendString.toLowerCase();


            if (
                lowerMessage.includes(
                    "duplicate entry"
                ) ||

                lowerMessage.includes(
                    "could not execute statement"
                ) ||

                lowerMessage.includes(
                    "constraint"
                ) ||

                lowerMessage.includes(
                    "sql"
                ) ||

                lowerMessage.includes(
                    "hibernate"
                ) ||

                lowerMessage.includes(
                    "org.springframework"
                )
            ) {

                return defaultMessage;
            }


            if (
                lowerMessage.includes(
                    "payment already completed"
                )
            ) {

                return "This booking has already been paid.";
            }


            if (
                lowerMessage.includes(
                    "booking not found"
                )
            ) {

                return "Booking could not be found.";
            }


            if (
                lowerMessage.includes(
                    "booking is not waiting"
                )
            ) {

                return "This booking is not currently available for payment.";
            }


            if (
                lowerMessage.includes(
                    "invalid booking amount"
                )
            ) {

                return "The booking amount is invalid. Please contact support.";
            }


            if (
                lowerMessage.includes(
                    "invalid razorpay"
                )
            ) {

                return "Payment verification failed. Please try again.";
            }


            return defaultMessage;
        };


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


                    if (
                        existingScript
                    ) {

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
    // SAFE NAVIGATION
    // ========================================================

    const goToBookings =
        () => {

            if (
                navigationStarted.current
            ) {

                return;
            }


            navigationStarted.current =
                true;


            navigate(
                "/my-bookings"
            );
        };


    // ========================================================
    // STOP PAYMENT POLLING
    // ========================================================

    const stopPaymentPolling =
        () => {

            console.log(
                "========== STOPPING PAYMENT STATUS POLLING =========="
            );


            paymentPollingActive.current =
                false;


            paymentPollingAttempts.current =
                0;


            if (
                paymentPollingInterval.current
            ) {

                clearInterval(
                    paymentPollingInterval.current
                );


                paymentPollingInterval.current =
                    null;
            }
        };


    // ========================================================
    // HANDLE CONFIRMED PAYMENT
    // ========================================================

    const handlePaymentConfirmed =
        () => {

            if (
                paymentCompleted
            ) {

                return;
            }


            if (
                paymentSuccessStarted.current
            ) {

                return;
            }


            paymentSuccessStarted.current =
                true;


            stopPaymentPolling();


            setPaymentCompleted(
                true
            );


            setPaymentOpening(
                false
            );


            console.log(
                "========== PAYMENT CONFIRMED BY BACKEND =========="
            );


            /*
             * Close Razorpay checkout if it is still open.
             */

            try {

                if (
                    razorpayInstance.current
                ) {

                    razorpayInstance.current.close();
                }

            } catch (error) {

                console.error(
                    "RAZORPAY CLOSE ERROR:",
                    error
                );
            }


            alert(
                "Payment successful! Your booking is confirmed."
            );


            goToBookings();
        };


    // ========================================================
    // CHECK PAYMENT STATUS ONCE
    // ========================================================

    const checkPaymentStatus =
        async () => {

            if (
                paymentCompleted
            ) {

                return true;
            }


            if (
                paymentSuccessStarted.current
            ) {

                return true;
            }


            if (
                !bookingId
            ) {

                return false;
            }


            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );


                const response =
                    await axios.get(

                        `${API_URL}/payment/status/${bookingId}`,

                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                console.log(
                    "PAYMENT STATUS POLLING RESPONSE:",
                    response.data
                );


                const paymentStatus =
                    response?.data?.paymentStatus
                        ?.toString()
                        .toUpperCase();


                const bookingStatus =
                    response?.data?.bookingStatus
                        ?.toString()
                        .toUpperCase();


                console.log(
                    "PAYMENT STATUS:",
                    paymentStatus
                );


                console.log(
                    "BOOKING STATUS:",
                    bookingStatus
                );


                // ------------------------------------------------
                // PAYMENT SUCCESS
                // ------------------------------------------------

                if (
                    paymentStatus === "PAID"
                ) {

                    handlePaymentConfirmed();

                    return true;
                }


                /*
                 * Some backend implementations may update the
                 * booking first. Therefore also accept a confirmed
                 * booking when payment is already marked successful.
                 */

                if (
                    paymentStatus === "SUCCESS" ||
                    paymentStatus === "CAPTURED"
                ) {

                    handlePaymentConfirmed();

                    return true;
                }


                if (
                    bookingStatus === "CONFIRMED" &&
                    (
                        paymentStatus === "PAID" ||
                        paymentStatus === "SUCCESS" ||
                        paymentStatus === "CAPTURED"
                    )
                ) {

                    handlePaymentConfirmed();

                    return true;
                }


                return false;


            } catch (error) {

                console.error(
                    "PAYMENT STATUS CHECK ERROR:",
                    error
                );


                /*
                 * Do NOT cancel payment here.
                 *
                 * Network errors, Render cold starts, etc.
                 * must not be treated as payment failure.
                 */

                return false;
            }
        };


    // ========================================================
    // START PAYMENT STATUS POLLING
    // ========================================================

    const startPaymentStatusPolling =
        () => {

            /*
             * Do not create multiple polling timers.
             */

            if (
                paymentPollingActive.current
            ) {

                return;
            }


            if (
                paymentCompleted
            ) {

                return;
            }


            console.log(
                "========== STARTING PAYMENT STATUS POLLING =========="
            );


            paymentPollingActive.current =
                true;


            paymentPollingAttempts.current =
                0;


            /*
             * Check immediately once.
             */

            checkPaymentStatus();


            /*
             * Then check every 3 seconds.
             *
             * Maximum:
             *
             * 40 attempts × 3 seconds
             *
             * ≈ 2 minutes
             */

            paymentPollingInterval.current =
                setInterval(
                    async () => {

                        if (
                            !paymentPollingActive.current
                        ) {

                            return;
                        }


                        paymentPollingAttempts.current +=
                            1;


                        console.log(
                            `PAYMENT STATUS POLLING ATTEMPT ${paymentPollingAttempts.current}/40`
                        );


                        const confirmed =
                            await checkPaymentStatus();


                        if (
                            confirmed
                        ) {

                            stopPaymentPolling();

                            return;
                        }


                        /*
                         * Stop after approximately 2 minutes.
                         */

                        if (
                            paymentPollingAttempts.current >=
                            40
                        ) {

                            console.log(
                                "PAYMENT STATUS POLLING TIMEOUT"
                            );


                            stopPaymentPolling();


                            setPaymentOpening(
                                false
                            );


                            setErrorMessage(
                                "We could not confirm the payment yet. If money was deducted, please check My Bookings before making another payment."
                            );
                        }

                    },

                    3000
                );
        };


    // ========================================================
    // CANCEL PAYMENT
    // ========================================================

    const cancelPayment =
        async () => {

            /*
             * Never cancel a confirmed payment.
             */

            if (
                paymentCompleted
            ) {

                return;
            }


            /*
             * Never cancel while payment status polling
             * is still checking Razorpay.
             */

            if (
                paymentPollingActive.current
            ) {

                console.log(
                    "PAYMENT STATUS IS STILL BEING CHECKED - NOT CANCELLING"
                );


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

                const token =
                    localStorage.getItem(
                        "token"
                    );


                await axios.delete(

                    `${API_URL}/payment/cancel/${bookingId}`,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                console.log(
                    "PAYMENT CANCELLED SUCCESSFULLY"
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

            paymentSuccessStarted.current =
                true;


            /*
             * Stop polling because Razorpay has already
             * provided a successful payment response.
             */

            stopPaymentPolling();


            console.log(
                "========== VERIFY PAYMENT FUNCTION CALLED =========="
            );


            console.log(
                "VERIFY PAYMENT RESPONSE:",
                razorpayResponse
            );


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

                        `${API_URL}/payment/verify`,

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


                    goToBookings();


                    return;
                }


                throw new Error(
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


                /*
                 * IMPORTANT:
                 *
                 * Verification may fail temporarily because
                 * the backend/Render may take some time.
                 *
                 * Therefore check Razorpay status instead of
                 * immediately cancelling.
                 */

                paymentSuccessStarted.current =
                    false;


                startPaymentStatusPolling();


                setErrorMessage(
                    "Payment verification is being checked. Please wait."
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


                if (
                    !scriptLoaded
                ) {

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
                        "CarRental System",


                    description:
                        `CarRental Booking #${bookingId}`,


                    order_id:
                        order.razorpayOrderId,


                    // =================================================
                    // PAYMENT SUCCESS HANDLER
                    // =================================================

                    handler: async (
                        response
                    ) => {

                        console.log(
                            "========== RAZORPAY SUCCESS HANDLER FIRED =========="
                        );


                        console.log(
                            "RAZORPAY SUCCESS RESPONSE:",
                            response
                        );


                        if (
                            !response ||
                            !response.razorpay_payment_id ||
                            !response.razorpay_order_id ||
                            !response.razorpay_signature
                        ) {

                            console.error(
                                "RAZORPAY SUCCESS RESPONSE IS INCOMPLETE:",
                                response
                            );


                            setPaymentOpening(
                                false
                            );


                            setErrorMessage(
                                "Payment was received but payment details could not be verified. Please wait while we check the payment status."
                            );


                            startPaymentStatusPolling();


                            return;
                        }


                        console.log(
                            "STARTING BACKEND PAYMENT VERIFICATION..."
                        );


                        await verifyPayment(
                            response
                        );

                    },


                    // =================================================
                    // RAZORPAY MODAL
                    // =================================================

                    modal: {

                        ondismiss:
                            async () => {

                                console.log(
                                    "========== RAZORPAY CHECKOUT CLOSED =========="
                                );


                                if (
                                    paymentCompleted
                                ) {

                                    return;
                                }


                                /*
                                 * IMPORTANT:
                                 *
                                 * Closing Razorpay does NOT automatically
                                 * mean payment failed.
                                 *
                                 * First check the actual Razorpay status.
                                 */

                                const confirmed =
                                    await checkPaymentStatus();


                                if (
                                    confirmed
                                ) {

                                    return;
                                }


                                /*
                                 * Start polling after checkout closes.
                                 *
                                 * This protects the customer if the
                                 * payment succeeded but Razorpay's
                                 * confirmation arrived slightly later.
                                 */

                                startPaymentStatusPolling();


                                setPaymentOpening(
                                    false
                                );


                                setErrorMessage(
                                    "Payment status is being checked. Please do not make another payment."
                                );
                            }
                    },


                    // =================================================
                    // THEME
                    // =================================================

                    theme: {

                        color:
                            "#2563eb"
                    }
                };


                const razorpay =
                    new window.Razorpay(
                        options
                    );


                razorpayInstance.current =
                    razorpay;


                // =================================================
                // PAYMENT FAILED EVENT
                // =================================================

                razorpay.on(
                    "payment.failed",
                    (response) => {

                        console.error(
                            "========== RAZORPAY PAYMENT FAILED =========="
                        );


                        console.error(
                            "Code:",
                            response?.error?.code
                        );


                        console.error(
                            "Description:",
                            response?.error?.description
                        );


                        console.error(
                            "Source:",
                            response?.error?.source
                        );


                        console.error(
                            "Step:",
                            response?.error?.step
                        );


                        console.error(
                            "Reason:",
                            response?.error?.reason
                        );


                        console.error(
                            "Order ID:",
                            response?.error?.metadata?.order_id
                        );


                        console.error(
                            "Payment ID:",
                            response?.error?.metadata?.payment_id
                        );


                        console.error(
                            "Full Razorpay Error:",
                            response
                        );


                        stopPaymentPolling();


                        setPaymentOpening(
                            false
                        );


                        setErrorMessage(
                            "Payment failed. Please try again using another payment method."
                        );
                    }
                );


                // =================================================
                // OPEN CHECKOUT
                // =================================================

                razorpay.open();


                /*
                 * IMPORTANT:
                 *
                 * Start polling immediately while Razorpay
                 * checkout is open.
                 *
                 * This is the main fix for your QR problem.
                 */

                startPaymentStatusPolling();


            } catch (error) {

                console.error(
                    "RAZORPAY OPEN ERROR:",
                    error
                );


                stopPaymentPolling();


                setPaymentOpening(
                    false
                );


                const safeMessage =
                    getSafeErrorMessage(
                        error,
                        "Unable to open payment gateway. Please try again."
                    );


                setErrorMessage(
                    safeMessage
                );


                await cancelPayment();
            }
        };


    // ========================================================
    // CREATE RAZORPAY ORDER
    // ========================================================

    const createOrder =
        async () => {

            if (
                orderCreationStarted.current
            ) {

                console.log(
                    "CREATE ORDER ALREADY STARTED - SKIPPING DUPLICATE REQUEST"
                );


                return;
            }


            if (
                paymentCompleted
            ) {

                return;
            }


            orderCreationStarted.current =
                true;


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


                if (
                    !token
                ) {

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

                        `${API_URL}/payment/create-order/${bookingId}`,

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
                        "Unable to create payment order."
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
                    getSafeErrorMessage(
                        error,
                        "Unable to start payment. Please try again."
                    );


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

            if (
                !bookingId
            ) {

                setErrorMessage(
                    "Booking ID is missing."
                );


                setLoading(
                    false
                );


                return;
            }


            createOrder();


        },

        // eslint-disable-next-line react-hooks/exhaustive-deps

        [
            bookingId
        ]
    );


    // ========================================================
    // CLEANUP
    // ========================================================

    useEffect(
        () => {

            return () => {

                console.log(
                    "PAYMENT PAGE UNMOUNTED - CLEANING POLLING"
                );


                stopPaymentPolling();

            };

        },

        []
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

                            <div
                                style={{

                                    fontSize:
                                        "12px",

                                    marginTop:
                                        "8px",

                                    fontWeight:
                                        "500"
                                }}
                            >

                                After completing UPI/QR payment,
                                please wait for Razorpay to confirm it.

                            </div>

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
                                    "700",

                                lineHeight:
                                    "1.5"
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
                    errorMessage &&
                    !paymentPollingActive.current && (

                        <button
                            type="button"

                            onClick={
                                () => {

                                    orderCreationStarted.current =
                                        false;

                                    cancelRequestSent.current =
                                        false;

                                    navigationStarted.current =
                                        false;

                                    paymentSuccessStarted.current =
                                        false;

                                    setErrorMessage(
                                        ""
                                    );

                                    createOrder();
                                }
                            }

                            disabled={
                                loading ||
                                paymentOpening
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
                                    loading ||
                                    paymentOpening
                                        ? "not-allowed"
                                        : "pointer",

                                marginBottom:
                                    "10px",

                                opacity:
                                    loading ||
                                    paymentOpening
                                        ? 0.6
                                        : 1
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

                            /*
                             * If payment is being checked,
                             * do NOT cancel it.
                             */

                            if (
                                paymentPollingActive.current
                            ) {

                                setErrorMessage(
                                    "Payment status is still being checked. Please wait before leaving this page."
                                );


                                return;
                            }


                            await cancelPayment();


                            goToBookings();
                        }
                    }

                    disabled={
                        paymentOpening ||
                        paymentPollingActive.current
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
                            paymentOpening ||
                            paymentPollingActive.current
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