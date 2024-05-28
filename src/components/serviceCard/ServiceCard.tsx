import * as React from 'react';

import './serviceCard.scss';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { Service } from '@types';
import { Button } from '../button/Button';

type ServiceCardProps = {
    service: Service;
    direction?: 'horizontal' | 'vertical';
    imagePosition?: 'start' | 'end';
    classes?: string;
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
    service,
    direction = 'horizontal',
    imagePosition = 'start',
    classes,
}) => {
    const BASE_CLASS = 'service-card';

    const directionClass = direction === 'vertical' ? `${BASE_CLASS}--vertical` : '';
    const imagePositionClass = imagePosition === 'end' ? `${BASE_CLASS}--image-end` : '';

    return (
        <div className={`${BASE_CLASS} ${directionClass} ${imagePositionClass} ${classes}`}>
            {service.image && (
                <div className={`${BASE_CLASS}-image`}>
                    <GatsbyImage
                        image={service.image}
                        alt={service.title || ''}
                        className={`${BASE_CLASS}-image-gatsby`}
                    />
                </div>
            )}
            <div className={`${BASE_CLASS}-content`}>
                <h3 className={`title`}>{service.title}</h3>
                <div className={`text`}>{service.description}</div>
                <div className="btn">
                    <Button variant="primary" size="small">
                        Ver más
                    </Button>
                </div>
            </div>
        </div>
    );
};
