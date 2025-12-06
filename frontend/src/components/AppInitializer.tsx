import { useEffect, type ReactNode } from "react";
import { useAxios } from "../utils/useAxios";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import { getLanguagesAsync, getTagsAsync, getUserProfileAsync } from "../app/features/user/userDataSlice";
import { useAuth } from "../context/authContext";

const AppInitializer = ({ children }: { children: ReactNode }) => {
    const axiosInstance = useAxios();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, user } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (user) {
                dispatch(getLanguagesAsync(axiosInstance));
                dispatch(getTagsAsync(axiosInstance));
                dispatch(getUserProfileAsync({ axiosInstance, userID: user?.user_id }));
            }
        }
    }, [loading, user]);

    return <>{children}</>;
};

export default AppInitializer;
