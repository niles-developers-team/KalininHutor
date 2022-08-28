import { RentalObject } from "../../models";
import {
    ModelLoadingState,
    ModelLoadedState,
    ModelsLoadingState,
    ModelsLoadedState,
    ModelsDeletingState,
    ModelsDeletedState,
} from "../appState";

export type RentalObjectModelState = ModelLoadingState<RentalObject> | ModelLoadedState<RentalObject>;
export type RentalObjectModelsState = ModelsLoadingState<RentalObject> | ModelsLoadedState<RentalObject>;
export type RentalObjectDeleteState = ModelsDeletingState | ModelsDeletedState;
export type RentalObjectState = RentalObjectModelState & RentalObjectModelsState & RentalObjectDeleteState;