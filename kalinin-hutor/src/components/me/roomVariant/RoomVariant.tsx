import { Button, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import { createRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector, useDebounce } from "../../../hooks";
import { EntityStatus, PaymentOptions, RoomVariant, RoomVariantBedType, RoomVariantCharacteristic } from "../../../models";
import { AppState, RentalObjectActions } from "../../../store";
import { RoomCharacteristicActions } from "../../../store/roomCharacteristicStore";
import { BedVariantDialog } from "./BedVariantDialog";
import { CharacteristicDialog } from "./CharacteristicDialog";
import { RoomVariantBedTypesComponent } from "./RoomVariantBedTypes";
import { RoomVariantCharacteristicsComponent } from "./RoomVariantCharacteristics";
import { RoomVariantDetailsComponent } from "./RoomVariantDetails";
import { v4 as uuidv4 } from 'uuid';
import { ArrowBack, Delete, OpenWith } from "@mui/icons-material";
import { RoomVariantActions } from "../../../store/roomVariantStore";
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import { appName } from "../../..";



const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    cursor: isDragging ? 'grabbing' : 'grab',

    // styles we need to apply on draggables
    ...draggableStyle,
});


export const RoomVariantComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const fileInput = createRef<HTMLInputElement>();
    const { id, rentalObjectId } = useParams();
    const { roomCharacteristicState, roomVariantState, rentalObjectState } = useAppSelector((state: AppState) => state);
    const [characteristicSearch, setCharacteristicSearch] = useState<string>();
    const debouncedSearch = useDebounce(characteristicSearch, 500);

    useEffect(() => { init() }, [rentalObjectId]);

    async function init() {
        if (rentalObjectId === 'create' || !rentalObjectId) {
            dispatch(RentalObjectActions.getDraft());
        } else {
            dispatch(RentalObjectActions.getRentalObject(rentalObjectId));
        }

        if (!id || id === 'create') {
            dispatch(RoomVariantActions.getDraft());
        } else {
            await dispatch(RoomVariantActions.getRoomVariant(id));
        }

        setBedType({ ...RoomVariantBedType.initial });
        setRoomCharacteristic({ ...RoomVariantCharacteristic.initial });
    }

    useEffect(() => { dispatch(RoomCharacteristicActions.getRoomCharacteristics({ searchText: debouncedSearch, take: 10 })); }, [debouncedSearch]);

    const [characteristicDialogOpen, setCharacteristicDialogOpen] = useState<boolean>(false);
    const [bedVariantDialogOpen, setBedVariantDialogOpen] = useState<boolean>(false);

    const [roomCharacteristic, setRoomCharacteristic] = useState<RoomVariantCharacteristic>({ ...RoomVariantCharacteristic.initial });
    const [bedType, setBedType] = useState<RoomVariantBedType>({ ...RoomVariantBedType.initial });

    function handleRoomCharacteristicDelete(model: RoomVariantCharacteristic) {
        dispatch(RoomVariantActions.deleteRoomCharacteristic(model));
    }

    function handleRoomCharacteristicEdit(model: RoomVariantCharacteristic) {
        setRoomCharacteristic(model);
        setCharacteristicDialogOpen(true);
    }

    function handleRoomCharacteristicCreate() {
        setRoomCharacteristic(RoomVariantCharacteristic.initial);
        setCharacteristicDialogOpen(true);
    }

    async function handleCharacteristicDialogConfirm(model: RoomVariantCharacteristic) {
        dispatch(RoomVariantActions.addRoomCharacteristic(model));
        setCharacteristicDialogOpen(false);
        setRoomCharacteristic(RoomVariantCharacteristic.initial);
    }

    function handleBedTypeDelete(model: RoomVariantBedType) {
        dispatch(RoomVariantActions.deleteBedType(model));
    }

    function handleBedTypeEdit(model: RoomVariantBedType) {
        setBedType(model);
        setBedVariantDialogOpen(true);
    }

    function handleBedTypeCreate() {
        setBedType(RoomVariantBedType.initial);
        setBedVariantDialogOpen(true);
    }

    function handleBedVariantDialogConfirm(model: RoomVariantBedType) {
        dispatch(RoomVariantActions.addBedType(model));
        setBedVariantDialogOpen(false);
        setBedType(RoomVariantBedType.initial);
    }

    async function handleDiscard() {
        dispatch(RoomVariantActions.clearEditionState());

        if (roomVariant.entityStatus === EntityStatus.Draft) {
            navigate(`/me/rental-objects/${rentalObjectId}`);
            return;
        }
        await init();
    }

    function handleGoBack() {
        dispatch(RoomVariantActions.clearEditionState());
        navigate(`/me/rental-objects/${rentalObjectId}`);
    }

    async function handleConfirm() {
        const rentalObject = rentalObjectState.model;
        if (roomVariant.entityStatus === EntityStatus.Draft && !rentalObject?.roomVariants.find(o => o.id === roomVariant.id)) {
            await dispatch(RoomVariantActions.create(roomVariant));
        } else {
            await dispatch(RoomVariantActions.update(roomVariant));
        }

        dispatch(RoomVariantActions.clearEditionState());
        navigate(`/me/rental-objects/${rentalObjectId}`);
    }

    function handleAddPhoto() {
        fileInput.current?.click();
    }

    async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        if (!event?.target?.files?.length) return;

        await dispatch(RoomVariantActions.appendPhotoToDraft(event?.target?.files));

        if (event?.target)
            event.target.value = '';
    }

    async function photosReorder(result: DropResult, provided: ResponderProvided) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        await dispatch(RoomVariantActions.reorderPhotos(result.source.index, result.destination.index));
    }

    async function handleImageDelete(id: string) {
        await dispatch(RoomVariantActions.deletePhotoFromDaft(id));
    }

    const loading = roomVariantState.modelLoading;

    if (!roomVariantState.model)
        return (<Typography></Typography>);

    const roomVariant = roomVariantState.model;

    document.title = `${appName} / Личный Кабинет / ${rentalObjectState.model?.name || 'Новый объект аренды'} / ${roomVariant.name}`;

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={handleGoBack}><ArrowBack /></IconButton>
                <Typography color="GrayText" variant="h6">Вариант номера</Typography>
                <Grid item xs></Grid>
                <Button color="inherit" onClick={handleDiscard}>Отмена</Button>
                <Button color="primary" onClick={handleConfirm}>Сохранить</Button>
            </Stack>
            <RoomVariantDetailsComponent
                model={roomVariant}
                loading={loading}
                onDetailsChanged={(model: RoomVariant) => dispatch(RoomVariantActions.saveDraft({ ...model }))}
            />
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <Typography color="GrayText" variant="h6">Фотографии варианта номера</Typography>
                    <Button onClick={handleAddPhoto}>Добавить</Button>
                    <input accept=".png,.jpeg,.jpg" hidden multiple type="file" ref={fileInput} onChange={(event) => handlePhotoChange(event)} />
                </Stack>
                <DragDropContext onDragEnd={photosReorder}>
                    <Droppable droppableId="droppable" direction="horizontal">
                        {(provided, snapshot) => (
                            <Stack spacing={2} direction="row" ref={provided.innerRef} {...provided.droppableProps}>
                                {roomVariant.photos?.filter(o => o.entityStatus !== EntityStatus.Deleted).sort((curr, next) => curr.sortOrder - next.sortOrder).map((photo, index) => (
                                    <Draggable
                                        key={`item-${index}`}
                                        draggableId={`item-${index}`}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <Paper
                                                className="editable-image"
                                                variant="outlined"
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
                                                <img className="image" height={200} width={200} src={`data:${photo.extension};base64,${photo.body}`}></img>
                                            </Paper>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Stack>
                        )}
                    </Droppable>
                </DragDropContext>
            </Stack>
            <RoomVariantCharacteristicsComponent
                loading={loading}
                models={roomVariant.characteristics?.filter(o => o.entityStatus !== EntityStatus.Deleted)}
                characteristics={roomCharacteristicState.models || []}
                onCreate={handleRoomCharacteristicCreate}
                onEdit={handleRoomCharacteristicEdit}
                onDelete={handleRoomCharacteristicDelete}
            />
            <RoomVariantBedTypesComponent
                loading={loading}
                models={roomVariant.bedTypes?.filter(o => o.entityStatus !== EntityStatus.Deleted)}
                onCreate={handleBedTypeCreate}
                onEdit={handleBedTypeEdit}
                onDelete={handleBedTypeDelete}
            />
            <CharacteristicDialog
                model={roomCharacteristic}
                characteristics={roomCharacteristicState.models || []}
                searching={roomCharacteristicState.modelsLoading}
                search={characteristicSearch || ''}
                onSearch={(searchText) => setCharacteristicSearch(searchText)}
                onDiscard={() => setCharacteristicDialogOpen(false)}
                onConfirm={handleCharacteristicDialogConfirm}
                open={characteristicDialogOpen}
            />
            <BedVariantDialog
                model={bedType}
                onDiscard={() => setBedVariantDialogOpen(false)}
                onConfirm={handleBedVariantDialogConfirm}
                open={bedVariantDialogOpen}
            />
        </Stack>
    );
}