import { useEffect, type ReactNode } from "react";
import { useAxios } from "../utils/useAxios";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import { getLanguagesAsync, getTagsAsync } from "../app/features/user/userDataSlice";
import { useAuth } from "../context/authContext";

const AppInitializer = ({ children }: { children: ReactNode }) => {
    const axiosInstance = useAxios();
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            dispatch(getLanguagesAsync(axiosInstance));
            dispatch(getTagsAsync(axiosInstance));
        }
    }, [loading]);

    return <>{children}</>;
};

export default AppInitializer;
