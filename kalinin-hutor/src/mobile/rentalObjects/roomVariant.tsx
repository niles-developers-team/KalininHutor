import { CurrencyRuble } from "@mui/icons-material";
import { Paper, Skeleton, Stack, Typography, Button, Grid } from "@mui/material";
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
                    {roomVariant.photos?.map(photo => <img key={photo.id} style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={`data:${photo.extension};base64,${photo.body}`}></img>)}
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
                    {roomVariant.characteristics.map(o => o.roomCharacteristic).map(rc => (<Stack direction="row" marginX={1}>{CharacteristicTypes.getIcon(rc.type)}<Typography>{rc.name}</Typography></Stack>))}
                </Grid>
            </Stack>
        </Paper>
    )
}