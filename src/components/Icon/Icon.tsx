import * as React from "react"

import { IconPath, IconName } from "./IconPaths";
import "./icon.scss";

type IconProps = React.SVGAttributes<SVGSVGElement> & {
    name: IconName,
    color: string,
    size?: number
};

export const Icon: React.FC<IconProps> = ({name, color = "black", size, className}) => {
    return (
        <svg style={{minWidth:`${size}px`, minHeight:`${size}px`}} className={`icon ${className ?? ''}`} viewBox="0 0 24 24">
            <path fill={color}  d={`${IconPath[name]}`}></path>
        </svg>
    );  
}
