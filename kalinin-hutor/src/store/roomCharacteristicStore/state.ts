import { RoomCharacteristic } from "../../models";
import { ModelLoadingState, ModelLoadedState, ModelsLoadingState, ModelsLoadedState, ModelsDeletingState, ModelsDeletedState } from "../appState";

export type RoomCharacteristicModelState = ModelLoadingState<RoomCharacteristic> | ModelLoadedState<RoomCharacteristic>;
export type RoomCharacteristicModelsState = ModelsLoadingState<RoomCharacteristic> | ModelsLoadedState<RoomCharacteristic>;
export type RoomCharacteristicDeleteState = ModelsDeletingState | ModelsDeletedState;
export type RoomCharacteristicState = RoomCharacteristicModelState & RoomCharacteristicModelsState & RoomCharacteristicDeleteState;