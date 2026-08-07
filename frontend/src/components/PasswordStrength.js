function PasswordStrength({ password }) {

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

    let score = 0;

    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumber) score++;
    if (hasSpecialCharacter) score++;
    if (hasMinLength) score++;

    let strength = "";
    let color = "";

    if (score <= 2) {

        strength = "Weak";
        color = "red";

    } else if (score <= 4) {

        strength = "Medium";
        color = "orange";

    } else {

        strength = "Strong";
        color = "green";

    }

    return (

        <div
            style={{
                marginTop: "10px",
                marginBottom: "20px"
            }}
        >

            <div
                style={{
                    height: "10px",
                    width: "100%",
                    backgroundColor: "#ddd",
                    borderRadius: "10px",
                    overflow: "hidden"
                }}
            >

                <div
                    style={{
                        width: `${score * 20}%`,
                        height: "100%",
                        backgroundColor: color,
                        transition: "0.3s"
                    }}
                />

            </div>

            <p
                style={{
                    color: color,
                    fontWeight: "bold",
                    marginTop: "8px"
                }}
            >

                {strength} Password

            </p>

            <p>

                {hasUpperCase ? "✅" : "❌"} Uppercase Letter

            </p>

            <p>

                {hasLowerCase ? "✅" : "❌"} Lowercase Letter

            </p>

            <p>

                {hasNumber ? "✅" : "❌"} Number

            </p>

            <p>

                {hasSpecialCharacter ? "✅" : "❌"} Special Character

            </p>

            <p>

                {hasMinLength ? "✅" : "❌"} Minimum 8 Characters

            </p>

        </div>

    );

}

export default PasswordStrength;