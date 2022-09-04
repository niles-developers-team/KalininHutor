import { Button, Grid, IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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
import { ArrowBack } from "@mui/icons-material";
import { RoomVariantActions } from "../../../store/roomVariantStore";

export const RoomVariantComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id, rentalObjectId } = useParams();
    const { roomCharacteristicState, roomVariantState } = useAppSelector((state: AppState) => state);
    const [characteristicSearch, setCharacteristicSearch] = useState<string>();
    const debouncedSearch = useDebounce(characteristicSearch, 500);

    useEffect(() => { init() }, [rentalObjectId]);

    async function init() {
        if (!rentalObjectId)
            return;

        await dispatch(RentalObjectActions.getRentalObject(rentalObjectId));

        if (!id || id === 'create') {
            dispatch(RoomVariantActions.createDraft({
                id: uuidv4(),
                bedTypes: [],
                characteristics: [],
                count: 0,
                description: '',
                entityStatus: EntityStatus.Draft,
                freeCount: 0,
                length: 0,
                maxPersonsCount: 0,
                name: '',
                paymentOption: PaymentOptions.ByCardOrCashOnTheSpot,
                price: 0,
                width: 0,
                rentalObjectId: rentalObjectId
            }));
        } else {
            await dispatch(RoomVariantActions.getRoomVariant(id));
        }
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
        await init();
        setBedType({ ...RoomVariantBedType.initial });
        setRoomCharacteristic({ ...RoomVariantCharacteristic.initial });
    }

    async function handleConfirm() {
        if (roomVariant.entityStatus === EntityStatus.Draft) {
            await dispatch(RoomVariantActions.create(roomVariant));
        } else {
            await dispatch(RoomVariantActions.update(roomVariant));
        }

        dispatch(RoomVariantActions.clearEditionState());
        navigate(`/me/rental-objects/${rentalObjectId}`);
    }

    const loading = roomVariantState.modelLoading;

    if (!roomVariantState.model)
        return (<Typography></Typography>);

    const roomVariant = roomVariantState.model;

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={() => navigate(`/me/rental-objects/${rentalObjectId}`)}><ArrowBack /></IconButton>
                <Typography color="GrayText" variant="h6">Вариант номера</Typography>
            </Stack>
            <RoomVariantDetailsComponent
                model={roomVariant}
                loading={loading}
                onDetailsChanged={(model: RoomVariant) => dispatch(RoomVariantActions.updateDraft({ ...model }))}
            />
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
            <Stack direction="row">
                <Grid item xs></Grid>
                <Button color="inherit" onClick={handleDiscard}>Отмена</Button>
                <Button color="primary" onClick={handleConfirm}>Сохранить</Button>
            </Stack>
            <CharacteristicDialog
                model={roomCharacteristic}
                characteristics={roomCharacteristicState.models || []}
                searching={roomCharacteristicState.modelsLoading}
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