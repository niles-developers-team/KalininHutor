import { Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RentalObject } from "../../models";
import { AppState, BookingActions, RentalObjectActions } from "../../store";
import moment from "moment";
import { RentalObjectShortInfoComponent, RentalObjectShortInfoSkeleton } from "../rentalObjects/RentalObjectInfo";
import { RentalObjectsBaseFilterComponent } from "../rentalObjects/RentalObjectsFilter";
import { useQuery } from "../../hooks/useQuery";


export const HomeComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const query = useQuery();

    const [filter, setFilter] = useState<RentalObject.GetQuery>({
        adultsCount: 1,
        childsCount: 0,
        roomsCount: 1,
        searchText: ''
    });
    const { rentalObjectState } = useAppSelector((state: AppState) => ({
        rentalObjectState: state.rentalObjectState
    }));

    function handleSearch() {
        if (filter.searchText)
            query.set('searchText', filter.searchText);
        if (filter.adultsCount)
            query.set('adultsCount', filter.adultsCount.toString());
        if (filter.childsCount)
            query.set('childsCount', filter.childsCount.toString());
        if (filter.roomsCount)
            query.set('roomsCount', filter.roomsCount.toString());
        if (filter.checkinDate)
            query.set('checkinDate', moment(filter.checkinDate).format('YYYY-MM-DD'));
        if (filter.checkoutDate)
            query.set('checkoutDate', moment(filter.checkoutDate).format('YYYY-MM-DD'));

        dispatch(BookingActions.clearEditionState());
        navigate(`/rental-objects?${query.toString()}`)
    }

    useEffect(() => { dispatch(RentalObjectActions.getRentalObjects()); }, [])

    let top10RentalObjects: RentalObject[] = [];

    if (rentalObjectState.modelsLoading === false)
        top10RentalObjects = rentalObjectState.models;
    else {
        top10RentalObjects = Array.from(new Array(10));
    }

    return (
        <Stack width="100%">
            <Typography variant="h4">Найдите жилье для вашего отдыха</Typography>
            <RentalObjectsBaseFilterComponent filter={filter} onSearch={handleSearch} onFilterUpdate={setFilter} />
            <Grid item xs container spacing={{ xs: 2 }} columns={{ xs: 10 }} alignItems="center">
                {top10RentalObjects.map((ro, index) =>
                (<Grid item key={index}>
                    {rentalObjectState.modelsLoading
                        ? <RentalObjectShortInfoSkeleton />
                        : <RentalObjectShortInfoComponent model={ro} onShowVariants={() => navigate(`/rental-objects/${ro.id}`)} />
                    }
                </Grid>)
                )}
            </Grid>
        </Stack >
    );
}