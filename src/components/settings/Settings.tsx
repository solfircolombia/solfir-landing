import * as React from "react"
import { useState } from "react";
import { Icon } from "@components";
import { Variant, VariantContrast } from "@types";
import "./settings.scss";

type Theme = Record<Variant | VariantContrast, string>;


export const Settings: React.FC = () => {

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [textSize, setTextSize] = useState(19);

    const BASE_CLASS = "settings";

    const THEMES: Record<string, Theme> = {
        "AIR": {
            primary: "hsla(340, 71%, 54%, 1)",
            primaryContrast: "a",
            secondary: "hsla(52, 99%, 67%, 1)",
            secondaryContrast: "",
            tertiary: "hsla(215, 53%, 35%, 1)",
            tertiaryContrast: "",
            light: "white",
            lightContrast: "",
            dark: "hsla(39, 52%, 6%, 1)",
            darkContrast: "",

        },
        "AIR2": {
            primary: "hsla(222, 79%, 55%,1)",
            primaryContrast: "a",
            secondary: "hsla(199, 100%, 50%,1)",
            secondaryContrast: "",
            tertiary: "hsla(222, 79%, 35%,1)",
            tertiaryContrast: "",
            light: "white",
            lightContrast: "",
            dark: "hsla(39, 52%, 6%, 1)",
            darkContrast: "",
        },
        "AIR3": {
            primary: "hsla(27, 100%, 50%,1)",
            primaryContrast: "a",
            secondary: "hsla(41, 97%, 53%,1)",
            secondaryContrast: "",
            tertiary: "hsla(27, 100%, 30%,1)",
            tertiaryContrast: "",
            light: "white",
            lightContrast: "",
            dark: "hsla(39, 52%, 6%, 1)",
            darkContrast: "",
        },
    }

    const switchVars = (themeName: string) => {
        (Object.keys(THEMES[themeName]) as Array<Variant | VariantContrast>).forEach((color) => {
            const value = THEMES[themeName][color];
            document.documentElement.style.setProperty(`--${color}`, value);
        })
    }

    const increaseTextSize = () => {
        let newSize = textSize + 1;
        updateTextSize(newSize);
    }
    const decreaseTextSize = () => {
        let newSize = textSize - 1;
        updateTextSize(newSize);
    }

    const updateTextSize = (size:number)=>{
        setTextSize(size);
        document.documentElement.style.setProperty(`--base-font-size`, `${size}px`);
    }

    const toggleSettings = () => {
        setSettingsOpen(!settingsOpen);
    }

    return (
        <div className={`${BASE_CLASS} ${settingsOpen ? `${BASE_CLASS}--open` : `${BASE_CLASS}--closed`}`}>
            <div className={`${BASE_CLASS}-content`}>
                <p>COLORES PAGINA</p>
                <div className={`${BASE_CLASS}-content-themes`}>
                    {
                        Object.entries(THEMES).map(([themeName, theme]) => {
                            return (
                                <div key={`key-${themeName}`} className={`${BASE_CLASS}-content-themes-wrapper`}>
                                    <small>{themeName}</small>
                                    <div onClick={() => { switchVars(themeName) }} className={`${BASE_CLASS}-content-themes-box`}>
                                        {Object.entries(theme).map(([k, v]) => {
                                            if (!k.includes("Contrast")) {
                                                return (
                                                    <span key={`key-${k}`}
                                                        className={`${BASE_CLASS}-content-themes-box-item`}
                                                        style={{ backgroundColor: v }}>
                                                    </span>
                                                )
                                            }
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <p>TAMAÑO LETRA</p>
                <div className={`${BASE_CLASS}-content-text`}>
                    <span className={`${BASE_CLASS}-content-text-icon`} onClick={()=>{decreaseTextSize()}}>
                        <Icon name="text-decrease" variant="light"></Icon>
                    </span>
                    <span className={`${BASE_CLASS}-content-text-icon`} onClick={()=>{increaseTextSize()}}>
                        <Icon name="text-increase" variant="light"></Icon>
                    </span>
                </div>
            </div>
            {/* Toggle */}
            <div className={`${BASE_CLASS}-toggle`}>
                <span className={`${BASE_CLASS}-toggle-icon`} onClick={() => { toggleSettings() }}>
                    <Icon name="settings" variant="light"></Icon>
                </span>
            </div>
        </div>
    );
}
