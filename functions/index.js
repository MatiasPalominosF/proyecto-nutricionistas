const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

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

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const email = user.email;
  const displayName = user.displayName;
  console.log("email: " + email);
  console.log("email: " + displayName);

  // Obtener el documento del usuario desde Firestore
  return admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .get()
    .then((doc) => {
      const userRole = doc.data().role;
      console.log(doc.data());
      console.log("userRole ", userRole);
      // Verificar si el usuario tiene el rol de 'admin'
      if (userRole === "admin") {
        const mailOptions = {
          from: functions.config().gmail.email,
          to: email,
          subject: `Welcome to MyApp, ${displayName}!`,
          text: `Welcome to MyApp, ${displayName}. Thank you for joining us!`,
        };

        // Enviar el correo electrónico usando Nodemailer
        return transporter
          .sendMail(mailOptions)
          .then(() => {
            console.log("Email sent successfully");
            return null;
          })
          .catch((error) => {
            console.log(error);
            return null;
          });
      } else {
        console.log("User is not an admin, email not sent.");
        return null;
      }
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
});
