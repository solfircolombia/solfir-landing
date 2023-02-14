import * as React from "react";
import { Logo, Icon } from "@components";
import "./footer.scss";
import { IconName } from "../Icon/IconPaths";
import { Link } from "gatsby";


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
                    <Logo/>
                </div>
                <div className="column">
                    <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">Quienes somos</Link>
                    <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">Equipo de trabajo</Link>
                    <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">Contactanos</Link>
                    <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">Blog</Link>
                    <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">Servicios</Link>
                    <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">FAQ</Link>
                    <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">Beneficios</Link>
                    <Link className="menu-links-item" activeClassName="menu-links-item-active" to="/quienes-somos">Login</Link>
                </div>
                <div className="column">
                    <p>Contáctenos hoy mismo para programar una consulta gratuita y descubra cómo SOLFIR puede ayudarlo a alcanzar sus metas financieras. Estamos ansiosos de trabajar con usted para brindarle la solución financiera que necesita. ¡Hable con nosotros hoy mismo!</p>
                </div>
            </div>
            <div className="social">
                {socialData.map(({ name, link }) => {
                    return (
                        <a className="icon" href={link}>
                            <Icon name={name} size={48} color="white" ></Icon>
                        </a>
                    );
                })}

            </div>
            <small className="trademark">Solfir Colombia SAS ® 2023</small>
        </footer>
    )
}