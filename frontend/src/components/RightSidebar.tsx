import { Rocket, Tags } from "lucide-react";
import React from "react";

const RightSidebar = () => {
    const trendingTags = ["space exploration", "ancient civilizations", "quantum physics", "climate", "AI"];

    return (
        <div className="flex flex-col gap-6">
            {/* Container - trending facts */}
            <div className="bg-white p-4 rounded-lg">
                <h3 className="flex items-center font-semibold text-gray-900 gap-2 mb-3">
                    <Tags className="w-5 h-5" />
                    Trending Tags
                </h3>
                <div className="flex flex-col gap-1">
                    {trendingTags.map((tag, idx) => (
                        <button
                            className="flex justify-between text-gray-700 hover:bg-yellow-50 rounded-lg text-sm px-2 py-3 transition-colors cursor-pointer"
                            key={idx}
                        >
                            <span>#{tag}</span>
                            <span>{Math.floor(Math.random() * 500)}</span>
                        </button>
                    ))}
                </div>
            </div>
            {/* Container - menu */}
            <div className="bg-yellow-400 p-4 rounded-lg">
                <div className="flex gap-2 mb-2">
                    {<Rocket className="w-7 h-7" />}
                    <h3 className="font-bold text-lg">Did You Know?</h3>
                </div>
                <span className="inline-flex items-center gap-1">
                    Join our community of curious minds! Share fascinating facts and discover something new every day.
                </span>
            </div>
        </div>
    );
};

export default RightSidebar;
