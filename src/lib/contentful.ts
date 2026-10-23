import type { Document } from '@contentful/rich-text-types';
import { isIconName, type IconName } from './icons';

// Read at build time from the process environment (Astro loads `.env` for
// `astro build`). These stay out of the Astro env schema so the on-demand
// contact route does not require the delivery token at runtime.
const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID ?? '';
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN ?? '';
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

export interface ContentImage {
    url: string;
    alt: string;
    width: number;
    height: number;
}

export interface AuthorRef {
    name: string;
    slug: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
    date: string;
    content: Document | null;
    image: ContentImage | null;
    author: AuthorRef | null;
}

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: IconName;
    image: ContentImage | null;
}

export interface CvProfile {
    network?: string;
    url?: string;
}

export interface CvWork {
    name?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    url?: string;
    highlights?: string[];
}

export interface CvEducation {
    area?: string;
    institution?: string;
    startDate?: string;
    endDate?: string;
    studyType?: string;
    url?: string;
}

export interface TeamMember {
    id: string;
    name: string;
    slug: string;
    role: string;
    position: number;
    description: Document | null;
    avatar: ContentImage | null;
    linkedIn: string | null;
    cv: {
        profiles: CvProfile[];
        work: CvWork[];
        education: CvEducation[];
    };
}

export interface MediaItem {
    id: string;
    description: string;
    file: ContentImage | null;
}

interface ContentfulSys {
    id: string;
}

interface ContentfulLink {
    sys: { type: 'Link'; linkType: string; id: string };
}

interface ContentfulAsset {
    sys: ContentfulSys;
    fields: {
        title?: string;
        description?: string;
        file?: {
            url?: string;
            details?: { image?: { width?: number; height?: number } };
        };
    };
}

interface ContentfulEntry<TFields> {
    sys: ContentfulSys;
    fields: TFields;
}

interface ContentfulCollection<TFields> {
    items: ContentfulEntry<TFields>[];
    includes?: {
        Asset?: ContentfulAsset[];
        Entry?: ContentfulEntry<Record<string, unknown>>[];
    };
}

interface BlogPostFields {
    title?: string;
    content?: Document;
    image?: ContentfulLink;
    summary?: string;
    slug?: string;
    author?: ContentfulLink;
    date?: string;
}

interface ServiceFields {
    title?: string;
    description?: string;
    icon?: string;
    image?: ContentfulLink;
}

interface TeamMemberFields {
    avatar?: ContentfulLink;
    name?: string;
    description?: Document;
    slug?: string;
    role?: string;
    linkedIn?: string;
    position?: number;
    cv?: {
        profiles?: CvProfile[];
        work?: CvWork[];
        education?: CvEducation[];
    };
}

interface MediaFields {
    mediaFile?: ContentfulLink;
    description?: string;
}

function once<T>(loader: () => Promise<T>): () => Promise<T> {
    let pending: Promise<T> | undefined;
    return () => {
        pending ??= loader();
        return pending;
    };
}

async function fetchCollection<TFields>(
    contentType: string,
    order?: string
): Promise<ContentfulCollection<TFields>> {
    if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
        throw new Error(
            'CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN must be set before the build.'
        );
    }

    const params = new URLSearchParams({
        content_type: contentType,
        include: '2',
        limit: '1000',
    });
    if (order) {
        params.set('order', order);
    }

    const url = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}/entries?${params.toString()}`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}` },
    });

    if (!response.ok) {
        throw new Error(
            `Contentful request for "${contentType}" failed with status ${response.status}.`
        );
    }

    return (await response.json()) as ContentfulCollection<TFields>;
}

function assetMap(collection: {
    includes?: { Asset?: ContentfulAsset[] };
}): Map<string, ContentfulAsset> {
    return new Map((collection.includes?.Asset ?? []).map((asset) => [asset.sys.id, asset]));
}

function entryMap(collection: {
    includes?: { Entry?: ContentfulEntry<Record<string, unknown>>[] };
}): Map<string, ContentfulEntry<Record<string, unknown>>> {
    return new Map((collection.includes?.Entry ?? []).map((entry) => [entry.sys.id, entry]));
}

function mapImage(asset: ContentfulAsset | undefined, fallbackAlt: string): ContentImage | null {
    const file = asset?.fields.file;
    const width = file?.details?.image?.width;
    const height = file?.details?.image?.height;
    if (!file?.url || !width || !height) {
        return null;
    }
    return {
        url: file.url.startsWith('//') ? `https:${file.url}` : file.url,
        alt: asset?.fields.title || asset?.fields.description || fallbackAlt,
        width,
        height,
    };
}

function resolveAsset(
    link: ContentfulLink | undefined,
    assets: Map<string, ContentfulAsset>,
    fallbackAlt: string
): ContentImage | null {
    if (!link?.sys?.id) {
        return null;
    }
    return mapImage(assets.get(link.sys.id), fallbackAlt);
}

const loadBlogPosts = once(async (): Promise<BlogPost[]> => {
    const collection = await fetchCollection<BlogPostFields>('blogPost', '-sys.updatedAt');
    const assets = assetMap(collection);
    const entries = entryMap(collection);

    return collection.items.flatMap((item) => {
        const slug = item.fields.slug?.trim();
        const title = item.fields.title?.trim();
        if (!slug || !title) {
            return [];
        }
        const authorEntry = item.fields.author?.sys.id
            ? entries.get(item.fields.author.sys.id)
            : undefined;
        const authorName = authorEntry?.fields.name;
        const authorSlug = authorEntry?.fields.slug;
        const author =
            typeof authorName === 'string' && typeof authorSlug === 'string'
                ? { name: authorName, slug: authorSlug }
                : null;

        return [
            {
                id: item.sys.id,
                title,
                slug,
                summary: item.fields.summary ?? '',
                date: item.fields.date ?? '',
                content: item.fields.content ?? null,
                image: resolveAsset(item.fields.image, assets, title),
                author,
            },
        ];
    });
});

const loadServices = once(async (): Promise<Service[]> => {
    const collection = await fetchCollection<ServiceFields>('service', '-sys.updatedAt');
    const assets = assetMap(collection);

    return collection.items.flatMap((item) => {
        const title = item.fields.title?.trim();
        if (!title) {
            return [];
        }
        return [
            {
                id: item.sys.id,
                title,
                description: item.fields.description ?? '',
                icon: isIconName(item.fields.icon) ? item.fields.icon : 'arrow-right',
                image: resolveAsset(item.fields.image, assets, title),
            },
        ];
    });
});

const loadTeam = once(async (): Promise<TeamMember[]> => {
    const collection = await fetchCollection<TeamMemberFields>('teamMember', 'fields.position');
    const assets = assetMap(collection);

    return collection.items
        .flatMap((item) => {
            const slug = item.fields.slug?.trim();
            const name = item.fields.name?.trim();
            if (!slug || !name) {
                return [];
            }
            return [
                {
                    id: item.sys.id,
                    name,
                    slug,
                    role: item.fields.role ?? '',
                    position: item.fields.position ?? 0,
                    description: item.fields.description ?? null,
                    avatar: resolveAsset(item.fields.avatar, assets, name),
                    linkedIn: item.fields.linkedIn ?? null,
                    cv: {
                        profiles: item.fields.cv?.profiles ?? [],
                        work: item.fields.cv?.work ?? [],
                        education: item.fields.cv?.education ?? [],
                    },
                },
            ];
        })
        .sort((a, b) => a.position - b.position);
});

const loadMedia = once(async (): Promise<MediaItem[]> => {
    const collection = await fetchCollection<MediaFields>('media', '-sys.updatedAt');
    const assets = assetMap(collection);

    return collection.items.map((item) => {
        const description = item.fields.description ?? '';
        return {
            id: item.sys.id,
            description,
            file: resolveAsset(item.fields.mediaFile, assets, description),
        };
    });
});

export function getBlogPosts(): Promise<BlogPost[]> {
    return loadBlogPosts();
}

export function getServices(): Promise<Service[]> {
    return loadServices();
}

export function getTeamMembers(): Promise<TeamMember[]> {
    return loadTeam();
}

export function getMedia(): Promise<MediaItem[]> {
    return loadMedia();
}

export async function getRecentPosts(limit = 3): Promise<BlogPost[]> {
    const posts = await getBlogPosts();
    return [...posts]
        .filter((post) => post.date)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, limit);
}
