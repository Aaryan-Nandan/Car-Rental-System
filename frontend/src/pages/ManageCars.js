import { useEffect, useState } from "react";
import axios from "axios";

function ManageCars() {

    // =========================================================
    // STATE
    // =========================================================

    const [cars, setCars] = useState([]);

    const [variants, setVariants] = useState([]);

    const [registrationNumber, setRegistrationNumber] =
        useState("");

    const [color, setColor] =
        useState("");

    const [variantId, setVariantId] =
        useState("");

    const [editId, setEditId] =
        useState(null);

    const [isEditing, setIsEditing] =
        useState(false);

    // NEW - SEARCH
    const [searchText, setSearchText] =
        useState("");


    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {

        fetchCars();

        fetchVariants();

    }, []);


    // =========================================================
    // FETCH ALL CARS
    // =========================================================

    const fetchCars = () => {

        axios
            .get(
                "http://localhost:8081/car/all"
            )
            .then((response) => {

                const carData =
                    response.data || [];

                /*
                 * Newest added car first.
                 *
                 * Higher database ID normally means
                 * the car was added later.
                 */

                const sortedCars =
                    [...carData].sort(
                        (a, b) =>
                            Number(b.id || 0) -
                            Number(a.id || 0)
                    );

                setCars(sortedCars);

            })
            .catch((error) => {

                console.log(
                    "Fetch Cars Error:",
                    error
                );

            });
    };


    // =========================================================
    // FETCH ALL VARIANTS
    // =========================================================

    const fetchVariants = () => {

        axios
            .get(
                "http://localhost:8081/variant/all"
            )
            .then((response) => {

                setVariants(
                    response.data || []
                );

            })
            .catch((error) => {

                console.log(
                    "Fetch Variants Error:",
                    error
                );

            });
    };


    // =========================================================
    // GET VARIANT DETAILS
    // =========================================================

    const getVariantDetails = (car) => {

        if (!car || !car.carVariant) {
            return null;
        }

        /*
         * First try the complete variant returned
         * inside the Car object.
         */

        const carVariant =
            car.carVariant;


        /*
         * Then find the same variant from
         * /variant/all.
         *
         * This gives us availableCars and
         * pricePerDay.
         */

        const fullVariant =
            variants.find(
                (variant) =>
                    Number(variant.id) ===
                    Number(carVariant.id)
            );


        return fullVariant || carVariant;
    };


    // =========================================================
    // ADD CAR
    // =========================================================

    const addCar = () => {

        if (!registrationNumber.trim()) {

            alert(
                "Enter Registration Number"
            );

            return;
        }


        if (!color.trim()) {

            alert(
                "Enter Color"
            );

            return;
        }


        if (!variantId) {

            alert(
                "Select Variant"
            );

            return;
        }


        const carData = {

            registrationNumber:
                registrationNumber.trim(),

            color:
                color.trim(),

            carVariant: {

                id: variantId

            }

        };


        axios
            .post(
                "http://localhost:8081/car/add",
                carData
            )
            .then(() => {

                alert(
                    "Car Added Successfully"
                );


                setRegistrationNumber("");

                setColor("");

                setVariantId("");


                /*
                 * Fetch both.
                 *
                 * The new car will automatically
                 * appear at the top because fetchCars()
                 * sorts by ID descending.
                 */

                fetchCars();

                fetchVariants();

            })
            .catch((error) => {

                console.log(
                    "Add Car Error:",
                    error
                );

                alert(
                    "Unable to add car."
                );

            });
    };


    // =========================================================
    // EDIT CAR
    // =========================================================

    const editCar = (car) => {

        setEditId(
            car.id
        );


        setRegistrationNumber(
            car.registrationNumber || ""
        );


        setColor(
            car.color || ""
        );


        setVariantId(
            car.carVariant?.id || ""
        );


        setIsEditing(true);


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });
    };


    // =========================================================
    // UPDATE CAR
    // =========================================================

    const updateCar = () => {

        if (!registrationNumber.trim()) {

            alert(
                "Enter Registration Number"
            );

            return;
        }


        if (!color.trim()) {

            alert(
                "Enter Color"
            );

            return;
        }


        if (!variantId) {

            alert(
                "Select Variant"
            );

            return;
        }


        const carData = {

            registrationNumber:
                registrationNumber.trim(),

            color:
                color.trim(),

            carVariant: {

                id: variantId

            }

        };


        axios
            .put(
                `http://localhost:8081/car/update/${editId}`,
                carData
            )
            .then(() => {

                alert(
                    "Car Updated Successfully"
                );


                setRegistrationNumber("");

                setColor("");

                setVariantId("");

                setEditId(null);

                setIsEditing(false);


                fetchCars();

                fetchVariants();

            })
            .catch((error) => {

                console.log(
                    "Update Car Error:",
                    error
                );

                alert(
                    "Unable to update car."
                );

            });
    };


    // =========================================================
    // CANCEL EDIT
    // =========================================================

    const cancelEdit = () => {

        setRegistrationNumber("");

        setColor("");

        setVariantId("");

        setEditId(null);

        setIsEditing(false);
    };


    // =========================================================
    // DELETE CAR
    // =========================================================

    const deleteCar = (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this car?"
            );


        if (!confirmDelete) {
            return;
        }


        axios
            .delete(
                `http://localhost:8081/car/delete/${id}`
            )
            .then(() => {

                alert(
                    "Car Deleted Successfully"
                );


                fetchCars();

                fetchVariants();

            })
            .catch((error) => {

                console.log(
                    "Delete Car Error:",
                    error
                );

                alert(
                    "Unable to delete car."
                );

            });
    };


    // =========================================================
    // TOGGLE AVAILABILITY
    // =========================================================

    const toggleAvailability = (id) => {

        axios
            .put(
                `http://localhost:8081/car/availability/${id}`
            )
            .then(() => {

                fetchCars();

                fetchVariants();

            })
            .catch((error) => {

                console.log(
                    "Toggle Availability Error:",
                    error
                );

                alert(
                    "Unable to change availability."
                );

            });
    };


    // =========================================================
    // SEARCH
    // =========================================================

    const filteredCars =
        cars.filter((car) => {

            const search =
                searchText
                    .trim()
                    .toLowerCase();


            /*
             * Empty search = show everything.
             */

            if (!search) {
                return true;
            }


            const variant =
                getVariantDetails(car);


            const registration =
                (
                    car.registrationNumber ||
                    ""
                ).toLowerCase();


            const colorValue =
                (
                    car.color ||
                    ""
                ).toLowerCase();


            const variantName =
                (
                    variant?.variantName ||
                    ""
                ).toLowerCase();


            const fuelType =
                (
                    variant?.fuelType ||
                    ""
                ).toLowerCase();


            const companyName =
                (
                    variant?.carCompany?.companyName ||
                    ""
                ).toLowerCase();


            /*
             * Search works with:
             *
             * Registration number
             * Color
             * Variant/model name
             * Fuel type
             * Company name
             */

            return (

                registration.includes(search) ||

                colorValue.includes(search) ||

                variantName.includes(search) ||

                fuelType.includes(search) ||

                companyName.includes(search)

            );

        });


    // =========================================================
    // TOTAL CARS
    // =========================================================

    const totalCars =
        cars.length;


    // =========================================================
    // AVAILABLE CARS
    // =========================================================

    const availableCars =
        cars.filter(
            (car) =>
                car.available === true
        ).length;


    // =========================================================
    // RETURN
    // =========================================================

    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "1200px",
                margin: "0 auto"
            }}
        >

            {/* =================================================
                PAGE TITLE
               ================================================= */}

            <h1>
                Manage Cars
            </h1>


            {/* =================================================
                SUMMARY
               ================================================= */}

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "25px",
                    flexWrap: "wrap"
                }}
            >

                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "15px 25px",
                        backgroundColor: "#f8f9fa"
                    }}
                >

                    <b>
                        Total Cars
                    </b>

                    <div
                        style={{
                            fontSize: "24px",
                            marginTop: "5px"
                        }}
                    >
                        {totalCars}
                    </div>

                </div>


                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "15px 25px",
                        backgroundColor: "#f8fff8"
                    }}
                >

                    <b>
                        Available Cars
                    </b>

                    <div
                        style={{
                            fontSize: "24px",
                            marginTop: "5px",
                            color: "green"
                        }}
                    >
                        {availableCars}
                    </div>

                </div>

            </div>


            {/* =================================================
                ADD / EDIT CAR FORM
               ================================================= */}

            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "30px"
                }}
            >

                <h2>

                    {
                        isEditing
                            ? "Edit Car"
                            : "Add New Car"
                    }

                </h2>


                <input
                    type="text"
                    placeholder="Registration Number"
                    value={registrationNumber}
                    onChange={(e) =>
                        setRegistrationNumber(
                            e.target.value
                        )
                    }
                    style={{
                        padding: "10px",
                        width: "100%",
                        maxWidth: "500px",
                        boxSizing: "border-box"
                    }}
                />


                <br />
                <br />


                <input
                    type="text"
                    placeholder="Color"
                    value={color}
                    onChange={(e) =>
                        setColor(
                            e.target.value
                        )
                    }
                    style={{
                        padding: "10px",
                        width: "100%",
                        maxWidth: "500px",
                        boxSizing: "border-box"
                    }}
                />


                <br />
                <br />


                <select
                    value={variantId}
                    onChange={(e) =>
                        setVariantId(
                            e.target.value
                        )
                    }
                    style={{
                        padding: "10px",
                        width: "100%",
                        maxWidth: "500px"
                    }}
                >

                    <option value="">
                        Select Variant
                    </option>


                    {
                        variants.map(
                            (variant) => (

                                <option
                                    key={
                                        variant.id
                                    }
                                    value={
                                        variant.id
                                    }
                                >

                                    {
                                        variant.variantName
                                    }

                                    {" - "}

                                    {
                                        variant.fuelType
                                    }

                                </option>

                            )
                        )
                    }

                </select>


                <br />
                <br />


                {
                    isEditing ? (

                        <>

                            <button
                                onClick={
                                    updateCar
                                }
                                style={{
                                    backgroundColor:
                                        "#2196F3",
                                    color: "white",
                                    border: "none",
                                    padding:
                                        "10px 18px",
                                    borderRadius:
                                        "5px",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                Update Car
                            </button>


                            <button
                                onClick={
                                    cancelEdit
                                }
                                style={{
                                    backgroundColor:
                                        "#777",
                                    color: "white",
                                    border: "none",
                                    padding:
                                        "10px 18px",
                                    marginLeft:
                                        "10px",
                                    borderRadius:
                                        "5px",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                Cancel
                            </button>

                        </>

                    ) : (

                        <button
                            onClick={
                                addCar
                            }
                            style={{
                                backgroundColor:
                                    "#4CAF50",
                                color: "white",
                                border: "none",
                                padding:
                                    "10px 18px",
                                borderRadius:
                                    "5px",
                                cursor:
                                    "pointer"
                            }}
                        >
                            Add Car
                        </button>

                    )
                }

            </div>


            <hr />


            {/* =================================================
                SEARCH
               ================================================= */}

            <div
                style={{
                    marginTop: "25px",
                    marginBottom: "25px"
                }}
            >

                <h2>
                    All Cars
                </h2>


                <input
                    type="text"
                    placeholder="Search by car name, model, company or registration number..."
                    value={searchText}
                    onChange={(e) =>
                        setSearchText(
                            e.target.value
                        )
                    }
                    style={{
                        width: "100%",
                        maxWidth: "700px",
                        padding: "12px",
                        border:
                            "1px solid #ccc",
                        borderRadius: "6px",
                        fontSize: "15px",
                        boxSizing: "border-box"
                    }}
                />


                {
                    searchText.trim() && (

                        <p
                            style={{
                                marginTop: "10px",
                                color: "#555"
                            }}
                        >

                            Showing{" "}
                            <b>
                                {
                                    filteredCars.length
                                }
                            </b>

                            {" "}of{" "}

                            <b>
                                {
                                    cars.length
                                }
                            </b>

                            {" "}cars

                        </p>

                    )
                }

            </div>


            {/* =================================================
                NO RESULTS
               ================================================= */}

            {
                filteredCars.length === 0 ? (

                    <div
                        style={{
                            border:
                                "1px solid #ddd",
                            borderRadius:
                                "10px",
                            padding: "30px",
                            textAlign:
                                "center"
                        }}
                    >

                        <h3>
                            No cars found
                        </h3>

                        {
                            searchText && (

                                <p>
                                    No car matches
                                    "{searchText}"
                                </p>

                            )
                        }

                    </div>

                ) : (

                    filteredCars.map(
                        (car) => {

                            const variant =
                                getVariantDetails(
                                    car
                                );


                            /*
                             * Available count for
                             * this model/variant.
                             */

                            const variantAvailable =
                                variant?.availableCars;


                            /*
                             * If availableCars is not
                             * supplied for some reason,
                             * calculate it from the cars
                             * currently loaded.
                             */

                            const calculatedAvailable =
                                cars.filter(
                                    (item) =>

                                        Number(
                                            item.carVariant?.id
                                        ) ===
                                        Number(
                                            car.carVariant?.id
                                        )

                                        &&

                                        item.available ===
                                        true

                                ).length;


                            const displayedAvailable =
                                variantAvailable !==
                                    undefined &&
                                variantAvailable !==
                                    null

                                    ? variantAvailable

                                    : calculatedAvailable;


                            /*
                             * Total physical cars
                             * belonging to this variant.
                             */

                            const totalVariantCars =
                                cars.filter(
                                    (item) =>

                                        Number(
                                            item.carVariant?.id
                                        ) ===
                                        Number(
                                            car.carVariant?.id
                                        )

                                ).length;


                            return (

                                <div
                                    key={car.id}
                                    style={{
                                        border:
                                            "1px solid lightgray",
                                        borderRadius:
                                            "10px",
                                        padding:
                                            "20px",
                                        marginBottom:
                                            "15px",
                                        backgroundColor:
                                            "#fff"
                                    }}
                                >

                                    {/* =================================================
                                        CAR NAME
                                       ================================================= */}

                                    <h3
                                        style={{
                                            marginTop:
                                                "0"
                                        }}
                                    >

                                        {
                                            variant?.carCompany
                                                ?.companyName
                                        }

                                        {" "}

                                        {
                                            variant
                                                ?.variantName ||
                                            "Unknown Model"
                                        }

                                    </h3>


                                    {/* =================================================
                                        REGISTRATION
                                       ================================================= */}

                                    <p>

                                        <b>
                                            Registration Number:
                                        </b>

                                        {" "}

                                        {
                                            car.registrationNumber
                                        }

                                    </p>


                                    {/* =================================================
                                        COLOR
                                       ================================================= */}

                                    <p>

                                        <b>
                                            Color:
                                        </b>

                                        {" "}

                                        {
                                            car.color
                                        }

                                    </p>


                                    {/* =================================================
                                        VARIANT
                                       ================================================= */}

                                    <p>

                                        <b>
                                            Variant:
                                        </b>

                                        {" "}

                                        {
                                            variant?.variantName ||
                                            "Not Available"
                                        }

                                    </p>


                                    {/* =================================================
                                        FUEL
                                       ================================================= */}

                                    <p>

                                        <b>
                                            Fuel Type:
                                        </b>

                                        {" "}

                                        {
                                            variant?.fuelType ||
                                            "Not Available"
                                        }

                                    </p>


                                    {/* =================================================
                                        PRICE
                                       ================================================= */}

                                    <p>

                                        <b>
                                            Price Per Day:
                                        </b>

                                        {" "}

                                        {
                                            variant?.pricePerDay !==
                                                undefined &&
                                            variant?.pricePerDay !==
                                                null

                                                ? (
                                                    <>
                                                        ₹
                                                        {
                                                            Number(
                                                                variant.pricePerDay
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )
                                                        }

                                                        {" / day"}
                                                    </>
                                                )

                                                : "Not Available"
                                        }

                                    </p>


                                    {/* =================================================
                                        MODEL AVAILABILITY
                                       ================================================= */}

                                    <p>

                                        <b>
                                            Available Cars:
                                        </b>

                                        {" "}

                                        <span
                                            style={{
                                                color:
                                                    Number(
                                                        displayedAvailable
                                                    ) > 0
                                                        ? "green"
                                                        : "red",
                                                fontWeight:
                                                    "bold"
                                            }}
                                        >

                                            {
                                                displayedAvailable
                                            }

                                        </span>

                                        {" / "}

                                        {
                                            totalVariantCars
                                        }

                                    </p>


                                    {/* =================================================
                                        THIS PHYSICAL CAR STATUS
                                       ================================================= */}

                                    <p>

                                        <b>
                                            This Car Status:
                                        </b>

                                        {" "}

                                        {
                                            car.available
                                                ? (
                                                    <span
                                                        style={{
                                                            color:
                                                                "green",
                                                            fontWeight:
                                                                "bold"
                                                        }}
                                                    >
                                                        Available
                                                    </span>
                                                )

                                                : (
                                                    <span
                                                        style={{
                                                            color:
                                                                "red",
                                                            fontWeight:
                                                                "bold"
                                                        }}
                                                    >
                                                        Booked /
                                                        Unavailable
                                                    </span>
                                                )
                                        }

                                    </p>


                                    {/* =================================================
                                        BUTTONS
                                       ================================================= */}

                                    <button
                                        onClick={() =>
                                            toggleAvailability(
                                                car.id
                                            )
                                        }
                                        style={{
                                            backgroundColor:
                                                "#ff9800",
                                            color:
                                                "white",
                                            border:
                                                "none",
                                            padding:
                                                "8px 15px",
                                            borderRadius:
                                                "5px",
                                            cursor:
                                                "pointer"
                                        }}
                                    >
                                        Toggle Availability
                                    </button>


                                    <button
                                        onClick={() =>
                                            editCar(
                                                car
                                            )
                                        }
                                        style={{
                                            backgroundColor:
                                                "#2196F3",
                                            color:
                                                "white",
                                            border:
                                                "none",
                                            padding:
                                                "8px 15px",
                                            marginLeft:
                                                "10px",
                                            borderRadius:
                                                "5px",
                                            cursor:
                                                "pointer"
                                        }}
                                    >
                                        Edit
                                    </button>


                                    <button
                                        onClick={() =>
                                            deleteCar(
                                                car.id
                                            )
                                        }
                                        style={{
                                            backgroundColor:
                                                "red",
                                            color:
                                                "white",
                                            border:
                                                "none",
                                            padding:
                                                "8px 15px",
                                            marginLeft:
                                                "10px",
                                            borderRadius:
                                                "5px",
                                            cursor:
                                                "pointer"
                                        }}
                                    >
                                        Delete
                                    </button>

                                </div>

                            );

                        }
                    )

                )
            }

        </div>
    );
}

export default ManageCars;