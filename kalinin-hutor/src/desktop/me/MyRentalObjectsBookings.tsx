import { CurrencyRuble, Info } from "@mui/icons-material";
import { Button, Card, IconButton, Stack, Typography } from "@mui/material";
import { GridOverlay, DataGrid, GridColDef } from "@mui/x-data-grid";
import { Booking } from "../../models";

interface Props {
    bookings: Booking[];
    loading: boolean;
    onBookingApprove: (booking: Booking) => void;
    onShowInfo: (booking: Booking) => void;
}

function NoBookings(): JSX.Element {
    return (
        <GridOverlay>
            <Typography color="GrayText" variant="subtitle2">Вы еще не зарегистрировали объект аренды</Typography>
        </GridOverlay>
    );
}

export const MyRentalObjectsBookingsComponent = function (props: Props): JSX.Element {
    const { bookings, onBookingApprove, onShowInfo } = props;

    const columns: GridColDef<Booking>[] = [
        {
            field: 'rentalObject', sortable: false, headerName: 'Объект аренды', flex: 1, renderCell: ({ row: o }) => (
                <Typography><a href={`/me/rental-objects/${o.rentalObject.id}`}>{o.rentalObject?.name}</a></Typography>
            )
        },
        {
            field: 'tenant', sortable: false, headerName: 'Гость', flex: 1, renderCell: ({ row: o }) => (
                <Stack>
                    <Typography>{o.tenant.name} {o.tenant.lastname}</Typography>
                    <Typography color="GrayText" variant="caption">{o.tenant.phoneNumber}</Typography>
                </Stack>
            )
        },
        {
            field: 'total', type: "number", headerName: 'Сумма', renderCell: ({ row: o }) => (
                <Stack direction="row">
                    <Typography>{o.total}</Typography>
                    <CurrencyRuble fontSize="small" />
                </Stack>
            )
        },
        {
            field: 'actions', type: 'actions', sortable: false, headerName: '', minWidth: 180, renderCell: (o) => (
                <Stack direction="row">
                    <Button onClick={() => onBookingApprove(o.row)}>Подтвердить</Button>
                    <IconButton onClick={() => onShowInfo(o.row)}><Info /></IconButton>
                </Stack>
            )
        }
    ];

    return (
        <Stack spacing={2}>
            <Typography color="GrayText" variant="h6">Не подтвержденные бронирования</Typography>
            <Card style={{ height: '100%' }}>
                <DataGrid
                    autoHeight
                    components={{
                        NoRowsOverlay: NoBookings
                    }}
                    rows={bookings}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    loading={props.loading}
                    disableSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                />
            </Card>
        </Stack>
    );
}