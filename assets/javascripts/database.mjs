// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHsSywCBteFjpDB17-U5ybw7h9Z7fqH90",
  authDomain: "librarybookstore-18d1d.firebaseapp.com",
  databaseURL: "https://librarybookstore-18d1d-default-rtdb.firebaseio.com",
  projectId: "librarybookstore-18d1d",
  storageBucket: "librarybookstore-18d1d.appspot.com",
  messagingSenderId: "1022924136425",
  appId: "1:1022924136425:web:a92b3941c05040757e3578",
  measurementId: "G-639VETNJQ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const dataBase = getDatabase(app);

export default dataBase;