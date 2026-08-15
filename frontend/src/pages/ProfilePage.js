import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";


function ProfilePage() {

    // ==========================================
    // STATE
    // ==========================================

    const [customer, setCustomer] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [editing, setEditing] =
        useState(false);

    const [name, setName] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [saving, setSaving] =
        useState(false);


    // ==========================================
    // LOAD PROFILE
    // ==========================================

    useEffect(() => {

        fetchProfile();

    }, []);


    // ==========================================
    // FETCH PROFILE
    // ==========================================

    const fetchProfile = async () => {

        const customerId =
            localStorage.getItem(
                "customerId"
            );

        const token =
            localStorage.getItem(
                "token"
            );


        console.log(
            "Profile Customer ID:",
            customerId
        );


        // ==========================================
        // CHECK LOGIN
        // ==========================================

        if (!customerId || !token) {

            setError(
                "Customer login information not found."
            );

            setLoading(false);

            return;
        }


        try {

            const response =
                await axios.get(

                    `http://localhost:8081/customer/${customerId}`,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }

                );


            console.log(
                "Profile Response:",
                response.data
            );


            setCustomer(
                response.data
            );


            // ==========================================
            // SET EDIT VALUES
            // ==========================================

            setName(
                response.data.name || ""
            );

            setPhone(
                response.data.phone || ""
            );

        }

        catch (error) {

            console.error(
                "Profile Error:",
                error
            );


            if (
                error.response
            ) {

                console.error(
                    "Backend Response:",
                    error.response.data
                );

                console.error(
                    "Status:",
                    error.response.status
                );

            }


            setError(
                "Unable to load profile."
            );

        }

        finally {

            setLoading(false);

        }
    };


    // ==========================================
    // CHANGE PROFILE PHOTO
    // ==========================================

    const changeProfilePhoto = (
        event
    ) => {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        // ==========================================
        // CHECK IMAGE
        // ==========================================

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            alert(
                "Please select an image file."
            );

            return;
        }


        // ==========================================
        // CHECK SIZE
        // ==========================================

        if (
            file.size >
            2 * 1024 * 1024
        ) {

            alert(
                "Profile photo must be less than 2 MB."
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload = async () => {

            const base64Image =
                reader.result;


            const customerId =
                localStorage.getItem(
                    "customerId"
                );

            const token =
                localStorage.getItem(
                    "token"
                );


            try {

                const response =
                    await axios.put(

                        `http://localhost:8081/customer/${customerId}`,

                        {
                            profilePhoto:
                                base64Image
                        },

                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json"
                            }
                        }

                    );


                setCustomer(
                    response.data
                );


                alert(
                    "Profile photo updated successfully."
                );

            }

            catch (error) {

                console.error(
                    "Photo Update Error:",
                    error
                );

                alert(
                    "Unable to update profile photo."
                );

            }

        };


        reader.readAsDataURL(
            file
        );
    };


    // ==========================================
    // SAVE PROFILE
    // ==========================================

    const saveProfile = async () => {

        const customerId =
            localStorage.getItem(
                "customerId"
            );

        const token =
            localStorage.getItem(
                "token"
            );


        if (!name.trim()) {

            alert(
                "Name cannot be empty."
            );

            return;
        }


        if (!phone.trim()) {

            alert(
                "Phone cannot be empty."
            );

            return;
        }


        try {

            setSaving(true);


            const response =
                await axios.put(

                    `http://localhost:8081/customer/${customerId}`,

                    {
                        name:
                            name.trim(),

                        phone:
                            phone.trim()
                    },

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        }
                    }

                );


            setCustomer(
                response.data
            );


            setName(
                response.data.name || ""
            );

            setPhone(
                response.data.phone || ""
            );


            setEditing(false);


            alert(
                "Profile updated successfully."
            );

        }

        catch (error) {

            console.error(
                "Update Profile Error:",
                error
            );


            alert(
                "Unable to update profile."
            );

        }

        finally {

            setSaving(false);

        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div
                style={{
                    minHeight:
                        "calc(100vh - 80px)",

                    display:
                        "flex",

                    justifyContent:
                        "center",

                    alignItems:
                        "center",

                    backgroundColor:
                        "#f5f7fb"
                }}
            >

                <h2>
                    Loading Profile...
                </h2>

            </div>

        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div
                style={{
                    minHeight:
                        "calc(100vh - 80px)",

                    display:
                        "flex",

                    justifyContent:
                        "center",

                    alignItems:
                        "center",

                    backgroundColor:
                        "#f5f7fb"
                }}
            >

                <div
                    style={{
                        backgroundColor:
                            "white",

                        padding:
                            "40px",

                        borderRadius:
                            "15px",

                        boxShadow:
                            "0 4px 20px rgba(0,0,0,0.1)",

                        textAlign:
                            "center"
                    }}
                >

                    <h2>
                        {error}
                    </h2>

                    <button
                        onClick={
                            fetchProfile
                        }
                        style={{
                            marginTop:
                                "15px",

                            padding:
                                "10px 20px",

                            border:
                                "none",

                            borderRadius:
                                "8px",

                            backgroundColor:
                                "#2563eb",

                            color:
                                "white",

                            cursor:
                                "pointer",

                            fontSize:
                                "15px"
                        }}
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );
    }


    // ==========================================
    // PROFILE PHOTO
    // ==========================================

    const profilePhoto =
        customer?.profilePhoto;


    // ==========================================
    // PROFILE PAGE
    // ==========================================

    return (

        <div
            style={{
                minHeight:
                    "calc(100vh - 80px)",

                background:
                    "#f5f7fb",

                padding:
                    "40px 20px",

                boxSizing:
                    "border-box"
            }}
        >

            <div
                style={{
                    maxWidth:
                        "750px",

                    margin:
                        "0 auto",

                    background:
                        "white",

                    borderRadius:
                        "20px",

                    padding:
                        "35px",

                    boxShadow:
                        "0 5px 25px rgba(0,0,0,0.10)"
                }}
            >

                {/* ================================= */}
                {/* TITLE */}
                {/* ================================= */}

                <h1
                    style={{
                        textAlign:
                            "center",

                        marginTop:
                            "0",

                        marginBottom:
                            "30px",

                        color:
                            "#111827"
                    }}
                >
                    My Profile
                </h1>


                {/* ================================= */}
                {/* PROFILE PHOTO */}
                {/* ================================= */}

                <div
                    style={{
                        display:
                            "flex",

                        flexDirection:
                            "column",

                        alignItems:
                            "center",

                        marginBottom:
                            "35px"
                    }}
                >

                    <div
                        style={{
                            width:
                                "140px",

                            height:
                                "140px",

                            borderRadius:
                                "50%",

                            overflow:
                                "hidden",

                            border:
                                "5px solid #2563eb",

                            background:
                                "#e5e7eb",

                            display:
                                "flex",

                            justifyContent:
                                "center",

                            alignItems:
                                "center",

                            fontSize:
                                "55px"
                        }}
                    >

                        {profilePhoto ? (

                            <img
                                src={
                                    profilePhoto
                                }

                                alt="Profile"

                                style={{
                                    width:
                                        "100%",

                                    height:
                                        "100%",

                                    objectFit:
                                        "cover"
                                }}
                            />

                        ) : (

                            "👤"

                        )}

                    </div>


                    {/* PHOTO BUTTON */}

                    <label
                        style={{
                            marginTop:
                                "15px",

                            background:
                                "#2563eb",

                            color:
                                "white",

                            padding:
                                "10px 18px",

                            borderRadius:
                                "8px",

                            cursor:
                                "pointer",

                            fontWeight:
                                "600"
                        }}
                    >

                        📷 Change Photo

                        <input
                            type="file"

                            accept="image/*"

                            onChange={
                                changeProfilePhoto
                            }

                            style={{
                                display:
                                    "none"
                            }}
                        />

                    </label>

                </div>


                {/* ================================= */}
                {/* CUSTOMER INFORMATION */}
                {/* ================================= */}

                <div
                    style={{
                        display:
                            "grid",

                        gap:
                            "20px"
                    }}
                >

                    {/* NAME */}

                    <div>

                        <label
                            style={{
                                display:
                                    "block",

                                fontWeight:
                                    "600",

                                marginBottom:
                                    "7px",

                                color:
                                    "#374151"
                            }}
                        >
                            Full Name
                        </label>


                        {editing ? (

                            <input
                                value={
                                    name
                                }

                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }

                                style={{
                                    width:
                                        "100%",

                                    padding:
                                        "13px",

                                    boxSizing:
                                        "border-box",

                                    border:
                                        "1px solid #d1d5db",

                                    borderRadius:
                                        "8px",

                                    fontSize:
                                        "16px"
                                }}
                            />

                        ) : (

                            <div
                                style={{
                                    padding:
                                        "13px",

                                    background:
                                        "#f9fafb",

                                    borderRadius:
                                        "8px",

                                    color:
                                        "#111827"
                                }}
                            >
                                {customer?.name ||
                                    "Not available"}
                            </div>

                        )}

                    </div>


                    {/* EMAIL */}

                    <div>

                        <label
                            style={{
                                display:
                                    "block",

                                fontWeight:
                                    "600",

                                marginBottom:
                                    "7px",

                                color:
                                    "#374151"
                            }}
                        >
                            Email
                        </label>


                        <div
                            style={{
                                padding:
                                    "13px",

                                background:
                                    "#f3f4f6",

                                borderRadius:
                                    "8px",

                                color:
                                    "#4b5563"
                            }}
                        >

                            {customer?.email ||
                                "Not available"}

                        </div>


                        <small
                            style={{
                                color:
                                    "#6b7280"
                            }}
                        >
                            Email cannot be changed.
                        </small>

                    </div>


                    {/* PHONE */}

                    <div>

                        <label
                            style={{
                                display:
                                    "block",

                                fontWeight:
                                    "600",

                                marginBottom:
                                    "7px",

                                color:
                                    "#374151"
                            }}
                        >
                            Phone
                        </label>


                        {editing ? (

                            <input
                                value={
                                    phone
                                }

                                onChange={(e) =>
                                    setPhone(
                                        e.target.value
                                    )
                                }

                                style={{
                                    width:
                                        "100%",

                                    padding:
                                        "13px",

                                    boxSizing:
                                        "border-box",

                                    border:
                                        "1px solid #d1d5db",

                                    borderRadius:
                                        "8px",

                                    fontSize:
                                        "16px"
                                }}
                            />

                        ) : (

                            <div
                                style={{
                                    padding:
                                        "13px",

                                    background:
                                        "#f9fafb",

                                    borderRadius:
                                        "8px",

                                    color:
                                        "#111827"
                                }}
                            >

                                {customer?.phone ||
                                    "Not available"}

                            </div>

                        )}

                    </div>


                    {/* CUSTOMER ID */}

                    <div>

                        <label
                            style={{
                                display:
                                    "block",

                                fontWeight:
                                    "600",

                                marginBottom:
                                    "7px",

                                color:
                                    "#374151"
                            }}
                        >
                            Customer ID
                        </label>


                        <div
                            style={{
                                padding:
                                    "13px",

                                background:
                                    "#f3f4f6",

                                borderRadius:
                                    "8px",

                                color:
                                    "#4b5563"
                            }}
                        >

                            {customer?.id ||
                                "Not available"}

                        </div>

                    </div>

                </div>


                {/* ================================= */}
                {/* BUTTONS */}
                {/* ================================= */}

                <div
                    style={{
                        display:
                            "flex",

                        justifyContent:
                            "center",

                        gap:
                            "12px",

                        marginTop:
                            "30px"
                    }}
                >

                    {!editing ? (

                        <button
                            onClick={() =>
                                setEditing(true)
                            }

                            style={{
                                padding:
                                    "12px 25px",

                                border:
                                    "none",

                                borderRadius:
                                    "8px",

                                background:
                                    "#2563eb",

                                color:
                                    "white",

                                fontSize:
                                    "16px",

                                fontWeight:
                                    "600",

                                cursor:
                                    "pointer"
                            }}
                        >
                            ✏️ Edit Profile
                        </button>

                    ) : (

                        <>

                            <button
                                onClick={
                                    saveProfile
                                }

                                disabled={
                                    saving
                                }

                                style={{
                                    padding:
                                        "12px 25px",

                                    border:
                                        "none",

                                    borderRadius:
                                        "8px",

                                    background:
                                        "#16a34a",

                                    color:
                                        "white",

                                    fontSize:
                                        "16px",

                                    fontWeight:
                                        "600",

                                    cursor:
                                        "pointer"
                                }}
                            >

                                {saving
                                    ? "Saving..."
                                    : "💾 Save Changes"}

                            </button>


                            <button
                                onClick={() => {

                                    setEditing(
                                        false
                                    );

                                    setName(
                                        customer?.name ||
                                        ""
                                    );

                                    setPhone(
                                        customer?.phone ||
                                        ""
                                    );

                                }}

                                style={{
                                    padding:
                                        "12px 25px",

                                    border:
                                        "none",

                                    borderRadius:
                                        "8px",

                                    background:
                                        "#6b7280",

                                    color:
                                        "white",

                                    fontSize:
                                        "16px",

                                    fontWeight:
                                        "600",

                                    cursor:
                                        "pointer"
                                }}
                            >
                                Cancel
                            </button>

                        </>

                    )}

                </div>

            </div>

        </div>

    );
}

export default ProfilePage;