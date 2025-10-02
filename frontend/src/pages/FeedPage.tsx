import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useAxios } from "../utils/useAxios";

type Fact = {
    id: number;
    content: string;
    created_at: string;
    language: {
        code: string;
        flag: string;
        name: string;
    };
    source: string;
    tags: {
        id: number;
        profile: string;
        tagname: string;
    }[];
    upvotes: number;
    username: string;
    visibility: "public" | "private" | "followers";
};

const FeedPage = () => {
    const { loading } = useAuth();
    const [facts, setFacts] = useState<Fact[]>([]);
    let axiosInstance = useAxios();

    let getFacts = async () => {
        try {
            let response = await axiosInstance.get("/api/facts");
            setFacts(await response.data);
            console.log(response);
        } catch (error) {
            console.error("During getting facts, error occurred: ", error);
        }
    };

    useEffect(() => {
        if (!loading) {
            getFacts();
        }
    }, [loading]);

    return (
        <>
            {facts && (
                <div data-description="facts-wrapper" className="flex flex-col space-y-2">
                    {facts.map((fact) => (
                        <div key={fact.id} className="flex flex-col space-x-2 text-2xl border-2">
                            <p>{fact.content}</p>
                            {fact.source.startsWith("http") ? (
                                <a href={fact.source}>{fact.source}</a>
                            ) : (
                                <p>{fact.source}</p>
                            )}
                            <p>Contributor: {fact.username}</p>
                            <p>Upvotes: {fact.upvotes}</p>
                            {fact.tags.map((tag) => (
                                <div className="border-1 rounded">{tag.tagname}</div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default FeedPage;
