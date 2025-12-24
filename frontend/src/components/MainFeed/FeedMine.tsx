import { useEffect, useState } from "react";
import { useAxios } from "../../utils/useAxios";
import { useAuth } from "../../context/authContext";

const FeedMine = () => {
    const [usersFacts, setUsersFacts] = useState();
    const { user } = useAuth();

    let axiosInstance = useAxios();
    const { loading } = useAuth();
    const params = new URLSearchParams();

    let getUsersFacts = async () => {
        if (user) {
            params.append("user_id", user.user_id.toString());
            axiosInstance
                .get(`${import.meta.env.VITE_API_ENDPOINT}/api/facts/?${params.toString()}`)
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
    }, [loading]);

    return (
        <div className="w-full bg-white p-6">
            <h3 className="text-2xl font-semibold mb-3">Coming soon . . .</h3>
            <p>No facts yet. Once you add some, they’ll show up here.</p>
            {/* CONTINUE list the user's facts */}
        </div>
    );
};

export default FeedMine;
