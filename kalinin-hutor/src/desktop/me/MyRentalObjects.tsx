import { Edit, Delete } from "@mui/icons-material";
import { Button, Card, Grid, IconButton, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridOverlay } from "@mui/x-data-grid";
import { RentalObject } from "../../models";

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
        <Stack spacing={2}>
            <Stack direction="row">
                <Typography color="GrayText" variant="h6">Мои объекты аренды</Typography>
                <Grid item xs></Grid>
                <Button disabled={props.loading} onClick={props.onCreate} >Добавить</Button>
            </Stack>
            <Card style={{ height: '100%' }}>
                <DataGrid
                    autoHeight
                    slots={{
                        noRowsOverlay: NoRentalObjects
                    }}
                    rows={props.models}
                    columns={columns}
                    pageSizeOptions={[5]}
                    loading={props.loading}
                    disableColumnFilter
                    disableColumnMenu
                />
            </Card>
        </Stack>
    );
}