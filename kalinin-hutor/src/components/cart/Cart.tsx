import { Grid } from "@mui/material"
import { appName } from "../..";

export const CartComponent = function (): JSX.Element {
    document.title = `${appName} / Корзина`;
    return (<Grid></Grid>);
}