import { useEffect, useState } from "react";

import axios from "axios";

import { useParams } from "react-router-dom";

function BookingPage() {

    const { id } = useParams();

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");

    const [license, setLicense] =
        useState(null);

    const [totalAmount, setTotalAmount] =
        useState(0);

    const [carVariant, setCarVariant] =
        useState(null);

    // FETCH SELECTED CAR VARIANT

    useEffect(() => {

        axios
            .get(
                "http://localhost:8081/variant/all"
            )

            .then((response) => {

                const selectedVariant =
                    response.data.find(
                        (variant) =>
                            variant.id === Number(id)
                    );

                setCarVariant(selectedVariant);
            });

    }, [id]);

    // CALCULATE TOTAL AMOUNT

    useEffect(() => {

        if (fromDate && toDate && carVariant) {

            const startDate =
                new Date(fromDate);

            const endDate =
                new Date(toDate);

            const differenceInTime =
                endDate - startDate;

            const days =
                differenceInTime /
                (1000 * 60 * 60 * 24) + 1;

            const amount =
                days *
                carVariant.pricePerDay;

            setTotalAmount(amount);
        }

    }, [fromDate, toDate, carVariant]);

    // HANDLE BOOKING

    const handleBooking = () => {

        if (!fromDate) {

            alert("Please select From Date");

            return;
        }

        if (!toDate) {

            alert("Please select To Date");

            return;
        }

        if (!license) {

            alert("Please upload Driving License");

            return;
        }

        const bookingData = {

            fromDate: fromDate,

            toDate: toDate,

            totalAmount: totalAmount,

            bookingStatus: "PENDING",

            customer: {
                id: localStorage.getItem(
            "customerId"
        )
            },

            carVariant: {
                id: carVariant.id
            }
        };

        axios
    .post(
        "http://localhost:8081/booking/add",
        bookingData
    )

    .then((response) => {

        if (
            response.data === 
            "No Cars Available"
        ) {

            alert(
                "No Cars Available"
            );

            return;
        }

        alert(
            "Booking Submitted Successfully"
        );
    })

    .catch(() => {

        alert(
            "Something Went Wrong"
        );
    });
    
    };

    return (

        <div
            style={{
                padding: "30px"
            }}
        >

            {
                carVariant && (

                    <div>

                        <h2>

                            {carVariant.variantName}

                        </h2>

                        <h3>

                            ₹ {carVariant.pricePerDay}
                            / day

                        </h3>

                    </div>
                )
            }

            <h1>

                Car Booking Page

            </h1>

            <br />

            <div>

                <label>

                    From Date

                    <span
                        style={{
                            color: "red"
                        }}
                    >
                        *
                    </span>

                </label>

                <br />

                <input
                    type="date"

                    value={fromDate}

                    onChange={(e) =>
                        setFromDate(e.target.value)
                    }

                    style={{
                        padding: "10px",
                        width: "300px"
                    }}
                />

            </div>

            <br />

            <div>

                <label>

                    To Date

                    <span
                        style={{
                            color: "red"
                        }}
                    >
                        *
                    </span>

                </label>

                <br />

                <input
                    type="date"

                    value={toDate}

                    onChange={(e) =>
                        setToDate(e.target.value)
                    }

                    style={{
                        padding: "10px",
                        width: "300px"
                    }}
                />

            </div>

            <br />

            <div>

                <label>

                    Upload Driving License

                    <span
                        style={{
                            color: "red"
                        }}
                    >
                        *
                    </span>

                </label>

                <br />

                <input
                    type="file"

                    onChange={(e) =>
                        setLicense(
                            e.target.files[0]
                        )
                    }
                />

            </div>

            <br />

            <h2>

                Total Amount : ₹ {totalAmount}

            </h2>

            <button

                onClick={handleBooking}

                style={{
                    padding: "12px",
                    backgroundColor: "black",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >

                Confirm Booking

            </button>

        </div>
    );
}

export default BookingPage;