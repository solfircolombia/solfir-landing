import * as React from 'react';
import { graphql, HeadFC, navigate, PageProps } from 'gatsby';
import { Button, Icon, Layout, Logo, BlogCard, SEO } from '@components';
import { IconName } from '@types';
import { Utils } from '@shared';
import { STATIC_SITE_LINKS, STATIC_SITE_LABELS } from '@constants';
import './index.scss';

const LandingPage = ({ data }: PageProps<Queries.LandingPageQuery>) => {
    const BLOG_POSTS = data.allContentfulBlogPost.nodes;
    const SERVICES: { serviceIcon: IconName; serviceName: string; serviceText: string }[] =
        data.allContentfulService.edges.map(({ node }) => ({
            serviceIcon: (node.icon as IconName) || '',
            serviceName: node.title || '',
            serviceText: node.description?.description || '',
        }));

    const BASE_CLASS = 'landing';

    const goToSection = (section: string) => {
        const element = document.getElementById(section);
        if (element) {
            // 👇 Will scroll smoothly to the top of the next section
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const goToLink = (link: STATIC_SITE_LINKS) => {
        navigate(link);
    };

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <section className={`${BASE_CLASS}-banner`} id={`${BASE_CLASS}-banner`}>
                    <div className={`${BASE_CLASS}-wrapper`}>
                        <span className={`${BASE_CLASS}-banner-title`}>
                            Vuelve a la estabilidad financiera con{' '}
                            <b className={`${BASE_CLASS}-banner-title-solfir`}>SOLFIR</b> expertos
                            en insolvencia y reorganización empresarial
                        </span>
                        <div className={`${BASE_CLASS}-banner-buttons`}>
                            <Button
                                variant="secondary"
                                size="medium"
                                onClick={() => {
                                    goToSection(`${BASE_CLASS}-services`);
                                }}
                            >
                                Quiero saber mas
                            </Button>
                        </div>
                    </div>
                </section>
                <section className={`${BASE_CLASS}-services`} id={`${BASE_CLASS}-services`}>
                    <div className={`${BASE_CLASS}-wrapper`}>
                        <h2 className={`${BASE_CLASS}-services-title`}>Nuestros Servicios</h2>
                        <div className={`${BASE_CLASS}-services-items`}>
                            {SERVICES.map(({ serviceIcon, serviceName, serviceText }, idx) => {
                                return (
                                    <div key={idx} className="service-box">
                                        <div className="service-box-content">
                                            <span className="service-box-content-title">
                                                <Icon
                                                    name={serviceIcon}
                                                    variant="dark"
                                                    className="service-box-content-title-icon"
                                                />
                                                {serviceName}
                                            </span>
                                            <div className="service-box-content-text">
                                                {serviceText}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
                <section className={`${BASE_CLASS}-blog`}>
                    <div className={`${BASE_CLASS}-wrapper`}>
                        <span className={`${BASE_CLASS}-blog-title`}>Nuestro Blog</span>
                        <p className={`${BASE_CLASS}-blog-text`}>
                            Visita el blog de SOLFIR, donde encontrarás información útil y consejos
                            financieros para ayudarte a manejar mejor tus finanzas personales o
                            empresariales. Además, te mantendremos informado sobre temas de
                            actualidad relacionados con la insolvencia y otras cuestiones legales y
                            financieras relevantes.
                        </p>
                        <div className={`${BASE_CLASS}-blog-posts`}>
                            {BLOG_POSTS.map((post) => {
                                return <BlogCard key={post.id} data={post}></BlogCard>;
                            })}
                        </div>
                        <Button
                            className={`${BASE_CLASS}-blog-cta`}
                            variant="primary"
                            onClick={() => {
                                goToLink(STATIC_SITE_LINKS.BLOG);
                            }}
                        >
                            {' '}
                            Ver todas las publicaciones{' '}
                        </Button>
                    </div>
                </section>
                <section className={`${BASE_CLASS}-hireus`}>
                    <div className={`${BASE_CLASS}-wrapper`}>
                        <h2 className={`${BASE_CLASS}-hireus-title`}>¡Contrátanos!</h2>
                        <p className={`${BASE_CLASS}-hireus-text`}>
                            Con un equipo de expertos dedicados y años de experiencia, nos
                            aseguramos de brindar soluciones óptimas para cada situación única.
                            Contáctanos hoy para ver cómo podemos ayudarte a lograr la estabilidad
                            financiera.
                        </p>
                        <Button
                            variant="primary"
                            className={`${BASE_CLASS}-hireus-cta`}
                            onClick={() => {
                                goToLink(STATIC_SITE_LINKS.CONTACT);
                            }}
                        >
                            {STATIC_SITE_LABELS.CONTACT}
                        </Button>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default LandingPage;

export const query = graphql`
    query LandingPage {
        allContentfulBlogPost(limit: 10) {
            nodes {
                id
                image {
                    gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                }
                slug
                summary
                title
                contentful_id
            }
            totalCount
        }
        allContentfulService(limit: 3) {
            edges {
                node {
                    icon
                    title
                    description {
                        description
                    }
                }
            }
        }
    }
`;

export const Head: HeadFC = () => <SEO {...Utils.getSEOProps(STATIC_SITE_LINKS.HOME)} />;
