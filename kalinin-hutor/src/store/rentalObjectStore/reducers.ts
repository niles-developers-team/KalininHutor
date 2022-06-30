import { RentalObject } from "../../models";
import { ActionTypes, RentalObjectActions } from "./actions";
import { RentalObjectState, RentalObjectDeleteState, RentalObjectModelsState, RentalObjectModelState, RentalObjectCreationState, RentalObjectModelSpecsState } from "./state";

const initialState: RentalObjectState = {
    modelSpecsLoading: true,
    creating: false,
    modelsLoading: true,
    modelLoading: false,
    deleting: false
}

export function rentalObjectReducer(prevState: RentalObjectState = initialState, action: RentalObjectActions.RentalObjectActions): RentalObjectState {
    switch (action.type) {
        case ActionTypes.getRentalObjectRequest: {
            const state: RentalObjectModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getRentalObjectSuccess: {
            let creationState: RentalObjectCreationState = { creating: false };
            if (!action.rentalobject.id) {
                creationState = { creating: true, model: action.rentalobject };
            }
            const state: RentalObjectModelState = { modelLoading: false, model: action.rentalobject };
            return { ...prevState, ...state, ...creationState };
        }
        case ActionTypes.getRentalObjectFailure: {
            const state: RentalObjectModelState = { modelLoading: false, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionTypes.getRentalObjectsRequest: {
            const state: RentalObjectModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getRentalObjectsSuccess: {
            const state: RentalObjectModelsState = { modelsLoading: false, models: action.rentalobjects };
            return { ...prevState, ...state };
        }
        case ActionTypes.getRentalObjectsFailure: {
            const state: RentalObjectModelsState = { modelsLoading: false, models: [] };
            return { ...prevState, ...state };
        }

        case ActionTypes.createRequest: {
            return { ...prevState, modelLoading: true };
        }
        case ActionTypes.createSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;

            const model = { ...prevState.model, ...action.model };
            const models = prevState.models.concat(action.model);

            const modelsState: RentalObjectModelsState = { modelsLoading: false, models: models };
            const modelState: RentalObjectModelState = { modelLoading: false, model: model };
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

            const modelsState: RentalObjectModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: RentalObjectModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.updateFailure: {
            return { ...prevState, modelLoading: false };
        }

        case ActionTypes.deleteRequest: {
            const deleteState: RentalObjectDeleteState = { deleting: true, deleteRequest: action.request };
            return { ...prevState, ...deleteState };
        }
        case ActionTypes.deleteSuccess: {
            if (prevState.modelsLoading === false && prevState.deleting === true) {
                const state: RentalObjectModelsState = { modelsLoading: false, models: prevState.models.filter((model) => prevState.deleteRequest && model.id !== prevState.deleteRequest.id) };
                const deleteState: RentalObjectDeleteState = { deleting: false, deleted: true };
                return { ...prevState, ...deleteState, ...state };
            }

            return prevState;
        }
        case ActionTypes.deleteFailure: {
            const deleteState: RentalObjectDeleteState = { deleting: false, deleted: false };
            return { ...prevState, ...deleteState };
        }

        case ActionTypes.getRoomVariantsRequest: {
            const state: RentalObjectModelSpecsState = { modelSpecsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getRoomVariantsSuccess: {
            if (prevState.modelLoading === true) return prevState;
            if (prevState.model === undefined) return prevState;

            const state: RentalObjectModelSpecsState = { modelSpecsLoading: false };
            const updatedState: RentalObjectModelState = { modelLoading: false, model: { ...prevState.model, roomVariants: action.roomvariants } };

            return { ...prevState, ...state, ...updatedState };
        }
        case ActionTypes.getRoomVariantsFailure: {
            const state: RentalObjectModelState = { modelLoading: false, model: prevState.model };
            return { ...prevState, ...state };
        }

        case ActionTypes.appendRoomVariant: {
            if (prevState.modelLoading === true) return prevState;

            const roomVariants = prevState.model?.roomVariants || [];

            const updatedModel = { ...prevState.model || RentalObject.initial, roomVariants: roomVariants.concat(action.roomVariant) };
            const modelState: RentalObjectModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelState };
        }
        case ActionTypes.deleteRoomVariant: {
            if (prevState.modelLoading === true) return prevState;

            const roomVariants = prevState.model?.roomVariants || [];

            const updatedModel = { ...prevState.model || RentalObject.initial, roomVariants: roomVariants.filter(o => o.id !== action.id) };
            const modelState: RentalObjectModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelState };
        }
        default: return prevState;
    }
}