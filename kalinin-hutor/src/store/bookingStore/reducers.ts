import { ActionTypes, BookingActions } from "./actions";
import { BookingState, DeleteState, ModelsState, ModelState } from "./state";

const initialState: BookingState = {
    modelsLoading: true,
    modelLoading: false,
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
            const state: ModelState = { modelLoading: false, model: undefined };
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
            const deleteState: DeleteState = { deleting: true, request: action.request };
            return { ...prevState, ...deleteState };
        }
        case ActionTypes.deleteSuccess: {
            if (prevState.modelsLoading === false) {
                const state: ModelsState = { modelsLoading: false, models: prevState.models.filter((model) => prevState.request && model.id !== prevState.request.id) };
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