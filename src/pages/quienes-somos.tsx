import * as React from 'react';
import { graphql, type HeadFC, type PageProps } from 'gatsby';
import { Button, Card, Layout, PageSection, SEO } from '@components';
import { STATIC_SITE_LINKS } from '@constants';
import { getSEOProps, goToLink } from '@shared';
import './quienes-somos.scss';
import { IGatsbyImageData, getImage } from 'gatsby-plugin-image';

const AboutPage: React.FC<PageProps<Queries.LandingPageQuery>> = ({ data }) => {
    const BASE_CLASS = 'about';

    const BANNER_IMAGE: IGatsbyImageData | undefined = data.contentfulMedia?.mediaFile
        ? getImage(data.contentfulMedia.mediaFile)
        : undefined;

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <PageSection
                    image={BANNER_IMAGE}
                    classes={`${BASE_CLASS}-header`}
                    id={`${BASE_CLASS}-header`}
                >
                    <span className={`${BASE_CLASS}-header-title`}>Conoce más sobre nosotros</span>
                </PageSection>
                <PageSection
                    id={`${BASE_CLASS}-quienes-somos`}
                    classes={`${BASE_CLASS}-quienes-somos`}
                >
                    <Card customClasses={`box`}>
                        <div className={`box-inner`}>
                            <span className={`box-inner-title`}>¿Quiénes somos?</span>
                            <span className={`box-inner-text`}>
                                Solfir es una firma de abogados joven y dinámica, conformada por un
                                equipo de profesionales con experiencia en gerencia jurídica,
                                resolución de conflictos, cobro de cartera y estructuración de
                                negocios. Nos destacamos por ofrecer un servicio personalizado,
                                asesoramiento integral y una amplia gama de servicios en consultoría
                                y litigio.
                            </span>
                            <span className={`box-inner-text`}>
                                Nuestra red de aliados estratégicos nos permite llevar a cabo
                                proyectos versátiles en diversos sectores y atender a una amplia
                                variedad de clientes. Nos adaptamos a los cambios e innovaciones del
                                mundo moderno, comprometidos en brindar soluciones efectivas y
                                prácticas para los problemas cotidianos.
                            </span>
                        </div>
                    </Card>
                </PageSection>
                <PageSection
                    id={`${BASE_CLASS}-sobre-nosotros`}
                    classes={`${BASE_CLASS}-sobre-nosotros`}
                >
                    <Card customClasses={`box`}>
                        <div className={`box-inner`}>
                            <span className={`box-inner-title`}>Nuestra Historia</span>
                            <span className={`box-inner-text`}>
                                Solfir surgió en mayo de 2023 como resultado de una alianza entre
                                profesionales con una visión común. Lo que comenzó como una
                                colaboración inicial rápidamente se transformó en algo más grande y
                                significativo, dando origen a una firma que combina experiencia y
                                juventud, y que se adapta ágilmente a los desafíos del entorno legal
                                contemporáneo.
                            </span>
                            <span className={`box-inner-text`}>
                                Desde nuestros comienzos, hemos crecido y evolucionado,
                                convirtiéndonos en una firma versátil y moderna, ampliando nuestras
                                áreas de especialización para responder a las necesidades cambiantes
                                de nuestros clientes.
                            </span>
                        </div>
                    </Card>
                </PageSection>
                <PageSection
                    id={`${BASE_CLASS}-mision-vision`}
                    classes={`${BASE_CLASS}-mision-vision`}
                >
                    <Card customClasses={`box`}>
                        <div className={`box-inner`}>
                            <span className={`box-inner-title`}>Misión y Visión</span>
                            <span className={`box-inner-text`}>
                                Nuestra misión es proporcionar soluciones legales prácticas y
                                efectivas, adaptadas a las necesidades específicas de cada cliente.
                                Nos esforzamos por ser un referente en el ámbito legal, ofreciendo
                                un servicio de alta calidad y confianza.
                            </span>
                            <span className={`box-inner-text`}>
                                Nuestra visión es ser reconocidos como una firma de abogados
                                innovadora y de vanguardia, que se adapta a los retos del mundo
                                moderno, siempre comprometida con la excelencia y la satisfacción
                                del cliente.
                            </span>
                        </div>
                    </Card>
                </PageSection>
                <PageSection
                    id={`${BASE_CLASS}-nuestro-equipo`}
                    classes={`${BASE_CLASS}-nuestro-equipo`}
                >
                    <Card customClasses={`box`}>
                        <div className={`box-inner`}>
                            <span className={`box-inner-title`}>Nuestro Equipo</span>
                            <span className={`box-inner-text`}>
                                Contamos con un equipo diverso de profesionales altamente
                                capacitados y comprometidos con el éxito de nuestros clientes. Cada
                                miembro de nuestro equipo aporta su experiencia y conocimientos
                                específicos para ofrecer un servicio integral y de calidad.
                            </span>
                            <div className="box-inner-actions">
                                <Button
                                    variant="secondary"
                                    size={'small'}
                                    onClick={() => {
                                        goToLink(STATIC_SITE_LINKS.TEAM);
                                    }}
                                >
                                    Conócenos
                                </Button>
                            </div>
                        </div>
                    </Card>
                </PageSection>
                <PageSection id={`${BASE_CLASS}-contactanos`} classes={`${BASE_CLASS}-contactanos`}>
                    <Card customClasses={`box`}>
                        <div className={`box-inner`}>
                            <span className={`box-inner-title`}>¿Tiene Preguntas?</span>
                            <span className={`box-inner-text`}>
                                Estamos aquí para ayudarle. Si tiene alguna pregunta o necesita
                                asesoramiento legal, no dude en ponerse en contacto con nosotros. En
                                Solfir, estamos comprometidos en brindarle el mejor servicio posible
                                y en convertirnos en su aliado estratégico en el ámbito legal.
                                ¡Esperamos poder colaborar con usted pronto!
                            </span>
                            <div className="box-inner-actions">
                                <Button
                                    variant="secondary"
                                    size={'small'}
                                    onClick={() => {
                                        goToLink(STATIC_SITE_LINKS.CONTACT);
                                    }}
                                >
                                    Contáctanos
                                </Button>
                            </div>
                        </div>
                    </Card>
                </PageSection>
            </div>
        </Layout>
    );
};

export default AboutPage;

export const query = graphql`
    query AboutPage {
        contentfulMedia(description: { eq: "Foto Grupal Para Landing Page" }) {
            id
            mediaFile {
                gatsbyImageData
            }
            description
        }
    }
`;

export const Head: HeadFC = () => <SEO {...getSEOProps(STATIC_SITE_LINKS.ABOUT)} />;
