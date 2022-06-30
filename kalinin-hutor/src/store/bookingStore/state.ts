import { Booking } from "../../models";
import { ModelLoadingState, ModelLoadedState, ModelsLoadingState, ModelsLoadedState, ModelsDeletingState, ModelsDeletedState } from "../appState";

export type ModelState = ModelLoadingState | ModelLoadedState<Booking>;
export type ModelsState = ModelsLoadingState | ModelsLoadedState<Booking>;
export type DeleteState = ModelsDeletingState<Booking.DeleteRequest> | ModelsDeletedState;
export type BookingState = ModelState & ModelsState & DeleteState;