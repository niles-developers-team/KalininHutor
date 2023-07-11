import { Typography, ListItem, ListItemButton, Checkbox, ListItemText, ListSubheader } from "@mui/material";
import { useState } from "react";
import { CharacteristicTypes, RoomCharacteristicFilter } from "../models";

interface CategoryItemFiltersProps {
    category: CharacteristicTypes;
    items: RoomCharacteristicFilter[];
    onFilterSelected: (id: string, selected: boolean) => void;
}
export function CategoryItemFilters(props: CategoryItemFiltersProps) {
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
                    <ListItemButton onClick={() => onFilterSelected(item.id || '', !item.selected)}>
                        <Checkbox
                            edge="start"
                            checked={item.selected || false}
                            tabIndex={-1}
                        />
                        <ListItemText primary={item.name} />
                    </ListItemButton>
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