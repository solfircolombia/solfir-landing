import * as React from 'react';
import { useState } from 'react';
import { Icon } from '@components';
import { Variant, VariantContrast } from '@types';
import './settings.scss';
import { COLORS } from '@constants';

type Theme = Record<Variant | VariantContrast, string>;

export const Settings: React.FC = () => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [textSize, setTextSize] = useState(19);

    const BASE_CLASS = 'settings';

    const THEMES: Record<string, Theme> = {
        SOLFIR_1: {
            primary: COLORS.COLOR_PRUSSIAN_BLUE,
            primaryContrast: COLORS.COLOR_SUGAR_CANE,
            secondary: COLORS.COLOR_SUN_YELLOW,
            secondaryContrast: COLORS.COLOR_EL_PASO,
            tertiary: COLORS.COLOR_CERISE_RED,
            tertiaryContrast: COLORS.COLOR_EL_PASO,
            light: COLORS.COLOR_SUGAR_CANE,
            lightContrast: COLORS.COLOR_EL_PASO,
            dark: COLORS.COLOR_EL_PASO,
            darkContrast: COLORS.COLOR_SUGAR_CANE,
        },
        SOLFIR_2: {
            primary: COLORS.COLOR_EL_PASO,
            primaryContrast: COLORS.COLOR_SUGAR_CANE,
            secondary: COLORS.COLOR_SUN_YELLOW,
            secondaryContrast: COLORS.COLOR_EL_PASO,
            tertiary: COLORS.COLOR_FINN,
            tertiaryContrast: COLORS.COLOR_SUGAR_CANE,
            light: COLORS.COLOR_SUGAR_CANE,
            lightContrast: COLORS.COLOR_EL_PASO,
            dark: COLORS.COLOR_EL_PASO,
            darkContrast: COLORS.COLOR_SUGAR_CANE,
        },
    };

    const switchVars = (themeName: string) => {
        (Object.keys(THEMES[themeName]) as Array<Variant | VariantContrast>).forEach((color) => {
            const value = THEMES[themeName][color];
            document.documentElement.style.setProperty(`--${color}`, value);
        });
    };

    const increaseTextSize = () => {
        let newSize = textSize + 1;
        updateTextSize(newSize);
    };
    const decreaseTextSize = () => {
        let newSize = textSize - 1;
        updateTextSize(newSize);
    };

    const updateTextSize = (size: number) => {
        setTextSize(size);
        document.documentElement.style.setProperty(`--base-font-size`, `${size}px`);
    };

    const toggleSettings = () => {
        setSettingsOpen(!settingsOpen);
    };

    return (
        <div
            className={`${BASE_CLASS} ${
                settingsOpen ? `${BASE_CLASS}--open` : `${BASE_CLASS}--closed`
            }`}
        >
            <div className={`${BASE_CLASS}-content`}>
                <p>SELECCIONE PALETA DE COLORES</p>
                <div className={`${BASE_CLASS}-content-themes`}>
                    {Object.entries(THEMES).map(([themeName, theme]) => {
                        return (
                            <div
                                key={`key-${themeName}`}
                                className={`${BASE_CLASS}-content-themes-wrapper`}
                            >
                                <div
                                    onClick={() => {
                                        switchVars(themeName);
                                    }}
                                    className={`${BASE_CLASS}-content-themes-box`}
                                >
                                    {Object.entries(theme).map(([k, v]) => {
                                        if (!k.includes('Contrast')) {
                                            return (
                                                <span
                                                    key={`key-${k}`}
                                                    className={`${BASE_CLASS}-content-themes-box-item`}
                                                    style={{ backgroundColor: v }}
                                                ></span>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <p>TAMAÑO LETRA</p>
                <div className={`${BASE_CLASS}-content-text`}>
                    <span
                        className={`${BASE_CLASS}-content-text-icon`}
                        onClick={() => {
                            decreaseTextSize();
                        }}
                    >
                        <Icon name="text-decrease" variant="dark"></Icon>
                    </span>
                    <span
                        className={`${BASE_CLASS}-content-text-icon`}
                        onClick={() => {
                            increaseTextSize();
                        }}
                    >
                        <Icon name="text-increase" variant="dark"></Icon>
                    </span>
                </div>
            </div>
            {/* Toggle */}
            <div className={`${BASE_CLASS}-toggle`}>
                <span
                    className={`${BASE_CLASS}-toggle-icon`}
                    onClick={() => {
                        toggleSettings();
                    }}
                >
                    <Icon name="settings" variant="light"></Icon>
                </span>
            </div>
        </div>
    );
};
