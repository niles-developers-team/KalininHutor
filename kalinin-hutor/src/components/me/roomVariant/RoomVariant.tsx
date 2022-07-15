import { Button, Grid, IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector, useDebounce } from "../../../hooks";
import { EntityStatus, RoomCharacteristic, RoomVariant, RoomVariantBedType, RoomVariantCharacteristic } from "../../../models";
import { AppState, RentalObjectActions } from "../../../store";
import { RoomCharacteristicActions } from "../../../store/roomCharacteristicStore";
import { RoomCharacteristicActionTypes } from "../../../store/roomCharacteristicStore/actions";
import { BedVariantDialog } from "./BedVariantDialog";
import { CharacteristicDialog } from "./CharacteristicDialog";
import { RoomVariantBedTypesComponent } from "./RoomVariantBedTypes";
import { RoomVariantCharacteristicsComponent } from "./RoomVariantCharacteristics";
import { RoomVariantDetailsComponent } from "./RoomVariantDetails";
import { v4 as uuidv4 } from 'uuid';
import { ArrowBack } from "@mui/icons-material";

export const RoomVariantComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id, rentalObjectId } = useParams();
    const { roomCharacteristicState, rentalObjectState } = useAppSelector((state: AppState) => ({
        rentalObjectState: state.rentalObjectState,
        roomCharacteristicState: state.roomCharacteristicState
    }));
    const [characteristicSearch, setCharacteristicSearch] = useState<string>();
    const [isCharacteristicSearchInProgress, setIsCharacteristicSearchInProgress] = useState<boolean>(true);
    const debouncedSearch = useDebounce(characteristicSearch, 500);

    useEffect(() => { dispatch(RentalObjectActions.getRentalObject(rentalObjectId)); }, [rentalObjectId]);

    useEffect(() => {
        if (rentalObjectState.modelLoading === false) {
            const roomVariant = rentalObjectState.model.roomVariants?.find(o => o.id === id) || RoomVariant.initial;

            if (roomCharacteristicState.modelsLoading === false) {
                roomVariant.characteristics.forEach(rvch => {
                    const characteristic = roomCharacteristicState.models.find(o => o.id === rvch.roomCharacteristicId);
                    rvch.roomCharacteristic = characteristic ? { ...characteristic } : RoomCharacteristic.initial;
                });
            }
            setRoomVariant({ ...roomVariant });
        }
    }, [id, rentalObjectState.modelLoading, rentalObjectState.modelSpecsLoading]);

    useEffect(() => {
        if (roomCharacteristicState.modelsLoading === false) {
            setRoomsCharateristics([...roomCharacteristicState.models]);
        }
    }, [roomCharacteristicState.modelsLoading]);

    useEffect(() => {
        dispatch(RoomCharacteristicActions.getRoomCharacteristics({ searchText: debouncedSearch, take: 10 }));
        setIsCharacteristicSearchInProgress(false);
    }, [debouncedSearch]);

    const [roomVariant, setRoomVariant] = useState<RoomVariant>(RoomVariant.initial);
    const [roomsCharacteristics, setRoomsCharateristics] = useState<RoomCharacteristic[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [characteristicDialogOpen, setCharacteristicDialogOpen] = useState<boolean>(false);
    const [bedVariantDialogOpen, setBedVariantDialogOpen] = useState<boolean>(false);

    const [roomCharacteristic, setRoomCharacteristic] = useState<RoomVariantCharacteristic>({ ...RoomVariantCharacteristic.initial });
    const [bedType, setBedType] = useState<RoomVariantBedType>({ ...RoomVariantBedType.initial });

    function handleCharacteristicDialogClose() {
        setCharacteristicDialogOpen(false);
    }

    function handleRoomCharacteristicDelete(model: RoomVariantCharacteristic) {
        if (model.status === EntityStatus.Created)
            setRoomVariant({ ...roomVariant, characteristics: [...roomVariant.characteristics.filter(o => o.id !== model.id)] });
        else
            setRoomVariant({ ...roomVariant, characteristics: [...roomVariant.characteristics.map(o => o.id === model.id ? { ...model, status: EntityStatus.Deleted } : o)] })
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
        if (model.roomCharacteristic && !model.roomCharacteristic.id) {
            const result = await dispatch(RoomCharacteristicActions.createRoomCharacteristic({
                description: model.roomCharacteristic.description,
                name: model.roomCharacteristic.name,
                type: model.roomCharacteristic.type
            }))
            if (result.type === RoomCharacteristicActionTypes.createSuccess)
                model.roomCharacteristic = result.model;
        }

        if (!model.id) {
            model.id = uuidv4();
            model.status = EntityStatus.Created;
            setRoomVariant({ ...roomVariant, characteristics: [...roomVariant.characteristics, model] });
        } else {
            model.status = model.status === EntityStatus.Created ? EntityStatus.Created : EntityStatus.Updated;
            setRoomVariant({ ...roomVariant, characteristics: [...roomVariant.characteristics.map(o => o.id === model.id ? model : o)] })
        }
        setCharacteristicDialogOpen(false);
        setRoomCharacteristic(RoomVariantCharacteristic.initial);
    }

    function handleBedTypeDelete(model: RoomVariantBedType) {
        if (model.status === EntityStatus.Created)
            setRoomVariant({ ...roomVariant, bedTypes: [...roomVariant.bedTypes.filter(o => o.id !== model.id)] })
        else
            setRoomVariant({ ...roomVariant, bedTypes: [...roomVariant.bedTypes.map(o => o.id === model.id ? { ...model, status: EntityStatus.Deleted } : o)] })
    }

    function handleBedTypeEdit(model: RoomVariantBedType) {
        setBedType(model);
        setBedVariantDialogOpen(true);
    }

    function handleBedTypeCreate() {
        setBedType(RoomVariantBedType.initial);
        setBedVariantDialogOpen(true);
    }

    function handleBedVariantDialogDiscard() {
        setBedVariantDialogOpen(false);
    }

    function handleBedVariantDialogConfirm(model: RoomVariantBedType) {
        if (!model.id) {
            model.id = uuidv4();
            model.status = EntityStatus.Created;
            setRoomVariant({ ...roomVariant, bedTypes: [...roomVariant.bedTypes, model] })
        } else {
            model.status = model.status === EntityStatus.Created ? EntityStatus.Created : EntityStatus.Updated;
            setRoomVariant({ ...roomVariant, bedTypes: [...roomVariant.bedTypes.map(o => o.id === model.id ? model : o)] })
        }
        setBedVariantDialogOpen(false);
        setBedType(RoomVariantBedType.initial);
    }

    function handleCharacteristicSearch(searchText: string) {
        setCharacteristicSearch(searchText);
        setIsCharacteristicSearchInProgress(true);
    }

    function handleDiscard() {
        if (rentalObjectState.modelLoading === false) {
            const roomVariant = rentalObjectState.model?.roomVariants?.find(o => o.id === id) || RoomVariant.initial;
            setRoomVariant({ ...roomVariant });
        }
        setBedType({ ...RoomVariantBedType.initial });
        setRoomCharacteristic({ ...RoomVariantCharacteristic.initial });
    }

    function handleConfirm() {
        if (!roomVariant.id) {
            roomVariant.id = uuidv4();
            dispatch(RentalObjectActions.appendRoomVariant(roomVariant));
        } else {
            dispatch(RentalObjectActions.applyRoomVariant(roomVariant));
        }

        navigate(`/me/rental-objects/${rentalObjectId}`);
    }

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={() => navigate(`/me/rental-objects/${rentalObjectId}`)}><ArrowBack /></IconButton>
                <Typography color="GrayText" variant="h6">Вариант номера</Typography>
            </Stack>
            <RoomVariantDetailsComponent
                model={roomVariant}
                loading={loading}
                onDetailsChanged={(model: RoomVariant) => setRoomVariant({ ...model })}
            />
            <RoomVariantCharacteristicsComponent
                loading={loading}
                models={roomVariant.characteristics.filter(o => o.status !== EntityStatus.Deleted)}
                characteristics={roomsCharacteristics}
                onCreate={handleRoomCharacteristicCreate}
                onEdit={handleRoomCharacteristicEdit}
                onDelete={handleRoomCharacteristicDelete}
            />
            <RoomVariantBedTypesComponent
                loading={loading}
                models={roomVariant.bedTypes.filter(o => o.status !== EntityStatus.Deleted)}
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
                characteristics={roomsCharacteristics}
                searching={isCharacteristicSearchInProgress}
                onSearch={handleCharacteristicSearch}
                onDiscard={handleCharacteristicDialogClose}
                onConfirm={handleCharacteristicDialogConfirm}
                open={characteristicDialogOpen}
            />
            <BedVariantDialog
                model={bedType}
                onDiscard={handleBedVariantDialogDiscard}
                onConfirm={handleBedVariantDialogConfirm}
                open={bedVariantDialogOpen}
            />
        </Stack>
    );
}