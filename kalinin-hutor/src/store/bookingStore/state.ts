import { Booking } from "../../models";
import { ModelLoadingState, ModelLoadedState, ModelsLoadingState, ModelsLoadedState, ModelsDeletingState, ModelsDeletedState, ModelSavingState, ModelSavedState } from "../appState";

export type ModelState = ModelLoadingState<Booking> | ModelLoadedState<Booking>;
export type ModelsState = ModelsLoadingState<Booking> | ModelsLoadedState<Booking>;
export type SavingState = ModelSavingState | ModelSavedState;
export type DeleteState = ModelsDeletingState<Booking.DeleteRequest> | ModelsDeletedState;
export type BookingState = ModelState & ModelsState & SavingState & DeleteState;