import React from "react";
import { useAuth } from "../context/authContext";
import { FileUser, Heart, Home, LogIn, LogOut, Rss, User, UserCheck } from "lucide-react";
import { useFact } from "../context/factContext";
import type { SideMenuOptionsType } from "../context/factContext";

type MenuButtonProps = {
    buttonOption: SideMenuOptionsType;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    buttonLabel: string;
    count?: number;
};

const LeftSideBar = () => {
    const { user, userLogout } = useAuth();
    const { sideMenuCurrentSelection, setSideMenuCurrentSelection } = useFact();

    const MenuButton = ({ buttonOption, icon: Icon, buttonLabel, count }: MenuButtonProps) => {
        return (
            <>
                <button
                    onClick={() => setSideMenuCurrentSelection(buttonOption)}
                    className={`flex gap-2 items-center w-full rounded-lg px-4 py-3  ${
                        sideMenuCurrentSelection === buttonOption
                            ? "bg-yellow-100 text-gray-900"
                            : "hover:bg-gray-100 text-gray-600 cursor-pointer"
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
                        <button
                            className={`flex items-center justify-between pl-4 font-medium rounded-lg w-full ${
                                sideMenuCurrentSelection === "profile"
                                    ? "bg-yellow-100 text-gray-900"
                                    : "[&:hover:not(:has(#logout-btn:hover))]:bg-gray-100 text-gray-600 cursor-pointer"
                            }`}
                            onClick={() => setSideMenuCurrentSelection("profile")}
                        >
                            <div className="flex gap-2 my-3">
                                <User className="w-5 h-5" />
                                Profile
                            </div>
                            <div
                                id="logout-btn"
                                className="p-1.5 mr-2 border-2 border-gray-300 rounded-r-lg bg-white hover:bg-gray-100 text-gray-600 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevents parent < button > click
                                    userLogout();
                                }}
                            >
                                <LogOut className="w-5 h-5" />
                            </div>
                        </button>

                        {/* CONTINUE change hardcoded values to the real data from `components/AppInitializer` */}
                        <MenuButton buttonOption="mine" icon={FileUser} buttonLabel="Mine" count={345} />
                        <MenuButton buttonOption="liked" icon={Heart} buttonLabel="Liked" count={33} />
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
