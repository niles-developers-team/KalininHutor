import { Popover, PopoverProps, Stack } from "@mui/material";
import { CalendarPicker } from "@mui/x-date-pickers";
import moment from "moment";

interface Props extends PopoverProps {
    startDate: string | undefined;
    endDate: string | undefined;
    onDatesChanged: (startDate: string | undefined, endDate: string | undefined) => void;
}

export const RangeCalendarPopoverComponent = function (props: Props): JSX.Element {
    const { startDate, endDate, onDatesChanged, ...rest } = props;

    const format = 'YYYY-MM-DD';

    return (
        <Popover {...rest}>
            <Stack direction="row" spacing={1}>
                <CalendarPicker minDate={moment(startDate)} date={moment(startDate)} onChange={(newDate) => onDatesChanged(newDate?.format(format), endDate)} />
                <CalendarPicker minDate={moment(startDate)} date={moment(endDate)} onChange={(newDate) => onDatesChanged(startDate, newDate?.format(format))} />
            </Stack>
        </Popover>
    );
}