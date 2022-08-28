import { Action } from "redux";
import { ApplicationError, EntityStatus, RoomVariant, SnackbarVariant } from "../../models";
import { cookiesService, roomVariantService } from "../../services";
import { AppState, AppThunkAction, AppThunkDispatch } from "../appState";
import { SnackbarActions } from "../snackbarStore";
import { v4 as uuidv4 } from 'uuid';

export enum ActionTypes {
    getRoomVariantsRequest = 'GET_ROOMVARIANTS_REQUEST',
    getRoomVariantsSuccess = 'GET_ROOMVARIANTS_SUCCESS',
    getRoomVariantsFailure = 'GET_ROOMVARIANTS_FAILURE',

    getRoomVariantRequest = 'GET_ROOMVARIANT_REQUEST',
    getRoomVariantSuccess = 'GET_ROOMVARIANT_SUCCESS',
    getRoomVariantFailure = 'GET_ROOMVARIANT_FAILURE',

    createDraft = 'CREATE_ROOMVARIANT_DRAFT',
    updateDraft = 'UPDATE_ROOMVARIANT_DRAFT',

    createRequest = 'CREATE_ROOMVARIANT_REQUEST',
    createSuccess = 'CREATE_ROOMVARIANT_SUCCESS',
    createFailure = 'CREATE_ROOMVARIANT_FAILURE',

    updateRequest = 'UPDATE_ROOMVARIANT_REQUEST',
    updateSuccess = 'UPDATE_ROOMVARIANT_SUCCESS',
    updateFailure = 'UPDATE_ROOMVARIANT_FAILURE',

    deleteRequest = 'DELETE_ROOMVARIANT_REQUEST',
    deleteSuccess = 'DELETE_ROOMVARIANT_SUCCESS',
    deleteFailure = 'DELETE_ROOMVARIANT_FAILURE',

    clearEditionState = 'CLEAR_EDITION_STATE',
}

export namespace RoomVariantActions {
    interface GetRoomVariantsRequestAction extends Action<ActionTypes> {
        type: ActionTypes.getRoomVariantsRequest;
        query?: RoomVariant.GetQuery;
    }

    interface GetRoomVariantsSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.getRoomVariantsSuccess;
        roomvariants: RoomVariant[];
    }

    interface GetRoomVariantsFailureAction extends Action<ActionTypes> {
        type: ActionTypes.getRoomVariantsFailure;
        error: ApplicationError;
    }

    interface GetRequestAction extends Action<ActionTypes> {
        type: ActionTypes.getRoomVariantRequest;
        id: string | undefined;
    }

    interface GetSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.getRoomVariantSuccess;
        roomvariant: RoomVariant;
    }

    interface GetFailureAction extends Action<ActionTypes> {
        type: ActionTypes.getRoomVariantFailure;
        error: ApplicationError;
    }

    interface CreateDraftAction extends Action<ActionTypes> {
        type: ActionTypes.createDraft;
        draft: RoomVariant;
    }

    interface UpdateDraftAction extends Action<ActionTypes> {
        type: ActionTypes.updateDraft;
        draft: RoomVariant;
    }

    interface CreateRequestAction extends Action<ActionTypes> {
        type: ActionTypes.createRequest;
    }

    interface CreateSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.createSuccess;
        model: RoomVariant;
    }

    interface CreateFailureAction extends Action<ActionTypes> {
        type: ActionTypes.createFailure;
        error: ApplicationError;
    }

    interface UpdateRequestAction extends Action<ActionTypes> {
        type: ActionTypes.updateRequest;
    }

    interface UpdateSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.updateSuccess;
        model: RoomVariant;
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
    }

    interface DeleteSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.deleteSuccess;
        ids: string[];
    }

    interface DeleteFailureAction extends Action<ActionTypes> {
        type: ActionTypes.deleteFailure;
        error: ApplicationError;
    }

    type GetRoomVariants = GetRoomVariantsRequestAction | GetRoomVariantsSuccessAction | GetRoomVariantsFailureAction;
    type GetRoomVariant = GetRequestAction | GetSuccessAction | GetFailureAction;
    type DraftRoomVariant = CreateDraftAction | UpdateDraftAction;
    type CreateRoomVariant = CreateRequestAction | CreateSuccessAction | CreateFailureAction;
    type UpdateRoomVariant = UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction;
    type DeleteRoomVariant = DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction;

    export type RoomVariantActions = GetRoomVariants
        | GetRoomVariant
        | ClearEditionStateAction
        | DraftRoomVariant
        | CreateRoomVariant
        | UpdateRoomVariant
        | DeleteRoomVariant;

    export function getRoomVariants(rentalObjectId: string): AppThunkAction<Promise<GetRoomVariantsSuccessAction | GetRoomVariantsFailureAction>> {
        return async dispatch => {
            dispatch(request());
            try {
                const result = await roomVariantService.get({ rentalObjectId: rentalObjectId });

                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));
                return dispatch(failure(error));
            }
            function request(): GetRoomVariantsRequestAction { return { type: ActionTypes.getRoomVariantsRequest } };
            function success(roomVariants: RoomVariant[]): GetRoomVariantsSuccessAction { return { type: ActionTypes.getRoomVariantsSuccess, roomvariants: roomVariants }; }
            function failure(error: ApplicationError): GetRoomVariantsFailureAction { return { type: ActionTypes.getRoomVariantsFailure, error: error }; }
        }
    }

    export function getRoomVariant(id: string): AppThunkAction<Promise<GetSuccessAction | GetFailureAction>> {
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { roomVariantState } = getState();

            dispatch(request(id));

            let models: RoomVariant[] = [];

            try {
                if (roomVariantState.modelsLoading) {
                    models = await roomVariantService.get({ id });
                }
                else {
                    models = roomVariantState.models;
                }

                let model = models.find(o => o.id === id);

                if (!model) {
                    throw new ApplicationError('Не удалось найти вариант номера');
                }

                var result = dispatch(success(model));

                return result;
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(id: string | undefined): GetRequestAction { return { type: ActionTypes.getRoomVariantRequest, id: id }; }
            function success(roomVariant: RoomVariant): GetSuccessAction { return { type: ActionTypes.getRoomVariantSuccess, roomvariant: roomVariant }; }
            function failure(error: ApplicationError): GetFailureAction { return { type: ActionTypes.getRoomVariantFailure, error: error }; }
        }
    }

    export function getDraft(): AppThunkAction<GetSuccessAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { roomVariantState } = getState();

            if (roomVariantState.modelLoading === false && roomVariantState.model?.entityStatus === EntityStatus.Draft) {
                return dispatch({ type: ActionTypes.getRoomVariantSuccess, roomvariant: roomVariantState.model });
            }

            const draft = cookiesService.get<RoomVariant>('booking-draft');
            return dispatch({ type: ActionTypes.getRoomVariantSuccess, roomvariant: draft });
        }
    }

    export function createDraft(draft: RoomVariant): AppThunkAction<CreateDraftAction | ClearEditionStateAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { rentalObjectState } = getState();

            if (!rentalObjectState.model) {
                dispatch(SnackbarActions.showSnackbar('Не найден объект аренды', SnackbarVariant.error));
                return { type: ActionTypes.clearEditionState };
            }

            if (!draft.id) {
                draft.id = uuidv4();
                draft.entityStatus = EntityStatus.Draft;
            }

            draft.rentalObjectId = rentalObjectState.model.id;

            cookiesService.set('rental-object-draft', draft);
            return dispatch({ type: ActionTypes.createDraft, draft: draft });
        }
    }

    export function updateDraft(draft: RoomVariant): AppThunkAction<UpdateDraftAction | ClearEditionStateAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { rentalObjectState } = getState();

            if (!rentalObjectState.model) {
                dispatch(SnackbarActions.showSnackbar('Не найден объект аренды', SnackbarVariant.error));
                return { type: ActionTypes.clearEditionState };
            }

            draft.rentalObjectId = rentalObjectState.model.id;

            cookiesService.set('rental-object-draft', draft);
            return dispatch({ type: ActionTypes.updateDraft, draft: draft });
        }
    }
}