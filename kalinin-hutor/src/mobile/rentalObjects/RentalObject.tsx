import { Tune, Favorite, ArrowBack, Menu, FavoriteBorder, LocationOn, CurrencyRuble } from "@mui/icons-material";
import { Stack, AppBar, Container, Toolbar, IconButton, Typography, Skeleton, Paper, List, Checkbox, ListItem, ListItemIcon, ListItemText, ListItemButton, Button, Grid, SwipeableDrawer } from "@mui/material";
import { HideOnScroll } from "../../components/common";
import { useNavigate, useParams } from "react-router-dom";
import { appName } from "../..";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { CharacteristicTypes, RentalObject, RoomCharacteristic } from "../../models";
import { AppState, AppThunkAction, RentalObjectActions } from "../../store";
import { CSSProperties, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";

const drawerBleeding = 56;

export const RentalObjectComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { rentalObjectState } = useAppSelector((state: AppState) => state);
    const { id } = useParams();

    const [state, setState] = useState({
        allServicesOpened: false,
    })

    function handleGoBack() {
        navigate(`/`)
    }
    useEffect(() => {
        if (id)
            dispatch(RentalObjectActions.getRentalObject(id));
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
                    <Typography>{model.description}</Typography>
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
                {roCharacteristics.length > 5 && <Button size="small" onClick={() => setState({...state, allServicesOpened: true})}>Все услуги</Button>}
                <Stack paddingX={2} spacing={1}>
                    <Typography variant="h6">Варианты размещения</Typography>
                    {model.roomVariants.map(rv => (
                        <Paper key={rv.id}>
                            {rv.photos.length ? (
                                <Carousel
                                    height="55.55vw"
                                    autoPlay={false}
                                    animation="slide"
                                    indicators={true}
                                    stopAutoPlayOnHover={true}
                                    navButtonsAlwaysInvisible={true}
                                    cycleNavigation={true}
                                >
                                    {rv.photos?.map(photo => <img key={photo.id} style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={`data:${photo.extension};base64,${photo.body}`}></img>)}
                                </Carousel>
                            ) : (
                                <Paper variant="outlined">
                                    <Skeleton variant="rectangular" width='100%' height="55.55vw" />
                                </Paper>
                            )}
                            <Stack paddingX={2} spacing={1} paddingBottom={1}>
                                <Stack direction="row" alignItems="center">
                                    <Typography sx={{ flexGrow: 1 }} variant="h6">{rv.name}</Typography>
                                    <Typography >{rv.price}</Typography>
                                    <CurrencyRuble fontSize="small" />
                                </Stack>
                                <Grid container direction="row" spacing={1} rowSpacing={2}>
                                    {rv.characteristics.map(o => o.roomCharacteristic).map(rc => (<Stack direction="row" marginX={1}>{CharacteristicTypes.getIcon(rc.type)}<Typography>{rc.name}</Typography></Stack>))}
                                </Grid>
                            </Stack>
                        </Paper>
                    ))}
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
                        height: `calc(100% - ${drawerBleeding}px)`,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                    }
                }}
                allowSwipeInChildren={true}
            >
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
        </Stack>
    );
}
