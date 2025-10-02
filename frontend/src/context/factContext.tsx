import { createContext, useContext, useState, type ReactNode } from "react";

interface FactContextType {
    sideMenuCurrentSelection: SideMenuOptionsType;
    setSideMenuCurrentSelection: (selection: SideMenuOptionsType) => void;
}

export type SideMenuOptionsType =
    | "discover"
    | "profile"
    | "login"
    | "mine"
    | "saved"
    | "mine"
    | "following"
    | "follows";

const FactContext = createContext<FactContextType | undefined>(undefined);

export const FactProvider = ({ children }: { children: ReactNode }) => {
    const [sideMenuCurrentSelection, setSideMenuCurrentSelection] = useState<SideMenuOptionsType>("discover");

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
