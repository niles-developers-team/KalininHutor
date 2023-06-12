import { Grid } from "@mui/material";
import { appName } from "../..";

export const FavoriteComponent = function (): JSX.Element {

    document.title = `${appName} / Избранное`;

    return (<Grid container direction="column" alignItems="center"></Grid>);
}