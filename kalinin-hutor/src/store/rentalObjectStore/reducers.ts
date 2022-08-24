import { ActionTypes, RentalObjectActions } from "./actions";
import { RentalObjectState, BookingModelsState, BookingModelState, BookingModelSpecsState } from "./state";

const initialState: RentalObjectState = {
    modelsLoading: true,
    modelLoading: true,
    modelSpecsLoading: true,
    deleting: false,
    models: [],
    model: undefined
}

export function rentalObjectReducer(prevState: RentalObjectState = initialState, action: RentalObjectActions.RentalObjectActions): RentalObjectState {
    switch (action.type) {
        case ActionTypes.getRentalObjectRequest: return { ...prevState, modelLoading: true };
        case ActionTypes.getRentalObjectSuccess: return { ...prevState, modelLoading: false, model: action.rentalobject };
        case ActionTypes.getRentalObjectFailure: return { ...prevState, modelLoading: true, model: undefined };

        case ActionTypes.getRentalObjectsRequest: return { ...prevState, modelsLoading: true, modelLoading: true };
        case ActionTypes.getRentalObjectsSuccess: return { ...prevState, modelsLoading: false, models: action.rentalobjects };
        case ActionTypes.getRentalObjectsFailure: return { ...prevState, modelsLoading: false, models: [] };

        case ActionTypes.createDraft: return { ...prevState, modelLoading: false, model: action.draft };
        case ActionTypes.updateDraft: return { ...prevState, modelLoading: false, model: { ...action.draft } };

        case ActionTypes.createRequest: return { ...prevState, modelLoading: true };
        case ActionTypes.createSuccess: {
            const modelsState: BookingModelsState = { modelsLoading: false, models: [...prevState.models || [], action.model] };
            const modelState: BookingModelState = { modelLoading: false, model: action.model };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.createFailure: return { ...prevState, modelLoading: true };

        case ActionTypes.updateRequest: return { ...prevState, modelLoading: true };
        case ActionTypes.updateSuccess: {
            const modelsState: BookingModelsState = { modelsLoading: false, models: prevState.models?.map(o => o.id === action.model.id ? action.model : o) || [] };
            const modelState: BookingModelState = { modelLoading: false, model: action.model };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.updateFailure: return { ...prevState, };

        case ActionTypes.deleteRequest: return { ...prevState, deleting: true };
        case ActionTypes.deleteSuccess: {
            const updatedModels = prevState.models?.filter((model) => action.ids.some(o => o == model.id)) || [];
            return { ...prevState, deleting: false, modelsLoading: false, models: updatedModels };
        }
        case ActionTypes.deleteFailure: return { ...prevState, deleting: false };

        case ActionTypes.clearEditionState: return { ...initialState };
        default: return prevState;
    }
}