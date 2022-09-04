import { Edit, Delete, ArrowBack } from "@mui/icons-material";
import { Button, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridOverlay } from "@mui/x-data-grid";
import { TimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { ChangeEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { EntityStatus, RoomVariant } from "../../models";
import { AppState } from "../../store";
import { RentalObjectActions } from "../../store/rentalObjectStore";
import { RoomVariantActions } from "../../store/roomVariantStore";


function NoRoomVariants(): JSX.Element {
    return (
        <GridOverlay>
            <Typography color="GrayText" variant="subtitle2">Вы еще не добавили варианты номеров</Typography>
        </GridOverlay>
    );
}

export const MyRentalObjectComponent = function (): JSX.Element {
    const { rentalObjectState, userState, roomVariantState } = useAppSelector((state: AppState) => state);

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

    useEffect(() => { init(); }, [id]);

    async function init() {
        if (id === 'create' || !id) {
            dispatch(RentalObjectActions.getDraft());
        } else {
            await dispatch(RentalObjectActions.getRentalObject(id));
            await dispatch(RoomVariantActions.getRoomVariants(id));
        }
    }

    function handleRoomVariantCreate() {
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

    const loading = rentalObjectState.modelLoading;

    if (!rentalObjectState.model)
        return (<Typography>Не найден объект аренды</Typography>);

    const model = rentalObjectState.model;
    const roomVariants = roomVariantState.models || [];

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={handleGoBack}><ArrowBack /></IconButton>
                <Typography color="GrayText" variant="h6">Информация об объекте аренды</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <Stack spacing={3}>
                    <TextField disabled={loading} label="Название" value={model.name} onChange={(event: ChangeEvent<HTMLInputElement>) => dispatch(RentalObjectActions.updateDraft({ ...model, name: event.target.value }))} />
                    <TextField disabled={loading} label="Адрес" value={model.address} onChange={(event: ChangeEvent<HTMLInputElement>) => dispatch(RentalObjectActions.updateDraft({ ...model, address: event.target.value }))} />
                </Stack>
                <TextField disabled={loading} label="Описание" value={model.description} onChange={(event: ChangeEvent<HTMLInputElement>) => dispatch(RentalObjectActions.updateDraft({ ...model, description: event.target.value }))}
                    multiline
                    rows={5} />
            </Stack>
            <Stack spacing={2}>
                <Typography color="GrayText" variant="h6">Порядок проживания</Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <TimePicker
                        disabled={loading}
                        label="Время заезда"
                        value={moment(model.checkinTime, 'hh:mm:ss')}
                        onChange={(value: string | null) => { dispatch(RentalObjectActions.updateDraft({ ...model, checkinTime: value || '12:00' })) }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <TimePicker
                        disabled={loading}
                        label="Время отъезда"
                        value={moment(model.checkoutTime, 'hh:mm:ss')}
                        onChange={(value: string | null) => { dispatch(RentalObjectActions.updateDraft({ ...model, checkoutTime: value || '12:00' })) }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Stack>
            </Stack>
            <Stack style={{ height: 400 }}>
                <Stack direction="row">
                    <Typography color="GrayText" variant="h6">Варианты номеров</Typography>
                    <Grid item xs></Grid>
                    <Button disabled={loading} onClick={handleRoomVariantCreate} >Добавить</Button>
                </Stack>
                <DataGrid style={{ height: 400 }}
                    components={{ NoRowsOverlay: NoRoomVariants }}
                    rows={roomVariants}
                    columns={columns}
                    pageSize={5}
                    loading={loading}
                    disableSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                />
            </Stack>
            <Stack direction="row">
                <Grid item xs></Grid>
                <Button color="inherit"
                    disabled={loading}
                    onClick={handleDiscard}>Отмена</Button>
                <Button color="primary"
                    disabled={loading}
                    onClick={handleConfirm}>Сохранить</Button>
            </Stack>
        </Stack>
    );
}