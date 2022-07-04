import { Action } from "redux";
import { ApplicationError, RentalObject, RoomVariant, SnackbarVariant } from "../../models";
import { rentalObjectService, roomVariantService } from "../../services";
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

    applyEditionState = 'APPLY_EDITION_STATE',
    clearEditionState = 'CLEAR_EDITION_STATE',

    deleteRequest = 'DELETE_RENTALOBJECT_REQUEST',
    deleteSuccess = 'DELETE_RENTALOBJECT_SUCCESS',
    deleteFailure = 'DELETE_RENTALOBJECT_FAILURE',

    getRoomVariantsRequest = 'GET_ROOMVARIANTS_REQUEST',
    getRoomVariantsSuccess = 'GET_ROOMVARIANTS_SUCCESS',
    getRoomVariantsFailure = 'GET_ROOMVARIANTS_FAILURE',

    appendRoomVariant = 'APPEND_ROOMVARIANT',
    applyRoomVariant = 'APPLY_ROOMVARIANT',
    deleteRoomVariant = 'DELETE_ROOMVARIANT',
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
        id: string | undefined;
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

    interface ApplyEditionStateAction extends Action<ActionTypes> {
        type: ActionTypes.applyEditionState;
        model: RentalObject;
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
    interface GetRoomVariantsRequestAction extends Action<ActionTypes> {
        type: ActionTypes.getRoomVariantsRequest;
        rentalObjectId: string | undefined;
    }

    interface GetRoomVariantsSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.getRoomVariantsSuccess;
        roomvariants: RoomVariant[];
    }

    interface GetRoomVariantsFailureAction extends Action<ActionTypes> {
        type: ActionTypes.getRoomVariantsFailure;
        error: ApplicationError;
    }

    interface AppendRoomVariantAction extends Action<ActionTypes> {
        type: ActionTypes.appendRoomVariant;
        roomVariant: RoomVariant;
    }

    interface ApplyRoomVariantAction extends Action<ActionTypes> {
        type: ActionTypes.applyRoomVariant;
        roomVariant: RoomVariant;
    }

    interface DeleteRoomVariantAction extends Action<ActionTypes> {
        type: ActionTypes.deleteRoomVariant;
        id: string;
    }

    type GetRentalObjects = GetRentalObjectsRequestAction | GetRentalObjectsSuccessAction | GetRentalObjectsFailureAction;
    type GetRentalObject = GetRequestAction | GetSuccessAction | GetFailureAction;
    type CreateRentalObject = CreateRequestAction | CreateSuccessAction | CreateFailureAction;
    type UpdateRentalObject = UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction;
    type DeleteRentalObject = DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction;
    type GetRoomVariants = GetRoomVariantsRequestAction | GetRoomVariantsSuccessAction | GetRoomVariantsFailureAction;

    export type RentalObjectActions = GetRentalObjects
        | GetRentalObject
        | ApplyEditionStateAction
        | ClearEditionStateAction
        | CreateRentalObject
        | UpdateRentalObject
        | DeleteRentalObject
        | GetRoomVariants
        | AppendRoomVariantAction
        | ApplyRoomVariantAction
        | DeleteRoomVariantAction;

    export function createRentalObject(createRequest: RentalObject.CreateRequest): AppThunkAction<Promise<CreateSuccessAction | CreateFailureAction>> {
        return async (dispatch) => {
            dispatch(request(createRequest));

            try {
                const result = await rentalObjectService.create(createRequest);
                dispatch(SnackbarActions.showSnackbar('Объект аренды успешно сохранен', SnackbarVariant.success));
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
                dispatch(SnackbarActions.showSnackbar('Объект аренды успешно сохранен', SnackbarVariant.success));
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

    export function applyEditionState(model: RentalObject): ApplyEditionStateAction {
        return { type: ActionTypes.applyEditionState, model: model };
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

    export function getRentalObject(id: string | undefined): AppThunkAction<Promise<GetSuccessAction | GetFailureAction>> {
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const state = getState();
            const modelLoaded = state.rentalObjectState.modelLoading;

            dispatch(request(id));
            if (modelLoaded === false) {
                return dispatch(success(state.rentalObjectState.model));
            }

            if (!id || id === 'create') {
                return dispatch(success(RentalObject.initial));
            }

            let models: RentalObject[] = [];

            try {
                if (state.rentalObjectState.modelsLoading === true) {
                    models = await rentalObjectService.get({ id });
                }
                else {
                    models = state.rentalObjectState.models;
                }

                let model = models.find(o => o.id === id);

                if (!model) {
                    throw new ApplicationError('Не удалось найти объект аренды');
                }

                dispatch(getRentalObjectRoomVariants(id));

                return dispatch(success(model));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(id: string | undefined): GetRequestAction { return { type: ActionTypes.getRentalObjectRequest, id: id }; }
            function success(rentalobject: RentalObject): GetSuccessAction { return { type: ActionTypes.getRentalObjectSuccess, rentalobject: rentalobject }; }
            function failure(error: ApplicationError): GetFailureAction { return { type: ActionTypes.getRentalObjectFailure, error: error }; }
        }
    }

    export function deleteRentalObjects(deleteRequest: RentalObject.DeleteRequest): AppThunkAction<Promise<DeleteSuccessAction | DeleteFailureAction>> {
        return async (dispatch) => {
            dispatch(request(deleteRequest));

            try {
                await rentalObjectService.delete(deleteRequest);
                dispatch(SnackbarActions.showSnackbar('Объект аренды успешно удален.', SnackbarVariant.info));
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

    export function getRentalObjectRoomVariants(id: string | undefined): AppThunkAction<Promise<GetRoomVariantsSuccessAction | GetRoomVariantsFailureAction>> {
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { rentalObjectState } = getState();
            dispatch(request(id));

            if (!id || id === 'create')
                return dispatch(success([]));

            try {
                const result = await roomVariantService.get({ rentalObjectId: id });
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(id: string | undefined): GetRoomVariantsRequestAction { return { type: ActionTypes.getRoomVariantsRequest, rentalObjectId: id }; }
            function success(roomvariants: RoomVariant[]): GetRoomVariantsSuccessAction { return { type: ActionTypes.getRoomVariantsSuccess, roomvariants: roomvariants }; }
            function failure(error: ApplicationError): GetRoomVariantsFailureAction { return { type: ActionTypes.getRoomVariantsFailure, error: error }; }
        }
    }

    export function appendRoomVariant(roomVariant: RoomVariant): AppendRoomVariantAction {
        return { type: ActionTypes.appendRoomVariant, roomVariant: roomVariant };
    }

    export function applyRoomVariant(roomVariant: RoomVariant): ApplyRoomVariantAction {
        return { type: ActionTypes.applyRoomVariant, roomVariant: roomVariant };
    }

    export function deleteRoomVariant(id: string): DeleteRoomVariantAction {
        return { type: ActionTypes.deleteRoomVariant, id: id };
    }
}