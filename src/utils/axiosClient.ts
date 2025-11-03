import axios from "axios";

const axiosClient = axios.create({
    baseURL: "/api/web/v1",
    headers: { "Content-Type": "application/json" },
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
        delete axiosClient.defaults.headers.Authorization;
    }
};

export default axiosClient;