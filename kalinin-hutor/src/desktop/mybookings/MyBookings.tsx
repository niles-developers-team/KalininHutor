import { Divider, Stack, Typography } from "@mui/material"
import moment from "moment";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks"
import { BookingStatuses } from "../../models";
import { AppState, BookingActions, RoomCharacteristicActions, NotificationActions } from "../../store";
import { BookingRoomVariantInfo } from "../rentalObjects/BookingRoomVariantInfo";
import { appName } from "../..";
import ym from 'react-yandex-metrika';

export const MyBookingsComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const { bookingState, userState, roomCharacteristicState } = useAppSelector((state: AppState) => state);

    useEffect(() => { dispatch(RoomCharacteristicActions.getRoomCharacteristics()); }, []);
    useEffect(() => {
        getCurrentUserBookings();        
        ym('reachGoal', 'desktop_enter_my_bookings');
    }, [userState.modelLoading]);

    function getCurrentUserBookings() {
        if (userState.currentUser)
            dispatch(BookingActions.getBookings({ tenantId: userState.currentUser.id }));
    }

    const bookings = bookingState.models || [];
    const characteristics = roomCharacteristicState.models || [];

    document.title = `${appName} / Мои бронирования`;

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
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="h6"><b>{booking.rentalObject?.name}</b></Typography>
                            <Typography>c {moment(booking.checkinDate).format('DD.MM.YY')} по {moment(booking.checkoutDate).format('DD.MM.YY')}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Typography><b>Информация о госте:</b></Typography>
                            <Typography>{booking.tenant.name}</Typography>
                            <Typography>{booking.tenant.lastname}</Typography>
                        </Stack>
                        {booking.roomVariants?.map((brv, index) => {
                            const roomVariant = booking.rentalObject.roomVariants?.find(o => o.id === brv.roomVariantId);
                            if (!roomVariant) {
                                dispatch(NotificationActions.showSnackbar('Не удалось найти вариант номера'));
                                return (<Typography>Не удалось найти вариант номера</Typography>);
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