import * as React from "react"
import { graphql } from "gatsby"
import { renderRichText } from 'gatsby-source-contentful/rich-text';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Layout } from "@components";
import "./blogPostPage.scss";


const BlogPostPage: React.FC<{ data: Queries.BlogPostPageQuery }> = ({ data }) => {

  const BASE_CLASS = "blog-post-page";

  let { contentfulBlogPost } = data;
  let image = getImage(contentfulBlogPost?.image!);

  return (
    <Layout>
      <div className={BASE_CLASS}>
        <div className={`${BASE_CLASS}-image`}>
          {contentfulBlogPost?.image && <GatsbyImage  image={image!} objectFit="cover" alt="alt"></GatsbyImage>}
        </div>
        <h1 className={`${BASE_CLASS}-title`} >{contentfulBlogPost?.title}</h1>
        <div className={`${BASE_CLASS}-content`}>
          {contentfulBlogPost?.content && renderRichText(contentfulBlogPost?.content as any)}
        </div>
      </div>
    </Layout>
  )
}



export const query = graphql`
query BlogPostPage($id: String!) {
    contentfulBlogPost(id: {eq: $id}){
      id
      title
      slug
      summary
      image {
        gatsbyImageData(
          height: 300
          placeholder: BLURRED
          formats: [AUTO, WEBP, AVIF]
        )
      }
      content {
        raw
        __typename
      }
      contentful_id
    }
  }
`;

export default BlogPostPage