import { AuthenticatedUser, User } from "../../models";
import { ModelLoadingState, ModelLoadedState, ModelsLoadingState, ModelsLoadedState, ModelsDeletingState, ModelsDeletedState } from "../appState";

export type Authenticating = {
    authenticating: true;
    signinRequest: User.SigninRequest;
    currentUser?: AuthenticatedUser;
}

export type Authenticated = {
    authenticating: false;
    authenticated: boolean;
    currentUser?: AuthenticatedUser;
}

export type UserModelState = ModelLoadingState<User> | ModelLoadedState<User>;
export type UserModelsState = ModelsLoadingState<User> | ModelsLoadedState<User>;
export type UserDeleteState = ModelsDeletingState | ModelsDeletedState;
export type AuthenticationState = Authenticating | Authenticated;
export type UserState = AuthenticationState & UserModelState & UserModelsState & UserDeleteState;