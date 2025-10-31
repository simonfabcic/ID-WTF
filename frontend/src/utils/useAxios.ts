import { useAuth } from "../context/authContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

export const useAxios = () => {
    const { JWTs, setJWTs, setUser, userLogout } = useAuth();
    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_ENDPOINT,
    });

    axiosInstance.interceptors.request.use(async (req) => {
        if (!JWTs) {
            return req;
        }

        const accessExp = jwtDecode(JWTs.access).exp;
        if (accessExp && dayjs.unix(accessExp).isBefore(dayjs())) {
            await axios
                .post(`${import.meta.env.VITE_API_ENDPOINT}/auth/token/refresh/`, {
                    refresh: JWTs.refresh,
                })
                .then(function (responseAxios) {
                    setUser(jwtDecode(responseAxios.data.access));
                    localStorage.setItem("JWTs", JSON.stringify(responseAxios.data));
                    setJWTs(responseAxios.data);
                    req.headers["Authorization"] = `Bearer ${responseAxios.data.access}`;
                })
                .catch(function (error) {
                    console.error("During the refreshing JWTs, error occurred: ", error);
                    // TODO handle refresh fail (user logged in on two sessions)
                });
        } else {
            req.headers["Authorization"] = `Bearer ${JWTs.access}`;
        }
        return req;
    });

    return axiosInstance;
};
