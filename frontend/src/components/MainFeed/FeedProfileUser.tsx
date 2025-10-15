import { AtSign, FolderDown, Mail, Pencil, Tag, Trash2, UserPen } from "lucide-react";

const FeedProfileUser = () => {
    // Component for viewing the logged in user profile
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
                    <h2 className="font-bold text-xl">IAmFactCreator</h2>
                    <div className="flex items-center text-sm gap-1 text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>fact.creator@deun.eu</span>
                    </div>
                    <p className="text-gray-600 mt-3">
                        I am creator of the app. I hope many people will find this useful! My main college in the
                        creation of the app was Z. Z.
                    </p>
                    <div className="flex items-center justify-between pt-3">
                        <div className="flex flex-col">
                            <span className="font-semibold">Last profile update:</span>
                            <span className="text-sm">5 days ago</span>
                        </div>
                        <div className="flex gap-3">
                            <UserPen className="w-5 h-5" />
                            <FolderDown className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-white rounded-lg  gap-3">
                <h3 className="w-1/2 border-b-2 border-yellow-400 text-center px-4 py-3">My achievements</h3>
                <div className="flex justify-between text-center p-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl">📅</span>
                        <span className="text-sm">Member since</span>
                        <span className="text-xs font-semibold">Jan 2025</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl">🔖</span>
                        <span className="text-sm">Most posted</span>
                        <span className="text-xs font-semibold">#health</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl">🔥</span>
                        <span className="text-sm">Top fact</span>
                        <span className="text-xs font-semibold">512 Likes</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl">💛</span>
                        <span className="text-sm">Total likes</span>
                        <span className="text-xs font-semibold">5588</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-white rounded-lg p-4 gap-4">
                <div className="flex gap-1.5 items-center">
                    <Tag className="h-5 w-5" />
                    <h3>My tags</h3>
                </div>
                <div>
                    {/* <span>🇺🇸 English</span> */}
                    <span>English</span>
                    <div className="flex gap-1.5 p-2">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="flex content-center">
                                <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
                                    #tag1
                                </span>
                                <div className="flex items-center justify-around bg-gray-300 border-r border-r-white w-6 cursor-pointer">
                                    <Trash2 className="h-3 w-3" />
                                </div>
                                <div className="flex items-center justify-around bg-gray-300 rounded-r-full w-6 cursor-pointer">
                                    <Pencil className="h-3 w-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    {/* <span>🇪🇸 Spanish</span> */}
                    <span>Spanish</span>
                    <div className="flex gap-1.5 p-2">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="flex content-center">
                                <span className="bg-yellow-100 rounded-l-full py-0 px-3 whitespace-nowrap border-r border-r-white">
                                    #tag1
                                </span>
                                <div className="flex items-center justify-around bg-gray-300 border-r border-r-white w-6 cursor-pointer">
                                    <Trash2 className="h-3 w-3" />
                                </div>
                                <div className="flex items-center justify-around bg-gray-300 rounded-r-full w-6 cursor-pointer">
                                    <Pencil className="h-3 w-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedProfileUser;
