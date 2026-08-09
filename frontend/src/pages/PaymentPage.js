import { useState } from "react";

import axios from "axios";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    QRCodeCanvas
} from "qrcode.react";


function PaymentPage() {


    const { bookingId, amount } =
        useParams();


    const navigate =
        useNavigate();


    const [upiTransactionId,
        setUpiTransactionId] =
        useState("");


    const [loading,
        setLoading] =
        useState(false);


    // =========================================================
    // YOUR UPI DETAILS
    // =========================================================

    /*
     * IMPORTANT:
     *
     * Replace this with YOUR REAL UPI ID.
     *
     * Example:
     *
     * const UPI_ID = "8002118249@ybl";
     *
     * DO NOT use the example below.
     */

    const UPI_ID =
        "8002118249-2@ybl";


    const MERCHANT_NAME =
        "Car Rental System";


    // =========================================================
    // CREATE UNIQUE TRANSACTION REFERENCE
    // =========================================================

    const transactionReference =
        "CRS"
        + bookingId
        + Date.now();


    // =========================================================
    // CREATE UPI PAYMENT LINK
    // =========================================================

    const upiPaymentUrl =

        "upi://pay"
        + "?pa="
        + encodeURIComponent(
            UPI_ID
        )
        + "&pn="
        + encodeURIComponent(
            MERCHANT_NAME
        )
        + "&tr="
        + encodeURIComponent(
            transactionReference
        )
        + "&am="
        + encodeURIComponent(
            amount
        )
        + "&cu=INR";


    // =========================================================
    // SUBMIT PAYMENT
    // =========================================================

    const makePayment = async () => {


        // -----------------------------------------------------
        // LOGIN CHECK
        // -----------------------------------------------------

        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            alert(
                "Please login first."
            );

            navigate(
                "/login"
            );

            return;
        }


        // -----------------------------------------------------
        // UPI ID CHECK
        // -----------------------------------------------------

        if (
            UPI_ID ===
            "YOUR_UPI_ID@upi"
        ) {

            alert(
                "Please configure your real UPI ID in PaymentPage.js"
            );

            return;
        }


        // -----------------------------------------------------
        // UTR CHECK
        // -----------------------------------------------------

        if (
            !upiTransactionId.trim()
        ) {

            alert(
                "Enter UPI Transaction ID / UTR after payment"
            );

            return;
        }


        // -----------------------------------------------------
        // PAYMENT DATA
        // -----------------------------------------------------

        const paymentData = {

            amount: Number(
                amount
            ),

            paymentMethod:
                "UPI",

            paymentStatus:
                "VERIFYING",

            upiTransactionId:
                upiTransactionId.trim(),

            booking: {

                id:
                    Number(
                        bookingId
                    )

            }

        };


        setLoading(
            true
        );


        try {


            const response =
                await axios.post(

                    "http://localhost:8081/payment/add",

                    paymentData,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


            // -------------------------------------------------
            // BACKEND MAY RETURN STRING ERROR
            // -------------------------------------------------

            if (
                typeof response.data ===
                "string"
            ) {

                alert(
                    response.data
                );

                return;
            }


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            alert(

                "Payment submitted successfully.\n\n"
                + "Status: VERIFYING\n\n"
                + "Admin will verify your payment."

            );


            navigate(
                "/my-bookings"
            );


        }
        catch (error) {


            console.error(
                "Payment Error:",
                error
            );


            if (
                error.response &&
                error.response.data
            ) {

                alert(
                    error.response.data
                );

            }
            else {

                alert(
                    "Payment submission failed"
                );
            }

        }
        finally {

            setLoading(
                false
            );
        }
    };


    // =========================================================
    // PAGE
    // =========================================================

    return (


        <div
            style={{

                maxWidth:
                    "600px",

                margin:
                    "40px auto",

                padding:
                    "30px",

                backgroundColor:
                    "white",

                borderRadius:
                    "12px",

                boxShadow:
                    "0 0 15px lightgray",

                textAlign:
                    "center"

            }}
        >


            {/* =================================================
                TITLE
            ================================================= */}

            <h1>
                UPI Payment
            </h1>


            <p
                style={{
                    color:
                        "#666"
                }}
            >

                Scan the QR code using any
                UPI application

            </p>


            {/* =================================================
                AMOUNT
            ================================================= */}

            <div
                style={{

                    backgroundColor:
                        "#f5f5f5",

                    padding:
                        "20px",

                    borderRadius:
                        "10px",

                    marginTop:
                        "20px"

                }}
            >

                <p>
                    Booking ID
                </p>

                <h3>
                    #{bookingId}
                </h3>


                <p>
                    Amount to Pay
                </p>

                <h1
                    style={{
                        color:
                            "#1976D2"
                    }}
                >

                    ₹ {amount}

                </h1>

            </div>


            <br />


            {/* =================================================
                QR CODE
            ================================================= */}

            <div
                style={{

                    display:
                        "inline-block",

                    padding:
                        "20px",

                    backgroundColor:
                        "white",

                    border:
                        "1px solid #ddd",

                    borderRadius:
                        "10px"

                }}
            >

                <QRCodeCanvas

                    value={
                        upiPaymentUrl
                    }

                    size={
                        280
                    }

                    level={
                        "M"
                    }

                    includeMargin={
                        true
                    }

                />

            </div>


            <h3>
                Scan & Pay
            </h3>


            {/* =================================================
                UPI ID
            ================================================= */}

            <div
                style={{

                    backgroundColor:
                        "#f5f5f5",

                    padding:
                        "15px",

                    borderRadius:
                        "8px",

                    marginTop:
                        "15px"

                }}
            >

                <p
                    style={{
                        margin:
                            "0 0 5px 0"
                    }}
                >

                    UPI ID

                </p>


                <strong>

                    {UPI_ID}

                </strong>

            </div>


            {/* =================================================
                MOBILE PAYMENT LINK
            ================================================= */}

            <a

                href={
                    upiPaymentUrl
                }

                style={{

                    display:
                        "inline-block",

                    marginTop:
                        "20px",

                    padding:
                        "12px 20px",

                    backgroundColor:
                        "#1976D2",

                    color:
                        "white",

                    textDecoration:
                        "none",

                    borderRadius:
                        "5px",

                    fontWeight:
                        "bold"

                }}

            >

                Open UPI App

            </a>


            <hr
                style={{
                    margin:
                        "30px 0"
                }}
            />


            {/* =================================================
                UTR
            ================================================= */}

            <div
                style={{
                    textAlign:
                        "left"
                }}
            >

                <label>

                    <strong>

                        UPI Transaction ID / UTR

                    </strong>

                </label>


                <input

                    type="text"

                    placeholder=
                        "Enter UTR after payment"

                    value={
                        upiTransactionId
                    }

                    onChange={(e) =>
                        setUpiTransactionId(
                            e.target.value
                        )
                    }

                    style={{

                        width:
                            "100%",

                        padding:
                            "12px",

                        marginTop:
                            "8px",

                        boxSizing:
                            "border-box",

                        border:
                            "1px solid #ccc",

                        borderRadius:
                            "5px"

                    }}

                />


                <p
                    style={{

                        fontSize:
                            "13px",

                        color:
                            "#666"

                    }}
                >

                    After completing the UPI payment,
                    enter the transaction ID/UTR shown
                    in your UPI application.

                </p>

            </div>


            {/* =================================================
                SUBMIT
            ================================================= */}

            <button

                onClick={
                    makePayment
                }

                disabled={
                    loading
                }

                style={{

                    width:
                        "100%",

                    backgroundColor:
                        loading
                            ? "gray"
                            : "green",

                    color:
                        "white",

                    border:
                        "none",

                    padding:
                        "14px",

                    borderRadius:
                        "6px",

                    cursor:
                        loading
                            ? "not-allowed"
                            : "pointer",

                    fontSize:
                        "16px",

                    fontWeight:
                        "bold",

                    marginTop:
                        "20px"

                }}

            >

                {
                    loading
                        ? "Submitting..."
                        : "I Have Paid"
                }

            </button>


            {/* =================================================
                WARNING
            ================================================= */}

            <p
                style={{

                    marginTop:
                        "20px",

                    fontSize:
                        "13px",

                    color:
                        "#d35400"

                }}
            >

                Your payment will remain
                <strong>
                    {" "}VERIFYING
                </strong>
                {" "}until the administrator
                confirms the transaction.

            </p>


        </div>

    );
}


export default PaymentPage;