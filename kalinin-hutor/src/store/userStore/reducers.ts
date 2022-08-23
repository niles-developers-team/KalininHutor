import { ActionTypes, UserActions } from "./actions";
import { AuthenticationState, UserDeleteState, UserModelsState, UserModelState, UserState } from "./state";

const initialState: UserState = {
    authenticating: false,
    authenticated: false,
    modelsLoading: true,
    modelLoading: true,
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
            const state: AuthenticationState = { authenticating: false, authenticated: false }
            return { ...prevState, ...state };
        }

        case ActionTypes.getCurrentUserRequest: {
            const state: UserModelState = { modelLoading: true }
            return { ...prevState, ...state };
        }
        case ActionTypes.getCurrentUserSuccess: {
            const modelState: UserModelState = { modelLoading: false, model: action.user };
            const authState: AuthenticationState = { authenticating: false, authenticated: true, currentUser: action.user }
            return { ...prevState, ...modelState, ...authState };
        }
        case ActionTypes.getCurrentUserFailure: {
            const state: UserModelState = { modelLoading: true };
            const authState: AuthenticationState = { authenticating: false, authenticated: false }
            return { ...prevState, ...state, ...authState };
        }

        case ActionTypes.getUserRequest: {
            const state: UserModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getUserSuccess: {
            const state: UserModelState = { modelLoading: false, model: action.user };
            return { ...prevState, ...state };
        }
        case ActionTypes.getUserFailure: {
            const state: UserModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }

        case ActionTypes.getUsersRequest: {
            const state: UserModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getUsersSuccess: {
            const state: UserModelsState = { modelsLoading: false, models: action.users };
            return { ...prevState, ...state };
        }
        case ActionTypes.getUsersFailure: {
            const state: UserModelsState = { modelsLoading: false, models: [] };
            return { ...prevState, ...state };
        }

        case ActionTypes.updateRequest: return prevState;
        case ActionTypes.updateSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;
            
            const updatedModel = { ...prevState.model, ...action.model };
            const updatedModels = prevState.models.map(o => o.id === action.model.id ? action.model : o);

            const modelsState: UserModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: UserModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.updateFailure: return prevState;

        case ActionTypes.deleteRequest: {
            const deleteState: UserDeleteState = { deleting: true, deleteRequest: action.request };
            return { ...prevState, ...deleteState };
        }
        case ActionTypes.deleteSuccess: {
            if (prevState.modelsLoading === false && prevState.deleting === true) {
                const state: UserModelsState = { modelsLoading: false, models: prevState.models.filter((model) => prevState.deleteRequest && model.id !== prevState.deleteRequest.id) };
                const deleteState: UserDeleteState = { deleting: false, deleted: true };
                return { ...prevState, ...deleteState, ...state };
            }

            return prevState;
        }
        case ActionTypes.deleteFailure: {
            const deleteState: UserDeleteState = { deleting: false, deleted: false };
            return { ...prevState, ...deleteState };
        }
        default: return prevState;
    }
}