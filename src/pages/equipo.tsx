import React from 'react';
import { HeadFC, Link, PageProps, graphql } from 'gatsby';
import { Button, Icon, Layout, SEO } from '@components';
import { STATIC_SITE_LINKS } from '@constants';
import { Utils } from '@shared';
import './equipo.scss';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const Equipo: React.FC<PageProps<Queries.TeamPageQuery>> = ({ data }) => {
    const BASE_CLASS = 'equipo';
    const TeamMembers = data.allContentfulTeamMember.nodes;

    const getAvatar = (avatar: any) => {
        if (avatar) {
            return getImage(avatar);
        } else {
            return null;
        }
    };

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <div className={`${BASE_CLASS}-wrapper`}>
                    <h1>Equipo de trabajo</h1>
                </div>
                <div className={`${BASE_CLASS}-wrapper`}>
                    <p>
                        Conoce a nuestro equipo de trabajo. En SOLFIR, nos enorgullece contar con un
                        grupo de profesionales altamente capacitados y comprometidos en brindar
                        servicios legales excepcionales a nuestros clientes. Nuestro equipo está
                        formado por abogados con una amplia experiencia en diversas áreas del
                        derecho, quienes trabajan de manera colaborativa y enfocada en los mejores
                        intereses de quienes confían en nosotros.
                    </p>

                    <p>
                        Cada miembro de nuestro equipo posee un profundo conocimiento de su
                        especialización legal, lo que nos permite ofrecer un asesoramiento integral
                        y estratégico en cada caso que atendemos. Además, nos mantenemos
                        actualizados con los cambios y desarrollos en la legislación para
                        asegurarnos de proporcionar soluciones jurídicas efectivas y adaptadas a las
                        necesidades particulares de nuestros clientes.
                    </p>

                    <p>
                        No solo nos distingue nuestra experiencia y conocimiento jurídico, sino
                        también nuestra dedicación a la excelencia en el servicio al cliente.
                        Valoramos la confianza que nuestros clientes depositan en nosotros y nos
                        esforzamos por establecer relaciones sólidas y duraderas basadas en la
                        transparencia, la comunicación abierta y el respeto mutuo.
                    </p>

                    <p>
                        Estamos comprometidos con la defensa de los derechos y los intereses de
                        nuestros clientes, y nuestro equipo está aquí para ofrecerte un respaldo
                        legal sólido y un apoyo integral en tus asuntos legales.
                    </p>

                    <p>
                        Gracias por visitar nuestra página y conocer a nuestro equipo de trabajo.
                        Esperamos tener la oportunidad de servirte y ayudarte en tus necesidades
                        legales. No dudes en contactarnos para obtener más información o programar
                        una consulta. Estaremos encantados de ayudarte.
                    </p>
                </div>
                <div className={`${BASE_CLASS}-wrapper`}>
                    {TeamMembers.map((member) => {
                        let avatar = getImage(member.avatar);
                        return (
                            <div key={member.id} className={`${BASE_CLASS}-card`}>
                                <div className={`${BASE_CLASS}-card-image`}>
                                    {avatar && (
                                        <GatsbyImage
                                            objectFit="cover"
                                            image={avatar}
                                            alt="alt"
                                        ></GatsbyImage>
                                    )}
                                </div>
                                <div className={`${BASE_CLASS}-card-data`}>
                                    <span className={`${BASE_CLASS}-card-data-name`}>
                                        {member.name}
                                    </span>
                                    <span className={`${BASE_CLASS}-card-data-role`}>
                                        {member.role}
                                    </span>
                                    <Link
                                        to={`${STATIC_SITE_LINKS.TEAM}/${member.slug}`}
                                        className={`${BASE_CLASS}-card-data-link`}
                                    >
                                        Ver Perfil
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
};

export const query = graphql`
    query TeamPage {
        allContentfulTeamMember(sort: { position: ASC }) {
            nodes {
                id
                slug
                name
                role
                avatar {
                    id
                    gatsbyImageData(
                        placeholder: BLURRED
                        formats: [AUTO, WEBP, AVIF]
                        layout: CONSTRAINED
                        resizingBehavior: FILL
                    )
                }
            }
        }
    }
`;

export default Equipo;

export const Head: HeadFC = () => <SEO {...Utils.getSEOProps(STATIC_SITE_LINKS.TEAM)} />;
