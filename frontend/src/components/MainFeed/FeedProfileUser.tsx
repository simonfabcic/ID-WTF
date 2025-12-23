import { Check, Mail, Pencil, PencilIcon, SaveIcon, Tag, Trash2, X } from "lucide-react";
import { useAxios } from "../../utils/useAxios";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { getTagsAsync, getUserProfileAsync } from "../../app/features/user/userDataSlice";

type EditedTag = {
    tag_id: number;
    tag_name: string;
};

type ProfileField = {
    username: { value: string; edit_request: boolean };
    user_description: { value: string; edit_request: boolean };
    // profile_picture: { value: string; edit_request: boolean };
};

const FeedProfileUser = () => {
    const [editedTag, setEditedTag] = useState<EditedTag>();
    // const { user, loading } = useAuth();
    const [presentedLanguagesInTags, setPresentedLanguagesInTags] = useState<number[]>([]);
    let axiosInstance = useAxios();
    const [editProfileField, setEditProfileField] = useState<ProfileField>({
        username: { value: "", edit_request: false },
        user_description: { value: "", edit_request: false },
        // profile_picture: { value: "", edit_request: false },
    });
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const userDescriptionInputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // global storage
    const { languages, tags, userProfile } = useSelector((state: RootState) => state.userData);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (languages && tags) {
            const languageIds: number[] = tags.map((tag) => tag.language);
            setPresentedLanguagesInTags([...new Set(languageIds)]);
        }
    }, [languages, tags]);

    useEffect(() => {
        if (editProfileField.username.edit_request) {
            usernameInputRef.current?.focus();
        }
    }, [editProfileField.username.edit_request]);

    useEffect(() => {
        // Move cursor to end if user click on edit description
        if (editProfileField.user_description.edit_request) {
            const textarea = userDescriptionInputRef.current;
            if (textarea) {
                textarea.focus();
                const length = textarea.value.length;
                textarea.setSelectionRange(length, length);
            }
        }
    }, [editProfileField.user_description.edit_request]);

    const handleSaveUsername = (e: React.FormEvent) => {
        e.preventDefault();
        if (editProfileField.username.value !== userProfile?.username) {
            axiosInstance
                .patch(`${import.meta.env.VITE_API_ENDPOINT}/api/profiles/${userProfile?.id}/`, {
                    username: editProfileField.username.value,
                })
                .then(() => {
                    dispatch(getUserProfileAsync({ axiosInstance, userID: userProfile?.id }));
                })
                .catch((err) => {
                    console.error(`Something went wrong during updating profile username. Error: `, err);
                });
        }
        setEditProfileField((prev) => ({
            ...prev,
            username: { ...prev.username, edit_request: false },
        }));
    };

    const handleSaveUserDescription = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("save description");
        if (editProfileField.user_description.value !== userProfile?.description) {
            axiosInstance
                .patch(`${import.meta.env.VITE_API_ENDPOINT}/api/profiles/${userProfile?.id}/`, {
                    description: editProfileField.user_description.value,
                })
                .then(() => {
                    dispatch(getUserProfileAsync({ axiosInstance, userID: userProfile?.id }));
                })
                .catch((err) => {
                    console.error(`Something went wrong during updating profile description. Error: `, err);
                });
        }
        setEditProfileField((prev) => ({
            ...prev,
            user_description: { ...prev.user_description, edit_request: false },
        }));
    };

    const handleSaveUserImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append("profile_image", file);

        axiosInstance
            .patch(`${import.meta.env.VITE_API_ENDPOINT}/api/profiles/${userProfile?.id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                dispatch(getUserProfileAsync({ axiosInstance, userID: userProfile?.id }));
            })
            .catch((err) => {
                console.error(`Something went wrong during updating profile image. Error: `, err);
            });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex  bg-white rounded-lg p-4 gap-6 items-start">
                <div className="relative inline-block">
                    <img
                        // src="https://picsum.photos/100/100"
                        src={userProfile?.profile_image}
                        alt="profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-yellow-300"
                    />
                    <form action="">
                        <input ref={fileInputRef} type="file" className="hidden" onChange={handleSaveUserImage} />
                        <button
                            type="button"
                            className="absolute bottom-0 right-0"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {/* CONTINUE allow only one file */}
                            <PencilIcon className="w-4 h-4 text-gray-900" />
                        </button>
                    </form>
                </div>
                <div className="flex flex-col flex-1">
                    {editProfileField.username.edit_request ? (
                        <form onSubmit={handleSaveUsername}>
                            <input
                                type="text"
                                className="font-bold text-xl italic focus:border-none focus:outline-none focus:ring-0"
                                value={editProfileField.username.value}
                                ref={usernameInputRef}
                                // TODO solve this: problem if pressed tab for save, the field is restarted
                                onBlur={() =>
                                    setEditProfileField((prev) => ({
                                        ...prev,
                                        username: { ...prev.username, edit_request: false },
                                    }))
                                }
                                onChange={(e) => {
                                    setEditProfileField((prev) => ({
                                        ...prev,
                                        username: { ...prev.username, value: e.target.value },
                                    }));
                                }}
                            ></input>
                            <button
                                type="submit"
                                className="bottom-0 right-0  cursor-pointer"
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <SaveIcon className="w-4 h-4" />
                            </button>
                        </form>
                    ) : (
                        <div className="flex gap-2">
                            <span className="font-bold text-xl">{userProfile?.username}</span>
                            <button
                                type="button"
                                className="bottom-0 right-0 cursor-pointer"
                                onClick={() =>
                                    setEditProfileField((prev) => ({
                                        ...prev,
                                        username: { value: userProfile?.username || "", edit_request: true },
                                    }))
                                }
                            >
                                <PencilIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <div className="flex items-center text-sm gap-1 text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{userProfile?.email}</span>
                    </div>
                    {editProfileField.user_description.edit_request ? (
                        <div className="relative mt-3">
                            <form onSubmit={handleSaveUserDescription}>
                                <textarea
                                    rows={5}
                                    ref={userDescriptionInputRef}
                                    className="italic focus:border-none focus:outline-none focus:ring-0 w-full text-gray-600"
                                    value={editProfileField.user_description.value}
                                    // TODO solve this: problem if pressed tab for save, the field is restarted
                                    onBlur={() => {
                                        setEditProfileField((prev) => ({
                                            ...prev,
                                            user_description: { ...prev.user_description, edit_request: false },
                                        }));
                                    }}
                                    onChange={(e) =>
                                        setEditProfileField((prev) => ({
                                            ...prev,
                                            user_description: { ...prev.user_description, value: e.target.value },
                                        }))
                                    }
                                />
                                <button
                                    type="submit"
                                    className="absolute bottom-0 right-0 cursor-pointer"
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <SaveIcon className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="relative">
                            <p className="text-gray-600 mt-3">
                                <span>{userProfile?.description}</span>
                                <button
                                    type="button"
                                    className="absolute bottom-0 right-0 "
                                    onClick={() =>
                                        setEditProfileField((prev) => ({
                                            ...prev,
                                            user_description: {
                                                value: userProfile?.description || "",
                                                edit_request: true,
                                            },
                                        }))
                                    }
                                >
                                    <PencilIcon className="w-4 h-4 text-gray-900" />
                                </button>
                            </p>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-3">
                        <div className="flex flex-col">
                            <span className="font-semibold">Last profile update:</span>
                            <span className="text-sm">{dayjs(userProfile?.updated_at).fromNow()}</span>
                        </div>
                        <div className="flex gap-3">
                            {/* TODO download all user data */}
                            {/* <FolderDown className="w-5 h-5" /> */}
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
                                                                    `${import.meta.env.VITE_API_ENDPOINT}/api/tags/${
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
                                                                        `${import.meta.env.VITE_API_ENDPOINT}/api/tags/${
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
