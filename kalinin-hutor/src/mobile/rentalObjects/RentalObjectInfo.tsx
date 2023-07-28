import { LocationOn, CurrencyRuble, NearMe } from "@mui/icons-material";
import { Paper, Skeleton, Stack, Typography, Grid, Chip, IconButton } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { RentalObject } from "../../models";
import pluralize from "plural-ru";
import { formatImgUrl } from "../../commonComponents";

interface Props {
    model: RentalObject;
    onShowVariants: (id: string) => void;
}

export const RentalObjectInfoSkeleton = function (): JSX.Element {
    return (
        <Paper>
            <Paper variant="outlined">
                <Skeleton variant="rectangular" width='100%' height="55.55vw" />
            </Paper>
            <Stack paddingX={2} paddingBottom={1}>
                <Stack direction="row" alignItems="center">
                    <Typography variant="h6" sx={{ flexGrow: 1 }}><Skeleton /></Typography>
                    <Typography variant="body2"><Skeleton /></Typography>
                </Stack>
                <Stack direction="row">
                    <LocationOn color="primary" fontSize="small" />
                    <Typography alignContent="center" variant="caption"><Skeleton /></Typography>
                </Stack>
            </Stack>
        </Paper>
    );
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
                        alt="NO_PHOTO"
                        key={photo.id}
                        style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px', width: '100%', height: '55.55vw', objectFit: 'cover' }}
                        src={formatImgUrl(photo)}></img>)}
                </Carousel>
            ) : (
                <Paper variant="outlined">
                    <Skeleton variant="rectangular" width='100%' height="55.55vw" />
                </Paper>
            )}
            <Stack paddingX={2} paddingBottom={1} spacing={1}>
                <Stack direction="row" alignItems="center">
                    <Typography variant="h6">{model.name}</Typography>
                    <Grid item xs />
                    <Typography variant="body2">От: {Math.min(...(model.roomVariants.map(o => o.price)) || 0)}</Typography>
                    <CurrencyRuble fontSize="small" />
                    <Typography variant="body2"> за ночь</Typography>
                </Stack>
                <Stack direction="row">
                    <LocationOn color="primary" fontSize="small" />
                    <Typography alignContent="center" variant="caption">{model.address}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                    {(model.feedback && model.feedback.length > 0) ?
                        <>
                            <Chip color="info" label={model.rate?.toFixed(1)} size="small" />
                            <Typography variant="body2">{model.feedback.length} {pluralize(model.feedback.length, 'отзыв', 'отзыва', 'отзывов')}</Typography>
                        </>
                        : <Typography color="GrayText" variant="body2">Ещё нет отзывов</Typography>
                    }
                    <Grid item xs />
                    {model.coordinates && <IconButton color="info" href={navigationRef} onClick={(event) => { event.stopPropagation(); }} target="_blank" size="small"><NearMe /></IconButton>}
                </Stack>
            </Stack>
        </Paper>
    );
}