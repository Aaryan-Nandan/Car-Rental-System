import axios from "axios";

const BASE_URL = "http://localhost:8081";

export const getAllVariants = async () => {

    return await axios.get(
        `${BASE_URL}/variant/all`
    );
};