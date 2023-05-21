import { Stack, TextField, Tooltip, Checkbox } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { RoomVariant } from "../../../models";

interface Props {
    model: RoomVariant;
    loading: boolean;
    onDetailsChanged: (model: RoomVariant) => void;
}

export const RoomVariantDetailsComponent = function (props: Props): JSX.Element {
    const [freeCancelationPeriodEnabled, setFreeCancelationPeriodEnabled] = useState<boolean>(props.model?.freeCancellationPeriod !== undefined);

    return (
        <Stack spacing={2}>
            <Stack className="w-100" direction="row" spacing={3}>
                <Stack className="w-100" spacing={1}>
                    <TextField disabled={props.loading} label="Название" value={props.model.name} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, name: event.target.value }); }} />
                    <TextField disabled={props.loading} label="Описание" multiline rows={4} value={props.model.description} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, description: event.target.value }); }} />
                </Stack>
                <Stack spacing={1} direction="column">
                    <TextField disabled={props.loading} label="Цена" value={props.model.price} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, price: parseInt(event.target.value) }); }} />
                    <TextField disabled={props.loading} label="Всего номеров" value={props.model.count} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, count: parseInt(event.target.value) }); }} />
                    <TextField disabled={props.loading} label="Всего номеров свободно в данный момент" value={props.model.freeCount} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, freeCount: parseInt(event.target.value) }); }} />
                </Stack>
                <Stack spacing={1} direction="column">
                    <TextField disabled={props.loading} label="Ширина" value={props.model.width} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, width: parseInt(event.target.value) }); }} />
                    <TextField disabled={props.loading} label="Длина" value={props.model.length} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, length: parseInt(event.target.value) }); }} />
                    <TextField disabled={props.loading} label="Максимально гостей в номере" value={props.model.maxPersonsCount} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, maxPersonsCount: parseInt(event.target.value) }); }} />
                </Stack>
            </Stack>
            <Stack spacing={2} direction="row" alignItems="center">
                <Tooltip title="Период бесплатной отмены доступен?">
                    <Checkbox disabled={props.loading} checked={freeCancelationPeriodEnabled} onChange={(event, checked) => setFreeCancelationPeriodEnabled(checked)} />
                </Tooltip>
                <TextField disabled={props.loading && !freeCancelationPeriodEnabled} label="Период бесплатной отмены (дн.)" value={props.model.freeCancellationPeriod || ''} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, freeCancellationPeriod: parseInt(event.target.value) }); }} />
            </Stack>
        </Stack>
    );
}