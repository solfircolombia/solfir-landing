import React from 'react';

import { SEOProps } from '@types';
import { SEO_DATA, STATIC_SITE_LINKS } from '@constants';
import { navigate } from 'gatsby';

export function getTitle(page: string) {
    const siteName: string = 'SOLFIR';
    return React.createElement('title', null, `${siteName} - ${page}`);
}

export function getSEOProps(page: STATIC_SITE_LINKS): SEOProps {
    return SEO_DATA[page];
}

export const handleScroll = (
    callback: (isGreaterThanThreshold: boolean) => void,
    threshold: number = 20
) => {
    return () => {
        const scrollPosition =
            window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        const scrollThreshold = threshold;
        callback(scrollPosition > scrollThreshold);
    };
};

export const goToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
        // 👇 Will scroll smoothly to the top of the next section
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

export const goToLink = (link: STATIC_SITE_LINKS) => {
    navigate(link);
};
