import { FavoriteBorder } from "@mui/icons-material";
import { Button, Grid, IconButton, Paper, Skeleton, Stack, Typography } from "@mui/material"
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useQuery } from "../../hooks/useQuery";
import { RentalObject, RoomCharacteristic } from "../../models"
import { AppState, RentalObjectActions, RoomCharacteristicActions } from "../../store";
import { RoomVariantInfoComponent } from "./RoomVariant";

export const RentalObjectComponent = function (): JSX.Element {
    const { roomCharacteristicState, rentalObjectState } = useAppSelector((state: AppState) => ({
        roomCharacteristicState: state.roomCharacteristicState,
        rentalObjectState: state.rentalObjectState
    }));


    const query = useQuery();
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const [model, setModel] = useState<RentalObject>();
    const [roomCharacteristics, setRoomsCharateristics] = useState<RoomCharacteristic[]>([]);

    const [filter, setFilter] = useState<RentalObject.GetQuery>({
        adultsCount: 1,
        childsCount: 0,
        roomsCount: 1,
        searchText: '',
        getBestDemands: true
    });

    useEffect(() => { init(); }, [id]);

    useEffect(() => {
        const filterFromUrl = {
            adultsCount: parseInt(query.get('adultsCount') || '') || 1,
            childsCount: parseInt(query.get('childsCount') || '') || 0,
            roomsCount: parseInt(query.get('roomsCount') || '') || 1,
            checkinDate: query.get('checkinDate') || undefined,
            checkoutDate: query.get('checkoutDate') || undefined,
        };
        setFilter(filterFromUrl);
    }, []);

    useEffect(() => {
        if (rentalObjectState.modelLoading === false) {
            setModel(rentalObjectState.model);
        }
    }, [rentalObjectState.modelLoading === false && rentalObjectState.model]);


    useEffect(() => {
        if (roomCharacteristicState.modelsLoading === false) {
            setRoomsCharateristics(roomCharacteristicState.models);
        }
    }, [roomCharacteristicState.modelsLoading === false]);

    async function init() {
        if (rentalObjectState.modelsLoading === true) {
            await dispatch(RentalObjectActions.getRentalObjects({ id: id }));
        }
        await dispatch(RentalObjectActions.getRentalObject(id));
        dispatch(RoomCharacteristicActions.getRoomCharacteristics());
    }

    const checkinDate = moment(filter.checkinDate);
    const checkoutDate = moment(filter.checkoutDate);
    const nightsCount = checkoutDate.dayOfYear() - checkinDate.dayOfYear();

    if (!model)
        return (<Typography>Не найден объект аренды</Typography>)

    return (
        <Stack>
            <Stack direction="row">
                <Typography variant="h4">{model.name}</Typography>
                <IconButton disabled><FavoriteBorder /></IconButton>
            </Stack>
            <Typography variant="subtitle2" color="GrayText">{model.address}</Typography>
            <Stack direction="row" marginTop="1em" spacing={2}>
                <Paper variant="outlined">
                    <Skeleton variant="rectangular" width={240} height={240} />
                </Paper>
                <Grid item xs>
                    <Typography>{model.description}</Typography>
                </Grid>
            </Stack>
            <Stack marginTop="1em" spacing={1}>
                <Stack direction="row" alignItems="center">
                    <Typography variant="h5">Доступные варианты</Typography>
                    <Grid item xs />
                    <Button variant="outlined" color="success">Забронировать</Button>
                </Stack>
                {
                    model.roomVariants?.map(roomVariant => (
                        <RoomVariantInfoComponent model={roomVariant} nightsCount={nightsCount} roomCharacteristics={roomCharacteristics} />
                    ))
                }
                <Stack direction="row" alignItems="center">
                    <Grid item xs />
                    <Button variant="outlined" color="success">Забронировать</Button>
                </Stack>
            </Stack>
        </Stack >
    )
}