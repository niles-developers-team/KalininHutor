import { Dialog, DialogContent, DialogTitle, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { forwardRef, useState } from "react";
import LoadingButton from '@mui/lab/LoadingButton';

import { IMaskInput } from 'react-imask';

export interface DialogProps {
    isOpen: boolean;
    authenticating: boolean;
    onSignin: (phoneNumber: string, password: string) => void;
    onClose: () => void;
}

interface MaskedInputProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const PhoneMaskCustom = forwardRef<HTMLElement | null, MaskedInputProps>(
    function PhoneMaskCustom(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask="(###) ###-##-##"
                definitions={{ '#': /[0-9]/, }}
                inputRef={ref as any}
                onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
                overwrite
            />
        );
    },
);

const PasswordMaskCustom = forwardRef<HTMLElement, MaskedInputProps>(
    function PasswordMaskCustom(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask="#####"
                definitions={{ '#': /[0-9]/, }}
                inputRef={ref as any}
                onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
                overwrite
            />
        );
    },
);

export const SigninDialog = function (props: DialogProps) {

    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [password, setPassword] = useState<string>();

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSignin = () => {
        props.onSignin(phoneNumber!, password!);
    }

    return (
        <Dialog open={props.isOpen} maxWidth="xs" onClose={props.onClose}>
            <DialogContent>
            <Typography variant="h5">Добро пожаловать!</Typography>
                <Grid container direction="column">
                    <TextField
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        margin="normal" variant="standard"
                        label="Введите телефон"
                        InputLabelProps={{ shrink: true, }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">+7</InputAdornment>,
                            inputComponent: PhoneMaskCustom as any
                        }}>
                    </TextField>
                    <TextField
                        value={password}
                        onChange={handlePasswordChange}
                        margin="normal" variant="standard"
                        label="Введите пароль"
                        placeholder="*****"
                        type="password"
                        InputLabelProps={{ shrink: true, }}
                        InputProps={{ inputComponent: PasswordMaskCustom as any }}
                    />
                    <LoadingButton
                        onClick={handleSignin}    
                        className="margin-top-1"                  
                        variant="contained"
                        color="primary">Войти</LoadingButton >
                </Grid>
            </DialogContent>
        </Dialog>
    );
}