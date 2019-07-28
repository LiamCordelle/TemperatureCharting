// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBAqGw72nlbgNNXw58tfcHv3-GPR84SEII",
  authDomain: "temperature-charting.firebaseapp.com",
  databaseURL: "https://temperature-charting.firebaseio.com",
  projectId: "temperature-charting",
  storageBucket: "temperature-charting.appspot.com",
  messagingSenderId: "23889261711",
  appId: "1:23889261711:web:bce4c34cec323ad6"
};

// Initialize Firebase
var app = firebase.initializeApp(firebaseConfig);
var db = firebase.firestore(app)

function jsonToCsv(json) {
  var csvOut = "";

  for (key in json) {
    csvOut += key + "," + parseFloat(json[key]) + "\n";
  }

  csvOut = csvOut.trim();

  return csvOut;
}

function redraw() {
  var data = db.collection("temperature_data").doc("temperatures").get().then(doc => {
    if (doc.exists) {
      var dataCsv = jsonToCsv(doc.data());
      var g = new Dygraph(
        document.getElementById("graph"),
        dataCsv,
        {
          ylabel: "Temperature (Celsius)",
          xlabel: "Time"
        }
      );

      processData(dataCsv);
    } else {
      console.error("Failed to get document!");
    }
  }).catch(error => {
    console.error("Error getting document: ", error);
  });
}

function processData(data) {
  var rows = data.split("\n")

  var min = 100;
  var max = -100;
  var total = 0;
  var count = 0;
  var temperature = NaN;

  // Start at 1 to skip the header row
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i]
    if (row.indexOf(",") == -1) continue;

    temperature = parseFloat(row.split(",")[1]);

    if (temperature < min) {
      min = temperature;
    }
    if (temperature > max) {
      max = temperature;
    }

    total += temperature;
    count++;
  }

  document.getElementById("currentTemp").innerHTML = temperature;
  document.getElementById("maxTemp").innerHTML = max;
  document.getElementById("minTemp").innerHTML = min;
  document.getElementById("averageTemp").innerHTML = total/count;
}

window.onload = redraw
