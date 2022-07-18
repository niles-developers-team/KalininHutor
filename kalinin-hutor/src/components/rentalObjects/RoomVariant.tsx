import { Add, AspectRatio, CurrencyRuble, Remove } from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { CharacteristicTypes, RoomCharacteristic, RoomVariant } from "../../models";

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
        <Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6">{model.name}</Typography>
                <Typography variant="subtitle2">Цена за {nightsCount} ночей {model.price * nightsCount}<CurrencyRuble /></Typography>
                <Typography variant="caption">Вмещает {model.maxPersonsCount} гостей</Typography>
                <Typography variant="caption"><AspectRatio />{model.width} X {model.length}</Typography>
                {model.bedTypes?.length > 1 ? <Button onClick={onSpecifyBedsClick} disabled={roomsCount === 0}>Уточнить кровати</Button> : null}
            </Stack>
            <Stack direction="row">
                {
                    model.characteristics.slice(0, 5).map(ch => {
                        const characteristic = roomCharacteristics.find(o => o.id === ch.roomCharacteristicId);
                        return (
                            <Stack direction="row">
                                {CharacteristicTypes.getIcon(characteristic?.type)}
                                <Typography key={ch.id}>{characteristic?.name}</Typography>
                            </Stack>
                        )
                    })
                }
                {
                    model.characteristics.length > 5
                        ? (<Button>Посмотреть все удобства</Button>)
                        : null
                }
            </Stack>
            <Stack direction="row" alignItems="center">
                <Typography>Выбран</Typography>
                <IconButton onClick={() => onRoomsCountChanged(model.id || '', roomsCount - 1)} disabled={roomsCount === 0}><Remove /></IconButton>
                <Typography>{roomsCount}</Typography>
                <IconButton onClick={() => onRoomsCountChanged(model.id || '', roomsCount + 1)}><Add /></IconButton>
                <Typography>комнат</Typography>
            </Stack>
        </Stack >
    );
}