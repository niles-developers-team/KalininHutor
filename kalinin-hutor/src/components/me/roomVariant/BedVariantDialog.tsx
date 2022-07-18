import { SelectChangeEvent, Dialog, DialogTitle, DialogContent, Stack, Select, MenuItem, TextField, DialogActions, Button } from "@mui/material";
import { useState, useEffect, ChangeEvent } from "react";
import { RoomVariantBedType, BedTypes } from "../../../models";

interface BedVariantDialogProps {
    open: boolean;
    model: RoomVariantBedType;
    onDiscard: () => void;
    onConfirm: (result: RoomVariantBedType) => void;
}

export const BedVariantDialog = function (props: BedVariantDialogProps): JSX.Element {
    const [model, setModel] = useState<RoomVariantBedType>({ ...RoomVariantBedType.initial });

    useEffect(() => {
        setModel({ ...props.model });
    }, [props.model, props.open])

    function handleBedTypeChanged(event: SelectChangeEvent<BedTypes>) {
        setModel({ ...model, bedType: event.target.value as BedTypes });
    }

    function handleWidthChanged(event: ChangeEvent<HTMLInputElement>) {
        setModel({ ...model, width: parseInt(event.target.value) })
    }

    function handleLengthChanged(event: ChangeEvent<HTMLInputElement>) {
        setModel({ ...model, length: parseInt(event.target.value) })
    }

    function handleConfirm() {
        props.onConfirm({ ...model });
    }

    return (
        <Dialog open={props.open} onClose={props.onDiscard}>
            <DialogTitle> Вариант кровати </DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <Select<BedTypes> value={model.bedType} label="Тип кровати" onChange={handleBedTypeChanged}>
                        {BedTypes.values.map(bt => (<MenuItem key={bt} value={bt}>{BedTypes.getDescription(bt)}</MenuItem>))}
                    </Select>
                    <Stack direction="row" spacing={3}>
                        <TextField
                            label="Ширина"
                            type="number"
                            defaultValue={undefined}
                            value={model.width}
                            onChange={handleWidthChanged}
                            InputProps={{ endAdornment: "м." }}
                        />
                        <TextField
                            label="Длина"
                            type="number"
                            defaultValue={undefined}
                            value={model.length}
                            onChange={handleLengthChanged}
                            InputProps={{ endAdornment: "м." }}
                        />
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button color="inherit" onClick={props.onDiscard}>Отмена</Button>
                <Button color="primary" onClick={handleConfirm} autoFocus>Принять</Button>
            </DialogActions>
        </Dialog>
    );
}