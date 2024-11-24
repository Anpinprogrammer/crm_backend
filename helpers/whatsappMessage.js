import twilio from 'twilio';

const mensaje = async (datos) => {

    const client = twilio(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

    const { numero, admin } = datos;

    const toWhatsapp = `whatsapp:+57${numero}`;

    try {
        const message = await client.messages.create({
            body: `Has sido agregado a la base de datos de la familia Pineda Motor's, te ha agregado ${admin}`,
            from: process.env.FROMWHATSAPP,
            to: toWhatsapp
        });
        console.log('Mensaje enviado:', message.sid);
    } catch (error) {
        console.log(error);
    }
};

export default mensaje;

