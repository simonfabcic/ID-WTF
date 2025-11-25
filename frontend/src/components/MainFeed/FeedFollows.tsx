const FeedFollows = () => {
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
                        <h2 className="font-semibold text-gray-900 mb-3">Follows profile user name</h2>
                        <div>
                            {/* TODO this is not done */}
                            <div className="mb-2">
                                <h3 className="mb-1">English</h3>
                                <div className="flex gap-1.5 text-sm">
                                    <span className="bg-yellow-100 rounded-full py-0 px-3 whitespace-nowrap">
                                        #tag1
                                    </span>
                                    <span className="bg-yellow-100 rounded-full py-0 px-3 whitespace-nowrap">
                                        #longer-tag2
                                    </span>
                                    <span className="bg-yellow-100 rounded-full py-0 px-3 whitespace-nowrap">
                                        #random-tag3
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-1">Spanish</h3>
                                <div className="flex gap-1.5 text-sm">
                                    <span className="bg-yellow-100 rounded-full py-0 px-3 whitespace-nowrap">
                                        #tag1
                                    </span>
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
                </div>
            ))}
        </div>
    );
};

export default FeedFollows;
