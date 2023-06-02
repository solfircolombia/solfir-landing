import React, { useState } from 'react';
import { HeadFC, Link, PageProps, graphql, navigate } from 'gatsby';
import { Button, Card, Icon, Layout, SEO, Modal, Logo } from '@components';
import { SITE_LINKS, STATIC_SITE_LABELS, STATIC_SITE_LINKS } from '@constants';
import { Utils } from '@shared';
import './servicios.scss';
import { IconName } from '@types';

const ServicesPage = ({ data }: PageProps<Queries.ServicesPageQuery>) => {
    const BASE_CLASS = 'servicios';

    const SERVICES: { serviceIcon: IconName; serviceName: string; serviceText: string }[] =
        data.allContentfulService.edges.map(({ node }) => ({
            serviceIcon: (node.icon as IconName) || '',
            serviceName: node.title || '',
            serviceText: node.description?.description || '',
        }));

    let [openedModal, setOpenedModal] = useState(false);
    let [modalContent, setModalContent] = useState<React.ReactNode>(null);

    const onClickReadMore = (s: {
        serviceIcon: IconName;
        serviceName: string;
        serviceText: string;
    }) => {
        setModalContent(
            <div className="service-modal-content">
                <span className="service-modal-content-title">{s.serviceName}</span>
                <p className="service-modal-content-text">{s.serviceText}</p>
                <p className="service-modal-content-contact">
                    ¿Deseas saber mas sobre este servicio?
                </p>
                <Button
                    className="service-modal-content-contact-btn"
                    variant="primary"
                    size="small"
                    onClick={() => {
                        navigate(STATIC_SITE_LINKS.CONTACT);
                    }}
                >
                    Contáctanos
                </Button>
                <span className="service-modal-content-gap"></span>
            </div>
        );
        setOpenedModal(true);
    };

    const onCloseModal = () => {
        setOpenedModal(!openedModal);
    };

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <div className={`${BASE_CLASS}-header`}>
                    <div className={`${BASE_CLASS}-wrapper`}>
                        <span className={`${BASE_CLASS}-header-title`}>
                            Conoce nuestros servicios
                        </span>
                    </div>
                </div>
                <div className={`${BASE_CLASS}-wrapper`}>
                    <div className={`card-wrapper`}>
                        {SERVICES.map((s) => {
                            return (
                                <Card key={s.serviceName} customClasses="service-card">
                                    <span className="service-card-icon">
                                        <Icon name={s.serviceIcon} size={48}></Icon>
                                    </span>
                                    <span className="service-card-title">{s.serviceName}</span>
                                    <Button
                                        className="service-card-button"
                                        size="small"
                                        onClick={() => {
                                            onClickReadMore(s);
                                        }}
                                    >
                                        Leer Mas
                                    </Button>
                                </Card>
                            );
                        })}
                    </div>
                </div>
                {openedModal && (
                    <Modal
                        ariaLabel="Ventana modal menu"
                        onCloseModal={onCloseModal}
                        customClass="service-modal"
                    >
                        {modalContent}
                    </Modal>
                )}
            </div>
        </Layout>
    );
};

export const query = graphql`
    query ServicesPage {
        allContentfulService {
            edges {
                node {
                    icon
                    title
                    description {
                        description
                    }
                }
            }
        }
    }
`;

export default ServicesPage;

export const Head: HeadFC = () => <SEO {...Utils.getSEOProps(STATIC_SITE_LINKS.SERVICES)} />;
