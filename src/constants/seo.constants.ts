import { SEOProps } from '@types';
import { STATIC_SITE_LABELS, STATIC_SITE_LINKS } from './links.constants';

const SEO_DATA: { [k in STATIC_SITE_LINKS]: SEOProps } = {
    [STATIC_SITE_LINKS.HOME]: {
        title: STATIC_SITE_LABELS.HOME,
        description: undefined,
        pathname: STATIC_SITE_LINKS.HOME,
    },
    [STATIC_SITE_LINKS.BLOG]: {
        title: STATIC_SITE_LABELS.BLOG,
        description: undefined,
        pathname: STATIC_SITE_LINKS.BLOG,
    },
    [STATIC_SITE_LINKS.ABOUT]: {
        title: STATIC_SITE_LABELS.ABOUT,
        description: undefined,
        pathname: STATIC_SITE_LINKS.ABOUT,
    },
    [STATIC_SITE_LINKS.TEAM]: {
        title: STATIC_SITE_LABELS.TEAM,
        description: undefined,
        pathname: STATIC_SITE_LINKS.TEAM,
    },
    [STATIC_SITE_LINKS.CONTACT]: {
        title: STATIC_SITE_LABELS.CONTACT,
        description: undefined,
        pathname: STATIC_SITE_LINKS.CONTACT,
    },
    [STATIC_SITE_LINKS.SERVICES]: {
        title: STATIC_SITE_LABELS.SERVICES,
        description: undefined,
        pathname: STATIC_SITE_LINKS.SERVICES,
    },
    [STATIC_SITE_LINKS.FAQ]: {
        title: STATIC_SITE_LABELS.FAQ,
        description: undefined,
        pathname: STATIC_SITE_LINKS.FAQ,
    },
    [STATIC_SITE_LINKS.BENEFITS]: {
        title: STATIC_SITE_LABELS.BENEFITS,
        description: undefined,
        pathname: STATIC_SITE_LINKS.BENEFITS,
    },
    [STATIC_SITE_LINKS.PRICING]: {
        title: STATIC_SITE_LABELS.PRICING,
        description: undefined,
        pathname: STATIC_SITE_LINKS.PRICING,
    },
    [STATIC_SITE_LINKS.THANKS]: {
        title: STATIC_SITE_LABELS.THANKS,
        description: undefined,
        pathname: STATIC_SITE_LINKS.THANKS,
    },
    [STATIC_SITE_LINKS.ERROR]: {
        title: STATIC_SITE_LABELS.ERROR,
        description: undefined,
        pathname: STATIC_SITE_LINKS.ERROR,
    },
    [STATIC_SITE_LINKS.NOT_FOUND]: {
        title: STATIC_SITE_LABELS.NOT_FOUND,
        description: undefined,
        pathname: STATIC_SITE_LINKS.NOT_FOUND,
    },
};

export { SEO_DATA };
