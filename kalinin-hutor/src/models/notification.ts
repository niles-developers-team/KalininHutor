import { SnackbarVariant } from "./common";

export interface Notification {
    userId: string;
    message: string;
    type: NotificationType;
    createdAt: string;
    variant: SnackbarVariant;
    read: boolean;
}

export enum NotificationType {    
    BookingCreated,
    BookingRejected,
    BookingApproved
}

export enum NotificationStatus {
    All,
    OnlyRead,
    OnlyUnread
}

export namespace NotificationCommands {
    export interface Create {
        message: string;
        type: NotificationType;
        variant: SnackbarVariant;
    }

    export interface Get {
        type: NotificationType;
        variant: SnackbarVariant;
        status: NotificationStatus;
    }
}