import * as React from 'react';

import './serviceCard.scss';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';

type ServiceCardProps = {
    title: string;
    text: string;
    image?: IGatsbyImageData;
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ title, text, image }) => {
    const BASE_CLASS = 'service-card';

    return (
        <div className={BASE_CLASS}>
            {image && (
                <div className={`${BASE_CLASS}-image`}>
                    <GatsbyImage
                        image={image}
                        alt={title}
                        className={`${BASE_CLASS}-image-gatsby`}
                    />
                </div>
            )}
            <div className={`${BASE_CLASS}-content`}>
                <h3 className={`title`}>{title}</h3>
                <p className={`text`}>{text}</p>
            </div>
        </div>
    );
};
