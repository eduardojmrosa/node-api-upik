import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
 //firestore credentials
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
