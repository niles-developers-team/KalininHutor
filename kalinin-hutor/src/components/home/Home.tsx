import { Add, CalendarMonth, People, Remove, Search } from "@mui/icons-material";
import { Button, Card, CircularProgress, Divider, Grid, IconButton, Input, Paper, Popover, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RentalObject } from "../../models";
import { AppState, RentalObjectActions } from "../../store";
import { DateRange } from "@mui/lab";
import { CalendarPicker } from "@mui/x-date-pickers";
import moment from "moment";


export const HomeComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [personsAnchorEl, setPersonsAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [datesAnchorEl, setDatesAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [filter, setFilter] = useState<RentalObject.GetQuery>({
        adultsCount: 1,
        childsCount: 0,
        roomsCount: 1,
        searchText: ''
    });
    const { rentalObjectState } = useAppSelector((state: AppState) => ({
        rentalObjectState: state.rentalObjectState
    }));

    function handleSearch() {
        let queryParams = '';
        if (filter.searchText)
            queryParams += `searchText=${filter.searchText}`;
        if (filter.adultsCount)
            queryParams += `${queryParams && '&'}adultsCount=${filter.adultsCount}`;
        if (filter.childsCount)
            queryParams += `${queryParams && '&'}childsCount=${filter.childsCount}`;
        if (filter.roomsCount)
            queryParams += `${queryParams && '&'}roomsCount=${filter.roomsCount}`;
        if (filter.checkinDate)
            queryParams += `${queryParams && '&'}checkinDate=${moment(filter.checkinDate).format('YYYY-MM-DD')}`;
        if (filter.checkoutDate)
            queryParams += `${queryParams && '&'}checkoutDate=${moment(filter.checkoutDate).format('YYYY-MM-DD')}`;


        navigate(`/rental-objects?${queryParams}`)
    }

    useEffect(() => { dispatch(RentalObjectActions.getRentalObjects()); }, [])

    let top10RentalObjects: RentalObject[] = [];

    if (rentalObjectState.modelsLoading === false)
        top10RentalObjects = rentalObjectState.models;
    else {
        top10RentalObjects = Array.from(new Array(10));
    }

    const searchDisabled = !filter.adultsCount || !filter.roomsCount;
    const personsPopoverOpen = Boolean(personsAnchorEl);
    const personsPopoverId = personsPopoverOpen ? 'persons-popover' : undefined;
    const datesPopoverOpen = Boolean(datesAnchorEl);
    const datesPopoverId = datesPopoverOpen ? 'dates-popover' : undefined;

    return (
        <Stack width="100%">
            <Typography variant="h4">Найдите жилье для вашего отдыха</Typography>
            <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />} alignItems="center">
                <Grid xs item>
                    <Stack direction="row" alignItems="center">
                        <Search color="disabled" />
                        <Input fullWidth placeholder="Поиск по названию или адресу" value={filter.searchText} onChange={(event) => setFilter({ ...filter, searchText: event.target.value })} />
                    </Stack>
                </Grid>
                <Button aria-describedby={personsPopoverId} onClick={(event) => setPersonsAnchorEl(personsAnchorEl ? null : event.currentTarget)}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <People color="disabled" />
                        <Typography>Взрослых: {filter.adultsCount}</Typography>
                        <Typography>Детей: {filter.childsCount}</Typography>
                    </Stack>
                </Button>
                <Button aria-describedby={datesPopoverId} onClick={(event) => setDatesAnchorEl(datesAnchorEl ? null : event.currentTarget)}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarMonth color="disabled" />
                        <Typography>{filter.checkinDate ? moment(filter.checkinDate).format('DD.MM.YYYY') : 'Заезд'} - {filter.checkoutDate ? moment(filter.checkoutDate).format('DD.MM.YYYY') : 'Отъезд'}</Typography>
                    </Stack>
                </Button>
                <Button disabled={searchDisabled} onClick={handleSearch}>Искать</Button>
            </Stack>
            <Grid item xs>
                <Grid container spacing={{ xs: 2 }} columns={{ xs: 10 }} alignItems="center">
                    {top10RentalObjects.map((ro, index) =>
                    (<Grid item key={index}>
                        {rentalObjectState.modelsLoading
                            ? (
                                <Stack padding={2} spacing={2}>
                                    <Paper variant="outlined">
                                        <Skeleton variant="rectangular" width="100%" height={120} />
                                    </Paper>
                                    <Typography variant="h6"><Skeleton /></Typography>
                                    <Skeleton width="60%" />
                                </Stack>
                            ) : (
                                <Stack padding={2} spacing={2}>
                                    <Paper variant="outlined">
                                        <Skeleton variant="rectangular" width="100%" height={120} />
                                    </Paper>
                                    <Typography variant="h6">{ro.name}</Typography>
                                    <Typography variant="caption">{ro.address}</Typography>
                                    <Button onClick={() => navigate(`/rental-objects/${ro.id}`)}>Посмотреть варианты</Button>
                                </Stack>
                            )
                        }
                    </Grid>)
                    )}
                </Grid>
            </Grid>
            <Popover
                id={datesPopoverId}
                open={datesPopoverOpen}
                anchorEl={datesAnchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                onClose={() => setDatesAnchorEl(null)}
            >
                <Stack direction="row" spacing={1}>
                    <CalendarPicker date={moment(filter.checkinDate)} onChange={(newDate) => setFilter({ ...filter, checkinDate: moment(newDate).toISOString() || undefined })} />
                    <CalendarPicker date={moment(filter.checkoutDate)} onChange={(newDate) => setFilter({ ...filter, checkoutDate: moment(newDate).toISOString() || undefined })} />
                </Stack>
            </Popover>
            <Popover
                id={personsPopoverId}
                open={personsPopoverOpen}
                anchorEl={personsAnchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                onClose={() => setPersonsAnchorEl(null)}
            >
                <Stack padding={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography width="100%">Взрослых</Typography>
                        <IconButton onClick={() => setFilter({ ...filter, adultsCount: (filter?.adultsCount || 0) - 1 })} disabled={filter.adultsCount === 1}><Remove /></IconButton>
                        <Typography>{filter.adultsCount}</Typography>
                        <IconButton onClick={() => setFilter({ ...filter, adultsCount: (filter?.adultsCount || 0) + 1 })} ><Add /></IconButton>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography width="100%">Детей</Typography>
                        <IconButton onClick={() => setFilter({ ...filter, childsCount: (filter?.childsCount || 0) - 1 })} disabled={filter.childsCount === 0}><Remove /></IconButton>
                        <Typography>{filter.childsCount}</Typography>
                        <IconButton onClick={() => setFilter({ ...filter, childsCount: (filter?.childsCount || 0) + 1 })}><Add /></IconButton>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography width="100%">Комнат</Typography>
                        <IconButton onClick={() => setFilter({ ...filter, roomsCount: (filter?.roomsCount || 0) - 1 })} disabled={filter.roomsCount === 1}><Remove /></IconButton>
                        <Typography>{filter.roomsCount}</Typography>
                        <IconButton onClick={() => setFilter({ ...filter, roomsCount: (filter?.roomsCount || 0) + 1 })}><Add /></IconButton>
                    </Stack>
                </Stack>
            </Popover>
        </Stack >
    );
}