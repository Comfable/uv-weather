if (!self.document) {
  // console.log("Worker Thread - util");
  importScripts(
    "./library/moment.js",
    "./library/moment-timezone-with-data-10-year-range.js",
    "./library/tz.js",
    "./library/suncalc.js",
    "./library/util.js"
  );
}
