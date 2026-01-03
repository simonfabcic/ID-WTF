import { useEffect, useState } from "react";
import type { Fact } from "@/types";
import { useAuth } from "../../context/authContext";
import { useAxios } from "../../utils/useAxios";
import DisplayFacts from "../Blocks/DisplayFacts";

const FeedLiked = () => {
    const [likedFacts, setLikedFacts] = useState<Fact[]>([]);
    const { user, loading } = useAuth();

    let axiosInstance = useAxios();

    let getLikedFacts = async () => {
        if (user) {
            axiosInstance
                .get(`/api/profiles/${user.user_id}/facts-liked`)
                .then((axiosResponse) => setLikedFacts(axiosResponse.data))
                .catch((error) => console.error("During getting the users liked facts, error occurred: ", error));
        }
    };

    useEffect(() => {
        if (!loading) getLikedFacts();
    }, [loading, user]);

    return likedFacts.length > 0 ? (
        <DisplayFacts facts={likedFacts} getFacts={getLikedFacts} />
    ) : (
        <div className="w-full bg-white p-6">
            <h3 className="text-2xl font-semibold mb-3">No facts yet . . .</h3>
            <p>Once you like some, they'll show up here.</p>
        </div>
    );
};

export default FeedLiked;
