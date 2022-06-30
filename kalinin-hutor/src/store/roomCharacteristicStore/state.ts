import { RoomCharacteristic } from "../../models";
import { ModelLoadingState, ModelLoadedState, ModelsLoadingState, ModelsLoadedState, ModelsDeletingState, ModelsDeletedState } from "../appState";

export type RoomCharacteristicModelState = ModelLoadingState | ModelLoadedState<RoomCharacteristic>;
export type RoomCharacteristicModelsState = ModelsLoadingState | ModelsLoadedState<RoomCharacteristic>;
export type RoomCharacteristicDeleteState = ModelsDeletingState<RoomCharacteristic.DeleteRequest> | ModelsDeletedState;
export type RoomCharacteristicState = RoomCharacteristicModelState & RoomCharacteristicModelsState & RoomCharacteristicDeleteState;