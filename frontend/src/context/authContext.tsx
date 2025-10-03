import { jwtDecode, type JwtPayload } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useFact } from "./factContext";

const baseURL = import.meta.env.VITE_API_ENDPOINT;

interface AuthContextType {
    userLogin: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    userLogout: () => void;
    user: MyJWTAccessPayload | null;
    setUser: (user: MyJWTAccessPayload | null) => void;
    JWTs: JWTs | null;
    setJWTs: (JWTs: JWTs | null) => void;
    loading: boolean;
}

interface MyJWTAccessPayload extends JwtPayload {
    // besides default JWT claims (https://datatracker.ietf.org/doc/html/rfc7519#section-4.1)
    // will add custom claims
    username: string;
    user_id: number;
}

interface JWTs {
    access: string;
    refresh: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<MyJWTAccessPayload | null>(null);
    const [JWTs, setJWTs] = useState<JWTs | null>(null);
    const [loading, setLoading] = useState(true);
    var { setSideMenuCurrentSelection } = useFact();

    useEffect(() => {
        try {
            const JWTs = localStorage.getItem("JWTs");
            if (JWTs) {
                const JWTsObject = JSON.parse(JWTs);
                setUser(jwtDecode<MyJWTAccessPayload>(JWTsObject.access));
                setJWTs(JWTsObject);
                setSideMenuCurrentSelection("discover");
            }
        } catch (error) {
            console.log("Error parsing stored JWTs or no token!", error);
            localStorage.removeItem("JWTs");
        }
        setLoading(false);
    }, []);

    const userLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const username = event.currentTarget.username.value;
        const password = event.currentTarget.password.value;

        try {
            // TODO change to use Axios
            let response = await fetch(`${baseURL}/auth/token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                const newJWTs = data;
                localStorage.setItem("JWTs", JSON.stringify(newJWTs));
                setUser(jwtDecode<MyJWTAccessPayload>(newJWTs.access));
                setJWTs(newJWTs);
                setSideMenuCurrentSelection("discover");
                // navigate("/feed");
            }
        } catch (error) {
            // TODO handle http error wrong password
            console.error("During the login, an error occurred: ", error);
        }
    };

    const userLogout = (): void => {
        setJWTs(null);
        setUser(null);
        localStorage.removeItem("JWTs");
        navigate("/");
    };

    var contextData: AuthContextType = {
        userLogin,
        userLogout,
        user,
        setUser,
        JWTs,
        setJWTs,
        loading,
    };

    return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider.");
    }
    return context;
};
