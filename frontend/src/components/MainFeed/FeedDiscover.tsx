import { ExternalLink, Heart, Rss, Save, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAxios } from "../../utils/useAxios";
import { useAuth } from "../../context/authContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);
import validator from "validator";

type Fact = {
    id: number;
    username: string;
    profile: {
        id: number;
        user: string; // user URL
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
                                            <span
                                                className="flex items-center justify-around bg-gray-300 w-6 cursor-pointer rounded-r-full"
                                                onClick={() => {
                                                    // create a list of tag IDs, without current one:
                                                    const newTagsIDs = fact.tags
                                                        .filter((tag_f) => tag_f.id !== tag.id)
                                                        .map((tag_f) => tag_f.id);
                                                    axiosInstance
                                                        .patch(
                                                            `${import.meta.env.VITE_API_ENDPOINT}/api/facts/${
                                                                fact.id
                                                            }/`,
                                                            {
                                                                tag_ids: newTagsIDs,
                                                            }
                                                        )
                                                        .finally(() => getFacts())
                                                        .catch((err) =>
                                                            console.error(
                                                                `Something went wrong during updating fact ${fact.content} with no.: ${fact.id}. Error: `,
                                                                err
                                                            )
                                                        );
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </span>
                                        ) : (
                                            <span
                                                className="flex items-center justify-around bg-gray-300 w-6 cursor-pointer rounded-r-full"
                                                onClick={() => {
                                                    axiosInstance.post(
                                                        `${import.meta.env.VITE_API_ENDPOINT}/api/profile/${
                                                            user?.user_id
                                                        }/follow_tag/`,
                                                        { tag_id: tag.id }
                                                    );
                                                    // CONTINUE adding new tag to follow
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
