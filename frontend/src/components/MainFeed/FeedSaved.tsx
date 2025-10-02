import { ExternalLink, Heart, SaveOff, Share2 } from "lucide-react";

const FeedSaved = () => {
    return (
        <div className="flex flex-col gap-6 overflow-y-auto scrollbar-hide">
            {/* fact card */}
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 bg-white rounded-lg p-4">
                    {/* fact creator image */}
                    <img
                        src="https://picsum.photos/200/200"
                        alt="profile"
                        className="w-16 h-16 rounded-full object-cover border-4 border-yellow-300"
                    />

                    {/* fact card */}
                    <div className="flex flex-col gap-4">
                        {/* fact title */}{" "}
                        <div>
                            <h3 className="font-semibold text-gray-900">IAmFactCreator</h3>
                            <p className="text-sm text-gray-500">2 days ago</p>
                        </div>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, explicabo. Saepe rerum porro
                            esse ex maiores atque id dicta pariatur, corrupti dolore? Harum, hic! Fugit est sapiente
                            dignissimos recusandae quae?
                        </p>
                        <div className="flex gap-1 text-sm">
                            <ExternalLink className="h-4 w-4" />
                            <a
                                href="https://example.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Visit Example Source page
                            </a>
                        </div>
                        <div className="flex gap-1.5 text-sm">
                            <span className="bg-yellow-100 rounded-full py-0 px-3 whitespace-nowrap">#tag1</span>
                            <span className="bg-yellow-100 rounded-full py-0 px-3 whitespace-nowrap">#longer-tag2</span>
                            <span className="bg-yellow-100 rounded-full py-0 px-3 whitespace-nowrap">#random-tag3</span>
                        </div>
                        <div className="flex justify-between items-center mt-6">
                            <div className="flex gap-3">
                                <div className="flex items-center gap-0.5">
                                    <Heart className="h-4 w-4" />
                                    <span>344</span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <Share2 className="h-4 w-4" />
                                    <span>Share</span>
                                </div>
                            </div>
                            <div>
                                <SaveOff className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeedSaved;
