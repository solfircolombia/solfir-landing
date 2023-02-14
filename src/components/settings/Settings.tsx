import * as React from "react"
import { useState } from "react";
import { Icon } from "@components";
import { Variant } from "@types";
import "./settings.scss";

type Theme = Record<Variant, string>;



export const Settings: React.FC = () => {

    const [settingsOpen, setSettingsOpen] = useState(false);

    const BASE_CLASS = "settings";

    const THEMES: Theme[] = [
        {
            primary: "hsla(340, 71%, 54%, 1)",
            secondary: "hsla(52, 99%, 67%, 1)",
            tertiary: "hsla(215, 53%, 35%, 1)",
            light: "white",
            dark: "hsla(39, 52%, 6%, 1)"
        },
        {
            primary: "hsla(23, 71%, 54%, 1)",
            secondary: "hsla(152, 99%, 67%, 1)",
            tertiary: "hsla(15, 53%, 35%, 1)",
            light: "white",
            dark: "hsla(200, 52%, 6%, 1)"
        },
    ]

    const switchVars = (theme: Theme) => {
        console.log("Switching");
        (Object.keys(theme) as Array<Variant>).forEach((color) => {
            const value = theme[color];
            document.documentElement.style.setProperty(`--${color}`, value);
        })
    }

    const toggleSettings = () => {
        setSettingsOpen(!settingsOpen);
    }

    return (
        <div className={`${BASE_CLASS} ${ settingsOpen ? `${BASE_CLASS}--open` : `${BASE_CLASS}--closed`}`}>
            <div className={`${BASE_CLASS}-tab`}>
                <span className={`${BASE_CLASS}-tab-icon`} onClick={() => { toggleSettings() }}>
                    <Icon name="settings" variant="dark"></Icon>
                </span>
            </div>
            <div className={`${BASE_CLASS}-content`}>
                <div className={`${BASE_CLASS}-content-themes`}>
                    {
                        THEMES.map((theme: Theme) => {
                            return (<div onClick={() => { switchVars(theme) }} className={`${BASE_CLASS}-content-themes-box`}>
                                {Object.entries(theme).map(([k, v]) => {
                                    return (<span className={`${BASE_CLASS}-content-themes-box-item`} style={{
                                        backgroundColor: v
                                    }}
                                    ></span>)
                                })}
                            </div>)
                        })
                    }
                </div>

            </div>
        </div>
    );
}
