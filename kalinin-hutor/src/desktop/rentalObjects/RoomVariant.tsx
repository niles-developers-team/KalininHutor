import { Add, CurrencyRuble, Remove } from "@mui/icons-material";
import { Button, Divider, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import pluralize from "plural-ru";
import { RoomVariant, RoomCharacteristic, CharacteristicTypes, EntityStatus } from "../../models";
import { formatImgUrl } from "../../commonComponents";

interface Props {
    model: RoomVariant;
    nightsCount: number;
    roomsCount: number;

    roomCharacteristics: RoomCharacteristic[];

    onRoomsCountChanged: (roomVariantId: string, newCount: number) => void;
    onSpecifyBedsClick: () => void;
}

export const RoomVariantInfoComponent = function (props: Props): JSX.Element {
    const {
        model,
        nightsCount,
        roomsCount,
        roomCharacteristics,
        onRoomsCountChanged,
        onSpecifyBedsClick
    } = props;

    if (model.id === undefined)
        return (<Typography>Не найден вариант номера</Typography>)

    return (
        <Stack spacing={1} key={model.id}>
            <Stack direction="row" alignItems="center">
                <Typography marginRight="1em"><b>{model.name}</b></Typography>
                <Typography>Цена за {nightsCount} ночей {model.price * nightsCount}</Typography>
                <CurrencyRuble fontSize="small" />
            </Stack>
            <Stack direction="row" spacing={2}>
                {
                    model.photos?.length > 0 ?
                        <img alt={model.photos[0].name} height={100} width={100} src={formatImgUrl(model.photos[0])}></img> :
                        <Skeleton variant="rectangular" width={100} height={100} />
                }
                <Stack spacing={1}>
                    <Stack direction="row" spacing={2} alignItems="center" divider={<Divider orientation="vertical" flexItem />}>
                        <Typography><b>Размер: </b> {model.width} X {model.length} кв.м.</Typography>
                        <Typography><b>Вмещает: </b> {model.maxPersonsCount} чел.</Typography>
                        {model.bedTypes?.length > 1 ? <Button size="small" variant="text" onClick={onSpecifyBedsClick} disabled={roomsCount === 0}>Уточнить кровати</Button> : null}
                    </Stack>
                    {model?.freeCancellationPeriod ? <Typography><b></b></Typography> : null}
                    <Typography>{model?.description}</Typography>
                    <Stack direction="row" spacing={1}>
                        {
                            model.characteristics.slice(0, 5).map((ch, index) => {
                                const characteristic = roomCharacteristics.find(o => o.id === ch.roomCharacteristicId);
                                return (
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        {CharacteristicTypes.getIcon(characteristic?.type)}
                                        <Typography variant="body2">{characteristic?.name}</Typography>
                                        {model.characteristics.length > 1 && index < 4 && <Divider orientation="vertical" variant="middle"/>}
                                    </Stack>
                                )
                            })
                        }
                        {
                            model.characteristics.length > 5
                                ? (<Button size="small" variant="text">Посмотреть все удобства</Button>)
                                : null
                        }
                    </Stack>
                    <Stack direction="row" alignItems="center">
                        <Typography>{pluralize(roomsCount, 'Выбрана', 'Выбрано')}</Typography>
                        <IconButton onClick={() => onRoomsCountChanged(model.id || '', roomsCount - 1)} disabled={roomsCount === 0}><Remove /></IconButton>
                        <Typography>{roomsCount}</Typography>
                        <IconButton onClick={() => onRoomsCountChanged(model.id || '', roomsCount + 1)}><Add /></IconButton>
                        <Typography>{pluralize(roomsCount, 'комната', 'комнаты', 'комнат')}</Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Stack >
    );
}