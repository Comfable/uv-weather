i_er = 1;
function weatherUS(latlong,citys,resolve) {

      lat = (latlong.split(','))[0];
      lng = (latlong.split(','))[1];

      var data;
      Papa.parse('/library/weatherstationus.csv', {
        header: true,
        download: true,
        complete: function(results) {
            csvData = results.data,
            targetLocation = {
              latitude: lat,
              longitude: lng
            };

            if(typeof csvData_filtered !== 'undefined') {
                csvData = csvData_filtered;
            }

            closest = closestLocation(targetLocation, csvData);
            station_id = closest.station_id;
            timeZone = closest.timeZone;
            station_lat = closest.latitude;
            station_lng = closest.longitude;
            station_latlong = station_lat + ',' + station_lng;
            //'Accept' : 'application/json',
            const optionsUS = {
                method: 'GET',
                headers: {
                    'Accept' : 'application/vnd.noaa.dwml+json;version=1',
                    'User-Agent': 'uvweather.net (info@uvweather.net)'
                }
            }

            fetchWithTimeout(`https://uv-weather.herokuapp.com/https://api.weather.gov/stations/${station_id}/observations/latest`, optionsUS, 750)
            .then(CheckError)
            //.then((resp) => resp.json())
            .then(function(resultUS) {
                status = resultUS.status;
                chrome.storage.local.set({'failedHTTP': '0'});

                //console.log(JSON.stringify(resultUS));
                systemTime = new Date();
                utcSystemTime = new Date(new Date().toUTCString()).toISOString();
                updateTimeBadge = toTimestamp(utcSystemTime);

                var utcSystemTimeM = moment(utcSystemTime);
                timeZoneBadge = (utcSystemTimeM.tz(timeZone).utcOffset())*60;
                chrome.storage.local.set({'timeZoneBadge': timeZoneBadge});

                summaryBadge = resultUS.properties.hasOwnProperty('textDescription') ? resultUS.properties.textDescription : '';
                iconUrlUS = resultUS.properties.hasOwnProperty('icon') ? resultUS.properties.icon : '';
                iconUS = resultUS.properties.hasOwnProperty('icon') ? ((new URL(iconUrlUS).pathname).split('/')).pop() : '';

                temperatureCbadge = resultUS.properties.temperature.hasOwnProperty('value') ? Math.round(parseFloat(resultUS.properties.temperature.value)) : '';
                temperatureFbadge = resultUS.properties.temperature.hasOwnProperty('value') ? Math.round((1.8*temperatureCbadge) + 32) : '';

                if(iconUrlUS == "" || temperatureCbadge == "" || summaryBadge == "" || iconUrlUS == null || isNaN(temperatureCbadge) || summaryBadge == null) {
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
                    resolve && resolve(resultUS["properties"]["temperature"]);
                }
                              

            }).catch(function() {
                if(i_er <=2) {
                    i_er = i_er + 1;
                    csvData_filtered =  csvData.filter(function(csvD) {
                        return csvD.latitude !== station_lat;
                    });
                    weatherUS(station_latlong,citys,resolve);

                }
                else{
                    chrome.storage.local.set({'failedHTTP': '1'});
                    weatherDS(latlong,citys,country,resolve);                    
                }


            });


        }

      });


};

//https://www.weather.gov/documentation/services-web-api#
//https://api.weather.gov/stations
//https://w1.weather.gov/xml/current_obs/index.xml
//https://api.weather.gov/points/34.3444,-118.1895/forecast/hourly
//https://api.weather.gov/icons