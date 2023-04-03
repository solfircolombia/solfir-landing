import * as React from 'react';
import { graphql } from 'gatsby';
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { Layout } from '@components';
import './teamMemberPage.scss';

const TeamMemberPage: React.FC<{ data: Queries.TeamMemberPageQuery }> = ({ data }) => {
    const BASE_CLASS = 'team-member-page';

    let { contentfulTeamMember } = data;

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <span>{contentfulTeamMember?.name}</span>
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
