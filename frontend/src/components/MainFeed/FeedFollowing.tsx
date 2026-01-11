import { useSelector } from "react-redux";
import { useAuth } from "../../context/authContext";
import type { Tag, ProfilePublic } from "../../types";
import { useAxios } from "../../utils/useAxios";
import { BadgeMinus, Rss } from "lucide-react";
import { useEffect, useState } from "react";
import type { RootState } from "@/app/store";

type UsersTags = {
    profile: ProfilePublic;
    followed_tags: Tag[];
    other_tags: Tag[];
};

const FeedFollowing = () => {
    const [usersTags, setUsersTags] = useState<UsersTags[]>([]);
    const { loading, user } = useAuth();

    const { languages } = useSelector((state: RootState) => state.userData);
    const axiosInstance = useAxios();

    const getTags = () => {
        if (user) {
            axiosInstance
                .get(`/api/profiles/${user.user_id}/tags-followed`)
                .then((axiosResponse) => {
                    setUsersTags(axiosResponse.data);
                })
                .catch((error) => {
                    if (error.response?.status === 501) {
                        console.log("Getting followed tags is not yet implemented in backend");
                        return;
                    }
                    console.error("During getting the users followed facts, error occurred: ", error);
                });
        }
    };

    useEffect(() => {
        if (user) {
            getTags();
        }
    }, [loading, user]);

    return usersTags.length > 0 ? (
        <div className="flex flex-col gap-6">
            {usersTags.map((oneUsersTags) => (
                <div className="flex bg-white rounded-md p-4 gap-4" key={oneUsersTags.profile.id}>
                    <img
                        src={oneUsersTags.profile.profile_image}
                        alt="profile picture"
                        className="w-24 h-24 rounded-full object-cover border-4 border-yellow-300"
                    />
                    <div className="mb-2">
                        <h2 className="font-semibold text-gray-900 mb-3">{oneUsersTags.profile.username}</h2>
                        {oneUsersTags.followed_tags.length > 0 && (
                            <div className="mb-2">
                                <h3 className="mb-1">Followed tags</h3>
                                <div className="flex flex-wrap gap-1.5 text-sm">
                                    {oneUsersTags.followed_tags.map((followed_tag) => (
                                        <div className="flex content-center" key={followed_tag.id}>
                                            <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
                                                {`${
                                                    languages.find((lang) => lang.id === followed_tag.language)?.flag
                                                } ${followed_tag.tag_name}`}
                                            </span>
                                            <div
                                                onClick={() => {
                                                    axiosInstance
                                                        .post(`/api/profiles/${user?.user_id}/tag-unfollow/`, {
                                                            tag_id: followed_tag.id,
                                                        })
                                                        .finally(() => {
                                                            getTags();
                                                        });
                                                }}
                                                className="flex items-center justify-around bg-gray-300 rounded-r-full border-r border-r-white w-6 cursor-pointer"
                                            >
                                                <BadgeMinus className="h-3 w-3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {oneUsersTags.other_tags.length > 0 && (
                            <div>
                                <h3 className="mb-1">Other available tags</h3>
                                <div className="flex flex-wrap gap-1.5 text-sm">
                                    {oneUsersTags.other_tags.map((non_followed_tag) => (
                                        <div className="flex content-center" key={non_followed_tag.id}>
                                            <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
                                                {`${
                                                    languages.find((lang) => lang.id === non_followed_tag.language)
                                                        ?.flag
                                                } ${non_followed_tag.tag_name}`}
                                            </span>
                                            <div
                                                onClick={() => {
                                                    axiosInstance
                                                        .post(`/api/profiles/${user?.user_id}/tag-follow/`, {
                                                            tag_id: non_followed_tag.id,
                                                        })
                                                        .finally(() => {
                                                            getTags();
                                                        });
                                                }}
                                                className="flex items-center justify-around bg-gray-300 rounded-r-full border-r border-r-white w-6 cursor-pointer"
                                            >
                                                <Rss className="h-3 w-3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <div className="w-full bg-white p-6">
            <h3 className="text-2xl font-semibold mb-3">No following tags yet . . .</h3>
            <p>Once you like some, they'll show up here.</p>
        </div>
    );
};

export default FeedFollowing;
