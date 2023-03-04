import { MailData } from '@sendgrid/helpers/classes/mail';
import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby';

const sendgrid = require('@sendgrid/mail');

//Your API Key from Sendgrid
const apiKey = process.env.SENDGRID_API_KEY || '';
sendgrid.setApiKey(apiKey);

const FROM_EMAIL =
    process.env.SENDGRID_AUTHORIZED_DOMAIN_EMAIL ||
    process.env.SENDGRID_AUTHORIZED_EMAIL ||
    'solfircolombia@outlook.com';
const TO_EMAIL = process.env.SOLFIR_CONTACT_REQUEST_EMAIL || 'solfircolombia@outlook.com';
const TEMPLATE_ID = process.env.SENDGRID_CONTACT_REQUEST_TEMPLATE_ID;

const message: MailData = {
    from: {
        email: FROM_EMAIL,
        name: 'SOLFIR - Página de contacto',
    },
    to: TO_EMAIL,
};

const getDynamicTemplateData = (req: GatsbyFunctionRequest) => {
    if (req.body) {
        return {
            name: req.body.clientName,
            message: req.body.clientMessage,
            phone: req.body.clientPhone,
            email: req.body.clientEmail,
            service: req.body.clientService,
        };
    }
};

const handler = (req: GatsbyFunctionRequest, res: GatsbyFunctionResponse) => {
    try {
        if (req.method !== 'POST') {
            res.json({ message: 'Try with POST method' });
        }

        if (req.body && TEMPLATE_ID) {
            (message.templateId = TEMPLATE_ID),
                (message.dynamicTemplateData = getDynamicTemplateData(req));
        } else {
            res.json({ message: 'TEMPLATE_ID not defined' });
        }

        return sendgrid.send(message).then(
            () => {
                res.redirect('/gracias');
            },
            (error: any) => {
                console.error(error);
                if (error.response) {
                    res.redirect('/error');
                }
                res.redirect('/error');
            }
        );
    } catch (err) {
        console.error(err);
        res.redirect('/error');
    }
};

export default handler;
