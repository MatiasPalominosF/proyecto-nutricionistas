import { credentials } from "credentials";

export const environment = {
  production: true,
  firebase: {
    apiKey: credentials.firebase.apiKey,
    authDomain: credentials.firebase.authDomain,
    projectId: credentials.firebase.projectId,
    storageBucket: credentials.firebase.storageBucket,
    messagingSenderId: credentials.firebase.messagingSenderId,
    appId: credentials.firebase.appId,
    measurementId: credentials.firebase.measurementId
  },
  apiUrl: credentials.apiUrl,
};
