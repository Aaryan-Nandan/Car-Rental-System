import axios from "axios";
import API_URL from "../config";

const BASE_URL = API_URL;

export const getAllVariants = async () => {
    return await axios.get(`${BASE_URL}/variant/all`);
};