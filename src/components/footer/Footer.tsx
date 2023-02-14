import * as React from "react";
import { Link } from "gatsby";

import { Logo, Icon } from "@components";
import { IconName } from "@types";
import "./footer.scss";
import { SITE_LINKS } from "../../constants/links.constants";


export const Footer: React.FC = () => {

    const socialData: Array<{ name: IconName, link: string }> = [
        { name: "facebook", link: "https://facebook.com" },
        { name: "instagram", link: "https://instagram.com" },
        { name: "linkedin", link: "https://linkedin.com" },
        { name: "whatsapp", link: "https://whatsapp.com" },
    ]

    return (
        <footer className="footer">
            <div className="columns">
                <div className="column">
                    <Logo />
                </div>
                <div className="column">
                    <p>Contáctenos hoy mismo para programar una consulta gratuita y descubra cómo SOLFIR puede ayudarlo a alcanzar sus metas financieras. Estamos ansiosos de trabajar con usted para brindarle la solución financiera que necesita. ¡Hable con nosotros hoy mismo!</p>
                </div>
                <div className="column">
                    {
                        SITE_LINKS.map(({ link, label }, idx) => {
                            return (<Link key={idx} className="menu-links-item" activeClassName="menu-links-item-active" to={link}>{label}</Link>)
                        })
                    }
                </div>
            </div>
            <div className="social">
                {socialData.map(({ name, link }, idx) => {
                    return (
                        <a key={idx} className="icon" href={link}>
                            <Icon key={idx} name={name} size={48} variant="dark"></Icon>
                        </a>
                    );
                })}

            </div>
            <small className="trademark">Solfir Colombia SAS ® 2023</small>
        </footer>
    )
}