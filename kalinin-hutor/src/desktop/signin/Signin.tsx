import { Dialog, DialogContent, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import { PasswordMaskCustom, PhoneMaskCustom } from "../../commonComponents";

interface DialogProps {
    isOpen: boolean;
    authenticating: boolean;
    onSignin: (phoneNumber: string, password: string) => void;
    onClose: () => void;
}

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