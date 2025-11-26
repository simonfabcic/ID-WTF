import { BadgeMinus, ExternalLink, Heart, Rss, Save, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAxios } from "../../utils/useAxios";
import { useAuth } from "../../context/authContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { getUserProfileAsync } from "../../app/features/user/userDataSlice";

type Fact = {
    id: number;
    username: string;
    profile: {
        id: number;
        // user: string; // TODO user URL
    };
    content: string;
    source: string;
    tags: {
        // TODO check the content of the tags
        id: number;
        profile: string;
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
};

const FeedDiscover = () => {
    const [facts, setFacts] = useState<Fact[]>();
    let axiosInstance = useAxios();
    const { user, loading } = useAuth();

    // state manager
    const { userProfile } = useSelector((state: RootState) => state.userData);
    const dispatch = useDispatch<AppDispatch>();

    let getFacts = () => {
        axiosInstance
            .get(`${import.meta.env.VITE_API_ENDPOINT}/api/facts/`)
            .then(function (responseAxios) {
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

    return (
        <div className="flex flex-col gap-6">
            {/* fact card */}
            {facts &&
                facts.map((fact, index) => (
                    <div key={index} className="flex gap-4 bg-white rounded-lg p-4">
                        {/* fact creator image */}
                        <img
                            src="https://picsum.photos/200/200"
                            alt="profile"
                            className="w-16 h-16 rounded-full object-cover border-4 border-yellow-300"
                        />

                        {/* fact card */}
                        <div className="flex flex-col gap-4 w-full">
                            {/* fact title */}{" "}
                            <div>
                                <h3 className="font-semibold text-gray-900">{fact.username}</h3>
                                <p className="text-sm text-gray-500">{dayjs(fact.created_at).fromNow()}</p>
                            </div>
                            <p>{fact.content}</p>
                            {validator.isURL(fact.source) ? (
                                <div className="flex gap-1 text-sm">
                                    <ExternalLink className="h-4 w-4" />
                                    <a
                                        href={fact.source}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {fact.source}
                                    </a>
                                </div>
                            ) : (
                                <div>{fact.source}</div>
                            )}
                            <div className="flex gap-1.5 text-sm">
                                {fact.tags.map((tag, index) => (
                                    <div className="flex" key={index}>
                                        <span
                                            className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap"
                                            key={index}
                                        >
                                            #{tag.tag_name}
                                        </span>
                                        {fact.profile.id == user?.user_id ? (
                                            // first check the ownership -> if foreign show icon `follow` or `unfollow`
                                            <span className=" bg-yellow-100 w-3 rounded-r-full"></span>
                                        ) : userProfile?.follows.includes(tag.id) ? (
                                            <span
                                                className="flex items-center justify-around bg-gray-300 w-6 cursor-pointer rounded-r-full"
                                                onClick={() => {
                                                    axiosInstance
                                                        .post(
                                                            `${import.meta.env.VITE_API_ENDPOINT}/api/profile/${
                                                                user?.user_id
                                                            }/tag_unfollow/`,
                                                            { tag_id: tag.id }
                                                        )
                                                        .finally(() => {
                                                            dispatch(
                                                                getUserProfileAsync({
                                                                    axiosInstance,
                                                                    userID: userProfile.id,
                                                                })
                                                            );
                                                        });
                                                }}
                                            >
                                                <BadgeMinus className="h-4 w-4" />
                                            </span>
                                        ) : (
                                            <span
                                                className="flex items-center justify-around bg-gray-300 w-6 cursor-pointer rounded-r-full"
                                                onClick={() => {
                                                    axiosInstance
                                                        .post(
                                                            `${import.meta.env.VITE_API_ENDPOINT}/api/profile/${
                                                                user?.user_id
                                                            }/tag_follow/`,
                                                            { tag_id: tag.id }
                                                        )
                                                        .finally(() => {
                                                            dispatch(
                                                                getUserProfileAsync({
                                                                    axiosInstance,
                                                                    userID: userProfile?.id,
                                                                })
                                                            );
                                                        });
                                                }}
                                            >
                                                <Rss className="h-4 w-4" />
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-6">
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-0.5 cursor-pointer">
                                        <Heart className="h-4 w-4" />
                                        <span>{fact.upvotes}</span>
                                    </div>
                                    <div className="flex items-center gap-0.5 cursor-pointer">
                                        <Share2 className="h-4 w-4" />
                                        <span>
                                            Share
                                            {/* TODO create share option */}
                                        </span>
                                    </div>
                                </div>
                                <div className="cursor-pointer">
                                    <Save className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            {/* <div>
                <pre>{JSON.stringify(facts, null, 2)}</pre>
            </div> */}
        </div>
    );
};

export default FeedDiscover;
