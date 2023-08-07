import { LocationOn, CurrencyRuble, NearMe, FavoriteBorder } from "@mui/icons-material";
import { Paper, Skeleton, Stack, Typography, Grid, Chip, IconButton, Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { CharacteristicTypes, RentalObject, RoomCharacteristic } from "../../models";
import pluralize from "plural-ru";
import { formatImgUrl } from "../../commonComponents";

interface Props {
    model: RentalObject;
    onShowVariants: (id: string) => void;
}

export const RentalObjectInfoComponent = function (props: Props): JSX.Element {
    const { model, onShowVariants } = props;

    if (!model) {
        return (<Typography variant="subtitle1">Ошибка при загрузке базы отдыха или дачи</Typography>)
    }

    const navigationRef = `https://yandex.ru/navi/?whatshere%5Bpoint%5D=${model.coordinates?.longitude}%2C${model.coordinates?.latitude}&whatshere%5Bzoom%5D=18&lang=ru&from=navi`;

    return (
        <Paper key={model.id} onClick={() => onShowVariants(model.id || '')}>
            {model.photos.length ? (
                <Carousel
                    height="55.55vw"
                    autoPlay={false}
                    animation="slide"
                    indicators={true}
                    stopAutoPlayOnHover={true}
                    navButtonsAlwaysInvisible={true}
                    cycleNavigation={true}
                >
                    {model.photos?.map(photo => <img
                        alt={photo.name}
                        key={photo.id}
                        style={{ width: '100%', height: '55.55vw' }}
                        src={formatImgUrl(photo)}></img>)}
                </Carousel>
            ) : (
                <Skeleton variant="rectangular" width='100%' height="55.55vw" />
            )}
            <Stack paddingX={2} paddingBottom={1} spacing={1}>
                <Stack direction="row" alignItems="center">
                    <Typography variant="h6">{model.name}</Typography>
                    <Grid item xs />
                    <Typography variant="body2">От: {Math.min(...(model.roomVariants.map(o => o.price)) || 0)}</Typography>
                    <CurrencyRuble fontSize="small" />
                    <Typography variant="body2"> за ночь</Typography>
                </Stack>
                <Stack direction="row" alignItems="center">
                    <LocationOn color="primary" fontSize="small" />
                    <Typography alignContent="center" variant="caption">{model.address}</Typography>
                    <Grid item xs />
                    {model.coordinates && <IconButton color="info" href={navigationRef} onClick={(event) => { event.stopPropagation(); }} target="_blank" size="small"><NearMe /></IconButton>}
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    {(model.feedback && model.feedback.length > 0) ?
                        <>
                            <Chip color="info" label={model.rate?.toFixed(1)} size="small" />
                            <Typography variant="body2">{model.feedback.length} {pluralize(model.feedback.length, 'отзыв', 'отзыва', 'отзывов')}</Typography>
                        </>
                        : <Typography color="GrayText" variant="body2">Ещё нет отзывов</Typography>
                    }
                </Stack>
            </Stack>
        </Paper>
    );
}

interface DetailsProps {
    model: RentalObject;
    openDescription: () => void;
    openAllServices: () => void;
}

export const RentalObjectDetailsComponent = function (props: DetailsProps): JSX.Element {
    const { model } = props;

    function onlyUnique(value: RoomCharacteristic, index: number, array: RoomCharacteristic[]) {
        return array.indexOf(value) === index;
    }

    const roCharacteristics = model.roomVariants.map(o => o.characteristics).reduce((prev, curr) => prev.concat(curr), []).map(o => o.roomCharacteristic).filter(onlyUnique);
    const navigationRef = `https://yandex.ru/navi/?whatshere%5Bpoint%5D=${model.coordinates?.longitude}%2C${model.coordinates?.latitude}&whatshere%5Bzoom%5D=18&lang=ru&from=navi`;

    return (
        <Stack spacing={1} paddingX={2}>
            <Stack direction="row" alignItems="center" paddingTop={2}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>{model.name}</Typography>
                <IconButton disabled><FavoriteBorder /></IconButton>
            </Stack>
            {
                (model.feedback && model.feedback.length > 0) ?
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Chip color="info" label={model.rate?.toFixed(1)} size="small" />
                        <Typography variant="body2">{model.feedback.length} {pluralize(model.feedback.length, 'отзыв', 'отзыва', 'отзывов')}</Typography>
                    </Stack>
                    : <Typography color="GrayText" variant="body2">Ещё нет отзывов</Typography>
            }
            {
                model.photos?.length > 0 ?
                    <Carousel
                        height="55.55vw"
                        autoPlay={false}
                        animation="slide"
                        indicators={true}
                        navButtonsAlwaysInvisible={true}
                        cycleNavigation={true}
                    >
                        {model.photos?.map(photo => <img
                            key={photo.id}
                            style={{ width: '100%', height: '55.55vw' }}
                            src={formatImgUrl(photo)} />)}
                    </Carousel>
                    :
                    <Paper variant="outlined">
                        <Skeleton variant="rectangular" width='100%' height="55.55vw" />
                    </Paper>
            }
            <Stack spacing={1}>
                <Typography variant="h6">Описание</Typography>
                <Stack direction="row" alignItems="center">
                    <LocationOn color="primary" fontSize="small" />
                    <Typography sx={{ flexGrow: 1 }} alignContent="center" variant="body1">{model.address}</Typography>
                    {model.coordinates && <IconButton color="info" href={navigationRef} onClick={(event) => { event.stopPropagation(); }} target="_blank" size="small"><NearMe /></IconButton>}
                </Stack>
                <Button size="small" onClick={props.openDescription}>Читать описание</Button>
                <Typography variant="h6">Услуги и сервисы</Typography>
            </Stack>
            <List>
                {roCharacteristics.slice(0, 5).map(ch => (
                    <ListItem key={`item-${ch.id}`}>
                        <ListItemIcon>
                            {CharacteristicTypes.getIcon(ch.type)}
                        </ListItemIcon>
                        <ListItemText primary={ch.name} />
                    </ListItem>
                ))}
            </List>
            {roCharacteristics.length > 5 && <Button size="small" onClick={props.openAllServices}>Все услуги</Button>}
        </Stack>
    );
}