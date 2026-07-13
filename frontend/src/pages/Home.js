import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllVariants } from "../services/ApiService";

import cretaImage from "../assets/creta.jpg";
import venueImage from "../assets/venue.jpg";
import i20Image from "../assets/i20.jpg";

function Home() {

    const [variants, setVariants] =
        useState([]);

    useEffect(() => {

        loadVariants();

    }, []);

    const loadVariants = async () => {

        try {

            const response =
                await getAllVariants();

            setVariants(
                response.data
            );

        } catch (error) {

            console.log(error);
        }
    };

    const getCarImage =
        (variantName) => {

            if (
                variantName === "Creta"
            ) {

                return cretaImage;
            }

            if (
                variantName === "Venue"
            ) {

                return venueImage;
            }

            if (
                variantName === "i20"
            ) {

                return i20Image;
            }

            return cretaImage;
        };

    const heroAnimation = `
@keyframes raceGradient {

    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

@keyframes blinkText {

    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.4;
    }

    100% {
        opacity: 1;
    }
}
`;

    return (

        <div
            style={{
                backgroundColor:
                    "#f8fafc",
                minHeight:
                    "100vh"
            }}
        >

            <style>
                {heroAnimation}
            </style>

            {/* HERO SECTION */}

            <div
                style={{

                    background:
                        "linear-gradient(-45deg,#ff0000,#ff6b00,#ffd700,#00c853,#00b0ff,#304ffe,#d500f9)",

                    backgroundSize:
                        "400% 400%",

                    animation:
                        "raceGradient 10s ease infinite",

                    color:
                        "white",

                    padding:
                        "35px 20px",

                    textAlign:
                        "center",

                    boxShadow:
                        "0px 5px 20px rgba(0,0,0,0.3)"
                }}
            >

                <h1
                    style={{
                        fontSize:
                            "42px",

                        marginBottom:
                            "10px"
                    }}
                >

                    🚗 Premium Car Rentals

                </h1>

                <p
                    style={{
                        fontSize:
                            "20px"
                    }}
                >

                    Drive Your Dream Car Today

                </p>

                <p
                    style={{
                        marginTop:
                            "15px",

                        fontSize:
                            "18px",

                        fontWeight:
                            "bold",

                        animation:
                            "blinkText 2s infinite"
                    }}
                >

                    🏎️ Best Prices • ⚡ Instant Booking • ✅ Verified Vehicles

                </p>

            </div>

            {/* STATS */}

            <div
                style={{
                    display:
                        "flex",

                    justifyContent:
                        "center",

                    flexWrap:
                        "wrap",

                    gap:
                        "20px",

                    padding:
                        "25px"
                }}
            >

                <div
                    style={{
                        background:
                            "white",

                        padding:
                            "20px 30px",

                        borderRadius:
                            "12px",

                        boxShadow:
                            "0px 0px 10px lightgray",

                        fontWeight:
                            "bold"
                    }}
                >

                    🚗 Cars :
                    {" "}
                    {variants.length}

                </div>

                <div
                    style={{
                        background:
                            "white",

                        padding:
                            "20px 30px",

                        borderRadius:
                            "12px",

                        boxShadow:
                            "0px 0px 10px lightgray",

                        fontWeight:
                            "bold"
                    }}
                >

                    💳 Secure Payments

                </div>

                <div
                    style={{
                        background:
                            "white",

                        padding:
                            "20px 30px",

                        borderRadius:
                            "12px",

                        boxShadow:
                            "0px 0px 10px lightgray",

                        fontWeight:
                            "bold"
                    }}
                >

                    ⭐ Verified Cars

                </div>

            </div>

            <div
                style={{
                    padding:
                        "20px 30px 40px"
                }}
            >

                <h1
                    style={{
                        textAlign:
                            "center"
                    }}
                >

                    Available Cars

                </h1>

                <p
                    style={{
                        textAlign:
                            "center",
                        color:
                            "gray",
                        marginBottom:
                            "30px"
                    }}
                >

                    Choose your favourite vehicle and book instantly

                </p>

                <div
                    style={{
                        display:
                            "flex",

                        flexWrap:
                            "wrap",

                        justifyContent:
                            "center",

                        gap:
                            "25px"
                    }}
                >
                                    {
                        variants.map(
                            (variant) => (

                                <div

                                    key={
                                        variant.id
                                    }

                                    style={{

                                        width:
                                            "320px",

                                        backgroundColor:
                                            "white",

                                        borderRadius:
                                            "15px",

                                        overflow:
                                            "hidden",

                                        boxShadow:
                                            "0px 0px 15px rgba(0,0,0,0.15)",

                                        transition:
                                            "0.3s"
                                    }}
                                >

                                    <img

                                        src={
                                            getCarImage(
                                                variant.variantName
                                            )
                                        }

                                        alt="car"

                                        style={{

                                            width:
                                                "100%",

                                            height:
                                                "220px",

                                            objectFit:
                                                "cover"
                                        }}
                                    />

                                    <div
                                        style={{
                                            padding:
                                                "20px"
                                        }}
                                    >

                                        <h2>

                                            🚗 {
                                                variant.variantName
                                            }

                                        </h2>

                                        <p>

                                            <b>
                                                Company:
                                            </b>

                                            {" "}

                                            {
                                                variant
                                                .carCompany
                                                ?.companyName
                                            }

                                        </p>

                                        <p>

                                            <b>
                                                Fuel:
                                            </b>

                                            {" "}

                                            {
                                                variant.fuelType
                                            }

                                        </p>

                                        <p>

                                            <b>
                                                Price:
                                            </b>

                                            {" "}

                                            ₹ {
                                                variant.pricePerDay
                                            }

                                            / Day

                                        </p>

                                        <p>

                                            <b>
                                                Available:
                                            </b>

                                            {" "}

                                            {
                                                variant.availableCars
                                            }

                                        </p>

                                        {
                                            Number(
                                                variant.availableCars
                                            ) > 0 ? (

                                                <div>

                                                    <span
                                                        style={{
                                                            backgroundColor:
                                                                "green",

                                                            color:
                                                                "white",

                                                            padding:
                                                                "5px 10px",

                                                            borderRadius:
                                                                "5px",

                                                            fontSize:
                                                                "12px"
                                                        }}
                                                    >

                                                        Available

                                                    </span>

                                                    <br />
                                                    <br />

                                                    <Link
                                                        to={
                                                            `/booking/${variant.id}`
                                                        }
                                                    >

                                                        <button
                                                            style={{
                                                                width:
                                                                    "100%",

                                                                padding:
                                                                    "12px",

                                                                backgroundColor:
                                                                    "#2563eb",

                                                                color:
                                                                    "white",

                                                                border:
                                                                    "none",

                                                                borderRadius:
                                                                    "8px",

                                                                cursor:
                                                                    "pointer",

                                                                fontWeight:
                                                                    "bold"
                                                            }}
                                                        >

                                                            🚗 Book Now

                                                        </button>

                                                    </Link>

                                                </div>

                                            ) : (

                                                <div>

                                                    <span
                                                        style={{
                                                            backgroundColor:
                                                                "red",

                                                            color:
                                                                "white",

                                                            padding:
                                                                "5px 10px",

                                                            borderRadius:
                                                                "5px",

                                                            fontSize:
                                                                "12px"
                                                        }}
                                                    >

                                                        Not Available

                                                    </span>

                                                    <br />
                                                    <br />

                                                    <button
                                                        disabled

                                                        style={{
                                                            width:
                                                                "100%",

                                                            padding:
                                                                "12px",

                                                            backgroundColor:
                                                                "gray",

                                                            color:
                                                                "white",

                                                            border:
                                                                "none",

                                                            borderRadius:
                                                                "8px",

                                                            cursor:
                                                                "not-allowed"
                                                        }}
                                                    >

                                                        Already Booked

                                                    </button>

                                                </div>

                                            )
                                        }

                                    </div>

                                </div>
                            )
                        )
                    }

                </div>

            </div>

        </div>
    );
}

export default Home;