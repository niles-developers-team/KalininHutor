import { EntityStatus } from "../../models";
import { ActionTypes, BookingActions } from "./actions";
import { BookingState, DeleteState, ModelsState, ModelState, SavingState } from "./state";

const initialState: BookingState = {
    modelsLoading: true,
    modelLoading: true,
    saving: true,
    deleting: false
}

export function bookingReducer(prevState: BookingState = initialState, action: BookingActions.BookingActions): BookingState {
    switch (action.type) {
        case ActionTypes.getBookingRequest: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getBookingSuccess: {
            const state: ModelState = { modelLoading: false, model: action.booking };
            return { ...prevState, ...state };
        }
        case ActionTypes.getBookingFailure: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }

        case ActionTypes.getBookingsRequest: {
            const state: ModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getBookingsSuccess: {
            const state: ModelsState = { modelsLoading: false, models: action.bookings };
            return { ...prevState, ...state };
        }
        case ActionTypes.getBookingsFailure: {
            const state: ModelsState = { modelsLoading: false, models: [] };
            return { ...prevState, ...state };
        }

        case ActionTypes.createRequest: {
            return { ...prevState, modelLoading: true, saving: true };
        }
        case ActionTypes.createSuccess: {
            const models = [...prevState.models || [], action.model];

            const modelsState: ModelsState = { modelsLoading: false, models: models };
            const modelState: ModelState = { modelLoading: false, model: action.model };
            let savingState: SavingState = { saving: true };
            if (action.model.entityStatus !== EntityStatus.Draft) {
                savingState = { saving: false, saved: true };
            }
            return { ...prevState, ...modelsState, ...modelState, ...savingState };
        }
        case ActionTypes.createFailure: {
            return { ...prevState, modelLoading: true, saving: false, saved: false };
        }

        case ActionTypes.updateRequest: {
            return { ...prevState, modelLoading: true, saving: true };
        }
        case ActionTypes.updateSuccess: {
            const updatedModels = prevState.models?.map(o => o.id === action.model.id ? action.model : o) || [];

            const modelsState: ModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: ModelState = { modelLoading: false, model: action.model };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.updateFailure: {
            return { ...prevState, modelLoading: true };
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
        case ActionTypes.clearEditionState: return { ...prevState, modelLoading: true, modelsLoading: true, models: [], model: undefined };
        default: return prevState;
    }
}