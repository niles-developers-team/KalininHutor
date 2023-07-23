import { Edit, Delete, ArrowBack, OpenWith } from "@mui/icons-material";
import { Button, Card, CardContent, Grid, IconButton, Paper, Rating, Stack, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridOverlay } from "@mui/x-data-grid";
import { TimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { ChangeEvent, createRef, useEffect } from "react";
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Coordinates, EntityStatus, RentalObject, RoomVariant } from "../../models";
import { AppState } from "../../store";
import { RentalObjectActions, RoomVariantActions } from "../../store";
import { appName } from "../..";
import ym from 'react-yandex-metrika';
import { CoordinatesMaskCustom, imageStyle } from "../../commonComponents";


function NoRoomVariants(): JSX.Element {
    return (
        <GridOverlay>
            <Typography color="GrayText" variant="subtitle2">Вы еще не добавили варианты номеров</Typography>
        </GridOverlay>
    );
}


const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    cursor: isDragging ? 'grabbing' : 'grab',

    // styles we need to apply on draggables
    ...draggableStyle,
});

export const MyRentalObjectComponent = function (): JSX.Element {
    const { rentalObjectState, userState } = useAppSelector((state: AppState) => state);
    const fileInput = createRef<HTMLInputElement>();

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Название', flex: 1 },
        { field: 'description', headerName: 'Описание', flex: 1 },
        {
            field: 'actions', type: 'actions', sortable: false, headerName: '', width: 100, renderCell: (o) => (
                <Stack direction="row">
                    <IconButton disabled={loading} onClick={() => handleRoomVariantEdit(o.row as RoomVariant)}><Edit /></IconButton>
                    <IconButton disabled={loading} onClick={() => handleRoomVariantDelete(o.row as RoomVariant)}><Delete /></IconButton>
                </Stack>
            )
        }
    ];

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => { init(); }, [id, userState.currentUser !== undefined]);

    async function init() {
        if (id === 'create' || !id) {
            dispatch(RentalObjectActions.getDraft());
        } else {
            await dispatch(RentalObjectActions.getRentalObject(id));
        }
        ym('reachGoal', 'desktop_enter_my_rental_object');
    }

    function handleRoomVariantCreate() {
        if (model.entityStatus === EntityStatus.Draft) {
            navigate(`/me/rental-objects/create/room-variants/create`);
            return;
        }
        navigate(`/me/rental-objects/${id}/room-variants/create`);
    }

    function handleRoomVariantEdit(roomVariant: RoomVariant) {
        navigate(`/me/rental-objects/${id}/room-variants/${roomVariant.id}`);
    }

    function handleRoomVariantDelete(roomVariant: RoomVariant) {
        dispatch(RoomVariantActions.deleteRoomVariant(roomVariant.id || ''));
    }

    async function handleDiscard() {
        dispatch(RentalObjectActions.clearEditionState());
        dispatch(RentalObjectActions.getRentalObject(model.id));
    }

    function handleConfirm() {
        if (userState.authenticating === false)
            if (model.entityStatus === EntityStatus.Draft) {
                dispatch(RentalObjectActions.createRentalObject(model));
            }
            else {
                dispatch(RentalObjectActions.updateRentalObject(model));
            }
    }

    function handleGoBack() {
        dispatch(RentalObjectActions.clearEditionState());
        navigate(`/me`)
    }

    function handleAddPhoto() {
        fileInput.current?.click();
    }

    function handleCoordinatesChanged(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target?.value)
            return;

        const [latitude, longitude] = event.target.value.split(", ");

        if (!latitude && !longitude) {
            dispatch(RentalObjectActions.saveDraft({ ...model, coordinates: undefined }));
            return;
        }

        const coordinates: Coordinates = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        };

        dispatch(RentalObjectActions.saveDraft({ ...model, coordinates: coordinates }));
    }

    async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        if (!event?.target?.files?.length) return;

        await dispatch(RentalObjectActions.appendPhotoToDraft(event?.target?.files));

        if (event?.target)
            event.target.value = '';
    }

    function photosReorder(result: DropResult, provided: ResponderProvided) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        dispatch(RentalObjectActions.reorderPhotos(result.source.index, result.destination.index));
    }

    function handleImageDelete(id: string) {
        dispatch(RentalObjectActions.deletePhotoFromDaft(id));
    }

    const loading = rentalObjectState.modelLoading;

    if (!rentalObjectState.model)
        return (<Typography>Не найден объект аренды</Typography>);

    const model: RentalObject = rentalObjectState.model;
    const roomVariants = model.roomVariants.filter(o => o.entityStatus !== EntityStatus.Deleted) || [];

    document.title = `${appName} / Личный Кабинет / ${model.name || 'Новый объект аренды'}`;

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={handleGoBack}><ArrowBack /></IconButton>
                <Typography color="GrayText" variant="h6">Информация об объекте аренды</Typography>
                <Grid item xs></Grid>
                <Button color="inherit" disabled={loading} onClick={handleDiscard}>Отмена</Button>
                <Button color="primary" disabled={loading} onClick={handleConfirm}>Сохранить</Button>
            </Stack>
            <Card>
                <Stack spacing={2} margin={2}>
                    <Stack direction="row" spacing={3}>
                        <Grid container direction="column">
                            <Typography variant="body2" color="GrayText">Название</Typography>
                            <TextField size="small" disabled={loading} value={model.name} onChange={(event: ChangeEvent<HTMLInputElement>) => dispatch(RentalObjectActions.saveDraft({ ...model, name: event.target.value }))} />
                        </Grid>
                        <Grid container direction="column">
                            <Typography variant="body2" color="GrayText">Адрес</Typography>
                            <TextField size="small" disabled={loading} value={model.address} onChange={(event: ChangeEvent<HTMLInputElement>) => dispatch(RentalObjectActions.saveDraft({ ...model, address: event.target.value }))} />
                        </Grid>
                    </Stack>
                    <Stack direction="row" spacing={3}>
                        <Stack>
                            <Typography variant="body2" color="GrayText">Время заезда</Typography>
                            <TimePicker
                                disabled={loading}
                                value={moment(model.checkinTime, 'hh:mm:ss')}
                                onChange={(value: string | null) => { dispatch(RentalObjectActions.saveDraft({ ...model, checkinTime: value || '12:00' })) }}
                                renderInput={(params) => <TextField size="small" {...params} />}
                            />
                        </Stack>
                        <Stack>
                            <Typography variant="body2" color="GrayText">Время отъезда</Typography>
                            <TimePicker
                                disabled={loading}
                                value={moment(model.checkoutTime, 'hh:mm:ss')}
                                onChange={(value: string | null) => { dispatch(RentalObjectActions.saveDraft({ ...model, checkoutTime: value || '12:00' })) }}
                                renderInput={(params) => <TextField size="small" {...params} />}
                            />
                        </Stack>
                        <Stack>
                            <Typography variant="body2" color="GrayText">Координаты</Typography>
                            <TextField
                                value={model.coordinates ? `${model.coordinates?.latitude}, ${model.coordinates?.longitude}` : undefined}
                                onChange={handleCoordinatesChanged}
                                size="small"
                                placeholder="##.######, ##.######"
                                InputProps={{ inputComponent: CoordinatesMaskCustom as any }}
                            />
                        </Stack>
                    </Stack>
                    <Stack>
                        <Typography variant="body2" color="GrayText">Описание</Typography>
                        <TextField disabled={loading} value={model.description}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => dispatch(RentalObjectActions.saveDraft({ ...model, description: event.target.value }))}
                            multiline
                            rows={5} />
                    </Stack>
                </Stack>
            </Card>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <Typography color="GrayText" variant="h6">Фотографии объекта</Typography>
                    <Grid item xs></Grid>
                    <Button onClick={handleAddPhoto}>Добавить</Button>
                    <input accept=".png,.jpeg,.jpg" hidden multiple type="file" ref={fileInput} onChange={(event) => handlePhotoChange(event)} />
                </Stack>
                <DragDropContext onDragEnd={photosReorder}>
                    <Droppable droppableId="droppable" direction="horizontal">
                        {(provided, snapshot) => (
                            <Stack spacing={2} direction="row" ref={provided.innerRef} {...provided.droppableProps}>
                                {model.photos?.filter(o => o.entityStatus !== EntityStatus.Deleted).sort((curr, next) => curr.sortOrder - next.sortOrder).map((photo, index) => (
                                    <Draggable
                                        key={`item-${index}`}
                                        draggableId={`item-${index}`}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <Grid
                                                height={200}
                                                className="editable-image"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                            >
                                                <Grid className="alternate-actions" container direction="row" alignItems="start" justifyContent="space-between">
                                                    <OpenWith className="padding-1" />
                                                    <IconButton className="padding-1" onClick={() => handleImageDelete(photo.id)}><Delete /></IconButton>
                                                </Grid>
                                                <img className="image" style={imageStyle} height={200} src={`data:${photo.extension};base64,${photo.body}`}></img>
                                            </Grid>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Stack>
                        )}
                    </Droppable>
                </DragDropContext>
            </Stack>
            <Stack spacing={2}>
                <Stack direction="row">
                    <Typography color="GrayText" variant="h6">Варианты номеров</Typography>
                    <Grid item xs></Grid>
                    <Button disabled={loading} onClick={handleRoomVariantCreate} >Добавить</Button>
                </Stack>
                <Card>
                    <DataGrid
                        autoHeight
                        components={{ NoRowsOverlay: NoRoomVariants }}
                        rows={roomVariants}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        loading={loading}
                        disableSelectionOnClick
                        disableColumnFilter
                        disableColumnMenu
                    />
                </Card>
            </Stack>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography color="GrayText" variant="h6">Отзывы</Typography>
                    <Rating value={model.rate} precision={0.1} readOnly />
                </Stack>
                {model.feedback ? model.feedback.map(f => (
                    <Card>
                        <CardContent>
                            <Typography>{f.comment}</Typography>
                            <Rating value={f.rate} readOnly />
                        </CardContent>
                    </Card>
                )) : <Typography alignSelf="center" color="GrayText">Отзывов еще нет</Typography>}
            </Stack>
        </Stack>
    );
}