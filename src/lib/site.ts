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
    phone: '3008178461',
    address: 'Calle 98 # 15-17 Oficina 301, Edificio Manhattan Center, Bogota DC',
    maps: 'https://www.google.com/maps/place/EDIFICIO%E2%80%A2MANHATTAN.CENTER,+Cl.+98+%2315-17,+Localidad+de+Chapinero,+Bogot%C3%A1/@4.6830466,-74.0515491,17z/data=!3m1!4b1!4m6!3m5!1s0x8e3f9a9437b4fabd:0xc537c7c5276ae064!8m2!3d4.6830413!4d-74.0489688!16s%2Fg%2F11f3tvjv8m?entry=ttu',
    whatsapp:
        'https://wa.me/+573008178461?text=Hola%21%0A%0AEstoy%20interesado%20en%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20servicios%20de%20insolvencia%20y%20reorganizaci%C3%B3n%20que%20ofrece%20%2ASOLFIR%2A.%0A%0A%C2%BFPodr%C3%ADa%20proporcionarme%20m%C3%A1s%20detalles%20o%20programar%20una%20consulta%20para%20discutir%20mis%20opciones%3F%20Gracias%20por%20su%20tiempo.%0A%0AMuchas%20gracias%21%21',
} as const;

export const SOCIAL_LINKS: { name: 'instagram' | 'linkedin' | 'twitter'; href: string }[] = [
    { name: 'instagram', href: 'https://instagram.com/solfircolombia' },
    { name: 'linkedin', href: 'https://www.linkedin.com/in/solfir-colombia-80663a267/' },
    { name: 'twitter', href: 'https://twitter.com/solfircolombia' },
];

export const CREDITS: { role: string; label: string; href: string }[] = [
    { role: 'Creado por', label: 'R2N', href: 'https://r2n.dev' },
    { role: ' - Diseño por', label: 'Leidy Zuñiga', href: 'https://www.behance.net/leidyZ' },
    { role: ' - Producciones audiovisuales por', label: 'Alexis Madroñero', href: '' },
    { role: ' - Stock photos de', label: 'Unsplash', href: 'https://unsplash.com/license' },
];

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

export function blogPath(slug: string): string {
    return `/blog/${slug}/`;
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
