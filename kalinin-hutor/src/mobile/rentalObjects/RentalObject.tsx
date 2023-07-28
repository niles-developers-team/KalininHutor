import { Favorite, ArrowBack, Menu, FavoriteBorder, LocationOn, NearMe } from "@mui/icons-material";
import { Stack, AppBar, Container, Toolbar, IconButton, Typography, Skeleton, Paper, List, ListItem, ListItemIcon, ListItemText, Button, SwipeableDrawer, Chip, Rating, TextField, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Puller } from "../common";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { appName } from "../..";
import { RoomVariant, RentalObject, RoomCharacteristic, CharacteristicTypes, Feedback } from "../../models";
import { AppState, RentalObjectActions } from "../../store";
import { HideOnScroll } from "../../commonComponents";
import { RoomVariantComponent } from "./roomVariant";
import ym from 'react-yandex-metrika';
import pluralize from "plural-ru";
import moment from "moment";

const drawerBleeding = 56;

export const RentalObjectComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { rentalObjectState } = useAppSelector((state: AppState) => state);
    const { id } = useParams();

    const [state, setState] = useState({
        allServicesOpened: false,
        descriptionOpened: false,
        newFeedbackOpened: false,
        roomVariantInfoOpened: false,
        roomVariantInfo: undefined as RoomVariant | undefined,
        newFeedback: {} as Feedback
    })

    function handleGoBack() {
        navigate(`/`)
    }
    useEffect(() => {
        if (id) {
            dispatch(RentalObjectActions.getRentalObject(id));
            ym('reachGoal', 'mobile_enter_rental_object');
        }
    }, [id]);

    if (!rentalObjectState.model)
        return (<Typography>Не найден объект аренды</Typography>);

    const loading = rentalObjectState.modelLoading;

    const model: RentalObject = rentalObjectState.model;

    document.title = `${appName} / Личный Кабинет / ${model.name || 'Новый объект аренды'}`;

    function onlyUnique(value: RoomCharacteristic, index: number, array: RoomCharacteristic[]) {
        return array.indexOf(value) === index;
    }

    const roCharacteristics = model.roomVariants.map(o => o.characteristics).reduce((prev, curr) => prev.concat(curr), []).map(o => o.roomCharacteristic).filter(onlyUnique);
    const navigationRef = `https://yandex.ru/navi/?whatshere%5Bpoint%5D=${model.coordinates?.longitude}%2C${model.coordinates?.latitude}&whatshere%5Bzoom%5D=18&lang=ru&from=navi`;

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <Stack marginBottom={2}>
            <HideOnScroll>
                <AppBar position="sticky" color="default">
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Stack width="100%" spacing={2} direction="row" alignItems="center">
                                <IconButton onClick={handleGoBack}><ArrowBack /></IconButton>
                                <Typography sx={{ flexGrow: 1 }}>Калинин Хутор</Typography>
                                <IconButton disabled><Favorite /></IconButton>
                                <IconButton disabled><Menu /></IconButton>
                            </Stack>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>
            <Stack spacing={1}>
                <Stack direction="row" alignItems="center" paddingX={2} paddingTop={2}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>{!loading ? model.name : <Skeleton />}</Typography>
                    <IconButton disabled><FavoriteBorder /></IconButton>
                </Stack>
                {(model.feedback && model.feedback.length > 0) ?
                    <Stack direction="row" alignItems="center" paddingX={2} spacing={2}>
                        <Chip color="info" label={model.rate?.toFixed(1)} size="small" />
                        <Typography variant="body2">{model.feedback.length} {pluralize(model.feedback.length, 'отзыв', 'отзыва', 'отзывов')}</Typography>
                    </Stack>
                    : <Typography paddingX={2} color="GrayText" variant="body2">Ещё нет отзывов</Typography>
                }
                {model.photos?.length > 0 ?
                    <Carousel
                        height="55.55vw"
                        autoPlay={false}
                        animation="slide"
                        indicators={true}
                        stopAutoPlayOnHover={true}
                        navButtonsAlwaysInvisible={true}
                        cycleNavigation={true}
                    >
                        {model.photos?.map(photo => <img key={photo.id} style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px', width: '100%', height: '55.55vw', objectFit: 'cover' }} src={`data:${photo.extension};base64,${photo.body}`}></img>)}
                    </Carousel>
                    :
                    <Paper variant="outlined">
                        <Skeleton variant="rectangular" width='100%' height="55.55vw" />
                    </Paper>
                }
                <Stack paddingX={2} spacing={1}>
                    <Typography variant="h6">Описание</Typography>
                    <Stack direction="row" alignItems="center">
                        <LocationOn color="primary" fontSize="small" />
                        <Typography sx={{flexGrow: 1}} alignContent="center" variant="body1">{model.address}</Typography>
                        {model.coordinates && <IconButton color="info" href={navigationRef} onClick={(event) => { event.stopPropagation(); }} target="_blank" size="small"><NearMe /></IconButton>}
                    </Stack>
                    <Button size="small" onClick={() => setState({ ...state, descriptionOpened: true })}>Читать описание</Button>
                    <Typography variant="h6">Услуги и сервисы</Typography>
                </Stack>
                <List>
                    {roCharacteristics.slice(0, 5).map(ch => (
                        <ListItem key={`item-${ch.id}`}>
                            <ListItemIcon>
                                {CharacteristicTypes.getIcon(ch.type)}
                            </ListItemIcon>
                            <ListItemText primary={ch.name} />
                        </ListItem>
                    ))}
                </List>
                {roCharacteristics.length > 5 && <Button size="small" onClick={() => setState({ ...state, allServicesOpened: true })}>Все услуги</Button>}
                <Stack paddingX={2} spacing={1}>
                    <Typography variant="h6">Варианты размещения</Typography>
                    {model.roomVariants.map(rv => (<RoomVariantComponent roomVariant={rv} onShowDetails={() => setState({ ...state, roomVariantInfoOpened: true, roomVariantInfo: rv })} />))}
                </Stack>
                <Button onClick={() => setState({ ...state, newFeedbackOpened: true, newFeedback: {} as Feedback })}>Оставьте ваш отзыв</Button>
                {model.feedback && model.feedback.map((f, index) => (
                    <Stack spacing={1} paddingX={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Rating sx={{ flexGrow: 1 }} value={f.rate} readOnly />
                            <Typography color="GrayText" variant="body2">{moment(f.createdAt).format('DD.MM.YYYY')}</Typography>
                        </Stack>
                        <Typography>{f.comment}</Typography>
                        {model.feedback && model.feedback.length > 1 && index < model.feedback.length - 1 && <Divider variant="middle" />}
                    </Stack>
                ))}
            </Stack>
            <SwipeableDrawer
                container={container}
                anchor="bottom"
                open={state.allServicesOpened}
                onClose={() => setState({ ...state, allServicesOpened: false })}
                onOpen={() => setState({ ...state, allServicesOpened: true })}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={true}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    ".MuiDrawer-paper ": {
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                    }
                }}
                allowSwipeInChildren={true}
            >
                <Stack padding={2}
                    sx={{
                        bgcolor: 'white',
                        visibility: 'visible',
                        right: 0,
                        left: 0
                    }}>
                    <Puller />
                </Stack>
                <List>
                    {roCharacteristics.map(ch => (
                        <ListItem key={`item-${ch.id}`}>
                            <ListItemIcon>
                                {CharacteristicTypes.getIcon(ch.type)}
                            </ListItemIcon>
                            <ListItemText primary={ch.name} />
                        </ListItem>
                    ))}
                </List>
            </SwipeableDrawer>

            <SwipeableDrawer
                container={container}
                anchor="bottom"
                open={state.roomVariantInfoOpened}
                onClose={() => setState({ ...state, roomVariantInfoOpened: false })}
                onOpen={() => setState({ ...state, roomVariantInfoOpened: true })}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={true}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    ".MuiDrawer-paper ": {
                        height: `calc(100% - ${drawerBleeding}px)`,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                    }
                }}
                allowSwipeInChildren={true}
            >
                <Stack padding={2} spacing={1}
                    sx={{
                        bgcolor: 'white',
                        visibility: 'visible',
                        right: 0,
                        left: 0
                    }}>
                    <Puller />
                    <Typography sx={{ flexGrow: 1 }} variant="h6">{state.roomVariantInfo?.name}</Typography>
                    <List>
                        {state.roomVariantInfo?.characteristics.map(ch => (
                            <ListItem key={`item-${ch.id}`}>
                                <ListItemIcon>
                                    {CharacteristicTypes.getIcon(ch.roomCharacteristic.type)}
                                </ListItemIcon>
                                <ListItemText primary={ch.roomCharacteristic.name} />
                            </ListItem>
                        ))}
                    </List>
                    <Typography>{state.roomVariantInfo?.description}</Typography>
                </Stack>
            </SwipeableDrawer>
            <SwipeableDrawer
                container={container}
                anchor="bottom"
                open={state.descriptionOpened}
                onClose={() => setState({ ...state, descriptionOpened: false })}
                onOpen={() => setState({ ...state, descriptionOpened: true })}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={true}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    ".MuiDrawer-paper ": {
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                    }
                }}
                allowSwipeInChildren={true}
            >
                <Stack padding={2} spacing={1}
                    sx={{
                        bgcolor: 'white',
                        visibility: 'visible',
                        right: 0,
                        left: 0
                    }}>
                    <Puller />
                    <Typography>Описание</Typography>
                    <Typography component="p">{model.description}</Typography>
                </Stack>
            </SwipeableDrawer>
            <SwipeableDrawer
                container={container}
                anchor="bottom"
                open={state.newFeedbackOpened}
                onClose={() => setState({ ...state, newFeedbackOpened: false })}
                onOpen={() => setState({ ...state, newFeedbackOpened: true })}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={true}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    ".MuiDrawer-paper ": {
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                    }
                }}
                allowSwipeInChildren={true}
            >
                <Stack padding={2} spacing={1}
                    sx={{
                        bgcolor: 'white',
                        visibility: 'visible',
                        right: 0,
                        left: 0
                    }}>
                    <Puller />
                    <Rating onChange={(event, newValue) => setState({ ...state, newFeedback: { ...state.newFeedback, rate: newValue ?? 0 } })} value={state.newFeedback.rate || 0} />
                    <TextField style={{ height: state.newFeedbackOpened ? 'auto' : 0 }} onChange={(event) => setState({ ...state, newFeedback: { ...state.newFeedback, comment: event.target.value } })} rows={5} placeholder="Расскажите ваши впечатления" size="small" value={state.newFeedback.comment || ''} multiline />

                    <Button onClick={() => { dispatch(RentalObjectActions.sendFeedback(state.newFeedback)); setState({ ...state, newFeedbackOpened: false, newFeedback: {} as Feedback }) }}>Оставить отзыв</Button>
                </Stack>
            </SwipeableDrawer>
        </Stack>
    );
}
