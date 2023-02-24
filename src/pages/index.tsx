import * as React from "react"
import { graphql, HeadFC, navigate, PageProps } from "gatsby"
import { Button, Icon, Layout, Logo, BlogCard } from "@components";
import { IconName } from "@types";
import "./index.scss";
import { SITE_LINKS, STATIC_SITE_LINKS, STATIC_SITE_LABELS } from "@constants";


const LandingPage = ({ data }: PageProps<Queries.LandingPageQuery>) => {

  const BLOG_POSTS = data.allContentfulBlogPost.nodes;

  const BASE_CLASS = "landing";

  const goToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const goToLink = (link: STATIC_SITE_LINKS) => {
    navigate(link);
  }


  const services: { serviceIcon: IconName, serviceName: string, serviceText: string }[] = [
    {
      serviceIcon: "arrow-right",
      serviceName: "Negociacion de deudas",
      serviceText: "En SOLFIR ofrecemos un servicio de negociación de deudas para ayudar a nuestros clientes a encontrar plazos más convenientes y tasas de interés más bajas. Nuestros expertos en finanzas negocian con los acreedores en nombre de nuestros clientes, encontrando soluciones personalizadas para sus necesidades financieras. Si está luchando por pagar sus deudas y quiere encontrar una solución efectiva, en SOLFIR estamos listos para ayudarlo. Contáctenos hoy para comenzar a resolver sus problemas financieros de manera efectiva y duradera."
    },
    {
      serviceIcon: "arrow-right",
      serviceName: "Evitar remates y perdida de su patrimonio",
      serviceText: "En SOLFIR entendemos que su patrimonio es valioso, y por eso ofrecemos un servicio especializado en evitar remates judiciales y la pérdida de su propiedad. Nuestros expertos legales trabajan en conjunto con nuestros asesores financieros para encontrar soluciones personalizadas a sus necesidades, permitiéndole mantener su propiedad y evitar una crisis financiera. Si está en riesgo de perder su patrimonio, contáctenos hoy para obtener asesoramiento legal y financiero efectivo y personalizado. En SOLFIR estamos dedicados a ayudar a nuestros clientes a proteger su patrimonio y a enfrentar los desafíos financieros con tranquilidad y confianza."
    },
    {
      serviceIcon: "arrow-right",
      serviceName: "Acuerdos privados y liquidaciones patrimoniales",
      serviceText: "En SOLFIR ofrecemos servicios de acuerdos privados y liquidaciones patrimoniales para ayudar a nuestros clientes a resolver conflictos financieros de manera efectiva y duradera. Nuestros expertos trabajan para encontrar soluciones personalizadas que se adapten a las necesidades únicas de cada cliente, negociando acuerdos privados y liquidaciones patrimoniales que les permitan alcanzar la estabilidad financiera y proteger su patrimonio. Si está enfrentando problemas financieros y desea encontrar una solución efectiva, en SOLFIR estamos listos para ayudarlo. Contáctenos hoy para obtener asesoramiento financiero y legal personalizado y efectivo."
    },
    {
      serviceIcon: "arrow-right",
      serviceName: "Recuperar su estabilidad financiera y tranquilidad",
      serviceText: "En SOLFIR entendemos que la estabilidad financiera y la tranquilidad son fundamentales para una vida feliz y saludable. Es por eso que ofrecemos un servicio especializado en ayudar a nuestros clientes a recuperar su estabilidad financiera y tranquilidad. Nuestros expertos en finanzas trabajan en conjunto con nuestros abogados para encontrar soluciones personalizadas y efectivas para las necesidades financieras de cada cliente. Ya sea que esté luchando con deudas, enfrentando problemas legales o simplemente buscando encontrar una manera de mejorar su situación financiera, en SOLFIR estamos aquí para ayudarlo. Contáctenos hoy para obtener asesoramiento financiero y legal efectivo y personalizado y comience a recuperar su estabilidad financiera y tranquilidad."
    },
  ]

  return (
    <Layout>
      <div className={BASE_CLASS}>
        <section className={`${BASE_CLASS}-banner`} id={`${BASE_CLASS}-banner`}>
          <div className={`${BASE_CLASS}-wrapper`}>
            <span className={`${BASE_CLASS}-banner-title`}>
              Vuelve a la estabilidad financiera con <b className={`${BASE_CLASS}-banner-title-solfir`} >SOLFIR</b> expertos en insolvencia y reorganización empresarial
            </span>
            <div className={`${BASE_CLASS}-banner-buttons`}>
              <Button variant="secondary" size="medium" onClick={() => { goToSection(`${BASE_CLASS}-services`) }} >
                Quiero saber mas
              </Button>
            </div>
          </div>
        </section>
        <section className={`${BASE_CLASS}-services`} id={`${BASE_CLASS}-services`}>
          <div className={`${BASE_CLASS}-wrapper`}>
            <h2 className={`${BASE_CLASS}-services-title`}>
              Nuestros Servicios
            </h2>
            <div className={`${BASE_CLASS}-services-items`}>
              {services.map(({ serviceIcon, serviceName, serviceText }, idx) => {
                return (
                  <div key={idx} className="service-box">
                    <div className="service-box-content">
                      <span className="service-box-content-title">
                        <Icon name={serviceIcon} variant="dark" className="service-box-content-title-icon" />
                        {serviceName}
                      </span>
                      <div className="service-box-content-text">
                        {serviceText}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
        <section className={`${BASE_CLASS}-blog`}>
          <div className={`${BASE_CLASS}-wrapper`}>
            <span className={`${BASE_CLASS}-blog-title`}>Nuestro Blog</span>
            <p className={`${BASE_CLASS}-blog-text`}>
              Visita el blog de SOLFIR, donde encontrarás información útil y consejos financieros
              para ayudarte a manejar mejor tus finanzas personales o empresariales. Además,
              te mantendremos informado sobre temas de actualidad relacionados con la insolvencia
              y otras cuestiones legales y financieras relevantes.</p>
            <div className={`${BASE_CLASS}-blog-posts`}>
              {BLOG_POSTS.map((post) => {
                return <BlogCard key={post.id} data={post}></BlogCard>
              })}
            </div>
            <Button
              className={`${BASE_CLASS}-blog-cta`}
              variant="primary"
              onClick={() => { goToLink(STATIC_SITE_LINKS.BLOG) }}
            > Ver todas las publicaciones </Button>
          </div>
        </section>
        <section className={`${BASE_CLASS}-hireus`}>
          <div className={`${BASE_CLASS}-wrapper`}>
            <h2 className={`${BASE_CLASS}-hireus-title`}>
              ¡Contrátanos!
            </h2>
            <p className={`${BASE_CLASS}-hireus-text`}>
              Con un equipo de expertos dedicados y años de experiencia, nos aseguramos de brindar soluciones óptimas para cada situación única. Contáctanos hoy para ver cómo podemos ayudarte a lograr la estabilidad financiera.
            </p>
            <Button
              variant="light"
              className={`${BASE_CLASS}-hireus-cta`}
              onClick={() => { goToLink(STATIC_SITE_LINKS.CONTACT) }}>
                {STATIC_SITE_LABELS.CONTACT}
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default LandingPage;

export const query = graphql`
  query LandingPage {
    allContentfulBlogPost(limit:10) {
      nodes {
        id
        image {
          gatsbyImageData(
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
          )
        }
        slug
        summary
        title
        contentful_id
      }
      totalCount
    }
  }
`;

export const Head: HeadFC = () => <title>SOLFIR - {STATIC_SITE_LABELS.HOME}</title>
