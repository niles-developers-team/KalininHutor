import { Favorite, ArrowBack, Menu, FavoriteBorder, LocationOn, CurrencyRuble } from "@mui/icons-material";
import { Stack, AppBar, Container, Toolbar, IconButton, Typography, Skeleton, Paper, List, ListItem, ListItemIcon, ListItemText, Button, Grid, SwipeableDrawer } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Puller } from "../common";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { appName } from "../..";
import { RoomVariant, RentalObject, RoomCharacteristic, CharacteristicTypes } from "../../models";
import { AppState, RentalObjectActions } from "../../store";
import { HideOnScroll } from "../../commonComponents";
import { RoomVariantComponent } from "./roomVariant";
import ym from 'react-yandex-metrika';

const drawerBleeding = 56;

export const RentalObjectComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { rentalObjectState } = useAppSelector((state: AppState) => state);
    const { id } = useParams();

    const [state, setState] = useState({
        allServicesOpened: false,
        descriptionOpened: false,
        roomVariantInfoOpened: false,
        roomVariantInfo: undefined as RoomVariant | undefined
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
                <Stack direction="row" alignItems="center" padding={2}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>{!loading ? model.name : <Skeleton />}</Typography>
                    <IconButton disabled><FavoriteBorder /></IconButton>
                </Stack>
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
                        {model.photos?.map(photo => <img key={photo.id} style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={`data:${photo.extension};base64,${photo.body}`}></img>)}
                    </Carousel>
                    :
                    <Paper variant="outlined">
                        <Skeleton variant="rectangular" width='100%' height="55.55vw" />
                    </Paper>
                }
                <Stack paddingX={2} spacing={1}>
                    <Typography variant="h6">Описание</Typography>
                    <Stack direction="row">
                        <LocationOn color="primary" fontSize="small" />
                        <Typography alignContent="center" variant="body1">{model.address}</Typography>
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
            </Stack>
            <SwipeableDrawer
                container={container}
                anchor="bottom"
                open={state.allServicesOpened}
                onClose={() => setState({ ...state, allServicesOpened: false })}
                onOpen={() => setState({ ...state, allServicesOpened: true })}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
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
                disableSwipeToOpen={false}
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
                disableSwipeToOpen={false}
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
        </Stack>
    );
}
