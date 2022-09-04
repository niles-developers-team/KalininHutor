import { Button, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Booking, RentalObject } from "../../models";
import { AppState, BookingActions, RoomCharacteristicActions } from "../../store";
import { Face } from '@mui/icons-material';
import { UserActions } from "../../store/userStore";
import moment from "moment";
import { UserDetailsComponent } from "./UserDetails";
import { MyRentalObjectsComponent } from "./MyRentalObjects";
import { RentalObjectActions } from "../../store/rentalObjectStore";
import { useNavigate } from "react-router-dom";
import { MyRentalObjectsBookingsComponent } from "./MyRentalObjectsBookings";
import { BookingDetailsDialog } from "./BookingDetailsDialog";

export const MeComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        userState,
        rentalObjectState,
        bookingState,
        roomCharacteristicState
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

    if (!userState.currentUser)
        return (<Typography>Ошибка авторизации</Typography>);

    const currentUser = userState.currentUser;
    const rentalObjects: RentalObject[] = rentalObjectState.models || [];
    const bookings: Booking[] = bookingState.models || [];
    const characteristics = roomCharacteristicState.models || [];

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Stack>
                    <Face color="primary" sx={{ fontSize: 200 }} />
                    <Button>Выбрать фото</Button>
                </Stack>
                <UserDetailsComponent
                    loading={userState.modelLoading}
                    user={currentUser}
                    onBirthdayAccepted={handleBirthdayAccepted}
                    onBirthdayChanged={handleBirthdayChanged}
                    onEmailChanged={handleEmailChanged}
                    onLastnameChanged={handleLastnameChanged}
                    onNameChanged={handleNameChanged}
                    onPhoneNumberChanged={handlePhoneNumberChanged}
                    onUpdateConfirm={handleUpdateUserDetailsConfirm}
                    onUpdateCancel={handleUpdateUserDetailsCancel}
                />
            </Stack>
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