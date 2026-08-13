import React, { useEffect, useState } from "react";
import axios from "axios";

function ProfilePage() {

    const [customer, setCustomer] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD PROFILE
    // ==========================================

    useEffect(() => {

        fetchProfile();

    }, []);


    const fetchProfile = async () => {

        const customerId =
            localStorage.getItem(
                "customerId"
            );

        const token =
            localStorage.getItem(
                "token"
            );


        console.log(
            "Profile Customer ID:",
            customerId
        );


        // ==========================================
        // CHECK LOGIN
        // ==========================================

        if (!customerId || !token) {

            setError(
                "Customer login information not found."
            );

            setLoading(false);

            return;
        }


        try {

            const response =
                await axios.get(

                    `http://localhost:8081/customer/${customerId}`,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }

                );


            console.log(
                "Profile Response:",
                response.data
            );


            setCustomer(
                response.data
            );

        }

        catch (error) {

            console.error(
                "Profile Error:",
                error
            );


            setError(
                "Unable to load profile."
            );

        }

        finally {

            setLoading(false);

        }
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
                    Loading Profile...
                </h2>
            </div>

        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

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
                    {error}
                </h2>

            </div>

        );
    }


    // ==========================================
    // PROFILE
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
                        "650px",

                    margin:
                        "0 auto",

                    backgroundColor:
                        "white",

                    padding:
                        "35px",

                    borderRadius:
                        "14px",

                    boxShadow:
                        "0 4px 18px rgba(0,0,0,0.10)"
                }}
            >

                <h1
                    style={{
                        textAlign:
                            "center",

                        marginTop:
                            "0",

                        marginBottom:
                            "35px"
                    }}
                >
                    My Profile
                </h1>


                <div>

                    <p>
                        <b>
                            Name:
                        </b>

                        {" "}

                        {customer?.name ||
                            "Not available"}
                    </p>


                    <p>
                        <b>
                            Email:
                        </b>

                        {" "}

                        {customer?.email ||
                            "Not available"}
                    </p>


                    <p>
                        <b>
                            Phone:
                        </b>

                        {" "}

                        {customer?.phone ||
                            "Not available"}
                    </p>

                </div>

            </div>

        </div>
    );
}

export default ProfilePage;