import { AppBar, Badge, Button, Container, Grid, IconButton, InputBase, Slide, Stack, TextField, Toolbar, Tooltip, alpha, styled, useScrollTrigger } from "@mui/material";
import { RouteProps, useNavigate } from "react-router-dom";
import { Face, Favorite, ShoppingBag, ShoppingCart, Gite, Search as SearchIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from "../hooks";
import { AppState, NotificationActions } from "../store";
import { NotificationVariant, Notification } from "../models";
import { MessageSnackbar } from "./common";
import { useEffect } from "react";
import { sessionService } from "../services";

interface Props {
    onSigninDialogOpen: () => void;
}


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

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

export const LayoutComponent = function (props: Props & RouteProps): JSX.Element {
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

    const user = userState.currentUser;

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
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Stack width='100%' direction="row" spacing={2}>
                                <Button onClick={() => navigate('/')}>КХ</Button>
                                <Button disabled onClick={() => navigate('/catalog')}>Каталог</Button>
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Поиск…"
                                        inputProps={{ 'aria-label': 'Поиск' }}
                                    />
                                </Search>
                                <Grid xs item/>
                                <Tooltip title={profilePageText}>
                                    <IconButton color="primary" size="small" href="/me" onClick={handleAccountClick}>
                                        {notificationsCount ? (<Badge badgeContent={notificationsCount} color="error">
                                            {user?.avatar ? <img height={24} width={24} style={{ borderRadius: '50%', objectFit: "cover" }} src={`data:${user.avatar.extension};base64,${user.avatar.body}`}></img> : <Face />}
                                        </Badge>) : (<Face />)}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Избранное'>
                                    <IconButton disabled size="small" href="/favorite">
                                        <Favorite />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Заказы'>
                                    <IconButton disabled size="small" href="/my-orders">
                                        <ShoppingBag />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Бронирования'>
                                    <IconButton color="primary" size="small" href="/my-bookings">
                                        <Gite />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Корзина'>
                                    <IconButton disabled size="small" href="/cart">
                                        <ShoppingCart />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>
            <Container component="main" sx={{ marginTop: "40px" }}>
                {props.children}
            </Container>
            <MessageSnackbar
                variant={variant}
                open={notificationState.show}
                message={message}
                onClose={() => { dispatch(NotificationActions.hideSnackbar()); }}
            />
        </Grid>
    )
};
