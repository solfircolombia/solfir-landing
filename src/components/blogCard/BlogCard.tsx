import * as React from 'react';

import './blogCard.scss';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { Icon } from '@components';
import { Link } from 'gatsby';
import { STATIC_SITE_LINKS } from '@constants';

type BlogCardProps = {
  data: UnpackNodesType<Queries.LandingPageQuery['allContentfulBlogPost']['nodes']>;
  layout?: 'horizontal' | undefined;
  className?: string;
};

export const BlogCard: React.FC<BlogCardProps> = ({ data, layout, className }) => {
  const BASE_CLASS = 'blog-card';

  let image = getImage(data.image);

  return (
    <div
      className={`${BASE_CLASS} ${layout ? `${BASE_CLASS}--horizontal` : ''} ${className ?? ''}`}
    >
      <div className={`${BASE_CLASS}-image`}>
        {image && <GatsbyImage objectFit="cover" image={image} alt="alt"></GatsbyImage>}
      </div>
      <div className={`${BASE_CLASS}-summary`}>
        <p className={`${BASE_CLASS}-summary-title`}>{data?.title}</p>
        <p className={`${BASE_CLASS}-summary-text`}>{data.summary}</p>
        <p className={`${BASE_CLASS}-summary-actions`}>
          <Link
            to={`${STATIC_SITE_LINKS.BLOG}/${data.slug}`}
            className={`${BASE_CLASS}-summary-actions-link`}
          >
            Leer Mas
            <Icon name="arrow-right" className={`${BASE_CLASS}-summary-actions-link-icon`}></Icon>
          </Link>
        </p>
      </div>
      <div className={`${BASE_CLASS}-actions`}>
        <Link
          to={`${STATIC_SITE_LINKS.BLOG}/${data.slug}`}
          className={`${BASE_CLASS}-actions-link`}
        >
          Leer Mas
          <Icon name="arrow-right" className={`${BASE_CLASS}-actions-link-icon`}></Icon>
        </Link>
      </div>
    </div>
  );
};
