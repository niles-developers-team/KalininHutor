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
        case ActionTypes.signinRequest: return { ...prevState, authenticating: true, signinRequest: action.request };
        case ActionTypes.signinSuccess: return { ...prevState, authenticating: false, authenticated: true, currentUser: action.user };
        case ActionTypes.signinFailure: return { ...prevState, authenticating: false, authenticated: false };

        case ActionTypes.signOut: return { ...prevState, authenticating: false, authenticated: false };

        case ActionTypes.getCurrentUserRequest: return { ...prevState, modelLoading: true };
        case ActionTypes.getCurrentUserSuccess: {
            const modelState: UserModelState = { modelLoading: false, model: action.user };
            const authState: AuthenticationState = { authenticating: false, authenticated: true, currentUser: action.user }
            return { ...prevState, ...modelState, ...authState };
        }
        case ActionTypes.getCurrentUserFailure: return { ...prevState, modelLoading: true, authenticating: false, authenticated: false };

        case ActionTypes.getUserRequest: return { ...prevState, modelLoading: true };
        case ActionTypes.getUserSuccess: return { ...prevState, modelLoading: false, model: action.user };
        case ActionTypes.getUserFailure: return { ...prevState, modelLoading: true };

        case ActionTypes.getUsersRequest: return { ...prevState, modelsLoading: true };
        case ActionTypes.getUsersSuccess: return { ...prevState, modelsLoading: false, models: action.users };
        case ActionTypes.getUsersFailure: return { ...prevState, modelsLoading: false, models: [] };

        case ActionTypes.updateRequest: return { ...prevState, modelLoading: true };
        case ActionTypes.updateSuccess: {
            const modelsState: UserModelsState = { modelsLoading: false, models: prevState.models?.map(o => o.id === action.model.id ? action.model : o) || [] };
            const modelState: UserModelState = { modelLoading: false, model: action.model };
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