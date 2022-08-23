import { Edit, Delete } from "@mui/icons-material";
import { Stack, Typography, Grid, CircularProgress, Button, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridOverlay } from "@mui/x-data-grid";
import { CharacteristicTypes, RoomCharacteristic, RoomVariantCharacteristic } from "../../../models";

function NoCharacteristics(): JSX.Element {
    return (
        <GridOverlay>
            <Typography color="GrayText" variant="subtitle2">Вы еще не добавили услуги или сервисы</Typography>
        </GridOverlay>
    );
}

interface Props {
    loading: boolean;
    models: RoomVariantCharacteristic[];
    characteristics: RoomCharacteristic[];
    onCreate: () => void
    onEdit: (model: RoomVariantCharacteristic) => void;
    onDelete: (model: RoomVariantCharacteristic) => void;
}

export const RoomVariantCharacteristicsComponent = function (props: Props) {
    const columns: GridColDef[] = [
        {
            field: 'type', sortable: false, type: "string", headerName: 'Тип', flex: 1, valueGetter: (o) => {
                const value = (o.row as RoomVariantCharacteristic);
                const characteristic = props.characteristics.find(o => o.id === value.roomCharacteristicId);
                return CharacteristicTypes.getDescription(characteristic?.type);
            }
        },
        { field: 'name', sortable: false, type: "string", headerName: 'Название', flex: 1, valueGetter: (o) => (o.row as RoomVariantCharacteristic).roomCharacteristic?.name },
        { field: 'description', sortable: false, type: "string", headerName: 'Описание', flex: 1, valueGetter: (o) => (o.row as RoomVariantCharacteristic).roomCharacteristic?.description },
        { field: 'price', sortable: false, type: "number", headerName: 'Цена' },
        {
            field: 'actions', type: 'actions', sortable: false, headerName: '', width: 100, renderCell: (o) => (
                <Stack direction="row">
                    <IconButton onClick={() => props.onEdit(o.row as RoomVariantCharacteristic)}><Edit /></IconButton>
                    <IconButton onClick={() => props.onDelete(o.row as RoomVariantCharacteristic)}><Delete /></IconButton>
                </Stack>
            )
        },
    ];

    return (
        <Stack spacing={2} style={{ minHeight: 500 }}>
            <Stack direction="row">
                <Typography color="GrayText" variant="h6">Услуги и сервисы</Typography>
                <Grid item xs></Grid>
                {props.loading
                    ? <CircularProgress size={36} />
                    : <Button onClick={props.onCreate}>Добавить</Button>
                }
            </Stack>
            <DataGrid
                components={{ NoRowsOverlay: NoCharacteristics }}
                rows={props.models}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                loading={props.loading}
                checkboxSelection={false}
                disableSelectionOnClick
                disableColumnSelector
                disableColumnFilter
                disableColumnMenu
            />
        </Stack>);
}