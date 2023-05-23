import * as React from 'react';
import './logo.scss';
import { Link, navigate } from 'gatsby';
import { LogoFullHorizontal } from './LogoFullHorizontal';
import { Variant } from '@types';

type LogoProps = {
    variant?: 'regular' | Variant;
    size?: number;
    className?: string;
};

export const Logo: React.FC<LogoProps> = ({ variant = 'regular', className }) => {
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
            <LogoFullHorizontal variant={variant}></LogoFullHorizontal>
        </div>
    );
};
