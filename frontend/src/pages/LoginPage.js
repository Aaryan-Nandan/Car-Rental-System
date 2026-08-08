import {
    useState
}
from "react";

import {
    useNavigate,
    Link
}
from "react-router-dom";

import axios from "axios";


function LoginPage() {


    const navigate =
        useNavigate();


    const [email, setEmail] =
        useState("");


    const [password, setPassword] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // LOGIN
    // ==========================================

    const handleLogin = () => {


        // ======================================
        // EMAIL VALIDATION
        // ======================================

        if (!email.trim()) {

            alert(
                "Please enter email"
            );

            return;
        }


        // ======================================
        // PASSWORD VALIDATION
        // ======================================

        if (!password) {

            alert(
                "Please enter password"
            );

            return;
        }


        // ======================================
        // PREVENT DOUBLE CLICK
        // ======================================

        if (loading) {

            return;
        }


        setLoading(true);


        // ======================================
        // REMOVE OLD LOGIN DATA
        // ======================================

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "customerId"
        );


        const loginData = {

            email: email.trim(),

            password: password

        };


        // ======================================
        // LOGIN REQUEST
        // ======================================

        axios

            .post(

                "http://localhost:8081/customer/login",

                loginData

            )

            .then(

                (response) => {


                    console.log(
                        "Login Response:",
                        response.data
                    );


                    // ==================================
                    // CHECK RESPONSE
                    // ==================================

                    if (

                        !response.data

                        ||

                        !response.data.token

                    ) {

                        alert(
                            "Invalid Email or Password"
                        );

                        return;
                    }


                    // ==================================
                    // SAVE JWT TOKEN
                    // ==================================

                    localStorage.setItem(

                        "token",

                        response.data.token

                    );


                    // ==================================
                    // SAVE CUSTOMER ID
                    // ==================================

                    if (

                        response.data.customer

                        &&

                        response.data.customer.id

                    ) {

                        localStorage.setItem(

                            "customerId",

                            response.data.customer.id

                        );

                    }


                    // ==================================
                    // LOGIN SUCCESS
                    // ==================================

                    alert(
                        "Login Successful"
                    );


                    navigate(
                        "/my-bookings"
                    );

                }

            )

            .catch(

                (error) => {


                    console.log(
                        "Login Error:",
                        error
                    );


                    // ==================================
                    // REMOVE AUTH DATA
                    // ==================================

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "customerId"
                    );


                    // ==================================
                    // SHOW CORRECT ERROR
                    // ==================================

                    if (

                        error.response

                        &&

                        error.response.status === 401

                    ) {

                        alert(
                            "Invalid Email or Password"
                        );

                    }

                    else if (

                        error.response

                        &&

                        error.response.status === 403

                    ) {

                        alert(
                            "Login Access Denied"
                        );

                    }

                    else {

                        alert(
                            "Unable To Login. Please try again."
                        );

                    }

                }

            )

            .finally(

                () => {

                    setLoading(false);

                }

            );

    };


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div

            style={{

                padding: "30px",

                maxWidth: "400px",

                margin: "40px auto",

                boxShadow:
                    "0 0 10px lightgray",

                borderRadius: "10px",

                backgroundColor:
                    "white"

            }}

        >


            <h1

                style={{

                    textAlign:
                        "center"

                }}

            >

                Customer Login

            </h1>


            <br />


            {/* ==================================
                EMAIL
            ================================== */}

            <div>

                <label>

                    Email

                </label>


                <br />


                <input

                    type="email"

                    value={email}

                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }

                    style={{

                        padding:
                            "10px",

                        width:
                            "100%",

                        boxSizing:
                            "border-box"

                    }}

                />

            </div>


            <br />


            {/* ==================================
                PASSWORD
            ================================== */}

            <div>

                <label>

                    Password

                </label>


                <br />


                <input

                    type="password"

                    value={password}

                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }

                    onKeyDown={(e) => {

                        if (
                            e.key === "Enter"
                        ) {

                            handleLogin();

                        }

                    }}

                    style={{

                        padding:
                            "10px",

                        width:
                            "100%",

                        boxSizing:
                            "border-box"

                    }}

                />

            </div>


            {/* ==================================
                FORGOT PASSWORD
            ================================== */}

            <div

                style={{

                    textAlign:
                        "right",

                    marginTop:
                        "10px"

                }}

            >

                <Link

                    to="/forgot-password"

                    style={{

                        color:
                            "#1976d2",

                        textDecoration:
                            "none",

                        fontSize:
                            "14px"

                    }}

                >

                    Forgot Password?

                </Link>

            </div>


            <br />


            {/* ==================================
                LOGIN BUTTON
            ================================== */}

            <button

                onClick={
                    handleLogin
                }

                disabled={
                    loading
                }

                style={{

                    width:
                        "100%",

                    padding:
                        "12px",

                    backgroundColor:
                        loading
                            ? "gray"
                            : "black",

                    color:
                        "white",

                    border:
                        "none",

                    borderRadius:
                        "5px",

                    cursor:
                        loading
                            ? "not-allowed"
                            : "pointer",

                    fontSize:
                        "16px"

                }}

            >

                {
                    loading
                        ? "Logging In..."
                        : "Login"
                }

            </button>


        </div>

    );

}


export default LoginPage;