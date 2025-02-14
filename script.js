import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔥 Firebase Configuration
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

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// **🔥 Fetch Last 50 Results from Firebase**
async function fetchResultsFromFirebase() {
  try {
    const snapshot = await get(ref(database, "results"));
    if (snapshot.exists()) {
      let allResults = Object.values(snapshot.val());
      let last50Results = allResults.slice(-50); // 🔥 Last 50 results only
      console.log("Fetched Last 50 Results:", last50Results);
      return last50Results;
    } else {
      console.warn("No data found in Firebase.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching Firebase data:", error);
    return [];
  }
}

// **🔥 Smart Pattern Recognition for Prediction**
function predictNextResult(resultList) {
  if (resultList.length === 0) return null;

  let numberSequence = [];
  let colorSequence = [];

  // Extract numbers & colors
  resultList.forEach(({ number, colour }) => {
    numberSequence.push(Number(number));
    colorSequence.push(colour);
  });

  // **🔥 Deep Pattern Analysis**
  let predictedNumber = advancedNumberPrediction(numberSequence);
  let predictedColor = advancedColorPrediction(colorSequence);

  console.log("Predicted Number:", predictedNumber);
  console.log("Predicted Color:", predictedColor);

  return { predictedNumber, predictedColor };
}

// **🔥 Advanced Number Prediction (AI-like Smart Pattern Learning)**
function advancedNumberPrediction(sequence) {
  if (sequence.length < 2) return sequence[sequence.length - 1] || 0;

  // 🔥 Step 1: Detect Common Patterns (Repetition, Trends)
  let diffs = [];
  for (let i = 1; i < sequence.length; i++) {
    diffs.push(sequence[i] - sequence[i - 1]);
  }

  let commonDiff = mode(diffs); // Most common difference
  let predictedNumber = sequence[sequence.length - 1] + commonDiff;

  // 🔥 Step 2: Ensure Number is within 0-9 Range
  if (predictedNumber < 0 || predictedNumber > 9) {
    predictedNumber = mostFrequent(sequence); // Default to most frequent number
  }

  return predictedNumber;
}

// **🔥 Advanced Color Prediction Using Probability Trends**
function advancedColorPrediction(sequence) {
  if (sequence.length === 0) return "Unknown";

  let lastColor = sequence[sequence.length - 1];
  let freq = {};

  // Count occurrences in last 10 results
  sequence.slice(-10).forEach(color => freq[color] = (freq[color] || 0) + 1);

  // 🔥 Predict Most Frequent Recent Color
  return Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
}

// **🔥 Utility Functions for Pattern Recognition**
function mode(arr) {
  let freq = {};
  arr.forEach(num => freq[num] = (freq[num] || 0) + 1);
  return Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? Number(a) : Number(b));
}

function mostFrequent(arr) {
  let freq = {};
  arr.forEach(num => freq[num] = (freq[num] || 0) + 1);
  return Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? Number(a) : Number(b));
}

// **🔥 Update Table with Last 50 Results**
function updateResults(resultList) {
  const historyTable = document.getElementById("recentResults");
  historyTable.innerHTML = ""; 

  resultList.forEach(({ issueNumber, number, colour }) => {
    const row = document.createElement("tr");

    const issueCell = document.createElement("td");
    issueCell.textContent = issueNumber;
    issueCell.classList.add("px-4", "py-2");
    row.appendChild(issueCell);

    const colourCell = document.createElement("td");
    colourCell.textContent = colour;
    colourCell.classList.add("px-4", "py-2");
    row.appendChild(colourCell);

    const numberCell = document.createElement("td");
    numberCell.textContent = number;
    numberCell.classList.add("px-4", "py-2");
    row.appendChild(numberCell);

    historyTable.appendChild(row);
  });
}

// **🔥 Display Prediction**
function updatePrediction(prediction) {
  const predictionDiv = document.getElementById("prediction");
  if (prediction) {
    predictionDiv.innerHTML = `
      <p><strong>Predicted Number:</strong> ${prediction.predictedNumber}</p>
      <p><strong>Predicted Color:</strong> ${prediction.predictedColor}</p>
    `;
  } else {
    predictionDiv.innerHTML = "<p>No Prediction Available</p>";
  }
}

// **🔥 Fetch & Update Data Every Minute**
async function fetchResultsAndUpdate() {
  const resultList = await fetchResultsFromFirebase();
  updateResults(resultList);  // ✅ Table update
  const prediction = predictNextResult(resultList);
  updatePrediction(prediction);  // ✅ Prediction update
}

fetchResultsAndUpdate();
setInterval(fetchResultsAndUpdate, 60000);
