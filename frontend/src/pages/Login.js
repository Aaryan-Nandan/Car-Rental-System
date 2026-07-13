import React, { useState } from "react";
import axios from "axios";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginUser = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:8081/customer/login",
                {
                    email: email,
                    password: password
                }
            );

            console.log(response.data);

            alert("Login Successful");

        } catch (error) {

            console.log(error);

            alert("Invalid Credentials");
        }
    };

    return (

        <div style={{padding: "20px"}}>

            <h2>Customer Login</h2>

            <form onSubmit={loginUser}>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br /><br />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
}

export default Login;