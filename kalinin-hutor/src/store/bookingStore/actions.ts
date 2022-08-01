import { Action } from "redux";
import { ApplicationError, Booking, EntityStatus, SnackbarVariant } from "../../models";
import { bookingService } from "../../services/bookingService";
import { AppThunkAction, AppThunkDispatch, AppState } from "../appState";
import { SnackbarActions } from "../snackbarStore/actions";
import { v4 as uuidv4 } from 'uuid';
import { cookiesService } from "../../services";
import { createSearchParams } from "react-router-dom";
import moment from "moment";
export enum ActionTypes {
    getBookingsRequest = 'GET_BOOKINGS_REQUEST',
    getBookingsSuccess = 'GET_BOOKINGS_SUCCESS',
    getBookingsFailure = 'GET_BOOKINGS_FAILURE',

    getBookingRequest = 'GET_BOOKING_REQUEST',
    getBookingSuccess = 'GET_BOOKING_SUCCESS',
    getBookingFailure = 'GET_BOOKING_FAILURE',

    createRequest = 'CREATE_BOOKING_REQUEST',
    createSuccess = 'CREATE_BOOKING_SUCCESS',
    createFailure = 'CREATE_BOOKING_FAILURE',

    updateRequest = 'UPDATE_BOOKING_REQUEST',
    updateSuccess = 'UPDATE_BOOKING_SUCCESS',
    updateFailure = 'UPDATE_BOOKING_FAILURE',

    clearEditionState = 'CLEAR_EDITION_STATE',

    deleteRequest = 'DELETE_BOOKING_REQUEST',
    deleteSuccess = 'DELETE_BOOKING_SUCCESS',
    deleteFailure = 'DELETE_BOOKING_FAILURE',
}

export namespace BookingActions {
    interface GetBookingsRequestAction extends Action<ActionTypes> {
        type: ActionTypes.getBookingsRequest;
        query?: Booking.GetQuery;
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
        request: Booking.UpdateRequest;
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
        request: Booking.DeleteRequest;
    }

    interface DeleteSuccessAction extends Action<ActionTypes> {
        type: ActionTypes.deleteSuccess;
    }

    interface DeleteFailureAction extends Action<ActionTypes> {
        type: ActionTypes.deleteFailure;
        error: ApplicationError;
    }

    type GetBookings = GetBookingsRequestAction | GetBookingsSuccessAction | GetBookingsFailureAction;
    type GetBooking = GetRequestAction | GetSuccessAction | GetFailureAction;
    type CreateBooking = CreateRequestAction | CreateSuccessAction | CreateFailureAction;
    type UpdateBooking = UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction;
    type DeleteBooking = DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction;

    export type BookingActions = GetBookings
        | GetBooking
        | ClearEditionStateAction
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
                    rentalObjectId: model.rentalObjectId,
                    tenant: model.tenant,
                    bookingRooms: model.roomVariants.map(o => ({
                        amount: o.amount,
                        roomsCount: o.roomsCount,
                        bedType: o.bedType,
                        roomVariantId: o.roomVariantId
                    }))
                });
                dispatch(SnackbarActions.showSnackbar('Бронь успешно создана.', SnackbarVariant.success));
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(): CreateRequestAction { return { type: ActionTypes.createRequest }; }
            function success(booking: Booking): CreateSuccessAction { return { type: ActionTypes.createSuccess, model: booking }; }
            function failure(error: ApplicationError): CreateFailureAction { return { type: ActionTypes.createFailure, error: error }; }
        }
    }

    export function updateBooking(updateRequest: Booking.UpdateRequest): AppThunkAction<Promise<UpdateSuccessAction | UpdateFailureAction>> {
        return async (dispatch) => {
            dispatch(request(updateRequest));

            try {
                const result = await bookingService.update(updateRequest);
                dispatch(SnackbarActions.showSnackbar('Пользователь успешно сохранен', SnackbarVariant.success));
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(updateRequest: Booking.UpdateRequest): UpdateRequestAction { return { type: ActionTypes.updateRequest, request: updateRequest }; }
            function success(booking: Booking): UpdateSuccessAction { return { type: ActionTypes.updateSuccess, model: booking }; }
            function failure(error: ApplicationError): UpdateFailureAction { return { type: ActionTypes.updateFailure, error: error }; }
        }
    }

    export function createDraft(draft: Booking): AppThunkAction<CreateSuccessAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { userState } = getState();

            if (!draft.id) {
                draft.id = uuidv4();
                draft.entityStatus = EntityStatus.Draft;
            }

            if (userState.authenticating === false && userState.currentUser) {
                draft.tenant = userState.currentUser;
            }

            cookiesService.set('booking-draft', draft);
            return dispatch({ type: ActionTypes.createSuccess, model: draft });
        }
    }

    export function updateDraft(draft: Booking): AppThunkAction<UpdateSuccessAction> {
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

            cookiesService.set('booking-draft', draft);
            return dispatch({ type: ActionTypes.updateSuccess, model: draft });
        }
    }

    export function clearEditionState(): ClearEditionStateAction {
        cookiesService.delete('booking-draft');
        return { type: ActionTypes.clearEditionState };
    }

    export function getBookings(query?: Booking.GetQuery): AppThunkAction<Promise<GetBookingsSuccessAction | GetBookingsFailureAction>> {
        return async dispatch => {
            dispatch(request(query));

            try {
                const result = await bookingService.get(query);
                return dispatch(success(result));
            }
            catch (error: any) {
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(query?: Booking.GetQuery): GetBookingsRequestAction { return { type: ActionTypes.getBookingsRequest, query: query }; }
            function success(bookings: Booking[]): GetBookingsSuccessAction { return { type: ActionTypes.getBookingsSuccess, bookings: bookings }; }
            function failure(error: ApplicationError): GetBookingsFailureAction { return { type: ActionTypes.getBookingsFailure, error: error }; }
        }
    }

    export function getDraft(): AppThunkAction<GetSuccessAction> {
        return (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { bookingState } = getState();

            if (bookingState.modelLoading === false && bookingState.model?.entityStatus === EntityStatus.Draft) {
                return dispatch({ type: ActionTypes.getBookingSuccess, booking: bookingState.model });
            }

            const draft = cookiesService.get<Booking>('booking-draft');
            return dispatch({ type: ActionTypes.getBookingSuccess, booking: draft });
        }
    }

    export function getBooking(id: string): AppThunkAction<Promise<GetSuccessAction | GetFailureAction>> {
        return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
            const { bookingState } = getState();

            dispatch(request(id));

            if (bookingState.modelLoading === false)
                return dispatch(success(bookingState.model));
            const draft = cookiesService.get<Booking>('booking-draft');
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
                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));

                return dispatch(failure(error));
            }

            function request(id: string): GetRequestAction { return { type: ActionTypes.getBookingRequest, id: id }; }
            function success(booking: Booking): GetSuccessAction { return { type: ActionTypes.getBookingSuccess, booking: booking }; }
            function failure(error: ApplicationError): GetFailureAction { return { type: ActionTypes.getBookingFailure, error: error }; }
        }
    }

    export function deleteBookings(deleteRequest: Booking.DeleteRequest): AppThunkAction<Promise<DeleteSuccessAction | DeleteFailureAction>> {
        return async (dispatch) => {
            dispatch(request(deleteRequest));

            try {
                await bookingService.delete(deleteRequest);
                dispatch(SnackbarActions.showSnackbar('Пользователь успешно удален.', SnackbarVariant.info));
                return dispatch(success());
            }
            catch (error: any) {

                dispatch(SnackbarActions.showSnackbar(error.message, SnackbarVariant.error));
                return dispatch(failure(error));
            }

            function request(request: Booking.DeleteRequest): DeleteRequestAction { return { type: ActionTypes.deleteRequest, request: request }; }
            function success(): DeleteSuccessAction { return { type: ActionTypes.deleteSuccess }; }
            function failure(error: ApplicationError): DeleteFailureAction { return { type: ActionTypes.deleteFailure, error: error }; }
        }
    }
}