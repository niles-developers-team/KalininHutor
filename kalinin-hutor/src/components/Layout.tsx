import { AppBar, Button, Grid, TextField, Toolbar } from "@mui/material";
import { RouteProps, useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import FaceIcon from '@mui/icons-material/Face';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GiteIcon from '@mui/icons-material/Gite';
import { SigninDialog } from "./signin/Signin";
import { useEffect, useState } from "react";
import { UserActions } from "../store/userStore";
import { useAppDispatch, useAppSelector } from "../hooks";
import { AppState } from "../store";

interface Props extends RouteProps { }

export const LayoutComponent = function (props: Props): JSX.Element {
    const { userState } = useAppSelector((state: AppState) => ({
        userState: state.userState
    }));
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setOpen(userState.authenticating);
    }, [userState.authenticating]);

    function handleAccountClick() {
        if(!userState.authenticating && !userState.authenticated) {
            setOpen(true);
            return;
        }

        navigate('me');
    }

    async function handleSignin(phoneNumber: string, password: string) {
        dispatch(UserActions.signin({
            password: password,
            phoneNumber: `+7${phoneNumber}`,
            withSignup: true
        }));
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
            <SigninDialog
                isOpen={open}
                authenticating={userState.authenticating}
                onSignin={handleSignin}
            />
        </Grid>
    )
};
