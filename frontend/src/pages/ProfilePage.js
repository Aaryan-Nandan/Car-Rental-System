import {
    useEffect,
    useState
}

from "react";

import axios from "axios";

function ProfilePage() {

    const [customer,
        setCustomer] =
            useState({});

    useEffect(() => {

        fetchProfile();

    }, []);

    const fetchProfile = () => {

        const customerId =
            localStorage.getItem(
                "customerId"
            );

        axios
            .get(
                `http://localhost:8081/customer/${customerId}`
            )

            .then((response) => {

                setCustomer(
                    response.data
                );
            });
    };

    return (

        <div
            style={{
                padding: "30px"
            }}
        >

            <h1>

                My Profile

            </h1>

            <br />

            <div
                style={{
                    border:
                        "1px solid lightgray",

                    padding: "20px",

                    width: "400px",

                    borderRadius:
                        "10px"
                }}
            >

                <p>

                    <b>

                        Name:

                    </b>

                    {" "}

                    {customer.name}

                </p>

                <p>

                    <b>

                        Email:

                    </b>

                    {" "}

                    {customer.email}

                </p>

                <p>

                    <b>

                        Phone:

                    </b>

                    {" "}

                    {customer.phone}

                </p>

            </div>

        </div>
    );
}

export default ProfilePage;