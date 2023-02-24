import * as React from "react"
import { graphql, HeadFC, PageProps } from "gatsby"
import { Layout, BlogCard } from "@components";
import { STATIC_SITE_LABELS } from "@constants";
import "./blog.scss";


const BlogPage: React.FC<PageProps<Queries.BlogPageQuery>> = ({data}) => {

    const BASE_CLASS = "blog";
    const BLOG_POSTS = data.allContentfulBlogPost.nodes;

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <div className={`${BASE_CLASS}-header`}>
                   <div className={`${BASE_CLASS}-wrapper`}>
                    <span className={`${BASE_CLASS}-header-title`}>Bienvenidos a nuestro Blog</span>
                   </div>
                </div>
                <div className={`${BASE_CLASS}-welcome-text`}>
                   <div className={`${BASE_CLASS}-wrapper`}>
                    <span className={`${BASE_CLASS}-welcome-text-content`}>
                        Aquí encontrarás información útil y consejos financieros para ayudarte a manejar mejor tus finanzas personales o empresariales. Además, te mantendremos informado sobre temas de actualidad relacionados con la insolvencia y otras cuestiones legales y financieras relevantes. En SOLFIR, creemos que el conocimiento financiero es la clave para tomar decisiones informadas y positivas para el futuro financiero. Únete a nosotros en esta aventura financiera y descubre cómo podemos ayudarte a lograr una mayor estabilidad financiera y tranquilidad.
                    </span>
                   </div>
                </div>

                <div className={`${BASE_CLASS}-posts`}>
                   <div className={`${BASE_CLASS}-wrapper`}>
                   <h3 className={`${BASE_CLASS}-posts-title`}>
                      Últimas publicaciones
                   </h3>
                    <span className={`${BASE_CLASS}-posts-items`}>
                        {BLOG_POSTS.map((post) => {
                            return <BlogCard key={post.id} data={post} layout="horizontal" className={`${BASE_CLASS}-posts-items-card`}></BlogCard>
                        })}
                    </span>
                   </div>
                </div>              
            </div>
        </Layout>
    )
}

export const query = graphql`
  query BlogPage {
    allContentfulBlogPost {
      nodes {
        id
        image {
          gatsbyImageData(
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
            aspectRatio: 1
          )
        }
        slug
        summary
        title
        contentful_id
      }
      totalCount
    }
  }
`;

export default BlogPage;

export const Head: HeadFC = () => <title>SOLFIR - {STATIC_SITE_LABELS.BLOG}</title>