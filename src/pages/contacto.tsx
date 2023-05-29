import React from 'react';
import { HeadFC } from 'gatsby';
import { Button, Layout, SEO } from '@components';
import { STATIC_SITE_LINKS } from '@constants';
import { Utils } from '@shared';
import './contacto.scss';

const Contacto: React.FC<any> = () => {
    const BASE_CLASS = 'contact';

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <div className={`${BASE_CLASS}-header`}>
                    <div className={`${BASE_CLASS}-wrapper`}>
                        <span className={`${BASE_CLASS}-header-title`}>Envianos un mensaje</span>
                    </div>
                </div>

                <div className={`${BASE_CLASS}-form-section`}>
                    <div className={`${BASE_CLASS}-wrapper`}>
                        <div className={`${BASE_CLASS}-form-box`}>
                            <form
                                className={`${BASE_CLASS}-form-box-form`}
                                action="/api/sendgrid"
                                method="POST"
                            >
                                <span className={`${BASE_CLASS}-form-box-title`}>
                                    Por favor ingrese los siguientes datos
                                </span>
                                <div className={`${BASE_CLASS}-form-box-form-group`}>
                                    <label
                                        className={`${BASE_CLASS}-form-box-form-group-label`}
                                        htmlFor="service"
                                    >
                                        Selecciona el servicio que requieres:
                                    </label>
                                    <select
                                        className={`${BASE_CLASS}-form-box-form-group-select`}
                                        name="clientService"
                                        defaultValue={''}
                                        id="service"
                                    >
                                        <option value="" disabled hidden>
                                            Selecciona un servicio
                                        </option>
                                        <option value="Insolvencia">
                                            Insolvencia de persona natural no comerciante
                                        </option>
                                        <option value="Reorganizacion">
                                            Reorganización Empresarial
                                        </option>
                                        <option value="Liquidacion">Liquidacion Patrimonial</option>
                                        <option value="Otro">Otros Servicios</option>
                                    </select>
                                </div>
                                <div className={`${BASE_CLASS}-form-box-form-group`}>
                                    <label
                                        className={`${BASE_CLASS}-form-box-form-group-label`}
                                        htmlFor="name"
                                    >
                                        Nombre:
                                    </label>
                                    <input
                                        className={`${BASE_CLASS}-form-box-form-group-input`}
                                        name="clientName"
                                        id="name"
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className={`${BASE_CLASS}-form-box-form-group`}>
                                    <label
                                        className={`${BASE_CLASS}-form-box-form-group-label`}
                                        htmlFor="phone"
                                    >
                                        Teléfono de contacto:
                                    </label>
                                    <input
                                        className={`${BASE_CLASS}-form-box-form-group-input`}
                                        name="clientPhone"
                                        id="phone"
                                        type="tel"
                                        required
                                    />
                                </div>
                                <div className={`${BASE_CLASS}-form-box-form-group`}>
                                    <label
                                        className={`${BASE_CLASS}-form-box-form-group-label`}
                                        htmlFor="email"
                                    >
                                        Correo electronico de contacto:
                                    </label>
                                    <input
                                        className={`${BASE_CLASS}-form-box-form-group-input`}
                                        name="clientEmail"
                                        id="email"
                                        type="email"
                                        required
                                    />
                                </div>
                                <div className={`${BASE_CLASS}-form-box-form-group`}>
                                    <label
                                        className={`${BASE_CLASS}-form-box-form-group-label`}
                                        htmlFor="text"
                                    >
                                        Mensaje:
                                    </label>
                                    <textarea
                                        className={`${BASE_CLASS}-form-box-form-group-textarea`}
                                        name="clientMessage"
                                        id="text"
                                        required
                                    />
                                </div>
                                <div className={`${BASE_CLASS}-form-box-form-group`}>
                                    <Button
                                        className={`${BASE_CLASS}-form-box-form-group-submit`}
                                        type="submit"
                                        variant="primary"
                                    >
                                        Enviar Mensaje
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Contacto;

export const Head: HeadFC = () => <SEO {...Utils.getSEOProps(STATIC_SITE_LINKS.CONTACT)} />;
