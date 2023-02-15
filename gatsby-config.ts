import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `solfir-landing`,
    siteUrl: `https://www.yourdomain.tld`
  },
  flags: {
    DEV_SSR: true
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  // "gatsby-plugin-google-gtag" // TODO: add this plugin
  plugins: [{
    resolve: 'gatsby-source-contentful',
    options: {
      "accessToken": "qw_Tt0V0jpa-gnNjIWAjvH7kzPJ9UYfsO_mPHVQiNTo",
      "spaceId": "6chh7n2v3o9v"
    }
  }, "gatsby-plugin-image", "gatsby-plugin-sharp", "gatsby-transformer-sharp", "gatsby-plugin-sass", "gatsby-plugin-sitemap", {
    resolve: 'gatsby-plugin-manifest',
    options: {
      "icon": "src/images/icon.png"
    }
  }, "gatsby-plugin-mdx", {
    resolve: 'gatsby-source-filesystem',
    options: {
      "name": "images",
      "path": "./src/images/"
    },
    __key: "images"
  }, {
    resolve: 'gatsby-source-filesystem',
    options: {
      "name": "pages",
      "path": "./src/pages/"
    },
    __key: "pages"
  },
  {
    resolve: `gatsby-plugin-alias-imports`,
    options: {
      alias: {
        "@src": "src",
        "@components": "src/components",
        "@constants": "src/constants",
        "@types": "src/types"
      },
      extensions: [
        "ts","tsx"
      ],
    }
  }
]
};

export default config;
