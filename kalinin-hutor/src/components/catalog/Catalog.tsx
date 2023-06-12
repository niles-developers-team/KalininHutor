import { Grid } from "@mui/material"
import { appName } from "../.."

export const CatalogComponent = function (): JSX.Element {

    document.title = appName;

    return (<Grid></Grid>)
}