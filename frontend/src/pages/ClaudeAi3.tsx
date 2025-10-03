import React, { useState } from "react";
import {
    Search,
    Plus,
    Home,
    Bookmark,
    User,
    Tag,
    TrendingUp,
    X,
    Heart,
    Share2,
    MessageSquare,
    ExternalLink,
} from "lucide-react";

export default function IDWTFApp() {
    const [activeTab, setActiveTab] = useState("discover");
    const [showAddFact, setShowAddFact] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [loginMode, setLoginMode] = useState("login"); // 'login', 'register', 'forgot'
    const [newFact, setNewFact] = useState({ content: "", tags: "", category: "science", source: "" });
    const [loginForm, setLoginForm] = useState({ username: "", password: "", email: "", confirmPassword: "" });

    const categories = [
        { id: "all", name: "All", icon: "🌍" },
        { id: "science", name: "Science", icon: "🔬" },
        { id: "history", name: "History", icon: "📜" },
        { id: "technology", name: "Tech", icon: "💻" },
        { id: "nature", name: "Nature", icon: "🌿" },
        { id: "space", name: "Space", icon: "🚀" },
        { id: "culture", name: "Culture", icon: "🎭" },
    ];

    const sampleFacts = [
        {
            id: 1,
            user: "ScienceGeek",
            avatar: "🔬",
            content:
                "Octopuses have three hearts and blue blood. Two hearts pump blood to the gills, while the third pumps it to the rest of the body.",
            tags: ["marine biology", "animals", "octopus"],
            category: "science",
            likes: 234,
            comments: 18,
            timestamp: "2h ago",
            source: "National Geographic Marine Biology Journal",
        },
        {
            id: 2,
            user: "HistoryBuff",
            avatar: "📚",
            content:
                "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.",
            tags: ["war", "records", "zanzibar"],
            category: "history",
            likes: 456,
            comments: 32,
            timestamp: "5h ago",
            source: "Guinness World Records",
        },
        {
            id: 3,
            user: "TechWizard",
            avatar: "💡",
            content:
                "The first computer bug was an actual bug. In 1947, a moth got trapped in a Harvard Mark II computer, causing a malfunction.",
            tags: ["computing", "bugs", "history"],
            category: "technology",
            likes: 189,
            comments: 15,
            timestamp: "8h ago",
            source: "Computer History Museum",
        },
    ];

    const trendingTags = ["space exploration", "ancient civilizations", "quantum physics", "climate", "AI"];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold">🧠</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">ID-WTF</h1>
                    </div>

                    <div className="flex-1 max-w-2xl mx-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search facts, tags, or users..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setShowAddFact(true)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-full flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Fact
                    </button>

                    <button
                        onClick={() => {
                            setShowLogin(true);
                            setLoginMode("login");
                        }}
                        className="border-2 border-yellow-400 hover:bg-yellow-50 text-gray-900 font-semibold px-6 py-2 rounded-full transition-colors"
                    >
                        Login
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 flex gap-6">
                {/* Left Sidebar */}
                <aside className="w-64 flex-shrink-0 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto py-6">
                    <nav className="bg-white rounded-lg shadow-sm p-4 space-y-2">
                        <button
                            onClick={() => setActiveTab("discover")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                activeTab === "discover"
                                    ? "bg-yellow-100 text-gray-900"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <Home className="w-5 h-5" />
                            <span className="font-medium">Discover</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("trending")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                activeTab === "trending"
                                    ? "bg-yellow-100 text-gray-900"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-medium">Trending</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("saved")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                activeTab === "saved" ? "bg-yellow-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <Bookmark className="w-5 h-5" />
                            <span className="font-medium">Saved</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                activeTab === "profile"
                                    ? "bg-yellow-100 text-gray-900"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <User className="w-5 h-5" />
                            <span className="font-medium">Profile</span>
                        </button>
                    </nav>

                    {/* Categories */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                        <div className="space-y-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <span>{cat.icon}</span>
                                    <span>{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="flex-1 py-6">
                    {activeTab === "profile" ? (
                        <div className="space-y-6">
                            {/* Profile Header */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-start gap-6">
                                    <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
                                        👤
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 mb-1">John Doe</h2>
                                                <p className="text-gray-600 mb-2">@johndoe</p>
                                                <p className="text-gray-700">
                                                    Curious mind exploring the world of fascinating facts. Science
                                                    enthusiast and history buff.
                                                </p>
                                            </div>
                                            <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                                                Edit Profile
                                            </button>
                                        </div>
                                        <div className="flex gap-6 text-sm">
                                            <div>
                                                <span className="font-bold text-gray-900">127</span>
                                                <span className="text-gray-600 ml-1">Facts Shared</span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900">2.4K</span>
                                                <span className="text-gray-600 ml-1">Followers</span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900">832</span>
                                                <span className="text-gray-600 ml-1">Following</span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900">5.2K</span>
                                                <span className="text-gray-600 ml-1">Total Likes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="flex border-b border-gray-200">
                                    <button className="flex-1 px-6 py-4 font-semibold text-gray-900 border-b-2 border-yellow-400">
                                        My Facts
                                    </button>
                                    <button className="flex-1 px-6 py-4 font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                                        Saved
                                    </button>
                                    <button className="flex-1 px-6 py-4 font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                                        Liked
                                    </button>
                                </div>

                                {/* Stats */}
                                <div className="p-6 grid grid-cols-3 gap-4 border-b border-gray-200">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900 mb-1">🔬</div>
                                        <div className="text-sm text-gray-600">Most Posted</div>
                                        <div className="text-xs font-semibold text-gray-900 mt-1">Science (42)</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900 mb-1">🔥</div>
                                        <div className="text-sm text-gray-600">Top Fact</div>
                                        <div className="text-xs font-semibold text-gray-900 mt-1">1.2K Likes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900 mb-1">📅</div>
                                        <div className="text-sm text-gray-600">Member Since</div>
                                        <div className="text-xs font-semibold text-gray-900 mt-1">Jan 2024</div>
                                    </div>
                                </div>
                            </div>

                            {/* User's Facts */}
                            <div className="space-y-4">
                                {sampleFacts.map((fact) => (
                                    <article key={fact.id} className="bg-white rounded-lg shadow-sm p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                                                {fact.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{fact.user}</h3>
                                                        <p className="text-sm text-gray-500">{fact.timestamp}</p>
                                                    </div>
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                                        {categories.find((c) => c.id === fact.category)?.icon}{" "}
                                                        {fact.category}
                                                    </span>
                                                </div>

                                                <p className="text-gray-800 text-lg leading-relaxed mb-3">
                                                    {fact.content}
                                                </p>

                                                {fact.source && (
                                                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                                                        <ExternalLink className="w-4 h-4" />
                                                        <span className="font-medium">Source:</span>
                                                        <span className="text-blue-600 hover:underline cursor-pointer">
                                                            {fact.source}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {fact.tags.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-sm bg-yellow-50 text-gray-700 px-3 py-1 rounded-full hover:bg-yellow-100 cursor-pointer transition-colors"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-6 text-gray-600">
                                                    <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                                                        <Heart className="w-5 h-5" />
                                                        <span className="text-sm font-medium">{fact.likes}</span>
                                                    </button>
                                                    <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                                                        <MessageSquare className="w-5 h-5" />
                                                        <span className="text-sm font-medium">{fact.comments}</span>
                                                    </button>
                                                    <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                                                        <Share2 className="w-5 h-5" />
                                                        <span className="text-sm font-medium">Share</span>
                                                    </button>
                                                    <button className="ml-auto flex items-center gap-2 hover:text-yellow-600 transition-colors">
                                                        <Bookmark className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sampleFacts.map((fact) => (
                                <article key={fact.id} className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                                            {fact.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{fact.user}</h3>
                                                    <p className="text-sm text-gray-500">{fact.timestamp}</p>
                                                </div>
                                                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                                    {categories.find((c) => c.id === fact.category)?.icon}{" "}
                                                    {fact.category}
                                                </span>
                                            </div>

                                            <p className="text-gray-800 text-lg leading-relaxed mb-3">{fact.content}</p>

                                            {fact.source && (
                                                <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                                                    <ExternalLink className="w-4 h-4" />
                                                    <span className="font-medium">Source:</span>
                                                    <span className="text-blue-600 hover:underline cursor-pointer">
                                                        {fact.source}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {fact.tags.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-sm bg-yellow-50 text-gray-700 px-3 py-1 rounded-full hover:bg-yellow-100 cursor-pointer transition-colors"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-6 text-gray-600">
                                                <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                                                    <Heart className="w-5 h-5" />
                                                    <span className="text-sm font-medium">{fact.likes}</span>
                                                </button>
                                                <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                                                    <MessageSquare className="w-5 h-5" />
                                                    <span className="text-sm font-medium">{fact.comments}</span>
                                                </button>
                                                <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                                                    <Share2 className="w-5 h-5" />
                                                    <span className="text-sm font-medium">Share</span>
                                                </button>
                                                <button className="ml-auto flex items-center gap-2 hover:text-yellow-600 transition-colors">
                                                    <Bookmark className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </main>

                {/* Right Sidebar */}
                <aside className="w-80 flex-shrink-0 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto py-6">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            Trending Tags
                        </h3>
                        <div className="space-y-2">
                            {trendingTags.map((tag, idx) => (
                                <button
                                    key={idx}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-yellow-50 transition-colors"
                                >
                                    <span>#{tag}</span>
                                    <span className="text-xs text-gray-500">
                                        {Math.floor(Math.random() * 500) + 100}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg shadow-sm p-6 mt-4 text-gray-900">
                        <h3 className="font-bold text-xl mb-2">Did You Know?</h3>
                        <p className="text-sm opacity-90">
                            Join our community of curious minds! Share fascinating facts and discover something new
                            every day.
                        </p>
                        <button className="mt-4 w-full bg-white text-gray-900 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors">
                            Follow More Tags
                        </button>
                    </div>
                </aside>
            </div>

            {/* Add Fact Modal */}
            {showAddFact && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Share a Fact</h2>
                            <button
                                onClick={() => setShowAddFact(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <textarea
                            value={newFact.content}
                            onChange={(e) => setNewFact({ ...newFact, content: e.target.value })}
                            placeholder="What's the fascinating fact you want to share?"
                            className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                            <input
                                type="text"
                                value={newFact.source}
                                onChange={(e) => setNewFact({ ...newFact, source: e.target.value })}
                                placeholder="e.g., National Geographic, Scientific American, BBC"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={newFact.category}
                                onChange={(e) => setNewFact({ ...newFact, category: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            >
                                {categories
                                    .filter((c) => c.id !== "all")
                                    .map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                value={newFact.tags}
                                onChange={(e) => setNewFact({ ...newFact, tags: e.target.value })}
                                placeholder="e.g., biology, ocean, fascinating"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddFact(false)}
                                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // Handle fact submission
                                    setShowAddFact(false);
                                    setNewFact({ content: "", tags: "", category: "science", source: "" });
                                }}
                                className="flex-1 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-gray-900 font-semibold transition-colors"
                            >
                                Share Fact
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Login Modal */}
            {showLogin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {loginMode === "login" && "Welcome Back"}
                                {loginMode === "register" && "Create Account"}
                                {loginMode === "forgot" && "Reset Password"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowLogin(false);
                                    setLoginForm({ username: "", password: "", email: "", confirmPassword: "" });
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {loginMode === "login" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username or Email
                                    </label>
                                    <input
                                        type="text"
                                        value={loginForm.username}
                                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                        placeholder="Enter your username or email"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={loginForm.password}
                                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                        placeholder="Enter your password"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
                                        />
                                        Remember me
                                    </label>
                                    <button
                                        onClick={() => setLoginMode("forgot")}
                                        className="text-yellow-600 hover:text-yellow-700 font-medium"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        // Handle login
                                        setShowLogin(false);
                                        setLoginForm({ username: "", password: "", email: "", confirmPassword: "" });
                                    }}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
                                >
                                    Sign In
                                </button>

                                <div className="text-center text-sm text-gray-600">
                                    Don't have an account?{" "}
                                    <button
                                        onClick={() => setLoginMode("register")}
                                        className="text-yellow-600 hover:text-yellow-700 font-semibold"
                                    >
                                        Sign up
                                    </button>
                                </div>
                            </div>
                        )}

                        {loginMode === "register" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={loginForm.username}
                                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                        placeholder="Choose a username"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={loginForm.email}
                                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                        placeholder="Enter your email"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={loginForm.password}
                                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                        placeholder="Create a password"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={loginForm.confirmPassword}
                                        onChange={(e) =>
                                            setLoginForm({ ...loginForm, confirmPassword: e.target.value })
                                        }
                                        placeholder="Confirm your password"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    />
                                </div>

                                <div className="text-sm">
                                    <label className="flex items-start gap-2 text-gray-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 mt-0.5 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
                                        />
                                        <span>I agree to the Terms of Service and Privacy Policy</span>
                                    </label>
                                </div>

                                <button
                                    onClick={() => {
                                        // Handle registration
                                        setShowLogin(false);
                                        setLoginForm({ username: "", password: "", email: "", confirmPassword: "" });
                                    }}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
                                >
                                    Create Account
                                </button>

                                <div className="text-center text-sm text-gray-600">
                                    Already have an account?{" "}
                                    <button
                                        onClick={() => setLoginMode("login")}
                                        className="text-yellow-600 hover:text-yellow-700 font-semibold"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </div>
                        )}

                        {loginMode === "forgot" && (
                            <div className="space-y-4">
                                <p className="text-gray-600 text-sm mb-4">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={loginForm.email}
                                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                        placeholder="Enter your email"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        // Handle password reset
                                        alert("Password reset link sent to your email!");
                                        setLoginMode("login");
                                        setLoginForm({ username: "", password: "", email: "", confirmPassword: "" });
                                    }}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
                                >
                                    Send Reset Link
                                </button>

                                <div className="text-center text-sm text-gray-600">
                                    Remember your password?{" "}
                                    <button
                                        onClick={() => setLoginMode("login")}
                                        className="text-yellow-600 hover:text-yellow-700 font-semibold"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
