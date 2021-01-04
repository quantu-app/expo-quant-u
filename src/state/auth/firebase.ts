import firebase from "firebase";
import "firebase/auth";
import firebaseConfig from "./firebaseConfig.json";

firebase.initializeApp(firebaseConfig);

export { firebase };
