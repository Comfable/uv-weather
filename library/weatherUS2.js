// console.log("us");

function weatherUS2(latlong, citys, resolve) {
  lat = latlong.split(",")[0];
  lng = latlong.split(",")[1];

  const optionsUS = {
    method: "GET",
    headers: {
      Accept: "application/vnd.noaa.dwml+json;version=1",
      "User-Agent": "uvweather.net (info@uvweather.net)",
    },
  };

  fetchWithTimeout(
    `https://www.uvw.workers.dev/?https://forecast.weather.gov/MapClick.php?lat=${lat}&lon=${lng}&unit=0&lg=english&FcstType=digitalDWML`,
    optionsUS,
    3500
  )
    .then((resp) => resp.text())
    .then(function (resultUS2) {
      chrome.storage.local.set({
        failedHTTP: "0",
      });
      failedHTTP = "0";
      const srcDOMJsonUS = txml.simplify(txml.parse(resultUS2), "simplify");
      if (srcDOMJsonUS.dwml.data.parameters.hasOwnProperty("temperature")) {
        if (
          srcDOMJsonUS.dwml.data.parameters.temperature[2].hasOwnProperty(
            "value"
          )
        ) {
          usHourlyTempXML =
            srcDOMJsonUS.dwml.data.parameters.temperature[2].value;
          // console.log(JSON.stringify(srcDOMJsonUS.dwml.data.parameters));
          // console.log("US-1");
          // console.log("us-result");
          if (
            typeof usHourlyTempXML !== "undefined" &&
            usHourlyTempXML.length >= 47
          ) {
            temperatureFbadge = Math.round(parseFloat(usHourlyTempXML[0]));
            temperatureCbadge = Math.round(
              (parseFloat(usHourlyTempXML[0]) - 32) / 1.8
            );
          } else {
            throw Error();
          }
        } else {
          throw Error();
        }
      } else {
        throw Error();
      }

      // chrome.storage.local.get(["badgeSize"], function (data) {
      //   if (data.badgeSize == 0) {
      fetchWithTimeout(
        `https://www.uvw.workers.dev/?https://forecast.weather.gov/MapClick.php?lat=${lat}&lon=${lng}&unit=0&lg=english&FcstType=json`,
        optionsUS,
        3500
      )
        .then(CheckError)
        .then(function (resultUS2) {
          chrome.storage.local.set({
            failedHTTP: "0",
          });
          failedHTTP = "0";
          // console.log(JSON.stringify(resultUS2));
          // console.log("US-2");
          utcSystemTime = new Date(new Date().toUTCString()).toISOString();
          updateTimeBadge = toTimestamp(utcSystemTime);

          if (resultUS2.currentobservation.hasOwnProperty("Weather")) {
            summaryBadge = resultUS2.currentobservation.Weather;
            summaryMinutely = summaryBadge;
          } else {
            summaryBadge = "NA";
          }

          if (resultUS2.currentobservation.hasOwnProperty("Weatherimage")) {
            iconUrlUS = resultUS2.currentobservation.Weatherimage;
            if (
              iconUrlUS !== "NA" &&
              iconUrlUS !== null &&
              iconUrlUS !== "" &&
              iconUrlUS !== "NULL"
            ) {
              iconUS = iconUrlUS.split(".")[0].replace(/[0-9]/g, "");
            } else {
              iconUS = "NA";
            }
          } else {
            iconUS = "NA";
          }

          if (
            iconUS == "NULL" ||
            summaryBadge == "NULL" ||
            iconUS == "" ||
            summaryBadge == "" ||
            iconUS == null ||
            summaryBadge == null ||
            iconUS == "NA" ||
            summaryBadge == "NA"
          ) {
            throw Error();
          } else {
            chrome.storage.local.get(
              ["setSettingUT", "timeZoneBadge", "latlong"],
              function (data) {
                setSettingUT = data.setSettingUT;
                timeZoneBadge = parseFloat(data.timeZoneBadge);
                latlong = data.latlong;
                if (setSettingUT !== "u") {
                  solarNighDay(timeZoneBadge, latlong);
                  iconBadgeConvertUS(iconUS);
                  badgeGeneral(
                    isDay,
                    isNight,
                    sunnyDayBadge,
                    cloudyBadge,
                    rainyBadge,
                    snowyBadge,
                    temperatureFbadge,
                    temperatureCbadge,
                    updateTimeBadge,
                    citys
                  );
                }
                // console.log("US-3");
              }
            );
            resolve && resolve(resultUS2);
          }
        })
        .catch(function (err) {
          // console.log("us err JSON " + err);
          chrome.storage.local.set({
            failedHTTP: "1",
          });
          failedHTTP = "1";
          chrome.storage.local.get("timeZoneBadge", function (data) {
            timeZoneBadge = data.timeZoneBadge;
            weatherNO(latlong, citys, timeZoneBadge, resolve);
          });
        });
      //   }
      // });
    })
    .catch(function (err) {
      // console.log("us err XML " + err);
      chrome.storage.local.set({
        failedHTTP: "1",
      });
      failedHTTP = "1";
      chrome.storage.local.get("timeZoneBadge", function (data) {
        timeZoneBadge = data.timeZoneBadge;
        weatherNO(latlong, citys, timeZoneBadge, resolve);
      });
    });
}
