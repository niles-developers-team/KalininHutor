import { Grid } from "@mui/material"
import { appName } from "../..";

export const MyOrdersComponent = function() : JSX.Element {
    document.title = `${appName} / Мои заказы`;
    return (<Grid container></Grid>)
}