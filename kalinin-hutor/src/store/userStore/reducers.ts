import { ModelLoading } from "../appState";
import { ActionTypes, UserActions } from "./actions";
import { AuthenticationState, DeleteState, ModelsState, ModelState, UserState } from "./state";

const initialState: UserState = {
    authenticating: false,
    modelsLoading: true,
    modelLoading: false,
    deleting: false
}

export function userReducer(prevState: UserState = initialState, action: UserActions.UserActions): UserState {
    switch (action.type) {
        case ActionTypes.signinRequest: {
            const state: AuthenticationState = { authenticating: true, signinRequest: action.request };
            return { ...prevState, ...state };
        }
        case ActionTypes.signinSuccess: {
            const state: AuthenticationState = { authenticating: false, authenticated: true, currentUser: action.user }
            return { ...prevState, ...state };
        }
        case ActionTypes.signinFailure: {
            const state: AuthenticationState = { authenticating: false, authenticated: false }
            return { ...prevState, ...state };
        }

        case ActionTypes.signOut: {
            const state: AuthenticationState = { authenticating: false, authenticated: false, currentUser: undefined }
            return { ...prevState, ...state };
        }

        case ActionTypes.getCurrentUserRequest: {
            const state: ModelState = { modelLoading: true }
            return { ...prevState, ...state };
        }
        case ActionTypes.getCurrentUserSuccess: {
            const modelState: ModelState = { modelLoading: false };
            const authState: AuthenticationState = { authenticating: false, authenticated: true, currentUser: action.user }
            return { ...prevState, ...modelState, ...authState };
        }
        case ActionTypes.getUserFailure: {
            const state: ModelState = { modelLoading: false, model: undefined };
            const authState: AuthenticationState = { authenticating: false, authenticated: false, currentUser: undefined }
            return { ...prevState, ...state };
        }

        case ActionTypes.getUserRequest: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getUserSuccess: {
            const state: ModelState = { modelLoading: false, model: action.user };
            return { ...prevState, ...state };
        }
        case ActionTypes.getUserFailure: {
            const state: ModelState = { modelLoading: false, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionTypes.getUsersRequest: {
            const state: ModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getUsersSuccess: {
            const state: ModelsState = { modelsLoading: false, models: action.users };
            return { ...prevState, ...state };
        }
        case ActionTypes.getUsersFailure: {
            const state: ModelsState = { modelsLoading: false, models: [] };
            return { ...prevState, ...state };
        }

        case ActionTypes.updateRequest: return prevState;
        case ActionTypes.updateSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;
            
            const updatedModel = { ...prevState.model, ...action.model };
            const updatedModels = prevState.models.map(o => o.id === action.model.id ? action.model : o);

            const modelsState: ModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: ModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.updateFailure: return prevState;

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