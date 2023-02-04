import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { Layout } from "@components";


const IndexPage: React.FC<PageProps> = (props) => {
  return (
    <Layout>
      <h1>Hello from Index2</h1>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
