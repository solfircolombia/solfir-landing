import type { APIRoute } from 'astro';
import {
    SENDGRID_API_KEY,
    SENDGRID_AUTHORIZED_DOMAIN_EMAIL,
    SENDGRID_AUTHORIZED_EMAIL,
    SENDGRID_CONTACT_REQUEST_TEMPLATE_ID,
    SOLFIR_CONTACT_REQUEST_EMAIL,
} from 'astro:env/server';
import sgMail from '@sendgrid/mail';

export const prerender = false;

const MAX_LENGTH = {
    clientName: 200,
    clientPhone: 40,
    clientEmail: 200,
    clientMessage: 5000,
    clientService: 80,
} as const;

function field(form: FormData, name: keyof typeof MAX_LENGTH): string {
    return String(form.get(name) ?? '').trim();
}

function json(message: string, status: number): Response {
    return new Response(JSON.stringify({ message }), {
        status,
        headers: { 'content-type': 'application/json' },
    });
}

export const POST: APIRoute = async ({ request, redirect }) => {
    const templateId = SENDGRID_CONTACT_REQUEST_TEMPLATE_ID;
    const apiKey = SENDGRID_API_KEY;
    const fromEmail = SENDGRID_AUTHORIZED_DOMAIN_EMAIL || SENDGRID_AUTHORIZED_EMAIL;
    const toEmail = SOLFIR_CONTACT_REQUEST_EMAIL;

    if (!templateId) {
        return json('TEMPLATE_ID not defined', 500);
    }
    if (!apiKey || !fromEmail || !toEmail) {
        console.error('Contact form is missing SendGrid configuration.');
        return redirect('/error/', 303);
    }

    let form: FormData;
    try {
        form = await request.formData();
    } catch (error) {
        console.error('Contact form body could not be read.', error);
        return redirect('/error/', 303);
    }

    const clientName = field(form, 'clientName');
    const clientPhone = field(form, 'clientPhone');
    const clientEmail = field(form, 'clientEmail');
    const clientMessage = field(form, 'clientMessage');
    const clientService = field(form, 'clientService');

    if (!clientName || !clientPhone || !clientEmail || !clientMessage) {
        return redirect('/error/', 303);
    }
    if (
        clientName.length > MAX_LENGTH.clientName ||
        clientPhone.length > MAX_LENGTH.clientPhone ||
        clientEmail.length > MAX_LENGTH.clientEmail ||
        clientMessage.length > MAX_LENGTH.clientMessage ||
        clientService.length > MAX_LENGTH.clientService ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)
    ) {
        return redirect('/error/', 303);
    }

    sgMail.setApiKey(apiKey);

    try {
        await sgMail.send({
            from: { email: fromEmail, name: 'SOLFIR - Página de contacto' },
            to: toEmail,
            templateId,
            dynamicTemplateData: {
                name: clientName,
                message: clientMessage,
                phone: clientPhone,
                email: clientEmail,
                service: clientService,
            },
        });
        return redirect('/gracias/', 303);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown error';
        console.error('SendGrid contact request failed.', message);
        return redirect('/error/', 303);
    }
};

export const GET: APIRoute = () => json('Try with POST method', 405);
