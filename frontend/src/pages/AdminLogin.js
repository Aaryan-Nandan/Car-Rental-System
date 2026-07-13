import { useState }

from "react";

import axios from "axios";

import { useNavigate }

from "react-router-dom";

function AdminLogin() {

    const navigate =
        useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const handleLogin = () => {

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
                padding: "30px"
            }}
        >

            <h1>

                Admin Login

            </h1>

            <br />

            <input
                type="email"

                placeholder="Enter Email"

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

            <br />
            <br />

            <input
                type="password"

                placeholder="Enter Password"

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

            <br />
            <br />

            <button

                onClick={handleLogin}

                style={{
                    padding: "12px",

                    backgroundColor:
                        "black",

                    color: "white",

                    border: "none"
                }}
            >

                Login

            </button>

        </div>
    );
}

export default AdminLogin;