import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

function ReviewPage() {

    const navigate =
        useNavigate();

    const {
        variantId
    } = useParams();

    const [rating,
        setRating] =
            useState("");

    const [review,
        setReview] =
            useState("");

    const submitReview = () => {

        if (!rating) {

            alert(
                "Please Select Rating"
            );

            return;
        }

        if (!review) {

            alert(
                "Please Write Review"
            );

            return;
        }

        const reviewData = {

            rating: rating,

            review: review,

            customer: {

                id:
                    localStorage.getItem(
                        "customerId"
                    )
            },

            carVariant: {

                id:
                    variantId
            }
        };

        axios

            .post(

                `${API_URL}/review/add`,

                reviewData
            )

            .then(() => {

                alert(
                    "Review Submitted Successfully"
                );

                navigate(
                    "/my-bookings"
                );
            })

            .catch(() => {

                alert(
                    "Unable To Submit Review"
                );
            });
    };

    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "600px",
                margin: "auto"
            }}
        >

            <h1>

                 Feedback

            </h1>

            <br />

            <label>

                Rating

            </label>

            <br />

            <select

                value={rating}

                onChange={(e) =>
                    setRating(
                        e.target.value
                    )
                }

                style={{
                    width: "100%",
                    padding: "12px"
                }}
            >

                <option value="">

                    Select Rating

                </option>

                <option value="5">

                    ⭐⭐⭐⭐⭐ 

                </option>

                <option value="4">

                    ⭐⭐⭐⭐ 

                </option>

                <option value="3">

                    ⭐⭐⭐ 

                </option>

                <option value="2">

                    ⭐⭐ 

                </option>

                <option value="1">

                    ⭐ 

                </option>

            </select>

            <br />
            <br />

            <label>

                Feedback

            </label>

            <br />

            <textarea

                rows="6"

                value={review}

                onChange={(e) =>
                    setReview(
                        e.target.value
                    )
                }

                placeholder="Share Your Experience..."

                style={{
                    width: "100%",
                    padding: "12px"
                }}
            />

            <br />
            <br />

            <button

                onClick={submitReview}

                style={{

                    backgroundColor:
                        "#2196F3",

                    color:
                        "white",

                    border:
                        "none",

                    padding:
                        "12px 25px",

                    borderRadius:
                        "5px",

                    cursor:
                        "pointer"
                }}
            >

                Submit Review

            </button>

        </div>
    );
}

export default ReviewPage;