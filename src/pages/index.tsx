import * as React from "react"
import { graphql, HeadFC, PageProps } from "gatsby"
import { Button, Icon, Layout, Logo, BlogCard } from "@components";
import { IconName } from "@types";
import "./index.scss";


const LandingPage = ({ data }: PageProps<Queries.LandingPageQuery>) => {

  console.log("DATA ", data);

  const BLOG_POSTS = data.allContentfulBlogPost.nodes;

  const BASE_CLASS = "landing";

  const goToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }


  const services: { serviceIcon: IconName, serviceName: string, serviceText: string }[] = [
    {
      serviceIcon: "arrow-right",
      serviceName: "Reestructuración de deuda",
      serviceText: "La reestructuración de deuda es un servicio que puede ayudar a las empresas a reducir su carga financiera y mejorar su flujo de efectivo. En SOLFIR, trabajamos con los clientes para revisar su deuda existente, identificar oportunidades para consolidar o reorganizar la deuda y negociar nuevos términos de pago con los acreedores."
    },
    {
      serviceIcon: "arrow-right",
      serviceName: "Asesoría financiera",
      serviceText: "Nuestros expertos financieros pueden proporcionar asesoría financiera a las empresas en una amplia gama de temas, incluyendo la planificación financiera estratégica, la gestión de efectivo y la optimización de los presupuestos. Al trabajar con nosotros, las empresas pueden obtener una visión objetiva y experta de sus finanzas y tomar decisiones informadas y rentables."
    },
    {
      serviceIcon: "arrow-right",
      serviceName: "Evaluación de la viabilidad empresarial",
      serviceText: "Para ayudar a las empresas a evaluar su situación financiera actual y las oportunidades de crecimiento futuro, ofrecemos una evaluación de la viabilidad empresarial. Nuestro equipo de expertos evalúa todos los aspectos de la empresa, incluyendo su posición en el mercado, su estructura de costos, su flujo de efectivo y su capacidad para competir en el mercado."
    },
    {
      serviceIcon: "arrow-right",
      serviceName: "Análisis de rentabilidad",
      serviceText: "El análisis de rentabilidad es una herramienta crítica para que las empresas midan el rendimiento de sus operaciones y productos. En SOLFIR, podemos ayudar a las empresas a realizar un análisis de rentabilidad detallado, identificar las áreas donde se pueden mejorar los márgenes de beneficio y desarrollar planes para maximizar la rentabilidad a largo plazo."
    },
    {
      serviceIcon: "arrow-right",
      serviceName: "Planeación de crisis",
      serviceText: "La planeación de crisis es un servicio importante que puede ayudar a las empresas a prepararse para situaciones imprevistas, como una recesión económica o un desastre natural. En SOLFIR, trabajamos con las empresas para desarrollar planes de contingencia, identificar áreas críticas de riesgo y desarrollar estrategias para minimizar los impactos de las crisis."
    },
  ]

  return (
    <Layout>
      <div className={BASE_CLASS}>
        <section className={`${BASE_CLASS}-banner`} id={`${BASE_CLASS}-banner`}>
          <div className={`${BASE_CLASS}-wrapper`}>
            <h1 className={`${BASE_CLASS}-banner-title`}>
              Vuelve a la estabilidad financiera con <span className="logo-placeholder"> <Logo /></span> expertos en insolvencia y reorganización empresarial
            </h1>
            <div className={`${BASE_CLASS}-banner-buttons`}>
              {/* <Button text="Contactanos" variant="primary" size="medium" onClickBtn={() => { goToSection("contactanos") }} /> */}
              <span className="separator"></span>
              <Button variant="secondary" size="medium" onClick={() => { goToSection(`${BASE_CLASS}-banner`) }} >
                Quiero saber mas
              </Button>
              <span className="separator"></span>
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
                    <div className="service-box-icon">
                      <Icon name={serviceIcon} variant="dark" className="service-box-icon-icon" />
                    </div>
                    <div className="service-box-content">
                      <span className="service-box-content-title">
                        <h4>{serviceName}</h4>
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
            <h2 className={`${BASE_CLASS}-blog-title`}>Nuestro Blog</h2>
            <div className={`${BASE_CLASS}-blog-posts`}>
              {BLOG_POSTS.map((post) => {
                return <BlogCard key={post.id} data={post}></BlogCard>
              })}
            </div>
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
            <Button variant="light" >Contratanos!</Button>
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

export const Head: HeadFC = () => <title>Home Page</title>
