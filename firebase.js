// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-GGlLu7ZlyIq5AddsZ4XXQP9rg5wd1Mk",
  authDomain: "prediction-43b41.firebaseapp.com",
  databaseURL: "https://prediction-43b41-default-rtdb.firebaseio.com",
  projectId: "prediction-43b41",
  storageBucket: "prediction-43b41.appspot.com",
  messagingSenderId: "1093967509116",
  appId: "1:1093967509116:web:9c9310d59e8b8fb1b3bbf9",
  measurementId: "G-B25RK39ZXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Fetch previous results from Firebase
async function fetchResultsFromFirebase() {
  try {
    const snapshot = await get(ref(database, "results"));
    if (snapshot.exists()) {
      return Object.values(snapshot.val()); // Convert object to array
    } else {
      console.warn("No data found in Firebase.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching Firebase data:", error);
    return [];
  }
}

// Export functions for use in other scripts
export { fetchResultsFromFirebase };
