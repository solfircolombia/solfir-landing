import { IGatsbyImageData } from 'gatsby-plugin-image';

export type Service = {
    icon?: string;
    title?: string;
    description?: string;
    image?: IGatsbyImageData;
};
