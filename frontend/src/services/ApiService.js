import api from "./axiosConfig";

// ============================================================
// GET ALL CAR VARIANTS
// ============================================================

export const getAllVariants = async () => {
    const response = await api.get("/variant/all");

    return response.data;
};