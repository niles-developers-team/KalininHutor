import { NotificationState } from "./state";
import { NotificationActions, ActionTypes } from "./actions";

const initialState: NotificationState = {
    show: false,
    models: [],
    modelsLoading: false
};

export function notificationReducer(prevState: NotificationState = initialState, action: NotificationActions.NotificationActionsTypes): NotificationState {
    switch (action.type) {
        case ActionTypes.show: return { ...prevState, show: true, message: action.message, variant: action.variant };
        case ActionTypes.hide: return { ...prevState, show: false };
        case ActionTypes.pushNotification: return { ...prevState, models: [action.model, ...prevState.models || []] };

        case ActionTypes.getCurrentUserNotificationsRequest:
             return { ...prevState, models: [...action.models] };
        case ActionTypes.markAsRead: {
            return { ...prevState, models: [...prevState.models.map(o => o.id === action.id ? { ...o, read: true } : o)] };
        }
        case ActionTypes.delete: return { ...prevState, models: prevState.models.filter(o => o.id !== action.id) };

        default: return prevState;
    }
}