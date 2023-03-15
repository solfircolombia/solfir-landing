import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
    siteMetadata: {
        title: `SOLFIR COLOMBIA`,
        siteUrl: `https://solfir.com.co`,
        description: `Soluciones Financieras, Insolvencias y Reorganizaciones`,
        twitterUsername: `@SolfirColombia`,
        image: `/images/seoimage.jpg`,
    },
    flags: {
        DEV_SSR: true,
    },
    // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
    // If you use VSCode you can also use the GraphQL plugin
    // Learn more at: https://gatsby.dev/graphql-typegen
    graphqlTypegen: true,
    // "gatsby-plugin-google-gtag" // TODO: add this plugin
    plugins: [
        {
            resolve: 'gatsby-source-contentful',
            options: {
                accessToken: 'qw_Tt0V0jpa-gnNjIWAjvH7kzPJ9UYfsO_mPHVQiNTo',
                spaceId: '6chh7n2v3o9v',
            },
        },
        'gatsby-plugin-image',
        {
            resolve: 'gatsby-plugin-sharp',
            options: {
                defaults: {
                    formats: [`auto`, `webp`],
                    placeholder: `dominantColor`,
                    quality: 50,
                    breakpoints: [480, 768, 1024, 1200, 1440],
                    backgroundColor: `transparent`,
                    tracedSVGOptions: {},
                    blurredOptions: {},
                    jpgOptions: {},
                    pngOptions: {},
                    webpOptions: {},
                    avifOptions: {},
                },
            },
        },
        'gatsby-transformer-sharp',
        'gatsby-plugin-sass',
        'gatsby-plugin-sitemap',
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                icon: 'src/images/favicon.svg',
            },
        },
        'gatsby-plugin-mdx',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'images',
                path: './src/images/',
            },
            __key: 'images',
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'pages',
                path: './src/pages/',
                ignore: [`**/*.scss`],
            },
            __key: 'pages',
        },
        {
            resolve: `gatsby-plugin-alias-imports`,
            options: {
                alias: {
                    '@src': 'src',
                    '@components': 'src/components',
                    '@constants': 'src/constants',
                    '@shared': 'src/shared',
                    '@hooks': 'src/hooks',
                    '@types': 'src/types',
                },
                extensions: ['ts', 'tsx'],
            },
        },
        {
            resolve: 'gatsby-plugin-html-attributes',
            options: {
                lang: 'es',
            },
        },
    ],
};

export default config;
