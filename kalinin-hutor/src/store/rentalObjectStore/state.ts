import { RentalObject } from "../../models";
import { ModelLoadingState, ModelLoadedState, ModelsLoadingState, ModelsLoadedState, ModelsDeletingState, ModelsDeletedState, ModelSpecsLoadingState, ModelSpecsLoadedState, ModelSavedState, ModelSavingState } from "../appState";

export type RentalObjectModelState = ModelLoadingState<RentalObject> | ModelLoadedState<RentalObject>;
export type RentalObjectModelUpdateState = ModelSavingState | ModelSavedState;
export type RentalObjectModelSpecsState = ModelSpecsLoadingState | ModelSpecsLoadedState;
export type RentalObjectModelsState = ModelsLoadingState<RentalObject> | ModelsLoadedState<RentalObject>;
export type RentalObjectDeleteState = ModelsDeletingState<RentalObject.DeleteRequest> | ModelsDeletedState;
export type RentalObjectState = RentalObjectModelState & RentalObjectModelUpdateState & RentalObjectModelSpecsState & RentalObjectModelsState & RentalObjectDeleteState;