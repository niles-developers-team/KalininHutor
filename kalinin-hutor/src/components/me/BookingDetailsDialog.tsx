import { CurrencyRuble, Email, Phone } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, Typography, Grid, Button, DialogActions, Stack } from "@mui/material";
import { Booking, RoomCharacteristic } from "../../models";
import { BookingRoomVariantInfo } from "../rentalObjects/BookingRoomVariantInfo";

interface Props {
    booking: Booking | undefined;
    open: boolean;
    characteristics: RoomCharacteristic[];
    onApprove: (booking: Booking) => void;
    onClose: () => void;
}

export const BookingDetailsDialog = function (props: Props): JSX.Element {
    const { booking, open, characteristics, onApprove, onClose } = props;

    if (!booking)
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogContent>
                    return (<Typography> Неизвестная бронь </Typography>)
                </DialogContent>
            </Dialog>
        );

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle> Детали брони #{booking.number} </DialogTitle>
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
                <Button onClick={() => {
                    onApprove(booking);
                    onClose();
                }}>Подтвердить бронь</Button>
            </DialogActions>
        </Dialog >
    );
}