import React from 'react';

import './card.scss';

type CardProps = {
    customClasses?: string;
};

export const Card: React.FC<React.PropsWithChildren<CardProps>> = ({ children, customClasses }) => {
    const BASE_CLASS = 'card';

    return <div className={`${BASE_CLASS} ${customClasses ?? ''}`}>{children}</div>;
};
