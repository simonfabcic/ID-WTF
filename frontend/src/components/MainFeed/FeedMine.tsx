import { useEffect, useState } from "react";
import { useAxios } from "../../utils/useAxios";
import { useAuth } from "../../context/authContext";
import DisplayFacts from "../Blocks/DisplayFacts";
import type { Fact } from "@/types";

const FeedMine = () => {
    const [usersFacts, setUsersFacts] = useState<Fact[]>([]);
    const { user, loading } = useAuth();
    let axiosInstance = useAxios();

    let getUsersFacts = async () => {
        if (user) {
            axiosInstance
                .get(`/api/profiles/${user.user_id}/facts`)
                .then((responseAxios) => setUsersFacts(responseAxios.data))
                .catch((error) => console.error("During getting the users facts, error occurred: ", error));
        }
    };

    useEffect(() => {
        if (!loading) getUsersFacts();
    }, [loading, user]);

    return usersFacts.length > 0 ? (
        <DisplayFacts facts={usersFacts} getFacts={getUsersFacts} />
    ) : (
        <div className="w-full bg-white p-6">
            <h3 className="text-2xl font-semibold mb-3">No facts yet . . .</h3>
            <p>Once you add some, they'll show up here.</p>
        </div>
    );
};

export default FeedMine;
