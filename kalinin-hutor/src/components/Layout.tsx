import { AppBar, Button, Grid, TextField, Toolbar } from "@mui/material";
import { RouteProps, useNavigate } from "react-router-dom";
import { Search, Face, Favorite, ShoppingBag, ShoppingCart, Gite } from '@mui/icons-material';
import { useAppSelector } from "../hooks";
import { AppState } from "../store";
import { sessionService } from "../services";

interface Props extends RouteProps {
    onSigninDialogOpen: () => void;
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

    return (
        <Grid container direction="row">
            <AppBar position="sticky" className="app-bar">
                <Toolbar>
                    <Grid container className="container" alignItems="center">
                        <Button>Каталог</Button>
                        <Search color="primary" fontSize="large" />
                        <Grid item xs>
                            <TextField fullWidth variant="outlined" placeholder="Поиск" />
                        </Grid>
                        <Button>Поиск</Button>
                        <Button onClick={handleAccountClick}>
                            <Grid container direction="column">
                                <Face />
                                <span>Войти</span>
                            </Grid>
                        </Button>
                        <Button>
                            <Grid container direction="column">
                                <Favorite />
                                <span>Избранное</span>
                            </Grid>
                        </Button>
                        <Button>
                            <Grid container direction="column">
                                <ShoppingBag />
                                <span>Заказы</span>
                            </Grid>
                        </Button>
                        <Button>
                            <Grid container direction="column">
                                <Gite />
                                <span>Брони</span>
                            </Grid>
                        </Button>
                        <Button>
                            <Grid container direction="column">
                                <ShoppingCart />
                                <span>Корзина</span>
                            </Grid>
                        </Button>
                    </Grid>
                </Toolbar>
            </AppBar>
            {props.children}
            <AppBar id="footer" position="fixed" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar>
                </Toolbar>
            </AppBar>
        </Grid>
    )
};
