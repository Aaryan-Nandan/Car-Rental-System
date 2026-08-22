import api from "./axiosConfig";

export const getAllVariants = async () => {
    const response = await api.get("/variant/all");
    return response.data;
};