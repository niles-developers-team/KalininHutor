import { DatePicker } from "@mui/x-date-pickers";
import { Button, CircularProgress, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { User } from "../../models";
import { AppState } from "../../store";
import { Face, Edit, Save } from '@mui/icons-material';
import { UserActions } from "../../store/userStore";
import moment from "moment";

export const MeComponent = function (): JSX.Element {
    const dispatch = useAppDispatch();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [user, setUser] = useState<User>(User.initial);
    const { userState } = useAppSelector((state: AppState) => ({
        userState: state.userState
    }));

    useEffect(() => {
        if (userState.authenticating === false && userState.authenticated === true) {
            setUser(userState.currentUser || User.initial);
        }
    }, [userState.modelLoading]);

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
        setEditMode(false);
        dispatch(UserActions.updateUser({
            id: user.id || '',
            phoneNumber: user.phoneNumber,
            birthday: user.birthday || undefined,
            email: user.email,
            lastname: user.lastname,
            name: user.name
        }));
    }

    return (
        <Grid container direction="column" alignItems="center">
            <Grid item>
                <Grid container direction="row">
                    <Stack>
                        <Face color="primary" sx={{ fontSize: 200 }} />
                        <Button>Выбрать фото</Button>
                    </Stack>
                    <Grid item>
                        <Grid container direction="column">
                            <Grid container direction="row" alignItems="center">
                                <Typography variant="h5">Учетные данные</Typography>
                                <Grid item xs></Grid>
                                {userState.modelLoading
                                    ? <CircularProgress size={36} />
                                    : (!editMode
                                        ? <IconButton onClick={() => setEditMode(true)}><Edit /></IconButton>
                                        : <IconButton color="primary" onClick={handleUpdateUserDetailsConfirm}><Save /></IconButton>
                                    )}
                            </Grid>
                            <Stack direction="row" spacing={3}>
                                <TextField label="Номер телефона" type="tel" value={user.phoneNumber || ''} onChange={handlePhoneNumberChanged} />
                                <TextField label="E-mail" type="email" value={user.email || ''} onChange={handleEmailChanged} />
                            </Stack>
                            <Stack direction="row" spacing={3}>
                                <TextField label="Имя" value={user.name || ''} onChange={handleNameChanged} />
                                <TextField label="Фамилия" value={user.lastname || ''} onChange={handleLastnameChanged} />
                            </Stack>
                            <Grid container direction="row">
                                <DatePicker
                                    value={user.birthday || null}
                                    label="Дата рождения"
                                    onAccept={handleBirthdayAccepted}
                                    onChange={handleBirthdayChanged}
                                    renderInput={(params) => <TextField type="date" {...params} />}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}