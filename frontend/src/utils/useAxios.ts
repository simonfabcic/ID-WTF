import { useAuth } from "../context/authContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

export const useAxios = () => {
    const { JWTs, setJWTs, setUser } = useAuth();
    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_ENDPOINT,
    });

    axiosInstance.interceptors.request.use(async (req) => {
        if (!JWTs) {
            return req;
        }

        const accessExp = jwtDecode(JWTs.access).exp;
        if (accessExp && dayjs.unix(accessExp).isBefore(dayjs())) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/auth/token/refresh`, {
                    refresh: JWTs.refresh,
                });
                setUser(jwtDecode(response.data.access));
                localStorage.setItem("JWTS", JSON.stringify(response.data));
                setJWTs(response.data);
                req.headers["Authorization"] = `Bearer ${response.data.access}`;
            } catch (error) {
                console.error("During refreshing JWTs, error occurred: ", error);
            }
        } else {
            req.headers["Authorization"] = `Bearer ${JWTs.access}`;
        }
        return req;
    });

    return axiosInstance;
};
