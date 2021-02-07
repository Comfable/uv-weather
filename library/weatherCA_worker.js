if (!self.document) {
  // console.log("Worker Thread - WeatherCA");
  importScripts(
    "./library/tXml.min.js",
    "./library/moment.js",
    "./library/moment-timezone-with-data-10-year-range.js",
    "./library/util.js",
    "./library/papaparse.js",
    "./library/weatherCA.js"
  );
}
