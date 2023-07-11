import { AppBar, Box, Button, Container, CssBaseline, Divider, IconButton, InputAdornment, List, Stack, SwipeableDrawer, TextField, Toolbar, Typography, styled } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { MobileRentalObjectInfoComponent, RentalObjectShortInfoSkeleton } from "../components/rentalObjects/RentalObjectInfo";
import { AppState, RentalObjectActions, RoomCharacteristicActions } from "../store";
import { RouteProps, useNavigate, useSearchParams } from "react-router-dom";
import { CharacteristicTypes, RentalObject, RoomCharacteristicFilter } from "../models";
import { HideOnScroll } from "../components/common";
import { CurrencyRuble, Favorite, Menu, Tune } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { CategoryItemFilters } from "../components/rentalObjects/RentalObjectsFilter";
import moment from "moment";
import { useQuery } from "../hooks/useQuery";

const drawerBleeding = 56;
interface Props { }

const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    marginLeft: 'auto',
    marginRight: 'auto'
}));

export const HomeComponent = function (props: Props & RouteProps): JSX.Element {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const query = useQuery();
    let [searchParams, setSearchParams] = useSearchParams();
    const { rentalObjectState, roomCharacteristicState } = useAppSelector((state: AppState) => state);

    const initialFilter: RentalObject.GetQuery = {
        minPrice: 0,
        maxPrice: 0,
        getRoomVariants: true,
        adultsCount: 1,
        childsCount: 0,
        roomsCount: 1,
        searchText: '',
        checkinDate: moment().format('YYYY-MM-DD'),
        checkoutDate: moment().add(14, 'days').format('YYYY-MM-DD')
    };

    const [state, setState] = useState({
        filterOpened: false,
        filter: initialFilter
    });

    useEffect(() => {
        const filterFromUrl = {
            searchText: query.get('searchText') || undefined,
            adultsCount: parseInt(query.get('adultsCount') || '') || 1,
            childsCount: parseInt(query.get('childsCount') || '') || 0,
            roomsCount: parseInt(query.get('roomsCount') || '') || 1,
            checkinDate: query.get('checkinDate') || undefined,
            checkoutDate: query.get('checkoutDate') || undefined
        };

        const extendedFilter = { ...filterFromUrl, ...state.filter };

        setState({ ...state, filter: extendedFilter });

        dispatch(RentalObjectActions.getRentalObjects({ getRoomVariants: true }));
        dispatch(RoomCharacteristicActions.getRoomCharacteristics());
    }, []);

    let rentalObjects: RentalObject[] = [];

    if (rentalObjectState.modelsLoading === false)
        rentalObjects = rentalObjectState.models;
    else {
        rentalObjects = Array.from(new Array(3));
    }

    function handleShowVariants(id: string) {
        navigate(`/rental-objects/${id}`);
    }

    function handleFilterSelected(id: string, selected: boolean) {
        dispatch(RoomCharacteristicActions.selectRoomCharacteristic(id, selected));
    }

    function handleFilterConfirm() {
        const { filter } = state;
        if (filter.searchText) query.set('searchText', filter.searchText);
        else query.delete('searchText');

        if (filter.adultsCount) query.set('adultsCount', filter.adultsCount.toString());
        else query.delete('adultsCount');

        if (filter.childsCount) query.set('childsCount', filter.childsCount.toString());
        else query.delete('childsCount');

        if (filter.roomsCount) query.set('roomsCount', filter.roomsCount.toString());
        else query.delete('roomsCount');

        if (filter.checkinDate) query.set('checkinDate', moment(filter.checkinDate).format('YYYY-MM-DD'));
        else query.delete('checkinDate');

        if (filter.checkoutDate) query.set('checkoutDate', moment(filter.checkoutDate).format('YYYY-MM-DD'));
        else query.delete('checkoutDate');

        setSearchParams(query.toString());
        setState({ ...state, filterOpened: false });
        dispatch(RentalObjectActions.getRentalObjects({ ...state.filter, selectedCharacteristicsIds: characteristics.filter(o => o.selected).map(o => o.id) }));
    }

    function handleFilterDiscard() {
        setState({ ...state, filterOpened: false, filter: { ...initialFilter } });
        dispatch(RoomCharacteristicActions.unselectAllRoomCharacteristics());
        dispatch(RentalObjectActions.getRentalObjects({ ...initialFilter, selectedCharacteristicsIds: [] }));
    }

    const characteristics = roomCharacteristicState.models || [];

    const container = window !== undefined ? () => window.document.body : undefined;

    const groupedCharacteristics = !characteristics.length ? undefined : characteristics.reduce(function (r: Array<{ key: CharacteristicTypes, values: RoomCharacteristicFilter[] }>, a) {
        const keyValue = r.find(o => o.key === a.type);
        if (keyValue) { keyValue.values.push(a); }
        else { r.push({ key: a.type, values: [a] }); }
        return r;
    }, []);

    return (
        <Stack>
            <HideOnScroll>
                <AppBar position="sticky" color="default">
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Stack width="100%" spacing={2} direction="row" alignItems="center">
                                <IconButton onClick={() => setState({ ...state, filterOpened: true })}><Tune /></IconButton>
                                <Typography sx={{ flexGrow: 1 }}>Калинин Хутор</Typography>
                                <IconButton disabled><Favorite /></IconButton>
                                <IconButton disabled><Menu /></IconButton>
                            </Stack>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>
            <Stack marginTop={2} spacing={2}>
                {rentalObjects.map((ro, index) =>
                (
                    rentalObjectState.modelsLoading
                        ? <RentalObjectShortInfoSkeleton />
                        : <MobileRentalObjectInfoComponent key={ro.id} model={ro} onShowVariants={handleShowVariants} />
                ))}
            </Stack>
            <SwipeableDrawer
                container={container}
                anchor="bottom"
                open={state.filterOpened}
                onClose={() => setState({ ...state, filterOpened: false })}
                onOpen={() => setState({ ...state, filterOpened: true })}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    ".MuiDrawer-paper ": {
                        height: `calc(100% - ${drawerBleeding}px)`,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                    }
                }}
                allowSwipeInChildren={true}
            >
                <Stack padding={2}
                    sx={{
                        bgcolor: 'white',
                        visibility: 'visible',
                        right: 0,
                        left: 0
                    }}>
                    <Puller />
                    <Stack direction="row" alignItems="center">
                        <Typography sx={{ flexGrow: 1 }} variant="h6">Фильтры</Typography>
                        <Button onClick={handleFilterDiscard} size="small">Сбросить</Button>
                    </Stack>
                </Stack>
                <Stack spacing={2} height='100%' overflow='auto'>
                    <Typography paddingX={2} variant="body1">Цена за 1 ночь</Typography>
                    <Stack paddingX={2} direction="row" spacing={3}>
                        <TextField type="number" size="small" value={state.filter.minPrice}
                            inputMode="decimal"
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setState({ ...state, filter: { ...state.filter, minPrice: event.target.value ? Number.parseFloat(event.target.value) : undefined } })}
                            InputProps={{
                                inputProps: { min: 0 },
                                startAdornment: <InputAdornment position="start">от</InputAdornment>,
                                endAdornment: <InputAdornment position="end"><CurrencyRuble /></InputAdornment>
                            }} />
                        <TextField type="number" size="small" value={state.filter.maxPrice}
                            inputMode="decimal"
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setState({ ...state, filter: { ...state.filter, maxPrice: event.target.value ? Number.parseFloat(event.target.value) : undefined } })}
                            InputProps={{
                                inputProps: { min: state.filter.minPrice || 0 },
                                startAdornment: <InputAdornment position="start">до</InputAdornment>,
                                endAdornment: <InputAdornment position="end"><CurrencyRuble /></InputAdornment>
                            }} />
                    </Stack>
                    <Divider />
                    <List
                        dense
                        sx={{
                            width: '100%',
                            position: 'relative',
                            '& ul': { padding: 0 },
                        }}
                        subheader={<li />}>
                        {!groupedCharacteristics ? null : groupedCharacteristics.map((keyValue: { key: CharacteristicTypes, values: RoomCharacteristicFilter[] }) => (
                            <>
                                <CategoryItemFilters key={keyValue.key} category={keyValue.key} items={keyValue.values} onFilterSelected={handleFilterSelected} />
                                <Divider />
                            </>
                        ))}
                    </List>
                </Stack>
                <Stack padding={2}>
                    <Button onClick={handleFilterConfirm}> Показать варианты </Button>
                </Stack>
            </SwipeableDrawer>
        </Stack>
    )
}