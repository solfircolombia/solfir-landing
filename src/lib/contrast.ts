/** Relative luminance and contrast, WCAG 2.2. Hex colors only (#rgb or #rrggbb). */

function channel(value: number): number {
    const srgb = value / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
    const normalized = hex.replace('#', '');
    const full =
        normalized.length === 3
            ? normalized
                  .split('')
                  .map((char) => char + char)
                  .join('')
            : normalized;
    const red = Number.parseInt(full.slice(0, 2), 16);
    const green = Number.parseInt(full.slice(2, 4), 16);
    const blue = Number.parseInt(full.slice(4, 6), 16);
    return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

export function contrastRatio(foreground: string, background: string): number {
    const lighter = luminance(foreground);
    const darker = luminance(background);
    const [high, low] = lighter >= darker ? [lighter, darker] : [darker, lighter];
    return (high + 0.05) / (low + 0.05);
}

export function formatRatio(ratio: number): string {
    return `${ratio.toFixed(2)}:1`;
}

/** AA for normal text is 4.5:1. Large text and non-text UI boundaries are 3:1. */
export function meetsAa(ratio: number, large = false): boolean {
    return ratio >= (large ? 3 : 4.5);
}
