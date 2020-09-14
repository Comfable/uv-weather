function weatherUS2(latlong, citys, resolve) {
    //console.log('us');
    
    lat = (latlong.split(','))[0];
    lng = (latlong.split(','))[1];

    const optionsUS = {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.noaa.dwml+json;version=1',
            'User-Agent': 'uvweather.net (info@uvweather.net)'
        }
    }

    fetchWithTimeout(`https://uvweather.herokuapp.com/https://forecast.weather.gov/MapClick.php?lat=${lat}&lon=${lng}&unit=0&lg=english&FcstType=json`, optionsUS, 2500)
        .then(CheckError)
        .then(function(resultUS2) {

            chrome.storage.local.set({
                'failedHTTP': '0'
            });
            //console.log(JSON.stringify(resultUS2));

            utcSystemTime = new Date(new Date().toUTCString()).toISOString();
            updateTimeBadge = toTimestamp(utcSystemTime);

            if (resultUS2.currentobservation.hasOwnProperty('Temp')) {
                tempFus = resultUS2.currentobservation.Temp;
                if (tempFus !== "NA" && tempFus !== "" && tempFus !== null && tempFus !== "NULL") {
                    temperatureFbadge = Math.round(parseFloat(tempFus));
                    temperatureCbadge = Math.round((parseFloat(tempFus) - 32) / 1.8);
                } else {
                    tempFus = "NA";
                }
            } else {
                tempFus = "NA";
            }

            if (resultUS2.currentobservation.hasOwnProperty('Weather')) {
                summaryBadge = resultUS2.currentobservation.Weather;
                summaryMinutely = summaryBadge;
            } else {
                summaryBadge = "NA";
            }

            if (resultUS2.currentobservation.hasOwnProperty('Weatherimage')) {
                iconUrlUS = resultUS2.currentobservation.Weatherimage;
                if (iconUrlUS !== "NA" && iconUrlUS !== null && iconUrlUS !== "" && iconUrlUS !== "NULL") {
                    iconUS = (iconUrlUS.split('.')[0]).replace(/[0-9]/g, '');
                } else {
                    iconUS = "NA";
                }
            } else {
                iconUS = "NA";
            }

            if (iconUS == "NULL" || tempFus == "NULL" || summaryBadge == "NULL" || iconUS == "" || tempFus == "" || summaryBadge == "" || iconUS == null || tempFus == null || summaryBadge == null || iconUS == "NA" || tempFus == "NA" || summaryBadge == "NA") {
                throw Error();
            } else {
                chrome.storage.local.get(['setSettingUT', 'timeZoneBadge', 'latlong'], function(data) {
                    setSettingUT = data.setSettingUT;
                    timeZoneBadge = parseFloat(data.timeZoneBadge);
                    latlong = data.latlong;
                        if (setSettingUT !== "u") {
                            solarNighDay(timeZoneBadge, latlong);
                            iconBadgeConvertUS(iconUS);
                            badgeGeneral(isDay, isNight, sunnyDayBadge, cloudyBadge, rainyBadge, snowyBadge, temperatureFbadge, temperatureCbadge, updateTimeBadge, citys);
                        }

                });
                resolve && resolve(resultUS2);
            }


        }).catch(function(err) {
            console.log('us err ' + err);
            chrome.storage.local.set({
                'failedHTTP': '1'
            });
            chrome.storage.local.get('timeZoneBadge', function(data) {
                timeZoneBadge = data.timeZoneBadge;
                weatherNO(latlong, citys, timeZoneBadge, resolve);
            });
        });


};