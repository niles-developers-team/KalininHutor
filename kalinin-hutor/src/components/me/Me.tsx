import { Button, Grid, Stack, Typography } from "@mui/material";
import { createRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Booking, EntityStatus, FileObject, RentalObject } from "../../models";
import { AppState, BookingActions, NotificationActions, RoomCharacteristicActions } from "../../store";
import { Face, RedeemRounded } from '@mui/icons-material';
import { UserActions } from "../../store/userStore";
import moment from "moment";
import { UserDetailsComponent } from "./UserDetails";
import { MyRentalObjectsComponent } from "./MyRentalObjects";
import { RentalObjectActions } from "../../store/rentalObjectStore";
import { useNavigate } from "react-router-dom";
import { MyRentalObjectsBookingsComponent } from "./MyRentalObjectsBookings";
import { BookingDetailsDialog } from "./BookingDetailsDialog";
import { MyNotificationsComponent } from "./notifications/MyNotifications";
import { v4 as guid } from 'uuid';

export const MeComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        userState,
        rentalObjectState,
        bookingState,
        roomCharacteristicState,
        notificationState
    } = useAppSelector((state: AppState) => state);

    const [bookingInfoDialogOpen, setBookingInfoDialogOpen] = useState<boolean>(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking>();

    useEffect(() => {
        if (userState.authenticating === false && userState.authenticated === true) {
            dispatch(RentalObjectActions.getRentalObjects({ landlordId: currentUser.id }));
            dispatch(BookingActions.getLandlordBookings(true));
        }
    }, [userState.modelLoading]);

    useEffect(() => {
        dispatch(RoomCharacteristicActions.getRoomCharacteristics());
        dispatch(UserActions.getCurrentUser());
    }, []);

    function handlePhoneNumberChanged(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(UserActions.updateCurrentUserDraft({ ...currentUser, phoneNumber: event.currentTarget && event.currentTarget.value }));
    }

    function handleEmailChanged(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(UserActions.updateCurrentUserDraft({ ...currentUser, email: event.currentTarget && event.currentTarget.value }));

    }

    function handleNameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(UserActions.updateCurrentUserDraft({ ...currentUser, name: event.currentTarget && event.currentTarget.value }));
    }

    function handleLastnameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(UserActions.updateCurrentUserDraft({ ...currentUser, lastname: event.currentTarget && event.currentTarget.value }));
    }

    function handleBirthdayChanged(value: string | null | undefined, keyboardInputValue: string | undefined) {
        dispatch(UserActions.updateCurrentUserDraft({ ...currentUser, birthday: value ? moment(value).format('yyyy-MM-DD') : null }));
    }

    function handleBirthdayAccepted(value: string | null | undefined) {
        dispatch(UserActions.updateCurrentUserDraft({ ...currentUser, birthday: value ? moment(value).format('yyyy-MM-DD') : null }));
    }

    function handleUpdateUserDetailsConfirm() {
        dispatch(UserActions.updateUser(currentUser));
    }

    function handleUpdateUserDetailsCancel() { dispatch(UserActions.getCurrentUser()); }

    function handleCreateRentalObject() { navigate(`/me/rental-objects/create`); }

    function handleEditRentalObject(model: RentalObject) { navigate(`/me/rental-objects/${model.id}`); }

    function handleDeleteRentalObject(model: RentalObject) {
        dispatch(RentalObjectActions.deleteRentalObjects({ ids: [(model.id || '')] }));
    }

    function handleSignout() {
        dispatch(UserActions.signout());
        navigate('/');
    }

    async function handleBookingApprove(booking: Booking) {
        await dispatch(BookingActions.approveBooking(booking));
        await dispatch(BookingActions.getLandlordBookings(true));
    }

    function handleShowBookingInfo(booking: Booking) {
        setBookingInfoDialogOpen(true);
        setSelectedBooking(booking);
    }

    function handleCloseBookingInfo() {
        setBookingInfoDialogOpen(false);
        setSelectedBooking(undefined);
    }

    function handleMarkNotifyAsRead(id: string) {
        dispatch(NotificationActions.markAsRead(id));
    }

    async function handleAvatarChanged(file: File) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        if (!reader)
            return;
        reader.onload = () => {
            if (!reader.result || typeof reader.result !== 'string')
                return;

            const body = reader.result.substring(reader.result.indexOf(',') + 1);

            const avatar: FileObject = {
                id: guid(),
                body: body,
                extension: file.type,
                name: file.name,
                sortOrder: 0,
                entityStatus: EntityStatus.Draft
            };
            dispatch(UserActions.updateCurrentUserDraft({ ...currentUser, avatar: avatar }));
        };
    }

    function handleAvatarDelete() {
        dispatch(UserActions.updateCurrentUserDraft({ ...currentUser, avatar: undefined }));
    }

    if (!userState.currentUser)
        return (<Typography>Ошибка авторизации</Typography>);

    const currentUser = userState.currentUser;
    const rentalObjects: RentalObject[] = rentalObjectState.models || [];
    const bookings: Booking[] = bookingState.models || [];
    const characteristics = roomCharacteristicState.models || [];

    return (
        <Stack spacing={3}>
            <UserDetailsComponent
                loading={userState.modelLoading}
                user={currentUser}
                onBirthdayAccepted={handleBirthdayAccepted}
                onBirthdayChanged={handleBirthdayChanged}
                onEmailChanged={handleEmailChanged}
                onLastnameChanged={handleLastnameChanged}
                onNameChanged={handleNameChanged}
                onPhoneNumberChanged={handlePhoneNumberChanged}
                onAvatarChanged={handleAvatarChanged}
                onAvatarDelete={handleAvatarDelete}
                onUpdateConfirm={handleUpdateUserDetailsConfirm}
                onUpdateCancel={handleUpdateUserDetailsCancel}
            />
            <MyNotificationsComponent
                notifications={notificationState.models}
                markAsRead={handleMarkNotifyAsRead}
            />
            <MyRentalObjectsBookingsComponent
                bookings={bookings}
                loading={bookingState.modelsLoading}
                onBookingApprove={handleBookingApprove}
                onShowInfo={handleShowBookingInfo}
            />
            <MyRentalObjectsComponent
                loading={rentalObjectState.modelsLoading}
                models={rentalObjects}
                onCreate={handleCreateRentalObject}
                onEdit={handleEditRentalObject}
                onDelete={handleDeleteRentalObject} />
            <Stack direction="row">
                <Grid item xs />
                <Button color="error" onClick={handleSignout}>Выйти из аккаунта</Button>
            </Stack>
            <BookingDetailsDialog
                open={bookingInfoDialogOpen}
                booking={selectedBooking}
                characteristics={characteristics}
                onApprove={handleBookingApprove}
                onClose={handleCloseBookingInfo}
            />
        </Stack>
    );
}