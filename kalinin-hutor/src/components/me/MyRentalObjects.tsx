import { Button, CircularProgress, Grid, IconButton, Stack, Typography } from "@mui/material";
import { RentalObject } from "../../models";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Props {
    models: RentalObject[];
    loading: boolean;
    onCreate: () => void;
}

export const MyRentalObjectsComponent = function (props: Props): JSX.Element {
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Название' },
        { field: 'description', headerName: 'Описание' },
        { field: 'address', headerName: 'Адрес' },
    ];
    return (
        <Stack spacing={2}>
            <Stack direction="row">
                <Typography color="GrayText" variant="h6">Мои объекты аренды</Typography>
                <Grid item xs></Grid>
                {props.loading
                    ? <CircularProgress size={36} />
                    : <Button onClick={props.onCreate} >Добавить</Button>
                }
            </Stack>
            <DataGrid
                rows={props.models}
                columns={columns}
                pageSize={5}
                loading={props.loading}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick 
                />
        </Stack>
    );
}