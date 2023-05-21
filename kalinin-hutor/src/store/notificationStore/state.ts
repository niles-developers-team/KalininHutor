import { Notification, NotificationVariant } from "../../models"
import { ModelsLoadedState } from "../appState";

export type NotificationShow = {
    show: true;
    variant: NotificationVariant;
    message: string;
}

export type NotificationHide = {
    show: false;
    variant?: NotificationVariant;
    message?: string;
}

export type NotificationState = (NotificationShow | NotificationHide) & ModelsLoadedState<Notification>;