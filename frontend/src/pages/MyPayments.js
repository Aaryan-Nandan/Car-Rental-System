import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function MyPayments() {

    const [payments, setPayments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    // ==========================================
    // LOAD PAYMENTS
    // ==========================================

    useEffect(() => {

        loadPayments();

    }, []);


    const loadPayments = async () => {

        const customerId =
            localStorage.getItem(
                "customerId"
            );

        const token =
            localStorage.getItem(
                "token"
            );


        console.log(
            "Payment Customer ID:",
            customerId
        );


        if (!customerId || !token) {

            setLoading(false);

            return;
        }


        try {

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
                "Payment Response:",
                response.data
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

        }

        catch (error) {

            console.error(
                "Payment Error:",
                error
            );

        }

        finally {

            setLoading(false);

        }
    };


    // ==========================================
    // DOWNLOAD INVOICE
    // ==========================================

    const downloadInvoice = (
        payment
    ) => {

        const doc =
            new jsPDF();


        doc.setFontSize(
            22
        );


        doc.text(
            "CAR RENTAL SYSTEM",
            55,
            20
        );


        doc.setFontSize(
            14
        );


        doc.text(
            "Payment Invoice",
            72,
            30
        );


        autoTable(
            doc,
            {

                startY:
                    40,

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
                            ?.customer
                            ?.name ||
                        "N/A"
                    ],

                    [
                        "Car",
                        payment.booking
                            ?.carVariant
                            ?.variantName ||
                        "N/A"
                    ],

                    [
                        "Fuel Type",
                        payment.booking
                            ?.carVariant
                            ?.fuelType ||
                        "N/A"
                    ],

                    [
                        "Booking ID",
                        payment.booking
                            ?.id ||
                        "N/A"
                    ],

                    [
                        "From Date",
                        payment.booking
                            ?.fromDate ||
                        "N/A"
                    ],

                    [
                        "To Date",
                        payment.booking
                            ?.toDate ||
                        "N/A"
                    ],

                    [
                        "Amount",
                        "Rs. " +
                        Number(
                            payment.amount
                        ).toLocaleString(
                            "en-IN"
                        )
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

            }
        );


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


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div
                style={{
                    padding:
                        "40px",

                    textAlign:
                        "center"
                }}
            >

                <h2>
                    Loading Payments...
                </h2>

            </div>

        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div
            style={{
                minHeight:
                    "calc(100vh - 80px)",

                backgroundColor:
                    "#f5f5f5",

                padding:
                    "40px 20px",

                boxSizing:
                    "border-box"
            }}
        >

            <div
                style={{
                    maxWidth:
                        "850px",

                    margin:
                        "0 auto"
                }}
            >

                <h1
                    style={{
                        textAlign:
                            "center"
                    }}
                >
                    My Payments
                </h1>


                <br />


                {payments.length === 0 ? (

                    <div
                        style={{
                            backgroundColor:
                                "white",

                            padding:
                                "35px",

                            borderRadius:
                                "12px",

                            textAlign:
                                "center"
                        }}
                    >

                        <h3>
                            No Payments Found
                        </h3>

                    </div>

                ) : (

                    payments.map(
                        (payment) => (

                            <div
                                key={
                                    payment.id
                                }

                                style={{
                                    backgroundColor:
                                        "white",

                                    border:
                                        "1px solid #ddd",

                                    padding:
                                        "25px",

                                    marginBottom:
                                        "20px",

                                    borderRadius:
                                        "12px",

                                    boxShadow:
                                        "0 4px 12px rgba(0,0,0,0.08)"
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
                                            ?.carVariant
                                            ?.variantName ||
                                        "N/A"
                                    }

                                    {" - "}

                                    {
                                        payment.booking
                                            ?.carVariant
                                            ?.fuelType ||
                                        "N/A"
                                    }

                                </p>


                                <p>

                                    <b>
                                        Amount:
                                    </b>

                                    {" "}

                                    ₹
                                    {" "}
                                    {payment.amount}

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

                        )
                    )

                )}

            </div>

        </div>
    );
}

export default MyPayments;