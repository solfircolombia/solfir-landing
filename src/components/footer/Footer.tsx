import * as React from "react";
import { Link } from "gatsby";

import { Logo, Icon } from "@components";
import { IconName } from "@types";
import "./footer.scss";
import { SITE_LINKS, CONTACT_DATA } from "@constants";


export const Footer: React.FC = () => {

    const BASE_CLASS = "footer";

    const socialData: Array<{ name: IconName, link: string }> = [
        { name: "instagram", link: "https://instagram.com/solfircolombia" },
        { name: "facebook", link: "https://facebook.com" },
        { name: "linkedin", link: "https://www.linkedin.com/in/solfir-colombia-80663a267/" },
        { name: "twitter", link: "https://twitter.com/solfircolombia" }
    ];

    return (
        <footer className={BASE_CLASS}>
            <div className={`${BASE_CLASS}-wrapper`}>
                <span className={`${BASE_CLASS}-logo`}>
                    <Logo />
                </span>
                <div className={`${BASE_CLASS}-columns`}>
                    <div className={`${BASE_CLASS}-columns-column contact-info`}>
                        <span className={`${BASE_CLASS}-columns-column-title`}>Datos de contacto</span>
                        <br />
                            <a className={`${BASE_CLASS}-link`} href={`mailto:${CONTACT_DATA.CONTACT_MAIL}`}>
                                <Icon name="mail" className={`${BASE_CLASS}-link-icon`} variant="primary"></Icon>
                                {CONTACT_DATA.CONTACT_MAIL}
                            </a>
                            <a className={`${BASE_CLASS}-link`} href={`tel:${CONTACT_DATA.CONTACT_PHONE}`}>
                                <Icon name="phone" className={`${BASE_CLASS}-link-icon`} variant="primary"></Icon>
                                {CONTACT_DATA.CONTACT_PHONE}
                            </a>

                            <a className={`${BASE_CLASS}-link`} href={CONTACT_DATA.CONTACT_ADDRESS_MAPS_LINK}>
                                <Icon name="place" className={`${BASE_CLASS}-link-icon`} variant="primary"></Icon>
                                {CONTACT_DATA.CONTACT_ADDRESS}
                            </a>
                    </div>
                    <div className={`${BASE_CLASS}-columns-column links`}>
                    <span  className={`${BASE_CLASS}-columns-column-title`}>Enlaces</span>
                    <br />
                        {
                            SITE_LINKS.map(({ link, label }, idx) => {
                                return (<Link key={idx} className="footer-link" activeClassName="footer-link-active" to={link}>{label}</Link>)
                            })
                        }
                    </div>
                </div>
                <div className="social">
                <span className="social-title">Visitanos en nuestras redes sociales</span>
                <div className="social-icons">
                    {socialData.map(({ name, link }, idx) => {
                        return (
                            <a key={idx} className="social-icons-icon tooltip" href={link}>
                                <span className="tooltiptext">{name.toLocaleUpperCase()}</span>
                                <Icon key={idx} name={name} variant="primary"></Icon>
                            </a>
                        );
                    })}

                </div>
                </div>
                
                <span className="trademark">{` SOLFIR Colombia SAS © Todos los derechos reservados | ${new Date().getFullYear()}`}  </span>
            </div>

        </footer>
    )
}