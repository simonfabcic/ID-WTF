import { Pencil, Tag, Trash2 } from "lucide-react";
import { useAxios } from "../../utils/useAxios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type CreatorProfileData = {
    id: number;
    profile_image: string;
    username: string;
    description: string;
    last_published_date: string;
    created_at: string;
    tag_most_posted: string;
    fact_most_likes: string;
    fact_total_likes: string;
};

const FeedProfileCreator = () => {
    // Component for viewing the others profiles
    const axiosInstance = useAxios();
    const { profileId } = useParams<{ profileId: string }>();
    const [creatorProfileData, setCreatorProfileData] = useState<CreatorProfileData | null>();
    const [profileTags, setProfileTags] = useState();
    const [profileFacts, setProfileFacts] = useState();

    useEffect(() => {
        useEffect(() => {
            axiosInstance // get profile data
                .get(`api/profiles/${profileId}`)
                .then((axiosResponse) => {
                    setCreatorProfileData(axiosResponse.data);
                });
            axiosInstance // get profiles tags
                .get(`api/profiles/${profileId}/tags`)
                .then((axiosResponse) => {
                    setProfileTags(axiosResponse.data);
                });
            axiosInstance // get profiles facts
                .get(`api/profiles/${profileId}/facts`)
                .then((axiosResponse) => {
                    setProfileFacts(axiosResponse.data);
                });
        }, []);
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex  bg-white rounded-lg p-4 gap-6">
                <div className="w-fit">
                    <img
                        src={creatorProfileData?.profile_image}
                        alt="profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-yellow-300"
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <h2 className="font-bold text-xl">{creatorProfileData?.username}</h2>
                    <p className="text-gray-600 mt-3">
                        {creatorProfileData?.description
                            ? creatorProfileData.description
                            : "Creator didn't write anything yet about himself..."}
                    </p>
                    <div className="flex items-center justify-between pt-3">
                        <div className="flex flex-col">
                            <span className="font-semibold">Last published fact:</span>
                            <span className="text-xs">
                                {creatorProfileData?.last_published_date
                                    ? new Date(creatorProfileData?.last_published_date).toLocaleString("en-US", {
                                          month: "long",
                                          year: "numeric",
                                      })
                                    : "No published facts yet..."}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-white rounded-lg  gap-3">
                <h3 className="w-1/2 border-b-2 border-yellow-400 text-center px-4 py-3">
                    {creatorProfileData?.username}'s achievements
                </h3>
                <div className="flex justify-between text-center p-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl">📅</span>
                        <span className="text-sm">Member since</span>
                        <span className="text-xs font-semibold">
                            {creatorProfileData?.created_at &&
                                new Date(creatorProfileData?.created_at).toLocaleString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                })}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl">🔖</span>
                        <span className="text-sm">Most posted</span>
                        <span className="text-xs font-semibold">#{creatorProfileData?.tag_most_posted}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl">🔥</span>
                        <span className="text-sm">Top fact</span>
                        <span className="text-xs font-semibold">{creatorProfileData?.fact_most_likes} Likes</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl">💛</span>
                        <span className="text-sm">Total likes</span>
                        <span className="text-xs font-semibold">{creatorProfileData?.fact_total_likes}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-white rounded-lg p-4 gap-4">
                <div className="flex gap-1.5 items-center">
                    <Tag className="h-5 w-5" />
                    <h3>{creatorProfileData?.username}'s tags</h3>
                </div>
                <div>
                    {/* <span>🇺🇸 English</span> */}
                    <span>English</span>
                    <div className="flex gap-1.5 p-2">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="flex content-center">
                                <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
                                    #tag1
                                </span>
                                <div className="flex items-center justify-around bg-gray-300 border-r border-r-white w-6 cursor-pointer">
                                    <Trash2 className="h-3 w-3" />
                                </div>
                                <div className="flex items-center justify-around bg-gray-300 rounded-r-full w-6 cursor-pointer">
                                    <Pencil className="h-3 w-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    {/* <span>🇪🇸 Spanish</span> */}
                    <span>Spanish</span>
                    <div className="flex gap-1.5 p-2">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="flex content-center">
                                <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
                                    #tag1
                                </span>
                                <div className="flex items-center justify-around bg-gray-300 border-r border-r-white w-6 cursor-pointer">
                                    <Trash2 className="h-3 w-3" />
                                </div>
                                <div className="flex items-center justify-around bg-gray-300 rounded-r-full w-6 cursor-pointer">
                                    <Pencil className="h-3 w-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div>List of IAmFactCreator's facts: ...</div>
        </div>
    );
};

export default FeedProfileCreator;
