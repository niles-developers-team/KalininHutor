import { EntityStatus, RentalObject } from "../../models";
import { ActionTypes, RentalObjectActions } from "./actions";
import { RentalObjectState, RentalObjectDeleteState, RentalObjectModelsState, RentalObjectModelState, RentalObjectModelSpecsState } from "./state";

const initialState: RentalObjectState = {
    modelsLoading: true,
    modelLoading: true,
    saving: false,
    modelSpecsLoading: true,
    deleting: false
}

export function rentalObjectReducer(prevState: RentalObjectState = initialState, action: RentalObjectActions.RentalObjectActions): RentalObjectState {
    switch (action.type) {
        case ActionTypes.getRentalObjectRequest: return { ...prevState, modelLoading: true };
        case ActionTypes.getRentalObjectSuccess: {
            const state: RentalObjectModelState = { modelLoading: false, model: action.rentalobject };
            return { ...prevState, ...state };
        }
        case ActionTypes.getRentalObjectFailure: return { ...prevState, modelLoading: true };

        case ActionTypes.getRentalObjectsRequest: return { ...prevState, modelsLoading: true, modelLoading: true };
        case ActionTypes.getRentalObjectsSuccess: {
            const state: RentalObjectModelsState = { modelsLoading: false, models: action.rentalobjects };
            return { ...prevState, ...state };
        }
        case ActionTypes.getRentalObjectsFailure: {
            const state: RentalObjectModelsState = { modelsLoading: false, models: [] };
            return { ...prevState, ...state };
        }

        case ActionTypes.createRequest: return { ...prevState, saving: true };
        case ActionTypes.createSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;

            const model = { ...prevState.model, ...action.model };
            const models = prevState.models.concat(action.model);

            const modelsState: RentalObjectModelsState = { modelsLoading: false, models: models };
            const modelState: RentalObjectModelState = { modelLoading: false, model: model };
            return { ...prevState, ...modelsState, ...modelState, saving: false, saved: true };
        }
        case ActionTypes.createFailure: return { ...prevState, saving: false, saved: false };

        case ActionTypes.updateRequest: return { ...prevState, saving: true };
        case ActionTypes.updateSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;

            const updatedModel = { ...prevState.model, ...action.model };
            const updatedModels = prevState.models.map(o => o.id === action.model.id ? action.model : o);

            const modelsState: RentalObjectModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: RentalObjectModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState, saving: false, saved: true };
        }
        case ActionTypes.updateFailure: return { ...prevState, saving: false, saved: false };

        case ActionTypes.deleteRequest: {
            const deleteState: RentalObjectDeleteState = { deleting: true, deleteRequest: action.request };
            return { ...prevState, ...deleteState };
        }
        case ActionTypes.deleteSuccess: {
            if (prevState.modelsLoading === false && prevState.deleting === true) {
                const models = prevState.models.filter((model) => prevState.deleteRequest && prevState.deleteRequest.ids.indexOf(model.id || '') === -1);
                const state: RentalObjectModelsState = { modelsLoading: false, models: models };
                const deleteState: RentalObjectDeleteState = { deleting: false, deleted: true };
                return { ...prevState, ...deleteState, ...state };
            }

            return prevState;
        }
        case ActionTypes.deleteFailure: {
            const deleteState: RentalObjectDeleteState = { deleting: false, deleted: false };
            return { ...prevState, ...deleteState };
        }

        case ActionTypes.getRoomVariantsRequest: return { ...prevState, modelSpecsLoading: true };
        case ActionTypes.getRoomVariantsSuccess: {
            if (prevState.modelLoading === true) return prevState;
            if (prevState.model === undefined) return prevState;

            const state: RentalObjectModelSpecsState = { modelSpecsLoading: false };
            const updatedState: RentalObjectModelState = { modelLoading: false, model: { ...prevState.model, roomVariants: action.roomvariants } };

            return { ...prevState, ...state, ...updatedState };
        }
        case ActionTypes.getRoomVariantsFailure: return { ...prevState, modelLoading: true };

        case ActionTypes.appendRoomVariant: {
            if (prevState.modelLoading === true) return prevState;

            const roomVariants = prevState.model?.roomVariants || [];
            const updatedModel = { ...prevState.model, roomVariants: roomVariants.concat({ ...action.roomVariant, entityStatus: EntityStatus.Created }) };

            const modelState: RentalObjectModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelState };
        }
        case ActionTypes.applyRoomVariant: {
            if (prevState.modelLoading === true) return prevState;

            const roomVariants = prevState.model?.roomVariants || [];

            action.roomVariant.entityStatus = action.roomVariant.entityStatus === EntityStatus.Created ? EntityStatus.Created : EntityStatus.Updated;

            const updatedModel = { ...prevState.model, roomVariants: roomVariants.map(o => o.id === action.roomVariant.id ? action.roomVariant : o) };
            const modelState: RentalObjectModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelState };
        }
        case ActionTypes.deleteRoomVariant: {
            if (prevState.modelLoading === true) return prevState;

            const roomVariants = prevState.model?.roomVariants || [];

            const updatedModel = { ...prevState.model, roomVariants: roomVariants.map(o => o.id === action.id ? { ...o, entityStatus: EntityStatus.Deleted } : o) };
            const modelState: RentalObjectModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelState, saving: false };
        }

        case ActionTypes.applyEditionState: {
            if (prevState.modelLoading === true) return prevState;

            return { ...prevState, model: { ...prevState.model, ...action.model } };
        }
        case ActionTypes.clearEditionState: return { ...prevState, modelLoading: true, modelSpecsLoading: true, saving: false };
        default: return prevState;
    }
}