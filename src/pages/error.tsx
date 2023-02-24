import { Button, Layout } from '@components';
import { CONTACT_DATA, SITE_LINKS, STATIC_SITE_LABELS, STATIC_SITE_LINKS } from '@constants';
import { Link } from 'gatsby';
import React from 'react';
import "./error.scss";


const Thanks: React.FC<any> = () => {

    const BASE_CLASS = 'error';

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <div className={`${BASE_CLASS}-wrapper`} >
                    <div className={`${BASE_CLASS}-message-box`} >
                        <span className={`${BASE_CLASS}-message-box-title`}>Ha ocurrido un error :(</span>
                        <span className={`${BASE_CLASS}-message-box-text`} >
                            Si el error es persistente contactanos al siguiente correo electronico - 
                            <a className={`${BASE_CLASS}-message-box-text-mail`} href={`mailto:${CONTACT_DATA.CONTACT_MAIL_SUPPORT}`}> {CONTACT_DATA.CONTACT_MAIL_SUPPORT} </a>
                        </span>
                        <Link className={`${BASE_CLASS}-message-box-back`} to={STATIC_SITE_LINKS.HOME}>{`Volver al ${STATIC_SITE_LABELS.HOME}`}</Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Thanks;