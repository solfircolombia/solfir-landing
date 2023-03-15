import React, { PropsWithChildren, ReactNode } from 'react';
import { useSiteMetadata } from '@hooks';
import { Utils } from '@shared';

type SEOProps = {
    title: string;
    description?: string;
    pathname?: string;
};

export const SEO: React.FC<PropsWithChildren<SEOProps>> = ({
    title,
    description,
    pathname,
    children,
}) => {
    const {
        title: defaultTitle,
        description: defaultDescription,
        image,
        siteUrl,
        twitterUsername,
    } = useSiteMetadata();

    const seo = {
        title: title || defaultTitle,
        description: description || defaultDescription,
        image: `${siteUrl}${image}`,
        url: `${siteUrl}${pathname || ``}`,
        twitterUsername,
    };

    return (
        <>
            {Utils.getTitle(seo.title)}
            <meta name="description" content={seo.description} />
            <meta name="image" content={seo.image} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seo.title} />
            <meta name="twitter:url" content={seo.url} />
            <meta name="twitter:description" content={seo.description} />
            <meta name="twitter:image" content={seo.image} />
            <meta name="twitter:creator" content={seo.twitterUsername} />
            {children}
        </>
    );
};
