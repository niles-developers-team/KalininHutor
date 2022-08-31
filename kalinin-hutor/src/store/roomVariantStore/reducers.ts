import { ActionTypes, RoomVariantActions } from "./";
import { RoomVariantState, RoomVariantModelsState, RoomVariantModelState } from "./state";

const initialState: RoomVariantState = {
    modelsLoading: true,
    modelLoading: true,
    deleting: false,
    models: [],
    model: undefined
}

export function roomVariantReducer(prevState: RoomVariantState = initialState, action: RoomVariantActions.RoomVariantActions): RoomVariantState {
    switch (action.type) {
        case ActionTypes.getRoomVariantRequest: return { ...prevState, modelLoading: true };
        case ActionTypes.getRoomVariantSuccess: return { ...prevState, modelLoading: false, model: action.roomvariant };
        case ActionTypes.getRoomVariantFailure: return { ...prevState, modelLoading: true, model: undefined };

        case ActionTypes.getRoomVariantsRequest: return { ...prevState, modelsLoading: true, modelLoading: true };
        case ActionTypes.getRoomVariantsSuccess: return { ...prevState, modelsLoading: false, models: action.roomvariants };
        case ActionTypes.getRoomVariantsFailure: return { ...prevState, modelsLoading: false, models: [] };

        case ActionTypes.createDraft: return { ...prevState, modelLoading: false, model: action.draft };
        case ActionTypes.updateDraft: return { ...prevState, modelLoading: false, model: { ...action.draft } };

        case ActionTypes.createRequest: return { ...prevState, modelLoading: true };
        case ActionTypes.createSuccess: {
            const modelsState: RoomVariantModelsState = { modelsLoading: false, models: [...prevState.models || [], action.model] };
            const modelState: RoomVariantModelState = { modelLoading: false, model: action.model };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.createFailure: return { ...prevState, modelLoading: true };

        case ActionTypes.updateRequest: return { ...prevState, modelLoading: true };
        case ActionTypes.updateSuccess: {
            const modelsState: RoomVariantModelsState = { modelsLoading: false, models: prevState.models?.map(o => o.id === action.model.id ? action.model : o) || [] };
            const modelState: RoomVariantModelState = { modelLoading: false, model: action.model };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.updateFailure: return { ...prevState, };

        case ActionTypes.deleteRequest: return { ...prevState, deleting: true };
        case ActionTypes.deleteSuccess: {
            const updatedModels = prevState.models?.filter((model) => action.ids.some(o => o == model.id)) || [];
            return { ...prevState, deleting: false, modelsLoading: false, models: updatedModels };
        }
        case ActionTypes.deleteFailure: return { ...prevState, deleting: false };

        case ActionTypes.clearEditionState: return { ...prevState, modelLoading: true, deleting: false, model: undefined }; 
        default: return prevState;
    }
}