const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors");
const handler = cors({ origin: true });

// Inicializar Firebase Admin SDK
admin.initializeApp();

// Configurar el transporter con las credenciales de Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

exports.sendEmail = functions.https.onRequest((req, res) => {
  cors()(req, res, async () => {
    const { name, lastName, email, password, role, message, url } = req.body;
    // Validar los datos recibidos
    if (
      !name ||
      !lastName ||
      !email ||
      !password ||
      !message ||
      !role ||
      !url
    ) {
      const response = { message: "Faltan datos" };
      cors()(req, res, () => {
        res.status(400).json(response);
      });
      return;
    }

    if (role === "admin") {
      const codeHtml = `
      <html>
  <head>
    <style>
    .logo {
      display: block;
      width: 70px;
      height: auto;
      margin: 20px;
      display: inline-block; 
      vertical-align: middle;
    }
    .button {
      background-color: #663399;
      border-radius: 4px;
      color: #ffffff !important;
      display: inline-block;
      font-size: 16px;
      font-weight: bold;
      padding: 12px 24px;
      text-decoration: none;
    }

    .password-box {
      border: 1px solid #cccccc;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 20px;
      font-size: 16px;
      line-height: 1.5;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
    }
    .password-label {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 5px;
      display: block;
    }
    </style>
  </head>
  <body style="background-color: #f5f5f5; font-family: sans-serif;">
    <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse; border: 1px solid #cccccc;">
      <tr>
       <td style="padding: 40px 20px; text-align: center; background-color: #663399; vertical-align: middle;">
  <img class="logo" src="https://firebasestorage.googleapis.com/v0/b/nutricionistas-proyecto.appspot.com/o/logo%2Flogo.webp?alt=media&token=d7d62f7f-5b2b-4a93-8c65-6d0e684dc467" alt="Logo">
  <h1 style="color: #ffffff; font-size: 28px; margin-top: 0;">¡Bienvenido ${name} a WebSavvy!</h1>
</td>

      </tr>
      <tr>
        <td style="padding: 20px;">
          <p style="font-size: 16px; line-height: 1.5;">Gracias por unirte a WebSavvy. Estamos muy contentos de tenerte en nuestra comunidad.</p>
          <p style="font-size: 16px; line-height: 1.5;">Para completar tu registro, presiona el botón de abajo y coloca la contraseña provisional:</p>
          <input class="password-box" type="text" name="password" id="password" value="${password}" readonly>
          <p style="text-align: center;">
            <a href="https://www.nutricionistas.websavvy.cl" class="button">Terminar Registro</a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; background-color: #f1f1f1; text-align: center;">
          <p style="color: #666666; font-size: 14px; margin-top: 0;">Si tienes algún problema o pregunta, por favor contáctanos en contacto@websavvy.cl</p>
        </td>
      </tr>
    </table>
  </body>
</html>
      `;
      const mailOptions = {
        from: {
          name: "WebSavvy",
          address: functions.config().gmail.email,
        },
        to: email,
        subject: `¡Gracias por utilizar WebSavvy!`,
        html: codeHtml,
      };

      // Enviar el correo electrónico usando Nodemailer
      try {
        await transporter.sendMail(mailOptions);
        const response = { message: "Correo enviado" };
        cors()(req, res, () => {
          res.status(200).json(response);
        });
      } catch (error) {
        const response = { message: "Error al enviar el correo" };
        cors()(req, res, () => {
          res.status(500).json(response);
        });
      }
    }
  });
});

// exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
//   const email = user.email;

//   // Obtener el documento del usuario desde Firestore
//   return admin
//     .firestore()
//     .collection("users")
//     .doc(user.uid)
//     .get()
//     .then((doc) => {
//       const user = doc.data();
//       // Verificar si el usuario tiene el rol de 'admin'
//       if (user.role === "admin") {
//         const mailOptions = {
//           from: functions.config().gmail.email,
//           to: email,
//           subject: `Welcome to MyApp, ${user.name} ${user.lastName}!`,
//           text: `Welcome to MyApp, ${user.name} ${user.lastName}. Thank you for joining us!`,
//         };

//         // Enviar el correo electrónico usando Nodemailer
//         return transporter
//           .sendMail(mailOptions)
//           .then(() => {
//             console.log("Email sent successfully");
//             return null;
//           })
//           .catch((error) => {
//             console.log(error);
//             return null;
//           });
//       } else {
//         console.log("User is not an admin, email not sent.");
//         return null;
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       return null;
//     });
// });
