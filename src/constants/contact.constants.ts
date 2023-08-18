const CONTACT_MAIL = 'contacto@solfir.com.co';
const CONTACT_MAIL_SUPPORT = 'andres.artunduaga@solfir.com.co';
const CONTACT_PHONE = '3008178461';
const CONTACT_ADDRESS = 'Calle 98 # 15-17 Oficina 301, Edificio Manhattan Center, Bogota DC';

// Use this web to generate the place id https://developers.google.com/maps/documentation/places/web-service/place-id
const CONTACT_ADDRESS_MAPS_LINK =
    'https://www.google.com/maps/place/EDIFICIO%E2%80%A2MANHATTAN.CENTER,+Cl.+98+%2315-17,+Localidad+de+Chapinero,+Bogot%C3%A1/@4.6830466,-74.0515491,17z/data=!3m1!4b1!4m6!3m5!1s0x8e3f9a9437b4fabd:0xc537c7c5276ae064!8m2!3d4.6830413!4d-74.0489688!16s%2Fg%2F11f3tvjv8m?entry=ttu';

const CONTACT_WHATSAPP_PHONE = `+57${CONTACT_PHONE}`;

// Use this web to encode message https://www.urlencoder.org/
const CONTACT_WHATSAPP_MESSAGE =
    'Hola%21%0A%0AEstoy%20interesado%20en%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20servicios%20de%20insolvencia%20y%20reorganizaci%C3%B3n%20que%20ofrece%20%2ASOLFIR%2A.%0A%0A%C2%BFPodr%C3%ADa%20proporcionarme%20m%C3%A1s%20detalles%20o%20programar%20una%20consulta%20para%20discutir%20mis%20opciones%3F%20Gracias%20por%20su%20tiempo.%0A%0AMuchas%20gracias%21%21';
const CONTACT_WHATSAPP_LINK = `https://wa.me/${CONTACT_WHATSAPP_PHONE}?text=${CONTACT_WHATSAPP_MESSAGE}`;

export {
    CONTACT_MAIL,
    CONTACT_MAIL_SUPPORT,
    CONTACT_PHONE,
    CONTACT_ADDRESS,
    CONTACT_ADDRESS_MAPS_LINK,
    CONTACT_WHATSAPP_MESSAGE,
    CONTACT_WHATSAPP_PHONE,
    CONTACT_WHATSAPP_LINK,
};
