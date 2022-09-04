import { RoomVariant } from "../../models";
import {
    ModelLoadingState,
    ModelLoadedState,
    ModelsLoadingState,
    ModelsLoadedState,
    ModelsDeletingState,
    ModelsDeletedState,
} from "../appState";

export type RoomVariantModelState = ModelLoadingState<RoomVariant> | ModelLoadedState<RoomVariant>;
export type RoomVariantModelsState = ModelsLoadingState<RoomVariant> | ModelsLoadedState<RoomVariant>;
export type RoomVariantDeleteState = ModelsDeletingState | ModelsDeletedState;
export type RoomVariantState = RoomVariantModelState & RoomVariantModelsState & RoomVariantDeleteState;