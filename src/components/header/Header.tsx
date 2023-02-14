import * as React from "react";
import { useState } from "react";
import { Link } from "gatsby";
import { Button, Icon, Logo } from "@components";
import {BREAKPOINTS, SITE_LINKS} from "@constants";

import { useWindowDimensions } from "../../hooks/use-window-dimentions";
import "./header.scss";


export const Header: React.FC = () => {


    const [menuExpanded, setMenuExpanded] = useState(false);
    const { width } = useWindowDimensions();
    const showLinks = menuExpanded || width > BREAKPOINTS.MAX_SCREEN_WIDTH_SM;
    const buttonSize: number = 50;

    const toggleMenuExpandedState = () => {
        setMenuExpanded(!menuExpanded);
    }

    return (
        <header className="header">
            <div className="wrapper">
                <Logo className={`header-logo ${menuExpanded ? 'header-logo--menu-expanded' : ''}`} />
                <div className="menu" id="menu-links">
                    <div className="menu-icon">
                        <Button
                            aria-expanded={menuExpanded}
                            aria-controls="menu-links"
                            variant="light"
                            btnStyle="rounded"
                            size={buttonSize}
                            onClick={() => { toggleMenuExpandedState() }}
                        >
                            <Icon name={menuExpanded ? "close" : "menu"} variant="dark" size={buttonSize - 20}></Icon>
                        </Button>
                    </div>
                    {
                        showLinks && <div className="menu-links" id="menu-links">
                            {
                                SITE_LINKS.map(({ link, label }, idx) => {
                                    return (<Link key={idx} className="menu-links-item" activeClassName="menu-links-item-active" to={link}>{label}</Link>)
                                })
                            }
                        </div>
                    }
                </div>
            </div>
        </header>
    )
}