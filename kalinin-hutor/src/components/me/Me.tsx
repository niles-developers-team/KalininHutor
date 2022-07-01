import { Button, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RentalObject, User } from "../../models";
import { AppState } from "../../store";
import { Face } from '@mui/icons-material';
import { UserActions } from "../../store/userStore";
import moment from "moment";
import { UserDetailsComponent } from "./UserDetails";
import { MyRentalObjectsComponent } from "./MyRentalObjects";
import { RentalObjectActions } from "../../store/rentalObjectStore";
import { useNavigate } from "react-router-dom";

export const MeComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const [user, setUser] = useState<User>(User.initial);
    const navigate = useNavigate();
    const [rentalObjects, setRentalObjects] = useState<RentalObject[]>([]);
    const { userState, rentalObjectState } = useAppSelector((state: AppState) => ({
        userState: state.userState,
        rentalObjectState: state.rentalObjectState
    }));

    useEffect(() => {
        if (userState.authenticating === false && userState.authenticated === true) {
            setUser(userState.currentUser === undefined ? User.initial : { ...userState.currentUser });
            dispatch(RentalObjectActions.getRentalObjects({ landlordId: user.id }));
        }
    }, [userState.modelLoading]);

    useEffect(() => {
        if (rentalObjectState.modelsLoading === false) {
            setRentalObjects(rentalObjectState.models);
        }
    }, [rentalObjectState.modelsLoading]);

    function handlePhoneNumberChanged(event: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, phoneNumber: event.currentTarget && event.currentTarget.value });
    }

    function handleEmailChanged(event: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, email: event.currentTarget && event.currentTarget.value });

    }

    function handleNameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, name: event.currentTarget && event.currentTarget.value });

    }

    function handleLastnameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, lastname: event.currentTarget && event.currentTarget.value });

    }

    function handleBirthdayChanged(value: string | null | undefined, keyboardInputValue: string | undefined) {
        setUser({ ...user, birthday: value ? moment(value).format('yyyy-MM-DD') : null });
    }

    function handleBirthdayAccepted(value: string | null | undefined) {
        setUser({ ...user, birthday: value ? moment(value).format('yyyy-MM-DD') : null });
    }

    function handleUpdateUserDetailsConfirm() {
        dispatch(UserActions.updateUser({
            id: user.id || '',
            phoneNumber: user.phoneNumber,
            birthday: user.birthday || undefined,
            email: user.email,
            lastname: user.lastname,
            name: user.name
        }));
    }

    function handleUpdateUserDetailsCancel() {
        if (userState.authenticating === false)
            setUser(userState.currentUser === undefined ? User.initial : { ...userState.currentUser });
    }

    function handleCreateRentalObject() {
        navigate(`/me/rental-objects/create`);
    }

    function handleEditRentalObject(model: RentalObject) {
        navigate(`/me/rental-objects/${model.id}`);
    }

    function handleDeleteRentalObject(model: RentalObject) {
        dispatch(RentalObjectActions.deleteRentalObjects({
            id: model.id || ''
        }));
    }

    function handleSignout() {
        dispatch(UserActions.signout());
        navigate('/');
    }

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Stack>
                    <Face color="primary" sx={{ fontSize: 200 }} />
                    <Button>Выбрать фото</Button>
                </Stack>
                <UserDetailsComponent
                    loading={userState.modelLoading}
                    user={user}
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
        </Stack>
    );
}