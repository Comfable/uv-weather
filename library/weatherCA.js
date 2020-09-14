function weatherCA(latlong, citys, resolve) {

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

            fetchWithTimeout(`https://uvweather.herokuapp.com/https://dd.weather.gc.ca/citypage_weather/xml/${stateCA_code}/${cityCA_code}_e.xml`, optionsCA, 1500)
                .then((resp) => resp.text())
                .then(function(resultCA) {

                    chrome.storage.local.set({
                        'failedHTTP': '0'
                    });
                    const parser = new DOMParser();
                    const srcDOM = parser.parseFromString(resultCA, "application/xml");

                    systemTime = new Date();
                    utcSystemTime = new Date(new Date().toUTCString()).toISOString();
                    updateTimeBadge = toTimestamp(utcSystemTime);

                    timeZoneBadge = 3600 * (srcDOM.getElementsByTagName("dateTime")[1].getAttribute('UTCOffset'));
                    chrome.storage.local.set({
                        'timeZoneBadge': timeZoneBadge
                    });

                    srcDOMJsonCA = xml2json(srcDOM);
                    //console.log(JSON.stringify(srcDOMJsonCA));
                    temperatureCbadge = srcDOMJsonCA.siteData.currentConditions.hasOwnProperty('temperature') ? Math.round(parseFloat(srcDOMJsonCA.siteData.currentConditions.temperature)) : '';
                    temperatureFbadge = srcDOMJsonCA.siteData.currentConditions.hasOwnProperty('temperature') ? Math.round((1.8 * temperatureCbadge) + 32) : '';
                    summaryBadge = srcDOMJsonCA.siteData.currentConditions.hasOwnProperty('condition') ? srcDOMJsonCA.siteData.currentConditions.condition : '';
                    iconCodeCA = srcDOMJsonCA.siteData.currentConditions.hasOwnProperty('iconCode') ? srcDOMJsonCA.siteData.currentConditions.iconCode : '';

                    iconCodeGroupCA = srcDOMJsonCA.siteData.hourlyForecastGroup.hourlyForecast[0].iconCode;
                    temperatureC_GroupCA = Math.round(parseFloat(srcDOMJsonCA.siteData.hourlyForecastGroup.hourlyForecast[0].temperature));
                    temperatureF_GroupCA = Math.round((1.8 * temperatureC_GroupCA) + 32);
                    summaryGroupCA = srcDOMJsonCA.siteData.hourlyForecastGroup.hourlyForecast[0].condition;
                    if (iconCodeCA == "") {
                        iconCodeCA = iconCodeGroupCA
                    };
                    if (temperatureCbadge == "") {
                        temperatureCbadge = temperatureC_GroupCA;
                        temperatureFbadge = temperatureF_GroupCA
                    };
                    if (summaryBadge == "") {
                        summaryBadge = summaryGroupCA
                    };

                    if (iconCodeCA == "" || temperatureCbadge == "" || summaryBadge == "") {
                        throw Error();
                    } else {
                        chrome.storage.local.get('setSettingUT', function(data) {
                            setSettingUT = data.setSettingUT;
                            if (setSettingUT !== "u") {
                                solarNighDay(timeZoneBadge, latlong);
                                iconBadgeConvertCA(iconCodeCA);
                                iconBadgeConvertDS(iconBadge);
                                badgeGeneral(isDay, isNight, sunnyDayBadge, cloudyBadge, rainyBadge, snowyBadge, temperatureFbadge, temperatureCbadge, updateTimeBadge, citys);
                            }
                        });

                        resolve && resolve(resultCA);
                    }


                }).catch(function() {
                    chrome.storage.local.set({
                        'failedHTTP': '1'
                    });
                    weatherDS(latlong, citys, country, resolve);
                });


        }

    });


};