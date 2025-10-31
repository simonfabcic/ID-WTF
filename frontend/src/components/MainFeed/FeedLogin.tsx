import React, { useState } from "react";
import { useAuth } from "../../context/authContext";

type LoginOptions = "login" | "register" | "forgot-password";

const FeedLogin = () => {
    const { userLogin } = useAuth();
    const [loginMode, setLoginMode] = useState<LoginOptions>("login");
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col  bg-white rounded-lg p-4 gap-6">
                <h3 className="text-2xl font-semibold">Welcome back</h3>
                {loginMode === "login" && (
                    <form onSubmit={userLogin} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="username" className="text-sm font-semibold">
                                Username or Email
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="border border-gray-400 rounded-lg w-full px-2 py-1"
                                placeholder="Enter your username or email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-sm font-semibold">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="border border-gray-400 rounded-lg w-full px-2 py-1"
                                placeholder="Enter your password"
                            />
                        </div>
                        {/* <div className="flex gap-1.5 pl-2">
                            <input type="checkbox" name="remember-me" id="remember-me" />
                            <label htmlFor="remember-me">Remember me</label>
                        </div> */}
                        {/* TODO handle `remember me` checkbox */}
                        <button
                            type="submit"
                            className="w-full py-2 bg-yellow-400 font-semibold rounded-lg cursor-pointer"
                        >
                            Sign In
                        </button>
                    </form>
                )}
                {loginMode === "register" && <div></div>}
            </div>
        </div>
    );
};

export default FeedLogin;
