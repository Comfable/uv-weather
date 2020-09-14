function weatherNO(latlong, citys, resolve) {

    lat = (latlong.split(','))[0];
    lng = (latlong.split(','))[1];

    const optionsNO = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'uvweather.net (info@uvweather.net)'
        }
    }

    fetchWithTimeout(`https://uvweather.herokuapp.com/https://api.met.no/weatherapi/locationforecast/2.0/?lat=${lat}&lon=${lng}`, optionsNO, 3000)
        .then(CheckError)
        .then(function(resultNO) {
        //console.log(JSON.stringify(resultNO));
            chrome.storage.local.set({
                'failedHTTP': '0'
            });

            utcSystemTime = new Date(new Date().toUTCString()).toISOString();
            updateTimeBadge = toTimestamp(utcSystemTime);

            tempCno = resultNO.properties.timeseries[0].data.instant.details.hasOwnProperty('air_temperature') ? resultNO.properties.timeseries[0].data.instant.details.air_temperature : '';
            if (tempCno !== "NA" && tempCno !== "" && tempCno !== null && tempCno !== "NULL") {
                temperatureCbadge = Math.round(parseFloat(tempCno));
                temperatureFbadge = Math.round((parseFloat(tempCno) * 1.8) + 32);
            }
            else{
                tempCno = "NA";
            }

            iconNO = resultNO.properties.timeseries[0].data.next_1_hours.summary.hasOwnProperty('symbol_code') ? (resultNO.properties.timeseries[0].data.next_1_hours.summary.symbol_code).split('_')[0] : '';
            summaryBadge = code2description_no(iconNO);

            if (iconNO == "" || tempCno == "" || summaryBadge == "" || iconNO == "NULL" || tempCno == "NULL" || summaryBadge == "NULL" || iconNO == null || tempCno == null || summaryBadge == null || tempCno == "NA" || iconNO == "NA" || summaryBadge == "NA") {
                throw Error();
            } else {
                chrome.storage.local.get(['setSettingUT', 'timeZoneBadge'], function(data) {
                    setSettingUT = data.setSettingUT;
                    timeZoneBadge = data.timeZoneBadge;
                    if (setSettingUT !== "u") {
                        solarNighDay(timeZoneBadge, latlong);
                        iconBadgeConvertNO(iconNO);
                        badgeGeneral(isDay, isNight, sunnyDayBadge, cloudyBadge, rainyBadge, snowyBadge, temperatureFbadge, temperatureCbadge, updateTimeBadge, citys);
                    }
                });
                resolve && resolve(resultNO);
            }


        }).catch(function(err) {
            chrome.storage.local.set({
                'failedHTTP': '1'
            });
            weatherDS(latlong, citys, country, resolve);
        });


};