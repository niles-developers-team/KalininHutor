import { Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";

interface Props {
    message: string;
}

export const ErrorPage = function (props: Props) {
    const [message, setMessage] = useState<string>('');
    useEffect(() => {
        setMessage(props.message);
    }, [props.message]);

    return (
        <Grid container direction="column" component="main" alignItems="center" justifyContent="center">
            <Typography variant="h1" component="h1">Error... Something went wrong...</Typography>
            <Typography variant="h3" component="h3">{message}</Typography>
        </Grid>
    );
};