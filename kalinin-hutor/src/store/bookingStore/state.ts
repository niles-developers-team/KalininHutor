import { Booking } from "../../models";
import {
    ModelLoadingState,
    ModelLoadedState, 
    ModelsLoadingState, 
    ModelsLoadedState, 
    ModelsDeletingState, 
    ModelsDeletedState
} from "../appState";

export type ModelState = ModelLoadingState<Booking> | ModelLoadedState<Booking>;
export type ModelsState = ModelsLoadingState<Booking> | ModelsLoadedState<Booking>;
export type DeleteState = ModelsDeletingState<Booking.DeleteRequest> | ModelsDeletedState;
export type BookingState = ModelState & ModelsState & DeleteState;