import { Circle, MarkEmailRead } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { GridColDef, DataGrid, GridOverlay } from "@mui/x-data-grid";
import moment from "moment";
import { Notification } from "../../../models"

interface Props {
    notifications: Notification[];
    markAsRead: (id: string) => void;
}

function NoBookings(): JSX.Element {
    return (
        <GridOverlay>
            <Typography color="GrayText" variant="subtitle2">У вас еще нет уведомлений</Typography>
        </GridOverlay>
    );
}

export const MyNotificationsComponent = function (props: Props): JSX.Element {
    const columns: GridColDef<Notification>[] = [
        {
            field: 'type', headerName: 'Тип', sortable: false, renderCell: ({ row: o }) => {
                return (<Circle color={o.variant} />);
            }
        },
        { field: 'createdAt', headerName: 'Дата', renderCell: ({ row: o }) => moment(o.createdAt).format('DD.MM.yy') },
        { field: 'message', headerName: 'Уведомление', flex: 1 },
        {
            field: 'actions', type: 'actions', sortable: false, headerName: '', width: 100, renderCell: ({ row: o }) => (
                <Stack direction="row">
                    <IconButton onClick={() => props.markAsRead(o.id)}><MarkEmailRead /></IconButton>
                </Stack>
            )
        }
    ];

    return (
        <Stack spacing={2} style={{ height: 400 }}>
            <Stack direction="row">
                <Typography color="GrayText" variant="h6">Уведомления</Typography>
            </Stack>
            <DataGrid
                components={{
                    NoRowsOverlay: NoBookings
                }}
                rows={props.notifications}
                columns={columns}
                pageSize={5}
                disableSelectionOnClick
                disableColumnFilter
                disableColumnMenu
            />
        </Stack>
    );
}