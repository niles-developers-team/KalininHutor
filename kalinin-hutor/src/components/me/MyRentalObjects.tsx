import { Button, CircularProgress, Grid, IconButton, Stack, Typography } from "@mui/material";
import { RentalObject } from "../../models";
import { DataGrid, GridColDef, GridOverlay } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";

interface Props {
    models: RentalObject[];
    loading: boolean;
    onCreate: () => void;
    onEdit: (model: RentalObject) => void;
    onDelete: (model: RentalObject) => void;
}

function NoRentalObjects(): JSX.Element {
    return (
        <GridOverlay>
            <Typography color="GrayText" variant="subtitle2">Вы еще не зарегистрировали объект аренды</Typography>
        </GridOverlay>
    );
}

export const MyRentalObjectsComponent = function (props: Props): JSX.Element {

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Название', flex: 1 },
        { field: 'description', headerName: 'Описание', flex: 1 },
        { field: 'address', headerName: 'Адрес', flex: 1 },
        {
            field: 'actions', type: 'actions', sortable: false, headerName: '', width: 100, renderCell: (o) => (
                <Stack direction="row">
                    <IconButton onClick={() => props.onEdit(o.row as RentalObject)}><Edit /></IconButton>
                    <IconButton onClick={() => props.onDelete(o.row as RentalObject)}><Delete /></IconButton>
                </Stack>
            )
        }
    ];

    return (
        <Stack spacing={2} style={{ height: 400 }}>
            <Stack direction="row">
                <Typography color="GrayText" variant="h6">Мои объекты аренды</Typography>
                <Grid item xs></Grid>
                <Button disabled={props.loading} onClick={props.onCreate} >Добавить</Button>
            </Stack>
            <DataGrid
                components={{
                    NoRowsOverlay: NoRentalObjects
                }}
                rows={props.models}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                loading={props.loading}
                disableSelectionOnClick
                disableColumnFilter
                disableColumnMenu
            />
        </Stack>
    );
}