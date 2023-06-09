// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { credentials } from "credentials";

export const environment = {
  production: false,
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
