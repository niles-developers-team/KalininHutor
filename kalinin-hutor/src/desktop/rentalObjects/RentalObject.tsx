import { AspectRatio, CurrencyRuble, FavoriteBorder, People } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, Grid, IconButton, Paper, Radio, RadioGroup, Skeleton, Stack, Typography } from "@mui/material"
import moment from "moment";
import pluralize from "plural-ru";
import { CSSProperties, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector, useQuery } from "../../hooks";
import { BedTypes, Booking, RentalObject, RoomVariant, RoomVariantBedType, NotificationVariant } from "../../models"
import { AppState, BookingActions, RentalObjectActions, RoomCharacteristicActions, NotificationActions } from "../../store";
import { RangeCalendarPopoverComponent } from "../common";
import { VisitorsPopoverComponent } from "./RentalObjectsFilter";
import { RoomVariantInfoComponent } from "./RoomVariant";
import { Masonry } from "@mui/lab";
import { appName } from "../..";
import ym from 'react-yandex-metrika';

const imageStyle: CSSProperties = {
    objectFit: "contain"
};

export const RentalObjectComponent = function (): JSX.Element {
    const { roomCharacteristicState, userState, rentalObjectState, bookingState } = useAppSelector((state: AppState) => state);

    const query = useQuery();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const [specifyBedsOpen, setSpecifyBedsOpen] = useState<boolean>(false);
    const [specifyBedsRoomVariant, setSpecifyBedsRoomVariant] = useState<RoomVariant>();
    const [specifiedBedType, setSpecifiedBetType] = useState<RoomVariantBedType>();
    const [allPhotoOpen, setAllPhotoOpen] = useState<boolean>(false);

    const [personsAnchorEl, setPersonsAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [datesAnchorEl, setDatesAnchorEl] = useState<HTMLButtonElement | null>(null);
    const personsPopoverOpen = Boolean(personsAnchorEl);
    const personsPopoverId = personsPopoverOpen ? 'persons-popover' : undefined;
    const datesPopoverOpen = Boolean(datesAnchorEl);
    const datesPopoverId = datesPopoverOpen ? 'dates-popover' : undefined;

    useEffect(() => {
        if (!id || !userState.currentUser)
            return;

        dispatch(RentalObjectActions.loadRentalObject(id));
        dispatch(RoomCharacteristicActions.getRoomCharacteristics());

        ym('reachGoal', 'desktop_enter_create_booking');
    }, [userState.currentUser !== undefined]);

    useEffect(() => {
        if (!rentalObjectState.model)
            return;

        if (!!rentalObjectState.model.roomVariants && !!id) {
            dispatch(RentalObjectActions.loadRentalObjectRoomVariants(id));
        }

        dispatch(BookingActions.getDraft());
    }, [rentalObjectState.model])

    useEffect(() => {
        if(!bookingState.model)
            return;

        if(bookingState.model.rentalObject?.id !== id) {
            dispatch(BookingActions.clearEditionState());
        }
    }, [bookingState.model])

    function handleRoomsCountChanged(roomVariantId: string, newCount: number) {
        if (!booking)
            return;

        if (!model)
            return;

        let bookingRoomVariants = [...booking.roomVariants];

        const bookingRoomVariant = bookingRoomVariants.find(o => o.roomVariantId === roomVariantId);
        const roomVariant = roomVariants.find(o => o.id === roomVariantId);

        const newAmount = (roomVariant?.price || 0) * nightsCount * newCount;

        if (!bookingRoomVariant) {
            if (!roomVariant?.bedTypes || !roomVariant.bedTypes.length) {
                dispatch(NotificationActions.showSnackbar('Не загружены варианты кроватей номера'));
                return;
            }

            bookingRoomVariants.push({
                roomVariantId: roomVariantId,
                roomsCount: newCount,
                price: roomVariant.price,
                amount: 0,
                bedType: roomVariant.bedTypes[0].bedType
            });
        } else if (newCount > 0) {
            bookingRoomVariants = bookingRoomVariants.map(o => o.roomVariantId === roomVariantId ? { ...o, roomsCount: newCount, amount: newAmount } : o);
        } else if (newCount === 0) {
            bookingRoomVariants = bookingRoomVariants.filter(o => o.roomVariantId !== roomVariantId);
        }

        dispatch(BookingActions.saveDraft({ ...booking, roomVariants: bookingRoomVariants }));
    }

    function formatRoomVariants() {
        if (!model)
            return;

        return roomVariants.map(roomVariant => {
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
            dispatch(NotificationActions.showSnackbar("Не указан вариант кровати.", NotificationVariant.error));
            return;
        }

        const roomVariant = bookingRoomVariants.find(o => o.roomVariantId === specifyBedsRoomVariant?.id)
        if (!roomVariant)
            return;

        bookingRoomVariants = bookingRoomVariants.map(o => o.roomVariantId === specifyBedsRoomVariant?.id ? { ...roomVariant, bedType: specifiedBedType.bedType } : o);

        setSpecifyBedsRoomVariant(undefined);
        setSpecifyBedsOpen(false);
        dispatch(BookingActions.saveDraft({ ...booking, roomVariants: bookingRoomVariants }));
    }

    function handleCreateBooking() {
        navigate(`/rental-objects/${id}/booking/${booking?.id}`);
    }

    function handleDatesChanged(startDate: string | undefined, endDate: string | undefined) {
        if (!booking) {
            dispatch(NotificationActions.showSnackbar('Ошибка при попытке создать бронь.', NotificationVariant.error));
            return;
        }

        if (!startDate || !endDate) {
            dispatch(NotificationActions.showSnackbar('Не выбраны даты брони.', NotificationVariant.error));
            return;
        }

        dispatch(BookingActions.saveDraft({
            ...booking,
            checkinDate: startDate,
            checkoutDate: endDate
        }));

        setDatesAnchorEl(null);
    }

    if (!rentalObjectState.model) {
        return (<Typography>Возникла ошибка при загрузке объекта аренды</Typography>);
    }

    const model: RentalObject = rentalObjectState.model;

    if (!bookingState.model) {
        return (<Typography>Возникла ошибка при формировании брони</Typography>);
    }

    const booking: Booking = bookingState.model;
    const roomVariants: RoomVariant[] = model.roomVariants || [];

    const roomCharacteristics = roomCharacteristicState.models || [];

    const checkinDate = moment(booking ? booking.checkinDate : moment().format('YYYY-MM-DD'));
    const checkoutDate = moment(booking ? booking.checkoutDate : moment().add(10, 'days').format('YYYY-MM-DD'));
    const nightsCount = checkoutDate.dayOfYear() - checkinDate.dayOfYear();

    document.title = `${appName} / ${model.name}`;

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
                                        <Typography variant="body2"><b>Заезд</b></Typography>
                                        <Typography variant="body2">{checkinDate.format('DD.MM.YYYY')}</Typography>
                                    </Stack>
                                    <Divider orientation="vertical" flexItem />
                                    <Stack>
                                        <Typography variant="body2"><b>Отъезд</b></Typography>
                                        <Typography variant="body2">{checkoutDate.format('DD.MM.YYYY')}</Typography>
                                    </Stack>
                                </Stack>
                            </Button>
                            <Typography variant="body2"><b>Длительность проживания:</b></Typography>
                            <Typography variant="body2"> {nightsCount} {pluralize(nightsCount, 'ночь', 'ночи', 'ночей')}</Typography>
                            <Divider flexItem />
                            <Button
                                aria-describedby={personsPopoverId}
                                onClick={(event) => setPersonsAnchorEl(personsAnchorEl ? null : event.currentTarget)}
                            >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <People color="disabled" />
                                    <Typography variant="body2">Взрослых: {booking?.adultCount}</Typography>
                                    <Typography variant="body2">Детей: {booking?.childCount}</Typography>
                                </Stack>
                            </Button>
                            <Divider flexItem />
                            <Typography variant="body2"><b>Вы выбрали:</b></Typography>
                            {booking?.roomVariants?.map(brv => {
                                const roomVariant = roomVariants.find(o => o.id === brv.roomVariantId)
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
                            onConfirm={handleDatesChanged}
                            onDiscard={() => setDatesAnchorEl(null)}
                        />
                        <VisitorsPopoverComponent
                            id={personsPopoverId}
                            open={personsPopoverOpen}
                            anchorEl={personsAnchorEl}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            onClose={() => setPersonsAnchorEl(null)}
                            adultsCount={booking?.adultCount || 0}
                            childsCount={booking?.childCount || 0}
                            onAdultsCountChanged={(adultsCount: number) => dispatch(BookingActions.saveDraft({ ...booking, adultCount: adultsCount }))}
                            onChildsCountChanged={(childsCount: number) => dispatch(BookingActions.saveDraft({ ...booking, childCount: childsCount }))}
                        />
                    </Paper>
                    <Button variant="outlined" color="success" size="small" disabled={!booking?.roomVariants?.length} onClick={handleCreateBooking}>Забронировать</Button>
                </Stack>
                <Stack className="w-100">
                    <Stack direction="row">
                        <Typography variant="h6">{model ? model.name : <Skeleton />}</Typography>
                        <IconButton disabled><FavoriteBorder /></IconButton>
                    </Stack>
                    <Typography color="GrayText">{model ? model.address : <Skeleton />}</Typography>
                    <Stack spacing={2}>
                        {model.photos?.length > 0 ?
                            <img height={325} style={imageStyle} src={`data:${model.photos[0].extension};base64,${model.photos[0].body}`}></img>
                            :
                            <Paper variant="outlined">
                                <Skeleton variant="rectangular" height={325} />
                            </Paper>
                        }
                        <Stack direction="row" spacing={2}>
                            {model.photos?.length ?
                                model.photos.slice(0, 5).map(photo =>
                                    <img style={imageStyle} width={120} height={120} src={`data:${photo.extension};base64,${photo.body}`}></img>
                                )
                                :
                                [...new Array(5)].map(() =>
                                    <Skeleton variant="rectangular" width={120} height={120} />
                                )
                            }
                            {model.photos?.length > 5 && <Button onClick={() => setAllPhotoOpen(true)} variant="outlined" className="h-100">Ещё {model.photos.length - 5} фото</Button>}
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <Grid item xs>
                <Typography>{model ? model.description : <Skeleton />}</Typography>
            </Grid>
            <Stack marginTop="1em" spacing={1}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h5">Доступные варианты</Typography>
                    <Grid item xs />
                    <Typography variant="subtitle1">Всего: {booking ? booking.total : <Skeleton />}</Typography>
                    <Button onClick={handleCreateBooking} disabled={!booking?.roomVariants?.length} variant="outlined" color="success">Забронировать</Button>
                </Stack>
                {formatRoomVariants()}
            </Stack>

            <Dialog open={allPhotoOpen} fullWidth={true} maxWidth="md" onClose={() => setAllPhotoOpen(false)}>
                <DialogContent>
                    <Grid container>
                        <Masonry columns={4} spacing={2}>
                            {model.photos.map((photo, index) => (
                                <div key={index}>
                                    <img
                                        src={`data:${photo.extension};base64,${photo.body}`}
                                        width={200}
                                        alt={photo.name}
                                        style={{
                                            borderBottomLeftRadius: 4,
                                            borderBottomRightRadius: 4,
                                            borderTopLeftRadius: 4,
                                            borderTopRightRadius: 4,
                                        }}
                                    />
                                </div>
                            ))}
                        </Masonry>
                    </Grid>
                </DialogContent>
            </Dialog>

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