import React from 'react';

import { SEOProps } from '@types';
import { SEO_DATA, STATIC_SITE_LINKS } from '@constants';

function getTitle(page: string) {
    const siteName: string = 'SOLFIR';
    return React.createElement('title', null, `${siteName} - ${page}`);
}

function getSEOProps(page: STATIC_SITE_LINKS): SEOProps {
    return SEO_DATA[page];
}

export { getTitle, getSEOProps };
