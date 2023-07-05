import { Stack, Typography } from "@mui/material"
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useQuery } from "../../hooks/useQuery";
import { RentalObject, RoomCharacteristicFilter } from "../../models";
import { AppState, RentalObjectActions, RoomCharacteristicActions } from "../../store";
import { RentalObjectsBaseFilterComponent, RentalObjectsDetailedFilterComponent } from "./RentalObjectsFilter";
import { RentalObjectDetailedInfoComponent, RentalObjectDetailedInfoSkeleton } from "./RentalObjectInfo";

export const RentalObjectsComponent = function (): JSX.Element {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const query = useQuery();
    let [searchParams, setSearchParams] = useSearchParams();
    const { rentalObjectState, roomCharacteristicState } = useAppSelector((state: AppState) => state);

    const [filter, setFilter] = useState<RentalObject.GetQuery>({
        adultsCount: 1,
        childsCount: 0,
        roomsCount: 1,
        searchText: '',
        getBestDemands: true,
        checkinDate: moment().format('YYYY-MM-DD'),
        checkoutDate: moment().add(14, 'days').format('YYYY-MM-DD')
    });
    const [characteristics, setCharacteristics] = useState<RoomCharacteristicFilter[]>([]);

    useEffect(() => {
        const filterFromUrl = {
            searchText: query.get('searchText') || undefined,
            adultsCount: parseInt(query.get('adultsCount') || '') || 1,
            childsCount: parseInt(query.get('childsCount') || '') || 0,
            roomsCount: parseInt(query.get('roomsCount') || '') || 1,
            checkinDate: query.get('checkinDate') || undefined,
            checkoutDate: query.get('checkoutDate') || undefined,
            getBestDemands: true
        };

        const extendedFilter = { ...filterFromUrl, ...filter };

        setFilter(extendedFilter);

        dispatch(RentalObjectActions.getRentalObjects(extendedFilter));
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
        setFilter({ ...filter });
    }

    function handleSearch() {
        dispatch(RentalObjectActions.getRentalObjects({ ...filter, selectedCharacteristicsIds: characteristics.filter(o => o.selected).map(o => o.id) }));
    }

    function handleFilterSelected(id: string, selected: boolean) {
        const filter = characteristics.find(o => o.id === id);
        if (filter) {
            setCharacteristics(characteristics.map(o => o.id === id ? { ...o, selected: selected } : o));
        }
    }

    function handleShowVariants(id: string) {
        navigate(`/rental-objects/${id}?${searchParams}`);
    }

    let rentalObjects: RentalObject[] = [];

    if (rentalObjectState.modelsLoading === false)
        rentalObjects = rentalObjectState.models;
    else {
        rentalObjects = Array.from(new Array(3));
    }
    return (
        <Stack width="100%" direction="row" spacing={3}>
            <RentalObjectsDetailedFilterComponent characteristics={characteristics} onFilterSelected={handleFilterSelected} />
            <Stack>
                <Typography variant="h5">Базы отдыха и дачи</Typography>
                <RentalObjectsBaseFilterComponent filter={filter} onSearch={handleSearch} onFilterUpdate={handleFilterChanged} />
                <Stack>
                    {rentalObjects.map((ro, index) =>
                    (
                        rentalObjectState.modelsLoading
                            ? <RentalObjectDetailedInfoSkeleton />
                            : <RentalObjectDetailedInfoComponent key={ro.id} model={ro} onShowVariants={handleShowVariants} />
                    ))}
                </Stack>
            </Stack>
        </Stack>
    )
}