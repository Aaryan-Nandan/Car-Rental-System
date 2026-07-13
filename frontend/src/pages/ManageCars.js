import { useEffect, useState } from "react";
import axios from "axios";

function ManageCars() {


const [cars, setCars] = useState([]);
const [variants, setVariants] = useState([]);

const [registrationNumber, setRegistrationNumber] = useState("");
const [color, setColor] = useState("");
const [variantId, setVariantId] = useState("");

const [editId, setEditId] = useState(null);
const [isEditing, setIsEditing] = useState(false);

useEffect(() => {

    fetchCars();
    fetchVariants();

}, []);

const fetchCars = () => {

    axios
        .get("http://localhost:8081/car/all")
        .then((response) => {

            setCars(response.data);

        })
        .catch((error) => {

            console.log(error);

        });
};

const fetchVariants = () => {

    axios
        .get("http://localhost:8081/variant/all")
        .then((response) => {

            setVariants(response.data);

        })
        .catch((error) => {

            console.log(error);

        });
};

const addCar = () => {

    if (!registrationNumber) {

        alert("Enter Registration Number");
        return;
    }

    if (!color) {

        alert("Enter Color");
        return;
    }

    if (!variantId) {

        alert("Select Variant");
        return;
    }

    const carData = {

        registrationNumber,
        color,

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

            alert("Car Added Successfully");

            setRegistrationNumber("");
            setColor("");
            setVariantId("");

            fetchCars();

        })
        .catch((error) => {

            console.log(error);

        });
};

const editCar = (car) => {

    setEditId(car.id);

    setRegistrationNumber(
        car.registrationNumber
    );

    setColor(
        car.color
    );

    setVariantId(
        car.carVariant?.id
    );

    setIsEditing(true);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

const updateCar = () => {

    const carData = {

        registrationNumber,
        color,

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

        })
        .catch((error) => {

            console.log(error);

        });
};

const deleteCar = (id) => {

    axios
        .delete(
            `http://localhost:8081/car/delete/${id}`
        )
        .then(() => {

            alert(
                "Car Deleted Successfully"
            );

            fetchCars();

        })
        .catch((error) => {

            console.log(error);

        });
};

const toggleAvailability = (id) => {

    axios
        .put(
            `http://localhost:8081/car/availability/${id}`
        )
        .then(() => {

            fetchCars();

        })
        .catch((error) => {

            console.log(error);

        });
};

return (

    <div style={{ padding: "30px" }}>

        <h1>Manage Cars</h1>

        <br />

        <input
            type="text"
            placeholder="Registration Number"
            value={registrationNumber}
            onChange={(e) =>
                setRegistrationNumber(
                    e.target.value
                )
            }
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
        >

            <option value="">
                Select Variant
            </option>

            {
                variants.map((variant) => (

                    <option
                        key={variant.id}
                        value={variant.id}
                    >

                        {variant.variantName}
                        {" - "}
                        {variant.fuelType}

                    </option>

                ))
            }

        </select>

        <br />
        <br />

        {
            isEditing ? (

                <button
                    onClick={updateCar}
                >
                    Update Car
                </button>

            ) : (

                <button
                    onClick={addCar}
                >
                    Add Car
                </button>

            )
        }

        <hr />

        <h2>All Cars</h2>

        {
            cars.map((car) => (

                <div
                    key={car.id}
                    style={{
                        border: "1px solid lightgray",
                        borderRadius: "10px",
                        padding: "15px",
                        marginBottom: "15px"
                    }}
                >

                    <h3>
                        {car.registrationNumber}
                    </h3>

                    <p>
                        <b>Color:</b>
                        {" "}
                        {car.color}
                    </p>

                    <p>
                        <b>Variant:</b>
                        {" "}
                        {car.carVariant?.variantName}
                        {" - "}
                        {car.carVariant?.fuelType}
                    </p>

                    <p>
                        <b>Available:</b>
                        {" "}
                        {
                            car.available
                                ? "Yes"
                                : "No"
                        }
                    </p>

                    <button
    onClick={() =>
        toggleAvailability(car.id)
    }
    style={{
        backgroundColor: "#ff9800",
        color: "white",
        border: "none",
        padding: "8px 15px",
        borderRadius: "5px",
        cursor: "pointer"
    }}
>
    Toggle Availability
</button>

<button
    onClick={() =>
        editCar(car)
    }
    style={{
        backgroundColor: "#2196F3",
        color: "white",
        border: "none",
        padding: "8px 15px",
        marginLeft: "10px",
        borderRadius: "5px",
        cursor: "pointer"
    }}
>
    Edit
</button>

<button
    onClick={() =>
        deleteCar(car.id)
    }
    style={{
        backgroundColor: "red",
        color: "white",
        border: "none",
        padding: "8px 15px",
        marginLeft: "10px",
        borderRadius: "5px",
        cursor: "pointer"
    }}
>
    Delete
</button>

                </div>
            ))
        }

    </div>
);


}

export default ManageCars;
