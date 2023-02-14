import * as React from "react";
import { useState } from "react";
import { Button, Icon, Logo } from "@components";
import "./header.scss";
import { Link, navigate } from "gatsby";
import { useWindowDimensions } from "../../hooks/use-window-dimentions";
import { MAX_SCREEN_WIDTH_SM } from "../..//constants/breakpoints.constants";


export const Header: React.FC = () => {


    const [menuExpanded, setMenuExpanded] = useState(false);
    const { width } = useWindowDimensions();
    const showLinks = menuExpanded || width > MAX_SCREEN_WIDTH_SM;
    const buttonSize: number = 50;
    console.log("WIDTH", width);


    const toggleMenuExpandedState = () => {
        setMenuExpanded(!menuExpanded);
    }

    return (
        <header className="header">
            <Logo className={`header-logo ${menuExpanded ? 'header-logo--menu-expanded' : ''}`} />
            <div className="menu" id="menu-links">
                <div className="menu-icon">
                    <Button
                        aria-expanded={menuExpanded}
                        aria-controls="menu-links"
                        variant="light"
                        btnStyle="rounded"
                        size={buttonSize}
                        onClickBtn={() => { toggleMenuExpandedState() }}
                    >
                        <Icon name={menuExpanded ? "close" : "menu"} color="black" size={buttonSize-20}></Icon>
                    </Button>
                </div>
                {

                    showLinks && <div className="menu-links" id="menu-links">
                        <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">Quienes somos</Link>
                        <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">Equipo de trabajo</Link>
                        <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">Contactanos</Link>
                        <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">Blog</Link>
                        <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">Servicios</Link>
                        <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">FAQ</Link>
                        <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">Beneficios</Link>
                        <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">Login</Link>
                    </div>

                }


            </div>
        </header>
    )
}