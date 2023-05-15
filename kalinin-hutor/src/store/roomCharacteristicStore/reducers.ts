import { RoomCharacteristicActionTypes, RoomCharacteristicActions } from "./actions";
import { RoomCharacteristicState, RoomCharacteristicModelsState, RoomCharacteristicModelState } from "./state";

const initialState: RoomCharacteristicState = {
    modelsLoading: true,
    modelLoading: true,
    deleting: false
}

export function roomCharacteristicReducer(prevState: RoomCharacteristicState = initialState, action: RoomCharacteristicActions.RoomCharacteristicActions): RoomCharacteristicState {
    switch (action.type) {
        case RoomCharacteristicActionTypes.getRoomCharacteristicRequest: return { ...prevState, modelLoading: true };
        case RoomCharacteristicActionTypes.getRoomCharacteristicSuccess: return { ...prevState, modelLoading: false, model: action.roomcharacteristic };
        case RoomCharacteristicActionTypes.getRoomCharacteristicFailure: return { ...prevState, modelLoading: true };

        case RoomCharacteristicActionTypes.getRoomCharacteristicsRequest: return { ...prevState, modelsLoading: true };
        case RoomCharacteristicActionTypes.getRoomCharacteristicsSuccess: return { ...prevState, modelsLoading: false, models: action.roomcharacteristics };
        case RoomCharacteristicActionTypes.getRoomCharacteristicsFailure: return { ...prevState, modelsLoading: false, models: [] };

        case RoomCharacteristicActionTypes.createRequest: return { ...prevState, modelLoading: true };
        case RoomCharacteristicActionTypes.createSuccess: {
            if (prevState.modelsLoading === true) return prevState;

            const models = prevState.models.concat(action.model);

            const modelsState: RoomCharacteristicModelsState = { modelsLoading: false, models: models };
            const modelState: RoomCharacteristicModelState = { modelLoading: false, model: action.model };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case RoomCharacteristicActionTypes.createFailure: return { ...prevState, modelLoading: true };

        case RoomCharacteristicActionTypes.updateRequest: return { ...prevState, modelLoading: true };
        case RoomCharacteristicActionTypes.updateSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;

            const updatedModel = { ...prevState.model, ...action.model };
            const updatedModels = prevState.models.map(o => o.id === action.model.id ? action.model : o);

            const modelsState: RoomCharacteristicModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: RoomCharacteristicModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case RoomCharacteristicActionTypes.updateFailure: return { ...prevState, modelLoading: true };

        case RoomCharacteristicActionTypes.deleteRequest: return { ...prevState, deleting: true };
        case RoomCharacteristicActionTypes.deleteSuccess: {
            const updatedModels = prevState.models?.filter((model) => model.id !== action.id) || [];
            return { ...prevState, deleting: false, modelsLoading: false, models: updatedModels };
        }
        case RoomCharacteristicActionTypes.deleteFailure: return { ...prevState, deleting: false };
        default: return prevState;
    }
}