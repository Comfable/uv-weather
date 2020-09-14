function weatherOWM(latlong,citys,resolve) {
      
  lat = (latlong.split(','))[0];
  lng = (latlong.split(','))[1];

  owmAPIback = 'https://uv-weather.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + lng + '&appid=6761dd7f8d0c3c216f9af6813064f867';
  fetch(owmAPIback)
  .then((resp) => resp.json())
  .then(function(result) {

    chrome.storage.local.set({'failedHTTP': '0'});
    window.result = result;
    temperatureCbadge = Math.round((result.main.temp) - 273.15);
    temperatureFbadge = Math.round((1.8*temperatureCbadge) + 32);
    if(temperatureCbadge == '-0') {temperatureCbadge = 0};
    if(temperatureFbadge == '-0') {temperatureFbadge = 0};
    summaryBadgeMain = result.weather[0].main;
    summaryBadge = result.weather[0].description;
    updateTimeBadge = result.dt;
    timeZoneBadge = result.timezone;
    chrome.storage.local.set({'timeZoneBadge': timeZoneBadge});
    cloudCoverBadge = result.clouds.all;

    chrome.storage.local.get('setSettingUT', function(data) {
      setSettingUT = data.setSettingUT;    
      if(setSettingUT !== "u") {
        solarNighDay(timeZoneBadge,latlong);
        iconBadgeConvert(summaryBadge,summaryBadgeMain);                      
        badgeGeneral(isDay,isNight,sunnyDayBadge,cloudyBadge,rainyBadge,snowyBadge,temperatureFbadge,temperatureCbadge,updateTimeBadge,citys);
      }
    }); 
  
    resolve && resolve(result);

  }).catch(function() {
                chrome.storage.local.set({'failedHTTP': '1'});
                weatherDS(latlong,citys,country,resolve);
            });


}