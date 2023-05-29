import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { Layout, SEO } from '@components';
import { STATIC_SITE_LINKS } from '@constants';
import { Utils } from '@shared';
import './quienes-somos.scss';

const AboutPage: React.FC<PageProps> = (props) => {
    const BASE_CLASS = 'about';

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <div className={`${BASE_CLASS}-header`}>
                    <div className={`${BASE_CLASS}-wrapper`}>
                        <span className={`${BASE_CLASS}-header-title`}>Quienes somos</span>
                    </div>
                </div>

                <div className={`${BASE_CLASS}-wrapper`}>
                    <p>
                        Bienvenido a SOLFIR, su solución de servicios financieros para la
                        insolvencia y la reorganización. Como expertos en finanzas y reorganización
                        empresarial, estamos dedicados a brindar soluciones efectivas y
                        personalizadas para aquellos que enfrentan desafíos financieros.
                    </p>
                    <p>
                        Ofrecemos una amplia gama de servicios, incluyendo asesoramiento sobre
                        insolvencia, reorganización empresarial, y servicios financieros en general.
                        Nuestro equipo de profesionales experimentados trabaja de cerca con nuestros
                        clientes para comprender sus situaciones únicas y desarrollar un plan de
                        acción que se adapte a sus necesidades y objetivos.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default AboutPage;

export const Head: HeadFC = () => <SEO {...Utils.getSEOProps(STATIC_SITE_LINKS.ABOUT)} />;
