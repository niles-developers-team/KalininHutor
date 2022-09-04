import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { BookingState } from "./bookingStore";
import { RentalObjectState } from "./rentalObjectStore";
import { RoomCharacteristicState } from "./roomCharacteristicStore";
import { RoomVariantState } from "./roomVariantStore";
import { SnackbarState } from "./snackbarStore";
import { UserState } from "./userStore";

export type AppThunkAction<ReturnType = void> = ThunkAction<ReturnType, AppState, void, Action>;
export type AppThunkDispatch = ThunkDispatch<AppState, void, Action>;

export type AppState = {
    userState: UserState,
    bookingState: BookingState,
    rentalObjectState: RentalObjectState,
    snackbarState: SnackbarState,
    roomCharacteristicState: RoomCharacteristicState,
    roomVariantState: RoomVariantState
}

export type ModelsLoadingState<TModel> = {
    modelsLoading: true;
    models?: TModel[];
}

export type ModelsLoadedState<TModel> = {
    modelsLoading: false;
    models: TModel[];
}

export type ModelLoadingState<TModel> = {
    modelLoading: true;
    model?: TModel;
}

export type ModelLoadedState<TModel> = {
    modelLoading: false;
    model: TModel;
}

export type ModelSpecsLoadingState = {
    modelSpecsLoading: true;
}

export type ModelSpecsLoadedState = {
    modelSpecsLoading: false;
}

export type ModelsDeletingState = {
    deleting: true;
}

export type ModelsDeletedState = {
    deleting: false;
}