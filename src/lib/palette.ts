/**
 * Palette A, "Marino institucional", plus the dark and high-contrast themes.
 * Hex values here are the same ones declared in src/styles/tokens.css.
 * Yellow is an accent. It is never a text color on white (1.85:1).
 */

export const palette = {
    navy: '#012651',
    yellow: '#fab114',
    white: '#ffffff',
    ink: '#141105',
    black: '#000000',
    whatsapp: '#1ca24f',
    settings: '#0094e9',
    muted: '#3e5168',
    canvasDark: '#07111c',
    surfaceDark: '#0e1c2e',
    footerDark: '#04101a',
    textDark: '#f4f7fb',
    mutedDark: '#9fb0c4',
    emphasisDark: '#d6e4f5',
} as const;

export interface ContrastPair {
    label: string;
    foreground: string;
    background: string;
    /** Yellow on white is shown only as a warning. It is not used for text. */
    forbidden?: boolean;
    large?: boolean;
}

export interface ThemeSample {
    id: string;
    name: string;
    theme: 'light' | 'dark';
    contrast?: 'high';
    pairs: ContrastPair[];
}

export const themeSamples: ThemeSample[] = [
    {
        id: 'light',
        name: 'Claro',
        theme: 'light',
        pairs: [
            { label: 'Texto sobre fondo', foreground: palette.navy, background: palette.white },
            { label: 'Texto atenuado', foreground: palette.muted, background: palette.white },
            { label: 'Texto sobre acento', foreground: palette.ink, background: palette.yellow },
            {
                label: 'Acento sobre marca',
                foreground: palette.yellow,
                background: palette.navy,
            },
            {
                label: 'Acento sobre blanco (no es texto)',
                foreground: palette.yellow,
                background: palette.white,
                forbidden: true,
            },
        ],
    },
    {
        id: 'dark',
        name: 'Oscuro',
        theme: 'dark',
        pairs: [
            {
                label: 'Texto sobre fondo',
                foreground: palette.textDark,
                background: palette.canvasDark,
            },
            {
                label: 'Texto atenuado',
                foreground: palette.mutedDark,
                background: palette.canvasDark,
            },
            {
                label: 'Texto de acción sobre acento',
                foreground: palette.ink,
                background: palette.yellow,
            },
            {
                label: 'Acento sobre fondo',
                foreground: palette.yellow,
                background: palette.canvasDark,
            },
            {
                label: 'Énfasis sobre fondo',
                foreground: palette.emphasisDark,
                background: palette.canvasDark,
            },
        ],
    },
    {
        id: 'hc-light',
        name: 'Alto contraste claro',
        theme: 'light',
        contrast: 'high',
        pairs: [
            { label: 'Texto sobre fondo', foreground: palette.black, background: palette.white },
            { label: 'Texto sobre acento', foreground: palette.black, background: palette.yellow },
            {
                label: 'Acento sobre marca',
                foreground: palette.yellow,
                background: palette.black,
            },
        ],
    },
    {
        id: 'hc-dark',
        name: 'Alto contraste oscuro',
        theme: 'dark',
        contrast: 'high',
        pairs: [
            { label: 'Texto sobre fondo', foreground: palette.white, background: palette.black },
            { label: 'Texto sobre acento', foreground: palette.black, background: palette.yellow },
            {
                label: 'Acento sobre fondo',
                foreground: palette.yellow,
                background: palette.black,
            },
        ],
    },
];
