import { useEffect, useState } from "react";
import { useAxios } from "../../utils/useAxios";
import { useAuth } from "../../context/authContext";
import DisplayFacts from "../Blocks/DisplayFacts";

const FeedMine = () => {
    const [usersFacts, setUsersFacts] = useState([]);
    const { user } = useAuth();

    let axiosInstance = useAxios();
    const { loading } = useAuth();

    let getUsersFacts = async () => {
        if (user) {
            axiosInstance
                .get(`/api/profiles/${user.user_id}/facts`)
                .then(function (responseAxios) {
                    setUsersFacts(responseAxios.data);
                })
                .catch(function (error) {
                    console.error("During getting the users facts, error occurred: ", error);
                });
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
