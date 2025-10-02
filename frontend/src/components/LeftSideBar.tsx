import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import {
    Bookmark,
    Divide,
    FileUser,
    Home,
    LogIn,
    LogInIcon,
    LucideLogIn,
    Rss,
    SaveAll,
    User,
    UserCheck,
} from "lucide-react";
import { useFact } from "../context/factContext";
import type { SideMenuOptionsType } from "../context/factContext";

type MenuButtonProps = {
    buttonOption: SideMenuOptionsType;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    buttonLabel: string;
    count?: number;
};

const LeftSideBar = () => {
    var { user } = useAuth();
    var { sideMenuCurrentSelection, setSideMenuCurrentSelection } = useFact();

    const MenuButton = ({ buttonOption, icon: Icon, buttonLabel, count }: MenuButtonProps) => {
        return (
            <>
                <button
                    onClick={() => setSideMenuCurrentSelection(buttonOption)}
                    className={`flex gap-2 items-center w-full rounded-lg px-4 py-3 cursor-pointer ${
                        sideMenuCurrentSelection === buttonOption
                            ? "bg-yellow-100 text-gray-900"
                            : "hover:bg-gray-100 text-gray-600"
                    }`}
                >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{buttonLabel}</span>
                    {count && <span className="text-xs ml-auto">{count}</span>}
                </button>
            </>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Container - menu */}
            <div className="space-y-2 bg-white w-full rounded-lg p-4">
                <MenuButton buttonOption="discover" icon={Home} buttonLabel="Discover" />
                {(user && (
                    <>
                        <MenuButton buttonOption="profile" icon={User} buttonLabel="Profile" />
                        <MenuButton buttonOption="mine" icon={FileUser} buttonLabel="Mine" count={345} />
                        <MenuButton buttonOption="saved" icon={SaveAll} buttonLabel="Saved" count={33} />
                        <MenuButton buttonOption="following" icon={Rss} buttonLabel="Following" count={12} />
                        <MenuButton buttonOption="follows" icon={UserCheck} buttonLabel="Follows" count={85} />
                    </>
                )) || (
                    <>
                        <MenuButton buttonOption="login" icon={LogIn} buttonLabel="Login" />
                    </>
                )}
            </div>
            {/* Container - categories */}
            <div className="space-y-2 bg-white w-full rounded-lg p-4 h-48 hidden"></div>
        </div>
    );
};

export default LeftSideBar;
