import { Grid, Typography } from "@mui/material";
import './commonStyles.scss';

export const NotFound = function () {
    return (
        <Grid className="h-100" container direction="column" component="main" alignItems="center" justifyContent="center">
            <Typography variant="h1" component="h1">404... Not found...</Typography>
        </Grid>
    );
};