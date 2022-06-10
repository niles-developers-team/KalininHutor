import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { AppState } from "../models";

export function RoutesSwitch() {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    // useEffect(() => {
    //     if (!userState.authenticating && !userState.authenticated)
    //         if (location.pathname === '/sign-in' || location.pathname === '/sign-up') {

    //             setAuthenticated(false);
    //             return;
    //         }

    //     if (userState.authenticating || (!userState.authenticating && !userState.authenticated)) {
    //         navigate('sign-in');

    //         setAuthenticated(false);
    //         return;
    //     }

    //     setAuthenticated(true);
    // }, [userState.authenticating, location]);

    return (
        <Routes >
            {/* {authenticated ? (
                <>
                    <Route index element={<Layout><Home /></Layout>} />
                    <Route path="messenger/:recepientId" element={<Layout><ChatComponent /></Layout>} />
                    <Route path="messenger" element={<Layout><Messenger /></Layout>} />
                    <Route path="search" element={<Layout><SearchComponent /></Layout>} />
                    <Route path="me" element={<Layout><Me /></Layout>} />
                </>
            ) : (
                <>
                    <Route path='sign-in' element={<Signin />} />
                    <Route path='sign-up' element={<Signup />} />
                </>
            )
            }
            <Route path='*' element={<NotFound />} /> */}
        </Routes>
    )
}
