import * as React from "react";
import "./button.scss";

type ButtonProps = {
    btnStyle?: "regular" | "rounded",
    variant?: "primary" | "secondary" | "tertiary" | "dark" | "light",
    size?: "small" | "medium" | "large" | number,
    onClickBtn?: () => void,
    children?: React.ReactNode,
    className?: string,
};

export const Button: React.FC<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ btnStyle = "regular", variant = "primary", size = "medium", onClickBtn, children, className, ...props }) => {

    const sizeIsNumber: boolean = typeof size === "number";

    const onClickButton = () => {
        if(onClickBtn){
            onClickBtn();
        }
    }

    let btnStyles:React.CSSProperties = {
        height: size,
    }

    if(btnStyle === "rounded"){
        btnStyles = {
            ...btnStyles,
            width: size,
            borderRadius: `${size as unknown as number/ 2}px`}
    }

    if (sizeIsNumber) {
        return (
            <button style={btnStyles} className={`button ${btnStyle} ${variant} ${className ?? ''}`} onClick={onClickButton} {...props}>
                {children}
            </button>
        )
    } else {
        return (
            <button className={`button ${btnStyle} ${variant} ${size} ${className}`} onClick={onClickButton}>
                {children}
            </button>
        )
    }
}