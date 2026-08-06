import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
                            payment.booking.customer.id ===
                            Number(customerId)
                    );

                setPayments(
                    filteredPayments
                );

            })

            .catch((error) => {

                console.log(error);

            });

    }, []);

    // DOWNLOAD PDF INVOICE

    const downloadInvoice = (payment) => {

        const doc =
            new jsPDF();

        doc.setFontSize(22);

        doc.text(
            "CAR RENTAL SYSTEM",
            55,
            20
        );

        doc.setFontSize(14);

        doc.text(
            "Payment Invoice",
            72,
            30
        );

        autoTable(doc, {

            startY: 40,

            head: [

                [
                    "Field",
                    "Value"
                ]

            ],

            body: [

                [
                    "Invoice No",
                    "INV-" +
                    payment.id
                ],

                [
                    "Payment ID",
                    payment.id
                ],

                [
                    "Customer",
                    payment.booking
                        .customer
                        ?.name
                ],

                [
                    "Car",
                    payment.booking
                        .carVariant
                        ?.variantName
                ],

                [
                    "Fuel Type",
                    payment.booking
                        .carVariant
                        ?.fuelType
                ],

                [
                    "Booking ID",
                    payment.booking.id
                ],

                [
                    "From Date",
                    payment.booking
                        .fromDate
                ],

                [
                    "To Date",
                    payment.booking
                        .toDate
                ],

                [
    "Amount",
    "Rs. " +
    Number(payment.amount).toLocaleString("en-IN")
],

                [
                    "Payment Status",
                    payment.paymentStatus
                ],

                [
                    "Payment Date",
                    payment.paymentDate
                ]

            ]

        });

        doc.text(

            "Thank You For Choosing Car Rental System!",

            20,

            doc.lastAutoTable.finalY + 20

        );

        doc.save(

            "Invoice_" +
            payment.id +
            ".pdf"

        );

    };

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

                payments.length === 0 ?

                    (

                        <h3>

                            No Payments Found

                        </h3>

                    )

                    :

                    (

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

                                        Car :

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

                                        Amount :

                                    </b>

                                    {" "}

                                    ₹ {payment.amount}

                                </p>

                                <p>

                                    <b>

                                        Payment Status :

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

                                        Payment Date :

                                    </b>

                                    {" "}

                                    {

                                        payment.paymentDate

                                    }

                                </p>

                                <button

                                    onClick={() =>
                                        downloadInvoice(
                                            payment
                                        )
                                    }

                                    style={{

                                        backgroundColor:
                                            "#1976d2",

                                        color:
                                            "white",

                                        border:
                                            "none",

                                        padding:
                                            "12px",

                                        width:
                                            "100%",

                                        borderRadius:
                                            "5px",

                                        cursor:
                                            "pointer",

                                        marginTop:
                                            "15px",

                                        fontWeight:
                                            "bold"

                                    }}

                                >

                                    📄 Download Invoice

                                </button>

                            </div>

                        ))

                    )

            }

        </div>

    );

}

export default MyPayments;