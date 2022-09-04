import { Booking } from "../../models";
import {
    ModelLoadingState,
    ModelLoadedState, 
    ModelsLoadingState, 
    ModelsLoadedState, 
    ModelsDeletingState, 
    ModelsDeletedState
} from "../appState";

export type BookingModelState = ModelLoadingState<Booking> | ModelLoadedState<Booking>;
export type BookingModelsState = ModelsLoadingState<Booking> | ModelsLoadedState<Booking>;
export type BookingDeleteState = ModelsDeletingState | ModelsDeletedState;
export type BookingState = BookingModelState & BookingModelsState & BookingDeleteState;