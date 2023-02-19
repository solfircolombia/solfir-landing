import * as React from "react"
import { graphql, HeadFC, PageProps } from "gatsby"
import { renderRichText } from 'gatsby-source-contentful/rich-text'

import { Button, Icon, Layout, Logo } from "@components";
import { IconName } from "@types";
import "./index.scss";


const LandingPage = ({data}:PageProps<Queries.LandingPageQuery>) => {

  console.log("DATA ", data);
  

  const BASE_CLASS = "landing"

  const goToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }


  const services: { serviceIcon: IconName, serviceName: string, serviceText: string }[] = [
    {
      serviceIcon: "facebook",
      serviceName: "Service Name",
      serviceText: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt ipsa corporis, numquam aliquam vel saepe, facere provident praesentium velit, reiciendis alias laudantium deserunt incidunt veritatis dignissimos nihil neque ea atque!"
    },
    {
      serviceIcon: "instagram",
      serviceName: "Service Name",
      serviceText: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt ipsa corporis, numquam aliquam vel saepe, facere provident praesentium velit, reiciendis alias laudantium deserunt incidunt veritatis dignissimos nihil neque ea atque!"
    },
    {
      serviceIcon: "whatsapp",
      serviceName: "Service Name",
      serviceText: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt ipsa corporis, numquam aliquam vel saepe, facere provident praesentium velit, reiciendis alias laudantium deserunt incidunt veritatis dignissimos nihil neque ea atque!"
    },
    {
      serviceIcon: "linkedin",
      serviceName: "Service Name",
      serviceText: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt ipsa corporis, numquam aliquam vel saepe, facere provident praesentium velit, reiciendis alias laudantium deserunt incidunt veritatis dignissimos nihil neque ea atque!"
    },
    {
      serviceIcon: "arrow-right",
      serviceName: "Service Name",
      serviceText: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt ipsa corporis, numquam aliquam vel saepe, facere provident praesentium velit, reiciendis alias laudantium deserunt incidunt veritatis dignissimos nihil neque ea atque!"
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
              <Button variant="secondary" size="medium" onClick={() => { goToSection(`${BASE_CLASS}-banner`)}} >
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
              {services.map(({serviceIcon, serviceName, serviceText }, idx) => {
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
          <div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
            
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
    allContentfulBlogPost {
      nodes {
        id
        title
        content {
          raw
        }
      }
      totalCount
    }
  }
`;

export const Head: HeadFC = () => <title>Home Page</title>
