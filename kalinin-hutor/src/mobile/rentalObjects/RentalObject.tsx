import { Stack, Typography, List, ListItem, ListItemIcon, ListItemText, Button, SwipeableDrawer, Rating, TextField, Divider, IconButton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MobileAppBarComponent, Puller } from "../common";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { appName } from "../..";
import { RoomVariant, RentalObject, RoomCharacteristic, CharacteristicTypes, Feedback } from "../../models";
import { AppState, RentalObjectActions } from "../../store";
import ym from 'react-yandex-metrika';
import moment from "moment";
import { RentalObjectDetailsComponent } from "./RentalObjectInfo";
import { RentalObjectSkeleton } from "./RentalObjectSkeleton";
import { RoomVariantComponent } from "./roomVariant";
import { ArrowBack } from "@mui/icons-material";

const drawerBleeding = 56;

export const RentalObjectComponent = function (): JSX.Element {
    const navigate = useNavigate();
    function handleGoBack() {
        dispatch(RentalObjectActions.clearEditionState());
        navigate(`/`);
    }
    const dispatch = useAppDispatch();
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

    useEffect(() => {
        if (id) {
            dispatch(RentalObjectActions.loadRentalObject(id));
            ym('reachGoal', 'mobile_enter_rental_object');
        }
    }, [id]);

    if (!rentalObjectState.model)
        return (<RentalObjectSkeleton />)

    const model: RentalObject = rentalObjectState.model;

    document.title = `${appName} / ${model.name}`;

    const container = window !== undefined ? () => window.document.body : undefined;

    function onlyUnique(value: RoomCharacteristic, index: number, array: RoomCharacteristic[]) {
        return array.indexOf(value) === index;
    }

    const roCharacteristics = model.roomVariants.map(o => o.characteristics).reduce((prev, curr) => prev.concat(curr), []).map(o => o.roomCharacteristic).filter(onlyUnique);

    return (
        <Stack marginBottom={2}>
            <MobileAppBarComponent leftActionButton={(<IconButton onClick={handleGoBack}><ArrowBack /></IconButton>)} />
            <Stack spacing={1}>
                <RentalObjectDetailsComponent
                    model={model}
                    openDescription={() => setState({ ...state, descriptionOpened: true })}
                    openAllServices={() => setState({ ...state, allServicesOpened: true })} />
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

                    <Button disabled={!state.newFeedback.comment} onClick={() => { dispatch(RentalObjectActions.sendFeedback(state.newFeedback)); setState({ ...state, newFeedbackOpened: false, newFeedback: {} as Feedback }) }}>Оставить отзыв</Button>
                </Stack>
            </SwipeableDrawer>
        </Stack>
    );
}
