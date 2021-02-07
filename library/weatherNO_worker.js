if (!self.document) {
  // console.log("Worker Thread - WeatherNO");
  importScripts(
    "./library/moment.js",
    "./library/moment-timezone-with-data-10-year-range.js",
    "./library/suncalc.js",
    "./library/util.js",
    "./library/acc.js",
    "./library/weatherNO.js"
  );
}
