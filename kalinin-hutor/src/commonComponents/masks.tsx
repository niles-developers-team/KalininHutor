

import { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

interface MaskedInputProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

export const PhoneMaskCustom = forwardRef<HTMLElement | null, MaskedInputProps>(
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

export const PasswordMaskCustom = forwardRef<HTMLElement, MaskedInputProps>(
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

/** Маска для контрола координат */
export const CoordinatesMaskCustom = forwardRef<HTMLElement, MaskedInputProps> (
    function CoordinatesMaskCustom(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask="##.######, ##.######"
                definitions={{ '#': /[0-9]/, }}
                inputRef={ref as any}
                onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
                overwrite
            />
        );
    },
)