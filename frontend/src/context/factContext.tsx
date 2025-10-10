import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface FactContextType {
    sideMenuCurrentSelection: SideMenuOptionsType;
    setSideMenuCurrentSelection: (selection: SideMenuOptionsType) => void;
}

export type SideMenuOptionsType = "discover" | "profile" | "login" | "mine" | "saved" | "following" | "follows";

const FactContext = createContext<FactContextType | undefined>(undefined);

export const FactProvider = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const [sideMenuCurrentSelection, setSideMenuCurrentSelection] = useState<SideMenuOptionsType>(() => {
        const segment = location.pathname.split("/").filter(Boolean).pop() as SideMenuOptionsType | undefined;
        return segment ?? "discover";
    });
    const navigate = useNavigate();

    useEffect(() => {
        navigate(`/${sideMenuCurrentSelection}`);
    }, [sideMenuCurrentSelection]);

    var contextData: FactContextType = {
        sideMenuCurrentSelection,
        setSideMenuCurrentSelection,
    };

    return <FactContext.Provider value={contextData}>{children}</FactContext.Provider>;
};

export const useFact = () => {
    const context = useContext(FactContext);
    if (context === undefined) {
        throw new Error("useFact must be used within an FactProvider.");
    }
    return context;
};
