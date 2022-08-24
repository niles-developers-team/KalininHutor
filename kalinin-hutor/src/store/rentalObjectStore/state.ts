import { RentalObject } from "../../models";
import {
    ModelLoadingState,
    ModelLoadedState,
    ModelsLoadingState,
    ModelsLoadedState,
    ModelsDeletingState,
    ModelsDeletedState,
    ModelSpecsLoadingState,
    ModelSpecsLoadedState
} from "../appState";

export type BookingModelState = ModelLoadingState<RentalObject> | ModelLoadedState<RentalObject>;
export type BookingModelSpecsState = ModelSpecsLoadingState | ModelSpecsLoadedState;
export type BookingModelsState = ModelsLoadingState<RentalObject> | ModelsLoadedState<RentalObject>;
export type BookingDeleteState = ModelsDeletingState<RentalObject.DeleteRequest> | ModelsDeletedState;
export type RentalObjectState = BookingModelState & BookingModelSpecsState & BookingModelsState & BookingDeleteState;