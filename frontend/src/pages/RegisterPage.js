import { useState, useEffect } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";


function RegisterPage() {

    const navigate = useNavigate();


    // ==========================================
    // USER INFORMATION
    // ==========================================

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [password, setPassword] =
        useState("");


    // ==========================================
    // OTP
    // ==========================================

    const [otp, setOtp] =
        useState([
            "",
            "",
            "",
            "",
            "",
            ""
        ]);

    const [otpSent, setOtpSent] =
        useState(false);

    const [otpVerified, setOtpVerified] =
        useState(false);


    // ==========================================
    // UI
    // ==========================================

    const [loading, setLoading] =
        useState(false);

    const [showPassword, setShowPassword] =
        useState(false);


    // ==========================================
    // TIMERS
    // ==========================================

    const [resendTimer, setResendTimer] =
        useState(60);

    const [otpExpiryTimer, setOtpExpiryTimer] =
        useState(300);


    // ==========================================
    // VALIDATION
    // ==========================================

    const [emailValid, setEmailValid] =
        useState(false);

    const [phoneValid, setPhoneValid] =
        useState(false);


    // ==========================================
    // OTP INPUT REFERENCES
    // ==========================================

    const otpInputs = [];


    // ==========================================
    // EMAIL VALIDATION
    // ==========================================

    useEffect(() => {

        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        setEmailValid(
            regex.test(email)
        );

    }, [email]);


    // ==========================================
    // PHONE VALIDATION
    // ==========================================

    useEffect(() => {

        const regex =
            /^[6-9]\d{9}$/;

        setPhoneValid(
            regex.test(phone)
        );

    }, [phone]);


    // ==========================================
    // OTP TIMER
    // ==========================================

    useEffect(() => {

        let resendInterval;

        let expiryInterval;


        // --------------------------------------
        // RESEND TIMER
        // --------------------------------------

        if (
            otpSent &&
            resendTimer > 0
        ) {

            resendInterval =
                setInterval(() => {

                    setResendTimer(
                        prev => {

                            if (prev <= 1) {

                                return 0;
                            }

                            return prev - 1;

                        }
                    );

                }, 1000);
        }


        // --------------------------------------
        // OTP EXPIRY TIMER
        // --------------------------------------

        if (
            otpSent &&
            otpExpiryTimer > 0
        ) {

            expiryInterval =
                setInterval(() => {

                    setOtpExpiryTimer(
                        prev => {

                            if (prev <= 1) {

                                alert(
                                    "OTP expired. Please resend."
                                );

                                setOtpSent(
                                    false
                                );

                                setOtpVerified(
                                    false
                                );

                                setOtp([
                                    "",
                                    "",
                                    "",
                                    "",
                                    "",
                                    ""
                                ]);

                                setResendTimer(
                                    60
                                );

                                return 0;
                            }

                            return prev - 1;

                        }
                    );

                }, 1000);
        }


        // --------------------------------------
        // CLEANUP
        // --------------------------------------

        return () => {

            if (resendInterval) {

                clearInterval(
                    resendInterval
                );
            }

            if (expiryInterval) {

                clearInterval(
                    expiryInterval
                );
            }

        };

    }, [
        otpSent,
        resendTimer,
        otpExpiryTimer
    ]);


    // ==========================================
    // PASSWORD STRENGTH
    // ==========================================

    const hasUpperCase =
        /[A-Z]/.test(password);

    const hasLowerCase =
        /[a-z]/.test(password);

    const hasNumber =
        /[0-9]/.test(password);

    const hasSpecialCharacter =
        /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const hasMinLength =
        password.length >= 8;


    let passwordScore = 0;


    if (hasUpperCase) {

        passwordScore++;
    }


    if (hasLowerCase) {

        passwordScore++;
    }


    if (hasNumber) {

        passwordScore++;
    }


    if (hasSpecialCharacter) {

        passwordScore++;
    }


    if (hasMinLength) {

        passwordScore++;
    }


    let passwordStrength = "";

    let passwordColor = "";


    if (passwordScore <= 2) {

        passwordStrength =
            "Weak";

        passwordColor =
            "red";

    } else if (passwordScore <= 4) {

        passwordStrength =
            "Medium";

        passwordColor =
            "orange";

    } else {

        passwordStrength =
            "Strong";

        passwordColor =
            "green";
    }


    // ==========================================
    // OTP INPUT CHANGE
    // ==========================================

    const handleOtpChange = (
        value,
        index
    ) => {

        if (
            !/^[0-9]?$/.test(value)
        ) {

            return;
        }


        const newOtp =
            [...otp];

        newOtp[index] =
            value;

        setOtp(
            newOtp
        );


        // Move to next input
        if (
            value &&
            index < 5
        ) {

            if (
                otpInputs[index + 1]
            ) {

                otpInputs[
                    index + 1
                ].focus();
            }
        }
    };


    // ==========================================
    // OTP BACKSPACE
    // ==========================================

    const handleOtpKeyDown = (
        e,
        index
    ) => {

        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {

            if (
                otpInputs[index - 1]
            ) {

                otpInputs[
                    index - 1
                ].focus();
            }
        }
    };


    // ==========================================
    // SEND OTP
    // ==========================================

    const sendOtp = () => {


        // --------------------------------------
        // NAME VALIDATION
        // --------------------------------------

        if (
            !name.trim()
        ) {

            alert(
                "Please enter your name."
            );

            return;
        }


        // --------------------------------------
        // EMAIL VALIDATION
        // --------------------------------------

        if (
            !emailValid
        ) {

            alert(
                "Please enter a valid email."
            );

            return;
        }


        // --------------------------------------
        // PHONE VALIDATION
        // --------------------------------------

        if (
            !phoneValid
        ) {

            alert(
                "Please enter a valid 10-digit mobile number."
            );

            return;
        }


        // --------------------------------------
        // PASSWORD VALIDATION
        // --------------------------------------

        if (
            !password
        ) {

            alert(
                "Please enter a password."
            );

            return;
        }


        if (
            password.length < 8
        ) {

            alert(
                "Password must contain at least 8 characters."
            );

            return;
        }


        // --------------------------------------
        // START LOADING
        // --------------------------------------

        setLoading(
            true
        );


        axios
            .post(

                "http://localhost:8081/customer/send-registration-otp",

                {
                    email: email
                }

            )

            .then(
                (response) => {

                    setLoading(
                        false
                    );


                    // ----------------------------------
                    // SUCCESS
                    // ----------------------------------

                    if (
                        response.data &&
                        response.data.success === true
                    ) {

                        alert(
                            response.data.message
                        );


                        setOtpSent(
                            true
                        );


                        setOtpVerified(
                            false
                        );


                        setResendTimer(
                            60
                        );


                        setOtpExpiryTimer(
                            300
                        );


                        setOtp([
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ]);


                        return;
                    }


                    // ----------------------------------
                    // BACKEND ERROR
                    // ----------------------------------

                    alert(

                        response.data?.message ||

                        "Unable to send OTP."

                    );

                }
            )

            .catch(
                (error) => {

                    setLoading(
                        false
                    );


                    // ----------------------------------
                    // SERVER ERROR
                    // ----------------------------------

                    if (
                        error.response &&
                        error.response.data
                    ) {

                        alert(

                            error.response.data.message ||

                            "Unable to send OTP."

                        );

                    } else {

                        alert(
                            "Unable to connect to server."
                        );
                    }

                }
            );
    };


    // ==========================================
    // VERIFY OTP
    // ==========================================

    const verifyOtp = () => {


        const enteredOtp =
            otp.join("");


        // --------------------------------------
        // OTP LENGTH
        // --------------------------------------

        if (
            enteredOtp.length !== 6
        ) {

            alert(
                "Please enter the complete 6-digit OTP."
            );

            return;
        }


        // --------------------------------------
        // START LOADING
        // --------------------------------------

        setLoading(
            true
        );


        axios
            .post(

                "http://localhost:8081/customer/verify-registration-otp",

                {
                    email: email,

                    otp: enteredOtp
                }

            )

            .then(
                (response) => {

                    setLoading(
                        false
                    );


                    // ----------------------------------
                    // OTP VERIFIED
                    // ----------------------------------

                    if (
                        response.data &&
                        response.data.success === true
                    ) {

                        alert(
                            response.data.message
                        );


                        setOtpVerified(
                            true
                        );


                        return;
                    }


                    // ----------------------------------
                    // INVALID OTP
                    // ----------------------------------

                    alert(

                        response.data?.message ||

                        "Invalid or expired OTP."

                    );

                }
            )

            .catch(
                (error) => {

                    setLoading(
                        false
                    );


                    if (
                        error.response &&
                        error.response.data
                    ) {

                        alert(

                            error.response.data.message ||

                            "OTP verification failed."

                        );

                    } else {

                        alert(
                            "Unable to connect to server."
                        );
                    }

                }
            );
    };


    // ==========================================
    // REGISTER CUSTOMER
    // ==========================================

    const registerCustomer = () => {


        // --------------------------------------
        // OTP CHECK
        // --------------------------------------

        if (
            !otpVerified
        ) {

            alert(
                "Please verify your email first."
            );

            return;
        }


        // --------------------------------------
        // START LOADING
        // --------------------------------------

        setLoading(
            true
        );


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

            .then(
                (response) => {

                    setLoading(
                        false
                    );


                    // ----------------------------------
                    // REGISTRATION SUCCESS
                    // ----------------------------------

                    if (
                        response.data &&
                        response.data.success === true
                    ) {

                        alert(
                            response.data.message
                        );


                        navigate(
                            "/registration-success"
                        );


                        return;
                    }


                    // ----------------------------------
                    // REGISTRATION ERROR
                    // ----------------------------------

                    alert(

                        response.data?.message ||

                        "Registration failed."

                    );

                }
            )

            .catch(
                (error) => {

                    setLoading(
                        false
                    );


                    if (
                        error.response &&
                        error.response.data
                    ) {

                        alert(

                            error.response.data.message ||

                            "Registration failed."

                        );

                    } else {

                        alert(
                            "Unable to connect to server."
                        );
                    }

                }
            );
    };


    // ==========================================
    // RESEND OTP
    // ==========================================

    const resendOtp = () => {


        if (
            resendTimer > 0
        ) {

            return;
        }


        // Reset expiry timer
        setOtpExpiryTimer(
            300
        );


        // Send OTP again
        sendOtp();
    };


    // ==========================================
    // LOADING SPINNER
    // ==========================================

    const LoadingSpinner = () => {

        return (

            <div
                style={{
                    display: "flex",

                    justifyContent:
                        "center",

                    alignItems:
                        "center",

                    flexDirection:
                        "column",

                    marginTop:
                        "20px",

                    marginBottom:
                        "20px"
                }}
            >

                <div
                    style={{
                        width:
                            "45px",

                        height:
                            "45px",

                        border:
                            "5px solid #ddd",

                        borderTop:
                            "5px solid #1976D2",

                        borderRadius:
                            "50%",

                        animation:
                            "spin 1s linear infinite"
                    }}
                />

                <p
                    style={{
                        marginTop:
                            "15px",

                        color:
                            "#1976D2",

                        fontWeight:
                            "bold"
                    }}
                >

                    Please Wait...

                </p>


                <style>
                    {`

                        @keyframes spin {

                            0% {

                                transform:
                                    rotate(0deg);

                            }

                            100% {

                                transform:
                                    rotate(360deg);

                            }

                        }

                    `}
                </style>

            </div>

        );
    };


    // ==========================================
    // PAGE UI
    // ==========================================

    return (

        <div
            style={{

                backgroundColor:
                    "#f5f5f5",

                minHeight:
                    "100vh",

                display:
                    "flex",

                justifyContent:
                    "center",

                alignItems:
                    "center",

                padding:
                    "30px"

            }}
        >

            <div
                style={{

                    width:
                        "500px",

                    backgroundColor:
                        "white",

                    padding:
                        "35px",

                    borderRadius:
                        "15px",

                    boxShadow:
                        "0px 0px 20px lightgray"

                }}
            >


                {/* ====================================
                    TITLE
                ==================================== */}

                <h1
                    style={{

                        textAlign:
                            "center",

                        marginBottom:
                            "30px",

                        color:
                            "#1976D2"

                    }}
                >

                    Create Account

                </h1>


                {/* ====================================
                    NAME
                ==================================== */}

                <label>

                    Full Name

                </label>


                <input

                    type="text"

                    placeholder="Enter Full Name"

                    value={name}

                    onChange={(e) =>
                        setName(
                            e.target.value
                        )
                    }

                    style={{

                        width:
                            "100%",

                        padding:
                            "12px",

                        marginTop:
                            "5px",

                        marginBottom:
                            "15px",

                        boxSizing:
                            "border-box"

                    }}

                />


                {/* ====================================
                    EMAIL
                ==================================== */}

                <label>

                    Email Address

                </label>


                <input

                    type="email"

                    placeholder="Enter Email"

                    disabled={
                        otpSent
                    }

                    value={email}

                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }

                    style={{

                        width:
                            "100%",

                        padding:
                            "12px",

                        marginTop:
                            "5px",

                        boxSizing:
                            "border-box"

                    }}

                />


                {
                    email.length > 0 && (

                        <p
                            style={{

                                color:

                                    emailValid
                                        ? "green"
                                        : "red",

                                fontWeight:
                                    "bold",

                                marginTop:
                                    "5px"

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

                    )
                }


                <br />


                {/* ====================================
                    PHONE
                ==================================== */}

                <label>

                    Mobile Number

                </label>


                <input

                    type="text"

                    placeholder="Enter Mobile Number"

                    value={phone}

                    onChange={(e) =>
                        setPhone(
                            e.target.value
                        )
                    }

                    maxLength="10"

                    style={{

                        width:
                            "100%",

                        padding:
                            "12px",

                        marginTop:
                            "5px",

                        boxSizing:
                            "border-box"

                    }}

                />


                {
                    phone.length > 0 && (

                        <p
                            style={{

                                color:

                                    phoneValid
                                        ? "green"
                                        : "red",

                                fontWeight:
                                    "bold",

                                marginTop:
                                    "5px"

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

                    )
                }


                <br />


                {/* ====================================
                    PASSWORD
                ==================================== */}

                <label>

                    Password

                </label>


                <div
                    style={{

                        display:
                            "flex",

                        alignItems:
                            "center"

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

                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }

                        style={{

                            flex:
                                1,

                            padding:
                                "12px",

                            boxSizing:
                                "border-box"

                        }}

                    />


                    <button

                        type="button"

                        onClick={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }

                        style={{

                            marginLeft:
                                "10px",

                            padding:
                                "10px",

                            cursor:
                                "pointer"

                        }}
                    >

                        {

                            showPassword

                                ?

                                "🙈"

                                :

                                "👁️"

                        }

                    </button>

                </div>


                {/* ====================================
                    PASSWORD STRENGTH
                ==================================== */}

                {
                    password.length > 0 && (

                        <div
                            style={{

                                marginTop:
                                    "10px",

                                marginBottom:
                                    "20px"

                            }}
                        >

                            <div
                                style={{

                                    height:
                                        "10px",

                                    width:
                                        "100%",

                                    backgroundColor:
                                        "#ddd",

                                    borderRadius:
                                        "10px",

                                    overflow:
                                        "hidden"

                                }}
                            >

                                <div
                                    style={{

                                        width:
                                            `${passwordScore * 20}%`,

                                        height:
                                            "100%",

                                        backgroundColor:
                                            passwordColor,

                                        transition:
                                            "0.3s"

                                    }}
                                />

                            </div>


                            <p
                                style={{

                                    color:
                                        passwordColor,

                                    fontWeight:
                                        "bold"

                                }}
                            >

                                {
                                    passwordStrength
                                }

                                {" Password"}

                            </p>


                            <p>

                                {
                                    hasUpperCase
                                        ? "✅"
                                        : "❌"
                                }

                                {" Uppercase Letter"}

                            </p>


                            <p>

                                {
                                    hasLowerCase
                                        ? "✅"
                                        : "❌"
                                }

                                {" Lowercase Letter"}

                            </p>


                            <p>

                                {
                                    hasNumber
                                        ? "✅"
                                        : "❌"
                                }

                                {" Number"}

                            </p>


                            <p>

                                {
                                    hasSpecialCharacter
                                        ? "✅"
                                        : "❌"
                                }

                                {" Special Character"}

                            </p>


                            <p>

                                {
                                    hasMinLength
                                        ? "✅"
                                        : "❌"
                                }

                                {" Minimum 8 Characters"}

                            </p>

                        </div>

                    )
                }


                {/* ====================================
                    LOADING SPINNER
                ==================================== */}

                {
                    loading && (

                        <LoadingSpinner />

                    )
                }


                {/* ====================================
                    SEND OTP
                ==================================== */}

                {
                    !otpSent && (

                        <button

                            type="button"

                            onClick={
                                sendOtp
                            }

                            disabled={
                                loading
                            }

                            style={{

                                width:
                                    "100%",

                                padding:
                                    "14px",

                                backgroundColor:
                                    "#1976D2",

                                color:
                                    "white",

                                border:
                                    "none",

                                borderRadius:
                                    "8px",

                                cursor:
                                    loading
                                        ? "not-allowed"
                                        : "pointer",

                                fontSize:
                                    "16px",

                                marginTop:
                                    "10px"

                            }}
                        >

                            📧 Send OTP

                        </button>

                    )
                }


                {/* ====================================
                    OTP SECTION
                ==================================== */}

                {
                    otpSent && (

                        <>

                            <br />

                            <br />


                            <label>

                                Enter OTP

                            </label>


                            <div
                                style={{

                                    display:
                                        "flex",

                                    justifyContent:
                                        "space-between",

                                    marginBottom:
                                        "20px"

                                }}
                            >

                                {
                                    otp.map(
                                        (
                                            digit,
                                            index
                                        ) => (

                                            <input

                                                key={
                                                    index
                                                }

                                                ref={(
                                                    element
                                                ) => {

                                                    otpInputs[
                                                        index
                                                    ] =
                                                        element;

                                                }}

                                                type="text"

                                                value={
                                                    digit
                                                }

                                                maxLength="1"

                                                onChange={(e) =>
                                                    handleOtpChange(

                                                        e.target.value,

                                                        index

                                                    )
                                                }

                                                onKeyDown={(e) =>
                                                    handleOtpKeyDown(

                                                        e,

                                                        index

                                                    )
                                                }

                                                style={{

                                                    width:
                                                        "50px",

                                                    height:
                                                        "55px",

                                                    textAlign:
                                                        "center",

                                                    fontSize:
                                                        "22px",

                                                    borderRadius:
                                                        "10px",

                                                    border:
                                                        "2px solid #1976D2"

                                                }}

                                            />

                                        )
                                    )
                                }

                            </div>


                            {/* ====================================
                                VERIFY OTP
                            ==================================== */}

                            {
                                !otpVerified && (

                                    <button

                                        type="button"

                                        onClick={
                                            verifyOtp
                                        }

                                        disabled={
                                            loading
                                        }

                                        style={{

                                            width:
                                                "100%",

                                            padding:
                                                "14px",

                                            backgroundColor:
                                                "#4CAF50",

                                            color:
                                                "white",

                                            border:
                                                "none",

                                            borderRadius:
                                                "8px",

                                            cursor:
                                                loading
                                                    ? "not-allowed"
                                                    : "pointer",

                                            fontSize:
                                                "16px"

                                        }}
                                    >

                                        ✅ Verify OTP

                                    </button>

                                )
                            }


                            {/* ====================================
                                VERIFIED MESSAGE
                            ==================================== */}

                            {
                                otpVerified && (

                                    <div
                                        style={{

                                            textAlign:
                                                "center",

                                            marginTop:
                                                "15px",

                                            color:
                                                "green",

                                            fontWeight:
                                                "bold",

                                            fontSize:
                                                "18px"

                                        }}
                                    >

                                        ✅ Email Verified Successfully

                                    </div>

                                )
                            }


                            <br />


                            {/* ====================================
                                OTP TIMER
                            ==================================== */}

                            <div
                                style={{

                                    display:
                                        "flex",

                                    justifyContent:
                                        "space-between",

                                    alignItems:
                                        "center"

                                }}
                            >

                                <span
                                    style={{

                                        color:
                                            "red",

                                        fontWeight:
                                            "bold"

                                    }}
                                >

                                    OTP Expires In:{" "}

                                    {

                                        Math.floor(

                                            otpExpiryTimer /
                                            60

                                        )

                                    }

                                    :

                                    {

                                        String(

                                            otpExpiryTimer %
                                            60

                                        ).padStart(

                                            2,

                                            "0"

                                        )

                                    }

                                </span>


                                {

                                    resendTimer === 0

                                        ?

                                        (

                                            <button

                                                type="button"

                                                onClick={
                                                    resendOtp
                                                }

                                                disabled={
                                                    loading
                                                }

                                                style={{

                                                    border:
                                                        "none",

                                                    background:
                                                        "none",

                                                    color:
                                                        "#1976D2",

                                                    cursor:
                                                        loading
                                                            ? "not-allowed"
                                                            : "pointer",

                                                    fontWeight:
                                                        "bold"

                                                }}
                                            >

                                                Resend OTP

                                            </button>

                                        )

                                        :

                                        (

                                            <span>

                                                Resend in{" "}

                                                {
                                                    resendTimer
                                                }

                                                s

                                            </span>

                                        )

                                }

                            </div>

                        </>

                    )
                }


                {/* ====================================
                    CREATE ACCOUNT
                ==================================== */}

                <button

                    type="button"

                    disabled={

                        !otpVerified ||

                        loading

                    }

                    onClick={
                        registerCustomer
                    }

                    style={{

                        width:
                            "100%",

                        padding:
                            "15px",

                        backgroundColor:

                            otpVerified
                                ? "#000"
                                : "gray",

                        color:
                            "white",

                        border:
                            "none",

                        borderRadius:
                            "8px",

                        cursor:

                            otpVerified &&
                            !loading

                                ?

                                "pointer"

                                :

                                "not-allowed",

                        fontSize:
                            "18px",

                        marginTop:
                            "20px"

                    }}
                >

                    🚗 Create Account

                </button>


            </div>

        </div>
    );
}


export default RegisterPage;