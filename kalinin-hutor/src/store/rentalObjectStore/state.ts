import { RentalObject } from "../../models";
import { ModelLoadingState, ModelLoadedState, ModelsLoadingState, ModelsLoadedState, ModelsDeletingState, ModelsDeletedState, ModelSpecsLoadingState, ModelSpecsLoadedState, ModelUpdatedState, ModelUpdatingState } from "../appState";

export type RentalObjectModelState = ModelLoadingState | ModelLoadedState<RentalObject>;
export type RentalObjectModelUpdateState = ModelUpdatingState | ModelUpdatedState;
export type RentalObjectModelSpecsState = ModelSpecsLoadingState | ModelSpecsLoadedState;
export type RentalObjectModelsState = ModelsLoadingState | ModelsLoadedState<RentalObject>;
export type RentalObjectDeleteState = ModelsDeletingState<RentalObject.DeleteRequest> | ModelsDeletedState;
export type RentalObjectState = RentalObjectModelState & RentalObjectModelUpdateState & RentalObjectModelSpecsState & RentalObjectModelsState & RentalObjectDeleteState;