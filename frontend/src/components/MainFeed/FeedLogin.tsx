import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { useFact } from "../../context/factContext";
import { jwtDecode, type JwtPayload } from "jwt-decode";

type LoginOptions = "login" | "register" | "forgot-password";

type RegisterFromData = {
    email: string;
    password: string;
    passwordConfirm: string;
    iAgree: boolean;
};

type RegisterFromDataErrors = {
    email: boolean;
    password: boolean;
    passwordConfirm: boolean;
    iAgree: boolean;
};

type MyJWTAccessPayload = JwtPayload & {
    user_id: number;
};

const FeedLogin = () => {
    const { userLogin, setUser, setJWTs } = useAuth();
    const { setSideMenuCurrentSelection } = useFact();
    const [loginMode, setLoginMode] = useState<LoginOptions>("login");
    const [registerFromData, setRegisterFromData] = useState<RegisterFromData>({
        email: "",
        password: "",
        passwordConfirm: "",
        iAgree: false,
    });
    const [registerFromDataErrors, setRegisterFromDataErrors] = useState<RegisterFromDataErrors>({
        email: false,
        password: false,
        passwordConfirm: false,
        iAgree: false,
    });

    let userRegister = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        //data validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errors: RegisterFromDataErrors = {
            email: !registerFromData.email.trim() || !emailRegex.test(registerFromData.email),
            password:
                !registerFromData.password ||
                registerFromData.password.length < 8 ||
                registerFromData.password !== registerFromData.passwordConfirm,
            passwordConfirm: registerFromData.password !== registerFromData.passwordConfirm,
            iAgree: !registerFromData.iAgree,
        };

        // set err values for styling register form
        const errorsValuesWithoutKeys = Object.values(errors);
        if (errorsValuesWithoutKeys.includes(true)) {
            setRegisterFromDataErrors(errors);
            return;
        }

        // POST the data to the backend if data OK
        axios
            .post(`${import.meta.env.VITE_API_ENDPOINT}/api/users/register/`, registerFromData)
            .then((responseAxios) => {
                const newJWTs = responseAxios.data.JWTs;
                localStorage.setItem("JWTs", JSON.stringify(newJWTs));
                setUser(jwtDecode<MyJWTAccessPayload>(newJWTs.access));
                setJWTs(newJWTs);
                setSideMenuCurrentSelection("profile");
            })
            .catch((error) => {
                console.error("Registration failed", error);
            });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col  bg-white rounded-lg p-4 gap-6">
                <h3 className="text-2xl font-semibold">Welcome back</h3>
                {loginMode === "login" && (
                    <div>
                        <form onSubmit={userLogin} className="flex flex-col gap-3 mb-1.5">
                            <div>
                                <label htmlFor="email" className="text-sm font-semibold">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="border border-gray-400 rounded-lg w-full px-2 py-1"
                                    placeholder="Enter your email"
                                    required
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
                                    required
                                />
                            </div>
                            {/* <div className="flex gap-1.5 pl-2">
                                <input type="checkbox" name="remember-me" id="remember-me" />
                                <label htmlFor="remember-me">Remember me</label>
                            </div> */}
                            {/* TODO handle `remember me` checkbox */}
                            <button
                                type="submit"
                                className="w-full py-2 mt-2 bg-yellow-400 hover:bg-yellow-500 font-semibold rounded-lg cursor-pointer"
                            >
                                Sign In
                            </button>
                        </form>
                        <div className="flex gap-1 justify-center">
                            <span>Don't have an account?</span>
                            <span
                                className="text-yellow-600 hover:text-yellow-500 font-semibold cursor-pointer"
                                onClick={() => setLoginMode("register")}
                            >
                                Register.
                            </span>
                        </div>
                    </div>
                )}
                {loginMode === "register" && (
                    <div>
                        <form onSubmit={userRegister} noValidate className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="email" className="text-sm font-semibold">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className={`border rounded-lg w-full px-2 py-1 ${
                                        registerFromDataErrors.email ? "border-red-500" : "border-gray-400"
                                    }`}
                                    placeholder="Enter your email"
                                    value={registerFromData.email}
                                    onChange={(e) => {
                                        setRegisterFromDataErrors((prev) => ({ ...prev, email: false }));
                                        setRegisterFromData((prev) => ({ ...prev, email: e.target.value }));
                                    }}
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
                                    className={`border rounded-lg w-full px-2 py-1 ${
                                        registerFromDataErrors.password ? "border-red-500" : "border-gray-400"
                                    }`}
                                    placeholder="Min 8 symbols"
                                    value={registerFromData.password}
                                    onChange={(e) => {
                                        setRegisterFromDataErrors((prev) => ({
                                            ...prev,
                                            password: false,
                                            passwordConfirm: false,
                                        }));
                                        setRegisterFromData((prev) => ({ ...prev, password: e.target.value }));
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="passwordConfirm" className="text-sm font-semibold">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="passwordConfirm"
                                    id="passwordConfirm"
                                    className={`border rounded-lg w-full px-2 py-1 ${
                                        registerFromDataErrors.passwordConfirm ? "border-red-500" : "border-gray-400"
                                    }`}
                                    placeholder="Confirm your password"
                                    value={registerFromData.passwordConfirm}
                                    onChange={(e) => {
                                        setRegisterFromDataErrors((prev) => ({
                                            ...prev,
                                            password: false,
                                            passwordConfirm: false,
                                        }));
                                        setRegisterFromData((prev) => ({ ...prev, passwordConfirm: e.target.value }));
                                    }}
                                />
                            </div>
                            <div
                                className={`flex gap-1.5 pl-2 items-center ${
                                    registerFromDataErrors.iAgree && "border rounded-lg border-red-500 py-1"
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    name="i-agree"
                                    id="i-agree"
                                    onChange={(e) => {
                                        setRegisterFromDataErrors((prev) => ({
                                            ...prev,
                                            iAgree: false,
                                        }));
                                        setRegisterFromData((prev) => ({
                                            ...prev,
                                            iAgree: e.target.checked,
                                        }));
                                    }}
                                    className={`w-4 h-4 accent-yellow-400 border rounded-lg px-2 py-1 ${
                                        registerFromDataErrors.iAgree ? "border-red-500" : "border-gray-400"
                                    }`}
                                />
                                <label htmlFor="i-agree" className="text-xs">
                                    I agree to the Terms of Service and Privacy Policy
                                </label>
                            </div>
                            {/* TODO handle `remember me` checkbox */}
                            <button
                                type="submit"
                                className="w-full py-2 bg-yellow-400 font-semibold rounded-lg cursor-pointer"
                            >
                                Register
                            </button>
                        </form>
                        <div className="flex gap-1 justify-center">
                            <span>Already have an account?</span>
                            <span
                                className="text-yellow-600 hover:text-yellow-500 font-semibold cursor-pointer"
                                onClick={() => setLoginMode("login")}
                            >
                                Login.
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedLogin;
