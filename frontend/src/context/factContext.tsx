import { useMemo } from "react";
import { createContext, useContext, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export type SideMenuOptionsType =
    | "discover"
    | "profile"
    | "login"
    | "mine"
    | "saved"
    | "following"
    | "follows"
    | "other";

type FactContextType = {
    sideMenuCurrentSelection: SideMenuOptionsType;
    setSideMenuCurrentSelection: (selection: SideMenuOptionsType) => void;
};

const FactContext = createContext<FactContextType | undefined>(undefined);

export const FactProvider = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Derive from URL (single source of truth)
    const sideMenuCurrentSelection: SideMenuOptionsType = useMemo(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean);
        let segment = pathSegments[0] as SideMenuOptionsType | undefined;
        const validOptions: SideMenuOptionsType[] = [
            "discover",
            "profile",
            "login",
            "mine",
            "saved",
            "following",
            "follows",
            "other",
        ];
        if (pathSegments && segment === "profile" && pathSegments.length === 2) {
            segment = "other";
        }

        return segment && validOptions.includes(segment) ? segment : "discover";
    }, [location.pathname]);

    // Setter just navigates
    const setSideMenuCurrentSelection = (option: SideMenuOptionsType) => {
        navigate(`/${option}`);
    };

    return (
        <FactContext.Provider
            value={{
                sideMenuCurrentSelection,
                setSideMenuCurrentSelection,
            }}
        >
            {children}
        </FactContext.Provider>
    );
};

export const useFact = () => {
    const context = useContext(FactContext);
    if (context === undefined) {
        throw new Error("useFact must be used within an FactProvider.");
    }
    return context;
};
