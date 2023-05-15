import { Navigate, RouteProps, useNavigate } from "react-router-dom";

import { sessionService } from "../../services";

export const PrivateRoute = (props: RouteProps) => {
    const isUserAuthenticated = sessionService.isUserAuthenticated();
    const navigate = useNavigate();

    if (!isUserAuthenticated) {
        navigate('/401');
        return <Navigate to="/401" replace></Navigate>;
    }

    return (<>{props.children}</>);
}