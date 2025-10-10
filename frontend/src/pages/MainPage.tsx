import React from "react";
import Header from "../components/Header";
import LeftSideBar from "../components/LeftSideBar";
import RightSidebar from "../components/RightSidebar";
import { Outlet } from "react-router-dom";

const MainPage = () => {
    return (
        <div className="flex flex-col bg-gray-100 h-screen">
            <Header />
            <div className="flex gap-6 max-w-7xl w-screen mx-auto px-4 py-6 overflow-hidden">
                <aside className="w-64">
                    <LeftSideBar />
                </aside>
                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* <MainFeed /> */}
                    <Outlet />
                </div>
                <aside className="w-80">
                    <RightSidebar />
                </aside>
            </div>
        </div>
    );
};

export default MainPage;
