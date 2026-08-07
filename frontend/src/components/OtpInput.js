import { useRef } from "react";

function OtpInput({

    otp,

    setOtp

}) {

    const inputs = useRef([]);

    const handleChange = (

        value,

        index

    ) => {

        if (!/^[0-9]?$/.test(value))

            return;

        const newOtp = [...otp];

        newOtp[index] = value;

        setOtp(newOtp);

        if (

            value &&
            index < 5

        ) {

            inputs.current[
                index + 1
            ].focus();

        }

    };

    const handleKeyDown = (

        e,

        index

    ) => {

        if (

            e.key === "Backspace" &&
            !otp[index] &&
            index > 0

        ) {

            inputs.current[
                index - 1
            ].focus();

        }

    };

    return (

        <div

            style={{

                display: "flex",

                justifyContent: "space-between",

                marginBottom: "20px"

            }}

        >

            {

                otp.map((digit, index) => (

                    <input

                        key={index}

                        ref={(el) =>

                            inputs.current[index] = el

                        }

                        type="text"

                        value={digit}

                        maxLength={1}

                        onChange={(e) =>

                            handleChange(

                                e.target.value,

                                index

                            )

                        }

                        onKeyDown={(e) =>

                            handleKeyDown(

                                e,

                                index

                            )

                        }

                        style={{

                            width: "50px",

                            height: "55px",

                            textAlign: "center",

                            fontSize: "22px",

                            borderRadius: "10px",

                            border: "2px solid #1976D2"

                        }}

                    />

                ))

            }

        </div>

    );

}

export default OtpInput;