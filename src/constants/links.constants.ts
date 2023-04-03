enum STATIC_SITE_LINKS {
    HOME = '/',
    BLOG = '/blog',
    ABOUT = '/quienes-somos',
    TEAM = '/equipo',
    CONTACT = '/contacto',
    SERVICES = '/servicios',
    FAQ = '/preguntas-frecuentes',
    BENEFITS = '/beneficios',
    PRICING = '/precios',
    THANKS = '/gracias',
    ERROR = '/error',
    NOT_FOUND = '/pagina-no-encontrada',
}

enum STATIC_SITE_LABELS {
    HOME = 'SOLFIR',
    BLOG = 'Blog',
    ABOUT = '¿Quiénes Somos?',
    TEAM = 'Equipo de trabajo',
    CONTACT = 'Contáctanos',
    SERVICES = 'Servicios',
    FAQ = 'Preguntas frecuentes',
    BENEFITS = 'Beneficios',
    PRICING = 'Precios',
    THANKS = '¡Gracias!',
    ERROR = 'Error',
    NOT_FOUND = 'Página no encontrada',
}

const SITE_LINKS: { label: string; link: string }[] = [
    {
        label: STATIC_SITE_LABELS.ABOUT,
        link: STATIC_SITE_LINKS.ABOUT,
    },
    {
        label: STATIC_SITE_LABELS.TEAM,
        link: STATIC_SITE_LINKS.TEAM,
    },
    {
        label: STATIC_SITE_LABELS.CONTACT,
        link: STATIC_SITE_LINKS.CONTACT,
    },
    {
        label: STATIC_SITE_LABELS.SERVICES,
        link: STATIC_SITE_LINKS.SERVICES,
    },
    {
        label: STATIC_SITE_LABELS.BLOG,
        link: STATIC_SITE_LINKS.BLOG,
    },
    // {
    //     label: STATIC_SITE_LABELS.FAQ,
    //     link: STATIC_SITE_LINKS.FAQ,
    // },
    // {
    //     label: STATIC_SITE_LABELS.BENEFITS,
    //     link: STATIC_SITE_LINKS.BENEFITS,
    // },
    // {
    //     label: STATIC_SITE_LABELS.PRICING,
    //     link: STATIC_SITE_LINKS.PRICING,
    // },
];

export { SITE_LINKS, STATIC_SITE_LINKS, STATIC_SITE_LABELS };
