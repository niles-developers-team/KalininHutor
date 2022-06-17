import { AppBar, Button, Grid, TextField, Toolbar } from "@mui/material";
import { RouteProps, useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import FaceIcon from '@mui/icons-material/Face';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GiteIcon from '@mui/icons-material/Gite';
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
                    <Grid container className="container">
                        <Button>Каталог</Button>
                        <SearchIcon />
                        <Grid item xs>
                            <TextField fullWidth variant="outlined" placeholder="Поиск" />
                        </Grid>
                        <Button>Поиск</Button>
                        <Button onClick={handleAccountClick}>
                            <Grid container direction="column">
                                <FaceIcon />
                                <span>Войти</span>
                            </Grid>
                        </Button>
                        <Button>
                            <Grid container direction="column">
                                <FavoriteIcon />
                                <span>Избранное</span>
                            </Grid>
                        </Button>
                        <Button>
                            <Grid container direction="column">
                                <ShoppingBagIcon />
                                <span>Заказы</span>
                            </Grid>
                        </Button>
                        <Button>
                            <Grid container direction="column">
                                <GiteIcon />
                                <span>Брони</span>
                            </Grid>
                        </Button>
                        <Button>
                            <Grid container direction="column">
                                <ShoppingCartIcon />
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
