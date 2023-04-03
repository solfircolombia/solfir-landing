import { GatsbyNode } from 'gatsby';
import path from 'path';

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions }) => {
    const { createPage } = actions;

    const blogPostsQuery = await graphql<Queries.BlogPostCreatePagesQuery>(`
        query BlogPostCreatePages {
            allContentfulBlogPost {
                nodes {
                    id
                    slug
                }
            }
        }
    `);

    const blogPostTemplate = path.resolve('./src/templates/BlogPostPage.tsx');

    const createBlogPostPromise = blogPostsQuery.data?.allContentfulBlogPost.nodes?.map(
        (blogPostData) => {
            createPage({
                path: `blog/${blogPostData.slug}`,
                component: blogPostTemplate,
                context: {
                    id: blogPostData.id,
                },
            });
        }
    );

    // Profiles

    const teamMembersQuery = await graphql<Queries.TeamMemberCreatePagesQuery>(`
        query TeamMemberCreatePages {
            allContentfulTeamMember {
                nodes {
                    id
                    slug
                }
            }
        }
    `);

    const teamMembersTemplate = path.resolve('./src/templates/TeamMemberPage.tsx');

    const createTeamMemberPromise = teamMembersQuery.data?.allContentfulTeamMember.nodes?.map(
        (teamMemberData) => {
            createPage({
                path: `equipo/${teamMemberData.slug}`,
                component: teamMembersTemplate,
                context: {
                    id: teamMemberData.id,
                },
            });
        }
    );

    await Promise.all([createBlogPostPromise, createTeamMemberPromise]);
};
