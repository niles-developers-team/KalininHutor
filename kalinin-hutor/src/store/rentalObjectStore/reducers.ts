import { ActionTypes, RentalObjectActions } from "./actions";
import { RentalObjectState, DeleteState, ModelsState, ModelState } from "./state";

const initialState: RentalObjectState = {
    modelsLoading: true,
    modelLoading: false,
    deleting: false
}

export function rentalObjectReducer(prevState: RentalObjectState = initialState, action: RentalObjectActions.RentalObjectActions): RentalObjectState {
    switch (action.type) {
        case ActionTypes.getRentalObjectRequest: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getRentalObjectSuccess: {
            const state: ModelState = { modelLoading: false, model: action.rentalobject };
            return { ...prevState, ...state };
        }
        case ActionTypes.getRentalObjectFailure: {
            const state: ModelState = { modelLoading: false, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionTypes.getRentalObjectsRequest: {
            const state: ModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getRentalObjectsSuccess: {
            const state: ModelsState = { modelsLoading: false, models: action.rentalobjects };
            return { ...prevState, ...state };
        }
        case ActionTypes.getRentalObjectsFailure: {
            const state: ModelsState = { modelsLoading: false, models: [] };
            return { ...prevState, ...state };
        }

        case ActionTypes.createRequest: {
            return { ...prevState, modelLoading: true };
        }
        case ActionTypes.createSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;

            const model = { ...prevState.model, ...action.model };
            const models = prevState.models.concat(action.model);

            const modelsState: ModelsState = { modelsLoading: false, models: models };
            const modelState: ModelState = { modelLoading: false, model: model };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.createFailure: {
            return { ...prevState, modelLoading: false };
        }

        case ActionTypes.updateRequest: {
            return { ...prevState, modelLoading: true };
        }
        case ActionTypes.updateSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;

            const updatedModel = { ...prevState.model, ...action.model };
            const updatedModels = prevState.models.map(o => o.id === action.model.id ? action.model : o);

            const modelsState: ModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: ModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.updateFailure: {
            return { ...prevState, modelLoading: false };
        }

        case ActionTypes.deleteRequest: {
            const deleteState: DeleteState = { deleting: true, deleteRequest: action.request };
            return { ...prevState, ...deleteState };
        }
        case ActionTypes.deleteSuccess: {
            if (prevState.modelsLoading === false && prevState.deleting === true) {
                const state: ModelsState = { modelsLoading: false, models: prevState.models.filter((model) => prevState.deleteRequest && model.id !== prevState.deleteRequest.id) };
                const deleteState: DeleteState = { deleting: false, deleted: true };
                return { ...prevState, ...deleteState, ...state };
            }

            return prevState;
        }
        case ActionTypes.deleteFailure: {
            const deleteState: DeleteState = { deleting: false, deleted: false };
            return { ...prevState, ...deleteState };
        }
        default: return prevState;
    }
}