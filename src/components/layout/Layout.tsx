import * as React from 'react';
import { Footer, Header, Icon, Settings, Maintenance } from '@components';
import { CONTACT_DATA } from '@constants';
import '@contentful/live-preview/style.css';
import './layout.scss';

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
    const MAINTENANCE = process.env.MAINTENANCE || false;

    return (
        <main className="layout" id="layout">
            {/* {MAINTENANCE && <Maintenance />} */}
            {!MAINTENANCE && (
                <>
                    <Header></Header>
                    <div className="content">{children}</div>
                    <Footer></Footer>
                    <a
                        className="bubble"
                        target="_blank"
                        href={CONTACT_DATA.CONTACT_WHATSAPP_LINK}
                        aria-label="Click aqui para abrir un chat con uno de nuestros asesores"
                    >
                        <Icon className="icon" name="whatsapp" fill="white"></Icon>
                    </a>
                </>
            )}

            <Settings></Settings>
        </main>
    );
};
