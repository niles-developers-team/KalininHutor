import { AspectRatio, CurrencyRuble, FavoriteBorder, People } from "@mui/icons-material";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, Paper, Radio, RadioGroup, Rating, Skeleton, Stack, TextField, Typography } from "@mui/material"
import moment from "moment";
import pluralize from "plural-ru";
import { CSSProperties, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector, useQuery } from "../../hooks";
import { BedTypes, Booking, RentalObject, RoomVariant, RoomVariantBedType, NotificationVariant, Feedback } from "../../models"
import { AppState, BookingActions, RentalObjectActions, RoomCharacteristicActions, NotificationActions } from "../../store";
import { RangeCalendarPopoverComponent } from "../common";
import { VisitorsPopoverComponent } from "./RentalObjectsFilter";
import { RoomVariantInfoComponent } from "./RoomVariant";
import { Masonry } from "@mui/lab";
import { appName } from "../..";
import ym from 'react-yandex-metrika';
import { PhoneMaskCustom } from "../../commonComponents";

const imageStyle: CSSProperties = {
    objectFit: "cover",
    borderRadius: 8
};

export const RentalObjectComponent = function (): JSX.Element {
    const { roomCharacteristicState, userState, rentalObjectState, bookingState } = useAppSelector((state: AppState) => state);

    const query = useQuery();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const [state, setState] = useState({
        specifyBedsOpen: false,
        specifyBedsRoomVariant: undefined as RoomVariant | undefined,
        specifiedBedType: undefined as RoomVariantBedType | undefined,
        allPhotoOpen: false,
        newFeedback: {} as Feedback,
        personsAnchorEl: null as HTMLButtonElement | null,
        datesAnchorEl: null as HTMLButtonElement | null
    });

    const personsPopoverOpen = Boolean(state.personsAnchorEl);
    const personsPopoverId = personsPopoverOpen ? 'persons-popover' : undefined;
    const datesPopoverOpen = Boolean(state.datesAnchorEl);
    const datesPopoverId = datesPopoverOpen ? 'dates-popover' : undefined;

    useEffect(() => {
        if (!id)
            return;

        dispatch(RentalObjectActions.loadRentalObject(id));
        dispatch(RoomCharacteristicActions.getRoomCharacteristics());

        ym('reachGoal', 'desktop_enter_create_booking');
    }, [id]);

    useEffect(() => {
        if (!rentalObjectState.model)
            return;

        if (!rentalObjectState.model.roomVariants.length && !!id) {
            dispatch(RentalObjectActions.loadRentalObjectRoomVariants(id));
        }

        dispatch(BookingActions.getDraft());
    }, [rentalObjectState.model])

    useEffect(() => {
        if (!bookingState.model)
            return;

        if (bookingState.model.rentalObject?.id !== id) {
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
        const bookingRoomVariant = booking?.roomVariants?.find(o => o.roomVariantId === roomVariant?.id);
        const roomVariantBedType = roomVariant.bedTypes.find(o => o.bedType === bookingRoomVariant?.bedType) || roomVariant.bedTypes[0];
        setState({ ...state, specifyBedsOpen: true, specifyBedsRoomVariant: roomVariant, specifiedBedType: { ...roomVariantBedType } });
    }

    function discardSpecifyBeds() {
        setState({ ...state, specifyBedsRoomVariant: undefined, specifyBedsOpen: false });
    }

    function confirmSpecifyBeds() {
        if (!booking)
            return;

        let bookingRoomVariants = [...booking.roomVariants];

        const sbt = state.specifiedBedType;
        if (!sbt) {
            dispatch(NotificationActions.showSnackbar("Не указан вариант кровати.", NotificationVariant.error));
            return;
        }

        bookingRoomVariants = bookingRoomVariants.map(o => o.roomVariantId === state.specifyBedsRoomVariant?.id ? { ...o, bedType: sbt.bedType } : o);

        setState({ ...state, specifyBedsRoomVariant: undefined, specifyBedsOpen: false })
        dispatch(BookingActions.saveDraft({ ...booking, roomVariants: bookingRoomVariants }));
        return;
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

        setState({ ...state, datesAnchorEl: null })
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
        <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
                <Stack spacing={2}>
                    <Typography variant="h6"><b>Параметры</b></Typography>
                    <Paper variant="outlined">
                        <Stack spacing={1} padding=".5em">
                            <Button
                                aria-describedby={datesPopoverId}
                                onClick={(event) => setState({ ...state, datesAnchorEl: state.datesAnchorEl ? null : event.currentTarget })}
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
                                onClick={(event) => setState({ ...state, personsAnchorEl: state.personsAnchorEl ? null : event.currentTarget })}
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
                            anchorEl={state.datesAnchorEl}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            onClose={() => setState({ ...state, datesAnchorEl: null })}
                            startDate={booking?.checkinDate}
                            endDate={booking?.checkoutDate}
                            onConfirm={handleDatesChanged}
                            onDiscard={() => setState({ ...state, datesAnchorEl: null })}
                        />
                        <VisitorsPopoverComponent
                            id={personsPopoverId}
                            open={personsPopoverOpen}
                            anchorEl={state.personsAnchorEl}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            onClose={() => setState({ ...state, personsAnchorEl: null })}
                            adultsCount={booking?.adultCount || 0}
                            childsCount={booking?.childCount || 0}
                            onAdultsCountChanged={(adultsCount: number) => dispatch(BookingActions.saveDraft({ ...booking, adultCount: adultsCount }))}
                            onChildsCountChanged={(childsCount: number) => dispatch(BookingActions.saveDraft({ ...booking, childCount: childsCount }))}
                        />
                    </Paper>
                    <Button variant="outlined" color="success" size="small" disabled={!booking?.roomVariants?.length} onClick={handleCreateBooking}>Забронировать</Button>
                </Stack>
                <Stack className="w-100">
                    <Stack direction="row" alignItems="center">
                        <Typography variant="h6">{model ? model.name : <Skeleton />}</Typography>
                        <IconButton disabled><FavoriteBorder /></IconButton>
                    </Stack>
                    <Stack spacing={2} direction="row">
                        {model.photos?.length > 0 ?
                            <img height={325} style={imageStyle} src={`data:${model.photos[0].extension};base64,${model.photos[0].body}`}></img>
                            :
                            <Paper variant="outlined">
                                <Skeleton variant="rectangular" height={325} />
                            </Paper>
                        }
                        <Grid spacing={2}>
                            {model.photos?.length ?
                                model.photos.slice(1, 2).map(photo =>
                                    <img style={{ ...imageStyle, width: '100%' }} height={160} src={`data:${photo.extension};base64,${photo.body}`}></img>
                                )
                                :
                                [...new Array(4)].map(() =>
                                    <Skeleton variant="rectangular" width='100%' height={160} />
                                )
                            }
                            {model.photos?.length > 2 && <Button onClick={() => setState({ ...state, allPhotoOpen: true })} variant="outlined">Ещё {model.photos.length - 2} фото</Button>}
                        </Grid>
                    </Stack>
                </Stack>
            </Stack>
            <Stack spacing={2}>
                <Typography color="GrayText">{model ? model.address : <Skeleton />}</Typography>
                <Typography>{model ? model.description : <Skeleton />}</Typography>
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
            <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography color="GrayText" variant="h6">Отзывы</Typography>
                </Stack>
                {model.feedback && model.feedback.map(f => (
                    <Stack spacing={1}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Rating value={f.rate} readOnly />
                            <Typography color="GrayText" variant="body2">{moment(f.createdAt).format('DD.MM.YYYY')}</Typography>
                        </Stack>
                        <Typography>{f.comment}</Typography>
                    </Stack>
                ))}
                <Stack spacing={2} direction="row">
                    <Stack spacing={2} sx={{ flexGrow: 1 }}>
                        <Stack spacing={2} direction="row">
                            <Typography>Оставьте ваш отзыв:</Typography>
                            <Rating onChange={(event, newValue) => setState({ ...state, newFeedback: { ...state.newFeedback, rate: newValue ?? 0 } })} value={state.newFeedback.rate || 0} />
                        </Stack>
                        <TextField onChange={(event) => setState({ ...state, newFeedback: { ...state.newFeedback, comment: event.target.value } })} rows={5} placeholder="Расскажите ваши впечатления" fullWidth size="small" value={state.newFeedback.comment || ''} multiline />
                    </Stack>
                    <Stack spacing={2}>
                        {!userState.currentUser && <Typography>Ваш номер телефона:</Typography>}
                        {!userState.currentUser && <TextField size="small"
                            placeholder="(999) 999-99-99"
                            onChange={(event) => setState({ ...state, newFeedback: { ...state.newFeedback, phoneNumber: event.target.value } })} value={state.newFeedback.phoneNumber || ''}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+7</InputAdornment>,
                                inputComponent: PhoneMaskCustom as any
                            }} />}
                        <Button onClick={async () => {
                            await dispatch(RentalObjectActions.sendFeedback(state.newFeedback))
                            setState({ ...state, newFeedback: {} as Feedback })
                        }}>Оставить отзыв</Button>
                    </Stack>
                </Stack>
            </Stack>

            <Dialog open={state.allPhotoOpen} fullWidth={true} maxWidth="md" onClose={() => setState({ ...state, allPhotoOpen: false })}>
                <DialogContent>
                    <Grid container>
                        <Masonry columns={4} spacing={2}>
                            {model.photos.map((photo, index) => (
                                <div key={index}>
                                    <img
                                        src={`data:${photo.extension};base64,${photo.body}`}
                                        width={200}
                                        alt={photo.name}
                                        style={imageStyle}
                                    />
                                </div>
                            ))}
                        </Masonry>
                    </Grid>
                </DialogContent>
            </Dialog>

            <Dialog open={state.specifyBedsOpen} maxWidth="xs" onClose={discardSpecifyBeds}>
                <DialogTitle>Уточните кровати</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <RadioGroup value={state.specifiedBedType?.id} onChange={(event: React.ChangeEvent<HTMLInputElement>, value: string) => {
                            setState({ ...state, specifiedBedType: state.specifyBedsRoomVariant?.bedTypes?.find(o => o.id === value) })
                        }}>
                            {state.specifyBedsRoomVariant?.bedTypes?.map(bt =>
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
                    <Button disabled={!state.specifiedBedType} color="primary" onClick={confirmSpecifyBeds} autoFocus>Принять</Button>
                </DialogActions>
            </Dialog>
        </Stack >
    )
}