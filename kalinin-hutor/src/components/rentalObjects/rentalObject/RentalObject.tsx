import { Edit, Delete, ArrowBack } from "@mui/icons-material";
import { Button, CircularProgress, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridOverlay } from "@mui/x-data-grid";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { EntityStatus, RentalObject, RoomVariant, RoomVariantBedType, RoomVariantCharacteristic } from "../../../models";
import { AppState } from "../../../store";
import { RentalObjectActions } from "../../../store/rentalObjectStore";


function NoRoomVariants(): JSX.Element {
    return (
        <GridOverlay>
            <Typography color="GrayText" variant="subtitle2">Вы еще не добавили варианты номеров</Typography>
        </GridOverlay>
    );
}

export const RentalObjectComponent = function (): JSX.Element {
    const { rentalObjectState, userState } = useAppSelector((state: AppState) => ({
        userState: state.userState,
        rentalObjectState: state.rentalObjectState
    }));

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Название', flex: 1 },
        { field: 'description', headerName: 'Описание', flex: 1 },
        {
            field: 'actions', type: 'actions', sortable: false, headerName: '', width: 100, renderCell: (o) => (
                <Stack direction="row">
                    <IconButton onClick={() => handleRoomVariantEdit(o.row as RoomVariant)}><Edit /></IconButton>
                    <IconButton onClick={() => handleRoomVariantDelete(o.row as RoomVariant)}><Delete /></IconButton>
                </Stack>
            )
        }
    ];

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [model, setModel] = useState<RentalObject>(RentalObject.initial);

    const { id } = useParams();

    useEffect(() => {
        dispatch(RentalObjectActions.getRentalObject(id));
    }, [id]);

    function handleRoomVariantCreate() {
        dispatch(RentalObjectActions.applyEditionState(model));
        navigate(`/me/rental-objects/${id}/room-variants/create`);
    }

    function handleRoomVariantEdit(roomVariant: RoomVariant) {
        dispatch(RentalObjectActions.applyEditionState(model));
        navigate(`/me/rental-objects/${id}/room-variants/${roomVariant.id}`);
    }

    function handleRoomVariantDelete(roomVariant: RoomVariant) {
        dispatch(RentalObjectActions.deleteRoomVariant(roomVariant.id || ''));
    }

    useEffect(() => {
        if (rentalObjectState.modelLoading === false) {
            setModel(rentalObjectState.model);
        }
    }, [rentalObjectState.modelLoading, rentalObjectState.modelSpecsLoading]);

    async function handleDiscard() {
        dispatch(RentalObjectActions.clearEditionState());
        dispatch(RentalObjectActions.getRentalObject(id));
    }

    function handleConfirm() {
        if (userState.authenticating === false)
            if (!model.id) {
                dispatch(RentalObjectActions.createRentalObject({
                    address: model.address,
                    checkinTime: model.checkinTime,
                    checkoutTime: model.checkoutTime,
                    description: model.description,
                    landlordId: userState.currentUser?.id,
                    name: model.name,
                    createRoomVariantsRequests: model.roomVariants?.map<RoomVariant.CreateRequest>(rv => ({
                        count: rv.count,
                        description: rv.description,
                        freeCount: rv.freeCount,
                        length: rv.length,
                        maxPersonsCount: rv.maxPersonsCount,
                        name: rv.name,
                        paymentOption: rv.paymentOption,
                        price: rv.price,
                        width: rv.width,
                        freeCancellationPeriod: rv.freeCancellationPeriod,
                        createBedTypesRequests: rv.bedTypes.map<RoomVariantBedType.CreateRequest>(bt => ({
                            bedType: bt.bedType,
                            maxInRoom: bt.maxInRoom,
                            roomVariantId: bt.roomVariantId,
                            length: bt.length,
                            width: bt.width
                        })),
                        createCharacteristicsRequests: rv.characteristics
                            .map<RoomVariantCharacteristic.CreateRequest>(ch => ({
                                roomCharacteristicId: ch.roomCharacteristicId || '',
                                roomVariantId: ch.roomVariantId,
                                price: ch.price
                            })),
                    }))
                }));
            }
            else {
                dispatch(RentalObjectActions.updateRentalObject({
                    id: model.id,
                    checkinTime: model.checkinTime,
                    checkoutTime: model.checkoutTime,
                    description: model.description,
                    name: model.name,
                    createRoomVariantsRequests: model.roomVariants
                        ?.filter(o => o.status === EntityStatus.Created)
                        .map<RoomVariant.CreateRequest>(rv => ({
                            count: rv.count,
                            description: rv.description,
                            freeCount: rv.freeCount,
                            length: rv.length,
                            maxPersonsCount: rv.maxPersonsCount,
                            name: rv.name,
                            paymentOption: rv.paymentOption,
                            price: rv.price,
                            width: rv.width,
                            freeCancellationPeriod: rv.freeCancellationPeriod,
                            rentalObjectId: model.id,
                            createBedTypesRequests: rv.bedTypes.map<RoomVariantBedType.CreateRequest>(bt => ({
                                bedType: bt.bedType,
                                maxInRoom: bt.maxInRoom,
                                roomVariantId: bt.roomVariantId,
                                length: bt.length,
                                width: bt.width
                            })),
                            createCharacteristicsRequests: rv.characteristics
                                .map<RoomVariantCharacteristic.CreateRequest>(ch => ({
                                    roomCharacteristicId: ch.roomCharacteristicId || '',
                                    roomVariantId: ch.roomVariantId,
                                    price: ch.price
                                })),
                        })),
                    updateRoomVariantsRequests: model.roomVariants
                        ?.filter(o => o.status === EntityStatus.Updated)
                        .map<RoomVariant.UpdateRequest>(rv => ({
                            id: rv.id || '',
                            count: rv.count,
                            description: rv.description,
                            freeCount: rv.freeCount,
                            length: rv.length,
                            maxPersonsCount: rv.maxPersonsCount,
                            name: rv.name,
                            paymentOption: rv.paymentOption,
                            price: rv.price,
                            width: rv.width,
                            freeCancellationPeriod: rv.freeCancellationPeriod,
                            rentalObjectId: model.id,
                            createBedTypesRequests: rv.bedTypes
                                .filter(o => o.status === EntityStatus.Created)
                                .map<RoomVariantBedType.CreateRequest>(bt => ({
                                    bedType: bt.bedType,
                                    maxInRoom: bt.maxInRoom,
                                    roomVariantId: bt.roomVariantId,
                                    length: bt.length,
                                    width: bt.width
                                })),
                            createCharacteristicsRequests: rv.characteristics
                                .filter(o => o.status === EntityStatus.Created)
                                .map<RoomVariantCharacteristic.CreateRequest>(ch => ({
                                    roomCharacteristicId: ch.roomCharacteristicId || '',
                                    roomVariantId: ch.roomVariantId,
                                    price: ch.price
                                })),
                            updateBedTypesRequests: rv.bedTypes
                                .filter(o => o.status === EntityStatus.Created)
                                .map<RoomVariantBedType.UpdateRequest>(bt => ({
                                    id: bt.id,
                                    bedType: bt.bedType,
                                    maxInRoom: bt.maxInRoom,
                                    roomVariantId: bt.roomVariantId,
                                    length: bt.length,
                                    width: bt.width
                                })),
                            updateCharacteristicsRequests: rv.characteristics
                                .filter(o => o.status === EntityStatus.Created)
                                .map<RoomVariantCharacteristic.UpdateRequest>(ch => ({
                                    id: ch.id || '',
                                    roomCharacteristicId: ch.roomCharacteristicId || '',
                                    roomVariantId: ch.roomVariantId,
                                    price: ch.price
                                })),
                            deleteBedTypesRequests: rv.bedTypes
                                .filter(o => o.status === EntityStatus.Created)
                                .map<RoomVariantBedType.DeleteRequest>(bt => ({ id: bt.id || '' })),
                            deleteCharacteristicsRequests: rv.characteristics
                                .filter(o => o.status === EntityStatus.Created)
                                .map<RoomVariantCharacteristic.DeleteRequest>(ch => ({ id: ch.id || '' })),
                        })),
                    deleteRoomVariantsRequests: model.roomVariants
                        ?.filter(o => o.status === EntityStatus.Deleted)
                        .map<RoomVariant.DeleteRequest>(rv => ({ id: rv.id || '' }))
                }));
            }
    }

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={() => navigate(`/me`)}><ArrowBack /></IconButton>
                <Typography color="GrayText" variant="h6">Информация об объекте аренды</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <Stack spacing={3}>
                    <TextField disabled={rentalObjectState.modelLoading} label="Название" value={model.name} onChange={(event: ChangeEvent<HTMLInputElement>) => setModel({ ...model, name: event.target.value })} />
                    <TextField disabled={rentalObjectState.modelLoading} label="Адрес" value={model.address} onChange={(event: ChangeEvent<HTMLInputElement>) => setModel({ ...model, address: event.target.value })} />
                </Stack>
                <TextField disabled={rentalObjectState.modelLoading} label="Описание" value={model.description} onChange={(event: ChangeEvent<HTMLInputElement>) => setModel({ ...model, description: event.target.value })}
                    multiline
                    rows={5} />
            </Stack>
            <Stack style={{ height: 400 }}>
                <Stack direction="row">
                    <Typography color="GrayText" variant="h6">Варианты номеров</Typography>
                    <Grid item xs></Grid>
                    <Button disabled={rentalObjectState.modelSpecsLoading} onClick={handleRoomVariantCreate} >Добавить</Button>
                </Stack>
                <DataGrid style={{ height: 400 }}
                    components={{
                        NoRowsOverlay: NoRoomVariants
                    }}
                    rows={model.roomVariants || []}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    loading={rentalObjectState.modelSpecsLoading}
                    disableSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                />
            </Stack>
            <Stack direction="row">
                <Grid item xs></Grid>
                <Button color="inherit" onClick={handleDiscard}>Отмена</Button>
                <Button color="primary" onClick={handleConfirm}>Сохранить</Button>
            </Stack>
        </Stack>
    );
}