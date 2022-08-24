import { Action } from "redux";
import { AuthenticatedUser, ApplicationError, User, SnackbarVariant } from "../../models";
import { sessionService } from "../../services";
import { userService } from "../../services";
import { AppThunkAction, AppThunkDispatch, AppState } from "../appState";
import { SnackbarActions } from "../snackbarStore/actions";

export enum ActionTypes {
    signinRequest = 'SIGN_IN_REQUEST',
    signinSuccess = 'SIGN_IN_SUCCESS',
    signinFailure = 'SIGN_IN_FAILURE',

    signupRequest = 'SIGN_UP_REQUEST',
    signupSuccess = 'SIGN_UP_SUCCESS',
    signupFailure = 'SIGN_UP_FAILURE',

    signOut = 'SIGN_OUT',

    getCurrentUserRequest = 'GET_CURRENT_USER_REQUEST',
    getCurrentUserSuccess = 'GET_CURRENT_USER_SUCCESS',
    getCurrentUserFailure = 'GET_CURRENT_USER_FAILURE',

    getUsersRequest = 'GET_USERS_REQUEST',
    getUsersSuccess = 'GET_USERS_SUCCESS',
    getUsersFailure = 'GET_USERS_FAILURE',

    getUserRequest = 'GET_USER_REQUEST',
    getUserSuccess = 'GET_USER_SUCCESS',
    getUserFailure = 'GET_USER_FAILURE',

    createDraft = 'CREATE_DRAFT',
    updateDraft = 'UPDATE_DRAFT',

    updateRequest = 'UPDATE_USER_REQUEST',
    updateSuccess = 'UPDATE_USER_SUCCESS',
    updateFailure = 'UPDATE_USER_FAILURE',

    clearEditionState = 'CLEAR_EDITION_STATE',

    deleteRequest = 'DELETE_USER_REQUEST',
    deleteSuccess = 'DELETE_USER_SUCCESS',
    deleteFailure = 'DELETE_USER_FAILURE',
}

export namespace UserActions {
    export interface SigninRequestAction extends Action<ActionTypes> {
        type: ActionTypes.signinRequest;
        request: User.SigninRequest;
    }

    export interface SigninSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.signinSuccess;
        user: AuthenticatedUser;
    }

    export interface SigninFailureAction extends Action<ActionTypes> {
        type: ActionTypes.signinFailure;
        error: ApplicationError;
    }

    export interface SignoutAction extends Action<ActionTypes> {
        type: ActionTypes.signOut;
    }

    export interface SignupRequestAction extends Action<ActionTypes> {
        type: ActionTypes.signupRequest;
        request: User.SignupRequest;
    }

    export interface SignupSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.signupSuccess;
        user: AuthenticatedUser;
    }

    export interface SignupFailureAction extends Action<ActionTypes> {
        type: ActionTypes.signupFailure;
        error: ApplicationError;
    }

    export interface GetCurrentUserRequestAction extends Action<ActionTypes> {
        type: ActionTypes.getCurrentUserRequest;
        currentUserLoading: true;
    }

    export interface GetCurrentUserSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.getCurrentUserSuccess;
        currentUserLoading?: boolean;
        user: User;
    }

    export interface GetCurrentUserFailureAction extends Action<ActionTypes> {
        type: ActionTypes.getCurrentUserFailure;
        error: ApplicationError;
    }

    export interface GetUsersRequestAction extends Action<ActionTypes> {
        type: ActionTypes.getUsersRequest;
        query?: User.GetQuery;
    }

    export interface GetUsersSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.getUsersSuccess;
        users: User[];
    }

    export interface GetUsersFailureAction extends Action<ActionTypes> {
        type: ActionTypes.getUsersFailure;
        error: ApplicationError;
    }

    export interface GetRequestAction extends Action<ActionTypes> {
        type: ActionTypes.getUserRequest;
        id: string;
    }

    export interface GetSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.getUserSuccess;
        user: User;
    }

    export interface GetFailureAction extends Action<ActionTypes> {
        type: ActionTypes.getUserFailure;
        error: ApplicationError;
    }

    export interface UpdateRequestAction extends Action<ActionTypes> {
        type: ActionTypes.updateRequest;
    }

    export interface UpdateSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.updateSuccess;
        model: User;
    }

    export interface UpdateFailureAction extends Action<ActionTypes> {
        type: ActionTypes.updateFailure;
        error: ApplicationError;
    }

    export interface ClearEditionStateAction extends Action<ActionTypes> {
        type: ActionTypes.clearEditionState;
    }

    export interface DeleteRequestAction extends Action<ActionTypes> {
        type: ActionTypes.deleteRequest;
    }

    export interface DeleteSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.deleteSuccess;
        id: string;
    }

    export interface DeleteFailureAction extends Action<ActionTypes> {
        type: ActionTypes.deleteFailure;
        error: ApplicationError;
    }

    interface CreateDraftAction extends Action<ActionTypes> {
        type: ActionTypes.createDraft;
        draft: User;
    }

    interface UpdateDraftAction extends Action<ActionTypes> {
        type: ActionTypes.updateDraft;
        draft: User;
    }

    type Signin = SigninRequestAction | SigninSuccessAction | SigninFailureAction;
    type Signup = SignupRequestAction | SignupSuccessAction | SignupFailureAction;
    type GetCurrentUser = GetCurrentUserRequestAction | GetCurrentUserSuccessAction | GetCurrentUserFailureAction;
    type GetUsers = GetUsersRequestAction | GetUsersSuccessAction | GetUsersFailureAction;
    type GetUser = GetRequestAction | GetSuccessAction | GetFailureAction
    type DraftUser  = CreateDraftAction | UpdateDraftAction;
    type UpdateUser = UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction;
    type DeleteUser = DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction;

    export type UserActions = Signin
        | Signup
        | SignoutAction
        | GetCurrentUser
        | GetUsers
        | GetUser
        | ClearEditionStateAction
        | UpdateUser
        | DeleteUser;

    export function signin(options: User.SigninRequest): AppThunkAction<Promise<SigninSuccessAction | SigninFailureAction>> {
        return async (dispatch: AppThunkDispatch) => {
            dispatch(request(options));

            try {
                const result = await userService.signin(options);
                if (result && result.token && sessionService.signIn(result.token)) {
                    return dispatch(success(result));
                } else {
                    throw new ApplicationError('Неправильное имя пользователя или пароль');
                }
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(options: User.SigninRequest): SigninRequestAction { return { type: ActionTypes.signinRequest, request: options }; }
            function success(user: AuthenticatedUser): SigninSuccessAction { return { type: ActionTypes.signinSuccess, user: user }; }
            function failure(error: ApplicationError): SigninFailureAction { return { type: ActionTypes.signinFailure, error: error }; }
        }
    }

    export function signup(options: User.SignupRequest): AppThunkAction<Promise<SignupSuccessAction | SignupFailureAction>> {
        return async (dispatch: AppThunkDispatch) => {
            dispatch(request(options));

            try {
                const result = await userService.signup(options);
                if (result && result.token && sessionService.signIn(result.token)) {
                    return dispatch(success(result));
                } else {
                    throw new ApplicationError('Неправильное имя пользователя или пароль');
                }
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(options: User.SignupRequest): SignupRequestAction { return { type: ActionTypes.signupRequest, request: options }; }
            function success(user: AuthenticatedUser): SignupSuccessAction { return { type: ActionTypes.signupSuccess, user: user }; }
            function failure(error: ApplicationError): SignupFailureAction { return { type: ActionTypes.signupFailure, error: error }; }
        }
    }

    export function signout(): SignoutAction {
        userService.signout();
        return { type: ActionTypes.signOut };
    }

    export function getCurrentUser(): AppThunkAction<Promise<GetCurrentUserSuccessAction | GetCurrentUserFailureAction>> {
        return async (dispatch: AppThunkDispatch) => {
            dispatch(request());

            try {
                let user: User | undefined = undefined;
                user = await userService.getCurrentUser();
                if (!user) {
                    throw new ApplicationError('Не удалось найти пользователя');
                }

                return dispatch(success(user));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(): GetCurrentUserRequestAction { return { type: ActionTypes.getCurrentUserRequest, currentUserLoading: true }; }
            function success(user: User): GetCurrentUserSuccessAction { return { type: ActionTypes.getCurrentUserSuccess, currentUserLoading: false, user: user }; }
            function failure(error: ApplicationError): GetCurrentUserFailureAction { return { type: ActionTypes.getCurrentUserFailure, error: error }; }
        }
    }

    export function updateDraft(user: User): UpdateSuccessAction {
        return { type: ActionTypes.updateSuccess, model: user };
    }

    export function updateUser(user: User): AppThunkAction<Promise<UpdateSuccessAction | UpdateFailureAction>> {
        return async (dispatch) => {
            dispatch(request());

            try {
                const result = await userService.update({
                    id: user.id || '',
                    phoneNumber: user.phoneNumber,
                    birthday: user.birthday || undefined,
                    email: user.email,
                    lastname: user.lastname,
                    name: user.name
                });
                dispatch(SnackbarActions.showSnackbar('Пользователь успешно сохранен', SnackbarVariant.success));
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(): UpdateRequestAction { return { type: ActionTypes.updateRequest }; }
            function success(user: User): UpdateSuccessAction { return { type: ActionTypes.updateSuccess, model: user }; }
            function failure(error: ApplicationError): UpdateFailureAction { return { type: ActionTypes.updateFailure, error: error }; }
        }
    }

    export function clearEditionState(): ClearEditionStateAction {
        return { type: ActionTypes.clearEditionState };
    }

    export function getUsers(options?: User.GetQuery): AppThunkAction<Promise<GetUsersSuccessAction | GetUsersFailureAction>> {
        return async dispatch => {
            dispatch(request(options));

            try {
                const result = await userService.get(options);
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(options?: User.GetQuery): GetUsersRequestAction { return { type: ActionTypes.getUsersRequest, query: options }; }
            function success(users: User[]): GetUsersSuccessAction { return { type: ActionTypes.getUsersSuccess, users: users }; }
            function failure(error: ApplicationError): GetUsersFailureAction { return { type: ActionTypes.getUsersFailure, error: error }; }
        }
    }

    export function getUser(id: string): AppThunkAction<Promise<GetSuccessAction | GetFailureAction>> {
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            dispatch(request(id));

            if (!id)
                return dispatch(success(User.initial));

            const state = getState();

            try {
                let user: User | undefined = undefined;
                if (state.userState.modelsLoading === true)
                    user = await userService.getDetails(id);
                else
                    user = state.userState.models.find(o => o.id === id);

                if (!user) {
                    throw new ApplicationError('Не удалось найти пользователя');
                }

                return dispatch(success(user));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(id: string): GetRequestAction { return { type: ActionTypes.getUserRequest, id: id }; }
            function success(user: User): GetSuccessAction { return { type: ActionTypes.getUserSuccess, user: user }; }
            function failure(error: ApplicationError): GetFailureAction { return { type: ActionTypes.getUserFailure, error: error }; }
        }
    }

    export function deleteUsers(deleteRequest: User.DeleteRequest): AppThunkAction<Promise<DeleteSuccessAction | DeleteFailureAction>> {
        return async (dispatch) => {
            dispatch(request());

            try {
                await userService.delete(deleteRequest);
                dispatch(SnackbarActions.showSnackbar('Пользователь успешно удален.', SnackbarVariant.info));
                return dispatch(success(deleteRequest.id));
            }
            catch (error: any) {

                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));
                return dispatch(failure(error));
            }

            function request(): DeleteRequestAction { return { type: ActionTypes.deleteRequest }; }
            function success(id: string): DeleteSuccessAction { return { type: ActionTypes.deleteSuccess, id: id }; }
            function failure(error: ApplicationError): DeleteFailureAction { return { type: ActionTypes.deleteFailure, error: error }; }
        }
    }
}