import { AspectRatio, FavoriteBorder } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, Paper, Radio, RadioGroup, Skeleton, Stack, Typography } from "@mui/material"
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useQuery } from "../../hooks/useQuery";
import { BedTypes, Booking, EntityStatus, RentalObject, RoomCharacteristic, RoomVariant, RoomVariantBedType } from "../../models"
import { cookiesService } from "../../services";
import { AppState, RentalObjectActions, RoomCharacteristicActions } from "../../store";
import { RoomVariantInfoComponent } from "./RoomVariant";

export const RentalObjectComponent = function (): JSX.Element {
    const { roomCharacteristicState, rentalObjectState } = useAppSelector((state: AppState) => ({
        roomCharacteristicState: state.roomCharacteristicState,
        rentalObjectState: state.rentalObjectState
    }));


    const query = useQuery();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const [model, setModel] = useState<RentalObject>();
    const [booking, setBooking] = useState<Booking>();
    const [roomCharacteristics, setRoomsCharateristics] = useState<RoomCharacteristic[]>([]);
    const [specifyBedsOpen, setSpecifyBedsOpen] = useState<boolean>(false);
    const [specifyBedsRoomVariant, setSpecifyBedsRoomVariant] = useState<RoomVariant>();
    const [specifiedBedType, setSpecifiedBetType] = useState<RoomVariantBedType>();

    useEffect(() => { init(); }, [id]);

    useEffect(() => {
        const adultsCount = parseInt(query.get('adultsCount') || '') || 1;
        const childsCount = parseInt(query.get('childsCount') || '') || 0;
        const checkinDate = query.get('checkinDate') || undefined;
        const checkoutDate = query.get('checkoutDate') || undefined;

        let booking: Booking = {
            rentalObjectId: id,
            adultCount: adultsCount,
            checkinDate: checkinDate || moment().format('yyyy-mm-dd'),
            checkoutDate: checkoutDate || moment().add(10, 'days').format('yyyy-mm-dd'),
            childCount: childsCount,
            status: EntityStatus.Created,
            total: 0,

            roomVariants: []
        };

        const cookieBooking: Booking = cookiesService.get('current-booking');
        if (cookieBooking)
            booking = { ...booking, ...cookieBooking };

        setBooking({ ...booking });
    }, []);

    useEffect(() => {
        if (rentalObjectState.modelLoading === false) {
            setModel(rentalObjectState.model);
        }
    }, [rentalObjectState.modelLoading === false && rentalObjectState.model]);

    useEffect(() => {
        cookiesService.set('current-booking', booking);
    }, [booking])

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

    function handleRoomsCountChanged(roomVariantId: string, newCount: number) {
        const bookingRoomVariant = booking?.roomVariants?.find(o => o.roomVariantId === roomVariantId);
        const roomVariant = model?.roomVariants?.find(o => o.id === roomVariantId);
        if (!booking || !booking.roomVariants)
            return;

        const newAmount = (roomVariant?.price || 0) * nightsCount * newCount;

        if (!bookingRoomVariant) {
            booking.roomVariants.push({
                roomVariantId: roomVariantId,
                roomsCount: newCount,
                amount: newAmount,
                bedType: roomVariant?.bedTypes[0]?.bedType || undefined
            });
        } else if (newCount > 0) {
            booking.roomVariants = booking.roomVariants.map(o => o.roomVariantId === roomVariantId ? { ...o, roomsCount: newCount, amount: newAmount } : o);
        } else if (newCount === 0) {
            booking.roomVariants = booking?.roomVariants?.filter(o => o.roomVariantId !== roomVariantId);
        }

        setBooking({ ...booking });
    }

    function formatRoomVariantInfo(roomVariant: RoomVariant) {
        const roomsCount = booking?.roomVariants?.find(o => o.roomVariantId === roomVariant.id)?.roomsCount || 0;
        return (
            <RoomVariantInfoComponent
                model={roomVariant}
                nightsCount={nightsCount}
                roomsCount={roomsCount}
                roomCharacteristics={roomCharacteristics}
                onRoomsCountChanged={handleRoomsCountChanged}
                onSpecifyBedsClick={() => handleSpecifyBeds(roomVariant)}
            />
        );
    }

    function handleSpecifyBeds(roomVariant: RoomVariant) {
        setSpecifyBedsOpen(true);
        setSpecifyBedsRoomVariant(roomVariant);
        const bookingRoomVariant = booking?.roomVariants?.find(o => o.roomVariantId === roomVariant?.id);
        const roomVariantBedType = roomVariant.bedTypes.find(o => o.bedType === bookingRoomVariant?.bedType) || roomVariant.bedTypes[0];
        setSpecifiedBetType({ ...roomVariantBedType });

    }

    function discardSpecifyBeds() {
        setSpecifyBedsRoomVariant(undefined);
        setSpecifyBedsOpen(false);
    }

    function confirmSpecifyBeds() {
        setSpecifyBedsRoomVariant(undefined);

        const roomVariant = booking?.roomVariants?.find(o => o.roomVariantId === specifyBedsRoomVariant?.id);
        if (!roomVariant || !booking)
            return;

        roomVariant.bedType = specifiedBedType?.bedType;

        setBooking({ ...booking, roomVariants: booking?.roomVariants?.map(o => o.roomVariantId === roomVariant.roomVariantId ? roomVariant : o) || [] });
        setSpecifyBedsOpen(false);
    }

    function handleCreateBooking() {
        cookiesService.delete('current-booking');
        navigate(`/rental-objects/${id}/booking`);
    }

    if (!model)
        return (<Typography>Не найден объект аренды</Typography>)


    const checkinDate = moment(booking ? booking.checkinDate : moment().format('yyyy-mm-dd'));
    const checkoutDate = moment(booking ? booking.checkoutDate : moment().add(10, 'days').format('yyyy-mm-dd'));
    const nightsCount = checkoutDate.dayOfYear() - checkinDate.dayOfYear();

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
                    <Typography variant="subtitle1">Всего: {booking?.roomVariants?.reduce<number>((p, c) => p + c.amount, 0)}</Typography>
                    <Button onClick={handleCreateBooking} disabled={!booking?.roomVariants?.length} variant="outlined" color="success">Забронировать</Button>
                </Stack>
                {model.roomVariants?.map(roomVariant => formatRoomVariantInfo(roomVariant))}
                <Stack direction="row" alignItems="center">
                    <Grid item xs />
                    <Button onClick={handleCreateBooking} disabled={!booking?.roomVariants?.length} variant="outlined" color="success" >Забронировать</Button>
                </Stack>
            </Stack>

            <Dialog open={specifyBedsOpen} maxWidth="xs" onClose={discardSpecifyBeds}>
                <DialogTitle>Уточните кровати</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <RadioGroup value={specifiedBedType?.id} onChange={(event: React.ChangeEvent<HTMLInputElement>, value: string) => {
                            setSpecifiedBetType(specifyBedsRoomVariant?.bedTypes?.find(o => o.id === value));
                        }}>
                            {specifyBedsRoomVariant?.bedTypes?.map(bt =>
                                <FormControlLabel value={bt.id} control={<Radio />} label={
                                    (<Stack direction="row">
                                        {BedTypes.getIcon(bt.bedType)}
                                        <Typography>{BedTypes.getDescription(bt.bedType)}</Typography>
                                        {bt.width && bt.length ? <><AspectRatio></AspectRatio><Typography> {bt.width} Х {bt.length}</Typography></> : null}
                                    </Stack>)
                                } />
                            )}

                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" onClick={discardSpecifyBeds}>Отмена</Button>
                    <Button disabled={!specifiedBedType} color="primary" onClick={confirmSpecifyBeds} autoFocus>Принять</Button>
                </DialogActions>
            </Dialog>
        </Stack >
    )
}