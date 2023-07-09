import { Face, Favorite, ShoppingBag, Gite, ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Button, Container, Grid, IconButton, InputBase, Slide, Stack, Toolbar, Tooltip, alpha, styled, useScrollTrigger } from "@mui/material";
import { useEffect } from "react";
import { RouteProps, Search, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { NotificationStatus, NotificationVariant, Notification } from "../models";
import { sessionService } from "../services";
import { AppState, NotificationActions } from "../store";

interface Props {
    onSigninDialogOpen: () => void;
}
interface HideOnScrollProps {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
    children: React.ReactElement;
}

function HideOnScroll(props: HideOnScrollProps) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

export const MobileLayoutComponent = function (props: Props & RouteProps): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { userState, notificationState } = useAppSelector((state: AppState) => state);

    useEffect(() => {
        const connection = sessionService.initSignalR();

        if (connection) {
            connection
                .start()
                .then(() => {
                    connection.on('ReceiveNotification', (result: Notification) => {
                        dispatch(NotificationActions.pushNotification(result))
                    });
                })
                .catch((error) => console.log(error));
        }
    }, []);

    useEffect(() => {
        if (!userState.currentUser)
            return;

        dispatch(NotificationActions.getCurrentUserNotifications({ status: NotificationStatus.OnlyUnread }));
    }, [userState.currentUser]);

    function handleAccountClick(event: React.MouseEvent<HTMLAnchorElement>) {
        if (!userState.authenticating && !userState.authenticated) {
            event.preventDefault();
            props.onSigninDialogOpen();
            return;
        }
    }

    let profilePageText = 'Войти';
    if (userState.authenticating === false) {
        const user = userState.currentUser;
        if (user && user.name && user.lastname)
            profilePageText = `${user.name} ${user.lastname[0].toUpperCase()}.`;
        else
            profilePageText = 'Личный кабинет';
    }

    let variant: NotificationVariant = NotificationVariant.info;
    let message: string = '';
    if (notificationState.show) {
        variant = notificationState.variant;
        message = notificationState.message;
    }

    return (
        <Stack>
            {props.children}
        </Stack>
    )
}