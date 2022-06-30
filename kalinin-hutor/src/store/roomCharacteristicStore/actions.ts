import { Action } from "redux";
import { ApplicationError, RoomCharacteristic, SnackbarVariant } from "../../models";
import { roomCharacteristicService } from "../../services";
import { AppThunkAction, AppThunkDispatch, AppState } from "../appState";
import { SnackbarActions } from "../snackbarStore/actions";

export enum RoomCharacteristicActionTypes {
    getRoomCharacteristicsRequest = 'GET_ROOMCHARACTERISTICS_REQUEST',
    getRoomCharacteristicsSuccess = 'GET_ROOMCHARACTERISTICS_SUCCESS',
    getRoomCharacteristicsFailure = 'GET_ROOMCHARACTERISTICS_FAILURE',

    getRoomCharacteristicRequest = 'GET_ROOMCHARACTERISTIC_REQUEST',
    getRoomCharacteristicSuccess = 'GET_ROOMCHARACTERISTIC_SUCCESS',
    getRoomCharacteristicFailure = 'GET_ROOMCHARACTERISTIC_FAILURE',

    createRequest = 'CREATE_ROOMCHARACTERISTIC_REQUEST',
    createSuccess = 'CREATE_ROOMCHARACTERISTIC_SUCCESS',
    createFailure = 'CREATE_ROOMCHARACTERISTIC_FAILURE',

    updateRequest = 'UPDATE_ROOMCHARACTERISTIC_REQUEST',
    updateSuccess = 'UPDATE_ROOMCHARACTERISTIC_SUCCESS',
    updateFailure = 'UPDATE_ROOMCHARACTERISTIC_FAILURE',

    clearEditionState = 'CLEAR_EDITION_STATE',

    deleteRequest = 'DELETE_ROOMCHARACTERISTIC_REQUEST',
    deleteSuccess = 'DELETE_ROOMCHARACTERISTIC_SUCCESS',
    deleteFailure = 'DELETE_ROOMCHARACTERISTIC_FAILURE',
}

export namespace RoomCharacteristicActions {

    interface GetRoomCharacteristicsRequestAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.getRoomCharacteristicsRequest;
        query?: RoomCharacteristic.GetQuery;
    }

    interface GetRoomCharacteristicsSuccessAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.getRoomCharacteristicsSuccess;
        roomcharacteristics: RoomCharacteristic[];
    }

    interface GetRoomCharacteristicsFailureAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.getRoomCharacteristicsFailure;
        error: ApplicationError;
    }

    interface GetRequestAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.getRoomCharacteristicRequest;
        id: string | undefined;
    }

    interface GetSuccessAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.getRoomCharacteristicSuccess;
        roomcharacteristic: RoomCharacteristic;
    }

    interface GetFailureAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.getRoomCharacteristicFailure;
        error: ApplicationError;
    }

    interface CreateRequestAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.createRequest;
        request: RoomCharacteristic.CreateRequest;
    }

    interface CreateSuccessAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.createSuccess;
        model: RoomCharacteristic;
    }

    interface CreateFailureAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.createFailure;
        error: ApplicationError;
    }

    interface UpdateRequestAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.updateRequest;
        request: RoomCharacteristic.UpdateRequest;
    }

    interface UpdateSuccessAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.updateSuccess;
        model: RoomCharacteristic;
    }

    interface UpdateFailureAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.updateFailure;
        error: ApplicationError;
    }

    interface ClearEditionStateAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.clearEditionState;
    }

    interface DeleteRequestAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.deleteRequest;
        request: RoomCharacteristic.DeleteRequest;
    }

    interface DeleteSuccessAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.deleteSuccess;
    }

    interface DeleteFailureAction extends Action<RoomCharacteristicActionTypes> {
        type: RoomCharacteristicActionTypes.deleteFailure;
        error: ApplicationError;
    }

    type GetRoomCharacteristics = GetRoomCharacteristicsRequestAction | GetRoomCharacteristicsSuccessAction | GetRoomCharacteristicsFailureAction;
    type GetRoomCharacteristic = GetRequestAction | GetSuccessAction | GetFailureAction;
    type CreateRoomCharacteristic = CreateRequestAction | CreateSuccessAction | CreateFailureAction;
    type UpdateRoomCharacteristic = UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction;
    type DeleteRoomCharacteristic = DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction;

    export type RoomCharacteristicActions = GetRoomCharacteristics
        | GetRoomCharacteristic
        | ClearEditionStateAction
        | CreateRoomCharacteristic
        | UpdateRoomCharacteristic
        | DeleteRoomCharacteristic;

    export function createRoomCharacteristic(createRequest: RoomCharacteristic.CreateRequest): AppThunkAction<Promise<CreateSuccessAction | CreateFailureAction>> {
        return async (dispatch) => {
            dispatch(request(createRequest));

            try {
                const result = await roomCharacteristicService.create(createRequest);
                dispatch(SnackbarActions.showSnackbar('Бронь успешно сохранена', SnackbarVariant.success));
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(createRequest: RoomCharacteristic.CreateRequest): CreateRequestAction { return { type: RoomCharacteristicActionTypes.createRequest, request: createRequest }; }
            function success(roomcharacteristic: RoomCharacteristic): CreateSuccessAction { return { type: RoomCharacteristicActionTypes.createSuccess, model: roomcharacteristic }; }
            function failure(error: ApplicationError): CreateFailureAction { return { type: RoomCharacteristicActionTypes.createFailure, error: error }; }
        }
    }

    export function updateRoomCharacteristic(updateRequest: RoomCharacteristic.UpdateRequest): AppThunkAction<Promise<UpdateSuccessAction | UpdateFailureAction>> {
        return async (dispatch) => {
            dispatch(request(updateRequest));

            try {
                const result = await roomCharacteristicService.update(updateRequest);
                dispatch(SnackbarActions.showSnackbar('Пользователь успешно сохранен', SnackbarVariant.success));
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(updateRequest: RoomCharacteristic.UpdateRequest): UpdateRequestAction { return { type: RoomCharacteristicActionTypes.updateRequest, request: updateRequest }; }
            function success(roomcharacteristic: RoomCharacteristic): UpdateSuccessAction { return { type: RoomCharacteristicActionTypes.updateSuccess, model: roomcharacteristic }; }
            function failure(error: ApplicationError): UpdateFailureAction { return { type: RoomCharacteristicActionTypes.updateFailure, error: error }; }
        }
    }

    export function clearEditionState(): ClearEditionStateAction {
        return { type: RoomCharacteristicActionTypes.clearEditionState };
    }

    export function getRoomCharacteristics(query?: RoomCharacteristic.GetQuery): AppThunkAction<Promise<GetRoomCharacteristicsSuccessAction | GetRoomCharacteristicsFailureAction>> {
        return async dispatch => {
            dispatch(request(query));

            try {
                const result = await roomCharacteristicService.get(query);
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(query?: RoomCharacteristic.GetQuery): GetRoomCharacteristicsRequestAction { return { type: RoomCharacteristicActionTypes.getRoomCharacteristicsRequest, query: query }; }
            function success(roomcharacteristics: RoomCharacteristic[]): GetRoomCharacteristicsSuccessAction { return { type: RoomCharacteristicActionTypes.getRoomCharacteristicsSuccess, roomcharacteristics: roomcharacteristics }; }
            function failure(error: ApplicationError): GetRoomCharacteristicsFailureAction { return { type: RoomCharacteristicActionTypes.getRoomCharacteristicsFailure, error: error }; }
        }
    }

    export function getRoomCharacteristic(id: string | undefined): AppThunkAction<Promise<GetSuccessAction | GetFailureAction>> {
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            dispatch(request(id));

            if (!id)
                return dispatch(success(RoomCharacteristic.initial));

            const state = getState();
            let models: RoomCharacteristic[] = [];

            try {
                if (state.roomCharacteristicState.modelsLoading === true)
                    models = await roomCharacteristicService.get({ id });
                else
                    models = state.roomCharacteristicState.models;

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

            function request(id: string | undefined): GetRequestAction { return { type: RoomCharacteristicActionTypes.getRoomCharacteristicRequest, id: id }; }
            function success(roomcharacteristic: RoomCharacteristic): GetSuccessAction { return { type: RoomCharacteristicActionTypes.getRoomCharacteristicSuccess, roomcharacteristic: roomcharacteristic }; }
            function failure(error: ApplicationError): GetFailureAction { return { type: RoomCharacteristicActionTypes.getRoomCharacteristicFailure, error: error }; }
        }
    }

    export function deleteRoomCharacteristics(deleteRequest: RoomCharacteristic.DeleteRequest): AppThunkAction<Promise<DeleteSuccessAction | DeleteFailureAction>> {
        return async (dispatch) => {
            dispatch(request(deleteRequest));

            try {
                await roomCharacteristicService.delete(deleteRequest);
                dispatch(SnackbarActions.showSnackbar('Пользователь успешно удален.', SnackbarVariant.info));
                return dispatch(success());
            }
            catch (error: any) {

                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));
                return dispatch(failure(error));
            }

            function request(request: RoomCharacteristic.DeleteRequest): DeleteRequestAction { return { type: RoomCharacteristicActionTypes.deleteRequest, request: request }; }
            function success(): DeleteSuccessAction { return { type: RoomCharacteristicActionTypes.deleteSuccess }; }
            function failure(error: ApplicationError): DeleteFailureAction { return { type: RoomCharacteristicActionTypes.deleteFailure, error: error }; }
        }
    }
}