import React from "react";

const FeedFollowing = () => {
    return (
        <div className="flex flex-col gap-6">
            {[...Array(10)].map((_, index) => (
                <div className="flex bg-white rounded-md p-4 gap-4">
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
                                <span className="bg-yellow-100 rounded-full py-0 px-3 whitespace-nowrap">#tag1</span>
                                <span className="bg-yellow-100 rounded-full py-0 px-3 whitespace-nowrap">
                                    #longer-tag2
                                </span>
                                <span className="bg-yellow-100 rounded-full py-0 px-3 whitespace-nowrap">
                                    #random-tag3
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeedFollowing;
