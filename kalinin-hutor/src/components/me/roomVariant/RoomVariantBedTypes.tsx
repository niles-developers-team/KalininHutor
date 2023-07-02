import { Edit, Delete } from "@mui/icons-material";
import { Typography, Stack, Grid, CircularProgress, Button, IconButton, CardContent, Card } from "@mui/material";
import { GridOverlay, DataGrid, GridColDef } from "@mui/x-data-grid";
import { BedTypes, RoomVariantBedType } from "../../../models";

interface Props {
    loading: boolean;
    models: RoomVariantBedType[];
    onCreate: () => void
    onEdit: (model: RoomVariantBedType) => void;
    onDelete: (model: RoomVariantBedType) => void;
}

function NoBedTypes(): JSX.Element {
    return (
        <GridOverlay>
            <Typography color="GrayText" variant="subtitle2">Вы еще не добавили варианты кроватей</Typography>
        </GridOverlay>
    );
}

export const RoomVariantBedTypesComponent = function (props: Props) {
    const columns: GridColDef[] = [
        { field: 'bedType', sortable: false, type: "string", headerName: 'Тип кровати', flex: 1, valueGetter: (o) => BedTypes.getDescription((o.row as RoomVariantBedType).bedType) },
        { field: 'width', sortable: false, type: "number", headerName: 'Ширина' },
        { field: 'length', sortable: false, type: "number", headerName: 'Длина' },
        { field: 'maxInRoom', sortable: false, type: "number", headerName: 'Макс. в комнате' },
        {
            field: 'actions', type: 'actions', sortable: false, headerName: '', width: 100, renderCell: (o) => (
                <Stack direction="row">
                    <IconButton onClick={() => props.onEdit(o.row as RoomVariantBedType)}><Edit /></IconButton>
                    <IconButton onClick={() => props.onDelete(o.row as RoomVariantBedType)}><Delete /></IconButton>
                </Stack>
            )
        },
    ];

    return (

        <Stack spacing={2}>
            <Stack direction="row">
                <Typography color="GrayText" variant="h6">Варианты кроватей</Typography>
                <Grid item xs></Grid>
                {props.loading
                    ? <CircularProgress size={36} />
                    : <Button onClick={props.onCreate} >Добавить</Button>
                }
            </Stack>
            <Card>
                    <DataGrid
                        autoHeight
                        components={{ NoRowsOverlay: NoBedTypes }}
                        rows={props.models}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        loading={props.loading}
                        checkboxSelection={false}
                        disableSelectionOnClick
                        disableColumnFilter
                        disableColumnMenu
                    />
            </Card>
        </Stack>
    );
}