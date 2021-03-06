var db = firebase.firestore()

function jsonToCsv(json) {
  var csvOut = "";

  for (key in json) {
    var dataPair = json[key];
    csvOut += dataPair["timestamp"] + "," + parseFloat(dataPair["temperature"]) + "\n";
  }

  return csvOut;
}

function redraw() {
  setAllLoading();
  db.collection("temperature_data_v3").get().then(allDocuments => {
    var resultingCsv = "Time,Temperature\n";
    allDocuments.forEach(doc => {
      resultingCsv += jsonToCsv(doc.data());
    });

    resultingCsv = resultingCsv.trim();

    var g = new Dygraph(
      document.getElementById("graph"),
      resultingCsv,
      {
        ylabel: "Temperature (Celsius)",
        xlabel: "Time"
      }
    );
    processData(resultingCsv);
  }).catch(error => {
    console.error("Error getting temperature data: ", error);
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
  document.getElementById("averageTemp").innerHTML = total / count;
}

function setAllLoading() {
  document.getElementById("currentTemp").innerHTML = "Loading...";
  document.getElementById("maxTemp").innerHTML = "Loading...";
  document.getElementById("minTemp").innerHTML = "Loading...";
  document.getElementById("averageTemp").innerHTML = "Loading...";
}

window.onload = redraw
