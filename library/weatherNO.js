// console.log("no");

function weatherNO(latlong, citys, timeZoneBadge, resolve) {
  lat = latlong.split(",")[0];
  lng = latlong.split(",")[1];

  chrome.storage.local.get(
    ["country", "timeZoneBadge", "failedHTTP", "setSettingUT"],
    function (data) {
      country = data.country;
      failedHTTP = data.failedHTTP;
      setSettingUT = data.setSettingUT;
      country = data.country;

      if (
        country == "IR" ||
        country == "ir" ||
        country == "Iran" ||
        country == "iran"
      ) {
        corsAPI = "https://uvweather.herokuapp.com/";
      } else {
        corsAPI = "https://www.uvw.workers.dev/?";
      }

      const optionsNO = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "uvweather.net (info@uvweather.net)",
        },
      };

      fetchWithTimeout(
        `${corsAPI}https://api.met.no/weatherapi/locationforecast/2.0/?lat=${lat}&lon=${lng}`,
        optionsNO,
        4500
      )
        .then(CheckError)
        .then(function (resultNO) {
          if (self.document) {
            window.resultNO = resultNO;
          }
          chrome.storage.local.set({
            failedHTTP_NO: "0",
          });
          // console.log(JSON.stringify(resultNO));
          // console.log("no-result");
          utcSystemTime = new Date(new Date().toUTCString()).toISOString();
          updateTimeBadge = toTimestamp(utcSystemTime);

          tempCno = resultNO.properties.timeseries[0].data.instant.details.hasOwnProperty(
            "air_temperature"
          )
            ? resultNO.properties.timeseries[0].data.instant.details
                .air_temperature
            : "";
          if (
            tempCno !== "NA" &&
            tempCno !== "" &&
            tempCno !== null &&
            tempCno !== "NULL"
          ) {
            temperatureCbadgeNO = Math.round(parseFloat(tempCno));
            temperatureFbadgeNO = Math.round(parseFloat(tempCno) * 1.8 + 32);
          } else {
            throw Error();
          }

          iconNO = resultNO.properties.timeseries[0].data.next_1_hours.summary.hasOwnProperty(
            "symbol_code"
          )
            ? resultNO.properties.timeseries[0].data.next_1_hours.summary.symbol_code.split(
                "_"
              )[0]
            : "";
          if (
            iconNO !== "NA" &&
            iconNO !== "" &&
            iconNO !== null &&
            iconNO !== "NULL"
          ) {
            summaryBadgeNO = code2description_no(iconNO);
            summaryMinutelyNO = summaryBadgeNO;
          } else {
            throw Error();
          }

          cloudCoverNO = resultNO.properties.timeseries[0].data.instant.details.hasOwnProperty(
            "cloud_area_fraction"
          )
            ? resultNO.properties.timeseries[0].data.instant.details
                .cloud_area_fraction
            : "";
          if (
            cloudCoverNO !== "NA" &&
            cloudCoverNO !== "" &&
            cloudCoverNO !== null &&
            cloudCoverNO !== "NULL"
          ) {
            cloudCoverBadge = Math.round(cloudCoverNO);
          } else {
            throw Error();
          }

          dewPointCNO = resultNO.properties.timeseries[0].data.instant.details.hasOwnProperty(
            "dew_point_temperature"
          )
            ? resultNO.properties.timeseries[0].data.instant.details
                .dew_point_temperature
            : "";
          if (
            dewPointCNO !== "NA" &&
            dewPointCNO !== "" &&
            dewPointCNO !== null &&
            dewPointCNO !== "NULL"
          ) {
            dewPointC = Math.round(dewPointCNO);
            dewPointF = Math.round(c2f(dewPointCNO));
          } else {
            dewPointC = "-";
            dewPointF = "-";
          }

          humidityNO = resultNO.properties.timeseries[0].data.instant.details.hasOwnProperty(
            "relative_humidity"
          )
            ? resultNO.properties.timeseries[0].data.instant.details
                .relative_humidity
            : "";
          if (
            humidityNO !== "NA" &&
            humidityNO !== "" &&
            humidityNO !== null &&
            humidityNO !== "NULL"
          ) {
            humidity = Math.round(humidityNO);
          } else {
            humidityNO = "NA";
            humidity = "-";
          }

          pressureNO = resultNO.properties.timeseries[0].data.instant.details.hasOwnProperty(
            "air_pressure_at_sea_level"
          )
            ? resultNO.properties.timeseries[0].data.instant.details
                .air_pressure_at_sea_level
            : "";
          if (
            pressureNO !== "NA" &&
            pressureNO !== "" &&
            pressureNO !== null &&
            pressureNO !== "NULL"
          ) {
            pressure = Math.round(pressureNO);
          } else {
            pressure = "-";
          }

          windSpeedMSNO = resultNO.properties.timeseries[0].data.instant.details.hasOwnProperty(
            "wind_speed"
          )
            ? resultNO.properties.timeseries[0].data.instant.details.wind_speed
            : "";
          if (
            windSpeedMSNO !== "NA" &&
            windSpeedMSNO !== "" &&
            windSpeedMSNO !== null &&
            windSpeedMSNO !== "NULL"
          ) {
            windSpeedMS = Math.round(windSpeedMSNO * 10) / 10;
            windSpeedMPH = Math.round(windSpeedMSNO * 2.236937);
            windSpeedKMH = Math.round(windSpeedMSNO * 3.6);
          } else {
            windSpeedMS = "-";
            windSpeedMPH = "-";
            windSpeedKMH = "-";
          }

          windBearingNO = resultNO.properties.timeseries[0].data.instant.details.hasOwnProperty(
            "wind_from_direction"
          )
            ? resultNO.properties.timeseries[0].data.instant.details
                .wind_from_direction
            : "";
          if (
            windBearingNO !== "NA" &&
            windBearingNO !== "" &&
            windBearingNO !== null &&
            windBearingNO !== "NULL"
          ) {
            windBearing = Math.round(windBearingNO);

            if (
              windSpeedMSNO !== "NA" &&
              windSpeedMSNO !== "" &&
              windSpeedMSNO !== null &&
              windSpeedMSNO !== "NULL"
            ) {
              if (windSpeedMSNO > 0) {
                windCompass = degToCompass(windBearingNO);
              } else {
                windCompass = "-";
              }
            } else {
              windCompass = "-";
            }
          } else {
            windBearing = "-";
            windCompass = "-";
          }

          next_1_hours_precipitation_NO = resultNO.properties.timeseries[0].data.next_1_hours.details.hasOwnProperty(
            "precipitation_amount"
          )
            ? resultNO.properties.timeseries[0].data.next_1_hours.details
                .precipitation_amount
            : "";
          if (
            next_1_hours_precipitation_NO !== "NA" &&
            next_1_hours_precipitation_NO !== "" &&
            next_1_hours_precipitation_NO !== null &&
            next_1_hours_precipitation_NO !== "NULL"
          ) {
            precipProbability = next_1_hours_precipitation_NO;
            precipProbabilityUnit = "mm";
            if (precipProbability == "0") {
              precipProbability = "";
              precipProbabilityUnit = "No precipitation";
            }
          } else {
            next_1_hours_precipitation_NO = "NA";
            precipProbability = "-";
          }

          uvCurrentlyNO = resultNO.properties.timeseries[0].data.instant.details.hasOwnProperty(
            "ultraviolet_index_clear_sky"
          )
            ? resultNO.properties.timeseries[0].data.instant.details
                .ultraviolet_index_clear_sky
            : "";
          if (
            uvCurrentlyNO !== "NA" &&
            uvCurrentlyNO !== "" &&
            uvCurrentlyNO !== null &&
            uvCurrentlyNO !== "NULL"
          ) {
            if (cloudCoverNO !== "NA") {
              uv1 = Math.floor(uvCurrentlyNO * cloudAdjUV(cloudCoverBadge));
            } else {
              uv1 = Math.floor(uvCurrentlyNO);
            }
          } else {
            throw Error();
          }

          next_6_hours_tempC_max_NO = resultNO.properties.timeseries[0].data.next_6_hours.details.hasOwnProperty(
            "air_temperature_max"
          )
            ? resultNO.properties.timeseries[0].data.next_6_hours.details
                .air_temperature_max
            : "";
          if (
            next_6_hours_tempC_max_NO !== "NA" &&
            next_6_hours_tempC_max_NO !== "" &&
            next_6_hours_tempC_max_NO !== null &&
            next_6_hours_tempC_max_NO !== "NULL"
          ) {
            current_tempC_max = Math.round(next_6_hours_tempC_max_NO);
            current_tempF_max = Math.round(c2f(next_6_hours_tempC_max_NO));
          } else {
            current_tempC_max = "-";
          }

          next_6_hours_tempC_min_NO = resultNO.properties.timeseries[0].data.next_6_hours.details.hasOwnProperty(
            "air_temperature_min"
          )
            ? resultNO.properties.timeseries[0].data.next_6_hours.details
                .air_temperature_min
            : "";
          if (
            next_6_hours_tempC_min_NO !== "NA" &&
            next_6_hours_tempC_min_NO !== "" &&
            next_6_hours_tempC_min_NO !== null &&
            next_6_hours_tempC_min_NO !== "NULL"
          ) {
            current_tempC_min = Math.round(next_6_hours_tempC_min_NO);
            current_tempF_min = Math.round(c2f(next_6_hours_tempC_min_NO));
          } else {
            current_tempC_max = "-";
          }

          daily_uv_1 = [];
          daily_uv_2 = [];
          daily_uv_3 = [];
          daily_uv_4 = [];
          daily_uv_5 = [];
          daily_uv_6 = [];
          daily_uv_7 = [];

          daily_wind_dir_1 = [];
          daily_wind_dir_2 = [];
          daily_wind_dir_3 = [];
          daily_wind_dir_4 = [];
          daily_wind_dir_5 = [];
          daily_wind_dir_6 = [];
          daily_wind_dir_7 = [];

          daily_wind_speed_1 = [];
          daily_wind_speed_2 = [];
          daily_wind_speed_3 = [];
          daily_wind_speed_4 = [];
          daily_wind_speed_5 = [];
          daily_wind_speed_6 = [];
          daily_wind_speed_7 = [];

          daily_temp_1 = [];
          daily_temp_2 = [];
          daily_temp_3 = [];
          daily_temp_4 = [];
          daily_temp_5 = [];
          daily_temp_6 = [];
          daily_temp_7 = [];

          daily_icon_1 = [];
          daily_icon_2 = [];
          daily_icon_3 = [];
          daily_icon_4 = [];
          daily_icon_5 = [];
          daily_icon_6 = [];
          daily_icon_7 = [];

          solarNighDay(timeZoneBadge, latlong);

          daily_date_0 =
            moment(resultNO.properties.timeseries[0].time).unix() + offsetUnix;
          daily_date_1_DD = moment.unix(daily_date_0 + 86400 * 1).format("DD");
          daily_date_2_DD = moment.unix(daily_date_0 + 86400 * 2).format("DD");
          daily_date_3_DD = moment.unix(daily_date_0 + 86400 * 3).format("DD");
          daily_date_4_DD = moment.unix(daily_date_0 + 86400 * 4).format("DD");
          daily_date_5_DD = moment.unix(daily_date_0 + 86400 * 5).format("DD");
          daily_date_6_DD = moment.unix(daily_date_0 + 86400 * 6).format("DD");
          daily_date_7_DD = moment.unix(daily_date_0 + 86400 * 7).format("DD");

          resultNOlength = resultNO.properties.timeseries.length;
          for (i = 1; i <= resultNOlength - 1; i++) {
            if (
              moment
                .unix(
                  moment(resultNO.properties.timeseries[i].time).unix() +
                    offsetUnix
                )
                .format("DD") == daily_date_1_DD
            ) {
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty(
                "ultraviolet_index_clear_sky"
              )
                ? daily_uv_1.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .ultraviolet_index_clear_sky
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("wind_speed")
                ? daily_wind_speed_1.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .wind_speed
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("wind_from_direction")
                ? daily_wind_dir_1.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .wind_from_direction
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("air_temperature")
                ? daily_temp_1.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .air_temperature
                  )
                : "";
              if (
                resultNO.properties.timeseries[i].data.hasOwnProperty(
                  "next_1_hours"
                )
              ) {
                resultNO.properties.timeseries[
                  i
                ].data.next_1_hours.summary.hasOwnProperty("symbol_code")
                  ? daily_icon_1.push(
                      resultNO.properties.timeseries[
                        i
                      ].data.next_1_hours.summary.symbol_code.split("_")[0]
                    )
                  : "";
              } else {
                resultNO.properties.timeseries[
                  i
                ].data.next_6_hours.summary.hasOwnProperty("symbol_code")
                  ? daily_icon_1.push(
                      resultNO.properties.timeseries[
                        i
                      ].data.next_6_hours.summary.symbol_code.split("_")[0]
                    )
                  : "";
              }
            }
            if (
              moment
                .unix(
                  moment(resultNO.properties.timeseries[i].time).unix() +
                    offsetUnix
                )
                .format("DD") == daily_date_2_DD
            ) {
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty(
                "ultraviolet_index_clear_sky"
              )
                ? daily_uv_2.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .ultraviolet_index_clear_sky
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("wind_speed")
                ? daily_wind_speed_2.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .wind_speed
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("wind_from_direction")
                ? daily_wind_dir_2.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .wind_from_direction
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("air_temperature")
                ? daily_temp_2.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .air_temperature
                  )
                : "";
              if (
                resultNO.properties.timeseries[i].data.hasOwnProperty(
                  "next_1_hours"
                )
              ) {
                resultNO.properties.timeseries[
                  i
                ].data.next_1_hours.summary.hasOwnProperty("symbol_code")
                  ? daily_icon_2.push(
                      resultNO.properties.timeseries[
                        i
                      ].data.next_1_hours.summary.symbol_code.split("_")[0]
                    )
                  : "";
              } else {
                resultNO.properties.timeseries[
                  i
                ].data.next_6_hours.summary.hasOwnProperty("symbol_code")
                  ? daily_icon_2.push(
                      resultNO.properties.timeseries[
                        i
                      ].data.next_6_hours.summary.symbol_code.split("_")[0]
                    )
                  : "";
              }
            }
            if (
              moment
                .unix(
                  moment(resultNO.properties.timeseries[i].time).unix() +
                    offsetUnix
                )
                .format("DD") == daily_date_3_DD
            ) {
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty(
                "ultraviolet_index_clear_sky"
              )
                ? daily_uv_3.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .ultraviolet_index_clear_sky
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("wind_speed")
                ? daily_wind_speed_3.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .wind_speed
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("wind_from_direction")
                ? daily_wind_dir_3.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .wind_from_direction
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("air_temperature")
                ? daily_temp_3.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .air_temperature
                  )
                : "";
              if (
                resultNO.properties.timeseries[i].data.hasOwnProperty(
                  "next_1_hours"
                )
              ) {
                resultNO.properties.timeseries[
                  i
                ].data.next_1_hours.summary.hasOwnProperty("symbol_code")
                  ? daily_icon_3.push(
                      resultNO.properties.timeseries[
                        i
                      ].data.next_1_hours.summary.symbol_code.split("_")[0]
                    )
                  : "";
              } else {
                resultNO.properties.timeseries[
                  i
                ].data.next_6_hours.summary.hasOwnProperty("symbol_code")
                  ? daily_icon_3.push(
                      resultNO.properties.timeseries[
                        i
                      ].data.next_6_hours.summary.symbol_code.split("_")[0]
                    )
                  : "";
              }
            }
            if (
              moment
                .unix(
                  moment(resultNO.properties.timeseries[i].time).unix() +
                    offsetUnix
                )
                .format("DD") == daily_date_4_DD
            ) {
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty(
                "ultraviolet_index_clear_sky"
              )
                ? daily_uv_4.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .ultraviolet_index_clear_sky
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("wind_speed")
                ? daily_wind_speed_4.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .wind_speed
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("wind_from_direction")
                ? daily_wind_dir_4.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .wind_from_direction
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("air_temperature")
                ? daily_temp_4.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .air_temperature
                  )
                : "";
              if (
                resultNO.properties.timeseries[i].data.hasOwnProperty(
                  "next_1_hours"
                )
              ) {
                resultNO.properties.timeseries[
                  i
                ].data.next_1_hours.summary.hasOwnProperty("symbol_code")
                  ? daily_icon_4.push(
                      resultNO.properties.timeseries[
                        i
                      ].data.next_1_hours.summary.symbol_code.split("_")[0]
                    )
                  : "";
              } else {
                resultNO.properties.timeseries[
                  i
                ].data.next_6_hours.summary.hasOwnProperty("symbol_code")
                  ? daily_icon_4.push(
                      resultNO.properties.timeseries[
                        i
                      ].data.next_6_hours.summary.symbol_code.split("_")[0]
                    )
                  : "";
              }
            }
            if (
              moment
                .unix(
                  moment(resultNO.properties.timeseries[i].time).unix() +
                    offsetUnix
                )
                .format("DD") == daily_date_5_DD
            ) {
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty(
                "ultraviolet_index_clear_sky"
              )
                ? daily_uv_5.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .ultraviolet_index_clear_sky
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("wind_speed")
                ? daily_wind_speed_5.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .wind_speed
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("wind_from_direction")
                ? daily_wind_dir_5.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .wind_from_direction
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("air_temperature")
                ? daily_temp_5.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .air_temperature
                  )
                : "";
              if (
                resultNO.properties.timeseries[i].data.hasOwnProperty(
                  "next_1_hours"
                )
              ) {
                resultNO.properties.timeseries[
                  i
                ].data.next_1_hours.summary.hasOwnProperty("symbol_code")
                  ? daily_icon_5.push(
                      resultNO.properties.timeseries[
                        i
                      ].data.next_1_hours.summary.symbol_code.split("_")[0]
                    )
                  : "";
              } else {
                resultNO.properties.timeseries[
                  i
                ].data.next_6_hours.summary.hasOwnProperty("symbol_code")
                  ? daily_icon_5.push(
                      resultNO.properties.timeseries[
                        i
                      ].data.next_6_hours.summary.symbol_code.split("_")[0]
                    )
                  : "";
              }
            }
            if (
              moment
                .unix(
                  moment(resultNO.properties.timeseries[i].time).unix() +
                    offsetUnix
                )
                .format("DD") == daily_date_6_DD
            ) {
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty(
                "ultraviolet_index_clear_sky"
              )
                ? daily_uv_6.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .ultraviolet_index_clear_sky
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("wind_speed")
                ? daily_wind_speed_6.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .wind_speed
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("wind_from_direction")
                ? daily_wind_dir_6.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .wind_from_direction
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("air_temperature")
                ? daily_temp_6.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .air_temperature
                  )
                : "";
              if (
                resultNO.properties.timeseries[i].data.hasOwnProperty(
                  "next_1_hours"
                )
              ) {
                resultNO.properties.timeseries[
                  i
                ].data.next_1_hours.summary.hasOwnProperty("symbol_code")
                  ? daily_icon_6.push(
                      resultNO.properties.timeseries[
                        i
                      ].data.next_1_hours.summary.symbol_code.split("_")[0]
                    )
                  : "";
              } else {
                resultNO.properties.timeseries[
                  i
                ].data.next_6_hours.summary.hasOwnProperty("symbol_code")
                  ? daily_icon_6.push(
                      resultNO.properties.timeseries[
                        i
                      ].data.next_6_hours.summary.symbol_code.split("_")[0]
                    )
                  : "";
              }
            }
            if (
              moment
                .unix(
                  moment(resultNO.properties.timeseries[i].time).unix() +
                    offsetUnix
                )
                .format("DD") == daily_date_7_DD
            ) {
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty(
                "ultraviolet_index_clear_sky"
              )
                ? daily_uv_7.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .ultraviolet_index_clear_sky
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("wind_speed")
                ? daily_wind_speed_7.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .wind_speed
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("wind_from_direction")
                ? daily_wind_dir_7.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .wind_from_direction
                  )
                : "";
              resultNO.properties.timeseries[
                i
              ].data.instant.details.hasOwnProperty("air_temperature")
                ? daily_temp_7.push(
                    resultNO.properties.timeseries[i].data.instant.details
                      .air_temperature
                  )
                : "";
              if (
                resultNO.properties.timeseries[i].data.hasOwnProperty(
                  "next_1_hours"
                )
              ) {
                resultNO.properties.timeseries[
                  i
                ].data.next_1_hours.summary.hasOwnProperty("symbol_code")
                  ? daily_icon_7.push(
                      resultNO.properties.timeseries[
                        i
                      ].data.next_1_hours.summary.symbol_code.split("_")[0]
                    )
                  : "";
              } else {
                resultNO.properties.timeseries[
                  i
                ].data.next_6_hours.summary.hasOwnProperty("symbol_code")
                  ? daily_icon_7.push(
                      resultNO.properties.timeseries[
                        i
                      ].data.next_6_hours.summary.symbol_code.split("_")[0]
                    )
                  : "";
              }
            }
          }

          daily_icon = [];
          daily_icon_url = [];

          if (daily_icon_1.length > 0) {
            if (
              mode2(daily_icon_1).length > 1 &&
              (iconConvertNO_HD(mode2(daily_icon_1)[1].key, "day") == "rain" ||
                iconConvertNO_HD(mode2(daily_icon_1)[1].key, "day") == "snow" ||
                iconConvertNO_HD(mode2(daily_icon_1)[1].key, "day") == "sleet")
            ) {
              daily_icon[1] = iconConvertNO_HD(
                mode2(daily_icon_1)[1].key,
                "day"
              );
            } else {
              daily_icon[1] = iconConvertNO_HD(
                mode2(daily_icon_1)[0].key,
                "day"
              );
            }
          } else {
            daily_icon[1] = "partly-cloudy-day";
          }

          if (daily_icon_2.length > 0) {
            if (
              mode2(daily_icon_2).length > 1 &&
              (iconConvertNO_HD(mode2(daily_icon_2)[1].key, "day") == "rain" ||
                iconConvertNO_HD(mode2(daily_icon_2)[1].key, "day") == "snow" ||
                iconConvertNO_HD(mode2(daily_icon_2)[1].key, "day") == "sleet")
            ) {
              daily_icon[2] = iconConvertNO_HD(
                mode2(daily_icon_2)[1].key,
                "day"
              );
            } else {
              daily_icon[2] = iconConvertNO_HD(
                mode2(daily_icon_2)[0].key,
                "day"
              );
            }
          } else {
            daily_icon[2] = "partly-cloudy-day";
          }

          if (daily_icon_3.length > 0) {
            if (
              mode2(daily_icon_3).length > 1 &&
              (iconConvertNO_HD(mode2(daily_icon_3)[1].key, "day") == "rain" ||
                iconConvertNO_HD(mode2(daily_icon_3)[1].key, "day") == "snow" ||
                iconConvertNO_HD(mode2(daily_icon_3)[1].key, "day") == "sleet")
            ) {
              daily_icon[3] = iconConvertNO_HD(
                mode2(daily_icon_3)[1].key,
                "day"
              );
            } else {
              daily_icon[3] = iconConvertNO_HD(
                mode2(daily_icon_3)[0].key,
                "day"
              );
            }
          } else {
            daily_icon[3] = "partly-cloudy-day";
          }

          if (daily_icon_4.length > 0) {
            if (
              mode2(daily_icon_4).length > 1 &&
              (iconConvertNO_HD(mode2(daily_icon_4)[1].key, "day") == "rain" ||
                iconConvertNO_HD(mode2(daily_icon_4)[1].key, "day") == "snow" ||
                iconConvertNO_HD(mode2(daily_icon_4)[1].key, "day") == "sleet")
            ) {
              daily_icon[4] = iconConvertNO_HD(
                mode2(daily_icon_4)[1].key,
                "day"
              );
            } else {
              daily_icon[4] = iconConvertNO_HD(
                mode2(daily_icon_4)[0].key,
                "day"
              );
            }
          } else {
            daily_icon[4] = "partly-cloudy-day";
          }

          if (daily_icon_5.length > 0) {
            if (
              mode2(daily_icon_5).length > 1 &&
              (iconConvertNO_HD(mode2(daily_icon_5)[1].key, "day") == "rain" ||
                iconConvertNO_HD(mode2(daily_icon_5)[1].key, "day") == "snow" ||
                iconConvertNO_HD(mode2(daily_icon_5)[1].key, "day") == "sleet")
            ) {
              daily_icon[5] = iconConvertNO_HD(
                mode2(daily_icon_5)[1].key,
                "day"
              );
            } else {
              daily_icon[5] = iconConvertNO_HD(
                mode2(daily_icon_5)[0].key,
                "day"
              );
            }
          } else {
            daily_icon[5] = "partly-cloudy-day";
          }

          if (daily_icon_6.length > 0) {
            if (
              mode2(daily_icon_6).length > 1 &&
              (iconConvertNO_HD(mode2(daily_icon_6)[1].key, "day") == "rain" ||
                iconConvertNO_HD(mode2(daily_icon_6)[1].key, "day") == "snow" ||
                iconConvertNO_HD(mode2(daily_icon_6)[1].key, "day") == "sleet")
            ) {
              daily_icon[6] = iconConvertNO_HD(
                mode2(daily_icon_6)[1].key,
                "day"
              );
            } else {
              daily_icon[6] = iconConvertNO_HD(
                mode2(daily_icon_6)[0].key,
                "day"
              );
            }
          } else {
            daily_icon[6] = "partly-cloudy-day";
          }

          if (daily_icon_7.length > 0) {
            if (
              mode2(daily_icon_7).length > 1 &&
              (iconConvertNO_HD(mode2(daily_icon_7)[1].key, "day") == "rain" ||
                iconConvertNO_HD(mode2(daily_icon_7)[1].key, "day") == "snow" ||
                iconConvertNO_HD(mode2(daily_icon_7)[1].key, "day") == "sleet")
            ) {
              daily_icon[7] = iconConvertNO_HD(
                mode2(daily_icon_7)[1].key,
                "day"
              );
            } else {
              daily_icon[7] = iconConvertNO_HD(
                mode2(daily_icon_7)[0].key,
                "day"
              );
            }
          } else {
            daily_icon[7] = "partly-cloudy-day";
          }

          for (i = 1; i < 8; i++) {
            forecast_icon = daily_icon[i];
            switch (forecast_icon) {
              case "clear-day":
                daily_icon_url[i] = 'url("images/weather_icon/b_sun.svg")';
                if (i < 3) {
                  daily_icon_url[i] = 'url("images/weather_icon/b_sun.svg")';
                }
                break;
              case "clear-night":
                daily_icon_url[i] = 'url("images/weather_icon/b_moon.svg")';
                if (i < 3) {
                  daily_icon_url[i] = 'url("images/weather_icon/b_moon.svg")';
                }
                break;
              case "rain":
                daily_icon_url[i] =
                  'url("images/weather_icon/b_cloud_rain.svg")';
                if (i < 3) {
                  daily_icon_url[i] =
                    'url("images/weather_icon/b_cloud_rain.svg")';
                }
                break;
              case "snow":
                daily_icon_url[i] =
                  'url("images/weather_icon/b_cloud_snow.svg")';
                if (i < 3) {
                  daily_icon_url[i] =
                    'url("images/weather_icon/b_cloud_snow.svg")';
                }
                break;
              case "sleet":
                daily_icon_url[i] =
                  'url("images/weather_icon/b_cloud_snow_alt.svg")';
                if (i < 3) {
                  daily_icon_url[i] =
                    'url("images/weather_icon/b_cloud_snow_alt.svg")';
                }
                break;
              case "wind":
                daily_icon_url[i] = 'url("images/weather_icon/b_wind.svg")';
                if (i < 3) {
                  daily_icon_url[i] = 'url("images/weather_icon/b_wind.svg")';
                }
                break;
              case "fog":
                daily_icon_url[i] =
                  'url("images/weather_icon/b_cloud_fog_alt.svg")';
                if (i < 3) {
                  daily_icon_url[i] =
                    'url("images/weather_icon/b_cloud_fog_alt.svg")';
                }
                break;
              case "cloudy":
                daily_icon_url[i] = 'url("images/weather_icon/b_cloud.svg")';
                if (i < 3) {
                  daily_icon_url[i] = 'url("images/weather_icon/b_cloud.svg")';
                }
                break;
              case "partly-cloudy-day":
                daily_icon_url[i] =
                  'url("images/weather_icon/b_cloud_sun.svg")';
                if (i < 3) {
                  daily_icon_url[i] =
                    'url("images/weather_icon/b_cloud_sun.svg")';
                }
                break;
              case "partly-cloudy-night":
                daily_icon_url[i] =
                  'url("url("images/weather_icon/b_cloud_moon.svg")';
                if (i < 3) {
                  daily_icon_url[i] =
                    'url("images/weather_icon/b_cloud_moon.svg")';
                }
                break;
              default:
                daily_icon_url[i] = 'url("images/weather_icon/b_sun.svg")';
                if (i < 3) {
                  daily_icon_url[i] = 'url("images/weather_icon/b_sun.svg")';
                }
                break;
            }
          }

          daily_date_1 = daily_date_0 + 86400 * 1;
          daily_date_2 = daily_date_0 + 86400 * 2;
          daily_date_3 = daily_date_0 + 86400 * 3;
          daily_date_4 = daily_date_0 + 86400 * 4;
          daily_date_5 = daily_date_0 + 86400 * 5;
          daily_date_6 = daily_date_0 + 86400 * 6;
          daily_date_7 = daily_date_0 + 86400 * 7;

          daily_uv_1.length > 0
            ? (daily_uvIndex_1 = daily_uv_1.max())
            : (daily_uvIndex_1 = "-");
          daily_uv_2.length > 0
            ? (daily_uvIndex_2 = daily_uv_2.max())
            : (daily_uvIndex_2 = "-");
          daily_uv_3.length > 0
            ? (daily_uvIndex_3 = daily_uv_3.max())
            : (daily_uvIndex_3 = "-");
          daily_uv_4.length > 0
            ? (daily_uvIndex_4 = daily_uv_4.max())
            : (daily_uvIndex_4 = "-");
          daily_uv_5.length > 0
            ? (daily_uvIndex_5 = daily_uv_5.max())
            : (daily_uvIndex_5 = "-");
          daily_uv_6.length > 0
            ? (daily_uvIndex_6 = daily_uv_6.max())
            : (daily_uvIndex_6 = "-");
          daily_uv_7.length > 0
            ? (daily_uvIndex_7 = daily_uv_7.max())
            : (daily_uvIndex_7 = "-");

          //daily_wind_dir_1.length > 0 ? daily_windBearing_1 = (daily_wind_dir_1[daily_wind_speed_1.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)] - 180) : daily_windBearing_1 = 0;
          daily_wind_dir_1.length > 0
            ? (daily_windBearing_1 =
                daily_wind_dir_1.reduce(
                  (previous, current) => (current += previous)
                ) /
                  daily_wind_dir_1.length -
                180)
            : (daily_windBearing_1 = 0);
          daily_wind_dir_2.length > 0
            ? (daily_windBearing_2 =
                daily_wind_dir_2.reduce(
                  (previous, current) => (current += previous)
                ) /
                  daily_wind_dir_2.length -
                180)
            : (daily_windBearing_2 = 0);
          daily_wind_dir_3.length > 0
            ? (daily_windBearing_3 =
                daily_wind_dir_3.reduce(
                  (previous, current) => (current += previous)
                ) /
                  daily_wind_dir_3.length -
                180)
            : (daily_windBearing_3 = 0);
          daily_wind_dir_4.length > 0
            ? (daily_windBearing_4 =
                daily_wind_dir_4.reduce(
                  (previous, current) => (current += previous)
                ) /
                  daily_wind_dir_4.length -
                180)
            : (daily_windBearing_4 = 0);
          daily_wind_dir_5.length > 0
            ? (daily_windBearing_5 =
                daily_wind_dir_5.reduce(
                  (previous, current) => (current += previous)
                ) /
                  daily_wind_dir_5.length -
                180)
            : (daily_windBearing_5 = 0);
          daily_wind_dir_6.length > 0
            ? (daily_windBearing_6 =
                daily_wind_dir_6.reduce(
                  (previous, current) => (current += previous)
                ) /
                  daily_wind_dir_6.length -
                180)
            : (daily_windBearing_6 = 0);
          daily_wind_dir_7.length > 0
            ? (daily_windBearing_7 =
                daily_wind_dir_7.reduce(
                  (previous, current) => (current += previous)
                ) /
                  daily_wind_dir_7.length -
                180)
            : (daily_windBearing_7 = 0);

          daily_wind_speed_1.length > 0
            ? (daily_wind_1 = daily_wind_speed_1.max() * 2.236937)
            : (daily_wind_1 = "-");
          daily_wind_speed_2.length > 0
            ? (daily_wind_2 = daily_wind_speed_2.max() * 2.236937)
            : (daily_wind_2 = "-");
          daily_wind_speed_3.length > 0
            ? (daily_wind_3 = daily_wind_speed_3.max() * 2.236937)
            : (daily_wind_3 = "-");
          daily_wind_speed_4.length > 0
            ? (daily_wind_4 = daily_wind_speed_4.max() * 2.236937)
            : (daily_wind_4 = "-");
          daily_wind_speed_5.length > 0
            ? (daily_wind_5 = daily_wind_speed_5.max() * 2.236937)
            : (daily_wind_5 = "-");
          daily_wind_speed_6.length > 0
            ? (daily_wind_6 = daily_wind_speed_6.max() * 2.236937)
            : (daily_wind_6 = "-");
          daily_wind_speed_7.length > 0
            ? (daily_wind_7 = daily_wind_speed_7.max() * 2.236937)
            : (daily_wind_7 = "-");

          if (daily_temp_1.length > 0) {
            daily_tempF_max_1 = Math.round(c2f(daily_temp_1.max()));
            daily_tempF_min_1 = Math.round(c2f(daily_temp_1.min()));
            daily_tempC_max_1 = Math.round(daily_temp_1.max());
            daily_tempC_min_1 = Math.round(daily_temp_1.min());
          } else {
            daily_tempF_max_1 = "-";
            daily_tempF_min_1 = "-";
            daily_tempC_max_1 = "-";
            daily_tempC_min_1 = "-";
          }

          if (daily_temp_2.length > 0) {
            daily_tempF_max_2 = Math.round(c2f(daily_temp_2.max()));
            daily_tempF_min_2 = Math.round(c2f(daily_temp_2.min()));
            daily_tempC_max_2 = Math.round(daily_temp_2.max());
            daily_tempC_min_2 = Math.round(daily_temp_2.min());
          } else {
            daily_tempF_max_2 = "-";
            daily_tempF_min_2 = "-";
            daily_tempC_max_2 = "-";
            daily_tempC_min_2 = "-";
          }

          if (daily_temp_3.length > 0) {
            daily_tempF_max_3 = Math.round(c2f(daily_temp_3.max()));
            daily_tempF_min_3 = Math.round(c2f(daily_temp_3.min()));
            daily_tempC_max_3 = Math.round(daily_temp_3.max());
            daily_tempC_min_3 = Math.round(daily_temp_3.min());
          } else {
            daily_tempF_max_3 = "-";
            daily_tempF_min_3 = "-";
            daily_tempC_max_3 = "-";
            daily_tempC_min_3 = "-";
          }

          if (daily_temp_4.length > 0) {
            daily_tempF_max_4 = Math.round(c2f(daily_temp_4.max()));
            daily_tempF_min_4 = Math.round(c2f(daily_temp_4.min()));
            daily_tempC_max_4 = Math.round(daily_temp_4.max());
            daily_tempC_min_4 = Math.round(daily_temp_4.min());
          } else {
            daily_tempF_max_4 = "-";
            daily_tempF_min_4 = "-";
            daily_tempC_max_4 = "-";
            daily_tempC_min_4 = "-";
          }

          if (daily_temp_5.length > 0) {
            daily_tempF_max_5 = Math.round(c2f(daily_temp_5.max()));
            daily_tempF_min_5 = Math.round(c2f(daily_temp_5.min()));
            daily_tempC_max_5 = Math.round(daily_temp_5.max());
            daily_tempC_min_5 = Math.round(daily_temp_5.min());
          } else {
            daily_tempF_max_5 = "-";
            daily_tempF_min_5 = "-";
            daily_tempC_max_5 = "-";
            daily_tempC_min_5 = "-";
          }

          if (daily_temp_6.length > 0) {
            daily_tempF_max_6 = Math.round(c2f(daily_temp_6.max()));
            daily_tempF_min_6 = Math.round(c2f(daily_temp_6.min()));
            daily_tempC_max_6 = Math.round(daily_temp_6.max());
            daily_tempC_min_6 = Math.round(daily_temp_6.min());
          } else {
            daily_tempF_max_6 = "-";
            daily_tempF_min_6 = "-";
            daily_tempC_max_6 = "-";
            daily_tempC_min_6 = "-";
          }

          if (daily_temp_7.length > 0) {
            daily_tempF_max_7 = Math.round(c2f(daily_temp_7.max()));
            daily_tempF_min_7 = Math.round(c2f(daily_temp_7.min()));
            daily_tempC_max_7 = Math.round(daily_temp_7.max());
            daily_tempC_min_7 = Math.round(daily_temp_7.min());
          } else {
            daily_tempF_max_7 = "-";
            daily_tempF_min_7 = "-";
            daily_tempC_max_7 = "-";
            daily_tempC_min_7 = "-";
          }

          summaryDailyC = " ";
          summaryHourlyC = " ";
          summaryDailyF = " ";
          summaryHourlyF = " ";

          function accu() {
            utcSystemTime = new Date(new Date().toUTCString()).toISOString();
            updateTimeBadge = toTimestamp(utcSystemTime);
            localTimeMoment = moment.unix(updateTimeBadge + offsetUnix);
            lat = latlong.split(",")[0];
            ghiSolarClearSki = solarcalc(lat, localTimeMoment);

            var accufeelC = accufeel(
              temperatureCbadge,
              ghiSolarClearSki,
              windSpeedMS,
              humidity,
              cloudCoverBadge
            );

            if (Math.abs(accufeelC - temperatureCbadge) > 4) {
              accufeelC > temperatureCbadge
                ? (accufeelC = temperatureCbadge + 4)
                : (accufeelC = temperatureCbadge - 4);
            }
            accufeelResultC = Math.round(accufeelC);
            accufeelResultF = Math.round(c2f(accufeelC));
          }

          timeZoneBadge = parseFloat(data.timeZoneBadge);
          if (
            (country !== "CA" &&
              country !== "ca" &&
              country !== "Canada" &&
              country !== "US" &&
              country !== "us" &&
              country !== "United States of America") ||
            failedHTTP == "1" ||
            setSettingUT == "u"
          ) {
            summaryBadge = summaryBadgeNO;
            summaryMinutely = summaryMinutelyNO;

            temperatureCbadge = temperatureCbadgeNO;
            temperatureFbadge = temperatureFbadgeNO;

            accu();
            solarNighDay(timeZoneBadge, latlong);
            isNight ? (nightNO = "night") : (nightNO = "day");
            iconBadgeConvertNO(iconNO, nightNO);
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
              citys,
              uv1
            );
          }

          accu();

          resolve && resolve("result of NO()");
        })
        .catch(function (err) {
          // console.log("no err " + err);
          chrome.storage.local.set({
            failedHTTP_NO: "1",
          });
        });
    }
  );
}
