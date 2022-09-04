import { SnackbarVariant } from "../../models"

export type SnackbarShow = {
    show: true;
    variant: SnackbarVariant;
    message: string;
}

export type SnackbarHide = {
    show: false;
    variant?: SnackbarVariant;
    message?: string;
}

export type SnackbarState = SnackbarShow | SnackbarHide;