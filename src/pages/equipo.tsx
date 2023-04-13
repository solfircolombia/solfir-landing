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
                    <div>Equipo de trabajo</div>
                </div>
                <div className={`${BASE_CLASS}-wrapper`}>
                    {TeamMembers.map((member) => {
                        let avatar = getImage(member.avatar);
                        return (
                            <div className={`${BASE_CLASS}-card`}>
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
        allContentfulTeamMember {
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
