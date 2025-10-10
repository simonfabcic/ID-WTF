import { Trash2 } from "lucide-react";
import React from "react";

const FeedFollowing = () => {
    return (
        <div className="flex flex-col gap-6">
            {[...Array(10)].map((_, index) => (
                <div className="flex bg-white rounded-md p-4 gap-4" key={index}>
                    <div className="">
                        {" "}
                        <img
                            src="https://picsum.photos/200/200"
                            alt="profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-yellow-300"
                        />
                    </div>
                    <div className="">
                        <p>Followed profile user name</p>
                        <div>
                            <p>Followed tags</p>
                            {/* TODO this is not done */}
                            <div className="flex gap-1.5 text-sm">
                                <div className="flex content-center">
                                    <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
                                        #tag1
                                    </span>
                                    <div className="flex items-center justify-around bg-gray-300 rounded-r-full border-r border-r-white w-6 cursor-pointer">
                                        <Trash2 className="h-3 w-3" />
                                    </div>
                                </div>{" "}
                                <div className="flex content-center">
                                    <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
                                        #tag2
                                    </span>
                                    <div className="flex items-center justify-around bg-gray-300 rounded-r-full border-r border-r-white w-6 cursor-pointer">
                                        <Trash2 className="h-3 w-3" />
                                    </div>
                                </div>{" "}
                                <div className="flex content-center">
                                    <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
                                        #tag3
                                    </span>
                                    <div className="flex items-center justify-around bg-gray-300 rounded-r-full border-r border-r-white w-6 cursor-pointer">
                                        <Trash2 className="h-3 w-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeedFollowing;
