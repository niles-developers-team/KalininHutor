import { Action } from "redux";
import { ApplicationError, Booking, BookingStatuses, EntityStatus, NotificationVariant } from "../../models";
import { bookingService } from "../../services/bookingService";
import { AppThunkAction, AppThunkDispatch, AppState } from "../appState";
import { NotificationActions } from "../notificationStore/actions";
import { v4 as uuidv4 } from 'uuid';
import { localStorageService } from "../../services";
import { createSearchParams } from "react-router-dom";
import moment from "moment";

const draftName = 'booking-draft';

export enum ActionTypes {
    getBookingsRequest = 'GET_BOOKINGS_REQUEST',
    getBookingsSuccess = 'GET_BOOKINGS_SUCCESS',
    getBookingsFailure = 'GET_BOOKINGS_FAILURE',

    getBookingRequest = 'GET_BOOKING_REQUEST',
    getBookingSuccess = 'GET_BOOKING_SUCCESS',
    getBookingFailure = 'GET_BOOKING_FAILURE',

    createDraft = 'CREATE_BOOKING_DRAFT',
    updateDraft = 'UPDATE_BOOKING_DRAFT',

    createRequest = 'CREATE_BOOKING_REQUEST',
    createSuccess = 'CREATE_BOOKING_SUCCESS',
    createFailure = 'CREATE_BOOKING_FAILURE',

    updateRequest = 'UPDATE_BOOKING_REQUEST',
    updateSuccess = 'UPDATE_BOOKING_SUCCESS',
    updateFailure = 'UPDATE_BOOKING_FAILURE',

    deleteRequest = 'DELETE_BOOKING_REQUEST',
    deleteSuccess = 'DELETE_BOOKING_SUCCESS',
    deleteFailure = 'DELETE_BOOKING_FAILURE',

    clearEditionState = 'CLEAR_EDITION_STATE',
}

export namespace BookingActions {
    interface GetBookingsRequestAction extends Action<ActionTypes> {
        type: ActionTypes.getBookingsRequest;
    }

    interface GetBookingsSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.getBookingsSuccess;
        bookings: Booking[];
    }

    interface GetBookingsFailureAction extends Action<ActionTypes> {
        type: ActionTypes.getBookingsFailure;
        error: ApplicationError;
    }

    interface GetRequestAction extends Action<ActionTypes> {
        type: ActionTypes.getBookingRequest;
        id: string;
    }

    interface GetSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.getBookingSuccess;
        booking: Booking;
    }

    interface GetFailureAction extends Action<ActionTypes> {
        type: ActionTypes.getBookingFailure;
        error: ApplicationError;
    }

    interface CreateDraftAction extends Action<ActionTypes> {
        type: ActionTypes.createDraft;
        draft: Booking;
    }

    interface UpdateDraftAction extends Action<ActionTypes> {
        type: ActionTypes.updateDraft;
        draft: Booking;
    }

    interface CreateRequestAction extends Action<ActionTypes> {
        type: ActionTypes.createRequest;
    }

    interface CreateSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.createSuccess;
        model: Booking;
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
        model: Booking;
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
        id: string;
    }

    interface DeleteFailureAction extends Action<ActionTypes> {
        type: ActionTypes.deleteFailure;
        error: ApplicationError;
    }

    type GetBookings = GetBookingsRequestAction | GetBookingsSuccessAction | GetBookingsFailureAction;
    type GetBooking = GetRequestAction | GetSuccessAction | GetFailureAction;
    type DraftBooking = CreateDraftAction | UpdateDraftAction;
    type CreateBooking = CreateRequestAction | CreateSuccessAction | CreateFailureAction;
    type UpdateBooking = UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction;
    type DeleteBooking = DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction;

    export type BookingActions = GetBookings
        | GetBooking
        | ClearEditionStateAction
        | DraftBooking
        | CreateBooking
        | UpdateBooking
        | DeleteBooking;

    export function createBooking(model: Booking): AppThunkAction<Promise<CreateSuccessAction | CreateFailureAction>> {
        return async (dispatch) => {
            dispatch(request());

            try {
                const result = await bookingService.create({
                    adultCount: model.adultCount,
                    childCount: model.childCount,
                    checkinDate: model.checkinDate,
                    checkoutDate: model.checkoutDate,
                    rentalObjectId: model.rentalObject.id,
                    tenant: model.tenant,
                    bookingRooms: model.roomVariants.map(o => ({
                        amount: o.amount,
                        roomsCount: o.roomsCount,
                        bedType: o.bedType,
                        roomVariantId: o.roomVariantId
                    }))
                });

                result.entityStatus = EntityStatus.NotChanged;

                dispatch(NotificationActions.showSnackbar('Бронь успешно создана.', NotificationVariant.success));
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(NotificationActions.showSnackbar(error.message, NotificationVariant.error));

                return dispatch(failure(error));
            }

            function request(): CreateRequestAction { return { type: ActionTypes.createRequest }; }
            function success(booking: Booking): CreateSuccessAction { return { type: ActionTypes.createSuccess, model: booking }; }
            function failure(error: ApplicationError): CreateFailureAction { return { type: ActionTypes.createFailure, error: error }; }
        }
    }

    export function approveBooking(model: Booking): AppThunkAction<Promise<UpdateSuccessAction | UpdateFailureAction>> {
        return async (dispatch) => {
            dispatch(request());

            try {
                await bookingService.approveBooking(model.id || '');
                dispatch(NotificationActions.showSnackbar('Бронь подтверждена', NotificationVariant.success));
                return dispatch(success(model));
            }
            catch (error: any) {
                dispatch(NotificationActions.showSnackbar(error.message, NotificationVariant.error));

                return dispatch(failure(error));
            }

            function request(): UpdateRequestAction { return { type: ActionTypes.updateRequest }; }
            function success(booking: Booking): UpdateSuccessAction { return { type: ActionTypes.updateSuccess, model: booking }; }
            function failure(error: ApplicationError): UpdateFailureAction { return { type: ActionTypes.updateFailure, error: error }; }
        }
    }

    export function createDraft(): AppThunkAction<CreateDraftAction | ClearEditionStateAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { userState, rentalObjectState } = getState();


            if (userState.currentUser === undefined) {
                dispatch(NotificationActions.showSnackbar("Попытка создать бронь неавторизованным пользователем", NotificationVariant.error));
                return { type: ActionTypes.clearEditionState };
            }

            if(!rentalObjectState.model){
                dispatch(NotificationActions.showSnackbar("Попытка создать бронь в неизвестном объекте аренды", NotificationVariant.error));
                return { type: ActionTypes.clearEditionState };
            }

            const draft: Booking = {
                id: uuidv4(),
                entityStatus: EntityStatus.Draft,
                tenant: userState.currentUser,
                adultCount: 1,
                checkinDate: moment().format('YYYY-MM-DD'),
                checkoutDate: moment().add(10, 'days').format('YYYY-MM-DD'),
                childCount: 0,
                number: 0,
                rentalObject: rentalObjectState.model,
                roomVariants: [],
                status: BookingStatuses.Draft,
                total: 0
            };

            localStorageService.set(draftName, draft);
            return dispatch({ type: ActionTypes.createDraft, draft });
        }
    }

    export function saveDraft(draft: Booking): AppThunkAction<UpdateDraftAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { userState } = getState();
            const search = createSearchParams();
            if (draft.adultCount)
                search.append('adultsCount', draft.adultCount.toString());
            if (draft.childCount)
                search.append('childsCount', draft.childCount.toString());
            if (draft.checkinDate)
                search.append('checkinDate', moment(draft.checkinDate).format('YYYY-MM-DD'));
            if (draft.checkoutDate)
                search.append('checkoutDate', moment(draft.checkoutDate).format('YYYY-MM-DD'));

            if (userState.authenticating === false && userState.currentUser) {
                draft.tenant = userState.currentUser;
            }

            if (draft.entityStatus !== EntityStatus.Draft) {
                draft.entityStatus = EntityStatus.Updated;
            }

            const nightsCount = moment(draft.checkoutDate).dayOfYear() - moment(draft.checkinDate).dayOfYear();
            const roomVariants = draft.roomVariants.map(o => ({ ...o, amount: o.price * o.roomsCount * nightsCount }));
            const total = roomVariants.reduce((sum, curr) => sum += curr.amount, 0);

            localStorageService.set(draftName, { ...draft, total: total, roomVariants: roomVariants });
            return dispatch({ type: ActionTypes.updateDraft, draft: { ...draft, total: total, roomVariants: roomVariants } });
        }
    }

    export function clearEditionState(): ClearEditionStateAction {
        localStorageService.delete(draftName);
        return { type: ActionTypes.clearEditionState };
    }

    export function getLandlordBookings(onlyNotApproved: boolean): AppThunkAction<Promise<GetBookingsSuccessAction | GetBookingsFailureAction>> {
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { userState } = getState();
            dispatch(request());

            if (userState.authenticating === false && !userState.currentUser) {
                dispatch(NotificationActions.showSnackbar('Невозоможно загрузить бронирования неизвестного арендодателя'));
                return dispatch(failure(new ApplicationError('Невозоможно загрузить бронирования неизвестного арендодателя')));
            }

            try {
                const result = await bookingService.getLandlordBookings(userState.currentUser?.id || '', onlyNotApproved);
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(NotificationActions.showSnackbar(error.message, NotificationVariant.error));

                return dispatch(failure(error));
            }

            function request(): GetBookingsRequestAction { return { type: ActionTypes.getBookingsRequest }; }
            function success(bookings: Booking[]): GetBookingsSuccessAction { return { type: ActionTypes.getBookingsSuccess, bookings: bookings }; }
            function failure(error: ApplicationError): GetBookingsFailureAction { return { type: ActionTypes.getBookingsFailure, error: error }; }
        }
    }

    export function getBookings(query?: Booking.GetQuery): AppThunkAction<Promise<GetBookingsSuccessAction | GetBookingsFailureAction>> {
        return async dispatch => {
            dispatch(request());

            try {
                const result = await bookingService.get(query);
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(NotificationActions.showSnackbar(error.message, NotificationVariant.error));

                return dispatch(failure(error));
            }

            function request(): GetBookingsRequestAction { return { type: ActionTypes.getBookingsRequest }; }
            function success(bookings: Booking[]): GetBookingsSuccessAction { return { type: ActionTypes.getBookingsSuccess, bookings: bookings }; }
            function failure(error: ApplicationError): GetBookingsFailureAction { return { type: ActionTypes.getBookingsFailure, error: error }; }
        }
    }

    export function getDraft(): AppThunkAction<GetSuccessAction | CreateDraftAction | ClearEditionStateAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { bookingState } = getState();

            if (bookingState.modelLoading === false && bookingState.model?.entityStatus === EntityStatus.Draft) {
                return dispatch({ type: ActionTypes.getBookingSuccess, booking: bookingState.model });
            }

            const draft = localStorageService.get<Booking>(draftName);
            if(!draft)
                return dispatch(createDraft());

            return dispatch({ type: ActionTypes.getBookingSuccess, booking: draft });
        }
    }

    export function getBooking(id: string): AppThunkAction<Promise<GetSuccessAction | GetFailureAction>> {
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { bookingState } = getState();

            dispatch(request(id));

            if (bookingState.modelLoading === false)
                return dispatch(success(bookingState.model));
            const draft = localStorageService.get<Booking>(draftName);
            if (draft && draft.id === id)
                return dispatch(success(draft));

            let models: Booking[] = [];

            try {
                if (bookingState.modelsLoading === true)
                    models = await bookingService.get({ id });
                else
                    models = bookingState.models;

                let model = models.find(o => o.id === id);

                if (!model) {
                    throw new ApplicationError('Не удалось найти бронирование');
                }

                return dispatch(success(model));
            }
            catch (error: any) {
                dispatch(NotificationActions.showSnackbar(error.message, NotificationVariant.error));

                return dispatch(failure(error));
            }

            function request(id: string): GetRequestAction { return { type: ActionTypes.getBookingRequest, id: id }; }
            function success(booking: Booking): GetSuccessAction { return { type: ActionTypes.getBookingSuccess, booking: booking }; }
            function failure(error: ApplicationError): GetFailureAction { return { type: ActionTypes.getBookingFailure, error: error }; }
        }
    }

    export function deleteBookings(deleteRequest: Booking.DeleteRequest): AppThunkAction<Promise<DeleteSuccessAction | DeleteFailureAction>> {
        return async (dispatch) => {
            dispatch(request());

            try {
                await bookingService.delete(deleteRequest);
                dispatch(NotificationActions.showSnackbar('Пользователь успешно удален.', NotificationVariant.info));
                return dispatch(success(deleteRequest.id));
            }
            catch (error: any) {

                dispatch(NotificationActions.showSnackbar(error.message, NotificationVariant.error));
                return dispatch(failure(error));
            }

            function request(): DeleteRequestAction { return { type: ActionTypes.deleteRequest }; }
            function success(id: string): DeleteSuccessAction { return { type: ActionTypes.deleteSuccess, id: id }; }
            function failure(error: ApplicationError): DeleteFailureAction { return { type: ActionTypes.deleteFailure, error: error }; }
        }
    }
}