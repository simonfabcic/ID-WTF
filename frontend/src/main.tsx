import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
// import PrivateRoute from "./utils/PrivateRoute";
// import HomePage from "./pages/HomePage";
import FeedPage from "./pages/FeedPage";
import { AuthProvider } from "./context/authContext";
import MainPage from "./pages/MainPage";
import { FactProvider } from "./context/factContext";
import ClaudeAi from "./pages/ClaudeAi";
import TestPageMiddleScroll from "./pages/TestPageMiddleScroll";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <FactProvider>
                    {/* <Header /> */}
                    <Routes>
                        {/* <Route element={<PrivateRoute />}>
                        <Route path="/feed" element={<HomePage />} />
                    </Route> */}
                        {/* <Route path="/feed" element={<FeedPage />} />
                    <Route path="/login" element={<LoginPage />} /> */}
                        <Route path="/" element={<MainPage />} />
                        <Route path="/claude" element={<ClaudeAi />} />
                        <Route path="/test" element={<TestPageMiddleScroll />} />
                    </Routes>
                </FactProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
