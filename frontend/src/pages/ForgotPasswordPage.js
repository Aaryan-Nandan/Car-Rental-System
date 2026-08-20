import { useState } from "react";
import axios from "axios";
import API_URL from "../config";

function ForgotPasswordPage() {

    const [email, setEmail] =
        useState("");

    const [otp, setOtp] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [otpSent, setOtpSent] =
        useState(false);

    const [otpVerified, setOtpVerified] =
        useState(false);

    const sendOtp = () => {

        if (!email) {

            alert("Enter Email");

            return;
        }

        axios

            .post(
                `${API_URL}/forgot-password/send-otp`,
                {
                    email: email
                }
            )

            .then((response) => {

                alert(response.data);

                if (response.data === "OTP Sent Successfully") {

                    setOtpSent(true);

                }

            })

            .catch(() => {

                alert("Unable To Send OTP");

            });

    };

    const verifyOtp = () => {

        if (!otp) {

            alert("Enter OTP");

            return;
        }

        axios

            .post(
                `${API_URL}/forgot-password/verify-otp`,
                {
                    email: email,
                    otp: otp
                }
            )

            .then((response) => {

                alert(response.data);

                if (response.data === "OTP Verified") {

                    setOtpVerified(true);

                }

            })

            .catch(() => {

                alert("Invalid OTP");

            });

    };

    const resetPassword = () => {

        if (!newPassword) {

            alert("Enter New Password");

            return;
        }

        axios

            .post(
                `${API_URL}/forgot-password/reset-password`,
                {
                    email: email,
                    otp: otp,
                    newPassword: newPassword
                }
            )

            .then((response) => {

                alert(response.data);

                if (response.data === "Password Reset Successfully") {

                    window.location.href = "/login";

                }

            })

            .catch(() => {

                alert("Unable To Reset Password");

            });

    };

    return (

        <div
            style={{
                width: "420px",
                margin: "60px auto",
                padding: "30px",
                border: "1px solid lightgray",
                borderRadius: "10px",
                boxShadow: "0 0 10px lightgray",
                backgroundColor: "white"
            }}
        >

            <h2
                style={{
                    textAlign: "center"
                }}
            >

                Forgot Password

            </h2>

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
                    width: "100%",
                    padding: "12px",
                    marginBottom: "15px"
                }}

            />

            {

                !otpSent &&

                <button

                    onClick={sendOtp}

                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        cursor: "pointer"
                    }}

                >

                    Send OTP

                </button>

            }

            {

                otpSent && !otpVerified &&

                <>

                    <br /><br />

                    <input

                        type="text"

                        placeholder="Enter OTP"

                        value={otp}

                        onChange={(e) =>
                            setOtp(
                                e.target.value
                            )
                        }

                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "15px"
                        }}

                    />

                    <button

                        onClick={verifyOtp}

                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            cursor: "pointer"
                        }}

                    >

                        Verify OTP

                    </button>

                </>

            }

            {

                otpVerified &&

                <>

                    <br /><br />

                    <input

                        type="password"

                        placeholder="Enter New Password"

                        value={newPassword}

                        onChange={(e) =>
                            setNewPassword(
                                e.target.value
                            )
                        }

                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "15px"
                        }}

                    />

                    <button

                        onClick={resetPassword}

                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#FF9800",
                            color: "white",
                            border: "none",
                            cursor: "pointer"
                        }}

                    >

                        Reset Password

                    </button>

                </>

            }

        </div>

    );

}

export default ForgotPasswordPage;