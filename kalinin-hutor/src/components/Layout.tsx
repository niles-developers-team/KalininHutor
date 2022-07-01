import { AppBar, Button, Grid, Slide, TextField, Toolbar, useScrollTrigger } from "@mui/material";
import { RouteProps, useNavigate } from "react-router-dom";
import { Search, Face, Favorite, ShoppingBag, ShoppingCart, Gite } from '@mui/icons-material';
import { useAppSelector } from "../hooks";
import { AppState } from "../store";
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
    const { userState } = useAppSelector((state: AppState) => ({
        userState: state.userState
    }));
    const navigate = useNavigate();

    function handleAccountClick() {
        if (!sessionService.isUserAuthenticated()) {
            props.onSigninDialogOpen();
            return;
        }

        navigate('/me');
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
                <AppBar position="sticky" color="default">
                    <Toolbar>
                        <Grid container className="container" alignItems="center">
                            <Button onClick={() => navigate('/catalog')}>Каталог</Button>
                            <Search color="primary" fontSize="large" />
                            <Grid item xs>
                                <TextField fullWidth variant="outlined" placeholder="Поиск" />
                            </Grid>
                            <Button>Поиск</Button>
                            <Button onClick={handleAccountClick}>
                                <Grid container direction="column" alignItems="center">
                                    <Face />
                                    <span>{profilePageText}</span>
                                </Grid>
                            </Button>
                            <Button onClick={() => navigate('/favorite')}>
                                <Grid container direction="column" alignItems="center">
                                    <Favorite />
                                    <span>Избранное</span>
                                </Grid>
                            </Button>
                            <Button onClick={() => navigate('/my-orders')}>
                                <Grid container direction="column" alignItems="center">
                                    <ShoppingBag />
                                    <span>Заказы</span>
                                </Grid>
                            </Button>
                            <Button onClick={() => navigate('/my-bookings')}>
                                <Grid container direction="column" alignItems="center">
                                    <Gite />
                                    <span>Брони</span>
                                </Grid>
                            </Button>
                            <Button onClick={() => navigate('/cart')}>
                                <Grid container direction="column" alignItems="center">
                                    <ShoppingCart />
                                    <span>Корзина</span>
                                </Grid>
                            </Button>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <Grid container direction="column" alignItems="center" component="main">
                {props.children}
            </Grid>
            <Toolbar color="primary">
            </Toolbar>
        </Grid>
    )
};
