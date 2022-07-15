import { CurrencyRuble } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import { CharacteristicTypes, RoomCharacteristic, RoomVariant } from "../../models";

interface Props {
    model: RoomVariant;
    nightsCount: number;

    roomCharacteristics: RoomCharacteristic[];
}

export const RoomVariantInfoComponent = function (props: Props): JSX.Element {
    const { model, nightsCount, roomCharacteristics } = props;

    return (
        <Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6">{model.name}</Typography>
                <Typography variant="subtitle2">Цена за {nightsCount} ночей {model.price * nightsCount}<CurrencyRuble /></Typography>
                <Typography variant="subtitle2">Вмещает {model.maxPersonsCount} гостей</Typography>
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
            <Stack>
                
            </Stack>
        </Stack>
    );
}