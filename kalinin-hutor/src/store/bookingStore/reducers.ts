import { ActionTypes, BookingActions } from "./actions";
import { BookingState, BookingModelsState, BookingModelState } from "./state";

const initialState: BookingState = {
    modelsLoading: true,
    modelLoading: true,
    deleting: false,
    models: [],
    model: undefined
}

export function bookingReducer(prevState: BookingState = initialState, action: BookingActions.BookingActions): BookingState {
    switch (action.type) {
        case ActionTypes.getBookingRequest: return { ...prevState, modelLoading: true };
        case ActionTypes.getBookingSuccess: return { ...prevState, modelLoading: false, model: action.booking };
        case ActionTypes.getBookingFailure: return { ...prevState, modelLoading: true, model: undefined };

        case ActionTypes.getBookingsRequest: return { ...prevState, modelsLoading: true, modelLoading: true };
        case ActionTypes.getBookingsSuccess: return { ...prevState, modelsLoading: false, models: action.bookings };
        case ActionTypes.getBookingsFailure: return { ...prevState, modelsLoading: false, models: [] };

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
        case ActionTypes.updateFailure: return { ...prevState, modelLoading: true };

        case ActionTypes.deleteRequest: return { ...prevState, deleting: true };
        case ActionTypes.deleteSuccess: {
            const updatedModels = prevState.models?.filter((model) => model.id !== action.id) || [];
            return { ...prevState, deleting: false, modelsLoading: false, models: updatedModels };
        }
        case ActionTypes.deleteFailure: return { ...prevState, deleting: false };

        case ActionTypes.clearEditionState: return { ...initialState };
        default: return prevState;
    }
}