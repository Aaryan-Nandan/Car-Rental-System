import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // =========================================================
    // ADMIN LOGIN
    // =========================================================

    const handleLogin = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }

        const loginData = {
            email: email,
            password: password
        };

        setLoading(true);

        try {

            const response =
                await axios.post(
                    "http://localhost:8081/admin/login",
                    loginData
                );

            console.log(
                "ADMIN LOGIN RESPONSE:",
                response.data
            );


            // =================================================
            // VALIDATE RESPONSE
            // =================================================

            if (
                !response.data ||
                !response.data.token
            ) {

                alert(
                    "Invalid Admin Credentials"
                );

                return;
            }


            // =================================================
            // CLEAR CUSTOMER SESSION
            // =================================================

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "customerId"
            );

            localStorage.removeItem(
                "customerEmail"
            );

            localStorage.removeItem(
                "customerName"
            );


            // =================================================
            // SAVE ADMIN SESSION
            // =================================================

            localStorage.setItem(
                "adminToken",
                response.data.token
            );


            // Optional admin information
            if (response.data.email) {

                localStorage.setItem(
                    "adminEmail",
                    response.data.email
                );

            }


            console.log(
                "Admin token saved:",
                localStorage.getItem(
                    "adminToken"
                )
            );


            // =================================================
            // SUCCESS
            // =================================================

            alert(
                "Admin Login Successful"
            );


            navigate(
                "/admin-dashboard"
            );

        }

        catch (error) {

            console.error(
                "ADMIN LOGIN ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Invalid Admin Credentials"
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div
            style={{
                minHeight:
                    "calc(100vh - 90px)",

                backgroundColor:
                    "#f5f5f5",

                display: "flex",

                justifyContent:
                    "center",

                alignItems:
                    "flex-start",

                paddingTop: "55px",

                paddingLeft: "20px",

                paddingRight: "20px",

                boxSizing:
                    "border-box"
            }}
        >

            <div
                style={{
                    width: "100%",

                    maxWidth: "570px",

                    backgroundColor:
                        "white",

                    borderRadius: "14px",

                    padding:
                        "40px 42px",

                    boxSizing:
                        "border-box",

                    boxShadow:
                        "0 4px 18px rgba(0,0,0,0.12)"
                }}
            >

                {/* =================================================
                    ADMIN LOGIN HEADING
                ================================================= */}

                <h1
                    style={{
                        textAlign: "center",

                        fontSize: "42px",

                        color: "#333",

                        marginTop: "0",

                        marginBottom:
                            "38px",

                        fontWeight: "700"
                    }}
                >
                    Admin Login
                </h1>


                {/* =================================================
                    LOGIN FORM
                ================================================= */}

                <form
                    onSubmit={
                        handleLogin
                    }
                >

                    {/* EMAIL */}

                    <label
                        style={{
                            display: "block",

                            fontSize: "19px",

                            marginBottom:
                                "9px",

                            color: "#222"
                        }}
                    >
                        Email
                    </label>


                    <input
                        type="email"

                        placeholder="Enter Email"

                        value={email}

                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }

                        required

                        disabled={loading}

                        autoComplete="email"

                        style={{
                            width: "100%",

                            height: "54px",

                            padding:
                                "0 14px",

                            fontSize: "17px",

                            border:
                                "1px solid #ccc",

                            borderRadius: "7px",

                            boxSizing:
                                "border-box",

                            outline: "none",

                            marginBottom:
                                "24px",

                            backgroundColor:
                                loading
                                    ? "#f5f5f5"
                                    : "white"
                        }}
                    />


                    {/* PASSWORD */}

                    <label
                        style={{
                            display: "block",

                            fontSize: "19px",

                            marginBottom:
                                "9px",

                            color: "#222"
                        }}
                    >
                        Password
                    </label>


                    <input
                        type="password"

                        placeholder="Enter Password"

                        value={password}

                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }

                        required

                        disabled={loading}

                        autoComplete="current-password"

                        style={{
                            width: "100%",

                            height: "54px",

                            padding:
                                "0 14px",

                            fontSize: "17px",

                            border:
                                "1px solid #ccc",

                            borderRadius: "7px",

                            boxSizing:
                                "border-box",

                            outline: "none",

                            marginBottom:
                                "30px",

                            backgroundColor:
                                loading
                                    ? "#f5f5f5"
                                    : "white"
                        }}
                    />


                    {/* =================================================
                        LOGIN BUTTON
                    ================================================= */}

                    <button
                        type="submit"

                        disabled={loading}

                        style={{
                            width: "100%",

                            height: "60px",

                            backgroundColor:
                                loading
                                    ? "#64748b"
                                    : "#000000",

                            color: "white",

                            border: "none",

                            borderRadius: "7px",

                            fontSize: "20px",

                            fontWeight: "600",

                            cursor:
                                loading
                                    ? "not-allowed"
                                    : "pointer",

                            transition:
                                "0.2s"
                        }}
                    >

                        {loading
                            ? "Logging in..."
                            : "Admin Login"}

                    </button>

                </form>

            </div>

        </div>

    );

}

export default AdminLogin;