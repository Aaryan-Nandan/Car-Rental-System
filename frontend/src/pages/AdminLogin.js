import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");


    const handleLogin = (e) => {

        e.preventDefault();

        const loginData = {

            email: email,

            password: password
        };

        axios
            .post(
                "http://localhost:8081/admin/login",
                loginData
            )

            .then((response) => {

                console.log(response.data);

                if (!response.data) {

                    alert(
                        "Invalid Admin Credentials"
                    );

                    return;
                }

                localStorage.setItem(
                    "adminToken",
                    response.data.token
                );

                alert(
                    "Admin Login Successful"
                );

                navigate(
                    "/admin-dashboard"
                );

            })

            .catch(() => {

                alert(
                    "Invalid Admin Credentials"
                );

            });
    };


    return (

        <div
            style={{
                minHeight: "calc(100vh - 90px)",

                backgroundColor: "#f5f5f5",

                display: "flex",

                justifyContent: "center",

                alignItems: "flex-start",

                paddingTop: "55px",

                paddingLeft: "20px",

                paddingRight: "20px",

                boxSizing: "border-box"
            }}
        >

            <div
                style={{
                    width: "100%",

                    maxWidth: "570px",

                    backgroundColor: "white",

                    borderRadius: "14px",

                    padding: "40px 42px",

                    boxSizing: "border-box",

                    boxShadow:
                        "0 4px 18px rgba(0,0,0,0.12)"
                }}
            >

                {/* ADMIN LOGIN HEADING */}

                <h1
                    style={{
                        textAlign: "center",

                        fontSize: "42px",

                        color: "#333",

                        marginTop: "0",

                        marginBottom: "38px",

                        fontWeight: "700"
                    }}
                >
                    Admin Login
                </h1>


                <form
                    onSubmit={handleLogin}
                >

                    {/* EMAIL */}

                    <label
                        style={{
                            display: "block",

                            fontSize: "19px",

                            marginBottom: "9px",

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

                        style={{
                            width: "100%",

                            height: "54px",

                            padding: "0 14px",

                            fontSize: "17px",

                            border:
                                "1px solid #ccc",

                            borderRadius: "7px",

                            boxSizing:
                                "border-box",

                            outline: "none",

                            marginBottom: "24px"
                        }}
                    />


                    {/* PASSWORD */}

                    <label
                        style={{
                            display: "block",

                            fontSize: "19px",

                            marginBottom: "9px",

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

                        style={{
                            width: "100%",

                            height: "54px",

                            padding: "0 14px",

                            fontSize: "17px",

                            border:
                                "1px solid #ccc",

                            borderRadius: "7px",

                            boxSizing:
                                "border-box",

                            outline: "none",

                            marginBottom: "30px"
                        }}
                    />


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"

                        style={{
                            width: "100%",

                            height: "60px",

                            backgroundColor:
                                "black",

                            color: "white",

                            border: "none",

                            borderRadius: "7px",

                            fontSize: "20px",

                            fontWeight: "500",

                            cursor: "pointer"
                        }}
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AdminLogin;