import { Action } from "redux";
import { Notification, NotificationCommands, NotificationVariant } from "../../models";
import { notificationService } from "../../services/notificationService";
import { AppThunkAction, AppThunkDispatch } from "../appState";

export enum ActionTypes {
    show = 'SHOW',
    hide = 'HIDE',
    pushNotification = 'PUSH_NOTIFICATION',

    getCurrentUserNotificationsRequest = 'GET_CURRENT_USER_NOTIFICATIONS',
    markAsRead = 'MARK_AS_READ',
    delete = 'DELETE_NOTIFICATION',
}

export namespace NotificationActions {
    interface ShowAction extends Action<ActionTypes> {
        type: ActionTypes.show;
        variant: NotificationVariant;
        message: string;
    }

    interface HideAction extends Action<ActionTypes> {
        type: ActionTypes.hide;
    }

    interface PushNotifcationAction extends Action<ActionTypes> {
        type: ActionTypes.pushNotification;
        model: Notification;
    }

    interface GetCurrentUserNotificationsAction extends Action<ActionTypes> {
        type: ActionTypes.getCurrentUserNotificationsRequest;
        models: Notification[];
    }

    interface MarkAsReadAction extends Action<ActionTypes> {
        type: ActionTypes.markAsRead;
        id: string;
    }

    interface DeleteAction extends Action<ActionTypes> {
        type: ActionTypes.delete;
        id: string;
    }

    export type NotificationActionsTypes =
        ShowAction |
        HideAction |
        PushNotifcationAction |
        GetCurrentUserNotificationsAction |
        MarkAsReadAction |
        DeleteAction;

    export function showSnackbar(message: string, variant: NotificationVariant = NotificationVariant.info): ShowAction { return { type: ActionTypes.show, message: message, variant: variant }; }

    export function hideSnackbar(): HideAction { return { type: ActionTypes.hide }; }

    export function pushNotification(notification: Notification): AppThunkAction<PushNotifcationAction> {
        return (dispatch: AppThunkDispatch) => {
            dispatch(NotificationActions.showSnackbar(notification.message, notification.variant));

            return dispatch(push());
            function push(): PushNotifcationAction { return { type: ActionTypes.pushNotification, model: notification } }
        }
    }

    export function getCurrentUserNotifications(request: NotificationCommands.Get): AppThunkAction<Promise<GetCurrentUserNotificationsAction>> {
        return async (dispatch: AppThunkDispatch) => {
            var models = await notificationService.get(request);

            return dispatch(success());
            function success(): GetCurrentUserNotificationsAction { return { type: ActionTypes.getCurrentUserNotificationsRequest, models: models }; }
        };
    }

    export function markAsRead(id: string): AppThunkAction<Promise<MarkAsReadAction>> {
        return async (dispatch) => {
            await notificationService.update(id);

            return dispatch(mark());
            function mark(): MarkAsReadAction { return { type: ActionTypes.markAsRead, id: id }; }
        };
    }

    export function deleteNotification(id: string): AppThunkAction<Promise<DeleteAction>> {
        return async (dispatch) => {
            await notificationService.update(id);

            return dispatch(dispatchDelete());
            function dispatchDelete(): DeleteAction { return { type: ActionTypes.delete, id: id }; }
        };
    }
}