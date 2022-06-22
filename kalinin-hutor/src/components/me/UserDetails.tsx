import { Close, Edit, Save } from "@mui/icons-material";
import { CircularProgress, Grid, IconButton, Stack, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { useState } from "react";
import { User } from "../../models"

export interface UserDetailsProps {
    loading: boolean;
    user: User
    onPhoneNumberChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onNameChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onLastnameChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBirthdayChanged: (value: string | null | undefined, keyboardInputValue: string | undefined) => void;
    onBirthdayAccepted: (value: string | null | undefined) => void;
    onUpdateConfirm: () => void;
    onUpdateCancel: () => void;
}

export const UserDetailsComponent = function (props: UserDetailsProps): JSX.Element {
    const [editMode, setEditMode] = useState<boolean>(false);

    function handleUpdateUserDetailsConfirm() {
        setEditMode(false);
        props.onUpdateConfirm();
    }

    function handleUpdateUserDetailsCancel() {
        setEditMode(false);
        props.onUpdateCancel();
    }

    return (
        <Stack spacing={2}>
            <Stack direction="row">
                <Typography color="GrayText" variant="h6">Учетные данные</Typography>
                <Grid item xs></Grid>
                {props.loading
                    ? <CircularProgress size={36} />
                    : (!editMode
                        ? <IconButton onClick={() => setEditMode(true)}><Edit /></IconButton>
                        : (<>
                            <IconButton color="primary" onClick={handleUpdateUserDetailsConfirm}><Save /></IconButton>
                            <IconButton onClick={handleUpdateUserDetailsCancel}><Close /></IconButton>
                        </>)
                    )}
            </Stack>
            <Stack direction="row" spacing={3}>
                <TextField InputProps={{ readOnly: !editMode }} label="Номер телефона" type="tel" value={props.user.phoneNumber || ''} onChange={props.onPhoneNumberChanged} />
                <TextField InputProps={{ readOnly: !editMode }} label="E-mail" type="email" value={props.user.email || ''} onChange={props.onEmailChanged} />
            </Stack>
            <Stack direction="row" spacing={3}>
                <TextField InputProps={{ readOnly: !editMode }} label="Имя" value={props.user.name || ''} onChange={props.onNameChanged} />
                <TextField InputProps={{ readOnly: !editMode }} label="Фамилия" value={props.user.lastname || ''} onChange={props.onLastnameChanged} />
            </Stack>
            <DatePicker
                value={props.user.birthday || null}
                label="Дата рождения"
                onAccept={props.onBirthdayAccepted}
                onChange={props.onBirthdayChanged}
                readOnly={!editMode}
                renderInput={(params) => <TextField type="date" {...params} />}
            />
        </Stack>
    )
}