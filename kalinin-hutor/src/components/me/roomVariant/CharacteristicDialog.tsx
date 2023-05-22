import { CurrencyRuble } from "@mui/icons-material";
import { SelectChangeEvent, Stack, Typography, Button, Dialog, DialogTitle, DialogContent, Autocomplete, Box, TextField, Select, MenuItem, DialogActions } from "@mui/material";
import { useState, useEffect, ChangeEvent } from "react";
import { RoomVariantCharacteristic, RoomCharacteristic, CharacteristicTypes } from "../../../models";

interface CharacteristicDialogProps {
    open: boolean;
    model: RoomVariantCharacteristic;
    characteristics: RoomCharacteristic[];
    searching: boolean;
    onSearch: (searchText: string) => void;
    onDiscard: () => void;
    onConfirm: (result: RoomVariantCharacteristic) => void;
}

export const CharacteristicDialog = function(props: CharacteristicDialogProps): JSX.Element {
    const [model, setModel] = useState<RoomVariantCharacteristic>({ ...RoomVariantCharacteristic.initial });
    const [selectOrAddCharacteristic, setSelectOrAddCharacteristic] = useState<boolean>(true);
    const [roomCharacteristic, setRoomCharacteristic] = useState<RoomCharacteristic>({ ...RoomCharacteristic.initial });

    useEffect(() => {
        setModel({ ...props.model, roomCharacteristic: props.characteristics.find(o => o.id === props.model.roomCharacteristicId) });
        setSelectOrAddCharacteristic(true);
        setRoomCharacteristic({ ...RoomCharacteristic.initial });
    }, [props.model, props.open]);

    function handleCharacteristicChanged(event: React.SyntheticEvent<Element, Event>, value: RoomCharacteristic | null) {
        setModel({ ...model, roomCharacteristic: value || undefined, roomCharacteristicId: value?.id || null })
    }

    function handlePriceChanged(event: ChangeEvent<HTMLInputElement>) {
        setModel({ ...model, price: event.target && parseInt(event.target.value) });
    }

    function handleConfirm() {
        if (!selectOrAddCharacteristic)
            model.roomCharacteristic = roomCharacteristic;

        props.onConfirm(model);
    }

    function handleDiscardCreateRoomCharacteristic() {
        setSelectOrAddCharacteristic(true);
        setRoomCharacteristic({ ...RoomCharacteristic.initial });
    }

    function handleRoomCharacteristicNameChanged(event: ChangeEvent<HTMLInputElement>) {
        setRoomCharacteristic({ ...roomCharacteristic, name: event.target && event.target.value });
    }

    function handleRoomCharacteristicDescriptionChanged(event: ChangeEvent<HTMLInputElement>) {
        setRoomCharacteristic({ ...roomCharacteristic, description: event.target && event.target.value });
    }

    function handleRoomCharacteristicTypeChanged(event: SelectChangeEvent<CharacteristicTypes>) {
        setRoomCharacteristic({ ...roomCharacteristic, type: event.target.value as CharacteristicTypes });
    }

    function handleSearch(event: React.SyntheticEvent<Element, Event>, value: string) {
        props.onSearch(value);
    }

    const NotFoundCharacteristic = (
        <Stack direction="row" spacing={2}>
            <Typography>Не найдено услуг или сервисов, <Button onClick={() => setSelectOrAddCharacteristic(false)}>добавить</Button>?</Typography>
        </Stack>
    );

    return (
        <Dialog
            open={props.open}
            onClose={props.onDiscard}
        >
            <DialogTitle> Услуга или сервис </DialogTitle>
            <DialogContent sx={{ minWidth: '400px' }}>
                <Stack spacing={2}>
                    {selectOrAddCharacteristic ?
                        (
                            <Autocomplete<RoomCharacteristic>
                                loading={props.searching}
                                defaultValue={null}
                                loadingText="Поиск услуг или сервисов"
                                noOptionsText={NotFoundCharacteristic}
                                value={model.roomCharacteristic}
                                options={props.characteristics}
                                isOptionEqualToValue={(option, value) => (option === null || value === null) ? false : option.name.includes(value.name)}
                                onChange={handleCharacteristicChanged}
                                onInputChange={handleSearch}
                                groupBy={(option) => CharacteristicTypes.getDescription(option.type)}
                                getOptionLabel={(option) => option?.name}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        <Stack key={option.id}>
                                            <Typography variant="body2">{option.name}</Typography>
                                            <Typography variant="caption">{option.description}</Typography>
                                        </Stack>
                                    </Box>
                                )}
                                renderInput={(params) => <TextField {...params} label="Тип услуги или сервиса" />}
                            />
                        )
                        : (
                            <>
                                <TextField value={roomCharacteristic.name} label="Название" onChange={handleRoomCharacteristicNameChanged} />
                                <TextField
                                    value={roomCharacteristic.description}
                                    label="Описание"
                                    multiline
                                    rows={2}
                                    onChange={handleRoomCharacteristicDescriptionChanged} />
                                <Select<CharacteristicTypes>
                                    value={roomCharacteristic.type}
                                    label="Тип кровати"
                                    onChange={handleRoomCharacteristicTypeChanged}>
                                    {CharacteristicTypes.values.map(o => (<MenuItem key={o} value={o}>{CharacteristicTypes.getDescription(o)}</MenuItem>))}
                                </Select>
                                <Stack direction="row-reverse">
                                    <Button onClick={handleDiscardCreateRoomCharacteristic}>Выбрать существующую</Button>
                                </Stack>
                            </>
                        )
                    }
                    <TextField
                        label="Цена"
                        type="number"
                        defaultValue={undefined}
                        value={model.price || 0}
                        onChange={handlePriceChanged}
                        InputProps={{ endAdornment: <CurrencyRuble color="disabled" /> }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button color="inherit" onClick={props.onDiscard}>Отмена</Button>
                <Button color="primary" onClick={handleConfirm} autoFocus>Принять</Button>
            </DialogActions>
        </Dialog>
    );
}