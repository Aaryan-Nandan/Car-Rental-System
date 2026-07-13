import { useState }

from "react";

import axios from "axios";

function RegisterPage() {

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const handleRegister = () => {

        if (!name) {

            alert(
                "Please enter name"
            );

            return;
        }

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

        if (!phone) {

            alert(
                "Please enter phone"
            );

            return;
        }

        const customerData = {

            name: name,

            email: email,

            password: password,

            phone: phone
        };

        axios

            .post(
                "http://localhost:8081/customer/register",

                customerData
            )

            .then(() => {

                alert(
                    "Registration Successful"
                );
            })

            .catch(() => {

                alert(
                    "Registration Failed"
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

                Customer Register

            </h1>

            <br />

            <div>

                <label>

                    Name

                </label>

                <br />

                <input
                    type="text"

                    value={name}

                    onChange={(e) =>
                        setName(
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

            <div>

                <label>

                    Phone

                </label>

                <br />

                <input
                    type="text"

                    value={phone}

                    onChange={(e) =>
                        setPhone(
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

                onClick={handleRegister}

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

                Register

            </button>

        </div>
    );
}

export default RegisterPage;