import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import OtpInput from "../components/OtpInput";
import PasswordStrength from "../components/PasswordStrength";
import LoadingSpinner from "../components/LoadingSpinner";


function RegisterPage() {

    const navigate =
        useNavigate();


    // =====================================================
    // USER INFORMATION
    // =====================================================

    const [
        name,
        setName
    ] = useState("");


    const [
        email,
        setEmail
    ] = useState("");


    const [
        phone,
        setPhone
    ] = useState("");


    const [
        alternatePhone,
        setAlternatePhone
    ] = useState("");


    const [
        bloodGroup,
        setBloodGroup
    ] = useState("");


    const [
        address,
        setAddress
    ] = useState("");


    const [
        password,
        setPassword
    ] = useState("");


    // =====================================================
    // OTP
    // =====================================================

    const [
        otp,
        setOtp
    ] = useState([
        "",
        "",
        "",
        "",
        "",
        ""
    ]);


    const [
        otpSent,
        setOtpSent
    ] = useState(false);


    const [
        otpVerified,
        setOtpVerified
    ] = useState(false);


    // =====================================================
    // UI
    // =====================================================

    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        showPassword,
        setShowPassword
    ] = useState(false);


    // =====================================================
    // TIMERS
    // =====================================================

    const [
        resendTimer,
        setResendTimer
    ] = useState(60);


    const [
        otpExpiryTimer,
        setOtpExpiryTimer
    ] = useState(300);


    // =====================================================
    // VALIDATION
    // =====================================================

    const [
        emailValid,
        setEmailValid
    ] = useState(false);


    const [
        phoneValid,
        setPhoneValid
    ] = useState(false);


    const [
        alternatePhoneValid,
        setAlternatePhoneValid
    ] = useState(true);


    // =====================================================
    // EMAIL VALIDATION
    // =====================================================

    useEffect(() => {

        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        setEmailValid(
            regex.test(
                email
            )
        );

    }, [
        email
    ]);


    // =====================================================
    // MOBILE VALIDATION
    // =====================================================

    useEffect(() => {

        const regex =
            /^[6-9]\d{9}$/;


        setPhoneValid(
            regex.test(
                phone
            )
        );

    }, [
        phone
    ]);


    // =====================================================
    // ALTERNATE PHONE VALIDATION
    // OPTIONAL
    // =====================================================

    useEffect(() => {

        if (
            alternatePhone.trim() === ""
        ) {

            setAlternatePhoneValid(
                true
            );

            return;

        }


        const regex =
            /^[6-9]\d{9}$/;


        setAlternatePhoneValid(
            regex.test(
                alternatePhone
            )
        );

    }, [
        alternatePhone
    ]);


    // =====================================================
    // OTP TIMER
    // =====================================================

    useEffect(() => {

        let resendInterval;

        let expiryInterval;


        // -------------------------------------------------
        // RESEND TIMER
        // -------------------------------------------------

        if (
            otpSent &&
            resendTimer > 0
        ) {

            resendInterval =
                setInterval(() => {

                    setResendTimer(
                        previous =>
                            previous - 1
                    );

                }, 1000);

        }


        // -------------------------------------------------
        // OTP EXPIRY TIMER
        // -------------------------------------------------

        if (
            otpSent &&
            otpExpiryTimer > 0
        ) {

            expiryInterval =
                setInterval(() => {

                    setOtpExpiryTimer(
                        previous => {

                            if (
                                previous <= 1
                            ) {

                                clearInterval(
                                    expiryInterval
                                );


                                alert(
                                    "OTP Expired. Please Resend OTP."
                                );


                                setOtpVerified(
                                    false
                                );


                                setOtpSent(
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


                                return 300;

                            }


                            return previous - 1;

                        }
                    );

                }, 1000);

        }


        return () => {

            if (
                resendInterval
            ) {

                clearInterval(
                    resendInterval
                );

            }


            if (
                expiryInterval
            ) {

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


    // =====================================================
    // SEND OTP
    // =====================================================

    const sendOtp = () => {

        // -------------------------------------------------
        // NAME
        // -------------------------------------------------

        if (
            !name.trim()
        ) {

            alert(
                "Please enter your full name."
            );

            return;

        }


        // -------------------------------------------------
        // EMAIL
        // -------------------------------------------------

        if (
            !emailValid
        ) {

            alert(
                "Please enter a valid email address."
            );

            return;

        }


        // -------------------------------------------------
        // MOBILE
        // -------------------------------------------------

        if (
            !phoneValid
        ) {

            alert(
                "Please enter a valid 10-digit mobile number."
            );

            return;

        }


        // -------------------------------------------------
        // ALTERNATE PHONE
        // OPTIONAL
        // -------------------------------------------------

        if (
            !alternatePhoneValid
        ) {

            alert(
                "Please enter a valid alternate phone number."
            );

            return;

        }


        // -------------------------------------------------
        // BLOOD GROUP
        // -------------------------------------------------

        if (
            !bloodGroup
        ) {

            alert(
                "Please select your blood group."
            );

            return;

        }


        // -------------------------------------------------
        // ADDRESS
        // -------------------------------------------------

        if (
            !address.trim()
        ) {

            alert(
                "Please enter your address."
            );

            return;

        }


        // -------------------------------------------------
        // PASSWORD
        // -------------------------------------------------

        if (
            !password
        ) {

            alert(
                "Please enter your password."
            );

            return;

        }


        // -------------------------------------------------
        // SEND REQUEST
        // -------------------------------------------------

        setLoading(
            true
        );


        axios
            .post(
                "http://localhost:8081/customer/send-registration-otp",
                {
                    email:
                        email
                }
            )

            .then(
                (response) => {

                    setLoading(
                        false
                    );


                    alert(
                        response.data.message
                    );


                    if (
                        response.data.success
                    ) {

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

                    }

                }
            )

            .catch(
                (error) => {

                    setLoading(
                        false
                    );


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

                }
            );

    };


    // =====================================================
    // VERIFY OTP
    // =====================================================

    const verifyOtp = () => {

        const enteredOtp =
            otp.join("");


        if (
            enteredOtp.length !== 6
        ) {

            alert(
                "Please enter the complete 6-digit OTP."
            );

            return;

        }


        setLoading(
            true
        );


        axios
            .post(
                "http://localhost:8081/customer/verify-registration-otp",
                {
                    email:
                        email,

                    otp:
                        enteredOtp
                }
            )

            .then(
                (response) => {

                    setLoading(
                        false
                    );


                    alert(
                        response.data.message
                    );


                    if (
                        response.data.success
                    ) {

                        setOtpVerified(
                            true
                        );

                    }

                }
            )

            .catch(
                (error) => {

                    setLoading(
                        false
                    );


                    if (
                        error.response
                    ) {

                        alert(
                            error.response.data.message
                        );

                    }

                    else {

                        alert(
                            "Invalid or expired OTP."
                        );

                    }

                }
            );

    };


    // =====================================================
    // REGISTER CUSTOMER
    // =====================================================

    const registerCustomer = () => {

        if (
            !otpVerified
        ) {

            alert(
                "Please verify OTP first."
            );

            return;

        }


        if (
            !name.trim()
        ) {

            alert(
                "Please enter your full name."
            );

            return;

        }


        if (
            !emailValid
        ) {

            alert(
                "Please enter a valid email."
            );

            return;

        }


        if (
            !phoneValid
        ) {

            alert(
                "Please enter a valid mobile number."
            );

            return;

        }


        if (
            !bloodGroup
        ) {

            alert(
                "Please select blood group."
            );

            return;

        }


        if (
            !address.trim()
        ) {

            alert(
                "Please enter your address."
            );

            return;

        }


        setLoading(
            true
        );


        // =================================================
        // REGISTER DATA
        // =================================================

        const registrationData = {

            name:
                name.trim(),

            email:
                email.trim(),

            phone:
                phone.trim(),

            alternatePhone:
                alternatePhone.trim(),

            bloodGroup:
                bloodGroup,

            address:
                address.trim(),

            password:
                password,

            otp:
                otp.join("")

        };


        console.log(
            "REGISTRATION DATA:",
            registrationData
        );


        axios
            .post(

                "http://localhost:8081/customer/register-with-otp",

                registrationData

            )

            .then(
                (response) => {

                    setLoading(
                        false
                    );


                    alert(
                        response.data.message
                    );


                    if (
                        response.data.success
                    ) {

                        // =================================
                        // GO DIRECTLY TO LOGIN PAGE
                        // =================================

                        navigate(
                            "/login"
                        );

                    }

                }
            )

            .catch(
                (error) => {

                    setLoading(
                        false
                    );


                    if (
                        error.response
                    ) {

                        alert(
                            error.response.data.message
                        );

                    }

                    else {

                        alert(
                            "Registration Failed"
                        );

                    }

                }
            );

    };


    // =====================================================
    // RESEND OTP
    // =====================================================

    const resendOtp = () => {

        if (
            resendTimer > 0
        ) {

            return;

        }


        sendOtp();

    };


    // =====================================================
    // INPUT STYLE
    // =====================================================

    const inputStyle = {

        width:
            "100%",

        height:
            "43px",

        boxSizing:
            "border-box",

        padding:
            "0 12px",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "8px",

        fontSize:
            "14px",

        outline:
            "none",

        background:
            "white"

    };


    // =====================================================
    // LABEL STYLE
    // =====================================================

    const labelStyle = {

        display:
            "block",

        fontSize:
            "13px",

        fontWeight:
            "700",

        color:
            "#334155",

        marginBottom:
            "6px"

    };


    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <div
            style={{

                minHeight:
                    "100vh",

                width:
                    "100%",

                background:
                    "linear-gradient(135deg,#eff6ff,#f8fafc)",

                display:
                    "flex",

                justifyContent:
                    "center",

                alignItems:
                    "flex-start",

                padding:
                    "25px 15px 45px",

                boxSizing:
                    "border-box"

            }}
        >

            {/* =================================================
                MEDIUM REGISTER CARD
            ================================================= */}

            <div
                style={{

                    width:
                        "100%",

                    maxWidth:
                        "680px",

                    background:
                        "white",

                    borderRadius:
                        "18px",

                    padding:
                        "26px",

                    boxSizing:
                        "border-box",

                    boxShadow:
                        "0 12px 35px rgba(15,23,42,0.10)",

                    border:
                        "1px solid #e2e8f0"

                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    style={{

                        textAlign:
                            "center",

                        marginBottom:
                            "22px"

                    }}
                >

                    <div
                        style={{

                            width:
                                "52px",

                            height:
                                "52px",

                            margin:
                                "0 auto 8px",

                            borderRadius:
                                "50%",

                            background:
                                "#eff6ff",

                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            fontSize:
                                "25px"

                        }}
                    >

                        🚗

                    </div>


                    <h1
                        style={{

                            margin:
                                "0",

                            color:
                                "#1976d2",

                            fontSize:
                                "28px"

                        }}
                    >

                        Create Account

                    </h1>


                    <p
                        style={{

                            margin:
                                "5px 0 0",

                            color:
                                "#64748b",

                            fontSize:
                                "12px"

                        }}
                    >

                        Register to book your favourite car

                    </p>

                </div>


                {/* =================================================
                    PERSONAL INFORMATION
                ================================================= */}

                <div
                    style={sectionStyle}
                >

                    <div
                        style={sectionTitleStyle}
                    >

                        👤 Personal Information

                    </div>


                    {/* FULL NAME */}

                    <div
                        style={{
                            marginBottom:
                                "13px"
                        }}
                    >

                        <label
                            style={
                                labelStyle
                            }
                        >

                            Full Name
                            <span
                                style={
                                    requiredStyle
                                }
                            >
                                {" "}*
                            </span>

                        </label>


                        <input

                            type="text"

                            placeholder="Enter Full Name"

                            value={
                                name
                            }

                            onChange={
                                (e) =>
                                    setName(
                                        e.target.value
                                    )
                            }

                            style={
                                inputStyle
                            }

                        />

                    </div>


                    {/* EMAIL */}

                    <div
                        style={{
                            marginBottom:
                                "13px"
                        }}
                    >

                        <label
                            style={
                                labelStyle
                            }
                        >

                            Email Address
                            <span
                                style={
                                    requiredStyle
                                }
                            >
                                {" "}*
                            </span>

                        </label>


                        <input

                            type="email"

                            placeholder="Enter Email"

                            disabled={
                                otpSent
                            }

                            value={
                                email
                            }

                            onChange={
                                (e) =>
                                    setEmail(
                                        e.target.value
                                    )
                            }

                            style={{
                                ...inputStyle,

                                background:
                                    otpSent
                                        ? "#f1f5f9"
                                        : "white"
                            }}

                        />


                        {
                            email.length > 0 && (

                                <div
                                    style={{

                                        marginTop:
                                            "4px",

                                        fontSize:
                                            "11px",

                                        fontWeight:
                                            "700",

                                        color:
                                            emailValid
                                                ? "#15803d"
                                                : "#dc2626"

                                    }}
                                >

                                    {
                                        emailValid
                                            ? "✅ Valid Email"
                                            : "❌ Invalid Email"
                                    }

                                </div>

                            )
                        }

                    </div>


                    {/* MOBILE + ALTERNATE */}

                    <div
                        style={{

                            display:
                                "grid",

                            gridTemplateColumns:
                                "1fr 1fr",

                            gap:
                                "12px",

                            marginBottom:
                                "13px"

                        }}
                    >

                        {/* MOBILE */}

                        <div>

                            <label
                                style={
                                    labelStyle
                                }
                            >

                                Mobile Number
                                <span
                                    style={
                                        requiredStyle
                                    }
                                >
                                    {" "}*
                                </span>

                            </label>


                            <input

                                type="text"

                                maxLength="10"

                                placeholder="10-digit mobile"

                                value={
                                    phone
                                }

                                onChange={
                                    (e) =>
                                        setPhone(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                }

                                style={
                                    inputStyle
                                }

                            />


                            {
                                phone.length > 0 && (

                                    <div
                                        style={{

                                            marginTop:
                                                "4px",

                                            fontSize:
                                                "10px",

                                            fontWeight:
                                                "700",

                                            color:
                                                phoneValid
                                                    ? "#15803d"
                                                    : "#dc2626"

                                        }}
                                    >

                                        {
                                            phoneValid
                                                ? "✅ Valid"
                                                : "❌ Invalid"
                                        }

                                    </div>

                                )
                            }

                        </div>


                        {/* ALTERNATE PHONE */}

                        <div>

                            <label
                                style={
                                    labelStyle
                                }
                            >

                                Alternate Phone

                                <span
                                    style={{

                                        color:
                                            "#64748b",

                                        fontWeight:
                                            "500"

                                    }}
                                >
                                    {" "}(Optional)
                                </span>

                            </label>


                            <input

                                type="text"

                                maxLength="10"

                                placeholder="Optional"

                                value={
                                    alternatePhone
                                }

                                onChange={
                                    (e) =>
                                        setAlternatePhone(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                }

                                style={
                                    inputStyle
                                }

                            />


                            {
                                alternatePhone.length > 0 && (

                                    <div
                                        style={{

                                            marginTop:
                                                "4px",

                                            fontSize:
                                                "10px",

                                            fontWeight:
                                                "700",

                                            color:
                                                alternatePhoneValid
                                                    ? "#15803d"
                                                    : "#dc2626"

                                        }}
                                    >

                                        {
                                            alternatePhoneValid
                                                ? "✅ Valid"
                                                : "❌ Invalid"
                                        }

                                    </div>

                                )
                            }

                        </div>

                    </div>


                    {/* BLOOD GROUP */}

                    <div
                        style={{

                            marginBottom:
                                "13px"

                        }}
                    >

                        <label
                            style={
                                labelStyle
                            }
                        >

                            Blood Group
                            <span
                                style={
                                    requiredStyle
                                }
                            >
                                {" "}*
                            </span>

                        </label>


                        <select

                            value={
                                bloodGroup
                            }

                            onChange={
                                (e) =>
                                    setBloodGroup(
                                        e.target.value
                                    )
                            }

                            style={
                                inputStyle
                            }
                        >

                            <option value="">
                                Select Blood Group
                            </option>

                            <option value="A+">
                                A+
                            </option>

                            <option value="A-">
                                A-
                            </option>

                            <option value="B+">
                                B+
                            </option>

                            <option value="B-">
                                B-
                            </option>

                            <option value="AB+">
                                AB+
                            </option>

                            <option value="AB-">
                                AB-
                            </option>

                            <option value="O+">
                                O+
                            </option>

                            <option value="O-">
                                O-
                            </option>

                        </select>

                    </div>


                    {/* ADDRESS */}

                    <div>

                        <label
                            style={
                                labelStyle
                            }
                        >

                            Address
                            <span
                                style={
                                    requiredStyle
                                }
                            >
                                {" "}*
                            </span>

                        </label>


                        <textarea

                            placeholder="Enter your complete address"

                            value={
                                address
                            }

                            onChange={
                                (e) =>
                                    setAddress(
                                        e.target.value
                                    )
                            }

                            rows="3"

                            style={{

                                width:
                                    "100%",

                                boxSizing:
                                    "border-box",

                                padding:
                                    "10px 12px",

                                border:
                                    "1px solid #cbd5e1",

                                borderRadius:
                                    "8px",

                                fontSize:
                                    "14px",

                                resize:
                                    "vertical",

                                fontFamily:
                                    "inherit",

                                outline:
                                    "none"

                            }}

                        />

                    </div>

                </div>


                {/* =================================================
                    PASSWORD
                ================================================= */}

                <div
                    style={sectionStyle}
                >

                    <div
                        style={sectionTitleStyle}
                    >

                        🔐 Account Security

                    </div>


                    <label
                        style={
                            labelStyle
                        }
                    >

                        Password
                        <span
                            style={
                                requiredStyle
                            }
                        >
                            {" "}*
                        </span>

                    </label>


                    <div
                        style={{

                            display:
                                "flex",

                            alignItems:
                                "stretch",

                            gap:
                                "7px"

                        }}
                    >

                        <input

                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }

                            placeholder="Enter Password"

                            value={
                                password
                            }

                            onChange={
                                (e) =>
                                    setPassword(
                                        e.target.value
                                    )
                            }

                            style={{
                                ...inputStyle,

                                flex:
                                    "1"
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

                                width:
                                    "45px",

                                border:
                                    "1px solid #cbd5e1",

                                borderRadius:
                                    "8px",

                                background:
                                    "#f8fafc",

                                cursor:
                                    "pointer",

                                fontSize:
                                    "17px"

                            }}
                        >

                            {
                                showPassword
                                    ? "🙈"
                                    : "👁️"
                            }

                        </button>

                    </div>


                    <PasswordStrength
                        password={
                            password
                        }
                    />

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {
                    loading && (

                        <div
                            style={{

                                textAlign:
                                    "center",

                                margin:
                                    "8px 0"

                            }}
                        >

                            <LoadingSpinner />

                        </div>

                    )
                }


                {/* =================================================
                    SEND OTP
                ================================================= */}

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
                                    "190px",

                                height:
                                    "43px",

                                display:
                                    "block",

                                margin:
                                    "10px auto 0",

                                background:
                                    loading
                                        ? "#94a3b8"
                                        : "#1976d2",

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
                                    "14px",

                                fontWeight:
                                    "800",

                                boxShadow:
                                    "0 5px 12px rgba(25,118,210,0.20)"

                            }}
                        >

                            📧 Send OTP

                        </button>

                    )
                }


                {/* =================================================
                    OTP SECTION
                ================================================= */}

                {
                    otpSent && (

                        <div
                            style={{

                                marginTop:
                                    "20px",

                                padding:
                                    "16px",

                                background:
                                    "#f8fafc",

                                border:
                                    "1px solid #e2e8f0",

                                borderRadius:
                                    "12px"

                            }}
                        >

                            <div
                                style={{

                                    textAlign:
                                        "center",

                                    fontWeight:
                                        "800",

                                    color:
                                        "#334155",

                                    fontSize:
                                        "14px",

                                    marginBottom:
                                        "10px"

                                }}
                            >

                                📩 Enter OTP

                            </div>


                            <OtpInput

                                otp={
                                    otp
                                }

                                setOtp={
                                    setOtp
                                }

                            />


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
                                                "160px",

                                            height:
                                                "40px",

                                            display:
                                                "block",

                                            margin:
                                                "12px auto 0",

                                            background:
                                                "#16a34a",

                                            color:
                                                "white",

                                            border:
                                                "none",

                                            borderRadius:
                                                "7px",

                                            cursor:
                                                "pointer",

                                            fontSize:
                                                "13px",

                                            fontWeight:
                                                "800"

                                        }}
                                    >

                                        ✅ Verify OTP

                                    </button>

                                )
                            }


                            {
                                otpVerified && (

                                    <div
                                        style={{

                                            textAlign:
                                                "center",

                                            marginTop:
                                                "12px",

                                            color:
                                                "#15803d",

                                            fontWeight:
                                                "800",

                                            fontSize:
                                                "13px"

                                        }}
                                    >

                                        ✅ Email Verified Successfully

                                    </div>

                                )
                            }


                            {/* OTP TIMER */}

                            <div
                                style={{

                                    display:
                                        "flex",

                                    justifyContent:
                                        "space-between",

                                    alignItems:
                                        "center",

                                    marginTop:
                                        "13px",

                                    fontSize:
                                        "11px"

                                }}
                            >

                                <span
                                    style={{

                                        color:
                                            "#dc2626",

                                        fontWeight:
                                            "800"

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

                                        ? (

                                            <button

                                                type="button"

                                                onClick={
                                                    resendOtp
                                                }

                                                style={{

                                                    border:
                                                        "none",

                                                    background:
                                                        "none",

                                                    color:
                                                        "#1976d2",

                                                    cursor:
                                                        "pointer",

                                                    fontWeight:
                                                        "800"

                                                }}
                                            >

                                                Resend OTP

                                            </button>

                                        )

                                        : (

                                            <span
                                                style={{

                                                    color:
                                                        "#64748b"

                                                }}
                                            >

                                                Resend in{" "}

                                                {
                                                    resendTimer
                                                }

                                                s

                                            </span>

                                        )
                                }

                            </div>

                        </div>

                    )
                }


                {/* =================================================
                    CREATE ACCOUNT
                ================================================= */}

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

                        height:
                            "46px",

                        marginTop:
                            "18px",

                        background:
                            otpVerified &&
                            !loading

                                ? "#0f172a"

                                : "#94a3b8",

                        color:
                            "white",

                        border:
                            "none",

                        borderRadius:
                            "8px",

                        cursor:
                            otpVerified &&
                            !loading

                                ? "pointer"

                                : "not-allowed",

                        fontSize:
                            "14px",

                        fontWeight:
                            "900"

                    }}
                >

                    {
                        loading
                            ? "Creating Account..."
                            : "🚗 Create Account"
                    }

                </button>


                {/* =================================================
                    LOGIN LINK
                ================================================= */}

                <div
                    style={{

                        textAlign:
                            "center",

                        marginTop:
                            "14px",

                        fontSize:
                            "12px",

                        color:
                            "#64748b"

                    }}
                >

                    Already have an account?

                    {" "}

                    <button

                        type="button"

                        onClick={() =>
                            navigate(
                                "/login"
                            )
                        }

                        style={{

                            border:
                                "none",

                            background:
                                "none",

                            color:
                                "#1976d2",

                            fontWeight:
                                "800",

                            cursor:
                                "pointer"

                        }}
                    >

                        Login

                    </button>

                </div>

            </div>

        </div>

    );

}


// =============================================================
// STYLES
// =============================================================

const sectionStyle = {

    background:
        "#f8fafc",

    border:
        "1px solid #e2e8f0",

    borderRadius:
        "12px",

    padding:
        "16px",

    marginBottom:
        "15px"

};


const sectionTitleStyle = {

    fontSize:
        "14px",

    fontWeight:
        "900",

    color:
        "#0f172a",

    marginBottom:
        "14px",

    paddingBottom:
        "8px",

    borderBottom:
        "1px solid #e2e8f0"

};


const requiredStyle = {

    color:
        "#dc2626",

    fontWeight:
        "900"

};


export default RegisterPage;