import * as React from "react"

import "./blogCard.scss";

type BlogCardProps = {
    
};

export const BlogCard: React.FC<BlogCardProps> = ({  }) => {
    const BASE_CLASS = "blog-card";

    return (
        <div className={BASE_CLASS}>
            <div className={`${BASE_CLASS}-images`}>
                
            </div>
            <div className={`${BASE_CLASS}-summary`}>

            </div>
            <div className={`${BASE_CLASS}-actions`}>

            </div>
        </div>
    );
}
