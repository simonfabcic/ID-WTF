import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const logged_in = true;
    // The `replace` prop replaces the current entry in the browser's history stack instead of adding a new one.
    // Without `replace`: 'home' / 'private-page' / 'login'
    // with `replace`: 'home' / 'login'

    // `<Outlet />` returns the URL matching component or null if no match
    // `<Outlet />` is like a variable slot that gets filled with whatever child route matches the current URL.

    return logged_in ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
