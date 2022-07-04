import { Grid, Paper, Skeleton, Stack, Typography } from "@mui/material"
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RentalObject } from "../../models";
import { AppState, RentalObjectActions } from "../../store";

export const RentalObjectsComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const { rentalObjectState } = useAppSelector((state: AppState) => ({
        rentalObjectState: state.rentalObjectState
    }));
    useEffect(() => { dispatch(RentalObjectActions.getRentalObjects()); }, [])

    let rentalObjects: RentalObject[] = [];

    if (rentalObjectState.modelsLoading === false)
        rentalObjects = rentalObjectState.models;
    else {
        rentalObjects = Array.from(new Array(10));
    }
    return (
        <Stack width="100%">
            <Stack direction="row">
                <Typography variant="h5">Базы отдыха и дачи</Typography>
            </Stack>
            <Grid item xs>
                <Grid container spacing={{ xs: 2 }} columns={{ xs: 10 }} alignItems="center">
                    {rentalObjects.map((ro, index) =>
                    (<Grid item key={index}>
                        {rentalObjectState.modelsLoading
                            ? (
                                <Paper>
                                    <Stack padding={2} spacing={2}>
                                        <Skeleton variant="rectangular" width={180} height={120} />
                                        <Typography variant="h5">
                                            <Skeleton />
                                        </Typography>
                                        <Skeleton width="60%" />
                                    </Stack>
                                </Paper>
                            ) : (
                                <Paper>
                                    <Stack padding={2} spacing={2}>
                                        <Skeleton variant="rectangular" width={180} height={120} />
                                        <Typography variant="h5">{ro.name}</Typography>
                                        <Typography variant="caption">{ro.address}</Typography>
                                    </Stack>
                                </Paper>
                            )
                        }
                    </Grid>)
                    )}
                </Grid>
            </Grid>
        </Stack>
    )
}