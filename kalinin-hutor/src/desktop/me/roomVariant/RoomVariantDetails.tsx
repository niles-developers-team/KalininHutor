import { Stack, TextField, Card, CardContent, Typography, InputAdornment } from "@mui/material";
import { ChangeEvent } from "react";
import { RoomVariant } from "../../../models";

interface Props {
    model: RoomVariant;
    loading: boolean;
    onDetailsChanged: (model: RoomVariant) => void;
}

export const RoomVariantDetailsComponent = function (props: Props): JSX.Element {

    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Stack className="w-100" spacing={2}>
                        <Stack>
                            <Typography variant="body2" color="GrayText">Название</Typography>
                            <TextField size="small" disabled={props.loading} value={props.model.name} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, name: event.target.value }); }} />
                        </Stack>
                        <Stack>
                            <Typography variant="body2" color="GrayText">Описание</Typography>
                            <TextField size="small" disabled={props.loading} multiline rows={4} value={props.model.description} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, description: event.target.value }); }} />
                        </Stack>
                        <Typography variant="body1" color="GrayText">Прайс</Typography>
                        <Stack spacing={1} direction="row">
                            <Stack>
                                <Typography variant="body2" color="GrayText">Цена</Typography>
                                <TextField size="small" disabled={props.loading} value={props.model.price} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, price: parseInt(event.target.value) }); }} />
                            </Stack>
                            <Stack>
                                <Typography variant="body2" color="GrayText">Всего номеров</Typography>
                                <TextField size="small" disabled={props.loading} value={props.model.count} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, count: parseInt(event.target.value) }); }} />
                            </Stack>
                            <Stack>
                                <Typography variant="body2" color="GrayText">Свободно в данный момент</Typography>
                                <TextField size="small" disabled={props.loading} value={props.model.freeCount} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, freeCount: parseInt(event.target.value) }); }} />
                            </Stack>
                            <Stack>
                                <Typography variant="body2" color="GrayText">Период бесплатной отмены</Typography>
                                <TextField size="small" disabled={props.loading} InputProps={{ endAdornment: <InputAdornment position="end">дн.</InputAdornment> }} value={props.model.freeCancellationPeriod || ''} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, freeCancellationPeriod: parseInt(event.target.value) }); }} />
                            </Stack>
                        </Stack>
                        <Typography variant="body1" color="GrayText">Вместимость</Typography>
                        <Stack spacing={1} direction="row">
                            <Stack>
                                <Typography variant="body2" color="GrayText">Ширина</Typography>
                                <TextField size="small" disabled={props.loading} value={props.model.width} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, width: parseInt(event.target.value) }); }} />
                            </Stack>
                            <Stack>
                                <Typography variant="body2" color="GrayText">Длина</Typography>
                                <TextField size="small" disabled={props.loading} value={props.model.length} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, length: parseInt(event.target.value) }); }} />
                            </Stack>
                            <Stack>
                                <Typography variant="body2" color="GrayText">Максимально гостей</Typography>
                                <TextField size="small" disabled={props.loading} value={props.model.maxPersonsCount} onChange={(event: ChangeEvent<HTMLInputElement>) => { props.onDetailsChanged({ ...props.model, maxPersonsCount: parseInt(event.target.value) }); }} />
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}