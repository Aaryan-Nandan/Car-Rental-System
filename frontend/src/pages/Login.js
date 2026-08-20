import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // =====================================================
    // LOGIN
    // =====================================================

    const loginUser = async (e) => {

        e.preventDefault();

        if (!email.trim()) {
            alert("Please enter your email");
            return;
        }

        if (!password.trim()) {
            alert("Please enter your password");
            return;
        }

        try {

            const response = await axios.post(
                `${API_URL}/customer/login`,
                {
                    email: email,
                    password: password
                }
            );

            console.log("Login Response:", response.data);

            // =================================================
            // SAVE CUSTOMER INFORMATION
            // =================================================

            if (response.data.id) {

                localStorage.setItem(
                    "customerId",
                    response.data.id
                );
            }

            if (response.data.token) {

                localStorage.setItem(
                    "token",
                    response.data.token
                );
            }

            if (response.data.email) {

                localStorage.setItem(
                    "customerEmail",
                    response.data.email
                );
            }

            // =================================================
            // LOGIN SUCCESS
            // =================================================

            alert("Login Successful");

            navigate("/");

        }
        catch (error) {

            console.error(
                "Login Error:",
                error
            );

            if (
                error.response &&
                error.response.data
            ) {

                if (
                    typeof error.response.data ===
                    "string"
                ) {

                    alert(
                        error.response.data
                    );

                }
                else {

                    alert(
                        "Invalid Credentials"
                    );

                }

            }
            else {

                alert(
                    "Unable to connect to server"
                );

            }
        }
    };


    // =====================================================
    // OPEN REGISTER PAGE
    // =====================================================

    const openRegister = () => {

        navigate("/register");

    };


    // =====================================================
    // OPEN FORGOT PASSWORD
    // =====================================================

    const openForgotPassword = () => {

        navigate("/forgot-password");

    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div
            style={{
                minHeight: "calc(100vh - 80px)",
                width: "100%",
                backgroundColor: "#f5f5f5",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                padding: "40px 20px",
                boxSizing: "border-box"
            }}
        >

            {/* =================================================
                LOGIN CARD
            ================================================= */}

            <div
                style={{
                    width: "100%",
                    maxWidth: "570px",

                    backgroundColor: "#ffffff",

                    padding: "42px",

                    borderRadius: "14px",

                    boxShadow:
                        "0 4px 20px rgba(0,0,0,0.12)",

                    boxSizing: "border-box"
                }}
            >

                {/* =================================================
                    TITLE
                ================================================= */}

                <h2
                    style={{
                        textAlign: "center",

                        fontSize: "38px",

                        fontWeight: "700",

                        color: "#333333",

                        marginTop: "0",

                        marginBottom: "42px"
                    }}
                >
                    Customer Login
                </h2>


                {/* =================================================
                    LOGIN FORM
                ================================================= */}

                <form onSubmit={loginUser}>


                    {/* =================================================
                        EMAIL
                    ================================================= */}

                    <label
                        style={{
                            display: "block",

                            fontSize: "18px",

                            color: "#333333",

                            marginBottom: "8px"
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

                        autoComplete="email"

                        style={{
                            width: "100%",

                            height: "54px",

                            padding:
                                "0 15px",

                            fontSize: "17px",

                            border:
                                "1px solid #cccccc",

                            borderRadius: "7px",

                            outline: "none",

                            boxSizing:
                                "border-box"
                        }}
                    />


                    {/* =================================================
                        PASSWORD
                    ================================================= */}

                    <label
                        style={{
                            display: "block",

                            fontSize: "18px",

                            color: "#333333",

                            marginTop: "25px",

                            marginBottom: "8px"
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

                        autoComplete="current-password"

                        style={{
                            width: "100%",

                            height: "54px",

                            padding:
                                "0 15px",

                            fontSize: "17px",

                            border:
                                "1px solid #cccccc",

                            borderRadius: "7px",

                            outline: "none",

                            boxSizing:
                                "border-box"
                        }}
                    />


                    {/* =================================================
                        FORGOT PASSWORD + REGISTER
                    ================================================= */}

                    <div
                        style={{
                            width: "100%",

                            display: "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

                            marginTop: "18px",

                            marginBottom: "27px"
                        }}
                    >


                        {/* LEFT:
                            FORGOT PASSWORD
                        */}

                        <button
                            type="button"

                            onClick={
                                openForgotPassword
                            }

                            style={{
                                border: "none",

                                background:
                                    "transparent",

                                padding: "0",

                                margin: "0",

                                color: "#1976d2",

                                fontSize: "16px",

                                fontWeight: "600",

                                cursor: "pointer"
                            }}
                        >
                            Forgot Password?
                        </button>


                        {/* RIGHT:
                            REGISTER
                        */}

                        <button
                            type="button"

                            onClick={
                                openRegister
                            }

                            style={{
                                border: "none",

                                background:
                                    "transparent",

                                padding: "0",

                                margin: "0",

                                color: "#1976d2",

                                fontSize: "16px",

                                fontWeight: "600",

                                cursor: "pointer"
                            }}
                        >
                            Register
                        </button>

                    </div>


                    {/* =================================================
                        LOGIN BUTTON
                    ================================================= */}

                    <button
                        type="submit"

                        style={{
                            display: "block",

                            width: "100%",

                            height: "55px",

                            backgroundColor:
                                "#000000",

                            color: "#ffffff",

                            border: "none",

                            borderRadius: "7px",

                            fontSize: "18px",

                            fontWeight: "600",

                            cursor: "pointer",

                            margin: "0"
                        }}
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;