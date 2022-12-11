import { Action } from "redux";
import { ApplicationError, EntityStatus, RentalObject, RoomVariant, RoomVariantBedType, RoomVariantCharacteristic, NotificationVariant, FileObject } from "../../models";
import { cookiesService, rentalObjectService } from "../../services";
import { AppThunkAction, AppThunkDispatch, AppState } from "../appState";
import { NotificationActions } from "../notificationStore/actions";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import { readAsDataURL } from "../../helpers/fileHelpers";
import { v4 as guid } from 'uuid';

export enum ActionTypes {
    getRentalObjectsRequest = 'GET_RENTALOBJECTS_REQUEST',
    getRentalObjectsSuccess = 'GET_RENTALOBJECTS_SUCCESS',
    getRentalObjectsFailure = 'GET_RENTALOBJECTS_FAILURE',

    getRentalObjectRequest = 'GET_RENTALOBJECT_REQUEST',
    getRentalObjectSuccess = 'GET_RENTALOBJECT_SUCCESS',
    getRentalObjectFailure = 'GET_RENTALOBJECT_FAILURE',

    createDraft = 'CREATE_RENTALOBJECT_DRAFT',
    updateDraft = 'UPDATE_RENTALOBJECT_DRAFT',

    createRequest = 'CREATE_RENTALOBJECT_REQUEST',
    createSuccess = 'CREATE_RENTALOBJECT_SUCCESS',
    createFailure = 'CREATE_RENTALOBJECT_FAILURE',

    updateRequest = 'UPDATE_RENTALOBJECT_REQUEST',
    updateSuccess = 'UPDATE_RENTALOBJECT_SUCCESS',
    updateFailure = 'UPDATE_RENTALOBJECT_FAILURE',

    deleteRequest = 'DELETE_RENTALOBJECT_REQUEST',
    deleteSuccess = 'DELETE_RENTALOBJECT_SUCCESS',
    deleteFailure = 'DELETE_RENTALOBJECT_FAILURE',

    clearEditionState = 'CLEAR_EDITION_STATE',
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

    interface CreateDraftAction extends Action<ActionTypes> {
        type: ActionTypes.createDraft;
        draft: RentalObject;
    }

    interface UpdateDraftAction extends Action<ActionTypes> {
        type: ActionTypes.updateDraft;
        draft: RentalObject;
    }

    interface CreateRequestAction extends Action<ActionTypes> {
        type: ActionTypes.createRequest;
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
    }

    interface DeleteSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.deleteSuccess;
        ids: string[];
    }

    interface DeleteFailureAction extends Action<ActionTypes> {
        type: ActionTypes.deleteFailure;
        error: ApplicationError;
    }

    type GetRentalObjects = GetRentalObjectsRequestAction | GetRentalObjectsSuccessAction | GetRentalObjectsFailureAction;
    type GetRentalObject = GetRequestAction | GetSuccessAction | GetFailureAction;
    type DraftRentalObject = CreateDraftAction | UpdateDraftAction;
    type CreateRentalObject = CreateRequestAction | CreateSuccessAction | CreateFailureAction;
    type UpdateRentalObject = UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction;
    type DeleteRentalObject = DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction;

    export type RentalObjectActions = GetRentalObjects
        | GetRentalObject
        | ClearEditionStateAction
        | DraftRentalObject
        | CreateRentalObject
        | UpdateRentalObject
        | DeleteRentalObject;

    export function getDraft(): AppThunkAction<GetSuccessAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { rentalObjectState } = getState();

            if (rentalObjectState.modelLoading === false && rentalObjectState.model?.entityStatus === EntityStatus.Draft) {
                return dispatch({ type: ActionTypes.getRentalObjectSuccess, rentalobject: rentalObjectState.model });
            }

            const draft = cookiesService.get<RentalObject>('rental-object-draft');
            return dispatch({ type: ActionTypes.getRentalObjectSuccess, rentalobject: draft });
        }
    }

    export function createDraft(draft: RentalObject): AppThunkAction<CreateDraftAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { userState } = getState();

            if (!draft.id) {
                draft.id = uuidv4();
                draft.entityStatus = EntityStatus.Draft;
            }

            if (userState.authenticating === false && userState.currentUser) {
                draft.landlord = userState.currentUser;
            }

            cookiesService.set('rental-object-draft', draft);
            return dispatch({ type: ActionTypes.createDraft, draft: draft });
        }
    }

    export function updateDraft(draft: RentalObject): AppThunkAction<UpdateDraftAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { userState } = getState();

            if (userState.authenticating === false && userState.currentUser) {
                draft.landlord = userState.currentUser;
            }

            cookiesService.set('rental-object-draft', draft);
            return dispatch({ type: ActionTypes.updateDraft, draft: draft });
        }
    }

    export function appendPhotoToDraft(fileList: FileList): AppThunkAction {
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { rentalObjectState } = getState();
            const draft = rentalObjectState.model;

            if (!draft)
                return;

            const photos: FileObject[] = [];

            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];

                const body = await readAsDataURL(file);

                const photo: FileObject = {
                    id: guid(),
                    body: body,
                    extension: file.type,
                    name: file.name,
                    sortOrder: draft.photos?.reduce((a, b) => Math.max(a, b.sortOrder), 0),
                    entityStatus: EntityStatus.Draft
                };

                photos.push(photo);
            }

            dispatch({ type: ActionTypes.updateDraft, draft: { ...draft, photos: [...draft.photos, ...photos] } });
        }
    }

    export function createRentalObject(model: RentalObject): AppThunkAction<Promise<CreateSuccessAction | CreateFailureAction>> {
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { roomVariantState } = getState();
            dispatch(request());

            try {
                if (!roomVariantState.models)
                    throw new ApplicationError('Невозможно сохранить объект аренды без вариантов номеров');

                const result = await rentalObjectService.create({
                    address: model.address,
                    checkinTime: moment(model.checkinTime, 'hh:mm:ss').format('hh:mm:ss'),
                    checkoutTime: moment(model.checkoutTime, 'hh:mm:ss').format('hh:mm:ss'),
                    description: model.description,
                    landlordId: model.landlord.id,
                    name: model.name,
                    createRoomVariantsRequests: roomVariantState.models.map<RoomVariant.CreateRequest>(rv => ({
                        count: rv.count,
                        description: rv.description,
                        freeCount: rv.freeCount,
                        length: rv.length,
                        maxPersonsCount: rv.maxPersonsCount,
                        name: rv.name,
                        paymentOption: rv.paymentOption,
                        price: rv.price,
                        width: rv.width,
                        freeCancellationPeriod: rv.freeCancellationPeriod,
                        createBedTypesRequests: rv.bedTypes.map<RoomVariantBedType.CreateRequest>(bt => ({
                            bedType: bt.bedType,
                            roomVariantId: bt.roomVariantId || '',
                            length: bt.length,
                            width: bt.width
                        })),
                        createCharacteristicsRequests: rv.characteristics
                            .map<RoomVariantCharacteristic.CreateRequest>(ch => ({
                                characteristic: ch.roomCharacteristic,
                                roomVariantId: ch.roomVariantId,
                                price: ch.price
                            })),
                    })),
                    createPhotos: model.photos
                });
                dispatch(NotificationActions.showSnackbar('Объект аренды успешно сохранен', NotificationVariant.success));
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(NotificationActions.showSnackbar(error.message, NotificationVariant.error));

                return dispatch(failure(error));
            }

            function request(): CreateRequestAction { return { type: ActionTypes.createRequest }; }
            function success(rentalobject: RentalObject): CreateSuccessAction { return { type: ActionTypes.createSuccess, model: rentalobject }; }
            function failure(error: ApplicationError): CreateFailureAction { return { type: ActionTypes.createFailure, error: error }; }
        }
    }

    export function updateRentalObject(model: RentalObject): AppThunkAction<Promise<UpdateSuccessAction | UpdateFailureAction>> {
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { roomVariantState } = getState();
            dispatch(request());

            try {
                const result = await rentalObjectService.update({
                    id: model.id,
                    checkinTime: moment(model.checkinTime, 'hh:mm:ss').format('hh:mm:ss'),
                    checkoutTime: moment(model.checkoutTime, 'hh:mm:ss').format('hh:mm:ss'),
                    description: model.description,
                    name: model.name,
                    createRoomVariantsRequests: roomVariantState.models
                        ?.filter(o => o.entityStatus === EntityStatus.Draft)
                        .map<RoomVariant.CreateRequest>(rv => ({
                            count: rv.count,
                            description: rv.description,
                            freeCount: rv.freeCount,
                            length: rv.length,
                            maxPersonsCount: rv.maxPersonsCount,
                            name: rv.name,
                            paymentOption: rv.paymentOption,
                            price: rv.price,
                            width: rv.width,
                            freeCancellationPeriod: rv.freeCancellationPeriod,
                            rentalObjectId: model.id,
                            createBedTypesRequests: rv.bedTypes.map<RoomVariantBedType.CreateRequest>(bt => ({
                                bedType: bt.bedType,
                                roomVariantId: bt.roomVariantId || '',
                                length: bt.length,
                                width: bt.width
                            })),
                            createCharacteristicsRequests: rv.characteristics
                                .map<RoomVariantCharacteristic.CreateRequest>(ch => ({
                                    roomCharacteristicId: ch.roomCharacteristicId || '',
                                    roomVariantId: ch.roomVariantId,
                                    price: ch.price
                                })),
                            createPhotos: rv.photos.filter(o => o.entityStatus === EntityStatus.Draft),
                        })),
                    updateRoomVariantsRequests: roomVariantState.models
                        ?.filter(o => o.entityStatus === EntityStatus.Updated)
                        .map<RoomVariant.UpdateRequest>(rv => ({
                            id: rv.id || '',
                            count: rv.count,
                            description: rv.description,
                            freeCount: rv.freeCount,
                            length: rv.length,
                            maxPersonsCount: rv.maxPersonsCount,
                            name: rv.name,
                            paymentOption: rv.paymentOption,
                            price: rv.price,
                            width: rv.width,
                            freeCancellationPeriod: rv.freeCancellationPeriod,
                            rentalObjectId: model.id,
                            createBedTypesRequests: rv.bedTypes
                                .filter(o => o.entityStatus === EntityStatus.Draft)
                                .map<RoomVariantBedType.CreateRequest>(bt => ({
                                    bedType: bt.bedType,
                                    roomVariantId: bt.roomVariantId || '',
                                    length: bt.length,
                                    width: bt.width
                                })),
                            createCharacteristicsRequests: rv.characteristics
                                .filter(o => o.entityStatus === EntityStatus.Draft)
                                .map<RoomVariantCharacteristic.CreateRequest>(ch => ({
                                    roomCharacteristicId: ch.roomCharacteristicId || '',
                                    roomVariantId: ch.roomVariantId,
                                    price: ch.price
                                })),
                            updateBedTypesRequests: rv.bedTypes
                                .filter(o => o.entityStatus === EntityStatus.Updated)
                                .map<RoomVariantBedType.UpdateRequest>(bt => ({
                                    id: bt.id || '',
                                    bedType: bt.bedType,
                                    roomVariantId: bt.roomVariantId,
                                    length: bt.length,
                                    width: bt.width
                                })),
                            updateCharacteristicsRequests: rv.characteristics
                                .filter(o => o.entityStatus === EntityStatus.Updated)
                                .map<RoomVariantCharacteristic.UpdateRequest>(ch => ({
                                    id: ch.id || '',
                                    roomCharacteristicId: ch.roomCharacteristicId || '',
                                    roomVariantId: ch.roomVariantId,
                                    price: ch.price
                                })),
                            deleteBedTypesRequests: ({
                                ids: rv.bedTypes
                                    .filter(o => o.entityStatus === EntityStatus.Deleted)
                                    .map(bt => bt.id || '')
                            }),
                            deleteCharacteristicsRequests: ({
                                ids: rv.characteristics
                                    .filter(o => o.entityStatus === EntityStatus.Deleted)
                                    .map(ch => ch.id || '')
                            }),
                            createPhotos: rv.photos.filter(o => o.entityStatus === EntityStatus.Draft),
                            updatePhotos: rv.photos.filter(o => o.entityStatus === EntityStatus.Updated).map(o => ({ ...o, body: '' })),
                            deletePhotos: rv.photos.filter(o => o.entityStatus === EntityStatus.Deleted)
                        })),
                    deleteRoomVariantsRequest: ({
                        ids: roomVariantState.models?.filter(o => o.entityStatus === EntityStatus.Deleted)
                            .map(rv => rv.id || '') || []
                    }),
                    createPhotos: model.photos.filter(o => o.entityStatus === EntityStatus.Draft),
                    updatePhotos: model.photos.filter(o => o.entityStatus === EntityStatus.Updated).map(o => ({ ...o, body: '' })),
                    deletePhotos: model.photos.filter(o => o.entityStatus === EntityStatus.Deleted)
                });
                dispatch(NotificationActions.showSnackbar('Объект аренды успешно сохранен', NotificationVariant.success));
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(NotificationActions.showSnackbar(error.message, NotificationVariant.error));

                return dispatch(failure(error));
            }

            function request(): UpdateRequestAction { return { type: ActionTypes.updateRequest }; }
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
                dispatch(NotificationActions.showSnackbar(error.message, NotificationVariant.error));

                return dispatch(failure(error));
            }

            function request(query?: RentalObject.GetQuery): GetRentalObjectsRequestAction { return { type: ActionTypes.getRentalObjectsRequest, query: query }; }
            function success(rentalobjects: RentalObject[]): GetRentalObjectsSuccessAction { return { type: ActionTypes.getRentalObjectsSuccess, rentalobjects: rentalobjects }; }
            function failure(error: ApplicationError): GetRentalObjectsFailureAction { return { type: ActionTypes.getRentalObjectsFailure, error: error }; }
        }
    }

    export function getRentalObject(id: string): AppThunkAction<Promise<GetSuccessAction | GetFailureAction>> {
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { rentalObjectState } = getState();

            dispatch(request(id));

            let models: RentalObject[] = [];

            try {
                if (rentalObjectState.modelsLoading) {
                    models = await rentalObjectService.get({ id });
                }
                else {
                    models = rentalObjectState.models;
                }

                let model = models.find(o => o.id === id);

                if (!model) {
                    throw new ApplicationError('Не удалось найти объект аренды');
                }

                var result = dispatch(success(model));

                return result;
            }
            catch (error: any) {
                dispatch(NotificationActions.showSnackbar(error.message, NotificationVariant.error));

                return dispatch(failure(error));
            }

            function request(id: string | undefined): GetRequestAction { return { type: ActionTypes.getRentalObjectRequest, id: id }; }
            function success(rentalobject: RentalObject): GetSuccessAction { return { type: ActionTypes.getRentalObjectSuccess, rentalobject: rentalobject }; }
            function failure(error: ApplicationError): GetFailureAction { return { type: ActionTypes.getRentalObjectFailure, error: error }; }
        }
    }

    export function deleteRentalObjects(deleteRequest: RentalObject.DeleteRequest): AppThunkAction<Promise<DeleteSuccessAction | DeleteFailureAction>> {
        return async (dispatch) => {
            dispatch(request());

            try {
                await rentalObjectService.delete(deleteRequest);
                dispatch(NotificationActions.showSnackbar('Объект аренды успешно удален.', NotificationVariant.info));
                return dispatch(success(deleteRequest.ids));
            }
            catch (error: any) {

                dispatch(NotificationActions.showSnackbar(error.message, NotificationVariant.error));
                return dispatch(failure(error));
            }

            function request(): DeleteRequestAction { return { type: ActionTypes.deleteRequest }; }
            function success(ids: string[]): DeleteSuccessAction { return { type: ActionTypes.deleteSuccess, ids: ids }; }
            function failure(error: ApplicationError): DeleteFailureAction { return { type: ActionTypes.deleteFailure, error: error }; }
        }
    }

    export function reorderPhotos(sourceIndex: number, destinationIndex: number): AppThunkAction {
        return (dispatch, getState) => {
            const { rentalObjectState } = getState();

            const draft = rentalObjectState.model;

            if (!draft) return;

            // a little function to help us with reordering the result            
            const result = draft.photos;
            const [removed] = result.splice(sourceIndex, 1);
            result.splice(destinationIndex, 0, removed);

            for (let i = 0; i < result.length; i++) {
                result[i].sortOrder = i;
                if (result[i].entityStatus !== EntityStatus.Deleted)
                    result[i].entityStatus = EntityStatus.Updated;
            }

            dispatch({ type: ActionTypes.updateDraft, draft: { ...draft, photos: [...result] } });
        }
    }

    export function deletePhotoFromDaft(id: string): AppThunkAction {
        return (dispatch, getState) => {
            const { rentalObjectState } = getState();

            const draft = rentalObjectState.model;

            if (!draft) return;

            const result = draft.photos.map(o => o.id === id ? { ...o, entityStatus: EntityStatus.Deleted } : o);

            dispatch({ type: ActionTypes.updateDraft, draft: { ...draft, photos: [...result] } });
        }
    }
}