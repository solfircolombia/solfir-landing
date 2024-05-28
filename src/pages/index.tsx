import * as React from 'react';
import { graphql, HeadFC, navigate, PageProps } from 'gatsby';
import { Button, Icon, Layout, Logo, BlogCard, SEO, PageSection, ServiceCard } from '@components';
import { IconName } from '@types';
import { Utils } from '@shared';
import { STATIC_SITE_LINKS, STATIC_SITE_LABELS } from '@constants';
import './index.scss';
import { getImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { Service } from '@types';

const LandingPage = ({ data }: PageProps<Queries.LandingPageQuery>) => {
    const BLOG_POSTS = data.allContentfulBlogPost.nodes;
    const SERVICES: Service[] = data.allContentfulService.edges.map(({ node }): Service => {
        return {
            icon: node?.icon as IconName,
            title: node.title as string,
            description: node.description?.description as string,
            image: node.image ? getImage(node.image) : undefined,
        };
    });

    const IMAGES: Array<IGatsbyImageData | undefined> = data.allContentfulMedia.edges.map(
        ({ node }) => {
            return node.mediaFile ? getImage(node.mediaFile) : undefined;
        }
    );

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
                <PageSection classes={`${BASE_CLASS}-banner`} id={`${BASE_CLASS}-banner`}>
                    <span className={`${BASE_CLASS}-banner-title`}>
                        Vuelve a la estabilidad financiera con{' '}
                        <b className={`${BASE_CLASS}-banner-title-solfir`}>SOLFIR</b> expertos en
                        insolvencia y reorganización empresarial
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
                </PageSection>
                <PageSection classes={`${BASE_CLASS}-services`} id={`${BASE_CLASS}-services`}>
                    <h2 className={`${BASE_CLASS}-services-title`}>Nuestros Servicios</h2>
                    <div className={`${BASE_CLASS}-services-items`}>
                        {SERVICES.map((service, idx) => (
                            <ServiceCard
                                key={idx}
                                service={service}
                                classes={`${BASE_CLASS}-services-items-card`}
                                imagePosition="end"
                                direction="vertical"
                            ></ServiceCard>
                        ))}
                    </div>
                    <Button
                        className={`${BASE_CLASS}-services-cta`}
                        variant="secondary"
                        onClick={() => {
                            navigate(STATIC_SITE_LINKS.SERVICES);
                        }}
                    >
                        {' '}
                        Conoce todos nuestros servicios{' '}
                    </Button>
                </PageSection>
                <PageSection classes={`${BASE_CLASS}-blog`} id={`${BASE_CLASS}-blog`}>
                    <span className={`${BASE_CLASS}-blog-title`}>Nuestro Blog</span>
                    <p className={`${BASE_CLASS}-blog-text`}>
                        Visita el blog de SOLFIR, donde encontrarás información útil y consejos
                        financieros para ayudarte a manejar mejor tus finanzas personales o
                        empresariales. Además, te mantendremos informado sobre temas de actualidad
                        relacionados con la insolvencia y otras cuestiones legales y financieras
                        relevantes.
                    </p>
                    <div className={`${BASE_CLASS}-blog-posts`}>
                        {BLOG_POSTS.map((post) => {
                            return <BlogCard key={post.id} data={post}></BlogCard>;
                        })}
                    </div>
                    <Button
                        className={`${BASE_CLASS}-blog-cta`}
                        variant="secondary"
                        onClick={() => {
                            goToLink(STATIC_SITE_LINKS.BLOG);
                        }}
                    >
                        {' '}
                        Ver todas las publicaciones{' '}
                    </Button>
                </PageSection>
                <PageSection classes={`${BASE_CLASS}-hireus`} id={`${BASE_CLASS}-hireus`}>
                    <h2 className={`${BASE_CLASS}-hireus-title`}>¡Contrátanos!</h2>
                    <p className={`${BASE_CLASS}-hireus-text`}>
                        Con un equipo de expertos dedicados y años de experiencia, nos aseguramos de
                        brindar soluciones óptimas para cada situación única. Contáctanos hoy para
                        ver cómo podemos ayudarte a lograr la estabilidad financiera.
                    </p>
                    <Button
                        variant="secondary"
                        className={`${BASE_CLASS}-hireus-cta`}
                        onClick={() => {
                            goToLink(STATIC_SITE_LINKS.CONTACT);
                        }}
                    >
                        {STATIC_SITE_LABELS.CONTACT}
                    </Button>
                </PageSection>
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
        allContentfulService(limit: 10) {
            edges {
                node {
                    icon
                    title
                    description {
                        description
                    }
                    image {
                        gatsbyImageData
                    }
                }
            }
        }
        allContentfulMedia {
            edges {
                node {
                    id
                    mediaFile {
                        gatsbyImageData
                    }
                    description
                }
            }
        }
    }
`;

export const Head: HeadFC = () => <SEO {...Utils.getSEOProps(STATIC_SITE_LINKS.HOME)} />;
