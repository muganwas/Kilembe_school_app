import Firebase from 'react-native-firebase';

const base = Firebase.initializeApp({
    apiKey: "AIzaSyA4zij7rbvF6xgubGTYtFYoQcgOALqwQ8s",
    authDomain: "kilembe-school.firebaseapp.com",
    databaseURL: "https://kilembe-school.firebaseio.com",
    projectId: "kilembe-school",
    storageBucket: "kilembe-school.appspot.com",
    messagingSenderId: "576509237424"
});
export default base;