import { useEffect, useState } from "react";

import axios from "axios";

function ManageReviews() {

    const [reviews, setReviews] =
        useState([]);

    const [searchText, setSearchText] =
        useState("");

    useEffect(() => {

        fetchReviews();

    }, []);

    const fetchReviews = () => {

        axios

            .get(
                "http://localhost:8081/review/all"
            )

            .then((response) => {

                setReviews(
                    response.data
                );

            })

            .catch((error) => {

                console.log(error);

            });

    };

    const deleteReview = (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this review?"
            )
        ) {
            return;
        }

        axios

            .delete(
                `http://localhost:8081/review/delete/${id}`
            )

            .then(() => {

                alert(
                    "Review Deleted Successfully"
                );

                fetchReviews();

            })

            .catch((error) => {

                console.log(error);

                alert(
                    "Unable To Delete Review"
                );

            });

    };

    return (

        <div
            style={{
                padding: "30px",
                backgroundColor: "#f5f5f5",
                minHeight: "100vh"
            }}
        >

            <h1
                style={{
                    marginBottom: "20px"
                }}
            >
                 Manage Feedback
            </h1>

            <input

                type="text"

                placeholder="Search By Customer Name"

                value={searchText}

                onChange={(e) =>
                    setSearchText(
                        e.target.value
                    )
                }

                style={{
                    width: "350px",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid gray",
                    marginBottom: "30px"
                }}

            />

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(420px,1fr))",
                    gap: "20px"
                }}
            >
                              {

                    reviews

                        .filter((review) =>

                            review.customer &&
                            review.customer.name
                                .toLowerCase()
                                .includes(
                                    searchText.toLowerCase()
                                )

                        )

                        .map((review) => (

                            <div

                                key={review.id}

                                style={{

                                    backgroundColor:
                                        "white",

                                    padding:
                                        "20px",

                                    borderRadius:
                                        "10px",

                                    boxShadow:
                                        "0 0 10px lightgray"

                                }}

                            >

                                <h2>

                                     {

                                        review.carVariant
                                            ?.variantName

                                    }

                                </h2>

                                <p>

                                    <b>

                                        Customer Name:

                                    </b>

                                    {" "}

                                    {

                                        review.customer
                                            ?.name

                                    }

                                </p>

                                <p>

                                    <b>

                                        Rating :

                                    </b>

                                    {" "}

                                    {

                                        "⭐".repeat(
                                            review.rating
                                        )

                                    }

                                </p>

                                <p>

                                    <b>

                                        Review :

                                    </b>

                                    {" "}

                                    {

                                        review.review

                                    }

                                </p>

                                <p>

                                    <b>

                                        Date :

                                    </b>

                                    {" "}

                                    {

                                        review.reviewDate

                                    }

                                </p>

                                <button

                                    onClick={() =>
                                        deleteReview(
                                            review.id
                                        )
                                    }

                                    style={{

                                        backgroundColor:
                                            "red",

                                        color:
                                            "white",

                                        border:
                                            "none",

                                        padding:
                                            "5px 10px",

                                        borderRadius:
                                            "5px",

                                        cursor:
                                            "pointer",

                                        marginTop:
                                            "10px"

                                    }}

                                >

                                     Delete Feedback

                                </button>

                            </div>

                        ))

                }

            </div>

        </div>

    );

}

export default ManageReviews;
            