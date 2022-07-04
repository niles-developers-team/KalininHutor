import { Button, Card, CircularProgress, Grid, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RentalObject } from "../../models";
import { AppState, RentalObjectActions } from "../../store";


export const HomeComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { rentalObjectState } = useAppSelector((state: AppState) => ({
        rentalObjectState: state.rentalObjectState
    }));

    useEffect(() => { dispatch(RentalObjectActions.getRentalObjects()); }, [])

    let top10RentalObjects: RentalObject[] = [];

    if (rentalObjectState.modelsLoading === false)
        top10RentalObjects = rentalObjectState.models;
    else {
        top10RentalObjects = Array.from(new Array(10));
    }


    return (
        <Stack width="100%">
            <Stack direction="row">
                <Typography variant="h5">Базы отдыха и дачи</Typography>
                <Grid item xs />
                {top10RentalObjects.length ? <Button color="inherit" onClick={() => navigate('/rental-objects')}>Посмотреть все</Button> : null}
            </Stack>
            <Grid item xs>
                <Grid container spacing={{ xs: 2 }} columns={{ xs: 10 }} alignItems="center">
                    {top10RentalObjects.map((ro, index) =>
                    (<Grid item key={index}>
                        {rentalObjectState.modelsLoading
                            ? (
                                <Stack padding={2} spacing={2}>
                                    <Paper variant="outlined">
                                        <Skeleton variant="rectangular" width="100%" height={120} />
                                    </Paper>
                                    <Typography variant="h5"><Skeleton /></Typography>
                                    <Skeleton width="60%" />
                                </Stack>
                            )
                            :
                            (
                                <Stack padding={2} spacing={2}>
                                    <Paper variant="outlined">  
                                        <Skeleton variant="rectangular" width="100%" height={120} />
                                    </Paper>
                                    <Typography variant="h5">{ro.name}</Typography>
                                    <Typography variant="caption">{ro.address}</Typography>
                                    <Button onClick={() => navigate(`/rental-objects/${ro.id}`)}>Посмотреть варианты</Button>
                                </Stack>
                            )
                        }
                    </Grid>)
                    )}
                </Grid>
            </Grid>
        </Stack>
    );
}