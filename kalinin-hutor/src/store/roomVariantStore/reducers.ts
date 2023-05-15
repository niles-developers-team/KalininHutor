import { RoomVariantActionTypes, RoomVariantActions } from "./";
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
        case RoomVariantActionTypes.getRoomVariantRequest: return { ...prevState, modelLoading: true };
        case RoomVariantActionTypes.getRoomVariantSuccess: return { ...prevState, modelLoading: false, model: action.roomvariant };
        case RoomVariantActionTypes.getRoomVariantFailure: return { ...prevState, modelLoading: true, model: undefined };

        case RoomVariantActionTypes.getRoomVariantsRequest: return { ...prevState, modelsLoading: true, modelLoading: true };
        case RoomVariantActionTypes.getRoomVariantsSuccess: return { ...prevState, modelsLoading: false, models: action.roomvariants };
        case RoomVariantActionTypes.getRoomVariantsFailure: return { ...prevState, modelsLoading: false, models: [] };

        case RoomVariantActionTypes.createDraft: return { ...prevState, modelLoading: false, model: action.draft };
        case RoomVariantActionTypes.updateDraft: return { ...prevState, modelLoading: false, model: { ...action.draft } };

        case RoomVariantActionTypes.createRequest: return { ...prevState, modelLoading: true };
        case RoomVariantActionTypes.createSuccess: {
            const modelsState: RoomVariantModelsState = { modelsLoading: false, models: [...prevState.models || [], action.model] };
            const modelState: RoomVariantModelState = { modelLoading: false, model: action.model };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case RoomVariantActionTypes.createFailure: return { ...prevState, modelLoading: true };

        case RoomVariantActionTypes.updateRequest: return { ...prevState, modelLoading: true };
        case RoomVariantActionTypes.updateSuccess: {
            const modelsState: RoomVariantModelsState = { modelsLoading: false, models: prevState.models?.map(o => o.id === action.model.id ? action.model : o) || [] };
            const modelState: RoomVariantModelState = { modelLoading: false, model: action.model };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case RoomVariantActionTypes.updateFailure: return { ...prevState, };

        case RoomVariantActionTypes.deleteRequest: return { ...prevState, deleting: true };
        case RoomVariantActionTypes.deleteSuccess: {
            const updatedModels = prevState.models?.filter((model) => action.ids.some(o => o === model.id)) || [];
            return { ...prevState, deleting: false, modelsLoading: false, models: updatedModels };
        }
        case RoomVariantActionTypes.deleteFailure: return { ...prevState, deleting: false };

        case RoomVariantActionTypes.clearEditionState: return { ...prevState, modelLoading: true, deleting: false, model: undefined }; 
        default: return prevState;
    }
}