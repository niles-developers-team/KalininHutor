import { Button, Grid, Typography } from "@mui/material";

interface NotAuthorizedProps {
    onSigninClick: () => void;
}

export const NotAuthorizedComponent = function (props: NotAuthorizedProps): JSX.Element {
    return (
        <Grid container direction="column" className="h-100" alignItems="center" justifyContent="center">
            <Typography variant="h3">Вы не авторизованы</Typography>
            <Typography variant="h5">Для просмотра страницы необходимо <Button size="large" onClick={props.onSigninClick}>войти</Button></Typography>
        </Grid>
    );
}