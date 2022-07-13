import { Grid, Stack, Typography } from "@mui/material"
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useQuery } from "../../hooks/useQuery";
import { RentalObject, RoomCharacteristic, RoomCharacteristicFilter } from "../../models";
import { AppState, RentalObjectActions, RoomCharacteristicActions } from "../../store";
import { RentalObjectsBaseFilterComponent, RentalObjectsDetailedFilterComponent } from "./RentalObjectsFilter";
import { RentalObjectShortInfoComponent, RentalObjectShortInfoSkeleton } from "./RentalObjectShortInfo";

export const RentalObjectsComponent = function (): JSX.Element {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const query = useQuery();
    let [searchParams, setSearchParams] = useSearchParams();
    const { rentalObjectState, roomCharacteristicState } = useAppSelector((state: AppState) => ({
        rentalObjectState: state.rentalObjectState,
        roomCharacteristicState: state.roomCharacteristicState
    }));

    const [filter, setFilter] = useState<RentalObject.GetQuery>({
        adultsCount: 1,
        childsCount: 0,
        roomsCount: 1,
        searchText: ''
    });
    const [characteristics, setCharacteristics] = useState<RoomCharacteristicFilter[]>([]);

    useEffect(() => {
        const filter = {
            searchText: query.get('searchText') || undefined,
            adultsCount: parseInt(query.get('adultsCount') || '') || 1,
            childsCount: parseInt(query.get('childsCount') || '') || 0,
            roomsCount: parseInt(query.get('roomsCount') || '') || 1,
            checkinDate: query.get('checkinDate') || undefined,
            checkoutDate: query.get('checkoutDate') || undefined
        };
        setFilter(filter);

        dispatch(RentalObjectActions.getRentalObjects(filter));
        dispatch(RoomCharacteristicActions.getRoomCharacteristics());
    }, []);

    useEffect(() => {
        if (roomCharacteristicState.modelsLoading === false)
            setCharacteristics(roomCharacteristicState.models);
    }, [roomCharacteristicState.modelsLoading === false])

    function handleFilterChanged(filter: RentalObject.GetQuery) {
        if (filter.searchText) query.set('searchText', filter.searchText);
        else query.delete('searchText');

        if (filter.adultsCount) query.set('adultsCount', filter.adultsCount.toString());
        else query.delete('adultsCount');

        if (filter.childsCount) query.set('childsCount', filter.childsCount.toString());
        else query.delete('childsCount');

        if (filter.roomsCount) query.set('roomsCount', filter.roomsCount.toString());
        else query.delete('roomsCount');

        if (filter.checkinDate) query.set('checkinDate', moment(filter.checkinDate).format('YYYY-MM-DD'));
        else query.delete('checkinDate');

        if (filter.checkoutDate) query.set('checkoutDate', moment(filter.checkoutDate).format('YYYY-MM-DD'));
        else query.delete('checkoutDate');

        setSearchParams(query.toString());
        setFilter(filter);
    }

    function handleSearch() {
        dispatch(RentalObjectActions.getRentalObjects({ ...filter, selectedCharacteristicsIds: characteristics.filter(o => o.selected).map(o => o.id) }));
    }

    function handleFilterSelected(id: string, selected: boolean) {
        const filter = characteristics.find(o => o.id === id);
        if (filter) {
            setCharacteristics([...characteristics.map(o => o.id === id ? { ...o, selected: selected } : o)]);
        }
    }

    let rentalObjects: RentalObject[] = [];

    if (rentalObjectState.modelsLoading === false)
        rentalObjects = rentalObjectState.models;
    else {
        rentalObjects = Array.from(new Array(10));
    }
    return (
        <Stack width="100%" direction="row" spacing={3}>
            <RentalObjectsDetailedFilterComponent characteristics={characteristics} loading={roomCharacteristicState.modelsLoading} onFilterSelected={handleFilterSelected} />
            <Stack>
                <Typography variant="h5">Базы отдыха и дачи</Typography>
                <RentalObjectsBaseFilterComponent filter={filter} onSearch={handleSearch} onFilterUpdate={handleFilterChanged} />
                <Grid container item xs spacing={{ xs: 2 }} columns={{ xs: 10 }} alignItems="center">
                    {rentalObjects.map((ro, index) =>
                    (
                        <Grid item key={index}>
                            {rentalObjectState.modelsLoading
                                ? <RentalObjectShortInfoSkeleton />
                                : <RentalObjectShortInfoComponent model={ro} onShowVariants={() => navigate(`/rental-objects/${ro.id}`)} />
                            }
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Stack>
    )
}