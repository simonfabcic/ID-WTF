import { Check, FolderDown, Mail, Pencil, PencilIcon, SaveIcon, Tag, Trash2, UserPen, X } from "lucide-react";
import { useAuth } from "../../context/authContext";
import { useAxios } from "../../utils/useAxios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { getTagsAsync } from "../../app/features/user/userDataSlice";

type EditedTag = {
    tag_id: number;
    tag_name: string;
};

type ProfileField = {
    username: { value: string; edit_request: boolean };
    user_description: { value: string; edit_request: boolean };
};

const FeedProfileUser = () => {
    const [editedTag, setEditedTag] = useState<EditedTag>();
    // const { user, loading } = useAuth();
    const [presentedLanguagesInTags, setPresentedLanguagesInTags] = useState<number[]>([]);
    let axiosInstance = useAxios();
    const [editProfileField, setEditProfileField] = useState<ProfileField>({
        username: { value: "", edit_request: false },
        user_description: { value: "", edit_request: false },
    });

    // global storage
    const { languages, tags, userProfile } = useSelector((state: RootState) => state.userData);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (languages && tags) {
            const languageIds: number[] = tags.map((tag) => tag.language);
            setPresentedLanguagesInTags([...new Set(languageIds)]);
        }
    }, [languages, tags]);

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
                    <div className="flex gap-2">
                        {editProfileField.username.edit_request ? (
                            <>
                                <input
                                    type="text"
                                    className="font-bold text-xl"
                                    // CONTINUE solve, how to show the user that  the field is in the edit mode
                                    value={editProfileField.username.value}
                                    onChange={(e) =>
                                        setEditProfileField((prev) => ({
                                            ...prev,
                                            username: { ...prev.username, value: e.target.value },
                                        }))
                                    }
                                ></input>
                                <button
                                    type="button"
                                    className="bottom-0 right-0"
                                    onClick={() => {
                                        setEditProfileField((prev) => ({
                                            ...prev,
                                            username: { ...prev.username, edit_request: false },
                                        }));
                                        // CONTINUE call the backend to update profile
                                    }}
                                >
                                    <SaveIcon className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="font-bold text-xl">{userProfile?.username}</span>
                                <button
                                    type="button"
                                    className="bottom-0 right-0"
                                    onClick={() =>
                                        setEditProfileField((prev) => ({
                                            ...prev,
                                            username: { value: userProfile?.username || "", edit_request: true },
                                        }))
                                    }
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex items-center text-sm gap-1 text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{userProfile?.email}</span>
                    </div>
                    <div className="relative">
                        <p className="text-gray-600 mt-3">
                            <span>
                                I am creator of the app. I hope many people will find this useful! My main college in
                                the creation of the app was Z. Z.
                            </span>
                            <button
                                type="button"
                                className="absolute bottom-0 right-0"
                                // onClick={() => setEditProfileField((prev) => ({ ...prev, user_description: true }))}
                            >
                                <PencilIcon className="w-4 h-4" />
                            </button>
                        </p>
                    </div>
                    <div className="flex items-center justify-between pt-3">
                        <div className="flex flex-col">
                            <span className="font-semibold">Last profile update:</span>
                            <span className="text-sm">{dayjs(userProfile?.updated_at).fromNow()}</span>
                        </div>
                        <div className="flex gap-3">
                            <UserPen className="w-5 h-5" />
                            <FolderDown className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-white rounded-lg gap-3">
                <h3 className="w-1/2 border-b-2 border-yellow-300 text-center px-4 py-3">My achievements</h3>
                <div className="flex justify-between text-center p-4 gap-3">
                    <div className="flex flex-col gap-2 bg-yellow-100 rounded p-2 flex-1 min-w-0">
                        <span className="text-2xl">📅</span>
                        <span className="text-sm">Member since</span>
                        <span className="text-xs font-semibold">
                            {userProfile?.created_at &&
                                new Date(userProfile.created_at).toLocaleString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                })}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2 bg-yellow-100 rounded p-2 flex-1 min-w-0">
                        <span className="text-2xl">🔖</span>
                        <span className="text-sm">Most posted</span>
                        <span className="text-xs font-semibold truncate">#{userProfile?.tag_most_posted}</span>
                    </div>
                    <div className="flex flex-col gap-2 bg-yellow-100 rounded p-2 flex-1 min-w-0">
                        <span className="text-2xl">🔥</span>
                        <span className="text-sm">Top fact</span>
                        <span className="text-xs font-semibold">{userProfile?.fact_most_likes} Likes</span>
                    </div>
                    <div className="flex flex-col gap-2 bg-yellow-100 rounded p-2 flex-1 min-w-0">
                        <span className="text-2xl">💛</span>
                        <span className="text-sm">Total likes</span>
                        <span className="text-xs font-semibold">{userProfile?.fact_total_likes}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col bg-white rounded-lg p-4 gap-4">
                <div>
                    <div className="flex gap-1.5 items-center">
                        <Tag className="h-5 w-5" />
                        <h3>My tags</h3>
                    </div>
                    <p className="text-xs">Tags will be added when you add the fact...</p>
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
                                    {languageTags &&
                                        languageTags.map((tag) => (
                                            <div key={tag.id} className="flex content-center">
                                                {editedTag?.tag_id == tag.id ? (
                                                    <input
                                                        className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white"
                                                        type="text"
                                                        value={editedTag.tag_name}
                                                        onChange={(e) =>
                                                            setEditedTag({ ...editedTag, tag_name: e.target.value })
                                                        }
                                                    />
                                                ) : (
                                                    <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
                                                        {tag.tag_name}
                                                    </span>
                                                )}
                                                {editedTag?.tag_id == tag.id ? (
                                                    <button
                                                        type="button"
                                                        className="flex items-center justify-around bg-gray-300 border-r border-r-white w-6 cursor-pointer"
                                                        onClick={() => {
                                                            axiosInstance
                                                                .patch(
                                                                    `${import.meta.env.VITE_API_ENDPOINT}/api/tag/${
                                                                        tag.id
                                                                    }/`,
                                                                    { tag_name: editedTag.tag_name }
                                                                )
                                                                .finally(() => {
                                                                    setEditedTag({ tag_id: -1, tag_name: "" });
                                                                    dispatch(getTagsAsync(axiosInstance));
                                                                })
                                                                .catch((err) =>
                                                                    console.error(
                                                                        `Something went wrong during updating tag ${editedTag.tag_name} with no.: ${tag.id}. Error: `,
                                                                        err
                                                                    )
                                                                );
                                                        }}
                                                        // TODO on add, focus on the plus sign (to add new tag)
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="flex items-center justify-around bg-gray-300 border-r border-r-white w-6 cursor-pointer"
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "If you delete the tag, it will be removed from all the facts. Delete?"
                                                                )
                                                            ) {
                                                                axiosInstance
                                                                    .delete(
                                                                        `${import.meta.env.VITE_API_ENDPOINT}/api/tag/${
                                                                            tag.id
                                                                        }/`
                                                                    )
                                                                    .finally(() =>
                                                                        dispatch(getTagsAsync(axiosInstance))
                                                                    )
                                                                    .catch((err) =>
                                                                        console.error(
                                                                            `Something went wrong during deleting tag ${tag.tag_name} with no.: ${tag.id}. Error: `,
                                                                            err
                                                                        )
                                                                    );
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </button>
                                                )}
                                                {editedTag?.tag_id == tag.id ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditedTag({ tag_id: -1, tag_name: "" });
                                                        }}
                                                        className="flex items-center justify-around bg-gray-300 rounded-r-full w-6 cursor-pointer"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="flex items-center justify-around bg-gray-300 rounded-r-full w-6 cursor-pointer"
                                                        onClick={() => {
                                                            setEditedTag({ tag_id: tag.id, tag_name: tag.tag_name });
                                                        }}
                                                    >
                                                        <Pencil className="h-3 w-3" />
                                                    </button>
                                                )}
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
