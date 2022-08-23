import { Action } from "redux";
import { SnackbarVariant } from "../../models";

export enum ActionType {
    show = 'SHOW',
    hide = 'HIDE'
}

export namespace SnackbarActions {
    interface ShowAction extends Action<ActionType> {
        type: ActionType.show;
        variant: SnackbarVariant;
        message: string;
    }

    interface HideAction extends Action<ActionType> {
        type: ActionType.hide;
    }

    export type SnackbarActionsTypes = ShowAction | HideAction;

    export function showSnackbar(message: string, variant: SnackbarVariant = SnackbarVariant.info): SnackbarActionsTypes {
        console.log(`${variant.toString().toUpperCase()}: ${message}`);
        return { type: ActionType.show, message: message, variant: variant };
    }
    export function hideSnackbar(): SnackbarActionsTypes {
        return { type: ActionType.hide };
    }
}