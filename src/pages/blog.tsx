import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { Button, Layout, Logo } from "@components";


const BlogPage: React.FC<PageProps> = (props) => {


    return (
        <Layout>
            <div className="blog">
                <h1>Blog</h1>
            </div>
        </Layout>
    )
}

export default BlogPage;