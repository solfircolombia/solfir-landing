import * as React from "react";
import "./logo.scss";
import { Link, navigate } from "gatsby";

type LogoProps = {
    variant?: "regular" | "dark" | "light";
    size?: number;
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({variant = "regular", className}) => {

    const clickHandler = () => {
        navigate("/")
    };

    return (
        <Link role="navigation" aria-label="Solfir logo, Haz click para volver a la página inicial" className={`logo ${className}`} to="/">
            <span className={`bar ${variant}`}>|</span>
            <span className={`letter ${variant}`}>S</span>
            <span className={`bar ${variant}`}>|</span>
            <span className={`letter ${variant}`}>O</span>
            <span className={`bar ${variant}`}>|</span>
            <span className={`letter ${variant}`}>L</span>
            <span className={`bar ${variant}`}>|</span>
            <span className={`letter ${variant}`}>F</span>
            <span className={`bar ${variant}`}>|</span>
            <span className={`letter ${variant}`}>I</span>
            <span className={`bar ${variant}`}>|</span>
            <span className={`letter ${variant}`}>R</span>
            <span className={`bar ${variant}`}>|</span>
        </Link>
    )
}