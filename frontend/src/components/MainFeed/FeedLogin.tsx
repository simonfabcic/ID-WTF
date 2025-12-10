import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { useFact } from "../../context/factContext";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { useLocation } from "react-router-dom";

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

let userToken: string | null = null;

const FeedLogin = () => {
    const location = useLocation();
    const { userLogin, setUser, setJWTs } = useAuth();
    const { setSideMenuCurrentSelection } = useFact();
    const [loginMode, setLoginMode] = useState<LoginOptions>("login");
    const [registerDataSubmitted, setRegisterDataSubmitted] = useState(false);

    const [forgotPasswordStep, setForgotPasswordStep] = useState<"enter-email" | "enter-password">();
    const [forgotPasswordsSame, setForgotPasswordsSame] = useState(true);

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
            .then(() => {
                setRegisterDataSubmitted(true);
            })
            .catch((error) => {
                console.error("Registration failed", error);
                alert("Profile not created. " + error.response.data.error);
            });
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const reason = params.get("reason");
        userToken = params.get("token");

        if (!userToken) {
            return;
        }

        if (reason === "verify-email") {
            axios
                .post(`${import.meta.env.VITE_API_ENDPOINT}/api/users/verify-email/`, {
                    token: userToken,
                })
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
        }

        if (reason === "forgot-password") {
            setLoginMode("forgot-password");
            setForgotPasswordStep("enter-password");
        }
    }, [location]);

    const forgotPassword = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        if (forgotPasswordStep === "enter-email") {
            const email = formData.get("email") as string;
            axios
                .post(`${import.meta.env.VITE_API_ENDPOINT}/api/users/forgot-password-email/`, {
                    email: email,
                })
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
        } else if (forgotPasswordStep === "enter-password") {
            const password = formData.get("password") as string;
            const passwordConfirm = formData.get("password-confirm") as string;

            if (password !== passwordConfirm) {
                setForgotPasswordsSame(false);
                return;
            }

            axios
                .post(`${import.meta.env.VITE_API_ENDPOINT}/api/users/forgot-password-new-password/`, {
                    token: userToken,
                    password: password,
                })
                .then((responseAxios) => {
                    const newJWTs = responseAxios.data.JWTs;
                    localStorage.setItem("JWTs", JSON.stringify(newJWTs));
                    setUser(jwtDecode<MyJWTAccessPayload>(newJWTs.access));
                    setJWTs(newJWTs);
                    setSideMenuCurrentSelection("profile");
                })
                .catch((error) => {
                    console.error("Changing password fails", error);
                });
        }
    };

    return (
        <div className="flex flex-col  bg-white rounded-lg p-4 gap-4">
            {loginMode === "login" && (
                <>
                    <h3 className="text-2xl font-semibold">Welcome back</h3>
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
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-yellow-600 hover:text-yellow-500 font-semibold cursor-pointer"
                                onClick={() => {
                                    setLoginMode("forgot-password");
                                    setForgotPasswordStep("enter-email");
                                }}
                            >
                                Forgot Password?
                            </button>
                        </div>
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
                </>
            )}
            {loginMode === "register" &&
                (registerDataSubmitted ? (
                    <>
                        <h3 className="text-2xl font-semibold mb-2">Profile created! Great!</h3>
                        <div>
                            <p className="font-semibold">Next step</p>
                            <p>
                                Check your inbox and click on the link to confirm email ownership. Link is valid one
                                hour.
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="text-2xl font-semibold mb-2">Wanna share facts? Awesome!</h3>
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
                    </>
                ))}
            {loginMode === "forgot-password" && forgotPasswordStep === "enter-email" && (
                <>
                    <h3 className="text-2xl font-semibold">Forgot Password? It happens to all of us...</h3>
                    <form onSubmit={forgotPassword} className="flex flex-col gap-3 mb-1.5">
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
                        <button
                            type="submit"
                            className="w-full py-2 mt-2 bg-yellow-400 hover:bg-yellow-500 font-semibold rounded-lg cursor-pointer"
                        >
                            Send me mail to reset the password
                            {/* CONTINUE show the success message */}
                        </button>
                    </form>
                    <div className="flex gap-1 justify-center">
                        <span>Know your password?</span>
                        <span
                            className="text-yellow-600 hover:text-yellow-500 font-semibold cursor-pointer"
                            onClick={() => setLoginMode("login")}
                        >
                            Login.
                        </span>
                    </div>
                </>
            )}
            {loginMode === "forgot-password" && forgotPasswordStep === "enter-password" && (
                <>
                    <h3 className="text-2xl font-semibold">Ready to change your password? Enter it here...</h3>
                    <form onSubmit={forgotPassword} className="flex flex-col gap-3 mb-1.5">
                        <div>
                            <label htmlFor="password" className="text-sm font-semibold">
                                New password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className={`border rounded-lg w-full px-2 py-1 ${
                                    forgotPasswordsSame ? "border-gray-400" : "border-red-500"
                                }`}
                                placeholder="Min 8 characters"
                                required
                                onChange={() => setForgotPasswordsSame(true)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password-confirm" className="text-sm font-semibold">
                                Confirm password
                            </label>
                            <input
                                type="password"
                                name="password-confirm"
                                id="password-confirm"
                                className={`border rounded-lg w-full px-2 py-1 ${
                                    forgotPasswordsSame ? "border-gray-400" : "border-red-500"
                                }`}
                                placeholder="Password again"
                                required
                                onChange={() => setForgotPasswordsSame(true)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 mt-2 bg-yellow-400 hover:bg-yellow-500 font-semibold rounded-lg cursor-pointer"
                        >
                            Change my password
                        </button>
                    </form>
                    <div className="flex gap-1 justify-center">
                        <span>Know your password?</span>
                        <span
                            className="text-yellow-600 hover:text-yellow-500 font-semibold cursor-pointer"
                            onClick={() => setLoginMode("login")}
                        >
                            Login.
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

export default FeedLogin;
