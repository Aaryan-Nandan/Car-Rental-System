function LoadingSpinner() {

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "20px",
                marginBottom: "20px"
            }}
        >

            <div
                style={{
                    width: "45px",
                    height: "45px",
                    border: "5px solid #ddd",
                    borderTop: "5px solid #1976D2",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }}
            />

            <p
                style={{
                    marginTop: "15px",
                    color: "#1976D2",
                    fontWeight: "bold"
                }}
            >

                Please Wait...

            </p>

            <style>

                {`

                @keyframes spin {

                    0% {

                        transform: rotate(0deg);

                    }

                    100% {

                        transform: rotate(360deg);

                    }

                }

                `}

            </style>

        </div>

    );

}

export default LoadingSpinner;