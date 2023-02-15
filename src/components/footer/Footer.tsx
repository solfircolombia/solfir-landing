import * as React from "react";
import { Link } from "gatsby";

import { Logo, Icon } from "@components";
import { IconName } from "@types";
import "./footer.scss";
import { SITE_LINKS, CONTACT_DATA } from "@constants";


export const Footer: React.FC = () => {

    const socialData: Array<{ name: IconName, link: string }> = [
        { name: "facebook", link: "https://facebook.com" },
        { name: "instagram", link: "https://instagram.com" },
        { name: "linkedin", link: "https://linkedin.com" },
        { name: "whatsapp", link: "https://whatsapp.com" },
    ]

    return (
        <footer className="footer">
            <div className="wrapper">
                <span className="footer-logo">
                    <Logo />
                </span>
                <div className="columns">
                    <div className="column contact-info">
                        <span className="column-title">Datos de contacto</span>
                        <br />
                        <span className="contact-info-item">
                            <Icon name="mail" className="contact-info-item-icon" variant="primary"></Icon>
                            <a className="footer-link" href={`mailto:${CONTACT_DATA.CONTACT_MAIL}`}>{CONTACT_DATA.CONTACT_MAIL}</a>
                        </span>
                        <span className="contact-info-item">
                            <Icon name="phone" className="contact-info-item-icon" variant="primary"></Icon>
                            <a className="footer-link" href={`tel:${CONTACT_DATA.CONTACT_PHONE}`}>{CONTACT_DATA.CONTACT_PHONE}</a>
                        </span>
                        <span className="contact-info-item">
                            <Icon name="place" className="contact-info-item-icon" variant="primary"></Icon>
                            <a className="footer-link" href="https://goo.gl/maps/UZ9S8g1y32B8voN9A">{CONTACT_DATA.CONTACT_ADDRESS}</a>
                        </span>
                    </div>
                    <div className="column links">
                    <span className="column-title">Enlaces</span>
                    <br />
                        {
                            SITE_LINKS.map(({ link, label }, idx) => {
                                return (<Link key={idx} className="links-item footer-link" activeClassName="footer-link-active" to={link}>{label}</Link>)
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