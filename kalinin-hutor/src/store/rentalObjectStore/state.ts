import { RentalObject } from "../../models";
import { ModelLoading, ModelLoaded, ModelsLoading, ModelsLoaded, ModelsDeleting, ModelsDeleted } from "../appState";

export type ModelState = ModelLoading | ModelLoaded<RentalObject>;
export type ModelsState = ModelsLoading | ModelsLoaded<RentalObject>;
export type DeleteState = ModelsDeleting<RentalObject.DeleteRequest> | ModelsDeleted;
export type RentalObjectState = ModelState & ModelsState & DeleteState;