import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby';

const sendgrid = require('@sendgrid/mail');

//Your API Key from Sendgrid
const apiKey = process.env.SENDGRID_API_KEY || '';
sendgrid.setApiKey(apiKey);

const message: any = {
    //Your authorized email from SendGrid
    from: 'andres@solfir.com.co',
    to: 'andres.artunduaga@outlook.com',
};

const handler = (req: GatsbyFunctionRequest, res: GatsbyFunctionResponse) => {
    try {
        if (req.method !== 'POST') {
            res.json({ message: 'Try with POST method' });
        }

        if (req.body) {
            // message.to = req.body.clientName
            // message.to = req.body.clientEmail
            // message.to = req.body.phoneNumber
            message.subject = req.body.subject;
            message.text = req.body.text;
            message.html = req.body.text;
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

// module.exports = handler

export default handler;
