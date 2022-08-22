import { CurrencyRuble, Info } from "@mui/icons-material";
import { Button, Grid, IconButton, Stack, Typography } from "@mui/material";
import moment from "moment";
import { Booking } from "../../models";

interface Props {
    bookings: Booking[];
    onBookingApprove: (booking: Booking) => void;
    onShowInfo: (booking: Booking) => void;
}

export const MyRentalObjectsBookingsComponent = function (props: Props): JSX.Element {
    const { bookings, onBookingApprove, onShowInfo } = props;


    return (
        <Stack spacing={2}>
            <Typography color="GrayText" variant="h6">Не подтвержденные бронирования</Typography>
            {bookings.map(o => (
                <Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography><a href={`/me/rental-objects/${o.rentalObjectId}`}>{o.rentalObject?.name}</a></Typography>
                        <Typography>{moment(o.checkinDate).format('DD.MM.yyyy')} - {moment(o.checkoutDate).format('DD.MM.yyyy')}</Typography>
                        <Grid item xs />
                        <Typography>{o.total}</Typography>
                        <CurrencyRuble fontSize="small" />
                        <Button onClick={() =>onBookingApprove(o)}>Подтвердить</Button>
                        <IconButton onClick={() => onShowInfo(o)}><Info /></IconButton>
                    </Stack>
                    <Typography color="GrayText">{o.tenant.name} {o.tenant.lastname}</Typography>
                </Stack>
            ))}
        </Stack>
    );
}