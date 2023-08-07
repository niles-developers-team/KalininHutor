import { CurrencyRuble, FavoriteBorder, LocationOn, NearMe } from "@mui/icons-material";
import { Stack, Paper, Skeleton, Typography, Button, Grid, IconButton, Chip, Divider } from "@mui/material";
import { useState } from "react";
import Carousel from "react-material-ui-carousel";
import { RentalObject, RoomCharacteristic } from "../../models";
import pluralize from "plural-ru";
import { formatImgUrl, imageStyle } from "../../commonComponents";

interface Props {
    model: RentalObject;
    onShowVariants: (id: string) => void;
}

export const RentalObjectShortInfoComponent = function (props: Props): JSX.Element {
    const { model, onShowVariants } = props;

    const [sliding, setSliding] = useState<boolean>(false);

    if (!model) {
        return (<Typography variant="subtitle1">Ошибка при загрузке базы отдыха или дачи</Typography>)
    }

    const navigationRef = `https://yandex.ru/navi/?whatshere%5Bpoint%5D=${model.coordinates?.longitude}%2C${model.coordinates?.latitude}&whatshere%5Bzoom%5D=18&lang=ru&from=navi`;

    return (
        <Grid minWidth={210}>
            <Paper key={model.id}>
                {model.photos.length ? (
                    <Grid
                        onMouseEnter={() => setSliding(true)}
                        onMouseLeave={() => setSliding(false)}>
                        <Carousel
                            height="200px"
                            autoPlay={sliding}
                            animation="slide"
                            indicators={false}
                            stopAutoPlayOnHover={false}
                            navButtonsAlwaysInvisible={true}
                            cycleNavigation={true}
                        >
                            {model.photos?.map(photo => <img alt={photo.name} key={photo.id}
                                style={{ width: '100%', height: '100%', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', objectFit: 'cover' }}
                                src={formatImgUrl(photo)}></img>)}
                        </Carousel>
                    </Grid>
                ) : (
                    <Paper variant="outlined">
                        <Skeleton variant="rectangular" width='100%' height={200} />
                    </Paper>
                )}
                <Stack paddingX={2} paddingBottom={1} spacing={2}>
                    <Typography variant="h6">{model.name}</Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {(model.feedback && model.feedback.length > 0) ?
                            <>
                                <Chip color="info" label={model.rate?.toFixed(1)} size="small" />
                                <Typography sx={{ flexGrow: 1 }} variant="body2">{model.feedback.length} {pluralize(model.feedback.length, 'отзыв', 'отзыва', 'отзывов')}</Typography>
                            </>
                            : <Typography sx={{ flexGrow: 1 }} color="GrayText">Ещё нет отзывов</Typography>
                        }
                        {model.coordinates && <IconButton sx={{ padding: 0 }} color="info" href={navigationRef} onClick={(event) => { event.stopPropagation(); }} target="_blank" size="small"><NearMe /></IconButton>}
                    </Stack>
                    <Typography variant="caption">{model.address}</Typography>
                    <Button size="small" onClick={() => onShowVariants(model.id || '')}>Посмотреть варианты</Button>
                </Stack>
            </Paper>
        </Grid>
    );
}

export const RentalObjectShortInfoSkeleton = function (): JSX.Element {
    return (
        <Stack width="100%">
            <Paper>
                <Skeleton variant="rectangular" width="100%" height={200} />
                <Stack paddingX={2} paddingBottom={1} spacing={2}>
                    <Typography variant="h6"><Skeleton width='100%' /></Typography>
                    <Typography variant="caption"><Skeleton width='100%' /></Typography>
                    <Skeleton width='100%' variant="rounded"><Button fullWidth size="small"></Button></Skeleton>
                </Stack>
            </Paper>
        </Stack>
    );
}

export const RentalObjectDetailedInfoComponent = function (props: Props): JSX.Element {
    const { model, onShowVariants } = props;

    if (!model || !model.id) {
        return (<Typography variant="subtitle1">Ошибка при загрузке базы отдыха или дачи</Typography>)
    }

    function onlyUnique(value: RoomCharacteristic, index: number, array: RoomCharacteristic[]) {
        return array.indexOf(value) === index;
    }

    const roCharacteristics = model.roomVariants.map(o => o.characteristics).reduce((prev, curr) => prev.concat(curr), []).map(o => o.roomCharacteristic).filter(onlyUnique);
    const navigationRef = `https://yandex.ru/navi/?whatshere%5Bpoint%5D=${model.coordinates?.longitude}%2C${model.coordinates?.latitude}&whatshere%5Bzoom%5D=18&lang=ru&from=navi`;

    return (
        <Stack padding={2} spacing={2} direction="row">
            {model.photos && model.photos.length ?
                <img alt={model.photos[0].name} height={200} width={200} style={imageStyle} src={formatImgUrl(model.photos[0])}></img> :
                <Skeleton variant="rectangular" width={200} height={200} />
            }
            <Grid item xs style={{ height: '100%' }}>
                <Stack spacing={1} style={{ height: '100%' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h6">{model.name}</Typography>
                        <IconButton disabled><FavoriteBorder /></IconButton>
                        {model.coordinates && <IconButton color="info" href={navigationRef} onClick={(event) => { event.stopPropagation(); }} target="_blank" size="small"><NearMe /></IconButton>}
                    </Stack>
                    {(model.feedback && model.feedback.length > 0) ?
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Chip color="info" label={model.rate?.toFixed(1)} size="small" />
                            <Typography variant="body2">{model.feedback.length} {pluralize(model.feedback.length, 'отзыв', 'отзыва', 'отзывов')}</Typography>
                        </Stack>
                        : <Typography color="GrayText">Ещё нет отзывов</Typography>
                    }
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationOn color="disabled" />
                        <Typography variant="body2" color="GrayText">{model.address}</Typography>
                    </Stack>
                    <Grid item xs />
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {roCharacteristics.slice(0, 5).map((ch, index) => (
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body2">{ch.name}</Typography>
                                {index < 4 && roCharacteristics.length > 1 && <Divider variant="middle" orientation="vertical" />}
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
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