import { Snackbar, Alert } from "@mui/material";

interface Props {
    open: boolean;
    message: string;
    onClose: () => void;
    variant: "success" | "error" | "warning" | "info";
}

export const MessageSnackbar = function (props: Props) {
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
            open={props.open}
            autoHideDuration={5000}
            onClose={props.onClose}
        >
            <Alert elevation={6} variant="filled" onClose={props.onClose} severity={props.variant}>
                {props.message}
            </Alert>
        </Snackbar>
    )
};