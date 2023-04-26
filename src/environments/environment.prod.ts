import { credentialsFirebase } from "credentials";

export const environment = {
  production: true,
  firebase: {
    firebase: {
      apiKey: credentialsFirebase.credentials.apiKey,
      authDomain: credentialsFirebase.credentials.authDomain,
      projectId: credentialsFirebase.credentials.projectId,
      storageBucket: credentialsFirebase.credentials.storageBucket,
      messagingSenderId: credentialsFirebase.credentials.messagingSenderId,
      appId: credentialsFirebase.credentials.appId,
      measurementId: credentialsFirebase.credentials.measurementId
    }
  }
};
