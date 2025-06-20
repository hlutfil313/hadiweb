// firebase-init.js
const firebaseConfig = {
  apiKey: "AIzaSyCpHD70iXNTfCezzvMMDbAjcgac4x_Tlcg",
  authDomain: "unieats-project-f64b0.firebaseapp.com",
  projectId: "unieats-project-f64b0",
  storageBucket: "unieats-project-f64b0.firebasestorage.app",
  messagingSenderId: "486520548874",
  appId: "1:486520548874:web:464390622f85231d6579f3",
  measurementId: "G-LV55N4KCJC"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
window.db = firebase.firestore(); 