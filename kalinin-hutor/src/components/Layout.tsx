import { AppBar, Badge, Button, Container, Grid, Slide, TextField, Toolbar, useScrollTrigger } from "@mui/material";
import { RouteProps, useNavigate } from "react-router-dom";
import { Search, Face, Favorite, ShoppingBag, ShoppingCart, Gite } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from "../hooks";
import { AppState, NotificationActions } from "../store";
import { NotificationVariant, Notification } from "../models";
import { MessageSnackbar } from "./common";
import { HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { sessionService } from "../services";

interface Props extends RouteProps {
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

export const LayoutComponent = function (props: Props): JSX.Element {
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

        dispatch(NotificationActions.getCurrentUserNotifications({}));
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

    const notificationsCount = notificationState.models.filter(o => !o.read)?.length ?? 0;

    return (
        <Grid container direction="row">
            <HideOnScroll {...props}>
                <AppBar position="sticky" color="default" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Grid container className="container" alignItems="center">
                            <Button onClick={() => navigate('/')}>КХ</Button>
                            <Button onClick={() => navigate('/catalog')}>Каталог</Button>
                            <Grid item xs>
                                <TextField size="small" fullWidth variant="outlined" placeholder="Поиск" />
                            </Grid>
                            <Button variant="contained"><Search /></Button>
                            <Button size="small" href="/me" onClick={handleAccountClick}>
                                <Grid container direction="column" alignItems="center">
                                    {notificationsCount ? (<Badge badgeContent={notificationsCount} color="error">
                                        <Face />
                                    </Badge>) : (<Face />)}

                                    <span>{profilePageText}</span>
                                </Grid>
                            </Button>
                            <Button size="small" href="/favorite">
                                <Grid container direction="column" alignItems="center">
                                    <Favorite />
                                    <span>Избранное</span>
                                </Grid>
                            </Button>
                            <Button size="small" href="/my-orders">
                                <Grid container direction="column" alignItems="center">
                                    <ShoppingBag />
                                    <span>Заказы</span>
                                </Grid>
                            </Button>
                            <Button size="small" href="/my-bookings">
                                <Grid container direction="column" alignItems="center">
                                    <Gite />
                                    <span>Брони</span>
                                </Grid>
                            </Button>
                            <Button size="small" href="/cart">
                                <Grid container direction="column" alignItems="center">
                                    <ShoppingCart />
                                    <span>Корзина</span>
                                </Grid>
                            </Button>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <Container component="main" sx={{ marginTop: "40px" }}>
                {props.children}
            </Container>
            <Toolbar color="primary">
            </Toolbar>
            <MessageSnackbar
                variant={variant}
                open={notificationState.show}
                message={message}
                onClose={() => { dispatch(NotificationActions.hideSnackbar()); }}
            />
        </Grid>
    )
};
