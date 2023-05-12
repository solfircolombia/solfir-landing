import * as React from 'react';
import { graphql } from 'gatsby';
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { Button, Icon, Layout } from '@components';
import './teamMemberPage.scss';

const TeamMemberPage: React.FC<{ data: Queries.TeamMemberPageQuery }> = ({ data }) => {
    const BASE_CLASS = 'team-member-page';

    let { contentfulTeamMember } = data;

    let avatar = getImage(contentfulTeamMember?.avatar!);

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <div className={`${BASE_CLASS}-wrapper`}>
                    <div className={`${BASE_CLASS}-main`}>
                        <div className={`${BASE_CLASS}-main-primary`}>
                            <div className={`${BASE_CLASS}-main-primary-avatar`}>
                                {contentfulTeamMember?.avatar && (
                                    <GatsbyImage
                                        image={avatar!}
                                        objectFit="cover"
                                        alt="alt"
                                    ></GatsbyImage>
                                )}
                            </div>
                            <span className={`${BASE_CLASS}-main-primary-name`}>
                                {contentfulTeamMember?.name}
                            </span>
                            <span className={`${BASE_CLASS}-main-primary-role`}>
                                {contentfulTeamMember?.role}
                            </span>
                        </div>
                        <div className={`${BASE_CLASS}-main-secondary`}>
                            <span className={`${BASE_CLASS}-main-secondary-contact`}>Contacto</span>

                            <div className={`${BASE_CLASS}-main-secondary-items`}>
                                {contentfulTeamMember?.cv?.profiles?.map((profileItem) => {
                                    if (profileItem?.network === 'LinkedIn') {
                                        return (
                                            <a
                                                className={`${BASE_CLASS}-main-secondary-items-icon`}
                                                href={profileItem.url || 'linkedin.com'}
                                                target="_blank"
                                            >
                                                <Icon name="linkedin" variant="light"></Icon>
                                            </a>
                                        );
                                    }
                                    if (profileItem?.network === 'Email') {
                                        return (
                                            <a
                                                className={`${BASE_CLASS}-main-secondary-items-icon`}
                                                href={`mailto:${profileItem.url}`}
                                                target="_blank"
                                            >
                                                <Icon name="mail" variant="light"></Icon>
                                            </a>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    </div>

                    <div className={`${BASE_CLASS}-resume`}>
                        <div className={`${BASE_CLASS}-resume-description`}>
                            <div className={`${BASE_CLASS}-resume-description-title`}>
                                Perfil Profesional
                            </div>
                            {contentfulTeamMember?.description &&
                                renderRichText(contentfulTeamMember?.description as any)}
                        </div>

                        <div className={`${BASE_CLASS}-resume-experience`}>
                            <span className={`${BASE_CLASS}-resume-experience-title`}>
                                Experiencia
                            </span>
                            {contentfulTeamMember?.cv?.work?.map((workItem) => {
                                return (
                                    <div className={`${BASE_CLASS}-resume-section`}>
                                        <span className={`${BASE_CLASS}-resume-section-title`}>
                                            {workItem?.name}
                                        </span>
                                        <span className={`${BASE_CLASS}-resume-section-subtitle`}>
                                            {workItem?.position} ( {workItem?.startDate} -{' '}
                                            {workItem?.endDate} )
                                        </span>
                                        {workItem?.summary && (
                                            <div
                                                className={`${BASE_CLASS}-resume-section-description`}
                                            >
                                                {workItem?.summary}
                                            </div>
                                        )}

                                        <ul
                                            key={workItem?.name}
                                            className={`${BASE_CLASS}-resume-section-highlights`}
                                        >
                                            {workItem?.highlights?.map((highlight, idx) => {
                                                return <li key={idx}>{highlight}</li>;
                                            })}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                        <div className={`${BASE_CLASS}-resume-education`}>
                            <span className={`${BASE_CLASS}-resume-education-title`}>
                                Educación
                            </span>
                            {contentfulTeamMember?.cv?.education?.map((edItem) => {
                                return (
                                    <div className={`${BASE_CLASS}-resume-section`}>
                                        <span className={`${BASE_CLASS}-resume-section-title`}>
                                            {edItem?.area}
                                        </span>
                                        <span className={`${BASE_CLASS}-resume-section-subtitle`}>
                                            {edItem?.institution} ( {edItem?.startDate} -{' '}
                                            {edItem?.endDate} )
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export const query = graphql`
    query TeamMemberPage($id: String!) {
        contentfulTeamMember(id: { eq: $id }, description: {}) {
            id
            slug
            name
            role
            cv {
                education {
                    startDate
                    institution
                    endDate
                    area
                    studyType
                    url
                }
                profiles {
                    network
                    url
                }
                work {
                    endDate
                    highlights
                    name
                    position
                    startDate
                    summary
                    url
                }
            }
            avatar {
                id
                gatsbyImageData(
                    placeholder: BLURRED
                    formats: [AUTO, WEBP, AVIF]
                    layout: CONSTRAINED
                    resizingBehavior: FILL
                )
            }
            description {
                raw
                __typename
            }
        }
    }
`;

export default TeamMemberPage;
