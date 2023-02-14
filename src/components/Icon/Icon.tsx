import * as React from "react"

import { Variant, IconName } from "@types";
import { IconPath } from "./IconPaths";
import "./icon.scss";

type IconProps = React.SVGAttributes<SVGSVGElement> & {
    name: IconName,
    variant?: Variant,
    fill?: string,
    size?: number
};

export const Icon: React.FC<IconProps> = ({ name, fill, variant, size, className }) => {
    const BASE_CLASS = "icon";

    let defStyles: React.CSSProperties = {
        minWidth: "100%",
        minHeight: "100%"
    };

    if (size) {
        defStyles = {
            minWidth: `${size}px`,
            minHeight: `${size}px`
        }
    }

    return (
        <svg style={defStyles} className={`${BASE_CLASS} ${variant ? `${BASE_CLASS}--variant-${variant}` : ''} ${className ?? ''}`} viewBox="0 0 24 24">
            <path {...(fill ? { fill: fill } : {})} d={`${IconPath[name]}`}></path>
        </svg>
    );
}
