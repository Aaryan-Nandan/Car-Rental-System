import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
}
from "chart.js";

import {
    Bar,
    Pie
}
from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function DashboardCharts({

    dashboardData

}) {

    const bookingData = {

        labels: [

            "Approved",
            "Pending",
            "Rejected"

        ],

        datasets: [

            {

                label: "Bookings",

                data: [

                    dashboardData
                        ?.approvedBookings || 0,

                    dashboardData
                        ?.pendingBookings || 0,

                    dashboardData
                        ?.rejectedBookings || 0

                ],

                backgroundColor: [

                    "#4CAF50",
                    "#FFC107",
                    "#F44336"

                ]

            }

        ]

    };

    const summaryData = {

        labels: [

            "Customers",
            "Cars",
            "Bookings",
            "Payments"

        ],

        datasets: [

            {

                label: "System Overview",

                data: [

                    dashboardData
                        ?.totalCustomers || 0,

                    dashboardData
                        ?.totalCars || 0,

                    dashboardData
                        ?.totalBookings || 0,

                    dashboardData
                        ?.totalPayments || 0

                ],

                backgroundColor: [

                    "#2196F3",
                    "#9C27B0",
                    "#4CAF50",
                    "#FF9800"

                ]

            }

        ]

    };

    return (

        <div
            style={{

                display: "flex",

                flexWrap: "wrap",

                justifyContent: "space-between",

                gap: "30px",

                marginBottom: "40px"

            }}
        >

            <div
                style={{

                    width: "48%",

                    background: "white",

                    padding: "20px",

                    borderRadius: "10px",

                    boxShadow:
                        "0 0 10px lightgray"

                }}
            >

                <h2>

                    Booking Status

                </h2>

                <Bar

                    data={bookingData}

                />

            </div>

            <div
                style={{

                    width: "48%",

                    background: "white",

                    padding: "20px",

                    borderRadius: "10px",

                    boxShadow:
                        "0 0 10px lightgray"

                }}
            >

                <h2>

                    System Overview

                </h2>

                <Pie

                    data={summaryData}

                />

            </div>

        </div>

    );

}

export default DashboardCharts;