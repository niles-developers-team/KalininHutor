import { People, CalendarMonth, Remove, Add, Inbox, Mail, ChevronRight, ExpandMore } from "@mui/icons-material"
import { Stack, Divider, Grid, Input, Button, Typography, Popover, IconButton, Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Checkbox, ListSubheader } from "@mui/material"
import { CalendarPicker } from "@mui/x-date-pickers"
import moment from "moment"
import { Search } from "@mui/icons-material"
import { CharacteristicTypes, RentalObject, RoomCharacteristic, RoomCharacteristicFilter } from "../../models"
import React, { useState } from "react"
import pluralize from "plural-ru";

interface Props {
    filter: RentalObject.GetQuery;
    onFilterUpdate: (filter: RentalObject.GetQuery) => void;
    onSearch: () => void;
}

export const RentalObjectsBaseFilterComponent = function (props: Props): JSX.Element {
    const { filter, onFilterUpdate, onSearch } = props;

    const [personsAnchorEl, setPersonsAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [datesAnchorEl, setDatesAnchorEl] = useState<HTMLButtonElement | null>(null);

    const searchDisabled = !filter.adultsCount || !filter.roomsCount;
    const personsPopoverOpen = Boolean(personsAnchorEl);
    const personsPopoverId = personsPopoverOpen ? 'persons-popover' : undefined;
    const datesPopoverOpen = Boolean(datesAnchorEl);
    const datesPopoverId = datesPopoverOpen ? 'dates-popover' : undefined;

    return (
        <>
            <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />} alignItems="center">
                <Grid xs item>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Search color="disabled" />
                        <Input fullWidth placeholder="Поиск по названию или месту" value={filter.searchText} onChange={(event) => onFilterUpdate({ ...filter, searchText: event.target.value })} />
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
                <Button disabled={searchDisabled} onClick={onSearch}>Искать</Button>
            </Stack>
            <Popover
                id={datesPopoverId}
                open={datesPopoverOpen}
                anchorEl={datesAnchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                onClose={() => setDatesAnchorEl(null)}
            >
                <Stack direction="row" spacing={1}>
                    <CalendarPicker date={moment(filter.checkinDate)} onChange={(newDate) => onFilterUpdate({ ...filter, checkinDate: moment(newDate).toISOString() || undefined })} />
                    <CalendarPicker date={moment(filter.checkoutDate)} onChange={(newDate) => onFilterUpdate({ ...filter, checkoutDate: moment(newDate).toISOString() || undefined })} />
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
                        <IconButton onClick={() => onFilterUpdate({ ...filter, adultsCount: (filter?.adultsCount || 0) - 1 })} disabled={filter.adultsCount === 1}><Remove /></IconButton>
                        <Typography>{filter.adultsCount}</Typography>
                        <IconButton onClick={() => onFilterUpdate({ ...filter, adultsCount: (filter?.adultsCount || 0) + 1 })} ><Add /></IconButton>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography width="100%">Детей</Typography>
                        <IconButton onClick={() => onFilterUpdate({ ...filter, childsCount: (filter?.childsCount || 0) - 1 })} disabled={filter.childsCount === 0}><Remove /></IconButton>
                        <Typography>{filter.childsCount}</Typography>
                        <IconButton onClick={() => onFilterUpdate({ ...filter, childsCount: (filter?.childsCount || 0) + 1 })}><Add /></IconButton>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography width="100%">Комнат</Typography>
                        <IconButton onClick={() => onFilterUpdate({ ...filter, roomsCount: (filter?.roomsCount || 0) - 1 })} disabled={filter.roomsCount === 1}><Remove /></IconButton>
                        <Typography>{filter.roomsCount}</Typography>
                        <IconButton onClick={() => onFilterUpdate({ ...filter, roomsCount: (filter?.roomsCount || 0) + 1 })}><Add /></IconButton>
                    </Stack>
                </Stack>
            </Popover>
        </>
    )
}

interface CategoryItemFiltersProps {
    category: CharacteristicTypes;
    items: RoomCharacteristicFilter[];
    onFilterSelected: (id: string, selected: boolean) => void;
}

function CategoryItemFilters(props: CategoryItemFiltersProps) {
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const { category, items, onFilterSelected } = props;
    if (!items)
        return <Typography>Нет фильтров</Typography>;

    const listItems = [];
    for (let i = 0; i < (collapsed && items.length > 5 ? 5 : items.length); i++) {
        const item = items[i];
        listItems.push(
            (
                <ListItem key={`item-${category}-${item.id}`}>
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={item.selected}
                            tabIndex={-1}
                            disableRipple
                            onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => onFilterSelected(item.id || '', checked)}
                        />
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                </ListItem>
            )
        );
    }

    if (collapsed && items.length > 5) {
        listItems.push((<ListItemButton role={undefined} onClick={() => setCollapsed(false)} dense>Показать все {items.length} фильтров</ListItemButton>))
    }
    if (!collapsed) {
        listItems.push((<ListItemButton role={undefined} onClick={() => setCollapsed(true)} dense>Показать меньше</ListItemButton>))
    }

    return (
        <li key={`section-${category}`}>
            <ul>
                <ListSubheader>{CharacteristicTypes.getDescription(category)}</ListSubheader>
                {listItems}
            </ul>
        </li>
    );
}

interface DetailedProps {
    characteristics: RoomCharacteristicFilter[];
    loading: boolean;
    onFilterSelected: (id: string, selected: boolean) => void;
}

export const RentalObjectsDetailedFilterComponent = function (props: DetailedProps): JSX.Element {
    const { characteristics, loading } = props;

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
        <Stack spacing={2}>
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
                        <CategoryItemFilters category={keyValue.key} items={keyValue.values} onFilterSelected={props.onFilterSelected} />
                    ))}
                </List>
            </Paper>
        </Stack>
    )
}