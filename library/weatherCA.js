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

                    tempCca = srcDOMJsonCA.siteData.currentConditions.hasOwnProperty('temperature') ? srcDOMJsonCA.siteData.currentConditions.temperature : srcDOMJsonCA.siteData.hourlyForecastGroup.hourlyForecast[0].temperature;
                    if (tempCca !== "NA" && tempCca !== "" && tempCca !== null && tempCca !== "NULL") {
                        temperatureCbadge = Math.round(parseFloat(tempCca));
                        temperatureFbadge = Math.round((parseFloat(tempCca) * 1.8) + 32);
                    } else {
                        tempCca = srcDOMJsonCA.siteData.hourlyForecastGroup.hourlyForecast[0].temperature;
                        if (tempCca !== "NA" && tempCca !== "" && tempCca !== null && tempCca !== "NULL") {
                            temperatureCbadge = Math.round(parseFloat(tempCca));
                            temperatureFbadge = Math.round((parseFloat(tempCca) * 1.8) + 32);
                        }
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

                    if (iconCodeCA == "" || tempCca == "" || summaryBadge == "" ||
                        iconCodeCA == "NULL" || tempCca == "NULL" || summaryBadge == "NULL" ||
                        iconCodeCA == null || tempCca == null || summaryBadge == null ||
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