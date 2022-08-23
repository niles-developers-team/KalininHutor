import { SnackbarState } from "./state";
import { SnackbarActions, ActionType } from "./actions";

const initialState: SnackbarState = {
    show: false
}

export function snackbarReducer(prevState: SnackbarState = initialState, action: SnackbarActions.SnackbarActionsTypes): SnackbarState {
    switch (action.type) {
        case ActionType.show: {
            const state: SnackbarState = { show: true, message: action.message, variant: action.variant };
            return { ...prevState, ...state };
        }
        case ActionType.hide: {
            const state: SnackbarState = { show: false };
            return { ...prevState, ...state };
        }

        default: return prevState;
    }
}