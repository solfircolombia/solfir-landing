import { GatsbyNode } from "gatsby";
import path from "path";

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions }) => {

    const { createPage } = actions;

    const blogPostsQuery = await graphql<Queries.BlogPostCreatePagesQuery>(`
        query BlogPostCreatePages {
            allContentfulBlogPost{
                nodes {
                    id,
                    slug
                }
            }
        }
    `);

    const blogPostTemplate = path.resolve("./src/templates/BlogPostPage.tsx")

    const createBlogPostPromise = blogPostsQuery.data?.allContentfulBlogPost.nodes?.map((blogPostData) => {
        createPage({
            path: `blog/${blogPostData.slug}`,
            component: blogPostTemplate,
            context: {
                id: blogPostData.id,
            }
        })
    });

    await Promise.all([createBlogPostPromise]);

} 