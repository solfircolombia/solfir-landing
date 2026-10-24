import type { HeroImagePosition } from './contentful';

export const HERO_FALLBACK_TITLE =
    'Vuelve a la estabilidad financiera con SOLFIR expertos en insolvencia y reorganización empresarial';
export const HERO_FALLBACK_PRIMARY_LABEL = 'Quiero saber más';
export const HERO_FALLBACK_PRIMARY_URL = '#landing-services';
/** Credit for the local fallback photo, the same Centre for Ageing Better frame. */
export const HERO_FALLBACK_CREDIT = 'Centre for Ageing Better / Unsplash';

export const HERO_OBJECT_POSITION: Record<HeroImagePosition, string> = {
    left: 'left center',
    center: 'center',
    right: 'right center',
};

export interface HeroTitlePart {
    text: string;
    emphasis: boolean;
}

/**
 * Turn a Contentful hero title into text parts. Segments wrapped in **double
 * asterisks** are emphasis. Everything else, including stray asterisks and
 * any HTML-looking text, stays plain text. When the title has no ** markers,
 * the word SOLFIR is emphasized so the live headline matches the previous site.
 */
export function heroTitleParts(title: string): HeroTitlePart[] {
    if (title.includes('**')) {
        return partsFromMarkers(title);
    }
    return partsWithBrand(title);
}

function partsFromMarkers(source: string): HeroTitlePart[] {
    const parts: HeroTitlePart[] = [];
    const pattern = /\*\*([^*]+)\*\*/g;
    let last = 0;
    for (const match of source.matchAll(pattern)) {
        const index = match.index ?? 0;
        if (index > last) {
            parts.push({ text: source.slice(last, index), emphasis: false });
        }
        const text = match[1] ?? '';
        if (text) {
            parts.push({ text, emphasis: true });
        }
        last = index + match[0].length;
    }
    if (last < source.length) {
        parts.push({ text: source.slice(last), emphasis: false });
    }
    return parts;
}

function partsWithBrand(source: string): HeroTitlePart[] {
    const parts: HeroTitlePart[] = [];
    const pattern = /SOLFIR/g;
    let last = 0;
    let found = false;
    for (const match of source.matchAll(pattern)) {
        found = true;
        const index = match.index ?? 0;
        if (index > last) {
            parts.push({ text: source.slice(last, index), emphasis: false });
        }
        parts.push({ text: 'SOLFIR', emphasis: true });
        last = index + match[0].length;
    }
    if (!found) {
        return source ? [{ text: source, emphasis: false }] : [];
    }
    if (last < source.length) {
        parts.push({ text: source.slice(last), emphasis: false });
    }
    return parts;
}

/** Text after "Foto:" in the asset title. An empty result falls back to the description. */
export function photoCredit(title: string, description: string): string {
    const marker = 'Foto:';
    const index = title.indexOf(marker);
    if (index !== -1) {
        const fromTitle = title.slice(index + marker.length).trim();
        if (fromTitle) {
            return fromTitle;
        }
    }
    return description.trim();
}

export function creditLine(credit: string): string {
    const text = credit.trim();
    if (!text) {
        return '';
    }
    return /^foto:/i.test(text) ? text : `Foto: ${text}`;
}
