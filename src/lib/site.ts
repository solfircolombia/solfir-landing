export const SITE = {
    name: 'SOLFIR',
    title: 'SOLFIR COLOMBIA',
    description: 'Soluciones Financieras, Insolvencias y Reorganizaciones',
    url: 'https://solfir.com.co',
    twitter: '@SolfirColombia',
    image: '/images/seoimage.jpg',
} as const;

export const PATHS = {
    home: '/',
    blog: '/blog/',
    about: '/quienes-somos/',
    team: '/equipo/',
    contact: '/contacto/',
    services: '/servicios/',
    thanks: '/gracias/',
    error: '/error/',
} as const;

export const LABELS = {
    home: 'Inicio',
    blog: 'Blog',
    about: '¿Quiénes Somos?',
    team: 'Equipo de trabajo',
    contact: 'Contáctanos',
    services: 'Servicios',
    thanks: '¡Gracias!',
    error: 'Error',
    notFound: 'Página no encontrada',
    menu: 'Menú',
    closeMenu: 'Cerrar menú',
    modal: 'Ventana Modál',
} as const;

export interface NavLink {
    label: string;
    href: string;
}

export const NAV_LINKS: NavLink[] = [
    { label: LABELS.home, href: PATHS.home },
    { label: LABELS.about, href: PATHS.about },
    { label: LABELS.team, href: PATHS.team },
    { label: LABELS.contact, href: PATHS.contact },
    { label: LABELS.services, href: PATHS.services },
    { label: LABELS.blog, href: PATHS.blog },
];

export interface SeoInput {
    title: string;
    description?: string;
    pathname: string;
    image?: string;
    ogType?: 'website' | 'article';
    /** Internal pages. Emits noindex and should also be excluded from the sitemap. */
    noindex?: boolean;
}

export const PAGE_SEO: Record<string, SeoInput> = {
    home: { title: LABELS.home, pathname: PATHS.home },
    blog: { title: LABELS.blog, pathname: PATHS.blog },
    about: { title: LABELS.about, pathname: PATHS.about },
    team: { title: LABELS.team, pathname: PATHS.team },
    contact: { title: LABELS.contact, pathname: PATHS.contact },
    services: { title: LABELS.services, pathname: PATHS.services },
    thanks: { title: LABELS.thanks, pathname: PATHS.thanks },
    error: { title: LABELS.error, pathname: PATHS.error },
    notFound: { title: LABELS.notFound, pathname: '/404/' },
};

export const CONTACT = {
    mail: 'contacto@solfir.com.co',
    supportMail: 'andres.artunduaga@solfir.com.co',
    /** Shown to people. */
    phone: '+57 311 274 4436',
    /** E.164, used by tel: links, WhatsApp, and JSON-LD. */
    phoneE164: '+573112744436',
    address: 'Cl. 30a #6-22, Oficina 2502, Edificio San Martín Bloque B, Bogotá D.C.',
    streetAddress: 'Cl. 30a #6-22, Oficina 2502, Edificio San Martín Bloque B',
    addressLocality: 'Bogotá',
    addressRegion: 'Bogotá D.C.',
    addressCountry: 'CO',
    /** Edificio San Martín, Calle 30A #6-22. Resolved from the maps link via OpenStreetMap. */
    geo: {
        latitude: 4.6168793,
        longitude: -74.0677816,
    },
    maps: 'https://maps.app.goo.gl/JZssCQ9qRdVDyAMH7',
    whatsapp:
        'https://wa.me/573112744436?text=Hola%21%0A%0AEstoy%20interesado%20en%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20servicios%20de%20insolvencia%20y%20reorganizaci%C3%B3n%20que%20ofrece%20%2ASOLFIR%2A.%0A%0A%C2%BFPodr%C3%ADa%20proporcionarme%20m%C3%A1s%20detalles%20o%20programar%20una%20consulta%20para%20discutir%20mis%20opciones%3F%20Gracias%20por%20su%20tiempo.%0A%0AMuchas%20gracias%21%21',
} as const;

/** Organization node shared by page JSON-LD. */
export function organizationLd(siteUrl: string) {
    return {
        '@type': 'Organization',
        name: SITE.name,
        url: `${siteUrl}/`,
        email: CONTACT.mail,
        telephone: CONTACT.phoneE164,
        address: {
            '@type': 'PostalAddress',
            streetAddress: CONTACT.streetAddress,
            addressLocality: CONTACT.addressLocality,
            addressRegion: CONTACT.addressRegion,
            addressCountry: CONTACT.addressCountry,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: CONTACT.geo.latitude,
            longitude: CONTACT.geo.longitude,
        },
        hasMap: CONTACT.maps,
    };
}

/** Flip this when the company LinkedIn profile is public again. */
export const COMPANY_LINKEDIN_ENABLED = false;

export const COMPANY_LINKEDIN_URL = 'https://www.linkedin.com/in/solfir-colombia-80663a267/';

/** True when `url` is the company profile, ignoring www, case, and a trailing slash. */
export function isCompanyLinkedIn(url: string): boolean {
    let candidate: URL;
    let company: URL;
    try {
        candidate = new URL(url);
        company = new URL(COMPANY_LINKEDIN_URL);
    } catch {
        return false;
    }
    const host = (value: URL) => value.hostname.replace(/^www\./, '').toLowerCase();
    const path = (value: URL) =>
        decodeURIComponent(value.pathname).replace(/\/+$/, '').toLowerCase();
    return host(candidate) === host(company) && path(candidate) === path(company);
}

export const SOCIAL_LINKS: { name: 'instagram' | 'linkedin' | 'twitter'; href: string }[] = [
    { name: 'instagram', href: 'https://instagram.com/solfircolombia' },
    { name: 'linkedin', href: COMPANY_LINKEDIN_URL },
    { name: 'twitter', href: 'https://twitter.com/solfircolombia' },
];

export const CREDITS: { role: string; label: string; href: string }[] = [
    { role: 'Creado por', label: 'R2N', href: 'https://r2n.dev' },
    { role: 'Fotografías por', label: 'Unsplash', href: 'https://unsplash.com' },
];

/** Historical brand palettes. The settings panel no longer switches these. */
export const THEMES = {
    SOLFIR_1: {
        primary: 'hsla(212, 98%, 16%, 1)',
        primaryContrast: 'hsla(120, 100%, 100%, 1)',
        secondary: 'hsla(41, 96%, 53%, 1)',
        secondaryContrast: 'hsla(49, 57%, 5%, 1)',
        tertiary: 'hsla(340, 72%, 54%, 1)',
        tertiaryContrast: 'hsla(49, 57%, 5%, 1)',
        light: 'hsla(120, 100%, 100%, 1)',
        lightContrast: 'hsla(49, 57%, 5%, 1)',
        dark: 'hsla(49, 57%, 5%, 1)',
        darkContrast: 'hsla(120, 100%, 100%, 1)',
    },
    SOLFIR_2: {
        primary: 'hsla(49, 57%, 5%, 1)',
        primaryContrast: 'hsla(120, 100%, 100%, 1)',
        secondary: 'hsla(41, 96%, 53%, 1)',
        secondaryContrast: 'hsla(49, 57%, 5%, 1)',
        tertiary: 'hsla(320, 42%, 32%, 1)',
        tertiaryContrast: 'hsla(120, 100%, 100%, 1)',
        light: 'hsla(120, 100%, 100%, 1)',
        lightContrast: 'hsla(49, 57%, 5%, 1)',
        dark: 'hsla(49, 57%, 5%, 1)',
        darkContrast: 'hsla(120, 100%, 100%, 1)',
    },
} as const;

export function normalizePath(pathname: string): string {
    if (pathname.length > 1 && pathname.endsWith('/')) {
        return pathname.slice(0, -1);
    }
    return pathname || '/';
}

export function isCurrentPath(pathname: string, href: string): boolean {
    return normalizePath(pathname) === normalizePath(href);
}

export function slugify(value: string): string {
    return value
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function blogPath(slug: string): string {
    return `/blog/${slug}/`;
}

export function servicePath(slug: string): string {
    return `/servicios/${slug}/`;
}

export function teamPath(slug: string): string {
    return `/equipo/${slug}/`;
}

export function formatLongDate(isoDate: string): string {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
    const date = match
        ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
        : new Date(isoDate);
    return date.toLocaleDateString('es', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
