import { useEffect, useState } from "react";
import { useAxios } from "../../utils/useAxios";
import { useAuth } from "../../context/authContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);
import DisplayFacts from "../Blocks/DisplayFacts";
import type { Fact } from "@/types";

const FeedDiscover = () => {
    const [facts, setFacts] = useState<Fact[]>([]);
    let axiosInstance = useAxios();
    const { loading } = useAuth();

    // state manager

    let getFacts = () => {
        axiosInstance
            .get(`/api/facts/`)
            .then((responseAxios) => {
                setFacts(responseAxios.data);
            })
            .catch(function (error) {
                console.error("During getting the facts, error occurred: ", error);
            });
    };

    useEffect(() => {
        if (!loading) {
            getFacts();
        }
    }, [loading]);

    return <DisplayFacts facts={facts} getFacts={getFacts} />;
};

export default FeedDiscover;
