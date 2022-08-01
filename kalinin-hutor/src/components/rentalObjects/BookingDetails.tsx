import { CurrencyRuble } from "@mui/icons-material";
import { Stack, Typography, Paper, Divider, Grid, Button } from "@mui/material";
import moment from "moment";
import pluralize from "plural-ru";
import { Booking, RoomVariant } from "../../models";

interface Props {
    model: Booking;
    nightsCount: number;
    rentalObjectRoomVariants: RoomVariant[];
    onConfirmBooking: () => void;
}

export const BookingDetailsComponent = function (props: Props): JSX.Element {
    const { model, nightsCount, rentalObjectRoomVariants, onConfirmBooking } = props;
    return (
        <Stack spacing={2}>
            <Typography variant="h5">Детали бронирования</Typography>
            <Paper variant="outlined">
                <Stack spacing={1} padding=".5em">
                    <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                        <Stack>
                            <Typography variant="subtitle1"><b>Заезд</b></Typography>
                            <Typography>{moment(model?.checkinDate).format('DD.MM.YYYY')}</Typography>
                        </Stack>
                        <Stack>
                            <Typography variant="subtitle1"><b>Отъезд</b></Typography>
                            <Typography>{moment(model?.checkoutDate).format('DD.MM.YYYY')}</Typography>
                        </Stack>
                    </Stack>
                    <Typography variant="subtitle1"><b>Длительность проживания:</b></Typography>
                    <Typography> {nightsCount} {pluralize(nightsCount, 'ночь', 'ночи', 'ночей')}</Typography>
                    <Divider flexItem />
                    <Typography variant="subtitle1"><b>Вы выбрали:</b></Typography>
                    {model?.roomVariants?.map(brv => {
                        const roomVariant = rentalObjectRoomVariants.find(o => o.id === brv.roomVariantId)
                        return <Typography key={roomVariant?.id}>{brv.roomsCount} x {roomVariant?.name}</Typography>
                    }
                    )}
                    <Divider flexItem />
                    <Stack direction="row" alignItems="center">
                        <Typography variant="subtitle1"><b>Итого:</b></Typography>
                        <Grid item xs />
                        <Typography variant="subtitle1">{model?.total}</Typography>
                        <CurrencyRuble fontSize="small" />
                    </Stack>
                </Stack>
            </Paper>
            <Button variant="outlined" color="success" size="small" onClick={onConfirmBooking}>Подтвердить бронирование</Button>
        </Stack>
    );
}