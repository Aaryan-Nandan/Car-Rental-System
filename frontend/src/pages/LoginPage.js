import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

function LoginPage() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loginUser = async (e) => {

        e.preventDefault();

        setError("");

        if (!email.trim()) {

            setError("Please enter your email.");
            return;
        }

        if (!password.trim()) {

            setError("Please enter your password.");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                `${API_URL}/customer/login`,
                {
                    email: email.trim(),
                    password: password
                }
            );

            console.log("LOGIN RESPONSE:");
            console.log(response.data);

            const data = response.data;

            if (!data) {

                setError(
                    "Invalid email or password."
                );

                return;
            }


            // ==========================================
            // GET TOKEN
            // ==========================================

            const token = data.token;


            // ==========================================
            // GET CUSTOMER ID
            // ==========================================

            const customerId =
                data.customerId;


            // ==========================================
            // GET CUSTOMER EMAIL
            // ==========================================

            const customerEmail =
                data.customerEmail || email.trim();


            console.log(
                "Token:",
                token
            );

            console.log(
                "Customer ID:",
                customerId
            );

            console.log(
                "Customer Email:",
                customerEmail
            );


            // ==========================================
            // CHECK LOGIN RESPONSE
            // ==========================================

            if (!token) {

                setError(
                    "Login failed. Token was not received."
                );

                return;
            }


            if (
                customerId === null ||
                customerId === undefined
            ) {

                setError(
                    "Login successful, but Customer ID was not received from backend."
                );

                console.error(
                    "AuthResponse does not contain customerId:",
                    data
                );

                return;
            }


            // ==========================================
            // CLEAR OLD CUSTOMER DATA
            // ==========================================

            localStorage.removeItem(
                "customerId"
            );

            localStorage.removeItem(
                "customerEmail"
            );

            localStorage.removeItem(
                "token"
            );


            // ==========================================
            // SAVE NEW CUSTOMER DATA
            // ==========================================

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "customerId",
                String(customerId)
            );

            localStorage.setItem(
                "customerEmail",
                customerEmail
            );


            // ==========================================
            // VERIFY LOCAL STORAGE
            // ==========================================

            console.log(
                "Saved customerId:",
                localStorage.getItem(
                    "customerId"
                )
            );

            console.log(
                "Saved customerEmail:",
                localStorage.getItem(
                    "customerEmail"
                )
            );


            alert(
                "Login Successful"
            );


            // ==========================================
            // GO TO HOME
            // ==========================================

            navigate("/");

        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            if (
                error.response &&
                error.response.status === 401
            ) {

                setError(
                    "Invalid email or password."
                );

            } else {

                setError(
                    "Unable to login. Please check whether the backend is running."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (

        <div
            style={{
                minHeight: "calc(100vh - 90px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingTop: "60px",
                backgroundColor: "#f5f5f5"
            }}
        >

            <div
                style={{
                    width: "500px",
                    maxWidth: "90%",
                    backgroundColor: "white",
                    padding: "40px",
                    borderRadius: "14px",
                    boxShadow:
                        "0 5px 25px rgba(0,0,0,0.12)"
                }}
            >

                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "35px",
                        color: "#333"
                    }}
                >
                    Customer Login
                </h1>


                {error && (

                    <div
                        style={{
                            backgroundColor: "#ffe5e5",
                            color: "#d00000",
                            padding: "12px",
                            borderRadius: "7px",
                            marginBottom: "20px",
                            textAlign: "center"
                        }}
                    >
                        {error}
                    </div>

                )}


                <form
                    onSubmit={loginUser}
                >

                    {/* EMAIL */}

                    <label
                        style={{
                            display: "block",
                            fontSize: "18px",
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
                            setEmail(e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "14px",
                            fontSize: "16px",
                            border:
                                "1px solid #ccc",
                            borderRadius: "7px",
                            marginBottom: "20px"
                        }}
                    />


                    {/* PASSWORD */}

                    <label
                        style={{
                            display: "block",
                            fontSize: "18px",
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
                            setPassword(e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "14px",
                            fontSize: "16px",
                            border:
                                "1px solid #ccc",
                            borderRadius: "7px"
                        }}
                    />


                    {/* FORGOT + REGISTER */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            marginTop: "18px",
                            marginBottom: "25px"
                        }}
                    >

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/forgot-password"
                                )
                            }
                            style={{
                                border: "none",
                                background:
                                    "transparent",
                                color: "#1976d2",
                                cursor: "pointer",
                                fontSize: "16px",
                                padding: "0"
                            }}
                        >
                            Forgot Password?
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/register"
                                )
                            }
                            style={{
                                border: "none",
                                background:
                                    "transparent",
                                color: "#1976d2",
                                cursor: "pointer",
                                fontSize: "16px",
                                padding: "0"
                            }}
                        >
                            Register
                        </button>

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            backgroundColor:
                                loading
                                    ? "#777"
                                    : "black",
                            color: "white",
                            border: "none",
                            borderRadius: "7px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            cursor:
                                loading
                                    ? "not-allowed"
                                    : "pointer"
                        }}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </button>

                </form>

            </div>

        </div>
    );
}

export default LoginPage;