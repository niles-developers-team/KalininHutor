import { AuthenticatedUser, User } from "../../models";
import { ModelLoading, ModelLoaded, ModelsLoading, ModelsLoaded, ModelsDeleting, ModelsDeleted } from "../appState";

export type Authenticating = {
    authenticating: true;
    signinRequest: User.SigninRequest;
}

export type Authenticated = {
    authenticating: false;
    authenticated?: boolean;
    currentUser?: AuthenticatedUser;
}

export type ModelState = ModelLoading | ModelLoaded<User>;
export type ModelsState = ModelsLoading | ModelsLoaded<User>;
export type DeleteState = ModelsDeleting<User.DeleteRequest> | ModelsDeleted;
export type AuthenticationState = Authenticating | Authenticated;
export type UserState = AuthenticationState & ModelState & ModelsState & DeleteState;