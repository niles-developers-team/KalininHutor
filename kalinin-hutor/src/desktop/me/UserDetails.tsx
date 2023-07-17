import { Face } from "@mui/icons-material";
import { Button, Card, CircularProgress, Grid, Skeleton, Stack, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { createRef } from "react";
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
}

export const UserDetailsSkeleton = function (): JSX.Element {
    return (
        <Stack spacing={2}>
            <Typography color="GrayText" variant="h6">Личные данные</Typography>
            <Stack direction="row" spacing={3}>
                <Stack spacing={1}>
                    <Skeleton variant="circular" height={200} width={200} />
                    <Skeleton width="100%" variant="rounded"><Button fullWidth /></Skeleton>
                </Stack>
                <Card >
                    <Stack spacing={2} margin={2}>
                        <Stack direction="row" spacing={3}>
                            <Stack>
                                <Typography variant="body2" color="GrayText">Номер телефона</Typography>
                                <Skeleton width="100%" variant="rounded" />
                            </Stack>
                            <Stack>
                                <Typography variant="body2" color="GrayText">E-mail</Typography>
                                <Skeleton width="100%" variant="rounded" />
                            </Stack>
                        </Stack>
                        <Stack direction="row" spacing={3}>
                            <Stack>
                                <Typography variant="body2" color="GrayText">Имя</Typography>
                                <Skeleton width="100%" variant="rounded" />
                            </Stack>
                            <Stack>
                                <Typography variant="body2" color="GrayText">Фамилия</Typography>
                                <Skeleton width="100%" variant="rounded" />
                            </Stack>
                        </Stack>
                        <Stack>
                            <Typography variant="body2" color="GrayText">Дата рождения</Typography>
                            <Stack direction="row" spacing={3}>
                                <Skeleton width="100%" variant="rounded" />
                                <Grid item xs />
                                <Skeleton variant="rounded"><Button fullWidth /></Skeleton>
                            </Stack>
                        </Stack>
                    </Stack>
                </Card>
            </Stack >
        </Stack >
    );
}

export const UserDetailsComponent = function (props: UserDetailsProps): JSX.Element {
    const fileInput = createRef<HTMLInputElement>();

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
        <Stack spacing={2}>
            <Typography color="GrayText" variant="h6">Личные данные</Typography>
            <Stack direction="row" spacing={3}>
                <Stack spacing={1}>
                    {props.user.avatar ? (
                        <img height={200} width={200} style={{ borderRadius: '50%', objectFit: "cover" }} src={`data:${props.user.avatar.extension};base64,${props.user.avatar.body}`}></img>
                    ) : (
                        <Face color="primary" sx={{ fontSize: 200 }} />
                    )}
                    <Button fullWidth onClick={handleFileChangeClick} type="submit">Выбрать фото</Button>
                    <input accept=".png,.jpeg,.jpg" hidden type="file" ref={fileInput} onChange={(event) => handleAvatarChange(event)} />
                </Stack>
                <Card >
                    <Stack spacing={2} margin={2}>
                        <Stack direction="row" spacing={3}>
                            <Stack>
                                <Typography variant="body2" color="GrayText">Номер телефона</Typography>
                                <TextField size="small" type="tel" value={props.user.phoneNumber || ''} onChange={props.onPhoneNumberChanged} />
                            </Stack>
                            <Stack>
                                <Typography variant="body2" color="GrayText">E-mail</Typography>
                                <TextField size="small" type="email" value={props.user.email || ''} onChange={props.onEmailChanged} />
                            </Stack>
                        </Stack>
                        <Stack direction="row" spacing={3}>
                            <Stack>
                                <Typography variant="body2" color="GrayText">Имя</Typography>
                                <TextField size="small" value={props.user.name || ''} onChange={props.onNameChanged} />
                            </Stack>
                            <Stack>
                                <Typography variant="body2" color="GrayText">Фамилия</Typography>
                                <TextField size="small" value={props.user.lastname || ''} onChange={props.onLastnameChanged} />
                            </Stack>
                        </Stack>
                        <Stack>
                            <Typography variant="body2" color="GrayText">Дата рождения</Typography>
                            <Stack direction="row" spacing={3}>
                                <DatePicker
                                    value={props.user.birthday || null}
                                    onAccept={props.onBirthdayAccepted}
                                    onChange={props.onBirthdayChanged}
                                    renderInput={(params) => <TextField size="small" type="date" {...params} />}
                                />
                                <Grid item xs />
                                <Button onClick={props.onUpdateConfirm}>Сохранить</Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Card>
            </Stack >
        </Stack >
    )
}