import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import firebaseConfig from "./firebaseConfig.json";

firebase.initializeApp(firebaseConfig);

export { firebase };
