import { useEffect } from "react";
import { Button, Grid, Paper, Skeleton, Stack, TextField, Typography } from "@mui/material";

import { useNavigate, useParams, createSearchParams } from "react-router-dom";
import moment from "moment";

import { Booking, EntityStatus, RentalObject, RoomCharacteristic, RoomVariant } from "../../models";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { AppState, BookingActions, RentalObjectActions, RoomCharacteristicActions } from "../../store";
import { BookingDetailsComponent } from "./BookingDetails";
import { BookingRoomVariantInfo } from "./BookingRoomVariantInfo";

export const BookingComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id, rentalObjectId } = useParams();
    const { bookingState, rentalObjectState, roomCharacteristicState } = useAppSelector((state: AppState) => ({
        bookingState: state.bookingState,
        rentalObjectState: state.rentalObjectState,
        roomCharacteristicState: state.roomCharacteristicState
    }));

    useEffect(() => {
        if (!id)
            return;

        if (!rentalObjectId)
            return;

        dispatch(BookingActions.getBooking(id));
        dispatch(RentalObjectActions.getRentalObject(rentalObjectId));
        dispatch(RoomCharacteristicActions.getRoomCharacteristics());
    }, [id, rentalObjectId]);

    function handleChangeBooking() {
        if (!model)
            return;

        const search = createSearchParams();
        if (model.adultCount)
            search.append('adultsCount', model.adultCount.toString());
        if (model.childCount)
            search.append('childsCount', model.childCount.toString());
        if (model.checkinDate)
            search.append('checkinDate', moment(model.checkinDate).format('YYYY-MM-DD'));
        if (model.checkoutDate)
            search.append('checkoutDate', moment(model.checkoutDate).format('YYYY-MM-DD'));

        navigate(`/rental-objects/${model.rentalObject.id}?${search}`);
    }

    async function handleConfirmBooking() {
        if (!model)
            return;

        if (model.entityStatus === EntityStatus.Draft) {
            await dispatch(BookingActions.createBooking(model));
        } else if (model.entityStatus === EntityStatus.Updated) {
            //await dispatch(BookingActions.updateBooking(model));
        }

        dispatch(BookingActions.clearEditionState());
        navigate('/my-bookings');
    }

    if (!bookingState.model)
        return (<Typography>Ошибка при бронировании</Typography>);

    const model: Booking = bookingState.model;
    const rentalObject: RentalObject | undefined = rentalObjectState.model;
    const characteristics: RoomCharacteristic[] = roomCharacteristicState.models || [];

    const nightsCount = moment(model.checkoutDate).dayOfYear() - moment(model.checkinDate).dayOfYear();

    return (
        <Stack>
            <Stack direction="row" spacing={3}>
                <BookingDetailsComponent
                    model={model}
                    nightsCount={nightsCount}
                    rentalObjectRoomVariants={rentalObject?.roomVariants || []}
                    onConfirmBooking={handleConfirmBooking}
                />
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                        <Paper variant="outlined">
                            <Skeleton variant="rectangular" width={100} height={100} />
                        </Paper>
                        <Stack>
                            <Typography variant="h6"><b>{rentalObject?.name}</b></Typography>
                            <Typography variant="caption">{rentalObject?.address}</Typography>
                        </Stack>
                    </Stack>
                    <Typography variant="h6">Ваши данные:</Typography>
                    <Stack direction="row" spacing={2} >
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Имя"
                            value={model?.tenant?.name || ''}
                            onChange={(event) => dispatch(BookingActions.updateDraft({ ...model, tenant: { ...model.tenant, name: event.target.value } }))} />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Фамилия"
                            value={model?.tenant?.lastname || ''}
                            onChange={(event) => dispatch(BookingActions.updateDraft({ ...model, tenant: { ...model.tenant, lastname: event.target.value } }))} />
                    </Stack>
                    <Stack direction="row" spacing={2} >
                        <TextField
                            variant="outlined"
                            label="Телефон"
                            value={model?.tenant?.phoneNumber || ''}
                            onChange={(event) => dispatch(BookingActions.updateDraft({ ...model, tenant: { ...model.tenant, phoneNumber: event.target.value } }))} />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="E-mail"
                            required
                            value={model?.tenant?.email || ''}
                            onChange={(event) => dispatch(BookingActions.updateDraft({ ...model, tenant: { ...model.tenant, email: event.target.value } }))} />
                    </Stack>
                    <Stack direction="row" alignItems="center">
                        <Typography variant="h6">Выбранные варианты:</Typography>
                        <Grid item xs />
                        <Button onClick={handleChangeBooking}>Уточнить варианты</Button>
                    </Stack>
                    {model.roomVariants?.map((brv, index) => {
                        const roomVariant = rentalObject?.roomVariants?.find(o => o.id === brv.roomVariantId) || RoomVariant.initial;

                        return (<BookingRoomVariantInfo
                            bookingRoomVariant={brv}
                            roomVariant={roomVariant}
                            characteristics={characteristics}
                            isLast={index !== (model.roomVariants?.length || 0) - 1}
                        />);
                    })}
                </Stack>
            </Stack>
        </Stack>
    );
}