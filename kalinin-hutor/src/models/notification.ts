export interface Notification {
    id: string;
    userId: string;
    message: string;
    type: NotificationType;
    createdAt: string;
    variant: NotificationVariant;
    read: boolean;
}

export enum NotificationType {    
    BookingCreated,
    BookingRejected,
    BookingApproved
}

export enum NotificationVariant {
    success = 'success',
    error = 'error',
    warning = 'warning',
    info = 'info'
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
        variant: NotificationVariant;
    }

    export interface Get {
        type?: NotificationType;
        variant?: NotificationVariant;
        status?: NotificationStatus;
    }
}