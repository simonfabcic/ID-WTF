import { useAuth } from "../../context/authContext";
import type { Tag, ProfilePublic } from "../../types";
import { useAxios } from "../../utils/useAxios";
import { Rss, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type UsersTags = {
    profile: ProfilePublic;
    followed_tags: Tag[];
    other_tags: Tag[];
};

const FeedFollowing = () => {
    const [usersTags, setUsersTags] = useState<UsersTags[]>([]);
    const { loading, user } = useAuth();

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

    return (
        <div className="flex flex-col gap-6">
            {usersTags.map((oneUsersTags) => (
                <div className="flex bg-white rounded-md p-4 gap-4" key={oneUsersTags.profile.id}>
                    <div className="">
                        {" "}
                        <img
                            src={oneUsersTags.profile.profile_image}
                            alt="profile picture"
                            className="w-24 h-24 rounded-full object-cover border-4 border-yellow-300"
                        />
                    </div>
                    <div className="mb-2">
                        <h2 className="font-semibold text-gray-900 mb-3">{oneUsersTags.profile.username}</h2>
                        <div className="mb-2">
                            <h3 className="mb-1">Followed tags</h3>
                            <div className="flex flex-wrap gap-1.5 text-sm">
                                {oneUsersTags.followed_tags.map((followed_tag) => (
                                    <div className="flex content-center">
                                        <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
                                            {`${followed_tag.language} ${followed_tag.tag_name}`}
                                        </span>
                                        <div
                                            onClick={() => {
                                                // CONTINUE
                                            }}
                                            className="flex items-center justify-around bg-gray-300 rounded-r-full border-r border-r-white w-6 cursor-pointer"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-1">Other available tags</h3>
                            <div className="flex flex-wrap gap-1.5 text-sm">
                                {oneUsersTags.other_tags.map((non_followed_tag) => (
                                    <div className="flex content-center">
                                        <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
                                            {`${non_followed_tag.language} ${non_followed_tag.tag_name}`}
                                        </span>
                                        <div
                                            onClick={() => {
                                                // CONTINUE
                                            }}
                                            className="flex items-center justify-around bg-gray-300 rounded-r-full border-r border-r-white w-6 cursor-pointer"
                                        >
                                            <Rss className="h-3 w-3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    // return (
    //     <div className="flex flex-col gap-6">
    //         {[...Array(10)].map((_, index) => (
    //             <div className="flex bg-white rounded-md p-4 gap-4" key={index}>
    //                 <div className="">
    //                     {" "}
    //                     <img
    //                         src="https://picsum.photos/200/200"
    //                         alt="profile"
    //                         className="w-24 h-24 rounded-full object-cover border-4 border-yellow-300"
    //                     />
    //                 </div>
    //                 <div className="mb-2">
    //                     <h2 className="font-semibold text-gray-900 mb-3">Followed profile user name</h2>
    //                     <div className="mb-2">
    //                         <h3 className="mb-1">Followed tags</h3>
    //                         {/* TODO this is not done */}
    //                         <div className="flex flex-wrap gap-1.5 text-sm">
    //                             <div className="flex content-center">
    //                                 <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
    //                                     #tag1
    //                                 </span>
    //                                 <div className="flex items-center justify-around bg-gray-300 rounded-r-full border-r border-r-white w-6 cursor-pointer">
    //                                     <Trash2 className="h-3 w-3" />
    //                                 </div>
    //                             </div>{" "}
    //                             <div className="flex content-center">
    //                                 <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
    //                                     #tag2
    //                                 </span>
    //                                 <div className="flex items-center justify-around bg-gray-300 rounded-r-full border-r border-r-white w-6 cursor-pointer">
    //                                     <Trash2 className="h-3 w-3" />
    //                                 </div>
    //                             </div>{" "}
    //                             <div className="flex content-center">
    //                                 <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
    //                                     #tag3
    //                                 </span>
    //                                 <div className="flex items-center justify-around bg-gray-300 rounded-r-full border-r border-r-white w-6 cursor-pointer">
    //                                     <Trash2 className="h-3 w-3" />
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div>
    //                         <h3 className="mb-1">Other available tags</h3>
    //                         {/* TODO this is not done */}
    //                         <div className="flex flex-wrap gap-1.5 text-sm">
    //                             <div className="flex content-center">
    //                                 <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
    //                                     #tagA
    //                                 </span>
    //                                 <div className="flex items-center justify-around bg-gray-300 rounded-r-full border-r border-r-white w-6 cursor-pointer">
    //                                     <Rss className="h-3 w-3" />
    //                                 </div>
    //                             </div>{" "}
    //                             <div className="flex content-center">
    //                                 <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
    //                                     #tagB
    //                                 </span>
    //                                 <div className="flex items-center justify-around bg-gray-300 rounded-r-full border-r border-r-white w-6 cursor-pointer">
    //                                     <Rss className="h-3 w-3" />
    //                                 </div>
    //                             </div>{" "}
    //                             <div className="flex content-center">
    //                                 <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
    //                                     #tagC
    //                                 </span>
    //                                 <div className="flex items-center justify-around bg-gray-300 rounded-r-full border-r border-r-white w-6 cursor-pointer">
    //                                     <Rss className="h-3 w-3" />
    //                                 </div>
    //                             </div>
    //                             <div className="flex content-center">
    //                                 <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
    //                                     #tagD
    //                                 </span>
    //                                 <div className="flex items-center justify-around bg-gray-300 rounded-r-full border-r border-r-white w-6 cursor-pointer">
    //                                     <Rss className="h-3 w-3" />
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         ))}
    //     </div>
    // );
};

export default FeedFollowing;
