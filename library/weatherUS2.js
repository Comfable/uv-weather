function weatherUS2(latlong,citys,resolve) {

      lat = (latlong.split(','))[0];
      lng = (latlong.split(','))[1];

            const optionsUS = {
                method: 'GET',
                headers: {
                    'Accept' : 'application/vnd.noaa.dwml+json;version=1',
                    'User-Agent': 'uvweather.net (info@uvweather.net)'
                }
            }

            fetchWithTimeout(`https://uv-weather.herokuapp.com/https://forecast.weather.gov/MapClick.php?lat=${lat}&lon=${lng}&unit=0&lg=english&FcstType=json`, optionsUS, 1500)
            .then(CheckError)
            .then(function(resultUS2) {

                chrome.storage.local.set({'failedHTTP': '0'});
                //console.log(JSON.stringify(resultUS2));
                systemTime = new Date();
                utcSystemTime = new Date(new Date().toUTCString()).toISOString();
                updateTimeBadge = toTimestamp(utcSystemTime);


                if(resultUS2.currentobservation.hasOwnProperty('timezone')) {
                    timeZoneUS2 = resultUS2.currentobservation.timezone;
                } 
                else{
                    timeZone = "NA";
                }

                if((timeZone == "NA" || timeZone == null || timeZone == "" || timeZone == "NULL") && resultUS2.hasOwnProperty('creationDateLocal')) {
                    timeZoneShort = resultUS2.creationDateLocal;
                    if(timeZoneShort !== "NA" && timeZoneShort !== null && timeZoneShort !== "" && timeZoneShort !== "NULL") {
                        timeZone = (timeZoneShort.split(' ')).pop();
                    }
                }

                if(timeZoneUS2 == 'EST') {
                    timeZoneBadge = -5*60*60;
                }
                else if(timeZoneUS2 == 'EDT') {
                    timeZoneBadge = -4*60*60;
                }
                else if(timeZoneUS2 == 'CST') {
                    timeZoneBadge = -6*60*60;
                }
                else if(timeZoneUS2 == 'CDT') {
                    timeZoneBadge = -5*60*60;
                }
                else if(timeZoneUS2 == 'MST') {
                    timeZoneBadge = -7*60*60;
                }
                else if(timeZoneUS2 == 'MDT') {
                    timeZoneBadge = -6*60*60;
                }
                else if(timeZoneUS2 == 'PST') {
                    timeZoneBadge = -8*60*60;
                }
                else if(timeZoneUS2 == 'PDT') {
                    timeZoneBadge = -7*60*60;
                }
                else{
                    timeZoneBadge = -5*60*60;
                }                
                chrome.storage.local.set({'timeZoneBadge': timeZoneBadge});


                if(resultUS2.currentobservation.hasOwnProperty('Temp')) {
                    tempFus = resultUS2.currentobservation.Temp;
                    if(tempFus !== "NA" && tempFus !== "" && tempFus !== null && tempFus !== "NULL" ) {
                        temperatureFbadge = Math.round(parseFloat(tempFus));
                        temperatureCbadge = Math.round((parseFloat(tempFus) - 32)/1.8);
                    } 
                    else{
                        tempFus = "NA";
                    }
                } 
                else{
                    tempFus = "NA";
                }


                if(resultUS2.currentobservation.hasOwnProperty('Weather')) {
                    summaryBadge = resultUS2.currentobservation.Weather;
                } 
                else{
                    summaryBadge = "NA";
                }


                if(resultUS2.currentobservation.hasOwnProperty('Weatherimage')) {
                    iconUrlUS = resultUS2.currentobservation.Weatherimage;
                    if(iconUrlUS !== "NA" && iconUrlUS !== null && iconUrlUS !== "" && iconUrlUS !== "NULL") {
                        iconUS = (iconUrlUS.split('.')[0]).replace(/[0-9]/g, '');
                    }
                    else{
                        iconUS = "NA";
                    }
                } 
                else{
                    iconUS = "NA";
                }


                if(timeZone == "NULL" || iconUS == "NULL" || temperatureFbadge == "NULL" || summaryBadge == "NULL" || timeZone == "" || iconUS == "" || temperatureFbadge == "" || summaryBadge == "" || timeZone == null || iconUS == null || temperatureFbadge == null || summaryBadge == null || timeZone == "NA" || iconUS == "NA" || isNaN(temperatureFbadge) || summaryBadge == "NA" || tempFus == "NA") {
                   throw Error();
                }
                else{
                    chrome.storage.local.get('setSettingUT', function(data) {
                        setSettingUT = data.setSettingUT;
                        if(setSettingUT !== "u") {
                            solarNighDay(timeZoneBadge,latlong);
                            iconBadgeConvertUS(iconUS);
                            iconBadgeConvertDS(iconBadge);
                            badgeGeneral(isDay,isNight,sunnyDayBadge,cloudyBadge,rainyBadge,snowyBadge,temperatureFbadge,temperatureCbadge,updateTimeBadge,citys);
                        }
                    });
                    resolve && resolve(resultUS2);
                }
                              

            }).catch(function() {
                weatherOWM(latlong,citys,resolve);
            });


};