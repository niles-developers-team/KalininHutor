import { Stack, Paper, Skeleton, Typography, Button } from "@mui/material";
import { RentalObject } from "../../models";

interface Props {
    model: RentalObject;
    onShowVariants: () => void;
}

export const RentalObjectShortInfoComponent = function (props: Props): JSX.Element {
    return (
        <Stack padding={2} spacing={2}>
            <Paper variant="outlined">
                <Skeleton variant="rectangular" width="100%" height={120} />
            </Paper>
            <Typography variant="h6">{props.model.name}</Typography>
            <Typography variant="caption">{props.model.address}</Typography>
            <Button onClick={props.onShowVariants}>Посмотреть варианты</Button>
        </Stack>
    );
}

export const RentalObjectShortInfoSkeleton = function (): JSX.Element {
    return (
        <Stack padding={2} spacing={2}>
            <Paper variant="outlined">
                <Skeleton variant="rectangular" width="100%" height={120} />
            </Paper>
            <Typography variant="h6"><Skeleton /></Typography>
            <Skeleton width="60%" />
        </Stack>
    );
}