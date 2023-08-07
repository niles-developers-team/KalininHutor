import { Stack, Typography, IconButton, Paper, Skeleton, Button, Grid, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material"
import { ArrowBack, CurrencyRuble, FavoriteBorder, LocationOn, NearMe } from "@mui/icons-material"
import { useNavigate } from "react-router-dom";
import { MobileAppBarComponent } from "../common";


export const RentalObjectInfoSkeleton = function (): JSX.Element {
    let min = 40;
    let max = 70;
    return (
        <Paper>
            <Paper variant="outlined">
                <Skeleton variant="rectangular" width='100%' height="55.55vw" />
            </Paper>
            <Stack paddingX={2} paddingBottom={1}>
                <Stack direction="row" alignItems="center">
                    <Skeleton  sx={{ fontSize: '1.25rem' }} width={`${(Math.random() * (+max - +min) + +min)}%`} />
                    <Grid xs />
                    <Skeleton width="25%" />
                </Stack>
                <Stack direction="row" alignItems="center">
                    <LocationOn color="disabled" fontSize="small" />
                    <Skeleton variant="text" width="30%" />
                    <Grid item xs />
                    <IconButton color="info" disabled size="small"><NearMe /></IconButton>
                </Stack>
                <Skeleton variant="text" width="30%" sx={{ fontSize: '1rem', lineHeight: "1.5" }} />
            </Stack>
        </Paper>
    );
}

export const RentalObjectSkeleton = function (): JSX.Element {
    const navigate = useNavigate();
    function handleGoBack() { navigate(`/`); }

    const characteristicsSkeletons = Array.from(new Array(3)).map((i) => {
        let min = 30;
        let max = 80;
        return (
            <ListItem key={`item-${i}`}>
                <ListItemIcon>
                    <Skeleton variant="circular" width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary={<Skeleton variant="text" width={`${(Math.random() * (+max - +min) + +min)}%`} />} />
            </ListItem>
        )
    });

    const roomVariantSkeletons = Array.from(new Array(3)).map((i) => {
        const characteristicsSkeletons = Array.from(new Array(3)).map((index) => {
            let min = 10;
            let max = 40;
            return (<>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" width={`${(Math.random() * (+max - +min) + +min)}%`} />
                {index < 3 && <Divider orientation="vertical" variant="middle" />}
            </>
            )
        });
        return (<Paper key={i}>
            <Skeleton variant="rectangular" width='100%' height="55.55vw" />
            <Stack direction="row" alignItems="center" justifyContent="center" marginTop={2}>
                <Skeleton variant="circular" width={10} height={10} />
            </Stack>
            <Stack paddingX={2} spacing={1} paddingBottom={1}>
                <Stack direction="row" alignItems="center">
                    <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} width="50%" />
                    <Grid xs />
                    <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} width="15%" />
                </Stack>
                <Button disabled size="small">Подробнее</Button>
                <Stack direction="row" alignItems="center" marginX={1} spacing={1}>
                    {characteristicsSkeletons}
                </Stack>
            </Stack>
        </Paper>
        )
    });

    return (
        <Stack>
            <MobileAppBarComponent leftActionButton={(<IconButton onClick={handleGoBack}><ArrowBack /></IconButton>)} />
            <Stack spacing={1} paddingX={2}>
                <Stack direction="row" alignItems="center" paddingTop={2} >
                    <Skeleton variant="text" sx={{ flexGrow: 1, fontSize: '1.25rem' }} />
                    <IconButton disabled><FavoriteBorder /></IconButton >
                </Stack>
                <Skeleton variant="text" width="30%" sx={{ fontSize: '1rem', lineHeight: "1.5" }} />
                <Skeleton variant="rectangular" width='100%' height="55.55vw" />
                <Stack direction="row" alignItems="center" justifyContent="center" marginTop={2}>
                    <Skeleton variant="circular" width={10} height={10} />
                </Stack>
                <Typography variant="h6" color="GrayText"> Описание </Typography>
                <Stack direction="row" alignItems="center" >
                    <LocationOn color="disabled" fontSize="small" />
                    <Skeleton variant="text" width="50%" sx={{ fontSize: '1rem' }} />
                </Stack>
                <Button size="small" disabled> Читать описание </Button>
                <Typography variant="h6" color="GrayText"> Услуги и сервисы </Typography>
                {characteristicsSkeletons}
                <Typography variant="h6" color="GrayText">Варианты размещения</Typography>
                {roomVariantSkeletons}
            </Stack>
        </Stack>
    );
}