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

    const [email,
        setEmail] =
            useState("");

    const [password,
        setPassword] =
            useState("");

    const handleLogin = () => {

        if (!email) {

            alert(
                "Please enter email"
            );

            return;
        }

        if (!password) {

            alert(
                "Please enter password"
            );

            return;
        }

        const loginData = {

            email: email,

            password: password
        };

        axios

            .post(

                "http://localhost:8081/customer/login",

                loginData

            )

            .then((response) => {

                console.log(
                    response.data
                );

                localStorage.setItem(

                    "token",

                    response.data.token

                );

                if (
                    response.data.customer
                ) {

                    localStorage.setItem(

                        "customerId",

                        response.data.customer.id

                    );
                }

                alert(
                    "Login Successful"
                );

                navigate(
                    "/my-bookings"
                );

            })

            .catch((error) => {

                console.log(error);

                alert(
                    "Invalid Email or Password"
                );

            });

    };

    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "400px",
                margin: "40px auto",
                boxShadow: "0 0 10px lightgray",
                borderRadius: "10px",
                backgroundColor: "white"
            }}
        >

            <h1
                style={{
                    textAlign: "center"
                }}
            >

                Customer Login

            </h1>

            <br />

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
                        padding: "10px",
                        width: "100%"
                    }}

                />

            </div>

            <br />

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

                    style={{
                        padding: "10px",
                        width: "100%"
                    }}

                />

            </div>

            <div
                style={{
                    textAlign: "right",
                    marginTop: "10px"
                }}
            >

                <Link

                    to="/forgot-password"

                    style={{
                        color: "#1976d2",
                        textDecoration: "none",
                        fontSize: "14px"
                    }}

                >

                    Forgot Password?

                </Link>

            </div>

            <br />

            <button

                onClick={handleLogin}

                style={{

                    width: "100%",

                    padding: "12px",

                    backgroundColor:
                        "black",

                    color:
                        "white",

                    border:
                        "none",

                    borderRadius:
                        "5px",

                    cursor:
                        "pointer",

                    fontSize:
                        "16px"

                }}

            >

                Login

            </button>

        </div>

    );

}

export default LoginPage;