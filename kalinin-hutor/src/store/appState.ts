import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { BookingState } from "./bookingStore";
import { SnackbarState } from "./snackbarStore";
import { UserState } from "./userStore";

export type AppThunkAction<ReturnType = void> = ThunkAction<ReturnType, AppState, void, Action>;
export type AppThunkDispatch = ThunkDispatch<AppState, void, Action>;

export type AppState = {
    userState: UserState,
    bookingState: BookingState,
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

export type ModelsDeleting<TRequest> = {
    deleting: true;
    request: TRequest;
}

export type ModelsDeleted<TRequest> = {
    deleting: false;
    deleted?: boolean;
    request?: TRequest;
}