import * as React from "react"
// import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { renderRichText } from "gatsby-source-contentful/rich-text"



import "./blogCard.scss";
import { GatsbyImage, getImage } from "gatsby-plugin-image";


type BlogCardProps = {
    data: UnpackNodesType<Queries.LandingPageQuery["allContentfulBlogPost"]["nodes"]> ;
};

export const BlogCard: React.FC<BlogCardProps> = ({ data }) => {
    const BASE_CLASS = "blog-card";

    let raw = data.content?.raw;
    let image = getImage(data.image);
    

    // React.useEffect(()=>{
        
        
    //     console.log("effect data", raw);
    // }, [])

    // console.log("Blogcard data, ", data);


    

    return (
        <div className={BASE_CLASS}>
            <div className={`${BASE_CLASS}-image`}>
                { image && <GatsbyImage image={image} alt="alt"></GatsbyImage> }
            </div>
            <div className={`${BASE_CLASS}-summary`}>
                <span className={`${BASE_CLASS}-summary-title`} >{data?.title}</span>
                <p className={`${BASE_CLASS}-summary-text`}>
                    {data.summary} 
                </p>
            </div>
            <div className={`${BASE_CLASS}-actions`}>

            </div>
        </div>
    );
}
