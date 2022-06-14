import { Action } from "redux";
import { ApplicationError, RentalObject, SnackbarVariant } from "../../models";
import { rentalObjectService } from "../../services";
import { AppThunkAction, AppThunkDispatch, AppState } from "../appState";
import { SnackbarActions } from "../snackbarStore/actions";

export enum ActionTypes {
    getRentalObjectsRequest = 'GET_RENTALOBJECTS_REQUEST',
    getRentalObjectsSuccess = 'GET_RENTALOBJECTS_SUCCESS',
    getRentalObjectsFailure = 'GET_RENTALOBJECTS_FAILURE',

    getRentalObjectRequest = 'GET_RENTALOBJECT_REQUEST',
    getRentalObjectSuccess = 'GET_RENTALOBJECT_SUCCESS',
    getRentalObjectFailure = 'GET_RENTALOBJECT_FAILURE',

    createRequest = 'CREATE_RENTALOBJECT_REQUEST',
    createSuccess = 'CREATE_RENTALOBJECT_SUCCESS',
    createFailure = 'CREATE_RENTALOBJECT_FAILURE',

    updateRequest = 'UPDATE_RENTALOBJECT_REQUEST',
    updateSuccess = 'UPDATE_RENTALOBJECT_SUCCESS',
    updateFailure = 'UPDATE_RENTALOBJECT_FAILURE',

    clearEditionState = 'CLEAR_EDITION_STATE',

    deleteRequest = 'DELETE_RENTALOBJECT_REQUEST',
    deleteSuccess = 'DELETE_RENTALOBJECT_SUCCESS',
    deleteFailure = 'DELETE_RENTALOBJECT_FAILURE',
}

export namespace RentalObjectActions {
    interface GetRentalObjectsRequestAction extends Action<ActionTypes> {
        type: ActionTypes.getRentalObjectsRequest;
        query?: RentalObject.GetQuery;
    }

    interface GetRentalObjectsSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.getRentalObjectsSuccess;
        rentalobjects: RentalObject[];
    }

    interface GetRentalObjectsFailureAction extends Action<ActionTypes> {
        type: ActionTypes.getRentalObjectsFailure;
        error: ApplicationError;
    }

    interface GetRequestAction extends Action<ActionTypes> {
        type: ActionTypes.getRentalObjectRequest;
        id: string;
    }

    interface GetSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.getRentalObjectSuccess;
        rentalobject: RentalObject;
    }

    interface GetFailureAction extends Action<ActionTypes> {
        type: ActionTypes.getRentalObjectFailure;
        error: ApplicationError;
    }

    interface CreateRequestAction extends Action<ActionTypes> {
        type: ActionTypes.createRequest;
        request: RentalObject.CreateRequest;
    }

    interface CreateSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.createSuccess;
        model: RentalObject;
    }

    interface CreateFailureAction extends Action<ActionTypes> {
        type: ActionTypes.createFailure;
        error: ApplicationError;
    }

    interface UpdateRequestAction extends Action<ActionTypes> {
        type: ActionTypes.updateRequest;
        request: RentalObject.UpdateRequest;
    }

    interface UpdateSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.updateSuccess;
        model: RentalObject;
    }

    interface UpdateFailureAction extends Action<ActionTypes> {
        type: ActionTypes.updateFailure;
        error: ApplicationError;
    }

    interface ClearEditionStateAction extends Action<ActionTypes> {
        type: ActionTypes.clearEditionState;
    }

    interface DeleteRequestAction extends Action<ActionTypes> {
        type: ActionTypes.deleteRequest;
        request: RentalObject.DeleteRequest;
    }

    interface DeleteSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.deleteSuccess;
    }

    interface DeleteFailureAction extends Action<ActionTypes> {
        type: ActionTypes.deleteFailure;
        error: ApplicationError;
    }

    type GetRentalObjects = GetRentalObjectsRequestAction | GetRentalObjectsSuccessAction | GetRentalObjectsFailureAction;
    type GetRentalObject = GetRequestAction | GetSuccessAction | GetFailureAction;
    type CreateRentalObject = CreateRequestAction | CreateSuccessAction | CreateFailureAction;
    type UpdateRentalObject = UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction;
    type DeleteRentalObject = DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction;

    export type RentalObjectActions = GetRentalObjects
        | GetRentalObject
        | ClearEditionStateAction
        | CreateRentalObject
        | UpdateRentalObject
        | DeleteRentalObject;

    export function createRentalObject(createRequest: RentalObject.CreateRequest): AppThunkAction<Promise<CreateSuccessAction | CreateFailureAction>> {
        return async (dispatch) => {
            dispatch(request(createRequest));

            try {
                const result = await rentalObjectService.create(createRequest);
                dispatch(SnackbarActions.showSnackbar('Бронь успешно сохранена', SnackbarVariant.success));
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(createRequest: RentalObject.CreateRequest): CreateRequestAction { return { type: ActionTypes.createRequest, request: createRequest }; }
            function success(rentalobject: RentalObject): CreateSuccessAction { return { type: ActionTypes.createSuccess, model: rentalobject }; }
            function failure(error: ApplicationError): CreateFailureAction { return { type: ActionTypes.createFailure, error: error }; }
        }
    }

    export function updateRentalObject(updateRequest: RentalObject.UpdateRequest): AppThunkAction<Promise<UpdateSuccessAction | UpdateFailureAction>> {
        return async (dispatch) => {
            dispatch(request(updateRequest));

            try {
                const result = await rentalObjectService.update(updateRequest);
                dispatch(SnackbarActions.showSnackbar('Пользователь успешно сохранен', SnackbarVariant.success));
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(updateRequest: RentalObject.UpdateRequest): UpdateRequestAction { return { type: ActionTypes.updateRequest, request: updateRequest }; }
            function success(rentalobject: RentalObject): UpdateSuccessAction { return { type: ActionTypes.updateSuccess, model: rentalobject }; }
            function failure(error: ApplicationError): UpdateFailureAction { return { type: ActionTypes.updateFailure, error: error }; }
        }
    }

    export function clearEditionState(): ClearEditionStateAction {
        return { type: ActionTypes.clearEditionState };
    }

    export function getRentalObjects(query?: RentalObject.GetQuery): AppThunkAction<Promise<GetRentalObjectsSuccessAction | GetRentalObjectsFailureAction>> {
        return async dispatch => {
            dispatch(request(query));

            try {
                const result = await rentalObjectService.get(query);
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(query?: RentalObject.GetQuery): GetRentalObjectsRequestAction { return { type: ActionTypes.getRentalObjectsRequest, query: query }; }
            function success(rentalobjects: RentalObject[]): GetRentalObjectsSuccessAction { return { type: ActionTypes.getRentalObjectsSuccess, rentalobjects: rentalobjects }; }
            function failure(error: ApplicationError): GetRentalObjectsFailureAction { return { type: ActionTypes.getRentalObjectsFailure, error: error }; }
        }
    }

    export function getRentalObject(id: string): AppThunkAction<Promise<GetSuccessAction | GetFailureAction>> {
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            dispatch(request(id));

            if (!id)
                return dispatch(success(RentalObject.initial));

            const state = getState();
            let models: RentalObject[] = [];

            try {
                if (state.rentalObjectState.modelsLoading === true)
                    models = await rentalObjectService.get({ id });
                else
                    models = state.rentalObjectState.models;

                let model = models.find(o => o.id === id);

                if (!model) {
                    throw new ApplicationError('Не удалось найти пользователя');
                }

                return dispatch(success(model));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(id: string): GetRequestAction { return { type: ActionTypes.getRentalObjectRequest, id: id }; }
            function success(rentalobject: RentalObject): GetSuccessAction { return { type: ActionTypes.getRentalObjectSuccess, rentalobject: rentalobject }; }
            function failure(error: ApplicationError): GetFailureAction { return { type: ActionTypes.getRentalObjectFailure, error: error }; }
        }
    }

    export function deleteRentalObjects(deleteRequest: RentalObject.DeleteRequest): AppThunkAction<Promise<DeleteSuccessAction | DeleteFailureAction>> {
        return async (dispatch) => {
            dispatch(request(deleteRequest));

            try {
                await rentalObjectService.delete(deleteRequest);
                dispatch(SnackbarActions.showSnackbar('Пользователь успешно удален.', SnackbarVariant.info));
                return dispatch(success());
            }
            catch (error: any) {

                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));
                return dispatch(failure(error));
            }

            function request(request: RentalObject.DeleteRequest): DeleteRequestAction { return { type: ActionTypes.deleteRequest, request: request }; }
            function success(): DeleteSuccessAction { return { type: ActionTypes.deleteSuccess }; }
            function failure(error: ApplicationError): DeleteFailureAction { return { type: ActionTypes.deleteFailure, error: error }; }
        }
    }
}