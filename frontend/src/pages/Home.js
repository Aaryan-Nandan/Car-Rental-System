import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import { Link } from "react-router-dom";

import {
    getAllVariants
} from "../services/ApiService";

import cretaImage
    from "../assets/creta.jpg";

import venueImage
    from "../assets/venue.jpg";

import i20Image
    from "../assets/i20.jpg";

import heroVideo
    from "../assets/hero.mp4";


function Home() {

    // =========================================================
    // STATE
    // =========================================================

    const [variants, setVariants] =
        useState([]);

    const [searchText, setSearchText] =
        useState("");

    const [selectedFuel, setSelectedFuel] =
        useState("ALL");

    const [sortOption, setSortOption] =
        useState("RECOMMENDED");

    const [activeEvBenefit, setActiveEvBenefit] =
        useState(0);


    // =========================================================
    // LOAD CARS
    // =========================================================

    useEffect(() => {

        loadVariants();

    }, []);


    const loadVariants = async () => {

        try {

            const response =
                await getAllVariants();

            if (
                response &&
                Array.isArray(response.data)
            ) {

                setVariants(
                    response.data
                );

            } else {

                setVariants([]);

            }

        } catch (error) {

            console.error(
                "Unable to load cars:",
                error
            );

            setVariants([]);

        }

    };


    // =========================================================
    // EV BENEFITS
    // =========================================================

    const evBenefits = [

        {
            icon: "⚡",
            title: "Lower Running Cost",
            text:
                "Electric vehicles can reduce daily running expenses compared with conventional fuel vehicles."
        },

        {
            icon: "🌱",
            title: "Eco-Friendly Driving",
            text:
                "EVs produce no tailpipe emissions while driving and support cleaner urban mobility."
        },

        {
            icon: "🔋",
            title: "Instant Power",
            text:
                "Electric motors provide smooth and immediate acceleration for a comfortable drive."
        },

        {
            icon: "🔇",
            title: "Quiet & Smooth Ride",
            text:
                "EVs provide a quieter and smoother driving experience for customers."
        },

        {
            icon: "💰",
            title: "Lower Maintenance",
            text:
                "Electric drivetrains generally have fewer moving parts to maintain."
        },

        {
            icon: "🚗",
            title: "Future-Ready Mobility",
            text:
                "Electric vehicles are an important part of the future of modern transportation."
        }

    ];


    // =========================================================
    // ROTATE EV BENEFITS
    // =========================================================

    useEffect(() => {

        const interval =
            setInterval(() => {

                setActiveEvBenefit(
                    (previous) =>
                        (
                            previous + 1
                        ) %
                        evBenefits.length
                );

            }, 3000);


        return () => {

            clearInterval(
                interval
            );

        };

    }, [evBenefits.length]);


    // =========================================================
    // CAR IMAGE
    // =========================================================

    const getCarImage = (
        variant
    ) => {

        const name =
            (
                variant?.variantName ||
                ""
            ).toLowerCase();


        if (
            variant?.imageUrl &&
            variant.imageUrl.trim() !== ""
        ) {

            return variant.imageUrl;

        }


        if (
            name.includes("creta")
        ) {

            return cretaImage;

        }


        if (
            name.includes("venue")
        ) {

            return venueImage;

        }


        if (
            name.includes("i20")
        ) {

            return i20Image;

        }


        return cretaImage;

    };


    // =========================================================
    // FUEL TYPE
    // =========================================================

    const getFuelType = (
        variant
    ) => {

        return (
            variant?.fuelType ||
            "Other"
        );

    };


    // =========================================================
    // ELECTRIC CHECK
    // =========================================================

    const isElectric = (
        variant
    ) => {

        const fuel =
            (
                variant?.fuelType ||
                ""
            ).toLowerCase();


        return (
            fuel === "electric" ||
            fuel === "ev" ||
            fuel.includes("electric")
        );

    };


    // =========================================================
    // SEATS
    // =========================================================

    const getSeats = (
        variant
    ) => {

        return (
            variant?.seats ||
            variant?.seatCount ||
            variant?.numberOfSeats ||
            5
        );

    };


    // =========================================================
    // COMPANY
    // =========================================================

    const getCompanyName = (
        variant
    ) => {

        return (
            variant?.carCompany
                ?.companyName ||
            "Car Rental"
        );

    };


    // =========================================================
    // AVAILABLE CARS
    // =========================================================

    const getAvailableCars = (
        variant
    ) => {

        return Number(
            variant?.availableCars || 0
        );

    };


    // =========================================================
    // FILTER / SEARCH / SORT
    // =========================================================

    const filteredVariants =
        useMemo(() => {

            let result =
                [...variants];


            // SEARCH

            const search =
                searchText
                    .trim()
                    .toLowerCase();


            if (search) {

                result =
                    result.filter(
                        (variant) => {

                            const name =
                                (
                                    variant?.variantName ||
                                    ""
                                ).toLowerCase();


                            const company =
                                (
                                    variant?.carCompany
                                        ?.companyName ||
                                    ""
                                ).toLowerCase();


                            const fuel =
                                (
                                    variant?.fuelType ||
                                    ""
                                ).toLowerCase();


                            return (
                                name.includes(
                                    search
                                ) ||
                                company.includes(
                                    search
                                ) ||
                                fuel.includes(
                                    search
                                )
                            );

                        }
                    );

            }


            // FUEL FILTER

            if (
                selectedFuel !== "ALL"
            ) {

                result =
                    result.filter(
                        (variant) => {

                            const fuel =
                                (
                                    variant?.fuelType ||
                                    ""
                                ).toLowerCase();


                            if (
                                selectedFuel ===
                                "ELECTRIC"
                            ) {

                                return (
                                    fuel ===
                                    "electric" ||
                                    fuel === "ev" ||
                                    fuel.includes(
                                        "electric"
                                    )
                                );

                            }


                            return (
                                fuel ===
                                selectedFuel.toLowerCase()
                            );

                        }
                    );

            }


            // PRICE LOW

            if (
                sortOption ===
                "PRICE_LOW"
            ) {

                result.sort(
                    (a, b) =>
                        Number(
                            a.pricePerDay ||
                            0
                        ) -
                        Number(
                            b.pricePerDay ||
                            0
                        )
                );

            }


            // PRICE HIGH

            if (
                sortOption ===
                "PRICE_HIGH"
            ) {

                result.sort(
                    (a, b) =>
                        Number(
                            b.pricePerDay ||
                            0
                        ) -
                        Number(
                            a.pricePerDay ||
                            0
                        )
                );

            }


            // AVAILABLE

            if (
                sortOption ===
                "AVAILABLE"
            ) {

                result.sort(
                    (a, b) =>
                        getAvailableCars(b) -
                        getAvailableCars(a)
                );

            }


            // RECOMMENDED

            if (
                sortOption ===
                "RECOMMENDED"
            ) {

                result.sort(
                    (a, b) => {

                        const aAvailable =
                            getAvailableCars(a);

                        const bAvailable =
                            getAvailableCars(b);


                        if (
                            aAvailable > 0 &&
                            bAvailable === 0
                        ) {

                            return -1;

                        }


                        if (
                            aAvailable === 0 &&
                            bAvailable > 0
                        ) {

                            return 1;

                        }


                        return (
                            Number(a.id || 0) -
                            Number(b.id || 0)
                        );

                    }
                );

            }


            return result;

        }, [
            variants,
            searchText,
            selectedFuel,
            sortOption
        ]);


    // =========================================================
    // CURRENT EV CARS
    // =========================================================

    const electricCars =
        useMemo(() => {

            return variants.filter(
                (variant) =>
                    isElectric(variant)
            );

        }, [variants]);


    // =========================================================
    // STATISTICS
    // =========================================================

    const totalVariants =
        variants.length;


    const availableCars =
        variants.reduce(
            (
                total,
                variant
            ) =>
                total +
                getAvailableCars(
                    variant
                ),
            0
        );


    const electricCount =
        variants.filter(
            (variant) =>
                isElectric(variant)
        ).length;


    // =========================================================
    // 25 COMING SOON CARS
    // =========================================================

    const comingSoonCars = [

        // =====================================================
        // 9 EV
        // =====================================================

        {
            name: "Tata Nexon EV",
            company: "Tata Motors",
            fuel: "ELECTRIC",
            seats: 5,
            icon: "⚡"
        },

        {
            name: "Tata Curvv EV",
            company: "Tata Motors",
            fuel: "ELECTRIC",
            seats: 5,
            icon: "⚡"
        },

        {
            name: "MG ZS EV",
            company: "MG",
            fuel: "ELECTRIC",
            seats: 5,
            icon: "⚡"
        },

        {
            name: "MG Comet EV",
            company: "MG",
            fuel: "ELECTRIC",
            seats: 4,
            icon: "⚡"
        },

        {
            name: "Hyundai Ioniq 5",
            company: "Hyundai",
            fuel: "ELECTRIC",
            seats: 5,
            icon: "⚡"
        },

        {
            name: "Mahindra XUV400 EV",
            company: "Mahindra",
            fuel: "ELECTRIC",
            seats: 5,
            icon: "⚡"
        },

        {
            name: "BYD Atto 3",
            company: "BYD",
            fuel: "ELECTRIC",
            seats: 5,
            icon: "⚡"
        },

        {
            name: "Tata Tiago EV",
            company: "Tata Motors",
            fuel: "ELECTRIC",
            seats: 5,
            icon: "⚡"
        },

        {
            name: "Citroen eC3",
            company: "Citroen",
            fuel: "ELECTRIC",
            seats: 5,
            icon: "⚡"
        },


        // =====================================================
        // 11 CNG
        // =====================================================

        {
            name: "Maruti Brezza CNG",
            company: "Maruti Suzuki",
            fuel: "CNG",
            seats: 5,
            icon: "🌱"
        },

        {
            name: "Maruti Ertiga CNG",
            company: "Maruti Suzuki",
            fuel: "CNG",
            seats: 7,
            icon: "🌱"
        },

        {
            name: "Maruti WagonR CNG",
            company: "Maruti Suzuki",
            fuel: "CNG",
            seats: 5,
            icon: "🌱"
        },

        {
            name: "Maruti Swift CNG",
            company: "Maruti Suzuki",
            fuel: "CNG",
            seats: 5,
            icon: "🌱"
        },

        {
            name: "Maruti Dzire CNG",
            company: "Maruti Suzuki",
            fuel: "CNG",
            seats: 5,
            icon: "🌱"
        },

        {
            name: "Hyundai Aura CNG",
            company: "Hyundai",
            fuel: "CNG",
            seats: 5,
            icon: "🌱"
        },

        {
            name: "Hyundai Grand i10 CNG",
            company: "Hyundai",
            fuel: "CNG",
            seats: 5,
            icon: "🌱"
        },

        {
            name: "Tata Tiago CNG",
            company: "Tata Motors",
            fuel: "CNG",
            seats: 5,
            icon: "🌱"
        },

        {
            name: "Tata Tigor CNG",
            company: "Tata Motors",
            fuel: "CNG",
            seats: 5,
            icon: "🌱"
        },

        {
            name: "Toyota Glanza CNG",
            company: "Toyota",
            fuel: "CNG",
            seats: 5,
            icon: "🌱"
        },

        {
            name: "Toyota Urban Cruiser CNG",
            company: "Toyota",
            fuel: "CNG",
            seats: 5,
            icon: "🌱"
        },


        // =====================================================
        // 3 PETROL
        // =====================================================

        {
            name: "Hyundai Verna",
            company: "Hyundai",
            fuel: "PETROL",
            seats: 5,
            icon: "⛽"
        },

        {
            name: "Kia Seltos",
            company: "Kia",
            fuel: "PETROL",
            seats: 5,
            icon: "⛽"
        },

        {
            name: "Hyundai Creta",
            company: "Hyundai",
            fuel: "PETROL",
            seats: 5,
            icon: "⛽"
        },


        // =====================================================
        // 2 DIESEL
        // =====================================================

        {
            name: "Mahindra Scorpio",
            company: "Mahindra",
            fuel: "DIESEL",
            seats: 7,
            icon: "🛢️"
        },

        {
            name: "Toyota Fortuner",
            company: "Toyota",
            fuel: "DIESEL",
            seats: 7,
            icon: "🛢️"
        }

    ];


    // =========================================================
    // COMING SOON COUNTS
    // =========================================================

    const comingSoonEV =
        comingSoonCars.filter(
            car =>
                car.fuel ===
                "ELECTRIC"
        ).length;


    const comingSoonCNG =
        comingSoonCars.filter(
            car =>
                car.fuel ===
                "CNG"
        ).length;


    const comingSoonPetrol =
        comingSoonCars.filter(
            car =>
                car.fuel ===
                "PETROL"
        ).length;


    const comingSoonDiesel =
        comingSoonCars.filter(
            car =>
                car.fuel ===
                "DIESEL"
        ).length;


    // =========================================================
    // WHY CHOOSE US SCROLL
    // =========================================================

    const scrollToWhyChoose =
        () => {

            document
                .getElementById(
                    "why-choose-us"
                )
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        };


    // =========================================================
    // SCROLL CARD ANIMATION
    // =========================================================

    useEffect(() => {

        const cards =
            document.querySelectorAll(
                ".scroll-focus-card"
            );


        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "scroll-card-visible"
                                );

                            } else {

                                entry.target.classList.remove(
                                    "scroll-card-visible"
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.35
                }
            );


        cards.forEach(
            card =>
                observer.observe(card)
        );


        return () => {

            cards.forEach(
                card =>
                    observer.unobserve(card)
            );

        };

    }, [
        variants,
        comingSoonCars
    ]);


    // =========================================================
    // CSS
    // =========================================================

    const styles = `

        * {
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            margin: 0;
            padding: 0;
            font-family:
                Arial,
                Helvetica,
                sans-serif;
            background: #f5f7fb;
        }

        .home-page {
            min-height: 100vh;
            background: #f5f7fb;
            color: #111827;
            overflow-x: hidden;
        }


        /* =====================================================
           REMOVE HEADER / HERO BLACK BORDER
        ===================================================== */

        header,
        nav,
        .navbar {
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
        }


        /* =====================================================
           HERO
        ===================================================== */

        .hero-section {
            position: relative;
            width: 100%;
            height: 430px;
            overflow: hidden;
            background: #000;
            margin: 0;
            padding: 0;
            border: none;
        }

        .hero-video {
            position: absolute;

            top: 50%;
            left: 50%;

            width: 100%;
            height: 100%;

            object-fit: cover;

            transform:
                translate(-50%, -50%)
                scale(1.08);

            transform-origin: center;
        }

        .hero-overlay {
            position: absolute;

            inset: 0;

            background:
                linear-gradient(
                    90deg,
                    rgba(0,0,0,0.72),
                    rgba(0,0,0,0.35),
                    rgba(0,0,0,0.08)
                );

            display: flex;
            align-items: center;

            z-index: 2;
        }

        .hero-content {
            width: 100%;
            max-width: 1250px;

            margin: auto;

            padding:
                30px;
        }

        .hero-badge {
            display: inline-block;

            padding:
                7px 14px;

            border-radius:
                30px;

            background:
                rgba(255,255,255,0.16);

            border:
                1px solid
                rgba(255,255,255,0.30);

            color: white;

            font-size: 12px;
            font-weight: 800;

            margin-bottom: 14px;
        }

        .hero-title {
            color: white;

            font-size: 50px;

            line-height: 1.05;

            max-width: 620px;

            margin:
                0 0 15px;

            font-weight: 900;

            letter-spacing:
                -1px;
        }

        .hero-description {
            color:
                #e5e7eb;

            font-size:
                16px;

            line-height:
                1.5;

            max-width:
                540px;

            margin:
                0 0 22px;
        }

        .hero-buttons {
            display:
                flex;

            gap:
                10px;

            flex-wrap:
                wrap;
        }

        .hero-button {
            display:
                inline-block;

            padding:
                11px 19px;

            border-radius:
                9px;

            text-decoration:
                none;

            font-weight:
                800;

            transition:
                0.25s ease;
        }

        .hero-button:hover {
            transform:
                translateY(-3px);
        }

        .hero-primary {
            background:
                white;

            color:
                #1d4ed8;
        }

        .hero-secondary {
            background:
                #16a34a;

            color:
                white;
        }


        /* =====================================================
           WHY BUTTON
        ===================================================== */

        .why-side-button {
            position: absolute;

            right: 18px;
            top: 50%;

            transform:
                translateY(-50%);

            z-index: 5;

            writing-mode:
                vertical-rl;

            text-orientation:
                mixed;

            border: none;

            background:
                rgba(255,255,255,0.96);

            color:
                #111827;

            padding:
                16px 11px;

            border-radius:
                17px;

            font-weight:
                900;

            font-size:
                12px;

            cursor: pointer;

            box-shadow:
                0 10px 30px
                rgba(0,0,0,0.25);

            transition:
                0.25s ease;
        }

        .why-side-button:hover {
            transform:
                translateY(-50%)
                scale(1.05);
        }


        /* =====================================================
           STATS
        ===================================================== */

        .stats-container {
            position: relative;

            max-width:
                1100px;

            margin:
                -30px auto 0;

            padding:
                0 20px;

            z-index: 5;

            display:
                grid;

            grid-template-columns:
                repeat(4,1fr);

            gap:
                13px;
        }

        .stat-card {
            background:
                white;

            border-radius:
                14px;

            padding:
                16px;

            text-align:
                center;

            box-shadow:
                0 7px 25px
                rgba(0,0,0,0.08);

            border:
                1px solid
                #e5e7eb;
        }

        .stat-icon {
            font-size:
                22px;

            margin-bottom:
                4px;
        }

        .stat-number {
            display:
                block;

            font-size:
                23px;

            font-weight:
                900;
        }

        .stat-label {
            color:
                #6b7280;

            font-size:
                12px;
        }


        /* =====================================================
           MAIN
        ===================================================== */

        .main-section {
            max-width:
                1200px;

            margin:
                55px auto 0;

            padding:
                0 20px;
        }

        .section-heading {
            text-align:
                center;

            margin-bottom:
                25px;
        }

        .section-heading h2 {
            font-size:
                34px;

            margin:
                0 0 7px;

            font-weight:
                900;
        }

        .section-heading p {
            color:
                #6b7280;

            margin:
                0;

            font-size:
                15px;
        }


        /* =====================================================
           SEARCH
        ===================================================== */

        .search-row {
            display:
                flex;

            gap:
                10px;

            margin-bottom:
                16px;
        }

        .search-input {
            flex:
                1;

            min-width:
                0;

            padding:
                13px 16px;

            border:
                1px solid
                #d1d5db;

            border-radius:
                9px;

            font-size:
                14px;

            background:
                white;

            outline:
                none;
        }

        .sort-select {
            padding:
                13px 14px;

            border:
                1px solid
                #d1d5db;

            border-radius:
                9px;

            background:
                white;

            font-size:
                13px;

            cursor:
                pointer;
        }


        /* =====================================================
           FILTER
        ===================================================== */

        .filter-row {
            display:
                flex;

            justify-content:
                center;

            gap:
                8px;

            flex-wrap:
                wrap;

            margin-bottom:
                22px;
        }

        .filter-button {
            padding:
                9px 15px;

            border-radius:
                25px;

            cursor:
                pointer;

            font-weight:
                700;

            border:
                1px solid
                #d1d5db;

            background:
                white;

            color:
                #374151;
        }

        .filter-button.active {
            background:
                #2563eb;

            color:
                white;

            border-color:
                #2563eb;
        }


        /* =====================================================
           RESULT
        ===================================================== */

        .result-row {
            display:
                flex;

            justify-content:
                space-between;

            margin-bottom:
                13px;
        }

        .result-count {
            color:
                #6b7280;

            font-size:
                13px;
        }


        /* =====================================================
           CAR GRID
        ===================================================== */

        .car-grid {
            display:
                grid;

            grid-template-columns:
                repeat(3,minmax(0,1fr));

            gap:
                20px;
        }


        /* =====================================================
           PHONEPAY STYLE SCROLL FOCUS
        ===================================================== */

        .scroll-focus-card {
            transform:
                scale(0.91);

            opacity:
                0.70;

            transition:
                transform
                0.70s cubic-bezier(
                    0.22,
                    1,
                    0.36,
                    1
                ),
                opacity
                0.70s ease;

            will-change:
                transform;
        }

        .scroll-focus-card.scroll-card-visible {
            transform:
                scale(1);

            opacity:
                1;
        }


        /* =====================================================
           CAR CARD
        ===================================================== */

        .car-card {
            background:
                white;

            border:
                1px solid
                #e5e7eb;

            border-radius:
                17px;

            overflow:
                hidden;

            box-shadow:
                0 7px 25px
                rgba(0,0,0,0.07);

            transition:
                box-shadow
                0.3s ease;
        }

        .car-card:hover {
            box-shadow:
                0 15px 40px
                rgba(0,0,0,0.13);
        }

        .car-image-container {
            position:
                relative;

            height:
                220px;

            background:
                #eef2f7;

            overflow:
                hidden;
        }

        .car-image {
            width:
                100%;

            height:
                100%;

            object-fit:
                cover;

            display:
                block;

            transition:
                transform
                0.5s ease;
        }

        .car-card:hover
        .car-image {
            transform:
                scale(1.06);
        }

        .fuel-badge {
            position:
                absolute;

            top:
                11px;

            left:
                11px;

            padding:
                6px 10px;

            border-radius:
                18px;

            color:
                white;

            background:
                rgba(17,24,39,0.92);

            font-size:
                11px;

            font-weight:
                800;

            z-index:
                2;
        }

        .fuel-badge.ev {
            background:
                #16a34a;
        }

        .availability-badge {
            position:
                absolute;

            top:
                11px;

            right:
                11px;

            padding:
                6px 10px;

            border-radius:
                18px;

            color:
                white;

            font-size:
                11px;

            font-weight:
                800;

            z-index:
                2;
        }

        .availability-badge.available {
            background:
                #16a34a;
        }

        .availability-badge.booked {
            background:
                #dc2626;
        }

        .car-body {
            padding:
                17px;
        }

        .car-title-row {
            display:
                flex;

            justify-content:
                space-between;

            gap:
                10px;
        }

        .car-name {
            margin:
                0 0 4px;

            font-size:
                20px;

            font-weight:
                900;
        }

        .car-company {
            margin:
                0;

            color:
                #6b7280;

            font-size:
                13px;
        }

        .car-features {
            display:
                flex;

            flex-wrap:
                wrap;

            gap:
                6px;

            margin:
                14px 0;
        }

        .feature {
            background:
                #f3f4f6;

            padding:
                6px 8px;

            border-radius:
                7px;

            font-size:
                11px;

            color:
                #374151;

            font-weight:
                600;
        }

        .price-row {
            display:
                flex;

            justify-content:
                space-between;

            align-items:
                flex-end;

            margin-bottom:
                14px;
        }

        .price {
            font-size:
                23px;

            font-weight:
                900;
        }

        .per-day {
            color:
                #6b7280;

            font-size:
                12px;
        }

        .available-count {
            color:
                #6b7280;

            font-size:
                11px;

            text-align:
                right;
        }

        .book-button {
            display:
                block;

            width:
                100%;

            padding:
                11px;

            border:
                none;

            border-radius:
                8px;

            color:
                white;

            text-align:
                center;

            text-decoration:
                none;

            font-weight:
                800;

            cursor:
                pointer;
        }

        .book-button.normal {
            background:
                #2563eb;
        }

        .book-button.ev {
            background:
                #16a34a;
        }

        .book-button.disabled {
            background:
                #9ca3af;

            cursor:
                not-allowed;
        }


        /* =====================================================
           EV SECTION - MEDIUM SIZE
        ===================================================== */

        .ev-section {
            width:
                100%;

            max-width:
                1050px;

            margin:
                65px auto 0;

            padding:
                0 20px;
        }

        .ev-wrapper {
            width:
                100%;

            border-radius:
                22px;

            padding:
                28px;

            background:
                linear-gradient(
                    135deg,
                    #052e16,
                    #166534
                );

            color:
                white;

            box-shadow:
                0 12px 35px
                rgba(0,0,0,0.12);
        }

        .ev-heading {
            display:
                flex;

            justify-content:
                space-between;

            align-items:
                center;

            gap:
                20px;

            margin-bottom:
                20px;
        }

        .ev-heading h2 {
            margin:
                8px 0 5px;

            font-size:
                30px;
        }

        .ev-heading p {
            margin:
                0;

            color:
                #dcfce7;

            font-size:
                13px;
        }

        .ev-tag {
            display:
                inline-block;

            padding:
                5px 10px;

            border-radius:
                20px;

            background:
                rgba(255,255,255,0.14);

            font-size:
                10px;

            font-weight:
                800;
        }


        /* =====================================================
           ROTATING EV BENEFITS
        ===================================================== */

        .ev-benefit-box {
            position:
                relative;

            display:
                flex;

            align-items:
                center;

            gap:
                18px;

            min-height:
                120px;

            margin-bottom:
                22px;

            padding:
                18px 22px;

            border-radius:
                15px;

            background:
                rgba(255,255,255,0.10);

            border:
                1px solid
                rgba(255,255,255,0.16);

            overflow:
                hidden;

            animation:
                evBenefitIn
                0.6s ease;
        }

        .ev-benefit-icon {
            width:
                60px;

            height:
                60px;

            flex-shrink:
                0;

            display:
                flex;

            align-items:
                center;

            justify-content:
                center;

            border-radius:
                50%;

            background:
                rgba(255,255,255,0.15);

            font-size:
                28px;
        }

        .ev-benefit-content {
            flex:
                1;
        }

        .ev-benefit-label {
            font-size:
                9px;

            font-weight:
                900;

            letter-spacing:
                1.2px;

            color:
                #bbf7d0;
        }

        .ev-benefit-content h3 {
            margin:
                4px 0 4px;

            font-size:
                20px;
        }

        .ev-benefit-content p {
            margin:
                0;

            max-width:
                650px;

            color:
                #dcfce7;

            font-size:
                12px;

            line-height:
                1.5;
        }

        .ev-benefit-dots {
            display:
                flex;

            gap:
                5px;

            align-self:
                flex-end;
        }

        .benefit-dot {
            width:
                6px;

            height:
                6px;

            border-radius:
                50%;

            background:
                rgba(255,255,255,0.35);

            transition:
                0.3s ease;
        }

        .benefit-dot.active {
            width:
                17px;

            border-radius:
                10px;

            background:
                white;
        }

        @keyframes evBenefitIn {

            from {
                opacity: 0;

                transform:
                    translateY(8px);
            }

            to {
                opacity: 1;

                transform:
                    translateY(0);
            }

        }


        /* =====================================================
           EV GRID
        ===================================================== */

        .ev-grid {
            display:
                grid;

            grid-template-columns:
                repeat(3,1fr);

            gap:
                14px;
        }

        .ev-card {
            background:
                white;

            color:
                #111827;

            border-radius:
                14px;

            overflow:
                hidden;
        }

        .ev-card-image {
            height:
                130px;

            background:
                #e5f5e8;
        }

        .ev-card-image img {
            width:
                100%;

            height:
                100%;

            object-fit:
                cover;
        }

        .ev-card-body {
            padding:
                13px;
        }

        .ev-card-body h3 {
            margin:
                0 0 4px;

            font-size:
                16px;
        }

        .ev-card-company {
            margin:
                0 0 9px;

            color:
                #6b7280;

            font-size:
                11px;
        }

        .ev-price {
            font-weight:
                900;

            color:
                #15803d;

            font-size:
                14px;
        }


        /* =====================================================
           COMING SOON
        ===================================================== */

        .coming-section {
            max-width:
                1200px;

            margin:
                70px auto 0;

            padding:
                0 20px;
        }

        .coming-header {
            display:
                flex;

            justify-content:
                space-between;

            align-items:
                flex-end;

            margin-bottom:
                22px;

            gap:
                20px;
        }

        .coming-header h2 {
            margin:
                0 0 7px;

            font-size:
                34px;

            font-weight:
                900;
        }

        .coming-header p {
            margin:
                0;

            color:
                #6b7280;
        }

        .coming-count {
            background:
                #111827;

            color:
                white;

            padding:
                9px 14px;

            border-radius:
                11px;

            font-weight:
                800;

            white-space:
                nowrap;

            font-size:
                13px;
        }

        .fuel-summary {
            display:
                grid;

            grid-template-columns:
                repeat(4,1fr);

            gap:
                11px;

            margin-bottom:
                22px;
        }

        .fuel-summary-card {
            background:
                white;

            border:
                1px solid
                #e5e7eb;

            border-radius:
                13px;

            padding:
                13px;

            text-align:
                center;

            box-shadow:
                0 5px 18px
                rgba(0,0,0,0.05);
        }

        .fuel-summary-card strong {
            display:
                block;

            font-size:
                23px;

            margin-bottom:
                3px;
        }

        .fuel-summary-card span {
            color:
                #6b7280;

            font-size:
                12px;

            font-weight:
                700;
        }

        .coming-grid {
            display:
                grid;

            grid-template-columns:
                repeat(4,1fr);

            gap:
                16px;
        }

        .coming-card {
            position:
                relative;

            background:
                white;

            border:
                1px solid
                #e5e7eb;

            border-radius:
                15px;

            padding:
                16px;

            min-height:
                160px;

            box-shadow:
                0 6px 22px
                rgba(0,0,0,0.05);

            overflow:
                hidden;
        }

        .coming-icon {
            font-size:
                27px;

            margin-bottom:
                8px;
        }

        .coming-card h3 {
            margin:
                0 0 4px;

            font-size:
                16px;
        }

        .coming-company {
            color:
                #6b7280;

            font-size:
                11px;

            margin:
                0 0 11px;
        }

        .coming-info {
            display:
                flex;

            justify-content:
                space-between;

            gap:
                8px;

            font-size:
                11px;

            font-weight:
                700;
        }

        .coming-status {
            color:
                #2563eb;
        }


        /* =====================================================
           WHY CHOOSE US
        ===================================================== */

        .why-section {
            max-width:
                1150px;

            margin:
                75px auto 0;

            padding:
                0 20px;
        }

        .why-box {
            background:
                linear-gradient(
                    135deg,
                    #111827,
                    #1f2937
                );

            color:
                white;

            border-radius:
                22px;

            padding:
                35px;

            box-shadow:
                0 15px 45px
                rgba(0,0,0,0.14);
        }

        .why-box h2 {
            margin:
                0 0 7px;

            font-size:
                31px;
        }

        .why-box > p {
            color:
                #d1d5db;

            margin:
                0 0 24px;
        }

        .why-grid {
            display:
                grid;

            grid-template-columns:
                repeat(3,1fr);

            gap:
                15px;
        }

        .why-card {
            background:
                rgba(255,255,255,0.08);

            border:
                1px solid
                rgba(255,255,255,0.10);

            border-radius:
                14px;

            padding:
                19px;
        }

        .why-card-icon {
            font-size:
                27px;

            margin-bottom:
                8px;
        }

        .why-card h3 {
            margin:
                0 0 7px;

            font-size:
                16px;
        }

        .why-card p {
            margin:
                0;

            color:
                #d1d5db;

            font-size:
                12px;

            line-height:
                1.5;
        }


        /* =====================================================
           FOOTER
        ===================================================== */

        .footer {
            margin-top:
                45px;

            background:
                #111827;

            color:
                white;
        }

        .footer-main {
            max-width:
                1200px;

            margin:
                auto;

            padding:
                45px 25px 30px;

            display:
                grid;

            grid-template-columns:
                1.5fr 1fr 1fr 1fr;

            gap:
                35px;
        }

        .footer-brand h2 {
            margin:
                0 0 11px;

            font-size:
                24px;
        }

        .footer-brand p {
            color:
                #9ca3af;

            line-height:
                1.6;

            max-width:
                350px;

            font-size:
                13px;
        }

        .footer-column h3 {
            margin:
                0 0 13px;

            font-size:
                15px;
        }

        .footer-column a {
            display:
                block;

            color:
                #9ca3af;

            text-decoration:
                none;

            font-size:
                13px;

            margin-bottom:
                9px;

            transition:
                0.2s ease;
        }

        .footer-column a:hover {
            color:
                white;

            transform:
                translateX(3px);
        }

        .footer-bottom {
            border-top:
                1px solid
                #374151;

            padding:
                16px 25px;

            text-align:
                center;

            color:
                #9ca3af;

            font-size:
                12px;
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (
            max-width: 950px
        ) {

            .hero-section {
                height:
                    400px;
            }

            .hero-title {
                font-size:
                    43px;
            }

            .stats-container {
                grid-template-columns:
                    repeat(2,1fr);
            }

            .car-grid {
                grid-template-columns:
                    repeat(2,1fr);
            }

            .coming-grid {
                grid-template-columns:
                    repeat(2,1fr);
            }

            .fuel-summary {
                grid-template-columns:
                    repeat(2,1fr);
            }

            .ev-grid {
                grid-template-columns:
                    repeat(2,1fr);
            }

            .why-grid {
                grid-template-columns:
                    repeat(2,1fr);
            }

            .footer-main {
                grid-template-columns:
                    repeat(2,1fr);
            }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (
            max-width: 650px
        ) {

            .hero-section {
                height:
                    390px;
            }

            .hero-video {
                transform:
                    translate(-50%, -50%)
                    scale(1.12);
            }

            .hero-content {
                padding:
                    25px 20px;
            }

            .hero-title {
                font-size:
                    35px;
            }

            .hero-description {
                font-size:
                    14px;
            }

            .why-side-button {
                right:
                    7px;

                font-size:
                    10px;

                padding:
                    13px 8px;
            }

            .stats-container {
                grid-template-columns:
                    repeat(2,1fr);

                padding:
                    0 12px;
            }

            .main-section {
                padding:
                    0 12px;
            }

            .search-row {
                flex-direction:
                    column;
            }

            .sort-select {
                width:
                    100%;
            }

            .filter-row {
                justify-content:
                    flex-start;

                overflow-x:
                    auto;

                flex-wrap:
                    nowrap;

                padding-bottom:
                    7px;
            }

            .filter-button {
                flex:
                    0 0 auto;
            }

            .car-grid {
                grid-template-columns:
                    1fr;
            }

            .car-image-container {
                height:
                    235px;
            }

            .ev-section {
                padding:
                    0 12px;
            }

            .ev-wrapper {
                padding:
                    22px 15px;
            }

            .ev-heading {
                flex-direction:
                    column;

                align-items:
                    flex-start;
            }

            .ev-benefit-box {
                min-height:
                    145px;

                padding:
                    17px;

                gap:
                    12px;
            }

            .ev-benefit-icon {
                width:
                    52px;

                height:
                    52px;

                font-size:
                    24px;
            }

            .ev-benefit-content h3 {
                font-size:
                    17px;
            }

            .ev-benefit-content p {
                font-size:
                    11px;
            }

            .ev-grid {
                grid-template-columns:
                    1fr 1fr;
            }

            .coming-section {
                padding:
                    0 12px;
            }

            .coming-header {
                flex-direction:
                    column;

                align-items:
                    flex-start;
            }

            .coming-grid {
                grid-template-columns:
                    1fr 1fr;

                gap:
                    11px;
            }

            .fuel-summary {
                grid-template-columns:
                    1fr 1fr;
            }

            .why-section {
                padding:
                    0 12px;
            }

            .why-box {
                padding:
                    25px 18px;
            }

            .why-grid {
                grid-template-columns:
                    1fr;
            }

            .footer-main {
                grid-template-columns:
                    1fr;

                gap:
                    24px;
            }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (
            max-width: 420px
        ) {

            .hero-section {
                height:
                    370px;
            }

            .hero-title {
                font-size:
                    31px;
            }

            .ev-grid {
                grid-template-columns:
                    1fr;
            }

            .coming-grid {
                grid-template-columns:
                    1fr;
            }

            .ev-benefit-dots {
                display:
                    none;
            }

        }

    `;


    // =========================================================
    // BOOKING CARD
    // =========================================================

    const renderCarCard =
        (variant) => {

            const available =
                getAvailableCars(
                    variant
                ) > 0;


            const electric =
                isElectric(
                    variant
                );


            const fuel =
                getFuelType(
                    variant
                );


            const seats =
                getSeats(
                    variant
                );


            const image =
                getCarImage(
                    variant
                );


            return (

                <div
                    key={variant.id}
                    className="
                        car-card
                        scroll-focus-card
                    "
                >

                    <div
                        className="
                            car-image-container
                        "
                    >

                        <img
                            src={image}
                            alt={
                                variant.variantName ||
                                "Car"
                            }
                            className="
                                car-image
                            "
                            onError={(e) => {

                                e.currentTarget.src =
                                    cretaImage;

                            }}
                        />


                        <div
                            className={
                                electric
                                    ? "fuel-badge ev"
                                    : "fuel-badge"
                            }
                        >

                            {electric
                                ? "⚡ ELECTRIC"
                                : `⛽ ${fuel}`
                            }

                        </div>


                        <div
                            className={
                                available
                                    ? "availability-badge available"
                                    : "availability-badge booked"
                            }
                        >

                            {available
                                ? "✓ Available"
                                : "✕ Booked"
                            }

                        </div>

                    </div>


                    <div
                        className="
                            car-body
                        "
                    >

                        <div
                            className="
                                car-title-row
                            "
                        >

                            <div>

                                <h3
                                    className="
                                        car-name
                                    "
                                >
                                    {
                                        variant.variantName
                                    }
                                </h3>


                                <p
                                    className="
                                        car-company
                                    "
                                >
                                    {
                                        getCompanyName(
                                            variant
                                        )
                                    }
                                </p>

                            </div>


                            {electric && (

                                <span
                                    style={{
                                        fontSize:
                                            "21px"
                                    }}
                                >
                                    ⚡
                                </span>

                            )}

                        </div>


                        <div
                            className="
                                car-features
                            "
                        >

                            <span
                                className="
                                    feature
                                "
                            >
                                {electric
                                    ? "⚡ EV"
                                    : `⛽ ${fuel}`
                                }
                            </span>


                            <span
                                className="
                                    feature
                                "
                            >
                                👥 {seats} Seats
                            </span>


                            <span
                                className="
                                    feature
                                "
                            >
                                ✓ Verified
                            </span>

                        </div>


                        <div
                            className="
                                price-row
                            "
                        >

                            <div>

                                <span
                                    className="
                                        price
                                    "
                                >

                                    ₹
                                    {Number(
                                        variant.pricePerDay ||
                                        0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}

                                </span>

                                <span
                                    className="
                                        per-day
                                    "
                                >
                                    {" "}
                                    / day
                                </span>

                            </div>


                            <div
                                className="
                                    available-count
                                "
                            >

                                {
                                    getAvailableCars(
                                        variant
                                    )
                                }

                                {" "}available

                            </div>

                        </div>


                        {available ? (

                            <Link
                                to={
                                    `/booking/${variant.id}`
                                }
                                className={
                                    electric
                                        ? "book-button ev"
                                        : "book-button normal"
                                }
                            >

                                {electric
                                    ? "⚡ Book EV"
                                    : "🚗 Book Now"
                                }

                            </Link>

                        ) : (

                            <button
                                disabled
                                className="
                                    book-button
                                    disabled
                                "
                            >
                                Currently Unavailable
                            </button>

                        )}

                    </div>

                </div>

            );

        };


    // =========================================================
    // COMING SOON CARD
    // =========================================================

    const renderComingSoonCard =
        (car, index) => {

            return (

                <div
                    key={index}
                    className="
                        coming-card
                        scroll-focus-card
                    "
                >

                    <div
                        className="
                            coming-icon
                        "
                    >
                        {car.icon}
                    </div>


                    <h3>
                        {car.name}
                    </h3>


                    <p
                        className="
                            coming-company
                        "
                    >
                        {car.company}
                    </p>


                    <div
                        className="
                            coming-info
                        "
                    >

                        <span>
                            👥 {car.seats} Seats
                        </span>


                        <span
                            className="
                                coming-status
                            "
                        >
                            Coming Soon
                        </span>

                    </div>

                </div>

            );

        };


    // =========================================================
    // RETURN
    // =========================================================

    return (

        <div
            className="
                home-page
            "
        >

            <style>
                {styles}
            </style>


            {/* =================================================
                HERO
            ================================================= */}

            <section
                className="
                    hero-section
                "
            >

                <video
                    className="
                        hero-video
                    "
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                >

                    <source
                        src={heroVideo}
                        type="video/mp4"
                    />

                </video>


                <div
                    className="
                        hero-overlay
                    "
                >

                    <div
                        className="
                            hero-content
                        "
                    >

                        <div
                            className="
                                hero-badge
                            "
                        >
                            🚗 EASY • FAST • RELIABLE
                        </div>


                        <h1
                            className="
                                hero-title
                            "
                        >

                            Rent Your
                            <br />
                            Dream Car

                        </h1>


                        <p
                            className="
                                hero-description
                            "
                        >

                            Choose from available
                            vehicles today and discover
                            our upcoming EV, CNG,
                            petrol and diesel collection.

                        </p>


                        <div
                            className="
                                hero-buttons
                            "
                        >

                            <a
                                href="#cars"
                                className="
                                    hero-button
                                    hero-primary
                                "
                            >
                                🚘 Explore Cars
                            </a>


                            <a
                                href="#coming-soon"
                                className="
                                    hero-button
                                    hero-secondary
                                "
                            >
                                🚀 Coming Soon
                            </a>

                        </div>

                    </div>

                </div>


                <button
                    className="
                        why-side-button
                    "
                    onClick={
                        scrollToWhyChoose
                    }
                >

                    ❓ Why Choose Us

                </button>

            </section>


            {/* =================================================
                STATS
            ================================================= */}

            <section
                className="
                    stats-container
                "
            >

                <div
                    className="
                        stat-card
                    "
                >

                    <div
                        className="
                            stat-icon
                        "
                    >
                        🚗
                    </div>

                    <span
                        className="
                            stat-number
                        "
                    >
                        {totalVariants}
                    </span>

                    <span
                        className="
                            stat-label
                        "
                    >
                        Booking Car Variants
                    </span>

                </div>


                <div
                    className="
                        stat-card
                    "
                >

                    <div
                        className="
                            stat-icon
                        "
                    >
                        ✓
                    </div>

                    <span
                        className="
                            stat-number
                        "
                    >
                        {availableCars}
                    </span>

                    <span
                        className="
                            stat-label
                        "
                    >
                        Cars Available
                    </span>

                </div>


                <div
                    className="
                        stat-card
                    "
                >

                    <div
                        className="
                            stat-icon
                        "
                    >
                        ⚡
                    </div>

                    <span
                        className="
                            stat-number
                        "
                    >
                        {electricCount}
                    </span>

                    <span
                        className="
                            stat-label
                        "
                    >
                        Current EV Variants
                    </span>

                </div>


                <div
                    className="
                        stat-card
                    "
                >

                    <div
                        className="
                            stat-icon
                        "
                    >
                        🚀
                    </div>

                    <span
                        className="
                            stat-number
                        "
                    >
                        25
                    </span>

                    <span
                        className="
                            stat-label
                        "
                    >
                        Coming Soon Cars
                    </span>

                </div>

            </section>


            {/* =================================================
                BOOKING CARS
            ================================================= */}

            <section
                id="cars"
                className="
                    main-section
                "
            >

                <div
                    className="
                        section-heading
                    "
                >

                    <h2>
                        🚗 Book Available Cars
                    </h2>

                    <p>
                        These vehicles are currently
                        managed by the admin and can
                        be booked.
                    </p>

                </div>


                <div
                    className="
                        search-row
                    "
                >

                    <input
                        type="text"
                        className="
                            search-input
                        "
                        placeholder="
                            🔍 Search car, company or fuel...
                        "
                        value={searchText}
                        onChange={(e) =>
                            setSearchText(
                                e.target.value
                            )
                        }
                    />


                    <select
                        className="
                            sort-select
                        "
                        value={sortOption}
                        onChange={(e) =>
                            setSortOption(
                                e.target.value
                            )
                        }
                    >

                        <option
                            value="RECOMMENDED"
                        >
                            Recommended
                        </option>

                        <option
                            value="PRICE_LOW"
                        >
                            Price: Low to High
                        </option>

                        <option
                            value="PRICE_HIGH"
                        >
                            Price: High to Low
                        </option>

                        <option
                            value="AVAILABLE"
                        >
                            Most Available
                        </option>

                    </select>

                </div>


                <div
                    className="
                        filter-row
                    "
                >

                    {[
                        [
                            "ALL",
                            "🚘 All Cars"
                        ],

                        [
                            "PETROL",
                            "⛽ Petrol"
                        ],

                        [
                            "DIESEL",
                            "🛢️ Diesel"
                        ],

                        [
                            "CNG",
                            "🌱 CNG"
                        ],

                        [
                            "ELECTRIC",
                            "⚡ Electric"
                        ]

                    ].map(
                        ([value, label]) => (

                            <button
                                key={value}
                                className={
                                    selectedFuel ===
                                    value
                                        ? "filter-button active"
                                        : "filter-button"
                                }
                                onClick={() =>
                                    setSelectedFuel(
                                        value
                                    )
                                }
                            >
                                {label}
                            </button>

                        )
                    )}

                </div>


                <div
                    className="
                        result-row
                    "
                >

                    <div
                        className="
                            result-count
                        "
                    >

                        Showing{" "}

                        <strong>
                            {
                                filteredVariants.length
                            }
                        </strong>

                        {" "}
                        booking cars

                    </div>

                </div>


                {filteredVariants.length === 0 ? (

                    <div
                        style={{
                            background:
                                "white",
                            padding:
                                "55px 20px",
                            borderRadius:
                                "15px",
                            textAlign:
                                "center"
                        }}
                    >

                        <div
                            style={{
                                fontSize:
                                    "45px"
                            }}
                        >
                            🚘
                        </div>

                        <h3>
                            No booking cars found
                        </h3>

                        <p
                            style={{
                                color:
                                    "#6b7280"
                            }}
                        >
                            Try another search
                            or filter.
                        </p>

                    </div>

                ) : (

                    <div
                        className="
                            car-grid
                        "
                    >

                        {
                            filteredVariants.map(
                                renderCarCard
                            )
                        }

                    </div>

                )}

            </section>


            {/* =================================================
                CURRENT EV SECTION
            ================================================= */}

            <section
                className="
                    ev-section
                "
            >

                <div
                    className="
                        ev-wrapper
                    "
                >

                    <div
                        className="
                            ev-heading
                        "
                    >

                        <div>

                            <span
                                className="
                                    ev-tag
                                "
                            >
                                ⚡ ELECTRIC MOBILITY
                            </span>

                            <h2>
                                Current EV Cars
                            </h2>

                            <p>
                                Discover the benefits of
                                choosing an electric rental
                                vehicle.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        ROTATING BENEFIT
                    ================================================= */}

                    <div
                        className="
                            ev-benefit-box
                        "
                        key={
                            activeEvBenefit
                        }
                    >

                        <div
                            className="
                                ev-benefit-icon
                            "
                        >

                            {
                                evBenefits[
                                    activeEvBenefit
                                ].icon
                            }

                        </div>


                        <div
                            className="
                                ev-benefit-content
                            "
                        >

                            <span
                                className="
                                    ev-benefit-label
                                "
                            >
                                WHY CHOOSE EV
                            </span>


                            <h3>

                                {
                                    evBenefits[
                                        activeEvBenefit
                                    ].title
                                }

                            </h3>


                            <p>

                                {
                                    evBenefits[
                                        activeEvBenefit
                                    ].text
                                }

                            </p>

                        </div>


                        <div
                            className="
                                ev-benefit-dots
                            "
                        >

                            {
                                evBenefits.map(
                                    (_, index) => (

                                        <span
                                            key={
                                                index
                                            }
                                            className={
                                                index ===
                                                activeEvBenefit
                                                    ? "benefit-dot active"
                                                    : "benefit-dot"
                                            }
                                        />

                                    )
                                )
                            }

                        </div>

                    </div>


                    {/* =================================================
                        CURRENT EV CARS
                    ================================================= */}

                    {electricCars.length === 0 ? (

                        <div
                            style={{
                                textAlign:
                                    "center",
                                padding:
                                    "25px"
                            }}
                        >

                            <div
                                style={{
                                    fontSize:
                                        "40px"
                                }}
                            >
                                ⚡
                            </div>

                            <h3>
                                EV Collection Coming Soon
                            </h3>

                            <p>
                                New EV vehicles will
                                appear here after admin
                                adds them.
                            </p>

                        </div>

                    ) : (

                        <div
                            className="
                                ev-grid
                            "
                        >

                            {
                                electricCars
                                    .slice(0, 6)
                                    .map(
                                        (variant) => {

                                            const available =
                                                getAvailableCars(
                                                    variant
                                                ) > 0;


                                            return (

                                                <div
                                                    key={
                                                        variant.id
                                                    }
                                                    className="
                                                        ev-card
                                                        scroll-focus-card
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            ev-card-image
                                                        "
                                                    >

                                                        <img
                                                            src={
                                                                getCarImage(
                                                                    variant
                                                                )
                                                            }
                                                            alt={
                                                                variant.variantName
                                                            }
                                                        />

                                                    </div>


                                                    <div
                                                        className="
                                                            ev-card-body
                                                        "
                                                    >

                                                        <h3>
                                                            {
                                                                variant.variantName
                                                            }
                                                        </h3>


                                                        <p
                                                            className="
                                                                ev-card-company
                                                            "
                                                        >
                                                            {
                                                                getCompanyName(
                                                                    variant
                                                                )
                                                            }
                                                        </p>


                                                        <div
                                                            className="
                                                                ev-price
                                                            "
                                                        >

                                                            ₹
                                                            {
                                                                Number(
                                                                    variant.pricePerDay ||
                                                                    0
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )
                                                            }

                                                            {" "}
                                                            / day

                                                        </div>


                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    "7px",
                                                                fontSize:
                                                                    "11px",
                                                                fontWeight:
                                                                    "800",
                                                                color:
                                                                    available
                                                                        ? "#15803d"
                                                                        : "#dc2626"
                                                            }}
                                                        >

                                                            {
                                                                available
                                                                    ? "✓ Available"
                                                                    : "✕ Booked"
                                                            }

                                                        </div>

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )
                            }

                        </div>

                    )}

                </div>

            </section>


            {/* =================================================
                COMING SOON
            ================================================= */}

            <section
                id="coming-soon"
                className="
                    coming-section
                "
            >

                <div
                    className="
                        coming-header
                    "
                >

                    <div>

                        <h2>
                            🚀 Coming Soon
                        </h2>

                        <p>
                            25 future vehicles planned
                            for our rental collection.
                        </p>

                    </div>


                    <div
                        className="
                            coming-count
                        "
                    >
                        25 Cars Planned
                    </div>

                </div>


                <div
                    className="
                        fuel-summary
                    "
                >

                    <div
                        className="
                            fuel-summary-card
                        "
                    >

                        <strong>
                            ⚡ {comingSoonEV}
                        </strong>

                        <span>
                            EV Cars
                        </span>

                    </div>


                    <div
                        className="
                            fuel-summary-card
                        "
                    >

                        <strong>
                            🌱 {comingSoonCNG}
                        </strong>

                        <span>
                            CNG Cars
                        </span>

                    </div>


                    <div
                        className="
                            fuel-summary-card
                        "
                    >

                        <strong>
                            ⛽ {comingSoonPetrol}
                        </strong>

                        <span>
                            Petrol Cars
                        </span>

                    </div>


                    <div
                        className="
                            fuel-summary-card
                        "
                    >

                        <strong>
                            🛢️ {comingSoonDiesel}
                        </strong>

                        <span>
                            Diesel Cars
                        </span>

                    </div>

                </div>


                <div
                    className="
                        coming-grid
                    "
                >

                    {
                        comingSoonCars.map(
                            renderComingSoonCard
                        )
                    }

                </div>

            </section>


            {/* =================================================
                WHY CHOOSE US
            ================================================= */}

            <section
                id="why-choose-us"
                className="
                    why-section
                "
            >

                <div
                    className="
                        why-box
                    "
                >

                    <h2>
                        ❓ Why Choose Our Car Rental?
                    </h2>

                    <p>
                        A simple and transparent rental
                        experience designed for customers.
                    </p>


                    <div
                        className="
                            why-grid
                        "
                    >

                        <div
                            className="
                                why-card
                            "
                        >

                            <div
                                className="
                                    why-card-icon
                                "
                            >
                                🔒
                            </div>

                            <h3>
                                Secure Booking
                            </h3>

                            <p>
                                Customer verification,
                                driving license checking
                                and controlled booking
                                management.
                            </p>

                        </div>


                        <div
                            className="
                                why-card
                            "
                        >

                            <div
                                className="
                                    why-card-icon
                                "
                            >
                                💳
                            </div>

                            <h3>
                                UPI Payment
                            </h3>

                            <p>
                                Convenient payment flow
                                with transaction details
                                and admin verification.
                            </p>

                        </div>


                        <div
                            className="
                                why-card
                            "
                        >

                            <div
                                className="
                                    why-card-icon
                                "
                            >
                                🚗
                            </div>

                            <h3>
                                Growing Collection
                            </h3>

                            <p>
                                EV, CNG, petrol and diesel
                                vehicles are being added
                                to expand customer choice.
                            </p>

                        </div>


                        <div
                            className="
                                why-card
                            "
                        >

                            <div
                                className="
                                    why-card-icon
                                "
                            >
                                ⚡
                            </div>

                            <h3>
                                EV Friendly
                            </h3>

                            <p>
                                A dedicated electric vehicle
                                collection for modern and
                                cleaner mobility.
                            </p>

                        </div>


                        <div
                            className="
                                why-card
                            "
                        >

                            <div
                                className="
                                    why-card-icon
                                "
                            >
                                💰
                            </div>

                            <h3>
                                Transparent Pricing
                            </h3>

                            <p>
                                Customers can see the daily
                                rental price before making
                                a booking.
                            </p>

                        </div>


                        <div
                            className="
                                why-card
                            "
                        >

                            <div
                                className="
                                    why-card-icon
                                "
                            >
                                📧
                            </div>

                            <h3>
                                Email Updates
                            </h3>

                            <p>
                                Booking and payment status
                                updates can be communicated
                                to customers.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer
                className="
                    footer
                "
            >

                <div
                    className="
                        footer-main
                    "
                >

                    <div
                        className="
                            footer-brand
                        "
                    >

                        <h2>
                            🚗 Car Rental System
                        </h2>

                        <p>
                            Find your perfect car,
                            book easily and enjoy
                            a reliable rental
                            experience.
                        </p>

                        <p>
                            Drive more.
                            Worry less.
                        </p>

                    </div>


                    <div
                        className="
                            footer-column
                        "
                    >

                        <h3>
                            Quick Links
                        </h3>

                        <a href="#cars">
                            🚘 Booking Cars
                        </a>

                        <a href="#coming-soon">
                            🚀 Coming Soon
                        </a>

                        <a href="#why-choose-us">
                            ❓ Why Choose Us
                        </a>

                        <Link
                            to="/my-bookings"
                        >
                            📋 My Bookings
                        </Link>

                        <Link
                            to="/login"
                        >
                            🔐 Login
                        </Link>

                    </div>


                    <div
                        className="
                            footer-column
                        "
                    >

                        <h3>
                            Car Types
                        </h3>

                        <a
                            href="#cars"
                            onClick={() =>
                                setSelectedFuel(
                                    "PETROL"
                                )
                            }
                        >
                            ⛽ Petrol
                        </a>

                        <a
                            href="#cars"
                            onClick={() =>
                                setSelectedFuel(
                                    "DIESEL"
                                )
                            }
                        >
                            🛢️ Diesel
                        </a>

                        <a
                            href="#cars"
                            onClick={() =>
                                setSelectedFuel(
                                    "CNG"
                                )
                            }
                        >
                            🌱 CNG
                        </a>

                        <a href="#coming-soon">
                            ⚡ Electric
                        </a>

                    </div>


                    <div
                        className="
                            footer-column
                        "
                    >

                        <h3>
                            Contact
                        </h3>

                        <a
                            href="
                                mailto:support@carrental.com
                            "
                        >
                            📧 support@carrental.com
                        </a>

                        <a
                            href="
                                tel:+919999999999
                            "
                        >
                            📞 +91 99999 99999
                        </a>

                        <a href="#cars">
                            📍 India
                        </a>

                    </div>

                </div>


                <div
                    className="
                        footer-bottom
                    "
                >

                    © 2026 Car Rental System.
                    All Rights Reserved.

                </div>

            </footer>

        </div>

    );

}


export default Home;