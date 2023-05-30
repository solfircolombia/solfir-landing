import * as React from 'react';
import { Link } from 'gatsby';
import { Logo, Icon } from '@components';
import { SITE_LINKS, CONTACT_DATA, SOCIAL_LINKS, CREDIT_LINKS } from '@constants';
import './footer.scss';

export const Footer: React.FC = () => {
    const BASE_CLASS = 'footer';

    return (
        <footer className={BASE_CLASS}>
            <div className={`${BASE_CLASS}-wrapper`}>
                <span className={`${BASE_CLASS}-logo`}>
                    <Logo variant="primary" />
                </span>
                <div className={`${BASE_CLASS}-columns`}>
                    <div className={`${BASE_CLASS}-columns-column`}>
                        <span className={`${BASE_CLASS}-columns-column-title`}>
                            Datos de contacto
                        </span>
                        <br />
                        <div className="contact-info">
                            <span className="contact-info-title">
                                <Icon
                                    name="mail"
                                    className="contact-info-title-icon"
                                    variant="light"
                                ></Icon>
                                Correo electrónico
                            </span>
                            <a
                                className={`${BASE_CLASS}-link contact-info-link`}
                                href={`mailto:${CONTACT_DATA.CONTACT_MAIL}`}
                            >
                                {CONTACT_DATA.CONTACT_MAIL}
                            </a>
                        </div>

                        <div className="contact-info">
                            <span className="contact-info-title">
                                <Icon
                                    name="phone"
                                    className="contact-info-title-icon"
                                    variant="light"
                                ></Icon>
                                Teléfono
                            </span>
                            <a
                                className={`${BASE_CLASS}-link contact-info-link`}
                                href={`tel:${CONTACT_DATA.CONTACT_PHONE}`}
                            >
                                {CONTACT_DATA.CONTACT_PHONE}
                            </a>
                        </div>

                        <div className="contact-info">
                            <span className="contact-info-title">
                                <Icon
                                    name="place"
                                    className="contact-info-title-icon"
                                    variant="light"
                                ></Icon>
                                Ubicación
                            </span>
                            <a
                                className={`${BASE_CLASS}-link contact-info-link`}
                                href={CONTACT_DATA.CONTACT_ADDRESS_MAPS_LINK}
                            >
                                {CONTACT_DATA.CONTACT_ADDRESS}
                            </a>
                        </div>
                    </div>
                    <div className={`${BASE_CLASS}-columns-column links`}>
                        <span className={`${BASE_CLASS}-columns-column-title`}>Enlaces</span>
                        <br />
                        {SITE_LINKS.map(({ link, label }, idx) => {
                            return (
                                <Link
                                    key={idx}
                                    className="footer-link"
                                    activeClassName="footer-link-active"
                                    to={link}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
                <div className="social">
                    <span className="social-title">Visitanos en nuestras redes sociales</span>
                    <div className="social-icons">
                        {SOCIAL_LINKS.map(({ name, link }, idx) => {
                            return (
                                <a
                                    key={idx}
                                    className="social-icons-icon tooltip"
                                    href={link}
                                    aria-label={`Click aqui para ir a nuestra cuenta de ${name}`}
                                >
                                    <span className="tooltiptext tooltiptext--tertiary">
                                        {name.toLocaleUpperCase()}
                                    </span>
                                    <Icon key={idx} name={name} variant="secondary"></Icon>
                                </a>
                            );
                        })}
                    </div>
                </div>

                <span className="trademark">
                    <span>
                        {`SOLFIR - Soluciones financieras y reorganizaciones S.A.S © Todos los derechos reservados | ${new Date().getFullYear()}`}{' '}
                    </span>
                </span>

                <span className="credits">
                    {CREDIT_LINKS.map((credit) => {
                        return (
                            <span>
                                {credit.role}{' '}
                                <a href={credit.link} target="_blank" rel="noopener noreferrer">
                                    {credit.label}
                                </a>
                            </span>
                        );
                    })}
                </span>
            </div>
        </footer>
    );
};
