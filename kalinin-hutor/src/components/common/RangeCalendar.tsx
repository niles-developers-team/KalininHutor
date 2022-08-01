import { Popover, PopoverProps, Stack } from "@mui/material";
import { CalendarPicker } from "@mui/x-date-pickers";
import moment from "moment";

interface Props extends PopoverProps {
    startDate: string;
    endDate: string;
    onDatesChanged: (startDate: string, endDate: string) => void;
}

export const RangeCalendarPopoverComponent = function (props: Props): JSX.Element {
    const { startDate, endDate, onDatesChanged, ...rest } = props;
    return (
        <Popover {...rest}>
            <Stack direction="row" spacing={1}>
                <CalendarPicker minDate={moment(startDate)} date={moment(startDate)} onChange={(newDate) => onDatesChanged(moment(newDate).toISOString(), endDate)} />
                <CalendarPicker minDate={moment(startDate)} date={moment(endDate)} onChange={(newDate) => onDatesChanged(startDate, moment(newDate).toISOString())} />
            </Stack>
        </Popover>
    );
}