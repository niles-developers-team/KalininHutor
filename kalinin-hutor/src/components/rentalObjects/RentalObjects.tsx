import { Grid, Paper, Skeleton, Stack, Typography } from "@mui/material"
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useQuery } from "../../hooks/useQuery";
import { RentalObject } from "../../models";
import { AppState, RentalObjectActions } from "../../store";

export const RentalObjectsComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const query = useQuery();
    const { rentalObjectState } = useAppSelector((state: AppState) => ({
        rentalObjectState: state.rentalObjectState
    }));


    useEffect(() => {    
        dispatch(RentalObjectActions.getRentalObjects({
            searchText: query.get('searchText') || undefined,
            adultsCount: parseInt(query.get('adultsCount') || '') || undefined,
            childsCount: parseInt(query.get('childsCount') || '') || undefined,
            roomsCount: parseInt(query.get('roomsCount') || '') || undefined,
            checkinDate: query.get('checkinDate') || undefined,
            checkoutDate: query.get('checkoutDate') || undefined
        }));
    }, [])

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