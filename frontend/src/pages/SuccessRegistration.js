import { useNavigate } from "react-router-dom";

function SuccessRegistration() {

    const navigate =
        useNavigate();

    return (

        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5"
            }}
        >

            <div
                style={{
                    width: "500px",
                    backgroundColor: "white",
                    padding: "40px",
                    borderRadius: "15px",
                    textAlign: "center",
                    boxShadow: "0px 0px 20px lightgray"
                }}
            >

                <h1
                    style={{
                        color: "green",
                        fontSize: "70px"
                    }}
                >

                    ✔

                </h1>

                <h2>

                    Account Created Successfully

                </h2>

                <p>

                    Welcome to CarRental ☺️...

                </p>

                <br />

                <button

                    onClick={() =>
                        navigate("/login")
                    }

                    style={{

                        padding: "12px 30px",

                        border: "none",

                        backgroundColor: "#1976D2",

                        color: "white",

                        borderRadius: "5px",

                        cursor: "pointer",

                        fontSize: "16px"

                    }}

                >

                    Go To Login

                </button>

            </div>

        </div>

    );

}

export default SuccessRegistration;