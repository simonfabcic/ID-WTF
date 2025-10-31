import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
// import PrivateRoute from "./utils/PrivateRoute";
// import HomePage from "./pages/HomePage";
import FeedPage from "./pages/FeedPage";
import { AuthProvider } from "./context/authContext";
import MainPage from "./pages/MainPage";
import { FactProvider } from "./context/factContext";
import ClaudeAi from "./pages/ClaudeAi";
import TestPageMiddleScroll from "./pages/TestPageMiddleScroll";
import ClaudeAi2 from "./pages/ClaudeAi2";
import FeedDiscover from "./components/MainFeed/FeedDiscover";
import FeedProfileUser from "./components/MainFeed/FeedProfileUser";
import FeedLogin from "./components/MainFeed/FeedLogin";
import FeedMine from "./components/MainFeed/FeedMine";
import FeedSaved from "./components/MainFeed/FeedSaved";
import FeedFollowing from "./components/MainFeed/FeedFollowing";
import FeedFollows from "./components/MainFeed/FeedFollows";
import FeedProfileCreator from "./components/MainFeed/FeedProfileCreator";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <FactProvider>
                <AuthProvider>
                    {/* <Header /> */}
                    <Routes>
                        {/* <Route element={<PrivateRoute />}>
                        <Route path="/feed" element={<HomePage />} />
                    </Route> */}
                        {/* <Route path="/feed" element={<FeedPage />} />
                    <Route path="/login" element={<LoginPage />} /> */}
                        <Route path="/" element={<MainPage />}>
                            {/* Redirect from "/" to "/discover" */}
                            <Route index element={<Navigate to="discover" replace />} />

                            <Route path="discover" element={<FeedDiscover />} />
                            <Route path="profile/:profileId" element={<FeedProfileCreator />} />
                            <Route path="profile" element={<FeedProfileUser />} />
                            <Route path="login" element={<FeedLogin />} />
                            <Route path="mine" element={<FeedMine />} />
                            <Route path="saved" element={<FeedSaved />} />
                            <Route path="following" element={<FeedFollowing />} />
                            <Route path="follows" element={<FeedFollows />} />
                        </Route>
                        <Route path="/claude" element={<ClaudeAi />} />
                        <Route path="/claude2" element={<ClaudeAi2 />} />
                        <Route path="/test" element={<TestPageMiddleScroll />} />
                    </Routes>
                </AuthProvider>
            </FactProvider>
        </BrowserRouter>
    </StrictMode>
);
