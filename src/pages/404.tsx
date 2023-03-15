import React from 'react';
import { HeadFC, Link, PageProps } from 'gatsby';
import { Layout, SEO } from '@components';
import { STATIC_SITE_LABELS, STATIC_SITE_LINKS } from '@constants';
import { Utils } from '@shared';
import './404.scss';

const NotFoundPage: React.FC<PageProps> = () => {
    const BASE_CLASS = 'pagina-no-encontrada';

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <div className={`${BASE_CLASS}-wrapper`}>
                    <div className={`${BASE_CLASS}-message-box`}>
                        <span className={`${BASE_CLASS}-message-box-title`}>
                            Pagina no encontrada
                        </span>
                        <span className={`${BASE_CLASS}-message-box-text`}>
                            Lo siento, la página que estas buscando no existe
                        </span>
                        <Link
                            className={`${BASE_CLASS}-message-box-back`}
                            to={STATIC_SITE_LINKS.HOME}
                        >{`Volver al ${STATIC_SITE_LABELS.HOME}`}</Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default NotFoundPage;

export const Head: HeadFC = () => <SEO {...Utils.getSEOProps(STATIC_SITE_LINKS.CONTACT)} />;
