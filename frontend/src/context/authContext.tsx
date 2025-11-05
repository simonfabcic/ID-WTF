import { jwtDecode, type JwtPayload } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useFact } from "./factContext";
import axios from "axios";

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
    let { setSideMenuCurrentSelection } = useFact();

    useEffect(() => {
        try {
            const JWTs = localStorage.getItem("JWTs");
            if (JWTs) {
                const JWTsObject = JSON.parse(JWTs);
                setUser(jwtDecode<MyJWTAccessPayload>(JWTsObject.access));
                setJWTs(JWTsObject);
            }
        } catch (error) {
            console.log("Error parsing stored JWTs or no token!", error);
            localStorage.removeItem("JWTs");
        }
        setLoading(false);
    }, []);

    const userLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // according to the `name` parameter in the `<input ...>` element
        const username = event.currentTarget.username.value;
        const password = event.currentTarget.password.value;

        axios
            .post(`${import.meta.env.VITE_API_ENDPOINT}/auth/token/`, {
                username: username,
                password: password,
            })
            .then(function (responseAxios) {
                // console.log(responseAxios);
                const newJWTs = responseAxios.data;
                localStorage.setItem("JWTs", JSON.stringify(newJWTs));
                setUser(jwtDecode<MyJWTAccessPayload>(newJWTs.access));
                setJWTs(newJWTs);
                setSideMenuCurrentSelection("discover");
            })
            .catch(function (error) {
                if (error.status === 401) {
                    window.alert("Wrong user/pass combination. Fields are case sensitive");
                } else {
                    console.error("During the login, an error occurred: ", error);
                }
            });
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
