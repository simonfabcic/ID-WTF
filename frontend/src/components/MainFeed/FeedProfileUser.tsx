import { Divide, FolderDown, Mail, Pencil, Tag, Trash2, UserPen } from "lucide-react";
import { useAuth } from "../../context/authContext";
import { useAxios } from "../../utils/useAxios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface UserProfileData {
    username: string;
    id: number;
    email: string;
    created_at: string;
    updated_at: string;
    fact_most_likes: number;
    fact_total_likes: number;
    tag_most_posted: string;
}

interface Tag {
    tag_name: string;
    id: number;
    language: number;
}

interface Language {
    code: string;
    flag: string;
    id: number;
    name: string;
}

const FeedProfileUser = () => {
    // Component for viewing the logged in user profile

    const [userProfileData, setUserProfileData] = useState<UserProfileData>();
    const { user, loading } = useAuth();
    const [tags, setTags] = useState<Tag[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [presentedLanguagesInTags, setPresentedLanguagesInTags] = useState<number[]>([]);
    let axiosInstance = useAxios();
    // let presentedLanguagesInTags: Set<number> = new Set();

    useEffect(() => {
        if (!loading) {
            axiosInstance
                .get(`${import.meta.env.VITE_API_ENDPOINT}/api/profile/${user?.user_id}/`)
                .then((responseAxios) => {
                    setUserProfileData(responseAxios.data);
                });
            Promise.all([axiosInstance.get(`/api/language`), axiosInstance.get(`/api/tag`)]).then(
                ([languageResponse, tagResponse]) => {
                    setLanguages(languageResponse.data);
                    setTags(tagResponse.data);
                    // Extract unique language IDs
                    const languageIds: number[] = tagResponse.data.map((tag: Tag) => tag.language);
                    const uniqueLanguageIds: number[] = [...new Set(languageIds)];
                    setPresentedLanguagesInTags(uniqueLanguageIds);
                }
            );
            // axiosInstance.get(`/api/language`).then(function (axiosResponse) {
            //     setLanguages(axiosResponse.data);
            //     // console.log(axiosResponse.data);
            // });
            // axiosInstance.get(`/api/tag`).then(function (axiosResponse) {
            //     setTags(axiosResponse.data);
            //     console.log(axiosResponse.data);
            // });
        }
    }, [loading]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex  bg-white rounded-lg p-4 gap-6">
                <div className="w-fit">
                    <img
                        src="https://picsum.photos/100/100"
                        alt="profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-yellow-300"
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <h2 className="font-bold text-xl">{userProfileData?.username}</h2>
                    <div className="flex items-center text-sm gap-1 text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{userProfileData?.email}</span>
                    </div>
                    <p className="text-gray-600 mt-3">
                        I am creator of the app. I hope many people will find this useful! My main college in the
                        creation of the app was Z. Z.
                    </p>
                    <div className="flex items-center justify-between pt-3">
                        <div className="flex flex-col">
                            <span className="font-semibold">Last profile update:</span>
                            <span className="text-sm">{dayjs(userProfileData?.updated_at).fromNow()}</span>
                        </div>
                        <div className="flex gap-3">
                            <UserPen className="w-5 h-5" />
                            <FolderDown className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-white rounded-lg  gap-3">
                <h3 className="w-1/2 border-b-2 border-yellow-400 text-center px-4 py-3">My achievements</h3>
                <div className="flex justify-between text-center p-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl">📅</span>
                        <span className="text-sm">Member since</span>
                        <span className="text-xs font-semibold">
                            {userProfileData?.created_at &&
                                new Date(userProfileData.created_at).toLocaleString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                })}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl">🔖</span>
                        <span className="text-sm">Most posted</span>
                        <span className="text-xs font-semibold">#{userProfileData?.tag_most_posted}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl">🔥</span>
                        <span className="text-sm">Top fact</span>
                        <span className="text-xs font-semibold">{userProfileData?.fact_most_likes} Likes</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl">💛</span>
                        <span className="text-sm">Total likes</span>
                        <span className="text-xs font-semibold">{userProfileData?.fact_total_likes}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col bg-white rounded-lg p-4 gap-4">
                <div className="flex gap-1.5 items-center">
                    <Tag className="h-5 w-5" />
                    <h3>My tagss</h3>
                </div>

                {presentedLanguagesInTags &&
                    presentedLanguagesInTags.map((language_id: number) => {
                        const language = languages.find((language) => language.id === language_id);
                        const languageTags = tags.filter((tag) => tag.language === language_id);
                        return (
                            <div key={language_id}>
                                <span>{`${language?.flag} ${language?.name}`}</span>
                                {/* TODO handle not shown flag on the windows/chrome */}
                                <div className="flex flex-wrap gap-1.5 p-2">
                                    {languageTags.map((tag) => (
                                        <div key={tag.id} className="flex content-center">
                                            <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
                                                {tag.tag_name}
                                            </span>
                                            <button
                                                type="button"
                                                className="flex items-center justify-around bg-gray-300 border-r border-r-white w-6 cursor-pointer"
                                                onClick={() => {
                                                    // CONTINUE
                                                }}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                            <button
                                                type="button"
                                                className="flex items-center justify-around bg-gray-300 rounded-r-full w-6 cursor-pointer"
                                                onClick={() => {
                                                    // CONTINUE
                                                }}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default FeedProfileUser;
