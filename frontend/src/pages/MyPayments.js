import { useEffect, useState } from "react";
import axios from "axios";

function MyPayments() {

    const [payments, setPayments] =
        useState([]);

    useEffect(() => {

        axios
            .get(
                "http://localhost:8081/payment/all"
            )

            .then((response) => {

                const customerId =
                    localStorage.getItem(
                        "customerId"
                    );

                const filteredPayments =
                    response.data.filter(
                        (payment) =>

                            payment.booking &&
                            payment.booking.customer &&
                            payment.booking.customer.id === Number(customerId)
                    );

                setPayments(
                    filteredPayments
                );
            });

    }, []);

    return (

        <div
            style={{
                padding: "30px"
            }}
        >

            <h1>

                My Payments

            </h1>

            <br />

            {
                payments.map((payment) => (

                    <div

                        key={payment.id}

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

                        <h2>

                            Payment ID :
                            {" "}
                            {payment.id}

                        </h2>

                        <p>

                            <b>
                                Car:
                            </b>

                            {" "}

                            {
                                payment.booking
                                    .carVariant
                                    ?.variantName
                            }

                            {" - "}

                            {
                                payment.booking
                                    .carVariant
                                    ?.fuelType
                            }

                        </p>

                        <p>

                            <b>
                                Amount:
                            </b>

                            {" "}

                            ₹ {payment.amount}

                        </p>

                        <p>

                            <b>
                                Payment Status:
                            </b>

                            {" "}

                            <span
                                style={{
                                    color:
                                        "green",
                                    fontWeight:
                                        "bold"
                                }}
                            >

                                {
                                    payment.paymentStatus
                                }

                            </span>

                        </p>

                        <p>

                            <b>
                                Payment Date:
                            </b>

                            {" "}

                            {
                                payment.paymentDate
                            }

                        </p>

                    </div>
                ))
            }

        </div>
    );
}

export default MyPayments;