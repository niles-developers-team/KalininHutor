import { RentalObject } from "../../models";
import { ModelLoadingState, ModelLoadedState, ModelsLoadingState, ModelsLoadedState, ModelsDeletingState, ModelsDeletedState, CreateModelState, ModelSpecsLoadingState, ModelSpecsLoadedState } from "../appState";

export type RentalObjectCreationState = CreateModelState<RentalObject>;
export type RentalObjectModelState = ModelLoadingState | ModelLoadedState<RentalObject>;
export type RentalObjectModelSpecsState = ModelSpecsLoadingState | ModelSpecsLoadedState;
export type RentalObjectModelsState = ModelsLoadingState | ModelsLoadedState<RentalObject>;
export type RentalObjectDeleteState = ModelsDeletingState<RentalObject.DeleteRequest> | ModelsDeletedState;
export type RentalObjectState = RentalObjectModelState & RentalObjectModelSpecsState & RentalObjectModelsState & RentalObjectDeleteState & RentalObjectCreationState;