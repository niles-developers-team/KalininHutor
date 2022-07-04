import { Button, Card, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { useAppSelector } from "../../hooks";
import { RentalObject } from "../../models";
import { AppState } from "../../store";


export const HomeComponent = function (): JSX.Element {
    const { rentalObjectState } = useAppSelector((state: AppState) => ({
        rentalObjectState: state.rentalObjectState
    }));

    let top10RentalObjects: RentalObject[] = [];

    if (rentalObjectState.modelsLoading === false)
        top10RentalObjects = rentalObjectState.models;


    return (
        <Stack>
            <Grid container direction="column">
                <Stack direction="row">
                    <Typography variant="h5">Базы отдыха и дачи</Typography>
                    <Grid item xs />
                    {top10RentalObjects.length ? <Button color="inherit">Посмотреть все</Button> : null}
                </Stack>
                <Grid item xs>
                    {
                        !top10RentalObjects.length
                            ? <CircularProgress size={64} />
                            : top10RentalObjects.map((ro) =>
                                <Card>

                                </Card>
                            )}
                </Grid>
            </Grid>
        </Stack>
    );
}