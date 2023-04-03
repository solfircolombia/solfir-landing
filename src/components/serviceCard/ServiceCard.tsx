import * as React from 'react';

import './serviceCard.scss';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

type ServiceCardProps = {
    title: string;
    text: string;
    image: any;
};

export const ServiceCard: React.FC<ServiceCardProps> = () => {
    const BASE_CLASS = 'service-card';

    return <></>;
};
