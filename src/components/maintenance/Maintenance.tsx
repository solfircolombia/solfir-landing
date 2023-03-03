import * as React from 'react';
import { Icon, Loader, Settings, Logo } from '@components';
import { SOCIAL_LINKS } from '@constants';
import './maintenance.scss';

export const Maintenance: React.FC<React.PropsWithChildren> = ({ children }) => {
    const BASE_CLASS = 'maintenance';

    return (
        <main className={BASE_CLASS}>
            <div className={`${BASE_CLASS}-logo`}>
                <Logo variant="regular" />
            </div>
            <div className={`${BASE_CLASS}-message`}>
                Página en construccion
                <div className={`${BASE_CLASS}-message-loader`}>
                    <Loader fill="primary" />
                </div>
            </div>

            <div className={`${BASE_CLASS}-social`}>
                <span className={`${BASE_CLASS}-social-message`}>
                    Mientras tanto puedes visitarnos en nuestras redes sociales
                </span>
                <div className={`${BASE_CLASS}-social-icons`}>
                    {SOCIAL_LINKS.map(({ name, link }, idx) => {
                        return (
                            <a
                                key={idx}
                                className={`${BASE_CLASS}-social-icons-icon tooltip`}
                                href={link}
                            >
                                <span className="tooltiptext tooltiptext">
                                    {name.toLocaleUpperCase()}
                                </span>
                                <Icon key={idx} name={name} variant="primary"></Icon>
                            </a>
                        );
                    })}
                </div>
            </div>
            <Settings></Settings>
        </main>
    );
};
