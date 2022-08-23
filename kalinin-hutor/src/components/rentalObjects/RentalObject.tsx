import { AspectRatio, CurrencyRuble, FavoriteBorder, People } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, Grid, IconButton, Paper, Radio, RadioGroup, Skeleton, Stack, Typography } from "@mui/material"
import moment from "moment";
import pluralize from "plural-ru";
import { useEffect, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useQuery } from "../../hooks/useQuery";
import { BedTypes, Booking, BookingStatuses, EntityStatus, RentalObject, RoomVariant, RoomVariantBedType, SnackbarVariant, User } from "../../models"
import { AppState, BookingActions, RentalObjectActions, RoomCharacteristicActions, SnackbarActions } from "../../store";
import { RangeCalendarPopoverComponent } from "../common";
import { VisitorsPopoverComponent } from "./RentalObjectsFilter";
import { RoomVariantInfoComponent } from "./RoomVariant";

export const RentalObjectComponent = function (): JSX.Element {
    const { roomCharacteristicState, rentalObjectState, bookingState } = useAppSelector((state: AppState) => ({
        bookingState: state.bookingState,
        roomCharacteristicState: state.roomCharacteristicState,
        rentalObjectState: state.rentalObjectState
    }));


    const query = useQuery();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const [specifyBedsOpen, setSpecifyBedsOpen] = useState<boolean>(false);
    const [specifyBedsRoomVariant, setSpecifyBedsRoomVariant] = useState<RoomVariant>();
    const [specifiedBedType, setSpecifiedBetType] = useState<RoomVariantBedType>();


    const [personsAnchorEl, setPersonsAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [datesAnchorEl, setDatesAnchorEl] = useState<HTMLButtonElement | null>(null);
    const personsPopoverOpen = Boolean(personsAnchorEl);
    const personsPopoverId = personsPopoverOpen ? 'persons-popover' : undefined;
    const datesPopoverOpen = Boolean(datesAnchorEl);
    const datesPopoverId = datesPopoverOpen ? 'dates-popover' : undefined;

    useEffect(() => {
        dispatch(RentalObjectActions.getRentalObject(id));
        dispatch(BookingActions.getDraft());
        dispatch(RoomCharacteristicActions.getRoomCharacteristics());
    }, []);

    useEffect(() => {
        if (!id)
            return;

        const adultsCount = parseInt(query.get('adultsCount') || '') || 1;
        const childsCount = parseInt(query.get('childsCount') || '') || 0;
        const checkinDate = query.get('checkinDate') || undefined;
        const checkoutDate = query.get('checkoutDate') || undefined;

        if (bookingState.modelLoading === false && !bookingState.model) {
            dispatch(BookingActions.createDraft({
                rentalObjectId: id,
                rentalObject: model,
                adultCount: adultsCount,
                checkinDate: checkinDate || moment().format('YYYY-MM-DD'),
                checkoutDate: checkoutDate || moment().add(10, 'days').format('YYYY-MM-DD'),
                childCount: childsCount,
                entityStatus: EntityStatus.Created,
                total: 0,
                number: 0,
                status: BookingStatuses.Draft,
                tenant: User.initial,
                roomVariants: []
            }));
        }
    }, [bookingState.modelLoading]);

    function handleRoomsCountChanged(roomVariantId: string, newCount: number) {
        if (!booking)
            return;

        if (!model)
            return;

        let bookingRoomVariants = [...booking.roomVariants];

        const bookingRoomVariant = bookingRoomVariants.find(o => o.roomVariantId === roomVariantId);
        const roomVariant = model.roomVariants?.find(o => o.id === roomVariantId);

        const newAmount = (roomVariant?.price || 0) * nightsCount * newCount;

        if (!bookingRoomVariant) {
            if (!roomVariant?.bedTypes || !roomVariant.bedTypes.length) {
                dispatch(SnackbarActions.showSnackbar('Не загружены варианты кроватей номера'));
                return;
            }

            bookingRoomVariants.push({
                roomVariantId: roomVariantId,
                roomsCount: newCount,
                amount: newAmount,
                bedType: roomVariant.bedTypes[0].bedType
            });
        } else if (newCount > 0) {
            bookingRoomVariants = bookingRoomVariants.map(o => o.roomVariantId === roomVariantId ? { ...o, roomsCount: newCount, amount: newAmount } : o);
        } else if (newCount === 0) {
            bookingRoomVariants = bookingRoomVariants.filter(o => o.roomVariantId !== roomVariantId);
        }

        const total: number = bookingRoomVariants.reduce((p, c) => p + c.amount, 0)

        dispatch(BookingActions.updateDraft({ ...booking, roomVariants: bookingRoomVariants, total: total }));
    }

    function formatRoomVariants() {
        if (!model)
            return;

        return model.roomVariants?.map(roomVariant => {
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
        });
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
        if (!booking)
            return;

        let bookingRoomVariants = [...booking.roomVariants];

        if (!specifiedBedType) {
            dispatch(SnackbarActions.showSnackbar("Не указан вариант кровати.", SnackbarVariant.error));
            return;
        }

        const roomVariant = bookingRoomVariants.find(o => o.roomVariantId === specifyBedsRoomVariant?.id)
        if (!roomVariant)
            return;

        bookingRoomVariants = bookingRoomVariants.map(o => o.roomVariantId === specifyBedsRoomVariant?.id ? { ...roomVariant, bedType: specifiedBedType.bedType } : o);

        setSpecifyBedsRoomVariant(undefined);
        setSpecifyBedsOpen(false);
        dispatch(BookingActions.updateDraft({ ...booking, roomVariants: bookingRoomVariants }));
    }

    function handleCreateBooking() {
        navigate(`/rental-objects/${id}/booking/${booking?.id}`);
    }

    function handleDatesChanged(startDate: string | undefined, endDate: string | undefined) {
        if (!booking) {
            dispatch(SnackbarActions.showSnackbar('Ошибка при попытке создать бронь.', SnackbarVariant.error));
            return;
        }

        if (!startDate || !endDate) {
            dispatch(SnackbarActions.showSnackbar('Не выбраны даты брони.', SnackbarVariant.error));
            return;
        }

        dispatch(BookingActions.updateDraft({
            ...booking,
            checkinDate: startDate,
            checkoutDate: endDate
        }));
    }

    const model: RentalObject | undefined = rentalObjectState.model;

    if (rentalObjectState.modelLoading === false && !model) {
        dispatch(SnackbarActions.showSnackbar('Ошибка при загрузке объекта аренды', SnackbarVariant.error));
        return (<Typography>Возникла ошибка при загрузке объекта аренды</Typography>);
    }

    if (!bookingState.model) {
        return (<Typography>Возникла ошибка при формировании брони</Typography>);
    }

    const booking: Booking = bookingState.model;

    const roomCharacteristics = roomCharacteristicState.models || [];

    const checkinDate = moment(booking ? booking.checkinDate : moment().format('YYYY-MM-DD'));
    const checkoutDate = moment(booking ? booking.checkoutDate : moment().add(10, 'days').format('YYYY-MM-DD'));
    const nightsCount = checkoutDate.dayOfYear() - checkinDate.dayOfYear();

    return (
        <Stack>
            <Stack direction="row" spacing={2}>
                <Stack spacing={2}>
                    <Typography variant="h6"><b>Параметры</b></Typography>
                    <Paper variant="outlined">
                        <Stack spacing={1} padding=".5em">
                            <Button
                                aria-describedby={datesPopoverId}
                                onClick={(event) => setDatesAnchorEl(datesAnchorEl ? null : event.currentTarget)}
                            >
                                <Stack direction="row" spacing={2}>
                                    <Stack>
                                        <Typography variant="subtitle1"><b>Заезд</b></Typography>
                                        <Typography>{checkinDate.format('DD.MM.YYYY')}</Typography>
                                    </Stack>
                                    <Divider orientation="vertical" flexItem />
                                    <Stack>
                                        <Typography variant="subtitle1"><b>Отъезд</b></Typography>
                                        <Typography>{checkoutDate.format('DD.MM.YYYY')}</Typography>
                                    </Stack>
                                </Stack>
                            </Button>
                            <Typography variant="subtitle1"><b>Длительность проживания:</b></Typography>
                            <Typography> {nightsCount} {pluralize(nightsCount, 'ночь', 'ночи', 'ночей')}</Typography>
                            <Divider flexItem />
                            <Button
                                aria-describedby={personsPopoverId}
                                onClick={(event) => setPersonsAnchorEl(personsAnchorEl ? null : event.currentTarget)}
                            >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <People color="disabled" />
                                    <Typography>Взрослых: {booking?.adultCount}</Typography>
                                    <Typography>Детей: {booking?.childCount}</Typography>
                                </Stack>
                            </Button>
                            <Divider flexItem />
                            <Typography variant="subtitle1"><b>Вы выбрали:</b></Typography>
                            {booking?.roomVariants?.map(brv => {
                                const roomVariant = model?.roomVariants?.find(o => o.id === brv.roomVariantId)
                                return <Typography key={roomVariant?.id}>{brv.roomsCount} x {roomVariant?.name}</Typography>
                            }
                            )}
                            <Divider flexItem />
                            <Stack direction="row" alignItems="center">
                                <Typography ><b>Итого:</b></Typography>
                                <Grid item xs />
                                <Typography >{booking ? booking.total : <Skeleton />}</Typography>
                                <CurrencyRuble fontSize="small" />
                            </Stack>
                        </Stack>
                        <RangeCalendarPopoverComponent
                            id={datesPopoverId}
                            open={datesPopoverOpen}
                            anchorEl={datesAnchorEl}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            onClose={() => setDatesAnchorEl(null)}
                            startDate={booking?.checkinDate}
                            endDate={booking?.checkoutDate}
                            onDatesChanged={handleDatesChanged}
                        />
                        <VisitorsPopoverComponent
                            id={personsPopoverId}
                            open={personsPopoverOpen}
                            anchorEl={personsAnchorEl}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            onClose={() => setPersonsAnchorEl(null)}
                            adultsCount={booking?.adultCount || 0}
                            childsCount={booking?.childCount || 0}
                            onAdultsCountChanged={(adultsCount: number) => dispatch(BookingActions.updateDraft({ ...booking, adultCount: adultsCount }))}
                            onChildsCountChanged={(childsCount: number) => dispatch(BookingActions.updateDraft({ ...booking, childCount: childsCount }))}
                        />
                    </Paper>
                    <Button variant="outlined" color="success" size="small" disabled={!booking?.roomVariants?.length} onClick={handleCreateBooking}>Забронировать</Button>
                </Stack>
                <Stack>
                    <Stack direction="row">
                        <Typography variant="h6">{model ? model.name : <Skeleton />}</Typography>
                        <IconButton disabled><FavoriteBorder /></IconButton>
                    </Stack>
                    <Typography color="GrayText">{model ? model.address : <Skeleton />}</Typography>
                    <Stack direction="row" marginTop="1em" spacing={2}>
                        <Paper variant="outlined">
                            <Skeleton variant="rectangular" width={240} height={240} />
                        </Paper>
                        <Grid item xs>
                            <Typography>{model ? model.description : <Skeleton />}</Typography>
                        </Grid>
                    </Stack>
                </Stack>
            </Stack>
            <Stack marginTop="1em" spacing={1}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h5">Доступные варианты</Typography>
                    <Grid item xs />
                    <Typography variant="subtitle1">Всего: {booking ? booking.total : <Skeleton />}</Typography>
                    <Button onClick={handleCreateBooking} disabled={!booking?.roomVariants?.length} variant="outlined" color="success">Забронировать</Button>
                </Stack>
                {formatRoomVariants()}
            </Stack>

            <Dialog open={specifyBedsOpen} maxWidth="xs" onClose={discardSpecifyBeds}>
                <DialogTitle>Уточните кровати</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <RadioGroup value={specifiedBedType?.id} onChange={(event: React.ChangeEvent<HTMLInputElement>, value: string) => {
                            setSpecifiedBetType(specifyBedsRoomVariant?.bedTypes?.find(o => o.id === value));
                        }}>
                            {specifyBedsRoomVariant?.bedTypes?.map(bt =>
                                <FormControlLabel key={bt.bedType} value={bt.id} control={<Radio />} label={
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