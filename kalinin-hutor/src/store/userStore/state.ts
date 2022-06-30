import { AuthenticatedUser, User } from "../../models";
import { ModelLoadingState, ModelLoadedState, ModelsLoadingState, ModelsLoadedState, ModelsDeletingState, ModelsDeletedState } from "../appState";

export type Authenticating = {
    authenticating: true;
    signinRequest: User.SigninRequest;
}

export type Authenticated = {
    authenticating: false;
    authenticated?: boolean;
    currentUser?: AuthenticatedUser;
}

export type UserModelState = ModelLoadingState | ModelLoadedState<User>;
export type UserModelsState = ModelsLoadingState | ModelsLoadedState<User>;
export type UserDeleteState = ModelsDeletingState<User.DeleteRequest> | ModelsDeletedState;
export type AuthenticationState = Authenticating | Authenticated;
export type UserState = AuthenticationState & UserModelState & UserModelsState & UserDeleteState;