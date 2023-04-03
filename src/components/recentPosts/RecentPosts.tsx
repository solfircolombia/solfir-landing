import * as React from 'react';

import './recentPosts.scss';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { Icon } from '@components';
import { Link } from 'gatsby';
import { STATIC_SITE_LINKS } from '@constants';
import { useStaticQuery, graphql } from 'gatsby';

export const RecentPosts: React.FC<any> = () => {
    const BASE_CLASS = 'recent-posts';

    const data: Queries.RecentPostsQueryQuery = useStaticQuery(graphql`
        query RecentPostsQuery {
            allContentfulBlogPost(sort: { date: DESC }, limit: 3) {
                edges {
                    node {
                        id
                        date
                        title
                        slug
                        author {
                            name
                        }
                        image {
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
        }
    `);

    return (
        <div className={BASE_CLASS}>
            <span className={`${BASE_CLASS}-title`}>Últimas publicaciones</span>
            <div className={`${BASE_CLASS}-wrapper`}>
                {data.allContentfulBlogPost.edges.map(({ node }) => {
                    return (
                        <div className={`${BASE_CLASS}-card`}>
                            <div className={`${BASE_CLASS}-card-img`}>
                                {node?.image && (
                                    <GatsbyImage
                                        image={getImage(node.image)!}
                                        objectFit="cover"
                                        alt="alt"
                                    ></GatsbyImage>
                                )}
                            </div>
                            <span className={`${BASE_CLASS}-card-title`}>{node.title}</span>
                            <Link
                                to={`${STATIC_SITE_LINKS.BLOG}/${node.slug}`}
                                className={`${BASE_CLASS}-card-link`}
                            >
                                Leer Post
                                <Icon
                                    name="arrow-right"
                                    className={`${BASE_CLASS}-card-link-icon`}
                                ></Icon>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
