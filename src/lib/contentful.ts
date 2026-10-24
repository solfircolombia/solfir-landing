import type { Document } from '@contentful/rich-text-types';
import { isIconName, type IconName } from './icons';
import { slugify } from './site';

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

export type HeroImagePosition = 'left' | 'center' | 'right';

/** Hero photo. `title` and `description` feed the credit line; the picture itself is decorative. */
export interface HeroAsset {
    url: string;
    width: number;
    height: number;
    title: string;
    description: string;
}

export interface HomePage {
    id: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    image: HeroAsset | null;
    imagePosition: HeroImagePosition;
    primaryCtaLabel: string;
    primaryCtaUrl: string;
    secondaryCtaLabel: string;
    secondaryCtaUrl: string;
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

export interface ServicePoint {
    title: string;
    text: string;
}

export interface ServiceFaq {
    question: string;
    answer: string;
}

export interface Service {
    id: string;
    title: string;
    slug: string;
    description: string;
    metaDescription: string;
    icon: IconName;
    image: ContentImage | null;
    benefits: ServicePoint[];
    steps: ServicePoint[];
    faq: ServiceFaq[];
    relatedPosts: BlogPost[];
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
    metaDescription?: string;
    icon?: string;
    image?: ContentfulLink;
    slug?: string;
    benefits?: unknown;
    /** Older name. `steps` is the field on the content type. */
    process?: unknown;
    steps?: unknown;
    faq?: unknown;
    relatedPosts?: ContentfulLink[];
    [key: string]: unknown;
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

interface HomePageFields {
    heroEyebrow?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: ContentfulLink;
    heroImagePosition?: string;
    heroPrimaryCtaLabel?: string;
    heroPrimaryCtaUrl?: string;
    heroSecondaryCtaLabel?: string;
    heroSecondaryCtaUrl?: string;
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
    order?: string,
    limit = 1000
): Promise<ContentfulCollection<TFields>> {
    if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
        throw new Error(
            'CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN must be set before the build.'
        );
    }

    const params = new URLSearchParams({
        content_type: contentType,
        include: '2',
        limit: String(limit),
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

function mapImage(
    asset: ContentfulAsset | undefined,
    fallbackAlt: string,
    descriptionOnly = false
): ContentImage | null {
    const file = asset?.fields.file;
    const width = file?.details?.image?.width;
    const height = file?.details?.image?.height;
    if (!file?.url || !width || !height) {
        return null;
    }
    const description = asset?.fields.description?.trim() ?? '';
    return {
        url: file.url.startsWith('//') ? `https:${file.url}` : file.url,
        alt: descriptionOnly
            ? description
            : description || asset?.fields.title?.trim() || fallbackAlt,
        width,
        height,
    };
}

function mapHeroAsset(asset: ContentfulAsset | undefined): HeroAsset | null {
    const file = asset?.fields.file;
    const width = file?.details?.image?.width;
    const height = file?.details?.image?.height;
    if (!file?.url || !width || !height) {
        return null;
    }
    return {
        url: file.url.startsWith('//') ? `https:${file.url}` : file.url,
        width,
        height,
        title: asset?.fields.title?.trim() ?? '',
        description: asset?.fields.description?.trim() ?? '',
    };
}

function heroImagePosition(value: string | undefined): HeroImagePosition {
    if (value === 'left' || value === 'center' || value === 'right') {
        return value;
    }
    return 'right';
}

function resolveAsset(
    link: ContentfulLink | undefined,
    assets: Map<string, ContentfulAsset>,
    fallbackAlt: string,
    descriptionOnly = false
): ContentImage | null {
    if (!link?.sys?.id) {
        return null;
    }
    return mapImage(assets.get(link.sys.id), fallbackAlt, descriptionOnly);
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

function stringField(record: Record<string, unknown>, keys: string[]): string {
    for (const key of keys) {
        const value = record[key];
        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }
    }
    return '';
}

function asArray(value: unknown): unknown[] {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === 'string' && value.trim().startsWith('[')) {
        try {
            const parsed = JSON.parse(value) as unknown;
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    return [];
}

function pointList(value: unknown, titleKeys: string[], textKeys: string[]): ServicePoint[] {
    const items = asArray(value);
    if (items.length === 0) {
        return [];
    }
    return items.flatMap((item) => {
        if (!item || typeof item !== 'object') {
            return [];
        }
        const record = item as Record<string, unknown>;
        const title = stringField(record, titleKeys);
        const text = stringField(record, textKeys);
        if (!title && !text) {
            return [];
        }
        return [{ title: title || text, text }];
    });
}

function asLink(value: unknown): ContentfulLink | undefined {
    if (!value || typeof value !== 'object') {
        return undefined;
    }
    const sys = (value as { sys?: ContentfulLink['sys'] }).sys;
    if (!sys?.id || sys.type !== 'Link') {
        return undefined;
    }
    return { sys };
}

function mapRelatedPost(
    entry: ContentfulEntry<Record<string, unknown>> | undefined,
    assets: Map<string, ContentfulAsset>,
    entries: Map<string, ContentfulEntry<Record<string, unknown>>>
): BlogPost | null {
    if (!entry) {
        return null;
    }
    const title = typeof entry.fields.title === 'string' ? entry.fields.title.trim() : '';
    const slug = typeof entry.fields.slug === 'string' ? entry.fields.slug.trim() : '';
    if (!title || !slug) {
        return null;
    }
    const authorEntry = asLink(entry.fields.author);
    const author = authorEntry ? entries.get(authorEntry.sys.id) : undefined;
    const authorName = typeof author?.fields.name === 'string' ? author.fields.name : '';
    const authorSlug = typeof author?.fields.slug === 'string' ? author.fields.slug : '';
    const content = entry.fields.content;
    return {
        id: entry.sys.id,
        title,
        slug,
        summary: typeof entry.fields.summary === 'string' ? entry.fields.summary : '',
        date: typeof entry.fields.date === 'string' ? entry.fields.date : '',
        content: content && typeof content === 'object' ? (content as Document) : null,
        image: resolveAsset(asLink(entry.fields.image), assets, title),
        author: authorName && authorSlug ? { name: authorName, slug: authorSlug } : null,
    };
}

function relatedPostList(
    value: unknown,
    assets: Map<string, ContentfulAsset>,
    entries: Map<string, ContentfulEntry<Record<string, unknown>>>
): BlogPost[] {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.flatMap((item) => {
        const link = asLink(item);
        const post = link ? mapRelatedPost(entries.get(link.sys.id), assets, entries) : null;
        return post ? [post] : [];
    });
}

function faqList(value: unknown): ServiceFaq[] {
    return asArray(value).flatMap((item) => {
        if (!item || typeof item !== 'object') {
            return [];
        }
        const record = item as Record<string, unknown>;
        const question = stringField(record, ['question', 'title', 'name']);
        const answer = stringField(record, ['answer', 'text', 'description']);
        if (!question && !answer) {
            return [];
        }
        return [{ question: question || answer, answer }];
    });
}

/** arrow-right in Contentful means the service has no chosen icon. */
const SERVICE_ICON_DEFAULTS: Partial<Record<string, IconName>> = {
    'evitar-remates-y-perdida-de-su-patrimonio': 'shield-check',
    'acuerdos-privados-y-liquidaciones-patrimoniales': 'handshake',
    'recuperar-su-estabilidad-financiera-y-tranquilidad': 'trending-up',
    'negociacion-de-deudas': 'savings',
};

function serviceIcon(field: string | undefined, slug: string): IconName {
    if (isIconName(field) && field !== 'arrow-right') {
        return field;
    }
    return SERVICE_ICON_DEFAULTS[slug] ?? 'arrow-right';
}

const loadServices = once(async (): Promise<Service[]> => {
    const collection = await fetchCollection<ServiceFields>('service', '-sys.updatedAt');
    const assets = assetMap(collection);
    const entries = entryMap(collection);
    const used = new Map<string, number>();

    return collection.items.flatMap((item) => {
        const title = item.fields.title?.trim();
        if (!title) {
            return [];
        }
        const requested =
            (typeof item.fields.slug === 'string' ? item.fields.slug.trim() : '') ||
            slugify(title) ||
            item.sys.id.toLowerCase();
        const seen = used.get(requested) ?? 0;
        used.set(requested, seen + 1);
        const slug = seen === 0 ? requested : `${requested}-${seen + 1}`;
        return [
            {
                id: item.sys.id,
                title,
                slug,
                description: item.fields.description ?? '',
                metaDescription:
                    typeof item.fields.metaDescription === 'string'
                        ? item.fields.metaDescription.trim()
                        : '',
                icon: serviceIcon(item.fields.icon, slug),
                image: resolveAsset(item.fields.image, assets, '', true),
                benefits: pointList(
                    item.fields.benefits,
                    ['title', 'text'],
                    ['text', 'description']
                ),
                steps: pointList(
                    item.fields.steps ?? item.fields.process,
                    ['title', 'text'],
                    ['text', 'description']
                ),
                faq: faqList(item.fields.faq),
                relatedPosts: relatedPostList(item.fields.relatedPosts, assets, entries),
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

const loadHomePage = once(async (): Promise<HomePage | null> => {
    const collection = await fetchCollection<HomePageFields>('homePage', undefined, 1);
    const item = collection.items[0];
    if (!item) {
        return null;
    }
    const assets = assetMap(collection);
    const imageLink = item.fields.heroImage;
    return {
        id: item.sys.id,
        eyebrow: item.fields.heroEyebrow?.trim() ?? '',
        title: item.fields.heroTitle?.trim() ?? '',
        subtitle: item.fields.heroSubtitle?.trim() ?? '',
        image: mapHeroAsset(imageLink?.sys?.id ? assets.get(imageLink.sys.id) : undefined),
        imagePosition: heroImagePosition(item.fields.heroImagePosition),
        primaryCtaLabel: item.fields.heroPrimaryCtaLabel?.trim() ?? '',
        primaryCtaUrl: item.fields.heroPrimaryCtaUrl?.trim() ?? '',
        secondaryCtaLabel: item.fields.heroSecondaryCtaLabel?.trim() ?? '',
        secondaryCtaUrl: item.fields.heroSecondaryCtaUrl?.trim() ?? '',
    };
});

export function getBlogPosts(): Promise<BlogPost[]> {
    return loadBlogPosts();
}

export function getHomePage(): Promise<HomePage | null> {
    return loadHomePage();
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
