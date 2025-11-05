// import { useAuth } from "../context/authContext";
// import { useNavigate } from "react-router-dom";
import { Search, Plus, X, Languages } from "lucide-react";
import React, { useState } from "react";
import { useAxios } from "../utils/useAxios";

interface FactData {
    profile_id: number;
    content: string;
    source: string;
    language: number;
    visibility: "public" | "private" | "followers";
    tag_ids: number[];
}

const Header = () => {
    // var { user, userLogout } = useAuth();
    // const navigate = useNavigate();

    const [showAddFactInputForm, setShowAddFactInputForm] = useState(false);
    let axiosInstance = useAxios();

    const publishFact = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const profile_id = 1;
        const content = formData.get("content") as string;
        const source = formData.get("source") as string;
        const language = 1;
        const visibility = "public";
        const tag_ids = formData.getAll("tags").map((v) => Number(v));

        axiosInstance.post(`${import.meta.env.VITE_API_ENDPOINT}/api/facts/`, {
            profile_id,
            content,
            source,
            language,
            visibility,
            tag_ids: tag_ids,
        });

        setShowAddFactInputForm(false);
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
                // TODO save input data into the useState() to keep them in case of reopen the input modal
                // const [addFactInputData, setAddFactInputData] = useState({fact_content:"", source:"", language:"", tags:""})
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-6">
                    {/* TODO If click outside of the modal, close the modal */}
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-bold text-2xl text-gray-900">Share a Fact</div>
                            <div
                                className="cursor-pointer text-gray-400 hover:text-gray-900 transition-colors"
                                onClick={() => setShowAddFactInputForm(false)}
                            >
                                <X />
                            </div>
                        </div>
                        <form action="" className="flex flex-col" onSubmit={publishFact}>
                            <label htmlFor="content" className="mb-1">
                                Interesting fact
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-400 mb-3"
                                placeholder="What's the fascinating fact you want to share?"
                                rows={2}
                            />

                            <label htmlFor="source" className="mb-1">
                                Source (semicolon separated)
                            </label>
                            <input
                                type="text"
                                id="source"
                                name="source"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-400 mb-3"
                                placeholder="e.g.: www.fact-source.com; friend of mine, employed at Jonson & Jonson"
                            />

                            <label htmlFor="language" className="mb-1">
                                Language
                            </label>
                            {/* <input
                                type="text"
                                id="language"
                                name="language"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-400 mb-3"
                            /> */}
                            <select name="" id="" className="px-2.5 py-1.5 rounded-lg border border-gray-400 mb-3">
                                <option value="EN">English</option>
                                <option value="SI">Slovenian</option>
                            </select>

                            <span className="mb-1">Tags</span>
                            <div className="flex gap-4 border border-gray-400 rounded-lg px-2.5 py-1.5 mb-4">
                                <div className="flex items-center gap-1">
                                    <input
                                        type="checkbox"
                                        id="horns1"
                                        name="tags"
                                        value={5}
                                        className="w-3 h-3 accent-yellow-400"
                                    />
                                    <label htmlFor="horns1">admin's tag</label>
                                </div>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="checkbox"
                                        id="horns2"
                                        name="tags"
                                        value={2}
                                        className="w-3 h-3 accent-yellow-400"
                                    />
                                    <label htmlFor="horns2">Horns2</label>
                                </div>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="checkbox"
                                        id="horns3"
                                        name="tags"
                                        value={3}
                                        className="w-3 h-3 accent-yellow-400"
                                    />
                                    <label htmlFor="horns3">Horns3</label>
                                </div>
                            </div>

                            <div className="flex justify-between gap-3 ">
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
