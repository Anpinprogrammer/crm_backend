import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const { email, nombre, token } = datos;
      //Enviar email
      const info = await transport.sendMail({
          from: 'CRM - Pineda Motors',
          to: email,
          subject: 'Confirma tu cuenta en CRM',
          text: 'Confirma tu cuenta en CRM',
          html: `<p>Hola: ${nombre}, confirma tu cuenta en CRM.</p>
                <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>

                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
                `
      });

      console.log("Mensaje enviado: %s", info.messageId);
}

export default emailRegistro;