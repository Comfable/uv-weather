if (!self.document) {
  // console.log("Worker Thread - WeatherUS");
  importScripts(
    "./library/moment.js",
    "./library/moment-timezone-with-data-10-year-range.js",
    "./library/util.js",
    "./library/acc.js",
    "./library/weatherUS2.js"
  );
}
