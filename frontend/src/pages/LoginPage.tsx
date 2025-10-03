import { useAuth } from "../context/authContext";

const LoginPage = () => {
    const { userLogin } = useAuth();
    return (
        <>
            <form action="submit" onSubmit={userLogin}>
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" />
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" />
                <input type="submit" value="Submit" />
            </form>
        </>
    );
};

export default LoginPage;
