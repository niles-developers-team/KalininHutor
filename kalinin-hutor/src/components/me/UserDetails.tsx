import { Close, Edit, Face, Save } from "@mui/icons-material";
import { Button, CircularProgress, Grid, IconButton, Stack, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { createRef, useState } from "react";
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
    onAvatarChanged: (file: File) => void;
    onUpdateConfirm: () => void;
    onUpdateCancel: () => void;
}

export const UserDetailsComponent = function (props: UserDetailsProps): JSX.Element {
    const [editMode, setEditMode] = useState<boolean>(false);
    const fileInput = createRef<HTMLInputElement>();

    function handleUpdateUserDetailsConfirm() {
        setEditMode(false);
        props.onUpdateConfirm();
    }

    function handleUpdateUserDetailsCancel() {
        setEditMode(false);
        props.onUpdateCancel();
    }

    function handleFileChangeClick() {
        fileInput.current?.click();
    }

    function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        if (!event?.target?.files?.length) return;

        const file = event?.target?.files[0];
        if (file)
            props.onAvatarChanged(file);
        if (event?.target)
            event.target.value = '';
    }

    return (
        <Stack direction="row" spacing={3}>
            <Stack>
                {props.user.avatar ? (
                    <img height={200} width={200} src={`data:${props.user.avatar.extension};base64,${props.user.avatar.body}`}></img>
                ) : (
                    <Face color="primary" sx={{ fontSize: 200 }} />
                )}
                <Button onClick={handleFileChangeClick} type="submit" disabled={!editMode}>Выбрать фото</Button>
                <input accept=".png,.jpeg,.jpg" hidden type="file" ref={fileInput} onChange={(event) => handleAvatarChange(event)} />
            </Stack>
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
        </Stack>
    )
}