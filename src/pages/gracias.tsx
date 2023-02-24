import { Button, Layout } from '@components';
import { SITE_LINKS, STATIC_SITE_LABELS, STATIC_SITE_LINKS } from '@constants';
import { Link } from 'gatsby';
import React from 'react';
import "./gracias.scss";


const Thanks: React.FC<any> = () => {

    const BASE_CLASS = 'gracias';

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <div className={`${BASE_CLASS}-wrapper`} >
                    <div className={`${BASE_CLASS}-message-box`} >
                        <span className={`${BASE_CLASS}-message-box-title`}>¡Gracias por contactarnos!</span>
                        <span className={`${BASE_CLASS}-message-box-text`} >Pronto nos estaremos comunicando contigo</span>
                        <Link className={`${BASE_CLASS}-message-box-back`} to={STATIC_SITE_LINKS.HOME}>{`Volver al ${STATIC_SITE_LABELS.HOME}`}</Link>
                    </div>
                </div>
            </div>
            </Layout>
    );
}

export default Thanks;