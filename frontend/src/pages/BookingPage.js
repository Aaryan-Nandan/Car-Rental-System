import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function BookingPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [license, setLicense] = useState(null);

    const [totalAmount, setTotalAmount] = useState(0);
    const [carVariant, setCarVariant] = useState(null);

    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    // ==========================================
    // GET TODAY'S DATE
    // ==========================================

    const today = new Date()
        .toISOString()
        .split("T")[0];


    // ==========================================
    // FETCH SELECTED CAR
    // ==========================================

    useEffect(() => {

        setLoading(true);

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

                if (!selectedVariant) {

                    alert(
                        "Car variant not found"
                    );

                    navigate("/");
                    return;
                }

                setCarVariant(
                    selectedVariant
                );

            })
            .catch((error) => {

                console.error(
                    "Error loading car:",
                    error
                );

                alert(
                    "Unable to load car details"
                );

            })
            .finally(() => {

                setLoading(false);

            });

    }, [id, navigate]);


    // ==========================================
    // CALCULATE TOTAL AMOUNT
    // ==========================================

    useEffect(() => {

        if (
            !fromDate ||
            !toDate ||
            !carVariant
        ) {

            setTotalAmount(0);
            return;
        }

        const startDate =
            new Date(fromDate);

        const endDate =
            new Date(toDate);

        const differenceInTime =
            endDate - startDate;

        if (differenceInTime < 0) {

            setTotalAmount(0);
            return;
        }

        const days =
            Math.floor(
                differenceInTime /
                (1000 * 60 * 60 * 24)
            ) + 1;

        const amount =
            days *
            carVariant.pricePerDay;

        setTotalAmount(amount);

    }, [
        fromDate,
        toDate,
        carVariant
    ]);


    // ==========================================
    // HANDLE FROM DATE
    // ==========================================

    const handleFromDateChange = (e) => {

        const selectedDate =
            e.target.value;

        setFromDate(selectedDate);

        // Clear To Date if it becomes invalid
        if (
            toDate &&
            selectedDate > toDate
        ) {

            setToDate("");
        }
    };


    // ==========================================
    // HANDLE TO DATE
    // ==========================================

    const handleToDateChange = (e) => {

        const selectedDate =
            e.target.value;

        if (
            fromDate &&
            selectedDate < fromDate
        ) {

            alert(
                "To Date cannot be before From Date"
            );

            return;
        }

        setToDate(selectedDate);
    };


    // ==========================================
    // HANDLE LICENSE
    // ==========================================

    const handleLicenseChange = (e) => {

        const file =
            e.target.files[0];

        if (!file) {

            setLicense(null);
            return;
        }

        // Allow common image/PDF formats
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "application/pdf"
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            alert(
                "Please upload JPG, PNG or PDF file"
            );

            e.target.value = "";
            setLicense(null);

            return;
        }

        // Maximum 5 MB
        if (
            file.size >
            5 * 1024 * 1024
        ) {

            alert(
                "Driving License file must be less than 5 MB"
            );

            e.target.value = "";
            setLicense(null);

            return;
        }

        setLicense(file);
    };


    // ==========================================
    // HANDLE BOOKING
    // ==========================================

    const handleBooking = async () => {

        // --------------------------------------
        // LOGIN CHECK
        // --------------------------------------

        const token =
            localStorage.getItem(
                "token"
            );

        const customerId =
            localStorage.getItem(
                "customerId"
            );

        if (!token || !customerId) {

            alert(
                "Please login before booking"
            );

            navigate("/login");

            return;
        }


        // --------------------------------------
        // CAR CHECK
        // --------------------------------------

        if (!carVariant) {

            alert(
                "Car information is not available"
            );

            return;
        }


        // --------------------------------------
        // DATE VALIDATION
        // --------------------------------------

        if (!fromDate) {

            alert(
                "Please select From Date"
            );

            return;
        }

        if (!toDate) {

            alert(
                "Please select To Date"
            );

            return;
        }

        if (fromDate < today) {

            alert(
                "From Date cannot be in the past"
            );

            return;
        }

        if (toDate < fromDate) {

            alert(
                "To Date cannot be before From Date"
            );

            return;
        }


        // --------------------------------------
        // LICENSE VALIDATION
        // --------------------------------------

        if (!license) {

            alert(
                "Please upload Driving License"
            );

            return;
        }


        // --------------------------------------
        // AVAILABILITY CHECK
        // --------------------------------------

        if (
            carVariant.availableCars <= 0
        ) {

            alert(
                "No Cars Available"
            );

            return;
        }


        // --------------------------------------
        // BOOKING DATA
        // --------------------------------------

        const bookingData = {

            fromDate: fromDate,

            toDate: toDate,

            totalAmount: totalAmount,

            bookingStatus: "PENDING",

            customer: {

                id: Number(
                    customerId
                )

            },

            carVariant: {

                id: carVariant.id

            }

        };


        // --------------------------------------
        // SEND BOOKING
        // --------------------------------------

        setBookingLoading(true);

        try {

            const response =
                await axios.post(

                    "http://localhost:8081/booking/add",

                    bookingData,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }

                );


            // ----------------------------------
            // BACKEND RESPONSE
            // ----------------------------------

            if (
                typeof response.data ===
                "string"
            ) {

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
                    response.data
                );

                return;
            }


            // ----------------------------------
            // SUCCESS
            // ----------------------------------

            alert(
                "Booking Submitted Successfully"
            );

            navigate(
                "/my-bookings"
            );

        }
        catch (error) {

            console.error(
                "Booking Error:",
                error
            );

            if (
                error.response
            ) {

                console.error(
                    "Backend Response:",
                    error.response.data
                );

                if (
                    error.response.status ===
                    401
                ) {

                    alert(
                        "Session expired. Please login again."
                    );

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "customerId"
                    );

                    navigate(
                        "/login"
                    );

                    return;
                }

                if (
                    error.response.status ===
                    403
                ) {

                    alert(
                        "You are not authorized to make this booking."
                    );

                    return;
                }
            }

            alert(
                "Something went wrong while booking"
            );

        }
        finally {

            setBookingLoading(false);

        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div
                style={{
                    textAlign: "center",
                    marginTop: "80px"
                }}
            >

                <h2>
                    Loading Car Details...
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
                maxWidth: "700px",
                margin: "40px auto",
                padding: "30px",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow:
                    "0 0 15px lightgray"
            }}
        >

            {/* CAR DETAILS */}

            {carVariant && (

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "30px"
                    }}
                >

                    <img
                        src={
                            carVariant.imageUrl
                        }
                        alt={
                            carVariant.variantName
                        }
                        style={{
                            width: "100%",
                            maxHeight: "300px",
                            objectFit: "cover",
                            borderRadius: "10px"
                        }}
                    />

                    <h2>
                        🚗{" "}
                        {
                            carVariant.variantName
                        }
                    </h2>

                    <p>
                        <strong>
                            Company:
                        </strong>{" "}
                        {
                            carVariant.carCompany
                                ?.companyName
                        }
                    </p>

                    <p>
                        <strong>
                            Fuel:
                        </strong>{" "}
                        {
                            carVariant.fuelType
                        }
                    </p>

                    <p>
                        <strong>
                            Price:
                        </strong>{" "}
                        ₹{" "}
                        {
                            carVariant.pricePerDay
                        }{" "}
                        / Day
                    </p>

                    <p>
                        <strong>
                            Available:
                        </strong>{" "}
                        {
                            carVariant.availableCars
                        }
                    </p>

                </div>

            )}


            <h1
                style={{
                    textAlign: "center"
                }}
            >
                Car Booking
            </h1>


            {/* FROM DATE */}

            <div
                style={{
                    marginTop: "25px"
                }}
            >

                <label>
                    <strong>
                        From Date
                    </strong>

                    <span
                        style={{
                            color: "red"
                        }}
                    >
                        {" "}*
                    </span>
                </label>

                <br />

                <input
                    type="date"
                    min={today}
                    value={fromDate}
                    onChange={
                        handleFromDateChange
                    }
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        boxSizing:
                            "border-box"
                    }}
                />

            </div>


            {/* TO DATE */}

            <div
                style={{
                    marginTop: "20px"
                }}
            >

                <label>
                    <strong>
                        To Date
                    </strong>

                    <span
                        style={{
                            color: "red"
                        }}
                    >
                        {" "}*
                    </span>
                </label>

                <br />

                <input
                    type="date"
                    min={
                        fromDate || today
                    }
                    value={toDate}
                    onChange={
                        handleToDateChange
                    }
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        boxSizing:
                            "border-box"
                    }}
                />

            </div>


            {/* LICENSE */}

            <div
                style={{
                    marginTop: "20px"
                }}
            >

                <label>
                    <strong>
                        Driving License
                    </strong>

                    <span
                        style={{
                            color: "red"
                        }}
                    >
                        {" "}*
                    </span>
                </label>

                <br />

                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={
                        handleLicenseChange
                    }
                    style={{
                        marginTop: "10px"
                    }}
                />

                {license && (

                    <p
                        style={{
                            color: "green",
                            fontWeight: "bold"
                        }}
                    >

                        ✅{" "}
                        {license.name}

                    </p>

                )}

            </div>


            {/* TOTAL */}

            <div
                style={{
                    marginTop: "30px",
                    padding: "20px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "10px",
                    textAlign: "center"
                }}
            >

                <h2>
                    Total Amount
                </h2>

                <h1
                    style={{
                        color: "#1976D2"
                    }}
                >
                    ₹ {totalAmount}
                </h1>

            </div>


            {/* BOOKING BUTTON */}

            <button
                onClick={
                    handleBooking
                }
                disabled={
                    bookingLoading ||
                    !carVariant ||
                    carVariant.availableCars <= 0
                }
                style={{
                    width: "100%",
                    padding: "15px",
                    marginTop: "25px",
                    backgroundColor:
                        bookingLoading ||
                        !carVariant ||
                        carVariant.availableCars <= 0
                            ? "gray"
                            : "black",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor:
                        bookingLoading
                            ? "not-allowed"
                            : "pointer",
                    fontSize: "17px",
                    fontWeight: "bold"
                }}
            >

                {bookingLoading
                    ? "Submitting..."
                    : "Confirm Booking"}

            </button>

        </div>

    );
}

export default BookingPage;