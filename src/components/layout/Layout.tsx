import * as React from 'react';
import { useLocation } from '@reach/router';
import { Footer, Header, Icon, Settings, Maintenance } from '@components';
import { CONTACT_DATA } from '@constants';
import './layout.scss';
import { Utils } from '@shared';

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
    const MAINTENANCE = process.env.MAINTENANCE || false;

    const location = useLocation();

    const [isScrolled, setIsScrolled] = React.useState(false);

    const useTransparentHeader = location.pathname === '/' && !isScrolled;

    console.log('useTransparentHeader', useTransparentHeader);

    React.useEffect(() => {
        window.addEventListener('scroll', Utils.handleScroll(setIsScrolled));
        return () => {
            window.removeEventListener('scroll', Utils.handleScroll(setIsScrolled));
        };
    }, []);

    const BASE_CLASS = 'layout';

    return (
        <main className={`${BASE_CLASS}`} id="layout">
            {/* {MAINTENANCE && <Maintenance />} */}
            {!MAINTENANCE && (
                <>
                    <Header setBgTransparent={useTransparentHeader}></Header>
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
