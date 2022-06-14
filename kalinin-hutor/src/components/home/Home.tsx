import { Container, Grid, CircularProgress } from "@mui/material";
import { useState } from "react";
import { RouteProps } from "react-router-dom";

interface Props extends RouteProps {}

export const HomeComponent = function(props: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    
    return (
        <Container maxWidth="sm">
            <Grid container direction="column" component="main" alignItems="center" justifyContent="start">
                {loading && <CircularProgress />}
            </Grid>
        </Container>
    );
}