// import { useAuth } from "../context/authContext";
// import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";

const Header = () => {
    // var { user, userLogout } = useAuth();
    // const navigate = useNavigate();

    return (
        // <div className="h-20">
        //     <h1>ID-WTFs</h1>
        //     {user ? (
        //         <button onClick={userLogout}>Logout</button>
        //     ) : (
        //         <button onClick={() => navigate("/login")}>Login</button>
        //     )}
        //     <hr />
        // </div>
        <header className="border-b border-gray-200 bg-white sticky top-0">
            <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 64"
                        className="bg-yellow-400 p-2 rounded-full w-10 h-10 text-gary-900"
                        fill="currentColor" // this activates the `text-gray-900`
                    >
                        <title>id-wtf-logo</title>
                        <path d="M4.16 24.482c-0.23-0.929-0.346-1.882-0.346-2.848 0-6.227 4.818-11.351 10.923-11.837 1.828-4.353 6.149-7.288 10.952-7.288 2.236 0 4.43 0.638 6.311 1.817 1.881-1.179 4.075-1.817 6.311-1.817 4.804 0 9.125 2.935 10.952 7.288 6.104 0.487 10.923 5.61 10.923 11.837 0 0.966-0.116 1.919-0.346 2.848 2.627 2.244 4.16 5.525 4.16 9.027 0 5.169-4.206 9.375-9.375 9.375-2.958 0-5.739-1.413-7.497-3.75h-7.628c-2.109 0-4.057-0.7-5.625-1.88v11.184l5-3.75v16.804h-3.75v-9.304l-5 3.75v-18.684c-1.568 1.18-3.516 1.88-5.625 1.88l-7.628-0c-1.758 2.337-4.54 3.75-7.497 3.75-5.169 0-9.375-4.206-9.375-9.375-0-3.502 1.532-6.783 4.16-9.027zM39.5 35.383h9.712l0.542 0.936c1.005 1.736 2.871 2.814 4.871 2.814 3.102 0 5.625-2.523 5.625-5.625 0-2.724-1.356-5.253-3.628-6.767-1.297-0.863-2.809-1.331-4.373-1.355l0.056-3.75c1.411 0.021 2.793 0.291 4.090 0.791 0.026-0.263 0.040-0.529 0.040-0.795 0-4.48-3.645-8.125-8.125-8.125-0.103 0-0.205 0.004-0.313 0.008l-0.138 0.005c-1.509 0.082-2.958 0.581-4.198 1.448l-2.149-3.073c1.142-0.798 2.404-1.382 3.733-1.736-1.45-2.37-4.066-3.902-6.936-3.902-1.602 0-3.119 0.455-4.436 1.319v22.179c0.001 3.105 2.524 5.627 5.625 5.627zM9.375 39.133c2 0 3.867-1.078 4.871-2.814l0.541-0.936h9.712c3.102 0 5.625-2.523 5.625-5.625v-22.181c-1.317-0.864-2.834-1.319-4.436-1.319-2.87 0-5.486 1.531-6.936 3.902 1.329 0.354 2.591 0.938 3.733 1.736l-2.149 3.073c-1.24-0.867-2.688-1.365-4.197-1.448l-0.145-0.005c-0.102-0.004-0.204-0.008-0.307-0.008-4.48 0-8.125 3.645-8.125 8.125 0 0.267 0.014 0.532 0.040 0.795 1.298-0.5 2.68-0.77 4.090-0.791l0.056 3.75c-1.564 0.023-3.075 0.492-4.372 1.355-2.272 1.513-3.628 4.043-3.628 6.766 0 3.102 2.523 5.625 5.625 5.625z" />
                    </svg>
                    <h1>ID-WTF</h1>
                </div>
                <div className="gap-2 hidden">
                    <Search />
                    Search
                </div>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-gary-900 font-semibold px-6 py-2 rounded-full flex gap-2 transition-colors cursor-pointer">
                    <Plus /> Add Fact
                </button>
            </div>
        </header>
    );
};

export default Header;
