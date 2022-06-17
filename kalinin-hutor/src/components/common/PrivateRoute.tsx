import { Navigate, RouteProps, useNavigate } from "react-router-dom";

import { sessionService } from "../../services";

interface Props extends RouteProps { }

export const PrivateRoute = (props: Props) => {
    const isUserAuthenticated = sessionService.isUserAuthenticated();
    const navigate = useNavigate();

    if (!isUserAuthenticated) {
        navigate('/401');
        return <Navigate to="/401" replace></Navigate>;
    }

    return (<>{props.children}</>);
};