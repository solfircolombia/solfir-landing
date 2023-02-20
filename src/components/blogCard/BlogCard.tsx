import * as React from "react"

import "./blogCard.scss";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Button, Icon } from "@components";
import { Link } from "gatsby";


type BlogCardProps = {
    data: UnpackNodesType<Queries.LandingPageQuery["allContentfulBlogPost"]["nodes"]> ;
};

export const BlogCard: React.FC<BlogCardProps> = ({ data }) => {
    const BASE_CLASS = "blog-card";

    let image = getImage(data.image);
    
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
                <Link to="/" className={`${BASE_CLASS}-actions-link`}>
                    Leer Mas
                    <Icon name="arrow-right" className={`${BASE_CLASS}-actions-link-icon`}></Icon>
                </Link>
            </div>
        </div>
    );
}
