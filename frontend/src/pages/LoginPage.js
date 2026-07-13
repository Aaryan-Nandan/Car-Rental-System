import {
    useState
}

from "react";

import {
    useNavigate
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

                // SAVE CUSTOMER ID

                if (
                    response.data.customer
                ) {

                    localStorage.setItem(

                        "customerId",

                        response
                        .data
                        .customer
                        .id
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
                padding: "30px"
            }}
        >

            <h1>

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

                        width: "300px"
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

                        width: "300px"
                    }}
                />

            </div>

            <br />

            <button

                onClick={handleLogin}

                style={{

                    padding: "12px",

                    backgroundColor:
                        "black",

                    color: "white",

                    border: "none",

                    borderRadius:
                        "5px",

                    cursor: "pointer"
                }}
            >

                Login

            </button>

        </div>
    );
}

export default LoginPage;