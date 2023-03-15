import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { Layout, SEO } from '@components';
import { STATIC_SITE_LINKS } from '@constants';
import { Utils } from '@shared';
import './quienes-somos.scss';

const AboutPage: React.FC<PageProps> = (props) => {
    return (
        <Layout>
            <div className="about">
                <h1>Quienes somos</h1>
                <p>
                    Bienvenido a SOLFIR, su solución de servicios financieros para la insolvencia y
                    la reorganización. Como expertos en finanzas y reorganización empresarial,
                    estamos dedicados a brindar soluciones efectivas y personalizadas para aquellos
                    que enfrentan desafíos financieros.
                </p>
                <p>
                    Ofrecemos una amplia gama de servicios, incluyendo asesoramiento sobre
                    insolvencia, reorganización empresarial, y servicios financieros en general.
                    Nuestro equipo de profesionales experimentados trabaja de cerca con nuestros
                    clientes para comprender sus situaciones únicas y desarrollar un plan de acción
                    que se adapte a sus necesidades y objetivos.
                </p>
            </div>
        </Layout>
    );
};

export default AboutPage;

export const Head: HeadFC = () => <SEO {...Utils.getSEOProps(STATIC_SITE_LINKS.ABOUT)} />;
