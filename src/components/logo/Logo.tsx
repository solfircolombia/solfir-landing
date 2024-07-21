import * as React from 'react';
import './logo.scss';
import { Link, navigate } from 'gatsby';
import { LogoFullHorizontal } from './LogoFullHorizontal';
import { LogoVariant } from '@types';
import LogoHorizontal from './LogoHorizontal';

type LogoProps = {
    variant?: LogoVariant;
    size?: number;
    className?: string;
};

export const Logo: React.FC<LogoProps> = ({ variant = 'light', className }) => {
    const BASE_CLASS = 'logo';
    const clickHandler = () => {
        navigate('/');
    };

    return (
        <div
            className={`${BASE_CLASS} ${className ?? ''}`}
            onClick={() => {
                clickHandler();
            }}
        >
            <LogoHorizontal variant={variant}></LogoHorizontal>
            {/* <LogoFullHorizontal variant={variant}></LogoFullHorizontal> */}
        </div>
    );
};
