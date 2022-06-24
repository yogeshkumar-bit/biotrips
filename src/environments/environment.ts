// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // API_URL: 'http://3.86.242.27:3000',
  // API_URL: 'https://biotrips.in/api',
  // API_URL: 'http://13.59.12.157:7000/api',
  //  API_URL: 'http://localhost:7000/api',
  API_URL: 'https://dev.api.biotrips.in/api/',
  SOCKET_URL: 'https://dev-api.biotrips.in/api',
  firebaseConfig: {
    apiKey: "AIzaSyBqKT7NzcuLHNs59_b8j30lKUtRJuV6BQ0", 
    authDomain: "biotrips2.firebaseapp.com",
    databaseURL: "https://biotrips2.firebaseio.com",
    projectId: "biotrips2",
    storageBucket: "biotrips2.appspot.com",
    messagingSenderId: "359713064233",
    appId: "1:359713064233:web:1f45c016ad47529e"
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
