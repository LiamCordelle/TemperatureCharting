function redraw() {
  var g = new Dygraph(
    document.getElementById("graph"),
    "http://192.168.1.13:8082/data",
    {
      ylabel: "Temperature (Celsius)",
      xlabel: "Time"
    }
  );

  processData();
}

function processData() {
  fetch("http://192.168.1.13:8082/data").then(response => {
    return response.text();
  }).then(data => {
    var rows = data.split("\n")

    var min = 100;
    var max = -100;
    var total = 0;
    var count = 0;

    // Start at 1 to skip the header row
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i]
      if (row.indexOf(",") == -1) continue;

      var temperature = parseFloat(row.split(",")[1]);

      if (temperature < min) {
        min = temperature;
      }
      if (temperature > max) {
        max = temperature;
      }

      total += temperature;
      count++;
    }

    document.getElementById("maxTemp").innerHTML = max;
    document.getElementById("minTemp").innerHTML = min;
    document.getElementById("averageTemp").innerHTML = total/count;
  });
}

window.onload = redraw
