import { Stack, Typography, Skeleton, Divider, Chip } from "@mui/material";
import { BedTypes, BookingRoomVariant, CharacteristicTypes, RoomCharacteristic, RoomVariant } from "../../models";
import { formatImgUrl } from "../../commonComponents";

interface Props {
    bookingRoomVariant: BookingRoomVariant;
    roomVariant: RoomVariant;
    characteristics: RoomCharacteristic[];
    isLast: boolean;
}

export const BookingRoomVariantInfo = function (props: Props): JSX.Element {
    const {
        bookingRoomVariant,
        roomVariant,
        characteristics,
        isLast
    } = props;
    return (
        <Stack>
            <Typography><b>{bookingRoomVariant.roomsCount} X {roomVariant?.name}</b></Typography>
            <Stack paddingY=".5em" direction="row" spacing={2}>
                {
                    roomVariant.photos.length > 0 ?
                        <img alt={roomVariant.photos[0].name} height={100} width={100} src={formatImgUrl(roomVariant.photos[0])}></img> :
                        <Skeleton variant="rectangular" width={100} height={100} />
                }
                <Stack>
                    <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                        <Typography><b>Размер: </b> {roomVariant?.width} X {roomVariant?.length} кв.м.</Typography>
                        <Typography><b>Вмещает: </b> {roomVariant?.maxPersonsCount} чел.</Typography>
                        <Stack direction="row" spacing={1}>
                            <Typography><b>Кровать: </b></Typography>
                            {BedTypes.getIcon(bookingRoomVariant?.bedType)}
                            <Typography>{BedTypes.getDescription(bookingRoomVariant?.bedType)}</Typography>
                        </Stack>
                    </Stack>
                    {roomVariant?.freeCancellationPeriod ? <Typography><b></b></Typography> : null}
                    <Typography>{roomVariant?.description}</Typography>
                    <Stack direction="row" spacing={1}>
                        {roomVariant?.characteristics.map(ch => {
                            const characteristic = characteristics?.find(o => o.id === ch.roomCharacteristicId);
                            return (
                                <Chip icon={CharacteristicTypes.getIcon(characteristic?.type)} label={characteristic?.name} variant="outlined"></Chip>
                            );
                        })}
                    </Stack>
                </Stack>
            </Stack>
            {!isLast ? <Divider flexItem /> : null}
        </Stack>
    )
}