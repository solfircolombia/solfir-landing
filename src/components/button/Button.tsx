import * as React from 'react';
import './button.scss';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'dark' | 'light';

type ButtonProps = {
    btnStyle?: 'regular' | 'rounded';
    variant?: Variant;
    textVariant?: Variant;
    size?: 'small' | 'medium' | 'large' | number;
    children?: React.ReactNode;
    className?: string;
};

export const Button: React.FC<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    btnStyle = 'regular',
    children,
    className,
    size = 'medium',
    variant = 'primary',
    textVariant,
    ...props
}) => {
    const BASE_CLASS = 'button';
    const sizeIsNumber: boolean = typeof size === 'number';

    let btnStyles: React.CSSProperties = {};

    if (sizeIsNumber && btnStyle === 'rounded') {
        btnStyles = {
            height: `${size}px`,
            width: `${size}px`,
            borderRadius: `${(size as unknown as number) / 2}px`,
        };
    }

    return (
        <button
            style={btnStyles}
            className={`${BASE_CLASS}
                 ${BASE_CLASS}--style-${btnStyle}
                 ${BASE_CLASS}--variant-${variant}
                 ${BASE_CLASS}--size-${size}
                 ${textVariant ? `${BASE_CLASS}--variant-text-${textVariant}` : ''}
                 ${className ?? ''}`}
            {...props}
        >
            {children}
        </button>
    );
};
