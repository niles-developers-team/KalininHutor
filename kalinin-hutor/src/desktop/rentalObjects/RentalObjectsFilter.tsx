import { People, CalendarMonth, Remove, Add } from "@mui/icons-material"
import { Stack, Divider, Grid, Button, Typography, Popover, IconButton, List, Paper, PopoverProps, InputBase } from "@mui/material"
import moment from "moment"
import { Search } from "@mui/icons-material"
import { useState } from "react"
import { RangeCalendarPopoverComponent } from "../common"
import { RentalObject, CharacteristicTypes, RoomCharacteristicFilter } from "../../models"
import { CategoryItemFilters } from "../../commonComponents"

interface VisitorsPopoverProps extends PopoverProps {
    adultsCount: number;
    childsCount: number;
    roomsCount?: number;
    onAdultsCountChanged: (adultsCount: number) => void;
    onChildsCountChanged: (childsCount: number) => void;
    onRoomsCountChanged?: (roomsCount: number) => void;
}

export const VisitorsPopoverComponent = function (props: VisitorsPopoverProps): JSX.Element {
    const {
        adultsCount,
        childsCount,
        roomsCount,
        onAdultsCountChanged,
        onChildsCountChanged,
        onRoomsCountChanged,
        ...rest
    } = props;
    return (
        <Popover {...rest}>
            <Stack padding={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography width="100%">Взрослых</Typography>
                    <IconButton onClick={() => onAdultsCountChanged(adultsCount - 1)} disabled={adultsCount === 1}><Remove /></IconButton>
                    <Typography>{adultsCount}</Typography>
                    <IconButton onClick={() => onAdultsCountChanged(adultsCount + 1)} ><Add /></IconButton>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography width="100%">Детей</Typography>
                    <IconButton onClick={() => onChildsCountChanged(childsCount - 1)} disabled={childsCount === 0}><Remove /></IconButton>
                    <Typography>{childsCount}</Typography>
                    <IconButton onClick={() => onChildsCountChanged(childsCount + 1)}><Add /></IconButton>
                </Stack>
                {!roomsCount ? null :
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography width="100%">Комнат</Typography>
                        <IconButton onClick={() => onRoomsCountChanged && onRoomsCountChanged(roomsCount - 1)} disabled={roomsCount === 1}><Remove /></IconButton>
                        <Typography>{roomsCount}</Typography>
                        <IconButton onClick={() => onRoomsCountChanged && onRoomsCountChanged(roomsCount + 1)}><Add /></IconButton>
                    </Stack>
                }
            </Stack>
        </Popover>
    );
}

interface Props {
    filter: RentalObject.GetQuery;
    onFilterUpdate: (filter: RentalObject.GetQuery) => void;
    onSearch: () => void;
}

export const RentalObjectsBaseFilterComponent = function (props: Props): JSX.Element {
    const { filter, onFilterUpdate, onSearch } = props;

    const [personsAnchorEl, setPersonsAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [datesAnchorEl, setDatesAnchorEl] = useState<HTMLButtonElement | null>(null);
    const personsPopoverOpen = Boolean(personsAnchorEl);
    const personsPopoverId = personsPopoverOpen ? 'persons-popover' : undefined;
    const datesPopoverOpen = Boolean(datesAnchorEl);
    const datesPopoverId = datesPopoverOpen ? 'dates-popover' : undefined;

    const searchDisabled = !filter.adultsCount || !filter.roomsCount || !filter.checkinDate || !filter.checkoutDate;

    function handleDatesChanged(startDate: string | undefined, endDate: string | undefined) {
        onFilterUpdate({
            ...filter,
            checkinDate: startDate,
            checkoutDate: endDate
        });

        setDatesAnchorEl(null);
    }

    return (
        <Grid margin={1}>
            <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />} alignItems="center">
                <Grid xs item>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Search color="disabled" />
                        <InputBase fullWidth placeholder="Поиск по названию или месту" value={filter.searchText} onChange={(event) => onFilterUpdate({ ...filter, searchText: event.target.value })} />
                    </Stack>
                </Grid>
                <Button aria-describedby={personsPopoverId} onClick={(event) => setPersonsAnchorEl(personsAnchorEl ? null : event.currentTarget)}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <People color="disabled" />
                        <Typography variant="body2">Взрослых: {filter.adultsCount}</Typography>
                        <Typography variant="body2">Детей: {filter.childsCount}</Typography>
                    </Stack>
                </Button>
                <Button aria-describedby={datesPopoverId} onClick={(event) => setDatesAnchorEl(datesAnchorEl ? null : event.currentTarget)}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarMonth color="disabled" />
                        <Typography variant="body2">{filter.checkinDate ? moment(filter.checkinDate).format('DD.MM.YYYY') : 'Заезд'} - {filter.checkoutDate ? moment(filter.checkoutDate).format('DD.MM.YYYY') : 'Отъезд'}</Typography>
                    </Stack>
                </Button>
                <Button disabled={searchDisabled} onClick={onSearch}>Искать</Button>
            </Stack>
            <RangeCalendarPopoverComponent
                id={datesPopoverId}
                open={datesPopoverOpen}
                anchorEl={datesAnchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                onClose={() => setDatesAnchorEl(null)}
                startDate={filter.checkinDate}
                endDate={filter.checkoutDate}
                onConfirm={handleDatesChanged}
                onDiscard={() => setDatesAnchorEl(null)}
            />
            <VisitorsPopoverComponent
                id={personsPopoverId}
                open={personsPopoverOpen}
                anchorEl={personsAnchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                onClose={() => setPersonsAnchorEl(null)}
                adultsCount={filter?.adultsCount || 0}
                childsCount={filter?.childsCount || 0}
                roomsCount={filter?.roomsCount || 0}
                onAdultsCountChanged={(adultsCount: number) => onFilterUpdate({ ...filter, adultsCount: adultsCount })}
                onChildsCountChanged={(childsCount: number) => onFilterUpdate({ ...filter, childsCount: childsCount })}
                onRoomsCountChanged={(roomsCount: number) => onFilterUpdate({ ...filter, roomsCount: roomsCount })}
            />
        </Grid>
    )
}

interface DetailedProps {
    characteristics: RoomCharacteristicFilter[];
    onFilterSelected: (id: string, selected: boolean) => void;
}

export const RentalObjectsDetailedFilterComponent = function (props: DetailedProps): JSX.Element {
    const { characteristics } = props;

    const groupedCharacteristics = !characteristics.length ? undefined : characteristics.reduce(function (r: Array<{ key: CharacteristicTypes, values: RoomCharacteristicFilter[] }>, a) {
        const keyValue = r.find(o => o.key === a.type);
        if (keyValue) {
            keyValue.values.push(a);
        } else {
            r.push({ key: a.type, values: [a] });
        }
        return r;
    }, []);

    return (
        <Stack spacing={2} minWidth={230}>
            <Typography variant="h5">Фильтры</Typography>
            <Paper variant="outlined">
                <List
                    dense
                    sx={{
                        width: '100%',
                        position: 'relative',
                        overflow: 'auto',
                        '& ul': { padding: 0 },
                    }}
                    subheader={<li />}>
                    {!groupedCharacteristics ? null : groupedCharacteristics.map((keyValue: { key: CharacteristicTypes, values: RoomCharacteristicFilter[] }) => (
                        <CategoryItemFilters key={keyValue.key} category={keyValue.key} items={keyValue.values} onFilterSelected={props.onFilterSelected} />
                    ))}
                </List>
            </Paper>
        </Stack>
    )
}