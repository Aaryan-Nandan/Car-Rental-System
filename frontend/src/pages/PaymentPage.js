import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function PaymentPage() {

    const { bookingId, amount } =
        useParams();

    const navigate =
        useNavigate();

    const [cardNumber,
        setCardNumber] =
            useState("");

    const [cardHolder,
        setCardHolder] =
            useState("");

    const [cvv,
        setCvv] =
            useState("");

    const makePayment = () => {

        if (
            !cardNumber ||
            !cardHolder ||
            !cvv
        ) {

            alert(
                "Fill all fields"
            );

            return;
        }

        const paymentData = {

            amount: amount,

            booking: {
                id: bookingId
            }
        };

        axios
            .post(
                "http://localhost:8081/payment/add",
                paymentData
            )

            .then(() => {

                alert(
                    "Payment Successful"
                );

                navigate(
                    "/my-bookings"
                );
            })

            .catch((error) => {

                if (
                    error.response &&
                    error.response.data
                ) {

                    alert(
                        error.response.data
                    );

                } else {

                    alert(
                        "Payment Failed"
                    );
                }
            });
    };

    return (

        <div
            style={{
                padding: "30px"
            }}
        >

            <h1>

                Payment Page

            </h1>

            <h2>

                Amount :
                ₹ {amount}

            </h2>

            <br />

            <input
                type="text"

                placeholder=
                    "Card Number"

                value={cardNumber}

                onChange={(e) =>
                    setCardNumber(
                        e.target.value
                    )
                }

                style={{
                    padding: "10px",
                    width: "300px"
                }}
            />

            <br />
            <br />

            <input
                type="text"

                placeholder=
                    "Card Holder Name"

                value={cardHolder}

                onChange={(e) =>
                    setCardHolder(
                        e.target.value
                    )
                }

                style={{
                    padding: "10px",
                    width: "300px"
                }}
            />

            <br />
            <br />

            <input
                type="password"

                placeholder="CVV"

                value={cvv}

                onChange={(e) =>
                    setCvv(
                        e.target.value
                    )
                }

                style={{
                    padding: "10px",
                    width: "300px"
                }}
            />

            <br />
            <br />

            <button
                onClick={
                    makePayment
                }

                style={{
                    backgroundColor:
                        "green",

                    color:
                        "white",

                    border:
                        "none",

                    padding:
                        "12px 20px",

                    borderRadius:
                        "5px",

                    cursor:
                        "pointer"
                }}
            >

                Pay Now

            </button>

        </div>
    );
}

export default PaymentPage;