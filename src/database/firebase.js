import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyA6_x_9i3KK-BTi12qKSV2vSuhPOAkPuwg",
  authDomain: "projeto-upik.firebaseapp.com",
  projectId: "projeto-upik",
  storageBucket: "projeto-upik.appspot.com",
  messagingSenderId: "1070574617560",
  appId: "1:1070574617560:web:95722bea975b826e7468ad",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
