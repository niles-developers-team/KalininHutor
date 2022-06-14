import { Grid, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { AccountCircle, Home as HomeIcon, Forum, Search } from "@mui/icons-material";
import { RouteProps, useLocation, Link } from "react-router-dom";


interface Props extends RouteProps { }

export const LayoutComponent = function (props: Props): JSX.Element {

    const location = useLocation();

    function isMenuItemSelected(menuItemPath: string): boolean {

        if (menuItemPath.lastIndexOf('/') > 0)
            return location.pathname.includes(menuItemPath);

        return location.pathname === menuItemPath;
    }

    return (
        <Grid container direction="row">
            <Grid item xs={2} container direction="column" textAlign="center" justifyContent="center">
                <Typography color="primary" variant="h4">HELP IT EASY</Typography>
                <Grid item xs />
                <List>
                    <ListItemButton selected={isMenuItemSelected('/')} key="home" component={Link} to={'/'}>
                        <ListItemIcon>
                            <HomeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText>Лента</ListItemText>
                    </ListItemButton>
                    <ListItemButton selected={isMenuItemSelected('/search')} key="search" component={Link} to={'/search'}>
                        <ListItemIcon>
                            <Search color="primary" />
                        </ListItemIcon>
                        <ListItemText>Поиск</ListItemText>
                    </ListItemButton>
                    <ListItemButton selected={isMenuItemSelected('/messenger')} key="messanger" component={Link} to={'/messenger'}>
                        <ListItemIcon>
                            <Forum color="primary" />
                        </ListItemIcon>
                        <ListItemText>Мессенджер</ListItemText>
                    </ListItemButton>
                    <ListItemButton selected={isMenuItemSelected('/me')} key="me" component={Link} to={'/me'}>
                        <ListItemIcon>
                            <AccountCircle color="primary" />
                        </ListItemIcon>
                        <ListItemText>Профиль</ListItemText>
                    </ListItemButton>
                </List>
                <Grid item xs />
            </Grid>
            <Grid xs={10} >
                {props.children}
            </Grid>
        </Grid>
    )
};
