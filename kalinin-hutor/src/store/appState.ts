import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { SnackbarState } from "./snackbarStore";
import { UserState } from "./userStore/state";

export type AppThunkAction<ReturnType = void> = ThunkAction<ReturnType, AppState, void, Action>;
export type AppThunkDispatch = ThunkDispatch<AppState, void, Action>;

export type AppState = {
    userState: UserState,
    snackbarState: SnackbarState
}

export type ModelsLoading = {
    modelsLoading: true;
}

export type ModelsLoaded<TModel> = {
    modelsLoading: false;
    models: TModel[];
}

export type ModelLoading = {
    modelLoading: true;
}

export type ModelLoaded<TModel> = {
    modelLoading: boolean;
    model?: TModel;
}

export type ModelsDeleting = {
    deleting: true;
    ids: number[];
}

export type ModelsDeleted = {
    deleting: false;
    deleted?: boolean;
    ids?: number[];
}