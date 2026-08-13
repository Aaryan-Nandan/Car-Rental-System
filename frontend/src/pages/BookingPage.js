import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    GoogleMap,
    Marker,
    useJsApiLoader
} from "@react-google-maps/api";


// ============================================================
// GOOGLE MAP SETTINGS
// ============================================================

const GOOGLE_MAPS_CONFIG_URL =
    "http://localhost:8081/google-maps/config";

const GOOGLE_MAP_LIBRARIES = [
    "places"
];

// Nominatim is used only as a fallback when Google reverse geocoding
// is unavailable/restricted. This prevents the UI from showing
// "Selected Location" when an address can actually be resolved.
const NOMINATIM_REVERSE_URL =
    "https://nominatim.openstreetmap.org/reverse";

const NOMINATIM_SEARCH_URL =
    "https://nominatim.openstreetmap.org/search";


const MAP_CONTAINER_STYLE = {
    width: "100%",
    height: "280px"
};


const INDIA_CENTER = {
    lat: 22.9734,
    lng: 78.6569
};


// ============================================================
// GOOGLE MAP VIEW
// ============================================================

function GoogleMapView({
    apiKey,
    position,
    onMarkerDrag,
    onReady,
    onError
}) {

    const {
        isLoaded,
        loadError
    } = useJsApiLoader({

        id:
            "car-rental-google-map",

        googleMapsApiKey:
            apiKey,

        libraries:
            GOOGLE_MAP_LIBRARIES

    });

    useEffect(() => {

        if (isLoaded) {
            onReady();
        }

        if (loadError) {
            onError(loadError);
        }

    }, [
        isLoaded,
        loadError,
        onReady,
        onError
    ]);

    if (loadError) {

        return (

            <div
                style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "20px",
                    color: "#dc2626",
                    fontWeight: "700"
                }}
            >
                Google Maps could not be loaded.
                <br />
                Check your API key, billing and enabled APIs.
            </div>

        );
    }

    if (!isLoaded) {

        return (

            <div
                style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#64748b",
                    fontWeight: "600"
                }}
            >
                Loading Google Maps...
            </div>

        );
    }

    return (

        <GoogleMap

            mapContainerStyle={
                MAP_CONTAINER_STYLE
            }

            center={
                position
                    ? {
                        lat: position[0],
                        lng: position[1]
                    }
                    : INDIA_CENTER
            }

            zoom={
                position
                    ? 17
                    : 5
            }

            options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
                zoomControl: true,
                gestureHandling: "greedy"
            }}

        >

            {position && (

                <Marker
                    position={{
                        lat: position[0],
                        lng: position[1]
                    }}
                    draggable={true}
                    onDragEnd={onMarkerDrag}
                />

            )}

        </GoogleMap>

    );
}


// ============================================================
// BOOKING PAGE
// ============================================================

function BookingPage() {

    const {
        id
    } = useParams();


    const navigate =
        useNavigate();


    // ========================================================
    // CAR / BOOKING STATE
    // ========================================================

    const [
        fromDate,
        setFromDate
    ] = useState("");


    const [
        toDate,
        setToDate
    ] = useState("");


    const [
        license,
        setLicense
    ] = useState(null);


    const [
        totalAmount,
        setTotalAmount
    ] = useState(0);


    const [
        carVariant,
        setCarVariant
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        bookingLoading,
        setBookingLoading
    ] = useState(false);


    // ========================================================
    // GOOGLE MAP CONFIGURATION FROM SPRING BOOT
    // ========================================================

    const [
        googleMapsApiKey,
        setGoogleMapsApiKey
    ] = useState("");

    const [
        googleConfigLoading,
        setGoogleConfigLoading
    ] = useState(true);

    const [
        googleConfigError,
        setGoogleConfigError
    ] = useState("");

    const [
        googleMapsReady,
        setGoogleMapsReady
    ] = useState(false);


    // ========================================================
    // GET GOOGLE MAPS API KEY FROM SPRING BOOT
    // ========================================================

    useEffect(() => {

        let mounted = true;

        axios
            .get(
                GOOGLE_MAPS_CONFIG_URL
            )
            .then((response) => {

                const apiKey =
                    typeof response.data === "string"
                        ? response.data
                        : response.data?.apiKey ||
                          response.data?.googleMapsApiKey ||
                          response.data?.key;

                if (!apiKey || !String(apiKey).trim()) {
                    throw new Error(
                        "Google Maps API key was not returned by backend."
                    );
                }

                if (mounted) {
                    setGoogleMapsApiKey(
                        apiKey
                    );

                    setGoogleConfigError(
                        ""
                    );
                }

            })
            .catch((error) => {

                console.error(
                    "GOOGLE MAP CONFIG ERROR:",
                    error
                );

                if (mounted) {
                    setGoogleConfigError(
                        "Unable to load Google Maps configuration from backend."
                    );
                }

            })
            .finally(() => {

                if (mounted) {
                    setGoogleConfigLoading(
                        false
                    );
                }
            });

        return () => {
            mounted = false;
        };

    }, []);


    // ========================================================
    // LOCATION STATE
    // ========================================================

    const [
        position,
        setPosition
    ] = useState(null);


    const [
        locationLoading,
        setLocationLoading
    ] = useState(false);


    const [
        addressLoading,
        setAddressLoading
    ] = useState(false);


    const [
        locationConfirmed,
        setLocationConfirmed
    ] = useState(false);


    // ========================================================
    // MANUAL SEARCH
    // ========================================================

    const [
        manualAddress,
        setManualAddress
    ] = useState("");


    const [
        searchLoading,
        setSearchLoading
    ] = useState(false);


    const [
        searchMessage,
        setSearchMessage
    ] = useState("");


    // ========================================================
    // PICKUP LOCATION DETAILS
    // ========================================================

    const [
        pickupAddress,
        setPickupAddress
    ] = useState("");


    const [
        pickupLocality,
        setPickupLocality
    ] = useState("");


    const [
        pickupCity,
        setPickupCity
    ] = useState("");


    const [
        pickupDistrict,
        setPickupDistrict
    ] = useState("");


    const [
        pickupState,
        setPickupState
    ] = useState("");


    const [
        pickupPincode,
        setPickupPincode
    ] = useState("");


    const [
        pickupLatitude,
        setPickupLatitude
    ] = useState(null);


    const [
        pickupLongitude,
        setPickupLongitude
    ] = useState(null);


    // ========================================================
    // TODAY
    // ========================================================

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    // ========================================================
    // FETCH CAR
    // ========================================================

    useEffect(() => {

        setLoading(true);


        axios
            .get(
                "http://localhost:8081/variant/all"
            )

            .then(
                (response) => {

                    const selectedVariant =
                        response.data.find(
                            (variant) =>
                                variant.id ===
                                Number(id)
                        );


                    if (
                        !selectedVariant
                    ) {

                        alert(
                            "Car variant not found"
                        );


                        navigate(
                            "/"
                        );


                        return;

                    }


                    setCarVariant(
                        selectedVariant
                    );

                }
            )

            .catch(
                (error) => {

                    console.error(
                        "Error loading car:",
                        error
                    );


                    alert(
                        "Unable to load car details"
                    );

                }
            )

            .finally(
                () => {

                    setLoading(
                        false
                    );

                }
            );

    }, [
        id,
        navigate
    ]);


    // ========================================================
    // CALCULATE TOTAL AMOUNT
    // ========================================================

    useEffect(() => {

        if (
            !fromDate ||
            !toDate ||
            !carVariant
        ) {

            setTotalAmount(
                0
            );


            return;

        }


        const startDate =
            new Date(
                fromDate
            );


        const endDate =
            new Date(
                toDate
            );


        const difference =
            endDate -
            startDate;


        if (
            difference < 0
        ) {

            setTotalAmount(
                0
            );


            return;

        }


        const days =
            Math.floor(
                difference /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            ) + 1;


        const amount =
            days *
            Number(
                carVariant.pricePerDay
            );


        setTotalAmount(
            amount
        );

    }, [
        fromDate,
        toDate,
        carVariant
    ]);


    // ========================================================
    // FROM DATE
    // ========================================================

    const handleFromDateChange =
        (event) => {

            const value =
                event.target.value;


            setFromDate(
                value
            );


            if (
                toDate &&
                value > toDate
            ) {

                setToDate(
                    ""
                );

            }

        };


    // ========================================================
    // TO DATE
    // ========================================================

    const handleToDateChange =
        (event) => {

            const value =
                event.target.value;


            if (
                fromDate &&
                value < fromDate
            ) {

                alert(
                    "To Date cannot be before From Date"
                );


                return;

            }


            setToDate(
                value
            );

        };


    // ========================================================
    // LICENSE
    // ========================================================

    const handleLicenseChange =
        (event) => {

            const file =
                event.target.files[0];


            if (
                !file
            ) {

                setLicense(
                    null
                );


                return;

            }


            const allowedTypes = [

                "image/jpeg",

                "image/png",

                "application/pdf"

            ];


            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {

                alert(
                    "Please upload JPG, PNG or PDF file"
                );


                event.target.value =
                    "";


                setLicense(
                    null
                );


                return;

            }


            if (
                file.size >
                5 * 1024 * 1024
            ) {

                alert(
                    "Driving License must be less than 5 MB"
                );


                event.target.value =
                    "";


                setLicense(
                    null
                );


                return;

            }


            setLicense(
                file
            );

        };


    // ========================================================
    // CLEAR ADDRESS
    // ========================================================

    const clearAddressDetails =
        () => {

            setPickupAddress(
                ""
            );


            setPickupLocality(
                ""
            );


            setPickupCity(
                ""
            );


            setPickupDistrict(
                ""
            );


            setPickupState(
                ""
            );


            setPickupPincode(
                ""
            );


            setLocationConfirmed(
                false
            );

        };


    // ========================================================
    // GOOGLE REVERSE GEOCODING
    // ========================================================

    const applyGoogleAddress =
        (result, lat, lng, successMessage) => {

            const components =
                result?.address_components || [];

            let houseNumber = "";
            let route = "";
            let subLocality = "";
            let locality = "";
            let district = "";
            let state = "";
            let pincode = "";

            components.forEach((component) => {

                const types =
                    component.types || [];

                if (types.includes("street_number")) {
                    houseNumber = component.long_name;
                }

                if (types.includes("route")) {
                    route = component.long_name;
                }

                if (
                    types.includes("sublocality_level_1") ||
                    types.includes("sublocality") ||
                    types.includes("neighborhood") ||
                    types.includes("sublocality_level_2")
                ) {
                    if (!subLocality) {
                        subLocality = component.long_name;
                    }
                }

                if (
                    types.includes("locality") ||
                    types.includes("postal_town")
                ) {
                    if (!locality) {
                        locality = component.long_name;
                    }
                }

                if (
                    types.includes("administrative_area_level_2") ||
                    types.includes("administrative_area_level_3")
                ) {
                    if (!district) {
                        district = component.long_name;
                    }
                }

                if (types.includes("administrative_area_level_1")) {
                    state = component.long_name;
                }

                if (types.includes("postal_code")) {
                    pincode = component.long_name;
                }
            });

            const finalAddress =
                houseNumber && route
                    ? `${houseNumber}, ${route}`
                    : route ||
                      result?.formatted_address ||
                      "";

            if (!finalAddress) {
                throw new Error(
                    "Google returned a result without a usable address."
                );
            }

            setPickupAddress(finalAddress);
            setPickupLocality(subLocality || "");
            setPickupCity(locality || "");
            setPickupDistrict(district || "");
            setPickupState(state || "");
            setPickupPincode(pincode || "");
            setPickupLatitude(Number(lat));
            setPickupLongitude(Number(lng));
            setLocationConfirmed(false);

            setSearchMessage(
                successMessage ||
                "✅ Address found. Check the details and confirm the location."
            );

            return true;
        };


    // ========================================================
    // NOMINATIM FALLBACK ADDRESS PARSER
    // ========================================================

    const applyNominatimAddress =
        (data, lat, lng) => {

            const address =
                data?.address || {};

            const houseNumber =
                address.house_number ||
                "";

            const road =
                address.road ||
                address.pedestrian ||
                address.footway ||
                "";

            const finalAddress =
                houseNumber && road
                    ? `${houseNumber}, ${road}`
                    : road ||
                      data?.display_name ||
                      "";

            if (!finalAddress) {
                throw new Error(
                    "Nominatim returned no usable address."
                );
            }

            const locality =
                address.suburb ||
                address.neighbourhood ||
                address.quarter ||
                address.residential ||
                "";

            const city =
                address.city ||
                address.town ||
                address.municipality ||
                address.village ||
                address.city_district ||
                "";

            const district =
                address.state_district ||
                address.county ||
                address.district ||
                "";

            const state =
                address.state ||
                "";

            const pincode =
                address.postcode ||
                "";

            setPickupAddress(finalAddress);
            setPickupLocality(locality);
            setPickupCity(city);
            setPickupDistrict(district);
            setPickupState(state);
            setPickupPincode(pincode);
            setPickupLatitude(Number(lat));
            setPickupLongitude(Number(lng));
            setLocationConfirmed(false);

            setSearchMessage(
                "✅ Address found. Check the details and confirm the location."
            );

            console.log(
                "NOMINATIM FALLBACK ADDRESS:",
                data
            );

            return true;
        };


    // ========================================================
    // NOMINATIM REVERSE GEOCODING FALLBACK
    // ========================================================

    const reverseGeocodeWithNominatim =
        async (lat, lng) => {

            const url =
                `${NOMINATIM_REVERSE_URL}` +
                `?format=jsonv2` +
                `&lat=${encodeURIComponent(lat)}` +
                `&lon=${encodeURIComponent(lng)}` +
                `&zoom=18` +
                `&addressdetails=1` +
                `&accept-language=en`;

            const response =
                await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `Nominatim HTTP ${response.status}`
                );
            }

            const data =
                await response.json();

            return applyNominatimAddress(
                data,
                lat,
                lng
            );
        };


    // ========================================================
    // GOOGLE + FALLBACK REVERSE GEOCODING
    // ========================================================

    const reverseGeocode =
        async (lat, lng) => {

            const latitude = Number(lat);
            const longitude = Number(lng);

            if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude)
            ) {
                setSearchMessage(
                    "❌ Invalid pickup coordinates."
                );

                return false;
            }

            setAddressLoading(true);
            setLocationConfirmed(false);
            setSearchMessage(
                "📍 Finding exact address..."
            );

            try {

                if (
                    googleMapsReady &&
                    window.google &&
                    window.google.maps
                ) {

                    const geocoder =
                        new window.google.maps.Geocoder();

                    const response =
                        await geocoder.geocode({
                            location: {
                                lat: latitude,
                                lng: longitude
                            }
                        });

                    if (
                        response.results &&
                        response.results.length > 0
                    ) {

                        console.log(
                            "GOOGLE REVERSE GEOCODING:",
                            response.results[0]
                        );

                        return applyGoogleAddress(
                            response.results[0],
                            latitude,
                            longitude
                        );
                    }

                    throw new Error(
                        "Google returned no reverse-geocoding results."
                    );
                }

                throw new Error(
                    "Google Maps Geocoder is not ready."
                );

            } catch (googleError) {

                console.error(
                    "GOOGLE REVERSE GEOCODING ERROR:",
                    googleError
                );

                setSearchMessage(
                    "Google address lookup failed. Trying fallback address service..."
                );

                try {

                    return await reverseGeocodeWithNominatim(
                        latitude,
                        longitude
                    );

                } catch (fallbackError) {

                    console.error(
                        "NOMINATIM REVERSE GEOCODING ERROR:",
                        fallbackError
                    );

                    setPickupAddress("");
                    setPickupLocality("");
                    setPickupCity("");
                    setPickupDistrict("");
                    setPickupState("");
                    setPickupPincode("");
                    setPickupLatitude(latitude);
                    setPickupLongitude(longitude);
                    setLocationConfirmed(false);

                    setSearchMessage(
                        "❌ Address could not be detected. Drag the marker or search the address manually."
                    );

                    return false;
                }

            } finally {
                setAddressLoading(false);
            }
        };


    // ========================================================
    // CURRENT LOCATION
    // ========================================================

    const handleCurrentLocation =
        () => {

            if (
                !navigator.geolocation
            ) {

                alert(
                    "Your browser does not support location."
                );


                return;

            }


            if (
                !googleMapsReady
            ) {

                alert(
                    "Google Maps is still loading. Please wait."
                );


                return;

            }


            setLocationLoading(
                true
            );


            setLocationConfirmed(
                false
            );


            setSearchMessage(
                "📍 Detecting your current location..."
            );


            navigator.geolocation.getCurrentPosition(

                async (location) => {

                    const lat =
                        location.coords.latitude;


                    const lng =
                        location.coords.longitude;


                    console.log(
                        "CURRENT LOCATION:",
                        lat,
                        lng
                    );


                    setPosition([
                        lat,
                        lng
                    ]);


                    clearAddressDetails();


                    setPickupLatitude(
                        lat
                    );


                    setPickupLongitude(
                        lng
                    );


                    await reverseGeocode(
                        lat,
                        lng
                    );


                    setLocationLoading(
                        false
                    );

                },


                (error) => {

                    console.error(
                        "LOCATION ERROR:",
                        error
                    );


                    setLocationLoading(
                        false
                    );


                    if (
                        error.code ===
                        1
                    ) {

                        alert(
                            "Location permission denied. Please allow location access."
                        );

                    }

                    else if (
                        error.code ===
                        2
                    ) {

                        alert(
                            "Current location is unavailable."
                        );

                    }

                    else if (
                        error.code ===
                        3
                    ) {

                        alert(
                            "Location request timed out. Please try again."
                        );

                    }

                    else {

                        alert(
                            "Unable to get your current location."
                        );

                    }

                },

                {

                    enableHighAccuracy:
                        true,

                    timeout:
                        15000,

                    maximumAge:
                        0

                }

            );

        };


    // ========================================================
    // GOOGLE MANUAL ADDRESS SEARCH
    // ========================================================

    const searchManualAddress =
        async () => {

            const query = manualAddress.trim();

            if (query.length < 3) {
                setSearchMessage(
                    "Please enter at least 3 characters."
                );
                return;
            }

            if (!googleMapsReady || !window.google) {
                setSearchMessage(
                    "Google Maps is still loading. Please wait."
                );
                return;
            }

            setSearchLoading(true);
            setLocationConfirmed(false);
            setSearchMessage(
                "🔎 Searching Google Maps..."
            );

            try {
                const geocoder =
                    new window.google.maps.Geocoder();

                const response =
                    await geocoder.geocode({
                        address: query,
                        componentRestrictions: {
                            country: "IN"
                        }
                    });

                console.log(
                    "GOOGLE SEARCH RESULTS:",
                    response.results
                );

                if (
                    !response.results ||
                    response.results.length === 0
                ) {
                    setSearchMessage(
                        "❌ Location not found. Try adding city, district or pincode."
                    );
                    return;
                }

                const result = response.results[0];
                const location =
                    result.geometry?.location;

                if (!location) {
                    throw new Error(
                        "Google did not return coordinates."
                    );
                }

                const lat = location.lat();
                const lng = location.lng();

                setPosition([lat, lng]);

                applyGoogleAddress(
                    result,
                    lat,
                    lng
                );

                setSearchMessage(
                    "✅ Location found. Drag the marker to your exact building if needed."
                );

            } catch (error) {
                console.error(
                    "GOOGLE MANUAL SEARCH ERROR:",
                    error
                );

                try {

                    setSearchMessage(
                        "Google search failed. Trying fallback address search..."
                    );

                    const fallbackUrl =
                        `${NOMINATIM_SEARCH_URL}` +
                        `?format=jsonv2` +
                        `&q=${encodeURIComponent(query)}` +
                        `&countrycodes=in` +
                        `&addressdetails=1` +
                        `&limit=1` +
                        `&accept-language=en`;

                    const fallbackResponse =
                        await fetch(fallbackUrl);

                    if (!fallbackResponse.ok) {
                        throw new Error(
                            `Nominatim HTTP ${fallbackResponse.status}`
                        );
                    }

                    const fallbackResults =
                        await fallbackResponse.json();

                    if (
                        !Array.isArray(fallbackResults) ||
                        fallbackResults.length === 0
                    ) {
                        throw new Error(
                            "Fallback search returned no results."
                        );
                    }

                    const result =
                        fallbackResults[0];

                    const lat =
                        Number(result.lat);

                    const lng =
                        Number(result.lon);

                    if (
                        !Number.isFinite(lat) ||
                        !Number.isFinite(lng)
                    ) {
                        throw new Error(
                            "Fallback search returned invalid coordinates."
                        );
                    }

                    setPosition([lat, lng]);

                    applyNominatimAddress(
                        result,
                        lat,
                        lng
                    );

                    setSearchMessage(
                        "✅ Location found. Drag the marker to your exact building if needed."
                    );

                } catch (fallbackError) {

                    console.error(
                        "FALLBACK MANUAL SEARCH ERROR:",
                        fallbackError
                    );

                    setSearchMessage(
                        "❌ Unable to find this location. Try adding city, district or pincode."
                    );

                }

            } finally {
                setSearchLoading(false);
            }
        };


    // ========================================================
    // ENTER KEY FOR SEARCH
    // ========================================================

    const handleSearchKeyDown =
        (event) => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();


                searchManualAddress();

            }

        };


    // ========================================================
    // MARKER DRAG
    // ========================================================

    const handleMarkerDrag =
        (event) => {

            if (
                !event ||
                !event.latLng
            ) {

                return;

            }


            const lat =
                event.latLng.lat();


            const lng =
                event.latLng.lng();


            console.log(
                "MARKER MOVED:",
                lat,
                lng
            );


            setPosition([
                lat,
                lng
            ]);


            clearAddressDetails();


            setPickupLatitude(
                lat
            );


            setPickupLongitude(
                lng
            );


            reverseGeocode(
                lat,
                lng
            );

        };


    // ========================================================
    // CONFIRM PICKUP LOCATION
    // ========================================================

    const confirmLocation =
        async () => {

            if (!position) {

                alert(
                    "Please select a location on the map first."
                );

                return;
            }

            // If the address has not been populated yet, try to populate it
            // automatically before confirming the pickup location.
            if (!pickupAddress) {

                const success =
                    await reverseGeocode(
                        position[0],
                        position[1]
                    );

                if (!success) {
                    alert(
                        "Address could not be detected. Please search for the address or move the marker."
                    );

                    return;
                }
            }

            setLocationConfirmed(true);

            setSearchMessage(
                "✅ Pickup location confirmed."
            );
        };


    // ========================================================
    // BOOKING
    // ========================================================

    const handleBooking =
        async () => {

            // -----------------------------------------------
            // LOGIN
            // -----------------------------------------------

            const token =
                localStorage.getItem(
                    "token"
                );


            const customerId =
                localStorage.getItem(
                    "customerId"
                );


            if (
                !token ||
                !customerId
            ) {

                alert(
                    "Please login before booking."
                );


                navigate(
                    "/login"
                );


                return;

            }


            // -----------------------------------------------
            // CAR
            // -----------------------------------------------

            if (
                !carVariant
            ) {

                alert(
                    "Car information is not available."
                );


                return;

            }


            // -----------------------------------------------
            // FROM DATE
            // -----------------------------------------------

            if (
                !fromDate
            ) {

                alert(
                    "Please select From Date."
                );


                return;

            }


            // -----------------------------------------------
            // TO DATE
            // -----------------------------------------------

            if (
                !toDate
            ) {

                alert(
                    "Please select To Date."
                );


                return;

            }


            // -----------------------------------------------
            // DATE VALIDATION
            // -----------------------------------------------

            if (
                fromDate < today
            ) {

                alert(
                    "From Date cannot be in the past."
                );


                return;

            }


            if (
                toDate < fromDate
            ) {

                alert(
                    "To Date cannot be before From Date."
                );


                return;

            }


            // -----------------------------------------------
            // LICENSE
            // -----------------------------------------------

            if (
                !license
            ) {

                alert(
                    "Please upload Driving License."
                );


                return;

            }


            // -----------------------------------------------
            // CAR AVAILABILITY
            // -----------------------------------------------

            if (
                Number(
                    carVariant.availableCars
                ) <= 0
            ) {

                alert(
                    "No Cars Available."
                );


                return;

            }


            // -----------------------------------------------
            // PICKUP LOCATION
            // -----------------------------------------------

            if (
                !position
            ) {

                alert(
                    "Please select your pickup location."
                );


                return;

            }


            if (
                !locationConfirmed
            ) {

                alert(
                    "Please confirm your pickup location."
                );


                return;

            }


            // -----------------------------------------------
            // BOOKING DATA
            // -----------------------------------------------

            const bookingData = {

                fromDate:
                    fromDate,

                toDate:
                    toDate,

                totalAmount:
                    totalAmount,

                licenseFileName:
                    license.name,

                bookingStatus:
                    "PENDING",


                // PICKUP LOCATION

                pickupAddress:
                    pickupAddress,

                pickupLocality:
                    pickupLocality,

                pickupCity:
                    pickupCity,

                pickupDistrict:
                    pickupDistrict,

                pickupState:
                    pickupState,

                pickupPincode:
                    pickupPincode,

                pickupLatitude:
                    pickupLatitude,

                pickupLongitude:
                    pickupLongitude,


                customer: {

                    id:
                        Number(
                            customerId
                        )

                },


                carVariant: {

                    id:
                        carVariant.id

                }

            };


            console.log(
                "FINAL BOOKING DATA:",
                bookingData
            );


            setBookingLoading(
                true
            );


            try {

                const response =
                    await axios.post(

                        "http://localhost:8081/booking/add",

                        bookingData,

                        {

                            headers: {

                                Authorization:
                                    `Bearer ${token}`

                            }

                        }

                    );


                // -------------------------------------------
                // STRING RESPONSE
                // -------------------------------------------

                if (
                    typeof response.data ===
                    "string"
                ) {

                    if (
                        response.data ===
                        "No Cars Available"
                    ) {

                        alert(
                            "No Cars Available."
                        );


                        return;

                    }


                    alert(
                        response.data
                    );


                    return;

                }


                // -------------------------------------------
                // SUCCESS
                // -------------------------------------------

                alert(
                    "Booking Submitted Successfully."
                );


                navigate(
                    "/my-bookings"
                );

            }

            catch (
                error
            ) {

                console.error(
                    "BOOKING ERROR:",
                    error
                );


                if (
                    error.response
                ) {

                    console.error(
                        "BACKEND RESPONSE:",
                        error.response.data
                    );


                    if (
                        error.response.status ===
                        401
                    ) {

                        alert(
                            "Session expired. Please login again."
                        );


                        localStorage.removeItem(
                            "token"
                        );


                        localStorage.removeItem(
                            "customerId"
                        );


                        navigate(
                            "/login"
                        );


                        return;

                    }


                    if (
                        error.response.status ===
                        403
                    ) {

                        alert(
                            "You are not authorized to make this booking."
                        );


                        return;

                    }

                }


                alert(
                    "Something went wrong while booking."
                );

            }

            finally {

                setBookingLoading(
                    false
                );

            }

        };


    // ========================================================
    // LOADING
    // ========================================================

    if (
        loading
    ) {

        return (

            <div
                style={{

                    minHeight:
                        "100vh",

                    background:
                        "#f1f5f9",

                    display:
                        "flex",

                    justifyContent:
                        "center",

                    alignItems:
                        "center"

                }}
            >

                <div
                    style={{

                        background:
                            "white",

                        padding:
                            "30px",

                        borderRadius:
                            "16px",

                        textAlign:
                            "center",

                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.08)"

                    }}
                >

                    <div
                        style={{
                            fontSize:
                                "35px"
                        }}
                    >
                        🚗
                    </div>


                    <h3>
                        Loading Car Details...
                    </h3>

                </div>

            </div>

        );

    }


    // ========================================================
    // MAIN PAGE
    // ========================================================

    return (

        <div
            style={{

                minHeight:
                    "100vh",

                background:
                    "linear-gradient(135deg,#eef4ff,#f8fafc)",

                padding:
                    "35px 20px 60px",

                boxSizing:
                    "border-box"

            }}
        >

            {/* =================================================
                MEDIUM CENTERED PAGE
            ================================================= */}

            <div
                style={{

                    width:
                        "100%",

                    maxWidth:
                        "900px",

                    margin:
                        "0 auto"

                }}
            >

                {/* =================================================
                    TOP HEADER
                ================================================= */}

                <div
                    style={{

                        background:
                            "linear-gradient(135deg,#0f172a,#1d4ed8)",

                        color:
                            "white",

                        padding:
                            "22px 25px",

                        borderRadius:
                            "18px",

                        marginBottom:
                            "18px",

                        boxShadow:
                            "0 10px 30px rgba(15,23,42,0.14)"

                    }}
                >

                    <div
                        style={{

                            fontSize:
                                "10px",

                            fontWeight:
                                "800",

                            letterSpacing:
                                "1.5px",

                            opacity:
                                "0.7"

                        }}
                    >

                        CAR RENTAL SYSTEM

                    </div>


                    <h1
                        style={{

                            margin:
                                "6px 0",

                            fontSize:
                                "27px"

                        }}
                    >

                        Complete Your Booking 🚗

                    </h1>


                    {
                        carVariant && (

                            <div
                                style={{

                                    display:
                                        "flex",

                                    flexWrap:
                                        "wrap",

                                    gap:
                                        "7px"

                                }}
                            >

                                <span
                                    style={
                                        headerPill
                                    }
                                >

                                    {
                                        carVariant.variantName
                                    }

                                </span>


                                <span
                                    style={
                                        headerPill
                                    }
                                >

                                    {
                                        carVariant.fuelType ||
                                        "Car"
                                    }

                                </span>


                                <span
                                    style={
                                        headerPill
                                    }
                                >

                                    ₹
                                    {
                                        carVariant.pricePerDay
                                    }
                                    /day

                                </span>

                            </div>

                        )
                    }

                </div>


                {/* =================================================
                    MAIN WHITE CARD
                ================================================= */}

                <div
                    style={{

                        background:
                            "white",

                        borderRadius:
                            "18px",

                        padding:
                            "24px",

                        boxShadow:
                            "0 10px 35px rgba(15,23,42,0.08)"

                    }}
                >


                    {/* =================================================
                        CAR SUMMARY
                    ================================================= */}

                    {
                        carVariant && (

                            <div
                                style={{

                                    display:
                                        "grid",

                                    gridTemplateColumns:
                                        "190px 1fr",

                                    gap:
                                        "17px",

                                    background:
                                        "#f8fafc",

                                    padding:
                                        "12px",

                                    border:
                                        "1px solid #e2e8f0",

                                    borderRadius:
                                        "13px",

                                    marginBottom:
                                        "25px"

                                }}
                            >

                                <img

                                    src={
                                        carVariant.imageUrl
                                    }

                                    alt={
                                        carVariant.variantName
                                    }

                                    style={{

                                        width:
                                            "100%",

                                        height:
                                            "120px",

                                        objectFit:
                                            "cover",

                                        borderRadius:
                                            "9px"

                                    }}

                                />


                                <div>

                                    <h2
                                        style={{

                                            margin:
                                                "3px 0 9px",

                                            fontSize:
                                                "20px"

                                        }}
                                    >

                                        {
                                            carVariant.variantName
                                        }

                                    </h2>


                                    <div
                                        style={{

                                            display:
                                                "grid",

                                            gridTemplateColumns:
                                                "repeat(3,1fr)",

                                            gap:
                                                "7px"

                                        }}
                                    >

                                        <SmallInfo

                                            title="Fuel"

                                            value={
                                                carVariant.fuelType ||
                                                "N/A"
                                            }

                                        />


                                        <SmallInfo

                                            title="Per Day"

                                            value={
                                                `₹${carVariant.pricePerDay}`
                                            }

                                        />


                                        <SmallInfo

                                            title="Available"

                                            value={
                                                carVariant.availableCars
                                            }

                                        />

                                    </div>

                                </div>

                            </div>

                        )
                    }


                    {/* =================================================
                        DATES
                    ================================================= */}

                    <SectionTitle
                        icon="📅"
                        title="Rental Dates"
                    />


                    <div
                        style={{

                            display:
                                "grid",

                            gridTemplateColumns:
                                "1fr 1fr",

                            gap:
                                "14px",

                            marginBottom:
                                "25px"

                        }}
                    >

                        <DateInput

                            label="From Date"

                            value={
                                fromDate
                            }

                            min={
                                today
                            }

                            onChange={
                                handleFromDateChange
                            }

                        />


                        <DateInput

                            label="To Date"

                            value={
                                toDate
                            }

                            min={
                                fromDate ||
                                today
                            }

                            onChange={
                                handleToDateChange
                            }

                        />

                    </div>


                    {/* =================================================
                        PICKUP LOCATION
                    ================================================= */}

                    <SectionTitle
                        icon="📍"
                        title="Pickup Location"
                    />


                    <div
                        style={{

                            background:
                                "#f8fafc",

                            border:
                                "1px solid #e2e8f0",

                            borderRadius:
                                "14px",

                            padding:
                                "16px",

                            marginBottom:
                                "25px"

                        }}
                    >

                        <p
                            style={{

                                margin:
                                    "0 0 12px",

                                color:
                                    "#64748b",

                                fontSize:
                                    "12px"

                            }}
                        >

                            Select your exact pickup location.

                        </p>


                        {/* =================================================
                            LOCATION BUTTONS
                        ================================================= */}

                        <div
                            style={{

                                display:
                                    "grid",

                                gridTemplateColumns:
                                    "1fr 1fr",

                                gap:
                                    "9px",

                                marginBottom:
                                    "12px"

                            }}
                        >

                            <button

                                type="button"

                                onClick={
                                    handleCurrentLocation
                                }

                                disabled={
                                    locationLoading
                                }

                                style={
                                    secondaryButton
                                }
                            >

                                {
                                    locationLoading

                                        ? "📍 Detecting..."

                                        : "📍 Use Current Location"

                                }

                            </button>


                            <button

                                type="button"

                                onClick={() =>
                                    setSearchMessage("")
                                }

                                style={
                                    secondaryButton
                                }
                            >

                                🔎 Search Location

                            </button>

                        </div>


                        {/* =================================================
                            MANUAL SEARCH
                        ================================================= */}

                        <div
                            style={{

                                background:
                                    "white",

                                border:
                                    "1px solid #e2e8f0",

                                borderRadius:
                                    "10px",

                                padding:
                                    "12px",

                                marginBottom:
                                    "12px"

                            }}
                        >

                            <label
                                style={{

                                    display:
                                        "block",

                                    fontSize:
                                        "12px",

                                    fontWeight:
                                        "800",

                                    marginBottom:
                                        "6px",

                                    color:
                                        "#334155"

                                }}
                            >

                                Search Pickup Address

                            </label>


                            <div
                                style={{

                                    display:
                                        "flex",

                                    gap:
                                        "8px",

                                    width:
                                        "100%"

                                }}
                            >

                                <input

                                    type="text"

                                    value={
                                        manualAddress
                                    }

                                    onChange={
                                        (event) =>
                                            setManualAddress(
                                                event.target.value
                                            )
                                    }

                                    onKeyDown={
                                        handleSearchKeyDown
                                    }

                                    placeholder="Enter area, road, city or pincode"

                                    style={{

                                        flex:
                                            "1",

                                        minWidth:
                                            "0",

                                        height:
                                            "44px",

                                        border:
                                            "1px solid #cbd5e1",

                                        borderRadius:
                                            "8px",

                                        padding:
                                            "0 11px",

                                        fontSize:
                                            "13px",

                                        outline:
                                            "none",

                                        boxSizing:
                                            "border-box"

                                    }}

                                />


                                <button

                                    type="button"

                                    onClick={
                                        searchManualAddress
                                    }

                                    disabled={
                                        searchLoading
                                    }

                                    style={{

                                        width:
                                            "105px",

                                        flexShrink:
                                            "0",

                                        border:
                                            "none",

                                        borderRadius:
                                            "8px",

                                        background:
                                            "#2563eb",

                                        color:
                                            "white",

                                        fontWeight:
                                            "800",

                                        cursor:
                                            "pointer"

                                    }}
                                >

                                    {
                                        searchLoading
                                            ? "Finding..."
                                            : "Search"
                                    }

                                </button>

                            </div>


                            <div
                                style={{

                                    fontSize:
                                        "10px",

                                    color:
                                        "#64748b",

                                    marginTop:
                                        "6px"

                                }}
                            >

                                Example: Gandhi Maidan, Patna, Bihar

                            </div>


                            {
                                searchMessage && (

                                    <div
                                        style={{

                                            marginTop:
                                                "8px",

                                            padding:
                                                "8px 10px",

                                            background:
                                                "#f1f5f9",

                                            borderRadius:
                                                "7px",

                                            color:
                                                "#475569",

                                            fontSize:
                                                "11px"

                                        }}
                                    >

                                        {
                                            searchMessage
                                        }

                                    </div>

                                )
                            }

                        </div>


                        {/* =================================================
                            GOOGLE MAP
                        ================================================= */}

                        <div
                            style={{

                                width:
                                    "100%",

                                maxWidth:
                                    "720px",

                                height:
                                    "280px",

                                margin:
                                    "0 auto",

                                borderRadius:
                                    "12px",

                                overflow:
                                    "hidden",

                                border:
                                    "1px solid #cbd5e1",

                                background:
                                    "#e2e8f0"

                            }}
                        >

                            {
                                googleConfigError

                                    ? (

                                        <div
                                            style={{

                                                height:
                                                    "100%",

                                                display:
                                                    "flex",

                                                justifyContent:
                                                    "center",

                                                alignItems:
                                                    "center",

                                                textAlign:
                                                    "center",

                                                padding:
                                                    "20px",

                                                color:
                                                    "#dc2626",

                                                fontWeight:
                                                    "700"

                                            }}
                                        >

                                            {googleConfigError}

                                            <br />

                                            Check your Spring Boot Google Maps configuration.

                                        </div>

                                    )

                                    : googleConfigLoading || !googleMapsApiKey

                                        ? (

                                            <div
                                                style={{

                                                    height:
                                                        "100%",

                                                    display:
                                                        "flex",

                                                    justifyContent:
                                                        "center",

                                                    alignItems:
                                                        "center",

                                                    color:
                                                        "#64748b",

                                                    fontWeight:
                                                        "600"

                                                }}
                                            >

                                                Loading Google Maps configuration...

                                            </div>

                                        )

                                        : (

                                            <GoogleMapView

                                                apiKey={
                                                    googleMapsApiKey
                                                }

                                                position={
                                                    position
                                                }

                                                onMarkerDrag={
                                                    handleMarkerDrag
                                                }

                                                onReady={() => {
                                                    setGoogleMapsReady(true);
                                                }}

                                                onError={(error) => {
                                                    console.error(
                                                        "GOOGLE MAP ERROR:",
                                                        error
                                                    );

                                                    setGoogleMapsReady(false);
                                                }}

                                            />

                                        )

                            }

                        </div>


                        {/* =================================================
                            DRAG MESSAGE
                        ================================================= */}

                        {
                            position && (

                                <div
                                    style={{

                                        maxWidth:
                                            "720px",

                                        margin:
                                            "8px auto",

                                        padding:
                                            "8px 10px",

                                        background:
                                            "#fff7ed",

                                        border:
                                            "1px solid #fed7aa",

                                        borderRadius:
                                            "8px",

                                        color:
                                            "#9a3412",

                                        fontSize:
                                            "11px"

                                    }}
                                >

                                    💡 Drag the marker to your exact building or pickup gate.

                                </div>

                            )
                        }


                        {/* =================================================
                            CONFIRM BUTTON
                        ================================================= */}

                        {
                            position && (

                                <button

                                    type="button"

                                    onClick={
                                        confirmLocation
                                    }

                                    disabled={
                                        addressLoading
                                    }

                                    style={{

                                        width:
                                            "100%",

                                        height:
                                            "45px",

                                        border:
                                            "none",

                                        borderRadius:
                                            "9px",

                                        background:
                                            locationConfirmed

                                                ? "#16a34a"

                                                : "#0f172a",

                                        color:
                                            "white",

                                        fontWeight:
                                            "800",

                                        cursor:
                                            "pointer",

                                        marginTop:
                                            "9px"

                                    }}
                                >

                                    {
                                        addressLoading

                                            ? "🔍 Getting Address..."

                                            : locationConfirmed

                                                ? "✅ Pickup Location Confirmed"

                                                : pickupAddress
                                                ? "📍 Confirm This Location"
                                                : "📍 Get Address & Confirm"

                                    }

                                </button>

                            )
                        }


                        {/* =================================================
                            LOCATION DETAILS
                        ================================================= */}

                        {
                            pickupAddress && (

                                <div
                                    style={{

                                        marginTop:
                                            "12px",

                                        background:
                                            "#f0fdf4",

                                        border:
                                            "1px solid #bbf7d0",

                                        borderRadius:
                                            "11px",

                                        padding:
                                            "13px"

                                    }}
                                >

                                    <div
                                        style={{

                                            display:
                                                "flex",

                                            justifyContent:
                                                "space-between",

                                            alignItems:
                                                "center",

                                            marginBottom:
                                                "9px"

                                        }}
                                    >

                                        <strong
                                            style={{

                                                color:
                                                    "#166534",

                                                fontSize:
                                                    "15px"

                                            }}
                                        >

                                            📍 Selected Pickup Location

                                        </strong>


                                        {
                                            locationConfirmed && (

                                                <span
                                                    style={{

                                                        background:
                                                            "#dcfce7",

                                                        color:
                                                            "#15803d",

                                                        padding:
                                                            "4px 8px",

                                                        borderRadius:
                                                            "20px",

                                                        fontSize:
                                                            "9px",

                                                        fontWeight:
                                                            "900"

                                                    }}
                                                >

                                                    CONFIRMED

                                                </span>

                                            )
                                        }

                                    </div>


                                    {/* ADDRESS */}

                                    <div
                                        style={{

                                            background:
                                                "white",

                                            padding:
                                                "10px",

                                            borderRadius:
                                                "8px",

                                            marginBottom:
                                                "8px"

                                        }}
                                    >

                                        <div
                                            style={{

                                                fontSize:
                                                    "9px",

                                                color:
                                                    "#64748b",

                                                fontWeight:
                                                    "800",

                                                marginBottom:
                                                    "3px"

                                            }}
                                        >

                                            ADDRESS

                                        </div>


                                        <div
                                            style={{

                                                fontSize:
                                                    "13px",

                                                fontWeight:
                                                    "700",

                                                color:
                                                    "#0f172a"

                                            }}
                                        >

                                            🏠{" "}
                                            {
                                                pickupAddress
                                            }

                                        </div>

                                    </div>


                                    {/* DETAILS */}

                                    <div
                                        style={{

                                            display:
                                                "grid",

                                            gridTemplateColumns:
                                                "repeat(2,1fr)",

                                            gap:
                                                "7px"

                                        }}
                                    >

                                        <LocationBox

                                            title="Local Area"

                                            value={
                                                pickupLocality
                                            }

                                        />


                                        <LocationBox

                                            title="City"

                                            value={
                                                pickupCity
                                            }

                                        />


                                        <LocationBox

                                            title="District"

                                            value={
                                                pickupDistrict
                                            }

                                        />


                                        <LocationBox

                                            title="State"

                                            value={
                                                pickupState
                                            }

                                        />


                                        <LocationBox

                                            title="Pincode"

                                            value={
                                                pickupPincode
                                            }

                                        />

                                    </div>


                                    {
                                        pickupLatitude !==
                                            null &&

                                        pickupLongitude !==
                                            null && (

                                            <div
                                                style={{

                                                    marginTop:
                                                        "8px",

                                                    fontSize:
                                                        "10px",

                                                    color:
                                                        "#64748b"

                                                }}
                                            >

                                                Coordinates:{" "}

                                                {
                                                    Number(
                                                        pickupLatitude
                                                    ).toFixed(6)
                                                }

                                                {" , "}

                                                {
                                                    Number(
                                                        pickupLongitude
                                                    ).toFixed(6)
                                                }

                                            </div>

                                        )
                                    }

                                </div>

                            )
                        }

                    </div>


                    {/* =================================================
                        DRIVING LICENSE
                    ================================================= */}

                    <SectionTitle
                        icon="🪪"
                        title="Driving License"
                    />


                    <div
                        style={{

                            background:
                                "#f8fafc",

                            border:
                                "1px dashed #cbd5e1",

                            borderRadius:
                                "10px",

                            padding:
                                "13px",

                            marginBottom:
                                "22px"

                            }}
                    >

                        <input

                            type="file"

                            accept=".jpg,.jpeg,.png,.pdf"

                            onChange={
                                handleLicenseChange
                            }

                            style={{

                                width:
                                    "100%"

                            }}

                        />


                        {
                            license && (

                                <div
                                    style={{

                                        color:
                                            "#15803d",

                                        fontSize:
                                            "11px",

                                        fontWeight:
                                            "800",

                                        marginTop:
                                            "7px"

                                    }}
                                >

                                    ✅{" "}
                                    {
                                        license.name
                                    }

                                </div>

                            )
                        }

                    </div>


                    {/* =================================================
                        TOTAL AMOUNT
                    ================================================= */}

                    <div
                        style={{

                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

                            padding:
                                "15px",

                            background:
                                "#eff6ff",

                            border:
                                "1px solid #bfdbfe",

                            borderRadius:
                                "11px",

                            marginBottom:
                                "12px"

                        }}
                    >

                        <div>

                            <div
                                style={{

                                    color:
                                        "#64748b",

                                    fontSize:
                                        "10px",

                                    fontWeight:
                                        "800"

                                }}
                            >

                                TOTAL AMOUNT

                            </div>


                            <div
                                style={{

                                    color:
                                        "#1d4ed8",

                                    fontSize:
                                        "27px",

                                    fontWeight:
                                        "900"

                                }}
                            >

                                ₹
                                {
                                    totalAmount
                                }

                            </div>

                        </div>


                        <div
                            style={{

                                fontSize:
                                    "11px",

                                color:
                                    "#64748b"

                            }}
                        >

                            ₹
                            {
                                carVariant?.pricePerDay ||
                                0
                            }
                            /day

                        </div>

                    </div>


                    {/* =================================================
                        BOOKING BUTTON
                    ================================================= */}

                    <button

                        type="button"

                        onClick={
                            handleBooking
                        }

                        disabled={

                            bookingLoading ||

                            !carVariant ||

                            Number(
                                carVariant.availableCars
                            ) <= 0 ||

                            !locationConfirmed

                        }

                        style={{

                            width:
                                "100%",

                            height:
                                "50px",

                            border:
                                "none",

                            borderRadius:
                                "10px",

                            background:

                                bookingLoading ||
                                !carVariant ||
                                Number(
                                    carVariant.availableCars
                                ) <= 0 ||
                                !locationConfirmed

                                    ? "#94a3b8"

                                    : "linear-gradient(135deg,#16a34a,#15803d)",

                            color:
                                "white",

                            fontSize:
                                "15px",

                            fontWeight:
                                "900",

                            cursor:
                                "pointer"

                        }}
                    >

                        {
                            bookingLoading

                                ? "Submitting..."

                                : !locationConfirmed

                                    ? "📍 Confirm Pickup Location First"

                                    : "🚗 Confirm Booking"

                        }

                    </button>


                    <div
                        style={{

                            textAlign:
                                "center",

                            color:
                                "#64748b",

                            fontSize:
                                "10px",

                            marginTop:
                                "8px"

                        }}
                    >

                        Booking will be sent to the admin for approval.

                    </div>

                </div>

            </div>

        </div>

    );

}


// ============================================================
// SECTION TITLE
// ============================================================

function SectionTitle({
    icon,
    title
}) {

    return (

        <div
            style={{

                display:
                    "flex",

                alignItems:
                    "center",

                gap:
                    "7px",

                marginBottom:
                    "10px"

            }}
        >

            <span
                style={{

                    fontSize:
                        "18px"

                }}
            >

                {
                    icon
                }

            </span>


            <h2
                style={{

                    margin:
                        "0",

                    fontSize:
                        "18px",

                    color:
                        "#0f172a"

                }}
            >

                {
                    title
                }

            </h2>

        </div>

    );

}


// ============================================================
// DATE INPUT
// ============================================================

function DateInput({
    label,
    value,
    min,
    onChange
}) {

    return (

        <div>

            <label
                style={{

                    display:
                        "block",

                    fontSize:
                        "12px",

                    fontWeight:
                        "800",

                    color:
                        "#334155"

                }}
            >

                {
                    label
                }

                <span
                    style={{
                        color:
                            "#dc2626"
                    }}
                >

                    {" "}*

                </span>

            </label>


            <input

                type="date"

                min={
                    min
                }

                value={
                    value
                }

                onChange={
                    onChange
                }

                style={{

                    width:
                        "100%",

                    height:
                        "44px",

                    marginTop:
                        "6px",

                    padding:
                        "0 10px",

                    border:
                        "1px solid #cbd5e1",

                    borderRadius:
                        "8px",

                    fontSize:
                        "13px",

                    boxSizing:
                        "border-box"

                }}

            />

        </div>

    );

}


// ============================================================
// SMALL INFO
// ============================================================

function SmallInfo({
    title,
    value
}) {

    return (

        <div
            style={{

                background:
                    "white",

                border:
                    "1px solid #e2e8f0",

                borderRadius:
                    "7px",

                padding:
                    "7px"

            }}
        >

            <div
                style={{

                    fontSize:
                        "9px",

                    color:
                        "#64748b"

                }}
            >

                {
                    title
                }

            </div>


            <strong
                style={{

                    fontSize:
                        "12px"

                }}
            >

                {
                    value
                }

            </strong>

        </div>

    );

}


// ============================================================
// LOCATION BOX
// ============================================================

function LocationBox({
    title,
    value
}) {

    return (

        <div
            style={{

                background:
                    "white",

                border:
                    "1px solid #e2e8f0",

                borderRadius:
                    "7px",

                padding:
                    "8px"

            }}
        >

            <div
                style={{

                    fontSize:
                        "9px",

                    color:
                        "#64748b",

                    marginBottom:
                        "2px"

                }}
            >

                {
                    title
                }

            </div>


            <div
                style={{

                    fontSize:
                        "11px",

                    fontWeight:
                        "800",

                    color:
                        "#0f172a"

                }}
            >

                {
                    value ||
                    "Not available"
                }

            </div>

        </div>

    );

}


// ============================================================
// STYLES
// ============================================================

const headerPill = {

    background:
        "rgba(255,255,255,0.12)",

    border:
        "1px solid rgba(255,255,255,0.2)",

    padding:
        "4px 9px",

    borderRadius:
        "20px",

    fontSize:
        "10px",

    fontWeight:
        "800"

};


const secondaryButton = {

    height:
        "43px",

    border:
        "1px solid #bfdbfe",

    borderRadius:
        "8px",

    background:
        "#eff6ff",

    color:
        "#1d4ed8",

    fontWeight:
        "800",

    fontSize:
        "12px",

    cursor:
        "pointer"

};


// ============================================================
// EXPORT
// ============================================================

export default BookingPage;