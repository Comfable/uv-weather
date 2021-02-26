if (!self.document) {
  // console.log("Worker Thread - background");

  importScripts(
    "./library/tz.js",
    "./library/tXml.min.js",
    "./library/moment.js",
    "./library/moment-timezone-with-data-10-year-range.js",
    "./library/util.js",
    "./library/papaparse.js",
    "./library/suncalc.js",
    "./library/acc.js",
    "./library/weatherNO.js",
    "./library/weatherCA.js",
    "./library/weatherUS2.js"
  );

  chrome.storage.local.get(["verUpdate"], function (data) {
    verUpdate = data.verUpdate;
    if (verUpdate !== 1 && verUpdate !== 2) {
      fetch("https://ipinfo.io/?token=6d819142de4288")
        .then((resp) => resp.json())
        .then(function (result) {
          if (typeof JSON.stringify(result.error) == "undefined") {
            countryAPI = JSON.stringify(result.country);
            country = countryAPI.split('"')[1];
            if (country == "ZZ") {
              country = " ";
            }
            city = JSON.stringify(result.city);
            cityName =
              city.split('"')[1].charAt(0).toUpperCase() +
              city.split('"')[1].slice(1);
            if (cityName && cityName.length > 15) {
              citys = cityName.substr(0, 15);
            } else {
              citys = cityName;
            }
            region = JSON.stringify(result.region).split('"')[1];
            latandlong = JSON.stringify(result.loc);
            latlong = latandlong.split('"')[1];
            fullname =
              city.split('"')[1].charAt(0).toUpperCase() +
              city.split('"')[1].slice(1) +
              ", " +
              region.toUpperCase() +
              ", " +
              country;
            timezone = JSON.stringify(result.timezone).split('"')[1];
            timeZoneBadge = timezone2offset(timezone);

            chrome.storage.local.set({
              timeZoneBadge: timeZoneBadge,
            });

            chrome.storage.local.set({
              citys: citys,
            });
            chrome.storage.local.set({
              latlong: latlong,
            });
            chrome.storage.local.set({
              country: country,
            });
            chrome.storage.local.set({
              fullname: fullname,
            });
            chrome.storage.local.set({
              verUpdate: 1,
            });
            chrome.storage.local.set({
              firstTimePopup: 0,
            });
            chrome.storage.local.set({
              badgeSize: "1",
            });
            badgeTemp(latlong, citys, country, timeZoneBadge);
          } else {
            defaultCity();
          }
        })
        .catch(function (err) {
          defaultCity();
        });
    }

    function defaultCity() {
      city = '"New York"';
      citys = "New York";
      latandlong = '"40.713,-74.0072"';
      latlong = "40.713,-74.0072";
      timezone = "America/New_York";
      timeZoneBadge = timezone2offset("America/New_York");
      country = "US";

      chrome.storage.local.set({
        timeZoneBadge: timeZoneBadge,
      });

      chrome.storage.local.set({
        citys: "New York",
      });
      chrome.storage.local.set({
        latlong: "40.713,-74.0072",
      });
      chrome.storage.local.set({
        country: "US",
      });
      chrome.storage.local.set({
        fullname: "New York, NY, US",
      });
      chrome.storage.local.set({
        verUpdate: 1,
      });
      chrome.storage.local.set({
        firstTimePopup: 0,
      });
      chrome.storage.local.set({
        badgeSize: "1",
      });
      badgeTemp(latlong, citys, country, timeZoneBadge);
    }
  });

  chrome.runtime.onStartup.addListener(function (details) {
    chrome.storage.local.get(
      [
        "latlong",
        "country",
        "setSettingUT",
        "citys",
        "timeZoneBadge",
        "setSettingUT",
      ],
      function (data) {
        latlong = data.latlong;
        country = data.country;
        citys = data.citys;
        timeZoneBadge = data.timeZoneBadge;
        setSettingUT = data.setSettingUT;
        if (data.setSettingUT == "u") {
          badgeUV(latlong, citys, country, timeZoneBadge);
        } else {
          badgeTemp(latlong, citys, country, timeZoneBadge);
        }
      }
    );
  });

  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "update") {
      chrome.storage.local.get(
        [
          "latlong",
          "country",
          "citys",
          "city",
          "windUnit",
          "timeZoneBadge",
          "setSettingUT",
        ],
        function (data) {
          if (typeof data.citys !== "undefined" && data.citys !== "undefined") {
            citys = data.citys;
          } else {
            city = data.city;
            citys =
              city.split('"')[1].charAt(0).toUpperCase() +
              city.split('"')[1].slice(1);
            chrome.storage.local.set({
              citys: citys,
            });
          }

          latlong = data.latlong;
          country = data.country;
          timeZoneBadge = data.timeZoneBadge;
          setSettingUT = data.setSettingUT;

          if (latlong.includes('"')) {
            latlong = latlong.split('"')[1];
            chrome.storage.local.set({
              latlong: latlong,
            });
          }

          if (data.setSettingUT == "u") {
            badgeUV(latlong, citys, country, timeZoneBadge);
          } else {
            badgeTemp(latlong, citys, country, timeZoneBadge);
          }

          windUnit = data.windUnit;
          if (typeof windUnit == "undefined") {
            if (
              country == "US" ||
              country == "us" ||
              country == "United States of America"
            ) {
              chrome.storage.local.set({
                windUnit: "mph",
              });
            } else if (
              country == "CA" ||
              country == "ca" ||
              country == "Canada"
            ) {
              chrome.storage.local.set({
                windUnit: "kmh",
              });
            } else {
              chrome.storage.local.set({
                windUnit: "ms",
              });
            }
          }
        }
      );
    }
  });

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.msg == "intervalUpdateMessage") {
      intervalUpdateFunction();
    }
  });

  function intervalUpdateFunction() {
    chrome.storage.local.get(
      ["IntervalUpdate", "setSettingUT"],
      function (data) {
        intervalUpdateNumber = data.IntervalUpdate;
        if (typeof intervalUpdateNumber == "undefined") {
          var intervalUpdateNumber = 60;
          chrome.storage.local.set({
            IntervalUpdate: "60",
          });
        }
        chrome.alarms.create("intervalUpdateTimes", {
          delayInMinutes: 0.05,
          periodInMinutes: parseInt(intervalUpdateNumber),
        });

        chrome.alarms.onAlarm.addListener((alarm) => {
          chrome.storage.local.get(
            [
              "latlong",
              "country",
              "setSettingUT",
              "citys",
              "timeZoneBadge",
              "setSettingUT",
            ],
            function (data) {
              latlong = data.latlong;
              country = data.country;
              citys = data.citys;
              timeZoneBadge = data.timeZoneBadge;
              setSettingUT = data.setSettingUT;

              if (data.setSettingUT == "u") {
                badgeUV(latlong, citys, country, timeZoneBadge);
              } else {
                badgeTemp(latlong, citys, country, timeZoneBadge);
              }
            }
          );
        });
      }
    );
  }
  intervalUpdateFunction();

  function badgeTemp(latlong, citys, country, timeZoneBadge) {
    if (!self.document) {
      if (country == "CA" || country == "ca" || country == "Canada") {
        weatherCA(latlong, citys);
      } else if (
        country == "US" ||
        country == "us" ||
        country == "United States of America"
      ) {
        weatherUS2(latlong, citys);
      } else {
        weatherNO(latlong, citys, timeZoneBadge);
      }
    }
  }

  function badgeUV(latlong, citys, country, timeZoneBadge) {
    weatherNO(latlong, citys, timeZoneBadge);
  }

  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
      var uninstallWebAddress =
        "https://uvweather.net/goodbye" +
        "?" +
        chrome.runtime.getManifest().version +
        "-" +
        getChromeVersion().pieces[1];
      var installWebAddress = "https://uvweather.net/welcome/";
      chrome.tabs.create({
        url: installWebAddress,
      });
      if (chrome.runtime.setUninstallURL) {
        chrome.storage.local.clear();
        chrome.runtime.setUninstallURL(uninstallWebAddress);
      }
    }
  });
}
