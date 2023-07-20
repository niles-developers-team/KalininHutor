import { CurrencyRuble } from "@mui/icons-material";
import { Paper, Skeleton, Stack, Typography, Button, Grid, Divider } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { CharacteristicTypes, RoomVariant } from "../../models"

interface Props {
    roomVariant: RoomVariant;
    onShowDetails: () => void;
}

export const RoomVariantComponent = function (props: Props): JSX.Element {
    const { roomVariant, onShowDetails } = props;

    return (
        <Paper key={roomVariant.id}>
            {roomVariant.photos.length ? (
                <Carousel
                    height="55.55vw"
                    autoPlay={false}
                    animation="slide"
                    indicators={true}
                    stopAutoPlayOnHover={true}
                    navButtonsAlwaysInvisible={true}
                    cycleNavigation={true}
                >
                    {roomVariant.photos?.map(photo => <img style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px', width: '100%', height: '55.55vw', objectFit: 'cover' }} key={photo.id} src={`data:${photo.extension};base64,${photo.body}`}></img>)}
                </Carousel>
            ) : (
                <Paper variant="outlined">
                    <Skeleton variant="rectangular" width='100%' height="55.55vw" />
                </Paper>
            )}
            <Stack paddingX={2} spacing={1} paddingBottom={1}>
                <Stack direction="row" alignItems="center">
                    <Typography sx={{ flexGrow: 1 }} variant="h6">{roomVariant.name}</Typography>
                    <Typography >{roomVariant.price}</Typography>
                    <CurrencyRuble fontSize="small" />
                </Stack>
                <Button size="small" onClick={onShowDetails}>Подробнее</Button>
                <Grid container direction="row" spacing={1} rowSpacing={2}>
                    {roomVariant.characteristics.map(o => o.roomCharacteristic).map((rc, index) => (
                        <Stack direction="row" marginX={1} spacing={1}>
                            {CharacteristicTypes.getIcon(rc.type)}
                            <Typography>{rc.name}</Typography>
                            {roomVariant.characteristics.length > 1 && index < roomVariant.characteristics.length - 1 && <Divider orientation="vertical" variant="middle" />}
                        </Stack>
                    ))}
                </Grid>
            </Stack>
        </Paper>
    )
}