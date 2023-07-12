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
import { appName } from "../..";
import ym from 'react-yandex-metrika';


export const HomeComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const query = useQuery();

    const [filter, setFilter] = useState<RentalObject.GetQuery>({
        adultsCount: 1,
        childsCount: 0,
        roomsCount: 1,
        searchText: '',
        checkinDate: moment().format('YYYY-MM-DD'),
        checkoutDate: moment().add(14, 'days').format('YYYY-MM-DD')
    });
    const { rentalObjectState } = useAppSelector((state: AppState) => state);

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

        navigate(`/rental-objects?${query.toString()}`)
    }

    function handleGoToRentalObject(id: string) {
        dispatch(BookingActions.clearEditionState());
        navigate(`/rental-objects/${id}`)
    }

    useEffect(() => {
        dispatch(RentalObjectActions.getRentalObjects());
        ym('reachGoal', 'desktop_enter_home');
    }, [])

    let top10RentalObjects: RentalObject[] = [];

    if (rentalObjectState.modelsLoading === false)
        top10RentalObjects = rentalObjectState.models;
    else {
        top10RentalObjects = Array.from(new Array(10));
    }

    document.title = appName;

    return (
        <Stack width="100%" spacing={1}>
            <Typography variant="h5">Найдите жилье для вашего отдыха</Typography>
            <RentalObjectsBaseFilterComponent filter={filter} onSearch={handleSearch} onFilterUpdate={setFilter} />
            <Grid item xs container spacing={{ xs: 2 }} columns={{ xs: 10 }} alignItems="center">
                {top10RentalObjects.map((ro, index) =>
                (<Grid xs item key={index}>
                    {rentalObjectState.modelsLoading
                        ? <RentalObjectShortInfoSkeleton />
                        : <RentalObjectShortInfoComponent model={ro} onShowVariants={() => handleGoToRentalObject(ro.id || '')} />
                    }
                </Grid>)
                )}
            </Grid>
        </Stack >
    );
}