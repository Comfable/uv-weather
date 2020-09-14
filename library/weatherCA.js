//
function weatherCA(latlong, citys, resolve) {
    //console.log('ca');

    lat = (latlong.split(','))[0];
    lng = (latlong.split(','))[1];

    var data;
    Papa.parse('/library/weatherstationca.csv', {
        header: true,
        download: true,
        complete: function(results) {

            csvData = results.data,
                targetLocation = {
                    latitude: lat,
                    longitude: lng
                },
                closest = closestLocation(targetLocation, csvData);
            cityCA_code = closest.code;
            stateCA_code = closest.state;

            const optionsCA = {
                method: 'GET',
                headers: {
                    'Accept': 'application/xml'
                }
            }

            fetchWithTimeout(`https://uvweather.herokuapp.com/https://dd.weather.gc.ca/citypage_weather/xml/${stateCA_code}/${cityCA_code}_e.xml`, optionsCA, 2500)
                .then((resp) => resp.text())
                .then(function(resultCA) {

                    chrome.storage.local.set({
                        'failedHTTP': '0'
                    });
                    failedHTTP = '0';
                    const parser = new DOMParser();
                    const srcDOM = parser.parseFromString(resultCA, "application/xml");

                    utcSystemTime = new Date(new Date().toUTCString()).toISOString();
                    updateTimeBadge = toTimestamp(utcSystemTime);

                    srcDOMJsonCA = xml2json(srcDOM);
                    //console.log(JSON.stringify(srcDOMJsonCA));

                    var tempCca = "-";
                    tempCCca = srcDOMJsonCA.siteData.currentConditions.hasOwnProperty('temperature') ? srcDOMJsonCA.siteData.currentConditions.temperature : "NA";
                    tempC0ca = srcDOMJsonCA.siteData.hourlyForecastGroup.hourlyForecast[0].hasOwnProperty('temperature') ? srcDOMJsonCA.siteData.hourlyForecastGroup.hourlyForecast[0].temperature : "NA";

                    if (tempCCca !== "NA" && tempCCca !== "" && tempCCca !== null && tempCCca !== "NULL" && tempC0ca !== "NA" && tempC0ca !== "" && tempC0ca !== null && tempC0ca !== "NULL") {
                        temperatureCbadge = Math.round((parseFloat(tempCCca) + parseFloat(tempC0ca)) / 2);
                        temperatureFbadge = Math.round((((parseFloat(tempCCca) * 1.8) + 32) + ((parseFloat(tempC0ca) * 1.8) + 32)) / 2);
                    } else if (tempCCca !== "NA" && tempCCca !== "" && tempCCca !== null && tempCCca !== "NULL") {
                        temperatureCbadge = Math.round(parseFloat(tempCCca));
                        temperatureFbadge = Math.round((parseFloat(tempCCca) * 1.8) + 32);
                    } else if (tempC0ca !== "NA" && tempC0ca !== "" && tempC0ca !== null && tempC0ca !== "NULL") {
                        temperatureCbadge = Math.round(parseFloat(tempC0ca));
                        temperatureFbadge = Math.round((parseFloat(tempC0ca) * 1.8) + 32);
                    } else {
                        tempCca = "NA";
                    }

                    summaryBadge = srcDOMJsonCA.siteData.currentConditions.hasOwnProperty('condition') ? srcDOMJsonCA.siteData.currentConditions.condition : srcDOMJsonCA.siteData.hourlyForecastGroup.hourlyForecast[0].condition;
                    summaryMinutely = srcDOMJsonCA.siteData.currentConditions.hasOwnProperty('condition') ? srcDOMJsonCA.siteData.currentConditions.condition : srcDOMJsonCA.siteData.hourlyForecastGroup.hourlyForecast[0].condition;

                    if (summaryBadge == "NA" || summaryBadge == "" || summaryBadge == null || summaryBadge == "NULL") {
                        summaryBadge = srcDOMJsonCA.siteData.hourlyForecastGroup.hourlyForecast[0].condition;
                        summaryMinutely = summaryBadge;
                    }

                    iconCodeCA = srcDOMJsonCA.siteData.currentConditions.hasOwnProperty('iconCode') ? srcDOMJsonCA.siteData.currentConditions.iconCode : srcDOMJsonCA.siteData.hourlyForecastGroup.hourlyForecast[0].iconCode;
                    if (iconCodeCA == "NA" || iconCodeCA == "" || iconCodeCA == null || iconCodeCA == "NULL") {
                        iconCodeCA = srcDOMJsonCA.siteData.hourlyForecastGroup.hourlyForecast[0].iconCode;
                    }

                    if (iconCodeCA == "" || summaryBadge == "" ||
                        iconCodeCA == "NULL" || summaryBadge == "NULL" ||
                        iconCodeCA == null || summaryBadge == null ||
                        tempCca == "NA" || iconCodeCA == "NA" || summaryBadge == "NA") {
                        throw Error();
                    } else {
                        chrome.storage.local.get(['setSettingUT', 'timeZoneBadge', 'latlong'], function(data) {
                            setSettingUT = data.setSettingUT;
                            timeZoneBadge = parseFloat(data.timeZoneBadge);
                            latlong = data.latlong;
                            if (setSettingUT !== "u") {
                                solarNighDay(timeZoneBadge, latlong);
                                iconBadgeConvertCA(iconCodeCA);
                                badgeGeneral(isDay, isNight, sunnyDayBadge, cloudyBadge, rainyBadge, snowyBadge, temperatureFbadge, temperatureCbadge, updateTimeBadge, citys);
                            }
                        });

                        resolve && resolve('result of CA()');
                    }

                }).catch(function(err) {
                    //console.log('ca err ' + err);
                    chrome.storage.local.set({
                        'failedHTTP': '1'
                    });
                    failedHTTP = '1';
                    chrome.storage.local.get('timeZoneBadge', function(data) {
                        timeZoneBadge = data.timeZoneBadge;
                        weatherNO(latlong, citys, timeZoneBadge, resolve);
                    });

                });


        }

    });

};
