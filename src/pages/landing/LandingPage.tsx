import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { Button, Icon, Layout, Logo } from "@components";
import { IconName } from "@types";
import "./landing.scss";

const LandingPage: React.FC<PageProps> = (props) => {

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
      <div className="landing">
        <section className="banner" id="banner">
          <div className="wrapper">
            <h1 className="banner-title">
              Vuelve a la estabilidad financiera con <span className="logo-placeholder"> <Logo /></span> expertos en insolvencia y reorganización empresarial
            </h1>
            <div className="banner-buttons">
              {/* <Button text="Contactanos" variant="primary" size="medium" onClickBtn={() => { goToSection("contactanos") }} /> */}
              <span className="separator"></span>
              <Button variant="secondary" size="medium" onClickBtn={() => { goToSection("services") }} >
                Quiero saber mas
              </Button>
              <span className="separator"></span>
            </div>
          </div>
        </section>
        <section className="services" id="services">
          <div className="wrapper">
            <h2 className="services-title">
              Nuestros Servicios
            </h2>
            <div className="services-items">
              {services.map(({serviceIcon, serviceName, serviceText }) => {
                return (
                  <div className="service-box">
                    <div className="service-box-icon">
                      <Icon name={serviceIcon} color="black" className="service-box-icon-icon" />
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
        <section className="hireus">
          <div className="wrapper">
            <h2 className="hireus-title">
              ¡Contratanos!
            </h2>
            <p className="hireus-text">
              Con un equipo de expertos dedicados y años de experiencia, nos aseguramos de brindar soluciones óptimas para cada situación única. Contáctanos hoy para ver cómo podemos ayudarte a lograr la estabilidad financiera.
            </p>
            <Button variant="light" >Contratanos!</Button>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default LandingPage

export const Head: HeadFC = () => <title>Home Page</title>
