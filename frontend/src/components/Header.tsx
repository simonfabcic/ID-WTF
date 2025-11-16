// import { useAuth } from "../context/authContext";
// import { useNavigate } from "react-router-dom";
import { Search, Plus, X, Check } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useAxios } from "../utils/useAxios";
import { useAuth } from "../context/authContext";

interface FactData {
    content: string;
    source: string;
    visibility: "public" | "private" | "followers";
    language: number;
    tag_ids: number[];
}

interface FactErrorsMissingData {
    factContent: boolean;
    source: boolean;
    tags: boolean;
}

interface Language {
    code: string;
    flag: string;
    id: number;
    name: string;
}

interface Tag {
    tag_name: string;
    id: number;
    language: number;
}

const Header = () => {
    // var { user, userLogout } = useAuth();
    // const navigate = useNavigate();

    const [showAddFactInputForm, setShowAddFactInputForm] = useState(false);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [newTagName, setNewTagName] = useState("");
    const [addingNewTagNoInputError, setAddingNewTagNoInputError] = useState(false);
    const [addFactFormData, setAddFactFormData] = useState<FactData>({
        content: "",
        source: "",
        visibility: "public",
        language: -1,
        tag_ids: [],
    });
    const [addFactFormDataErrors, setAddFactFormDataErrors] = useState<FactErrorsMissingData>({
        factContent: false,
        source: false,
        tags: false,
    });
    const { loading } = useAuth();
    const newTagInputRef = useRef<HTMLInputElement>(null);
    let axiosInstance = useAxios();

    let getLanguages = () => {
        axiosInstance.get(`/api/language`).then(function (axiosResponse) {
            setLanguages(axiosResponse.data);
            setAddFactFormData((prev) => ({ ...prev, language: axiosResponse.data[0].id }));
            // TODO check what happens if no languages
        });
    };

    let getTags = () => {
        axiosInstance.get(`/api/tag`).then(function (axiosResponse) {
            setTags(axiosResponse.data);
        });
    };

    useEffect(() => {
        if (loading) return;

        // get `languages` for fact posting
        getLanguages();

        // get `tags` for fact posting
        getTags();
    }, [loading]);

    useEffect(() => {
        if (isAddingTag) {
            newTagInputRef.current?.focus();
        }
    }, [isAddingTag]);

    const publishFact = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // data validation
        let err = false;
        if (addFactFormData.content.length <= 0) {
            setAddFactFormDataErrors((prev) => ({ ...prev, factContent: true }));
            err = true;
        } else {
            setAddFactFormDataErrors((prev) => ({ ...prev, factContent: false }));
        }
        if (addFactFormData.source.length <= 0) {
            setAddFactFormDataErrors((prev) => ({ ...prev, source: true }));
            err = true;
        } else {
            setAddFactFormDataErrors((prev) => ({ ...prev, source: false }));
        }
        if (addFactFormData.tag_ids.length <= 0) {
            setAddFactFormDataErrors((prev) => ({ ...prev, tags: true }));
            err = true;
        } else {
            setAddFactFormDataErrors((prev) => ({ ...prev, tags: false }));
        }
        if (err) {
            return;
        }

        axiosInstance
            .post(`${import.meta.env.VITE_API_ENDPOINT}/api/facts/`, addFactFormData)
            .then(() => {
                setShowAddFactInputForm(false);
                setAddFactFormData({
                    content: "",
                    source: "",
                    visibility: "public",
                    language: -1,
                    tag_ids: [],
                });
            })
            .catch(function (error) {
                console.error("During posting the facts, error occurred: ", error);
            });
    };

    const addTag = () => {
        if (newTagName.trim() === "") {
            setAddingNewTagNoInputError(true);
            setNewTagName("");
            return;
        }
        axiosInstance
            .post(`${import.meta.env.VITE_API_ENDPOINT}/api/tag/`, {
                language: addFactFormData.language,
                tag_name: newTagName,
            })
            .then((response) => {
                setAddFactFormData((prev) => ({ ...prev, tag_ids: [...prev.tag_ids, response.data.id] }));
                setAddFactFormDataErrors((prev) => ({ ...prev, tags: false }));
            });
        setNewTagName("");
        setIsAddingTag(false);
        getTags();
        // TODO when tag added to list, it should be italic, until backend confirm success adding
    };

    return (
        // <div className="h-20">
        //     <h1>ID-WTFs</h1>
        //     {user ? (
        //         <button onClick={userLogout}>Logout</button>
        //     ) : (
        //         <button onClick={() => navigate("/login")}>Login</button>
        //     )}
        //     <hr />
        // </div>
        <>
            <header className="border-b border-gray-200 bg-white sticky top-0">
                <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 64 64"
                            className="bg-yellow-400 p-2 rounded-full w-10 h-10 text-gary-900"
                            fill="currentColor" // this activates the `text-gray-900`
                        >
                            <title>id-wtf-logo</title>
                            <path d="M4.16 24.482c-0.23-0.929-0.346-1.882-0.346-2.848 0-6.227 4.818-11.351 10.923-11.837 1.828-4.353 6.149-7.288 10.952-7.288 2.236 0 4.43 0.638 6.311 1.817 1.881-1.179 4.075-1.817 6.311-1.817 4.804 0 9.125 2.935 10.952 7.288 6.104 0.487 10.923 5.61 10.923 11.837 0 0.966-0.116 1.919-0.346 2.848 2.627 2.244 4.16 5.525 4.16 9.027 0 5.169-4.206 9.375-9.375 9.375-2.958 0-5.739-1.413-7.497-3.75h-7.628c-2.109 0-4.057-0.7-5.625-1.88v11.184l5-3.75v16.804h-3.75v-9.304l-5 3.75v-18.684c-1.568 1.18-3.516 1.88-5.625 1.88l-7.628-0c-1.758 2.337-4.54 3.75-7.497 3.75-5.169 0-9.375-4.206-9.375-9.375-0-3.502 1.532-6.783 4.16-9.027zM39.5 35.383h9.712l0.542 0.936c1.005 1.736 2.871 2.814 4.871 2.814 3.102 0 5.625-2.523 5.625-5.625 0-2.724-1.356-5.253-3.628-6.767-1.297-0.863-2.809-1.331-4.373-1.355l0.056-3.75c1.411 0.021 2.793 0.291 4.090 0.791 0.026-0.263 0.040-0.529 0.040-0.795 0-4.48-3.645-8.125-8.125-8.125-0.103 0-0.205 0.004-0.313 0.008l-0.138 0.005c-1.509 0.082-2.958 0.581-4.198 1.448l-2.149-3.073c1.142-0.798 2.404-1.382 3.733-1.736-1.45-2.37-4.066-3.902-6.936-3.902-1.602 0-3.119 0.455-4.436 1.319v22.179c0.001 3.105 2.524 5.627 5.625 5.627zM9.375 39.133c2 0 3.867-1.078 4.871-2.814l0.541-0.936h9.712c3.102 0 5.625-2.523 5.625-5.625v-22.181c-1.317-0.864-2.834-1.319-4.436-1.319-2.87 0-5.486 1.531-6.936 3.902 1.329 0.354 2.591 0.938 3.733 1.736l-2.149 3.073c-1.24-0.867-2.688-1.365-4.197-1.448l-0.145-0.005c-0.102-0.004-0.204-0.008-0.307-0.008-4.48 0-8.125 3.645-8.125 8.125 0 0.267 0.014 0.532 0.040 0.795 1.298-0.5 2.68-0.77 4.090-0.791l0.056 3.75c-1.564 0.023-3.075 0.492-4.372 1.355-2.272 1.513-3.628 4.043-3.628 6.766 0 3.102 2.523 5.625 5.625 5.625z" />
                        </svg>
                        <h1>ID-WTF</h1>
                    </div>
                    <div className="gap-2 hidden">
                        <Search />
                        Search
                    </div>
                    <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-gary-900 font-semibold px-6 py-2 rounded-full flex gap-2 transition-colors cursor-pointer"
                        onClick={() => {
                            setShowAddFactInputForm(true);
                        }}
                    >
                        <Plus /> Add Fact
                    </button>
                </div>
            </header>

            {showAddFactInputForm && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-6">
                    {/* TODO If click outside of the modal, close the modal */}
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-bold text-2xl text-gray-900">Share a Fact</div>
                            <div
                                className="cursor-pointer text-gray-400 hover:text-gray-900 transition-colors"
                                onClick={() => {
                                    setShowAddFactInputForm(false);
                                    setAddFactFormDataErrors({
                                        factContent: false,
                                        source: false,
                                        tags: false,
                                    });
                                }}
                            >
                                <X />
                            </div>
                        </div>
                        <form action="" className="flex flex-col" onSubmit={publishFact}>
                            {/* add validation */}
                            <label htmlFor="content" className="mb-1">
                                Interesting fact
                            </label>
                            <textarea
                                id="content"
                                className={`w-full px-2.5 py-1.5 rounded-lg border ${
                                    addFactFormDataErrors.factContent ? "border-red-500" : "border-gray-400"
                                } mb-3`}
                                placeholder="What's the fascinating fact you want to share?"
                                rows={2}
                                value={addFactFormData.content}
                                onChange={(e) => {
                                    setAddFactFormDataErrors((prev) => ({ ...prev, factContent: false }));
                                    setAddFactFormData((prev) => ({ ...prev, content: e.target.value }));
                                }}
                            />

                            <label htmlFor="source" className="mb-1">
                                Source (semicolon separated)
                            </label>
                            <input
                                type="text"
                                id="source"
                                className={`w-full px-2.5 py-1.5 rounded-lg border ${
                                    addFactFormDataErrors.source ? "border-red-500" : "border-gray-400"
                                } mb-3`}
                                placeholder="e.g.: www.fact-source.com; friend of mine, employed at Jonson & Jonson"
                                value={addFactFormData.source}
                                onChange={(e) => {
                                    setAddFactFormDataErrors((prev) => ({ ...prev, source: false }));
                                    setAddFactFormData((prev) => ({ ...prev, source: e.target.value }));
                                }}
                            />

                            <label className="mb-1">Visibility</label>
                            <div className="flex gap-2">
                                <label className="w-full">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="public"
                                        className="sr-only peer"
                                        checked={addFactFormData.visibility === "public"}
                                        onChange={() =>
                                            setAddFactFormData((prev) => ({ ...prev, visibility: "public" }))
                                        }
                                    />
                                    <div className="border border-gray-400 rounded-lg py-1 peer-checked:bg-yellow-400 peer-checked:text-gray-900 cursor-pointer text-center font-medium hover:bg-gray-200 peer-checked:hover:bg-yellow-400">
                                        🌍 Public
                                    </div>
                                </label>
                                <label className="w-full">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="followers"
                                        className="sr-only peer"
                                        checked={addFactFormData.visibility === "followers"}
                                        onChange={() =>
                                            setAddFactFormData((prev) => ({ ...prev, visibility: "followers" }))
                                        }
                                    />
                                    <div className="border border-gray-400 rounded-lg py-1 peer-checked:bg-yellow-400 peer-checked:text-gray-900 cursor-pointer text-center font-medium hover:bg-gray-200 peer-checked:hover:bg-yellow-400">
                                        👥 Followers
                                    </div>
                                </label>
                                <label className="w-full">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="private"
                                        className="sr-only peer"
                                        checked={addFactFormData.visibility === "private"}
                                        onChange={() =>
                                            setAddFactFormData((prev) => ({ ...prev, visibility: "private" }))
                                        }
                                    />
                                    <div className="border border-gray-400 rounded-lg py-1 peer-checked:bg-yellow-400 peer-checked:text-gray-900 cursor-pointer text-center font-medium hover:bg-gray-200 peer-checked:hover:bg-yellow-400">
                                        🔒 Private
                                    </div>
                                </label>
                            </div>

                            <label htmlFor="language" className="mb-1">
                                Language
                            </label>
                            <div className="flex gap-2">
                                {languages &&
                                    languages.map((language) => (
                                        <label className="w-full" key={language.id}>
                                            <input
                                                type="radio"
                                                name="language"
                                                value={language.id}
                                                checked={addFactFormData.language === language.id}
                                                onChange={() =>
                                                    setAddFactFormData((prev) => ({
                                                        ...prev,
                                                        language: language.id,
                                                        tag_ids: [],
                                                    }))
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="border border-gray-400 rounded-lg py-1 peer-checked:bg-yellow-400 peer-checked:text-gray-900 cursor-pointer text-center font-medium hover:bg-gray-200 peer-checked:hover:bg-yellow-400">
                                                {`${language.flag} ${language.name}`}
                                                {/* flags are not sown in chrome - google's political decision */}
                                            </div>
                                        </label>
                                    ))}
                            </div>
                            {addFactFormData.language >= 0 && (
                                <div>
                                    <label htmlFor="tags">Tags</label>
                                    <div
                                        className={`flex gap-4 border ${
                                            addFactFormDataErrors.tags ? "border-red-500" : "border-gray-400"
                                        } rounded-lg px-2.5 py-1.5 mt-1`}
                                    >
                                        {tags &&
                                            tags.map(
                                                (tag) =>
                                                    tag.language === addFactFormData.language && (
                                                        <div key={tag.id}>
                                                            <label>
                                                                <input
                                                                    type="checkbox"
                                                                    name="tags"
                                                                    value={tag.id}
                                                                    className="sr-only peer"
                                                                    checked={addFactFormData.tag_ids.includes(tag.id)}
                                                                    onChange={(e) => {
                                                                        setAddFactFormDataErrors((prev) => ({
                                                                            ...prev,
                                                                            tags: false,
                                                                        }));
                                                                        if (e.target.checked) {
                                                                            setAddFactFormData((prev) => ({
                                                                                ...prev,
                                                                                tag_ids: [...prev.tag_ids, tag.id],
                                                                            }));
                                                                        } else {
                                                                            setAddFactFormData((prev) => ({
                                                                                ...prev,
                                                                                tag_ids: prev.tag_ids.filter(
                                                                                    (id) => id != tag.id
                                                                                ),
                                                                            }));
                                                                        }
                                                                    }}
                                                                />
                                                                <div className="bg-yellow-100 rounded-full px-3 whitespace-nowrap peer-checked:bg-yellow-400 peer-checked:text-gray-900 cursor-pointer hover:bg-gray-200 peer-checked:hover:bg-yellow-400">
                                                                    {tag.tag_name}
                                                                </div>
                                                            </label>
                                                        </div>
                                                    )
                                            )}

                                        {/* TODO if no tags -> setIsAddingTag(true) */}

                                        <div className="flex bg-gray-300 rounded-full overflow-hidden">
                                            <input
                                                ref={newTagInputRef}
                                                type="text"
                                                className={`bg-yellow-100 focus:outline-none border-white transition-all duration-500 ${
                                                    isAddingTag ? "px-3 w-32 border-r-2" : "px-0 w-0 border-0"
                                                } ${addingNewTagNoInputError && "placeholder:text-red-500"}`}
                                                placeholder={`${
                                                    addingNewTagNoInputError ? "Enter tag..." : "Tag name"
                                                }`}
                                                onChange={(e) => setNewTagName(e.target.value)}
                                                value={newTagName}
                                                autoFocus={true}
                                            />
                                            <button
                                                type="button"
                                                className={`px-1 cursor-pointer ${isAddingTag && "rotate-45"}`}
                                                onClick={() => {
                                                    if (isAddingTag) {
                                                        setNewTagName("");
                                                        setAddingNewTagNoInputError(false);
                                                    }
                                                    setIsAddingTag(!isAddingTag);
                                                }}
                                            >
                                                <Plus />
                                            </button>
                                            {/* CONTINUE change to two buttons: `+` and `X` */}
                                            <button
                                                type="button"
                                                className={`border-l-2 cursor-pointer border-white transition-all duration-1000 ${
                                                    !isAddingTag && "hidden"
                                                }`}
                                                onClick={addTag}
                                            >
                                                <Check />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between gap-3 mt-4">
                                <button
                                    className="cursor-pointer border border-gray-400 rounded-lg w-full py-2.5"
                                    onClick={() => setShowAddFactInputForm(false)}
                                >
                                    Cancel
                                </button>
                                <button className="cursor-pointer rounded-lg w-full bg-yellow-400" type="submit">
                                    Share Fact
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
