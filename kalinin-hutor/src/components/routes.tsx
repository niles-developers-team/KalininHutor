import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks";
import { AppState } from "../store";
import { UserActions } from "../store/userStore";
import { NotFound, PrivateRoute } from "./common";
import { NotAuthorizedComponent } from "./common/NotAuthorized";
import { HomeComponent } from "./home";
import { LayoutComponent } from "./Layout";
import { MeComponent } from "./me/Me";
import { SigninDialog } from "./signin/Signin";


export function RoutesSwitch() {
    const { userState } = useAppSelector((state: AppState) => ({
        userState: state.userState
    }));
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState<boolean>(false);

    function handleSigninOpen() {
        setOpen(true);
    }

    async function handleSignin(phoneNumber: string, password: string) {
        dispatch(UserActions.signin({
            password: password,
            phoneNumber: `+7${phoneNumber}`,
            withSignup: true
        }));
    }

    useEffect(() => {
        if (!userState.authenticating && userState.authenticated) {
            setOpen(false);
            navigate('/');
        }
    }, [userState.authenticating]);


    return (
        <LayoutComponent onSigninDialogOpen={handleSigninOpen}>
            <Routes>
                <Route index element={<HomeComponent />} />
                <Route path="/me" element={<PrivateRoute><MeComponent /></PrivateRoute>} />

                <Route path='401' element={<NotAuthorizedComponent onSigninClick={handleSigninOpen} />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
            <SigninDialog
                isOpen={open}
                authenticating={userState.authenticating}
                onSignin={handleSignin}
                onClose={() => setOpen(false)}
            />
        </LayoutComponent>
    );
}
