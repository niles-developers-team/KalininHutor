import { ArrowBack, CurrencyRuble, Email, Phone } from "@mui/icons-material";
import { DialogContent, Typography, Grid, Button, DialogActions, Stack, IconButton } from "@mui/material";
import { BookingRoomVariantInfo } from "../rentalObjects/BookingRoomVariantInfo";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { AppState, BookingActions, RoomCharacteristicActions } from "../../store";
import { useEffect } from "react";

export const BookingDetailsComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { bookingState, roomCharacteristicState } = useAppSelector((state: AppState) => state);

    const { id } = useParams();

    useEffect(() => {
        if (!id)
            return;

        dispatch(BookingActions.getBooking(id));
        dispatch(RoomCharacteristicActions.getRoomCharacteristics());
    }, [id]);

    function handleGoBack() {
        navigate(`/me`);
    }

    async function handleApprove() {
        await dispatch(BookingActions.approveBooking(booking));
        navigate(`/me`);
    }

    if (!bookingState.model)
        return (<Typography>Не найден объект аренды</Typography>);


    if (!roomCharacteristicState.models)
        return (<Typography>Не найден объект аренды</Typography>);


    const booking = bookingState.model;
    const characteristics = roomCharacteristicState.models;

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={handleGoBack}><ArrowBack /></IconButton>
                <Typography color="GrayText" variant="h6">Детали брони #{booking.number}</Typography>
                <Grid item xs></Grid>
                <Button onClick={handleApprove}>Подтвердить бронь</Button>
            </Stack>
            <DialogContent>
                <Stack>
                    <Grid container direction="row" spacing={2} marginBottom=".5em">
                        <Grid item xs={6}>
                            <Typography><b>Объект аренды: </b></Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>{booking.rentalObject?.name}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={2} marginBottom=".5em">
                        <Grid item xs={6}>
                            <Typography><b>Количество гостей: </b></Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>{booking.adultCount + booking.childCount} {booking.childCount > 0 ? `(детей: ${booking.childCount})` : ''}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={2} marginBottom=".5em">
                        <Grid item xs={6}>
                            <Typography><b>Контакты арендатора: </b></Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack>
                                <Typography>{booking.tenant?.name} {booking.tenant?.lastname}</Typography>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Phone fontSize="small" />
                                    <span>{booking.tenant?.phoneNumber}</span>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Email fontSize="small" />
                                    <a href={`mailto:${booking.tenant?.email}`}>{booking.tenant?.email}</a>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={2} marginBottom=".5em">
                        <Grid item xs={6}>
                            <Typography><b>Всего: </b></Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack direction="row" alignItems="center">
                                <Typography>{booking.total}</Typography>
                                <CurrencyRuble fontSize="small" />
                            </Stack>
                        </Grid>
                    </Grid>
                    <Stack>
                        <Typography><b>Выбранные варианты номеров: </b></Typography>
                        {booking.roomVariants.map((brv, index) => {
                            const roomVariant = booking.rentalObject?.roomVariants?.find(rv => rv.id === brv.roomVariantId);
                            if (!roomVariant) {
                                return;
                            }
                            return (<BookingRoomVariantInfo
                                bookingRoomVariant={brv}
                                roomVariant={roomVariant}
                                characteristics={characteristics}
                                isLast={index === (booking.roomVariants?.length || 0) - 1}
                            />);
                        })}
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Stack>
    );
}