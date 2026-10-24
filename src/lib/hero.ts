import type { HeroImagePosition } from './contentful';

export const HERO_FALLBACK_TITLE =
    'Vuelve a la estabilidad financiera con SOLFIR expertos en insolvencia y reorganización empresarial';
export const HERO_FALLBACK_PRIMARY_LABEL = 'Quiero saber más';
export const HERO_FALLBACK_PRIMARY_URL = '#landing-services';

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
