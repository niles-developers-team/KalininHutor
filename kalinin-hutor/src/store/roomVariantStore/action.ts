import { Action } from "redux";
import { ApplicationError, EntityStatus, RoomVariant, RoomVariantBedType, RoomVariantCharacteristic, NotificationVariant } from "../../models";
import { cookiesService, roomVariantService } from "../../services";
import { AppState, AppThunkAction, AppThunkDispatch } from "../appState";
import { NotificationActions } from "../notificationStore";
import { v4 as uuidv4 } from 'uuid';
import { RoomCharacteristicActions, RoomCharacteristicActionTypes } from "../roomCharacteristicStore";

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
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { roomVariantState } = getState();

            if (roomVariantState.modelsLoading === false) {
                return dispatch(success(roomVariantState.models));
            }

            dispatch(request());

            try {
                const result = await roomVariantService.get({ rentalObjectId: rentalObjectId });

                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(NotificationActions.showSnackbar(error.message, NotificationVariant.error));
                return dispatch(failure(error));
            }
            function request(): GetRoomVariantsRequestAction { return { type: ActionTypes.getRoomVariantsRequest } };
            function success(roomVariants: RoomVariant[]): GetRoomVariantsSuccessAction { return { type: ActionTypes.getRoomVariantsSuccess, roomvariants: roomVariants }; }
            function failure(error: ApplicationError): GetRoomVariantsFailureAction { return { type: ActionTypes.getRoomVariantsFailure, error: error }; }
        }
    }

    export function getRoomVariant(id: string | undefined): AppThunkAction<Promise<GetSuccessAction | GetFailureAction>> {
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
                    const draftResult = dispatch(RoomVariantActions.getDraft());
                    if (draftResult.roomvariant)
                        model = draftResult.roomvariant;
                }

                if (!model) {
                    throw new ApplicationError('Не удалось найти вариант номера');
                }

                var result = dispatch(success(model));

                return result;
            }
            catch (error: any) {
                dispatch(NotificationActions.showSnackbar(error.message, NotificationVariant.error));

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

            const draft = cookiesService.get<RoomVariant>('room-variant-draft');
            return dispatch({ type: ActionTypes.getRoomVariantSuccess, roomvariant: draft });
        }
    }

    export function createDraft(draft: RoomVariant): AppThunkAction<CreateDraftAction | ClearEditionStateAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { rentalObjectState } = getState();

            if (!rentalObjectState.model) {
                dispatch(NotificationActions.showSnackbar('Не найден объект аренды', NotificationVariant.error));
                return { type: ActionTypes.clearEditionState };
            }

            if (!draft.id) {
                draft.id = uuidv4();
                draft.entityStatus = EntityStatus.Draft;
            }

            draft.rentalObjectId = rentalObjectState.model.id;

            cookiesService.set('room-variant-draft', draft);
            return dispatch({ type: ActionTypes.createDraft, draft: draft });
        }
    }

    export function updateDraft(draft: RoomVariant): AppThunkAction<UpdateDraftAction | ClearEditionStateAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { rentalObjectState } = getState();

            if (!rentalObjectState.model) {
                dispatch(NotificationActions.showSnackbar('Не найден объект аренды', NotificationVariant.error));
                return dispatch({ type: ActionTypes.clearEditionState });
            }

            draft.rentalObjectId = rentalObjectState.model.id;

            cookiesService.set('room-variant-draft', draft);
            return dispatch({ type: ActionTypes.updateDraft, draft: draft });
        }
    }

    export function create(model: RoomVariant): AppThunkAction<CreateSuccessAction | CreateFailureAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { rentalObjectState } = getState();
            if (!rentalObjectState.model) {
                dispatch(NotificationActions.showSnackbar('Не найден объект аренды', NotificationVariant.error));
                return dispatch({ type: ActionTypes.createFailure });
            }

            return dispatch({ type: ActionTypes.createSuccess, model: model });
        }
    }

    export function update(model: RoomVariant): AppThunkAction<UpdateSuccessAction | UpdateFailureAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { rentalObjectState } = getState();
            if (!rentalObjectState.model) {
                dispatch(NotificationActions.showSnackbar('Не найден объект аренды', NotificationVariant.error));
                return dispatch({ type: ActionTypes.updateFailure });
            }

            if (model.entityStatus !== EntityStatus.Draft) {
                model.entityStatus = EntityStatus.Updated;
            }

            return dispatch({ type: ActionTypes.updateSuccess, model: model });
        };
    }

    export function deleteRoomVariant(id: string): AppThunkAction<DeleteSuccessAction | DeleteFailureAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { rentalObjectState, roomVariantState } = getState();
            if (!rentalObjectState.model) {
                dispatch(NotificationActions.showSnackbar('Не найден объект аренды', NotificationVariant.error));
                return dispatch({ type: ActionTypes.deleteFailure });
            }

            const model = roomVariantState.models?.find(o => o.id === id);
            if (model && model.entityStatus !== EntityStatus.Draft) {
                model.entityStatus = EntityStatus.Deleted;
            }

            return dispatch({ type: ActionTypes.deleteSuccess, ids: [id] });
        }
    }

    export function addRoomCharacteristic(model: RoomVariantCharacteristic): AppThunkAction<Promise<UpdateDraftAction | ClearEditionStateAction>> {
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { roomVariantState } = getState();

            if (!roomVariantState.model) {
                dispatch(NotificationActions.showSnackbar('Не найден объект аренды', NotificationVariant.error));
                return dispatch(failure());
            }

            const roomVariant = roomVariantState.model;

            if (model.roomCharacteristic && !model.roomCharacteristic.id) {
                const result = await dispatch(RoomCharacteristicActions.createRoomCharacteristic({
                    description: model.roomCharacteristic.description,
                    name: model.roomCharacteristic.name,
                    type: model.roomCharacteristic.type
                }))
                if (result.type === RoomCharacteristicActionTypes.createSuccess)
                    model.roomCharacteristic = result.model;
            }
            
            model.roomVariantId = roomVariant.id;

            if (!model.id) {
                model.id = uuidv4();
                model.entityStatus = EntityStatus.Draft;
                return await dispatch(updateDraft({ ...roomVariant, characteristics: [...roomVariant.characteristics, model] }));
            } else {
                model.roomVariantId = roomVariant.id;
                model.entityStatus = model.entityStatus === EntityStatus.Draft ? EntityStatus.Draft : EntityStatus.Updated;
                return await dispatch(updateDraft({ ...roomVariant, characteristics: [...roomVariant.characteristics.map(o => o.id === model.id ? model : o)] }));
            }

            function failure(): ClearEditionStateAction { return { type: ActionTypes.clearEditionState } };
        }
    }

    export function deleteRoomCharacteristic(model: RoomVariantCharacteristic): AppThunkAction<UpdateDraftAction | ClearEditionStateAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { roomVariantState } = getState();

            if (!roomVariantState.model) {
                dispatch(NotificationActions.showSnackbar('Не найден объект аренды', NotificationVariant.error));
                return dispatch(failure());
            }
            const roomVariant = roomVariantState.model;

            if (model.entityStatus === EntityStatus.Draft)
                return dispatch(updateDraft({ ...roomVariant, characteristics: [...roomVariant.characteristics.filter(o => o.id !== model.id)] }));
            else
                return dispatch(updateDraft({ ...roomVariant, characteristics: [...roomVariant.characteristics.map(o => o.id === model.id ? { ...model, entityStatus: EntityStatus.Deleted } : o)] }));

            function failure(): ClearEditionStateAction { return { type: ActionTypes.clearEditionState } };
        }
    }

    export function addBedType(model: RoomVariantBedType): AppThunkAction<UpdateDraftAction | ClearEditionStateAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { roomVariantState } = getState();

            if (!roomVariantState.model) {
                dispatch(NotificationActions.showSnackbar('Не найден объект аренды', NotificationVariant.error));
                return dispatch(failure());
            }
            const roomVariant = roomVariantState.model;

            model.roomVariantId = roomVariant.id;

            if (!model.id) {
                model.id = uuidv4();
                model.entityStatus = EntityStatus.Draft;
                return dispatch(updateDraft({ ...roomVariant, bedTypes: [...roomVariant.bedTypes, model] }));
            } else {
                model.entityStatus = model.entityStatus === EntityStatus.Draft ? EntityStatus.Draft : EntityStatus.Updated;
                return dispatch(updateDraft({ ...roomVariant, bedTypes: [...roomVariant.bedTypes.map(o => o.id === model.id ? model : o)] }));
            }

            function failure(): ClearEditionStateAction { return { type: ActionTypes.clearEditionState } };
        }
    }

    export function deleteBedType(model: RoomVariantBedType): AppThunkAction<UpdateDraftAction | ClearEditionStateAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { roomVariantState } = getState();

            if (!roomVariantState.model) {
                dispatch(NotificationActions.showSnackbar('Не найден объект аренды', NotificationVariant.error));
                return dispatch(failure());
            }
            const roomVariant = roomVariantState.model;

            if (model.entityStatus === EntityStatus.Draft)
                return dispatch(updateDraft({ ...roomVariant, bedTypes: [...roomVariant.bedTypes.filter(o => o.id !== model.id)] }));
            else
                return dispatch(updateDraft({ ...roomVariant, bedTypes: [...roomVariant.bedTypes.map(o => o.id === model.id ? { ...model, entityStatus: EntityStatus.Deleted } : o)] }));

            function failure(): ClearEditionStateAction { return { type: ActionTypes.clearEditionState } };
        }
    }

    export function clearEditionState(): ClearEditionStateAction {
        return { type: ActionTypes.clearEditionState };
    }
}