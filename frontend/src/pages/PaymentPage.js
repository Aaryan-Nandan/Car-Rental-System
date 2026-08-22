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

    /*
     * Prevent duplicate cancel API calls.
     */
    const cancelRequestSent =
        useRef(false);


    /*
     * Prevent duplicate create-order API calls.
     *
     * This is especially important in React development mode
     * where useEffect may execute more than once.
     */
    const orderCreationStarted =
        useRef(false);


    /*
     * Store Razorpay instance.
     */
   const razorpayInstance =
    useRef(null);

const paymentSuccessStarted =
    useRef(false);

const navigationStarted =
    useRef(false);

    // ========================================================
    // CLEAN USER-FRIENDLY ERROR MESSAGE
    // ========================================================

    const getSafeErrorMessage =
        (error, defaultMessage) => {

            /*
             * NEVER display raw backend/database errors.
             *
             * Examples that should NOT be shown:
             *
             * Duplicate entry...
             * could not execute statement...
             * SQL...
             * Hibernate...
             * org.springframework...
             */

            const backendMessage =
                error?.response?.data?.message;


            const backendString =
                typeof backendMessage === "string"
                    ? backendMessage
                    : "";


            const lowerMessage =
                backendString.toLowerCase();


            // -------------------------------------------------
            // DATABASE / SQL ERRORS
            // -------------------------------------------------

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


            // -------------------------------------------------
            // PAYMENT ALREADY COMPLETED
            // -------------------------------------------------

            if (
                lowerMessage.includes(
                    "payment already completed"
                )
            ) {

                return "This booking has already been paid.";
            }


            // -------------------------------------------------
            // BOOKING NOT FOUND
            // -------------------------------------------------

            if (
                lowerMessage.includes(
                    "booking not found"
                )
            ) {

                return "Booking could not be found.";
            }


            // -------------------------------------------------
            // INVALID BOOKING
            // -------------------------------------------------

            if (
                lowerMessage.includes(
                    "booking is not waiting"
                )
            ) {

                return "This booking is not currently available for payment.";
            }


            // -------------------------------------------------
            // INVALID PAYMENT
            // -------------------------------------------------

            if (
                lowerMessage.includes(
                    "invalid booking amount"
                )
            ) {

                return "The booking amount is invalid. Please contact support.";
            }


            // -------------------------------------------------
            // PAYMENT VERIFICATION
            // -------------------------------------------------

            if (
                lowerMessage.includes(
                    "invalid razorpay"
                )
            ) {

                return "Payment verification failed. Please try again.";
            }


            // -------------------------------------------------
            // DO NOT DISPLAY UNKNOWN BACKEND ERRORS
            // -------------------------------------------------

            return defaultMessage;
        };


    // ========================================================
    // LOAD RAZORPAY SCRIPT
    // ========================================================

    const loadRazorpayScript =
        () => {

            return new Promise(
                (resolve) => {

                    // ------------------------------------------------
                    // ALREADY LOADED
                    // ------------------------------------------------

                    if (
                        window.Razorpay
                    ) {

                        resolve(true);

                        return;
                    }


                    // ------------------------------------------------
                    // EXISTING SCRIPT
                    // ------------------------------------------------

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


                    // ------------------------------------------------
                    // CREATE SCRIPT
                    // ------------------------------------------------

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
    // CANCEL PAYMENT
    // ========================================================

    const cancelPayment =
        async () => {

            /*
             * Payment already completed.
             * Never cancel a successful payment.
             */

            if (
                paymentCompleted
            ) {

                return;
            }


            /*
             * Prevent duplicate cancel requests.
             */

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

                /*
                 * Important:
                 *
                 * Do NOT show this error to the customer.
                 *
                 * The customer does not need to see
                 * SQL / backend / Hibernate errors.
                 */

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

        paymentSuccessStarted.current = true;

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


                // ------------------------------------------------
                // VERIFY DATA
                // ------------------------------------------------

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


                // ------------------------------------------------
                // BACKEND VERIFICATION
                // ------------------------------------------------

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


                // ------------------------------------------------
                // SUCCESS
                // ------------------------------------------------

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


                /*
                 * If backend does not return success=true,
                 * treat it as verification failure.
                 */

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
                 * Never show the raw backend error.
                 */

                const safeMessage =
                    getSafeErrorMessage(
                        error,
                        "Payment verification failed. Please try again."
                    );


                /*
                 * Cancel the unpaid payment.
                 */

                await cancelPayment();


                alert(
                    safeMessage
                );


                goToBookings();
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

                // ------------------------------------------------
                // LOAD SCRIPT
                // ------------------------------------------------

                const scriptLoaded =
                    await loadRazorpayScript();


                if (
                    !scriptLoaded
                ) {

                    throw new Error(
                        "Unable to load Razorpay Checkout."
                    );
                }


                // ------------------------------------------------
                // CHECK RAZORPAY
                // ------------------------------------------------

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


                // ------------------------------------------------
                // RAZORPAY OPTIONS
                // ------------------------------------------------

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


                    // ------------------------------------------------
                    // PAYMENT SUCCESS
                    // ------------------------------------------------

handler: async (response) => {

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

        setPaymentOpening(false);

        setErrorMessage(
            "Payment was received but payment details could not be verified. Please contact support."
        );

        return;
    }

    console.log(
        "STARTING BACKEND PAYMENT VERIFICATION..."
    );

    await verifyPayment(response);

},


                    // ------------------------------------------------
                    // RAZORPAY MODAL
                    // ------------------------------------------------

                    modal: {

                        ondismiss:
                            async () => {

                                console.log(
                                    "RAZORPAY CHECKOUT CLOSED"
                                );


if (
    !paymentCompleted &&
    !paymentSuccessStarted.current
) {

    await cancelPayment();

    setPaymentOpening(
        false
    );

    alert(
        "Payment cancelled. Your booking was not confirmed."
    );

    goToBookings();
}
                            }
                    },


                    // ------------------------------------------------
                    // THEME
                    // ------------------------------------------------

                    theme: {

                        color:
                            "#2563eb"
                    }
                };


                // ------------------------------------------------
                // CREATE RAZORPAY INSTANCE
                // ------------------------------------------------

                const razorpay =
                    new window.Razorpay(
                        options
                    );


                razorpayInstance.current =
                    razorpay;


                // ------------------------------------------------
                // PAYMENT FAILED EVENT
                // ------------------------------------------------

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

        setPaymentOpening(false);

        setErrorMessage(
            "Payment failed. Please try again using another payment method."
        );
    }
);


                // ------------------------------------------------
                // OPEN CHECKOUT
                // ------------------------------------------------

                razorpay.open();

            } catch (error) {

                console.error(
                    "RAZORPAY OPEN ERROR:",
                    error
                );


                setPaymentOpening(
                    false
                );


                /*
                 * Convert technical error into
                 * customer-friendly message.
                 */

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

            /*
             * IMPORTANT:
             *
             * Do not create another order if one is already
             * being created or Razorpay is already open.
             */

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


            // ------------------------------------------------
            // MARK AS STARTED
            // ------------------------------------------------

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


                // ------------------------------------------------
                // LOGIN CHECK
                // ------------------------------------------------

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


                // ------------------------------------------------
                // BOOKING ID CHECK
                // ------------------------------------------------

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


                // ------------------------------------------------
                // CREATE ORDER
                // ------------------------------------------------

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


                // ------------------------------------------------
                // VALIDATE RESPONSE
                // ------------------------------------------------

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


                // ------------------------------------------------
                // SAVE ORDER DATA
                // ------------------------------------------------

                setOrderData(
                    data
                );


                // ------------------------------------------------
                // OPEN RAZORPAY
                // ------------------------------------------------

                await openRazorpay(
                    data
                );

            } catch (error) {

                console.error(
                    "CREATE RAZORPAY ORDER ERROR:",
                    error
                );


                /*
                 * IMPORTANT:
                 *
                 * Never display raw SQL/database errors.
                 */

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


            /*
             * IMPORTANT:
             *
             * orderCreationStarted prevents React StrictMode
             * from creating two payment orders.
             */

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
                    errorMessage && (

                        <button
                            type="button"

                            onClick={
                                () => {

                                    /*
                                     * Allow another order attempt
                                     * after a genuine error.
                                     */

                                    orderCreationStarted.current =
                                        false;

                                    cancelRequestSent.current =
                                        false;

                                    navigationStarted.current =
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

                            await cancelPayment();


                            goToBookings();
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