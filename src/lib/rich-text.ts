import { documentToHtmlString, type Next } from '@contentful/rich-text-html-renderer';
import { BLOCKS, type Block, type Document, type Inline } from '@contentful/rich-text-types';

function heading(tag: 'h2' | 'h3') {
    return (node: Block | Inline, next: Next) => `<${tag}>${next(node.content)}</${tag}>`;
}

export function renderRichText(document: Document | null | undefined): string {
    if (!document) {
        return '';
    }
    return documentToHtmlString(document, {
        renderNode: {
            [BLOCKS.HEADING_1]: heading('h2'),
            [BLOCKS.HEADING_2]: heading('h3'),
            [BLOCKS.HEADING_3]: heading('h3'),
            [BLOCKS.HEADING_4]: heading('h2'),
            [BLOCKS.HEADING_5]: heading('h3'),
            [BLOCKS.HEADING_6]: heading('h3'),
        },
    });
}
