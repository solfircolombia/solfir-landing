import * as React from 'react';
import { graphql } from 'gatsby';
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { Layout, RecentPosts } from '@components';
import './blogPostPage.scss';

const BlogPostPage: React.FC<{ data: Queries.BlogPostPageQuery }> = ({ data }) => {
    const BASE_CLASS = 'blog-post-page';

    let { contentfulBlogPost } = data;
    let image = getImage(contentfulBlogPost?.image!);
    const formatDate = (date: string | null | undefined) => {
        if (date) {
            // return new Date(date).toDateString();
            return new Date(date).toLocaleDateString('es', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        }
    };

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <span className={`${BASE_CLASS}-title`}>{contentfulBlogPost?.title}</span>
                <div className={`${BASE_CLASS}-date-author`}>
                    {formatDate(contentfulBlogPost?.date)} | Autor -{' '}
                    {contentfulBlogPost?.author?.name}
                </div>
                <div className={`${BASE_CLASS}-main`}>
                    <div className={`${BASE_CLASS}-main-content`}>
                        <div className={`${BASE_CLASS}-main-content-image`}>
                            {contentfulBlogPost?.image && (
                                <GatsbyImage
                                    image={image!}
                                    objectFit="cover"
                                    alt="alt"
                                ></GatsbyImage>
                            )}
                        </div>
                        <div className={`${BASE_CLASS}-content-text`}>
                            {contentfulBlogPost?.content &&
                                renderRichText(contentfulBlogPost?.content as any)}
                        </div>
                    </div>
                    <div className={`${BASE_CLASS}-recent-posts`}>
                        <RecentPosts />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export const query = graphql`
    query BlogPostPage($id: String!) {
        contentfulBlogPost(id: { eq: $id }) {
            id
            title
            slug
            summary
            date
            image {
                gatsbyImageData(
                    placeholder: BLURRED
                    formats: [AUTO, WEBP, AVIF]
                    layout: CONSTRAINED
                    resizingBehavior: FILL
                )
            }
            author {
                name
            }
            content {
                raw
                __typename
            }
            contentful_id
        }
    }
`;

export default BlogPostPage;
