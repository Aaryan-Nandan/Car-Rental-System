import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import OtpInput from "../components/OtpInput";
import PasswordStrength from "../components/PasswordStrength";
import LoadingSpinner from "../components/LoadingSpinner";

function RegisterPage() {

    const navigate =
        useNavigate();

    // ============================
    // User Information
    // ============================

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [password, setPassword] =
        useState("");

    // ============================
    // OTP
    // ============================

    const [otp, setOtp] =
        useState([
            "",
            "",
            "",
            "",
            "",
            ""
        ]);

    const [otpSent,
        setOtpSent] =
        useState(false);

    const [otpVerified,
        setOtpVerified] =
        useState(false);

    // ============================
    // UI
    // ============================

    const [loading,
        setLoading] =
        useState(false);

    const [showPassword,
        setShowPassword] =
        useState(false);

    // ============================
    // Countdown Timers
    // ============================

    const [resendTimer,
        setResendTimer] =
        useState(60);

    const [otpExpiryTimer,
        setOtpExpiryTimer] =
        useState(300);

    // ============================
    // Validation
    // ============================

    const [emailValid,
        setEmailValid] =
        useState(false);

    const [phoneValid,
        setPhoneValid] =
        useState(false);

    // ============================
    // Timer
    // ============================

    useEffect(() => {

    let resendInterval;

    let expiryInterval;

    if (otpSent && resendTimer > 0) {

        resendInterval = setInterval(() => {

            setResendTimer(

                prev => prev - 1

            );

        }, 1000);

    }

    if (otpSent && otpExpiryTimer > 0) {

        expiryInterval = setInterval(() => {

            setOtpExpiryTimer((prev) => {

                if (prev <= 1) {

                    clearInterval(expiryInterval);

                    alert(

                        "OTP Expired. Please Resend OTP."

                    );

                    setOtpVerified(false);

                    setOtpSent(false);

                    setOtp([

                        "",

                        "",

                        "",

                        "",

                        "",

                        ""

                    ]);

                    setResendTimer(60);

                    return 300;

                }

                return prev - 1;

            });

        }, 1000);

    }

    return () => {

        if (resendInterval) {

            clearInterval(resendInterval);

        }

        if (expiryInterval) {

            clearInterval(expiryInterval);

        }

    };

}, [

    otpSent,

    resendTimer,

    otpExpiryTimer

]);
    // ============================
    // Email Validation
    // ============================

    useEffect(() => {

        const regex =

            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        setEmailValid(

            regex.test(email)

        );

    }, [email]);

    // ============================
    // Phone Validation
    // ============================

    useEffect(() => {

        const regex =

            /^[6-9]\d{9}$/;

        setPhoneValid(

            regex.test(phone)

        );

    }, [phone]);

        // ====================================
    // SEND OTP
    // ====================================

    const sendOtp = () => {

        if (!name.trim()) {

            alert("Enter Name");

            return;

        }

        if (!emailValid) {

            alert("Enter Valid Email");

            return;

        }

        if (!phoneValid) {

            alert("Enter Valid Mobile Number");

            return;

        }

        if (!password) {

            alert("Enter Password");

            return;

        }

        setLoading(true);

        axios

            .post(

                "http://localhost:8081/customer/send-registration-otp",

                {

                    email: email

                }

            )

             .then((response) => {

    setLoading(false);

    alert(response.data.message);

    if (response.data.success) {

        setOtpSent(true);

        setResendTimer(60);

        setOtpExpiryTimer(300);

    }

})

            .catch((error) => {

                setLoading(false);

                if (

                    error.response

                ) {

                    alert(

                        error.response.data.message

                    );

                }

                else {

                    alert(

                        "Unable To Send OTP"

                    );

                }

            });

    };

    // ====================================
    // VERIFY OTP
    // ====================================

    const verifyOtp = () => {

        const enteredOtp =

            otp.join("");

        if (

            enteredOtp.length !== 6

        ) {

            alert(

                "Enter Complete OTP"

            );

            return;

        }

        setLoading(true);

        axios

            .post(

                "http://localhost:8081/customer/verify-registration-otp",

                {

                    email: email,

                    otp: enteredOtp

                }

            )

            
.then((response) => {

    setLoading(false);

    alert(response.data.message);

    if (response.data.success) {

        setOtpVerified(true);

    }

})

.catch((error) => {

    setLoading(false);

    if (error.response) {

        alert(error.response.data.message);

    } else {

        alert("Server Error");

    }

});

    };

    // ====================================
    // REGISTER
    // ====================================

    const registerCustomer = () => {

        if (!otpVerified) {

            alert(

                "Please Verify OTP"

            );

            return;

        }

        setLoading(true);

        axios

            .post(

                "http://localhost:8081/customer/register-with-otp",

                {

                    name: name,

                    email: email,

                    phone: phone,

                    password: password,

                    otp: otp.join("")

                }

            )

.then((response) => {

    setLoading(false);

    alert(response.data.message);

    if (response.data.success) {

        navigate("/registration-success");

    }

})

           .catch((error) => {

    setLoading(false);

    if (error.response) {

        alert(error.response.data.message);

    } else {

        alert("Registration Failed");

    }

});

    };

    // ====================================
    // RESEND OTP
    // ====================================

    const resendOtp = () => {

        if (

            resendTimer > 0

        ) {

            return;

        }

        sendOtp();

    };

        return (

        <div

            style={{

                backgroundColor: "#f5f5f5",

                minHeight: "100vh",

                display: "flex",

                justifyContent: "center",

                alignItems: "center",

                padding: "30px"

            }}

        >

            <div

                style={{

                    width: "500px",

                    backgroundColor: "white",

                    padding: "35px",

                    borderRadius: "15px",

                    boxShadow: "0px 0px 20px lightgray"

                }}

            >

                <h1

                    style={{

                        textAlign: "center",

                        marginBottom: "30px",

                        color: "#1976D2"

                    }}

                >

                    Create Account

                </h1>

                <label>

                    Full Name

                </label>

                <input

                    type="text"

                    placeholder="Enter Full Name"

                    value={name}

                    onChange={(e)=>

                        setName(

                            e.target.value

                        )

                    }

                    style={{

                        width:"100%",

                        padding:"12px",

                        marginTop:"5px",

                        marginBottom:"15px"

                    }}

                />

                <label>

                    Email Address

                </label>

                <input

                    type="email"

                    placeholder="Enter Email"

                    disabled={otpSent}

                    value={email}

                    onChange={(e)=>

                        setEmail(

                            e.target.value

                        )

                    }

                    style={{

                        width:"100%",

                        padding:"12px",

                        marginTop:"5px"

                    }}

                />

                {

                    email.length>0 &&

                    <p

                        style={{

                            color:

                            emailValid

                            ?

                            "green"

                            :

                            "red",

                            fontWeight:"bold",

                            marginTop:"5px"

                        }}

                    >

                        {

                            emailValid

                            ?

                            "✅ Valid Email"

                            :

                            "❌ Invalid Email"

                        }

                    </p>

                }

                <br/>

                <label>

                    Mobile Number

                </label>

                <input

                    type="text"

                    placeholder="Enter Mobile"

                    value={phone}

                    onChange={(e)=>

                        setPhone(

                            e.target.value

                        )

                    }

                    style={{

                        width:"100%",

                        padding:"12px",

                        marginTop:"5px"

                    }}

                />

                {

                    phone.length>0 &&

                    <p

                        style={{

                            color:

                            phoneValid

                            ?

                            "green"

                            :

                            "red",

                            fontWeight:"bold",

                            marginTop:"5px"

                        }}

                    >

                        {

                            phoneValid

                            ?

                            "✅ Valid Mobile Number"

                            :

                            "❌ Invalid Mobile Number"

                        }

                    </p>

                }

                <br/>

                <label>

                    Password

                </label>

                <div

                    style={{

                        display:"flex",

                        alignItems:"center"

                    }}

                >

                    <input

                        type={

                            showPassword

                            ?

                            "text"

                            :

                            "password"

                        }

                        placeholder="Enter Password"

                        value={password}

                        onChange={(e)=>

                            setPassword(

                                e.target.value

                            )

                        }

                        style={{

                            flex:1,

                            padding:"12px"

                        }}

                    />

                    <button

                        onClick={()=>

                            setShowPassword(

                                !showPassword

                            )

                        }

                        style={{

                            marginLeft:"10px",

                            padding:"10px",

                            cursor:"pointer"

                        }}

                    >

                        {

                            showPassword

                            ?

                            "🙈"

                            :

                            "👁"

                        }

                    </button>

                </div>

                <PasswordStrength

                    password={password}

                />

                {

                    loading &&

                    <LoadingSpinner/>

                }

                                {

                    !otpSent &&

                    <button

                        onClick={sendOtp}

                        style={{

                            width: "100%",

                            padding: "14px",

                            backgroundColor: "#1976D2",

                            color: "white",

                            border: "none",

                            borderRadius: "8px",

                            cursor: "pointer",

                            fontSize: "16px",

                            marginTop: "10px"

                        }}

                    >

                        📧 Send OTP

                    </button>

                }

                {

                    otpSent &&

                    <>

                        <br/>

                        <br/>

                        <label>

                            Enter OTP

                        </label>

                        <OtpInput

                            otp={otp}

                            setOtp={setOtp}

                        />

                        {

                            !otpVerified &&

                            <button

                                onClick={verifyOtp}

                                style={{

                                    width:"100%",

                                    padding:"14px",

                                    backgroundColor:"#4CAF50",

                                    color:"white",

                                    border:"none",

                                    borderRadius:"8px",

                                    cursor:"pointer",

                                    fontSize:"16px"

                                }}

                            >

                                ✅ Verify OTP

                            </button>

                        }

                        {

                            otpVerified &&

                            <div

                                style={{

                                    textAlign:"center",

                                    marginTop:"15px",

                                    color:"green",

                                    fontWeight:"bold",

                                    fontSize:"18px"

                                }}

                            >

                                ✅ Email Verified Successfully

                            </div>

                        }

                        <br/>

                        <div

                            style={{

                                display:"flex",

                                justifyContent:"space-between",

                                alignItems:"center"

                            }}

                        >

                            <span

                                style={{

                                    color:"red",

                                    fontWeight:"bold"

                                }}

                            >

                                OTP Expires In :

                                {

                                    Math.floor(

                                        otpExpiryTimer/60

                                    )

                                }

                                :

                                {

                                    String(

                                        otpExpiryTimer%60

                                    )

                                    .padStart(2,"0")

                                }

                            </span>

                            {

                                resendTimer===0

                                ?

                                <button

                                    onClick={resendOtp}

                                    style={{

                                        border:"none",

                                        background:"none",

                                        color:"#1976D2",

                                        cursor:"pointer",

                                        fontWeight:"bold"

                                    }}

                                >

                                    Resend OTP

                                </button>

                                :

                                <span>

                                    Resend in

                                    {

                                        resendTimer

                                    }

                                    s

                                </span>

                            }

                        </div>

                    </>

                }

                <br/>

                <button

                    disabled={!otpVerified}

                    onClick={registerCustomer}

                    style={{

                        width:"100%",

                        padding:"15px",

                        backgroundColor:

                            otpVerified

                            ?

                            "#000"

                            :

                            "gray",

                        color:"white",

                        border:"none",

                        borderRadius:"8px",

                        cursor:

                            otpVerified

                            ?

                            "pointer"

                            :

                            "not-allowed",

                        fontSize:"18px",

                        marginTop:"20px"

                    }}

                >

                    🚗 Create Account

                </button>

            </div>

        </div>

    );

}

export default RegisterPage;