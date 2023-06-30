import { CurrencyRuble, FavoriteBorder } from "@mui/icons-material";
import { Stack, Paper, Skeleton, Typography, Button, Grid, IconButton } from "@mui/material";
import { useState, CSSProperties } from "react";
import Carousel from "react-material-ui-carousel";
import { RentalObject } from "../../models";

interface Props {
    model: RentalObject;
    onShowVariants: (id: string) => void;
}

const imageStyle: CSSProperties = {
    objectFit: "contain"
};

export const RentalObjectShortInfoComponent = function (props: Props): JSX.Element {
    const { model, onShowVariants } = props;

    const [sliding, setSliding] = useState<boolean>(false);

    if (!model) {
        return (<Typography variant="subtitle1">Ошибка при загрузке базы отдыха или дачи</Typography>)
    }

    return (
        <Paper>
            {model.photos.length ? (
                <Grid
                style={{height: '200px', maxHeight: '200px'}}
                    onMouseEnter={() => setSliding(true)}
                    onMouseLeave={() => setSliding(false)}>
                    <Carousel
                        autoPlay={sliding}
                        animation="slide"
                        indicators={false}
                        stopAutoPlayOnHover={false}
                        navButtonsAlwaysInvisible={true}
                        cycleNavigation={true}
                    >
                        {model.photos?.map(photo => <img style={{ width: '100%', objectFit: 'contain', maxHeight: '200px' }}src={`data:${photo.extension};base64,${photo.body}`}></img>)}
                    </Carousel>
                </Grid>
            ) : (
                <Paper variant="outlined">
                    <Skeleton variant="rectangular" width={200} height={200} />
                </Paper>
            )}
            <Stack paddingX={2} paddingBottom={1} spacing={2}>
                <Typography variant="h6">{model.name}</Typography>
                <Typography variant="caption">{model.address}</Typography>
                <Button onClick={() => onShowVariants(model.id || '')}>Посмотреть варианты</Button>
            </Stack>
        </Paper>
    );
}

export const RentalObjectShortInfoSkeleton = function (): JSX.Element {
    return (
        <Stack padding={2} spacing={2}>
            <Paper variant="outlined">
                <Skeleton variant="rectangular" width="100%" height={200} />
            </Paper>
            <Typography variant="h6"><Skeleton /></Typography>
            <Skeleton width="60%" />
        </Stack>
    );
}

export const RentalObjectDetailedInfoComponent = function (props: Props): JSX.Element {
    const { model, onShowVariants } = props;

    if (!model || !model.id) {
        return (<Typography variant="subtitle1">Ошибка при загрузке базы отдыха или дачи</Typography>)
    }

    return (
        <Stack padding={2} spacing={2} direction="row" width="100%">
            {model.photos && model.photos.length ?
                <img height={200} width={200} style={imageStyle} src={`data:${model.photos[0].extension};base64,${model.photos[0].body}`}></img> :
                <Skeleton variant="rectangular" width={200} height={200} />
            }
            <Grid item xs>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h6">{model.name}</Typography>
                    <IconButton><FavoriteBorder /></IconButton>
                </Stack>
                <Typography variant="caption" color="GrayText">{model.address}</Typography>
                <Typography marginTop="1em">{model.description}</Typography>
            </Grid>
            <Grid direction="column" alignItems="end">
                <Stack alignItems="end" spacing={1}>
                    <Typography variant="caption" color="GrayText">{model.bestDemand?.nightsCount} ночей, {model.bestDemand?.adultsCount} взрослых, {model.bestDemand?.childsCount} детей</Typography>
                    <Stack direction="row" alignItems="center">
                        <Typography variant="h5">{model.bestDemand?.price}</Typography>
                        <CurrencyRuble />
                    </Stack>
                </Stack>
                <Button onClick={() => onShowVariants(model.id || '')}>Посмотреть варианты</Button>
            </Grid>
        </Stack>
    );
}

export const RentalObjectDetailedInfoSkeleton = function (): JSX.Element {
    return (
        <Stack padding={2} spacing={2} direction="row" width="100%">
            <Paper variant="outlined">
                <Skeleton variant="rectangular" width={180} height={180} />
            </Paper>
            <Grid item xs>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h6"><Skeleton /></Typography>
                    <IconButton disabled><FavoriteBorder /></IconButton>
                </Stack>
                <Typography variant="caption" color="GrayText"><Skeleton /></Typography>
                <Typography marginTop="1em"><Skeleton /></Typography>
                <Typography><Skeleton /></Typography>
                <Typography><Skeleton width="60%" /></Typography>
            </Grid>
            <Grid direction="column" alignItems="end">
                <Button disabled>Посмотреть варианты</Button>
            </Grid>
        </Stack>
    );
}