
enum STATIC_SITE_LINKS {
    BLOG = "/blog",
    ABOUT = "/quienes-somos",
    TEAM = "/equipo",
    CONTACT = "/contacto",
    SERVICES = "/servicios",
    FAQ = "/preguntas-frecuentes",
    BENEFITS = "/beneficios",
    PRICING = "/precios"

}

const SITE_LINKS: { label: string, link: string }[] = [
    {
        label: "¿Quiénes Somos?",
        link: STATIC_SITE_LINKS.ABOUT
    },
    {
        label: "Equipo de trabajo",
        link: STATIC_SITE_LINKS.TEAM,
    },
    {
        label: "Contáctanos",
        link: STATIC_SITE_LINKS.CONTACT,
    },
    {
        label: "Blog",
        link: STATIC_SITE_LINKS.BLOG,
    },
    {
        label: "Servicios",
        link: STATIC_SITE_LINKS.SERVICES,
    },
    {
        label: "Preguntas frecuentes",
        link: STATIC_SITE_LINKS.FAQ,
    },
    {
        label: "Beneficios",
        link: STATIC_SITE_LINKS.BENEFITS,
    },
    {
        label: "Precios",
        link: STATIC_SITE_LINKS.PRICING,
    },
]

export {
    SITE_LINKS,
    STATIC_SITE_LINKS
}