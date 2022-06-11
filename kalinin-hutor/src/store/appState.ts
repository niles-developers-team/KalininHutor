import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

export type AppThunkAction<ReturnType = void> = ThunkAction<ReturnType, AppState, void, Action>;
export type AppThunkDispatch = ThunkDispatch<AppState, void, Action>;

export type AppState = {
}