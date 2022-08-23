import { Divider, Stack, Typography } from "@mui/material"
import moment from "moment";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks"
import { BookingStatuses } from "../../models";
import { AppState, BookingActions, RoomCharacteristicActions, SnackbarActions } from "../../store";
import { BookingRoomVariantInfo } from "../rentalObjects/BookingRoomVariantInfo";

export const MyBookingsComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const { bookingState, userState, roomCharacteristicState } = useAppSelector((state: AppState) => state);

    useEffect(() => { dispatch(RoomCharacteristicActions.getRoomCharacteristics()); }, []);
    useEffect(() => {
        if (userState.authenticating === false && userState.currentUser)
            dispatch(BookingActions.getBookings({ tenantId: userState.currentUser.id }));
    }, [userState.authenticating === false && userState.currentUser]);

    const bookings = bookingState.models || [];
    const characteristics = roomCharacteristicState.models || [];

    return (
        <Stack>
            <Typography color="GrayText" variant="h6">Мои бронирования</Typography>
            {(bookings.map((booking, index) => {
                return (
                    <Stack spacing={2}>
                        <Stack marginTop="1em" spacing={2} direction="row" alignItems="center">
                            <Typography variant="subtitle1"><b>#{booking.number}</b> от {moment(booking.createdAt).format('DD.MM.YYYY')}</Typography>
                            {BookingStatuses.getIcon(booking.status)}
                            <Typography color="GrayText">{BookingStatuses.getDescription(booking.status)}</Typography>
                        </Stack>
                        <Typography variant="h6"><b>{booking.rentalObject?.name}</b></Typography>
                        <Typography><b>Информация о госте:</b></Typography>
                        {!booking.tenant ? null
                            : (
                                <Stack> <Typography>{booking.tenant.name}</Typography>
                                </Stack>)
                        }
                        {booking.roomVariants?.map((brv, index) => {
                            const roomVariant = booking.rentalObject?.roomVariants?.find(o => o.id === brv.roomVariantId);
                            if (!roomVariant) {
                                dispatch(SnackbarActions.showSnackbar('Не удалось найти вариант номера'));
                                return;
                            }

                            return (<BookingRoomVariantInfo
                                bookingRoomVariant={brv}
                                roomVariant={roomVariant}
                                characteristics={characteristics}
                                isLast={index === (booking.roomVariants?.length || 0) - 1}
                            />);
                        })}
                        {index !== bookings.length - 1 ? <Divider flexItem /> : null}
                    </Stack>
                );
            }
            ))}
        </Stack>
    )
}