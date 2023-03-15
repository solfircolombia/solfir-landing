import React from 'react';
import { HeadFC, Link, PageProps } from 'gatsby';
import { Layout, SEO } from '@components';
import { STATIC_SITE_LABELS, STATIC_SITE_LINKS } from '@constants';
import './servicios.scss';

const ThanksPage: React.FC<PageProps> = () => {
    const BASE_CLASS = 'gracias';

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <div className={`${BASE_CLASS}-wrapper`}>
                    <div className={`${BASE_CLASS}-message-box`}>
                        <span className={`${BASE_CLASS}-message-box-title`}>Servicios</span>
                        <span className={`${BASE_CLASS}-message-box-text`}>
                            Esta pagina aun se encuentra en construcción
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

export default ThanksPage;

export const Head: HeadFC = () => <SEO title={STATIC_SITE_LABELS.SERVICES} />;
