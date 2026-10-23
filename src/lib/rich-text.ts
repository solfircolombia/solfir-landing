import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import type { Document } from '@contentful/rich-text-types';

export function renderRichText(document: Document | null | undefined): string {
    if (!document) {
        return '';
    }
    return documentToHtmlString(document);
}
