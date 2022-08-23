import { AppBar, Button, Container, Grid, Slide, TextField, Toolbar, useScrollTrigger } from "@mui/material";
import { RouteProps, useNavigate } from "react-router-dom";
import { Search, Face, Favorite, ShoppingBag, ShoppingCart, Gite } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from "../hooks";
import { AppState, SnackbarActions } from "../store";
import { useEffect, useState } from "react";
import { SnackbarVariant } from "../models";
import { MessageSnackbar } from "./common";

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
    const { userState, snackbarState } = useAppSelector((state: AppState) => ({
        userState: state.userState,
        snackbarState: state.snackbarState
    }));
    const [variant, setVariant] = useState<SnackbarVariant>(SnackbarVariant.info);
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        if (snackbarState.show !== true) {
            setOpen(false);
            return;
        }

        setVariant(snackbarState.variant);
        setOpen(true);
        setMessage(snackbarState.message);
    }, [snackbarState]);

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
                                    <Face />
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
                open={snackbarState.show}
                message={message}
                onClose={() => { dispatch(SnackbarActions.hideSnackbar()); }}
            />
        </Grid>
    )
};
