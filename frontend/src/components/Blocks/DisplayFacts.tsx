import dayjs from "dayjs";
import { BadgeMinus, ExternalLink, Heart, PencilIcon, Rss, Save, SaveIcon, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../context/authContext";
import type { AppDispatch, RootState } from "../../app/store";
import { useAxios } from "../../utils/useAxios";
import { getUserProfileAsync } from "../../app/features/user/userDataSlice";
import type { Fact } from "@/types";
import { useState } from "react";

type DisplayFactsProps = {
    facts: Fact[] | undefined;
    getFacts: () => void;
};

type EditFact = {
    id: number;
    factContent: string;
    sourceContent: string;
};

const DisplayFacts = ({ facts, getFacts }: DisplayFactsProps) => {
    const navigate = useNavigate();
    const { userProfile } = useSelector((state: RootState) => state.userData);
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    let axiosInstance = useAxios();
    const [editedFact, setEditedFact] = useState<EditFact>({ id: -1, factContent: "", sourceContent: "" });

    return (
        // TODO handle facts.length === 0
        <div className="flex flex-col gap-6">
            {/* fact card */}
            {facts &&
                facts.map((fact, index) => (
                    <div key={index} className="flex gap-4 bg-white rounded-lg p-4">
                        {/* fact creator image */}
                        <img
                            src={fact.profile.profile_image}
                            alt="profile"
                            className="w-16 h-16 rounded-full object-cover border-4 border-yellow-300"
                        />

                        {/* fact card */}
                        <div className="flex flex-col gap-4 w-full">
                            {/* fact title */}{" "}
                            <div>
                                <h3
                                    className="font-semibold text-gray-900 cursor-pointer"
                                    onClick={() => navigate(`/profile/${fact.profile.id}`)}
                                >
                                    {fact.username}
                                </h3>
                                <p className="text-sm text-gray-500">{dayjs(fact.created_at).fromNow()}</p>
                            </div>
                            <div className="relative">
                                {editedFact.factContent && editedFact.id == fact.id ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            setEditedFact((prev) => ({
                                                ...prev,
                                                id: -1,
                                            }));
                                            // CONTINUE handle save
                                        }}
                                    >
                                        <textarea
                                            className="italic focus:border-none focus:outline-none focus:ring-0 w-full text-gray-600 resize-none"
                                            value={editedFact.factContent}
                                            onChange={(e) =>
                                                setEditedFact((prev) => ({ ...prev, factContent: e.target.value }))
                                            }
                                            rows={5}
                                            ref={(el) => {
                                                if (el) {
                                                    el.style.height = el.scrollHeight + "px";
                                                }
                                            }}
                                        />
                                        <button type="submit" className="absolute bottom-0 right-0 cursor-pointer">
                                            <SaveIcon className="h-5 w-5" />
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <p className="whitespace-pre-wrap">{fact.content}</p>
                                        {fact.profile.id == user?.user_id && (
                                            <button
                                                type="button"
                                                className="absolute bottom-0 right-0 cursor-pointer"
                                                onClick={() => {
                                                    setEditedFact(() => ({
                                                        id: fact.id,
                                                        factContent: fact.content,
                                                        sourceContent: "",
                                                    }));
                                                }}
                                            >
                                                <PencilIcon className="w-4 h-4 text-gray-900" />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                            {editedFact.sourceContent && editedFact.id == fact.id ? (
                                <form
                                    className="relative"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setEditedFact((prev) => ({
                                            ...prev,
                                            id: -1,
                                        }));
                                        // CONTINUE handle save
                                    }}
                                >
                                    <textarea
                                        className="italic focus:border-none focus:outline-none focus:ring-0 w-full text-gray-600 resize-none text-sm"
                                        value={editedFact.sourceContent}
                                        onChange={(e) =>
                                            setEditedFact((prev) => ({ ...prev, sourceContent: e.target.value }))
                                        }
                                        rows={1}
                                        ref={(el) => {
                                            if (el) {
                                                el.style.height = el.scrollHeight + "px";
                                            }
                                        }}
                                    />
                                    <button type="submit" className="absolute bottom-0 right-0 cursor-pointer">
                                        <SaveIcon className="h-5 w-5" />
                                    </button>
                                </form>
                            ) : (
                                <div className="relative">
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
                                        <div className="text-sm">{fact.source}</div>
                                    )}
                                    {fact.profile.id == user?.user_id && (
                                        <button
                                            type="button"
                                            className="absolute bottom-0 right-0 cursor-pointer"
                                            onClick={() => {
                                                setEditedFact(() => ({
                                                    id: fact.id,
                                                    factContent: "",
                                                    sourceContent: fact.source,
                                                }));
                                            }}
                                        >
                                            <PencilIcon className="w-4 h-4 text-gray-900" />
                                        </button>
                                    )}
                                </div>
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
                                                        .post(`/api/profiles/${user?.user_id}/tag-unfollow/`, {
                                                            tag_id: tag.id,
                                                        })
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
                                                        .post(`/api/profiles/${user?.user_id}/tag-follow/`, {
                                                            tag_id: tag.id,
                                                        })
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
                                    {fact.is_upvoted ? (
                                        <div
                                            className="flex items-center gap-0.5 cursor-pointer"
                                            onClick={() => {
                                                {
                                                    axiosInstance
                                                        .post(
                                                            `${import.meta.env.VITE_API_ENDPOINT}/api/facts/${
                                                                fact.id
                                                            }/unvote/`
                                                        )
                                                        .then(() => getFacts())
                                                        .catch((error) => {
                                                            console.log(error);
                                                        });
                                                }
                                            }}
                                        >
                                            <Heart className="h-4 w-4 fill-yellow-400 hover:fill-yellow-500" />
                                            <span>{fact.upvotes}</span>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex items-center gap-0.5 cursor-pointer"
                                            onClick={() => {
                                                {
                                                    axiosInstance
                                                        .post(
                                                            `${import.meta.env.VITE_API_ENDPOINT}/api/facts/${
                                                                fact.id
                                                            }/upvote/`
                                                        )
                                                        .then(() => getFacts())
                                                        .catch((error) => {
                                                            console.log(error);
                                                        });
                                                }
                                            }}
                                        >
                                            <Heart className="h-4 w-4" />
                                            <span>{fact.upvotes}</span>
                                        </div>
                                    )}
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

export default DisplayFacts;
