import { Check, Close } from "@mui/icons-material";
import { Grid, IconButton, Popover, PopoverProps, Stack } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import moment from "moment";
import { useEffect, useState } from "react";

interface Props extends PopoverProps {
    startDate: string | undefined;
    endDate: string | undefined;
    onConfirm: (startDate: string | undefined, endDate: string | undefined) => void;
    onDiscard: () => void;
}

export const RangeCalendarPopoverComponent = function (props: Props): JSX.Element {
    const { startDate, endDate, onConfirm, ...rest } = props;

    const [startStateDate, setStartStateDate] = useState<moment.Moment | null>(null);
    const [endStateDate, setEndStateDate] = useState<moment.Moment | null>(null);

    useEffect(() => {
        if (props.open) {
            setStartStateDate(moment(startDate));
            setEndStateDate(moment(endDate));
        }
    }, [props.open]);

    function handleStateDateChanged(newDate: moment.Moment | null) {
        setStartStateDate(newDate);
        if (newDate && endStateDate && newDate > endStateDate)
            setEndStateDate(null);
    };

    function handleConfirm() { onConfirm(startStateDate?.format(format), endStateDate?.format(format)) };

    const format = 'YYYY-MM-DD';

    return (
        <Popover {...rest}>
            <Stack direction="row" spacing={1}>
                <DateCalendar minDate={moment()} value={startStateDate} onChange={(newDate: any) => handleStateDateChanged(newDate)} />
                <DateCalendar minDate={startStateDate} value={endStateDate} onChange={(newDate: any) => setEndStateDate(newDate)} />
            </Stack>
            <Stack direction="row" spacing={1} marginBottom={1} marginRight={1}>
                <Grid item xs />
                <IconButton color="primary" disabled={!endStateDate} onClick={handleConfirm}><Check /></IconButton>
                <IconButton onClick={props.onDiscard}><Close /></IconButton>
            </Stack>
        </Popover>
    );
}