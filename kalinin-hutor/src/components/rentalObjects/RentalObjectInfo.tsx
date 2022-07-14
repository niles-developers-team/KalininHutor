import { CurrencyRuble, Favorite, FavoriteBorder, FavoriteOutlined } from "@mui/icons-material";
import { Stack, Paper, Skeleton, Typography, Button, Grid, IconButton } from "@mui/material";
import { RentalObject } from "../../models";

interface Props {
    model: RentalObject;
    onShowVariants: () => void;
}

export const RentalObjectShortInfoComponent = function (props: Props): JSX.Element {
    return (
        <Stack padding={2} spacing={2}>
            <Paper variant="outlined">
                <Skeleton variant="rectangular" width="100%" height={120} />
            </Paper>
            <Typography variant="h6">{props.model.name}</Typography>
            <Typography variant="caption">{props.model.address}</Typography>
            <Button onClick={props.onShowVariants}>Посмотреть варианты</Button>
        </Stack>
    );
}

export const RentalObjectShortInfoSkeleton = function (): JSX.Element {
    return (
        <Stack padding={2} spacing={2}>
            <Paper variant="outlined">
                <Skeleton variant="rectangular" width="100%" height={120} />
            </Paper>
            <Typography variant="h6"><Skeleton /></Typography>
            <Skeleton width="60%" />
        </Stack>
    );
}

export const RentalObjectDetailedInfoComponent = function (props: Props): JSX.Element {
    return (
        <Stack padding={2} spacing={2} direction="row" width="100%">
            <Paper variant="outlined">
                <Skeleton variant="rectangular" width={180} height={180} />
            </Paper>
            <Grid item xs>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton><FavoriteBorder /></IconButton>
                    <Typography variant="h6">{props.model.name}</Typography>

                </Stack>
                <Typography variant="caption">{props.model.address}</Typography>
                <Typography marginTop="1em">{props.model.description}</Typography>
            </Grid>
            <Grid direction="column" alignItems="end">
                <Stack alignItems="end">
                    <Typography variant="caption" color="GrayText">{props.model.bestDemand?.nightsCount} ночей, {props.model.bestDemand?.adultsCount} взрослых, {props.model.bestDemand?.childsCount} детей</Typography>
                    <Stack direction="row" alignItems="center">
                        <Typography variant="h5">{props.model.bestDemand?.price}</Typography>
                        <CurrencyRuble />
                    </Stack>
                </Stack>
                <Button onClick={props.onShowVariants}>Посмотреть варианты</Button>
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
                <Typography variant="h6"><Skeleton /></Typography>
                <Typography variant="caption"><Skeleton /></Typography>
                <Typography marginTop="1em"><Skeleton /></Typography>
                <Typography><Skeleton /></Typography>
                <Typography><Skeleton width="60%" /></Typography>
            </Grid>
            <Grid direction="column" alignItems="end">
                <IconButton disabled><FavoriteBorder /></IconButton>
                <Button disabled>Посмотреть варианты</Button>
            </Grid>
        </Stack>
    );
}