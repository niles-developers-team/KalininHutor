import { RoomCharacteristicActionTypes, RoomCharacteristicActions } from "./actions";
import { RoomCharacteristicState, RoomCharacteristicDeleteState, RoomCharacteristicModelsState, RoomCharacteristicModelState } from "./state";

const initialState: RoomCharacteristicState = {
    modelsLoading: true,
    modelLoading: false,
    deleting: false
}

export function roomCharacteristicReducer(prevState: RoomCharacteristicState = initialState, action: RoomCharacteristicActions.RoomCharacteristicActions): RoomCharacteristicState {
    switch (action.type) {
        case RoomCharacteristicActionTypes.getRoomCharacteristicRequest: {
            const state: RoomCharacteristicModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case RoomCharacteristicActionTypes.getRoomCharacteristicSuccess: {
            const state: RoomCharacteristicModelState = { modelLoading: false, model: action.roomcharacteristic };
            return { ...prevState, ...state };
        }
        case RoomCharacteristicActionTypes.getRoomCharacteristicFailure: {
            const state: RoomCharacteristicModelState = { modelLoading: false, model: undefined };
            return { ...prevState, ...state };
        }

        case RoomCharacteristicActionTypes.getRoomCharacteristicsRequest: {
            const state: RoomCharacteristicModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case RoomCharacteristicActionTypes.getRoomCharacteristicsSuccess: {
            const state: RoomCharacteristicModelsState = { modelsLoading: false, models: action.roomcharacteristics };
            return { ...prevState, ...state };
        }
        case RoomCharacteristicActionTypes.getRoomCharacteristicsFailure: {
            const state: RoomCharacteristicModelsState = { modelsLoading: false, models: [] };
            return { ...prevState, ...state };
        }

        case RoomCharacteristicActionTypes.createRequest: {
            return { ...prevState, modelLoading: true };
        }
        case RoomCharacteristicActionTypes.createSuccess: {
            if (prevState.modelsLoading === true) return prevState;

            const models = prevState.models.concat(action.model);

            const modelsState: RoomCharacteristicModelsState = { modelsLoading: false, models: models };
            const modelState: RoomCharacteristicModelState = { modelLoading: false, model: action.model };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case RoomCharacteristicActionTypes.createFailure: {
            return { ...prevState, modelLoading: false };
        }

        case RoomCharacteristicActionTypes.updateRequest: {
            return { ...prevState, modelLoading: true };
        }
        case RoomCharacteristicActionTypes.updateSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;

            const updatedModel = { ...prevState.model, ...action.model };
            const updatedModels = prevState.models.map(o => o.id === action.model.id ? action.model : o);

            const modelsState: RoomCharacteristicModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: RoomCharacteristicModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case RoomCharacteristicActionTypes.updateFailure: {
            return { ...prevState, modelLoading: false };
        }

        case RoomCharacteristicActionTypes.deleteRequest: {
            const deleteState: RoomCharacteristicDeleteState = { deleting: true, deleteRequest: action.request };
            return { ...prevState, ...deleteState };
        }
        case RoomCharacteristicActionTypes.deleteSuccess: {
            if (prevState.modelsLoading === false && prevState.deleting === true) {
                const state: RoomCharacteristicModelsState = { modelsLoading: false, models: prevState.models.filter((model) => prevState.deleteRequest && model.id !== prevState.deleteRequest.id) };
                const deleteState: RoomCharacteristicDeleteState = { deleting: false, deleted: true };
                return { ...prevState, ...deleteState, ...state };
            }

            return prevState;
        }
        case RoomCharacteristicActionTypes.deleteFailure: {
            const deleteState: RoomCharacteristicDeleteState = { deleting: false, deleted: false };
            return { ...prevState, ...deleteState };
        }
        default: return prevState;
    }
}