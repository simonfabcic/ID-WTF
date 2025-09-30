import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useAxios } from "../utils/useAxios";

const FeedPage = () => {
    const { user, loading } = useAuth();
    const [facts, setFacts] = useState(null);
    let axiosInstance = useAxios();

    let getFacts = async () => {
        try {
            let response = await axiosInstance.get("/api/facts");
            setFacts(await response.data);
        } catch (error) {
            console.error("During getting facts, error occurred: ", error);
        }
    };

    useEffect(() => {
        if (!loading) {
            // TODO handle different feed for authenticated and not authenticated users
            getFacts();
        }
    }, [loading]);

    return <>{facts && JSON.stringify(facts)}</>;
};

export default FeedPage;
