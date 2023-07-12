import { Stack } from "@mui/material";
import { useEffect } from "react";
import { RouteProps, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { NotificationStatus, NotificationVariant, Notification } from "../models";
import { sessionService } from "../services";
import { AppState, NotificationActions } from "../store";

interface Props {
    onSigninDialogOpen: () => void;
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