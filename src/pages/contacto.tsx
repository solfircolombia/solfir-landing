import { Button, Layout } from '@components';
import { STATIC_SITE_LABELS } from '@constants';
import { HeadFC } from 'gatsby';
import React from 'react';
import './contacto.scss';

const Contacto: React.FC<any> = () => {
    const BASE_CLASS = 'contact';

    return (
        <Layout>
            <div className={BASE_CLASS}>
                <div className={`${BASE_CLASS}-header`}>
                    <div className={`${BASE_CLASS}-wrapper`}>
                        <h1>
                            ¿Necesitas una consulta?
                            <br />
                            Envianos un mensaje
                        </h1>
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
                                        htmlFor="subject"
                                    >
                                        Motivo de la consulta:
                                    </label>
                                    <input
                                        className={`${BASE_CLASS}-form-box-form-group-input`}
                                        name="subject"
                                        id="subject"
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
                                        name="text"
                                        id="text"
                                        required
                                    />
                                </div>
                                <div className={`${BASE_CLASS}-form-box-form-group`}>
                                    <Button
                                        className={`${BASE_CLASS}-form-box-form-group-submit`}
                                        type="submit"
                                        variant="secondary"
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

export const Head: HeadFC = () => <title>SOLFIR - {STATIC_SITE_LABELS.CONTACT}</title>;
