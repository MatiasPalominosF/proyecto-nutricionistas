// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { credentialsFirebase } from "credentials";

export const environment = {
  production: false,
  firebase: {
    apiKey: credentialsFirebase.credentials.apiKey,
    authDomain: credentialsFirebase.credentials.authDomain,
    projectId: credentialsFirebase.credentials.projectId,
    storageBucket: credentialsFirebase.credentials.storageBucket,
    messagingSenderId: credentialsFirebase.credentials.messagingSenderId,
    appId: credentialsFirebase.credentials.appId,
    measurementId: credentialsFirebase.credentials.measurementId
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
