import React, { useState, useEffect } from 'react';

import { Link } from "gatsby";
import { Button, Icon, Logo } from "@components";
import { BREAKPOINTS, SITE_LINKS, LABELS } from "@constants";

import "./header.scss";
import { Modal } from '../modal/Modal';


export const Header: React.FC = () => {


    const [menuExpanded, setMenuExpanded] = useState(false);
    const [showLinks, setShowLinks] = useState(false);
    let width: number;

    const isBrowser = typeof window !== "undefined"

    const updateShowLinks = (menuExpanded: boolean) => {
        console.log("MenuExpanded", menuExpanded);

        if (isBrowser) {
            width = global.window.innerWidth;
            let show_links = menuExpanded || width > BREAKPOINTS.MAX_SCREEN_WIDTH_SM;
            setShowLinks(show_links);
        }
    }

    const handleResize = () => {
        updateShowLinks(menuExpanded);
    }

    useEffect(() => {
        global.window.addEventListener('resize', handleResize);
    }, [showLinks]);


    const buttonSize: number = 50;

    const toggleMenuExpandedState = () => {
        let newMenuExpanded = !menuExpanded;
        setMenuExpanded(newMenuExpanded);
        updateShowLinks(newMenuExpanded);
    }

    const modalContent = (
        <div className='header-links-modal'>
            {
                SITE_LINKS.map(({ link, label }, idx) => {
                    return (<Link key={idx} className="header-links-modal-item" activeClassName="header-links-modal-item-active" to={link}>{label}</Link>)
                })
            }
        </div>
    );

    return (
        <>
            <header className={`header`} >
                <div className="wrapper">
                    <div className="header-logo">
                        <Logo className={`header-logo-solfir`} />
                        <Button
                            aria-label={LABELS.MENU_PRINCIPAL}
                            className={`header-logo-menu`}
                            variant="light"
                            btnStyle="rounded"
                            size={buttonSize}
                            onClick={() => { toggleMenuExpandedState() }}
                        >
                            <Icon name={menuExpanded ? "close" : "menu"} variant="dark" size={buttonSize - 20}></Icon>
                        </Button>
                    </div>
                    <div className="header-links">
                        {
                            <div className="header-links-wrapper" aria-label='Menu Links'>
                                {
                                    SITE_LINKS.map(({ link, label }, idx) => {
                                        return (<Link key={idx} className="header-links-item" activeClassName="header-links-item-active" to={link}>{label}</Link>)
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>
            </header>
            {menuExpanded ? <Modal ariaLabel='Ventana modal menu' onCloseModal={() => { toggleMenuExpandedState() }}>{modalContent}</Modal> : null}
        </>
    )
}