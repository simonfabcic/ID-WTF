import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
    var { user, userLogout } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <h1>ID-WTFs</h1>
            {user ? (
                <button onClick={userLogout}>Logout</button>
            ) : (
                <button onClick={() => navigate("/login")}>Login</button>
            )}
            <hr />
        </>
    );
};

export default Header;
