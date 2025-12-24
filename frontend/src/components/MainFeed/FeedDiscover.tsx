import { useEffect, useState } from "react";
import { useAxios } from "../../utils/useAxios";
import { useAuth } from "../../context/authContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);
import DisplayFacts from "../Blocks/DisplayFacts";

type Fact = {
    id: number;
    username: string;
    profile: {
        id: number;
        profile_image: string;
        // user: string; // TODO user URL
    };
    content: string;
    source: string;
    tags: {
        id: number;
        language: number;
        tag_name: string;
    }[];
    created_at: string;
    visibility: "public" | "private" | "followers";
    upvotes: number;
    // TODO currently is returned only `language` id
    language: number;
    // language: {
    //     code: string;
    //     flag: string;
    //     name: string;
    // };
    is_upvoted: boolean;
};

const FeedDiscover = () => {
    const [facts, setFacts] = useState<Fact[]>();
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
