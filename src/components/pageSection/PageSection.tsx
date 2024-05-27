import React, { PropsWithChildren } from 'react';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import './pageSection.scss';

type PageSectionProps = {
    id: string;
    classes?: string;
    image?: IGatsbyImageData | null | undefined;
};

export const PageSection: React.FC<PropsWithChildren<PageSectionProps>> = ({
    id,
    children,
    classes = '',
    image,
}) => {
    const BASE_CLASS = 'page-section';

    return (
        <section className={`${BASE_CLASS} ${classes}`} id={id}>
            <div className={`${BASE_CLASS}__image`}>
                {image && (
                    <GatsbyImage
                        className={`${BASE_CLASS}__image-gatsby`}
                        objectFit="cover"
                        image={image}
                        alt="alt"
                    ></GatsbyImage>
                )}
            </div>
            <div className={`${BASE_CLASS}__wrapper`}>{children}</div>
        </section>
    );
};
