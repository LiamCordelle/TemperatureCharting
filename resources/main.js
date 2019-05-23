function redraw() {
  var g = new Dygraph(
    document.getElementById("graph"),
    "http://192.168.1.13:8082/data"
  );

  processData();
}

function processData() {
  fetch("http://192.168.1.13:8082/data").then(response => {
    var rows = response.split("\n")

    var min = 100;
    var max = -100;
    var total = 0;
    var count = 0;

    for (var i = 0; i < rows.length; i++) {
      var temperature = rows[i].split(",")[1];

      if (temperature < min) {
        min = temperature;
      }
      if (temperature > max) {
        max = temperature;
      }

      total += temperature;
      count++;
    }

    document.getElementById("maxTemp").value = max;
    document.getElementById("minTemp").value = min;
    document.getElementById("averageTemp").value = total/count;
  });
}

window.onload = redraw
