import * as React from "react"
import { Link, HeadFC, PageProps } from "gatsby"
import { Layout } from "@components"


const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <h1>404 Page not found</h1>
    </Layout>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
