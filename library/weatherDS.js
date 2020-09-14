function weatherDS(latlong,citys,country,resolve) {
  const ads = '3dfc8ba9095bfa87462f459fc85238c6'; 
  return fetch('https://uv-weather.herokuapp.com/https://api.darksky.net/forecast/' + ads +'/' + latlong + '?solar')
  .then((resp) => resp.json())
  .then(function(result) {        
    window.result = result;

    updateTime = result.currently.time;
    temperatureF = Math.round(parseFloat(result.currently.temperature));
    temperatureC = Math.round(f2c(parseFloat(result.currently.temperature)));

    humidity = Math.round(100 * (parseFloat(result.currently.humidity)));
    dewPointF = Math.round(parseFloat(result.currently.dewPoint));
    dewPointC = f2c(dewPointF);
    pressure = result.currently.hasOwnProperty('pressure') ? Math.round(parseFloat(result.currently.pressure)) : '-';
    windSpeedMPH = Math.round(result.currently.windSpeed);
    windSpeedKMH = Math.round(windSpeedMPH * 1.609334);
      windSpeedMS10 = windSpeedMPH * 0.4470389;
      windSpeedMS10R = Math.round(windSpeedMPH * 0.4470389 * 10) / 10;
      windSpeedMS = windSpeedMS10 * 0.33; // on humun hieght an urban area
    windGustMPH = Math.round(result.currently.windGust);
    windGustKMH = Math.round(windGustMPH * 1.609334);
    windGustMS = Math.round(windGustMPH * 0.4470389 * 10) / 10;
    cloudCover = Math.round(result.currently.cloudCover * 100);
    cloudCoverBadge = Math.round(result.currently.cloudCover * 100);
    icon = result.currently.icon;

    ghiSolarClearSki = result.hourly.data[0].hasOwnProperty('solar') ? result.hourly.data[0].solar.ghi : '-'; //GHI = DHI + DNI * cos (Î¸)

    if(result.currently.windSpeed > 0) {
      windBearing = Math.round(result.currently.windBearing); //true north at 0° and progressing clockwise
      windCompass = degToCompass(result.currently.windBearing);
    }
    else {
      windBearing = "-";
      windCompass = "-";
    }

    visibility = result.currently.hasOwnProperty('visibility') ? Math.round(result.currently.visibility *10)/10 : '-';
    visibilityKM = result.currently.hasOwnProperty('visibility') ? Math.round(result.currently.visibility * 1.60934 *10)/10 : '-';

    if(visibility >= 10) {
      visibility = "+10";
      visibilityKM = "+16";
    }

    ozone = result.currently.hasOwnProperty('ozone') ? Math.round(result.currently.ozone) : '-';
    precipProbability = result.currently.hasOwnProperty('precipProbability') ? Math.round(result.currently.precipProbability * 100) : '-';

    summary = result.currently.hasOwnProperty('summary') ? result.currently.summary : '-'

    if(result.hasOwnProperty('minutely')) {
      if(result.minutely.hasOwnProperty('summary')) {
        summaryMinutely = result.minutely.summary;
      }
    }
    else {
      summaryMinutely = result.currently.hasOwnProperty('summary') ? result.currently.summary : '-'
    }

    summaryHourlyF = result.hourly.hasOwnProperty('summary') ? result.hourly.summary : '-'
    summaryDailyF = result.daily.hasOwnProperty('summary') ? result.daily.summary : '-'

    summaryHourlyC = summaryUnitConvertor(result.hourly.summary);
    summaryDailyC = summaryUnitConvertor(result.daily.summary);

    current_tempF_max = Math.round(result.daily.data[0].temperatureMax);
    current_tempF_min = Math.round(result.daily.data[0].temperatureMin);                 

    current_tempC_max = f2c(current_tempF_max);
    current_tempC_min = f2c(current_tempF_min);

    uvCurrently = result.currently.hasOwnProperty('uvIndex') ? result.currently.uvIndex : '-'
    
    uv1 = Math.floor(uvCurrently * cloudAdjUV(icon,cloudCover));

    systemTime = new Date();
    utcSystemTime = new Date(new Date().toUTCString()).toISOString();
    updateTimeBadge = toTimestamp(utcSystemTime);


      chrome.storage.local.get(['setSettingUT', 'failedHTTP', 'country'], function(data) {
        setSettingUT = data.setSettingUT;
        failedHTTP = data.failedHTTP;
        country = data.country;
       
        if((setSettingUT == 'u' && failedHTTP == '0') || (failedHTTP == '1')) {
          iconBadge = icon;
          timeZone = result.offset * 3600;
          summaryBadge = summary;
          temperatureCbadge = temperatureC;
          temperatureFbadge = temperatureF;

          solarNighDay(timeZone,latlong);
          iconBadgeConvertDS(iconBadge);
          badgeGeneral(isDay,isNight,sunnyDayBadge,cloudyBadge,rainyBadge,snowyBadge,temperatureFbadge,temperatureCbadge,updateTimeBadge,citys,uv1);
        }


        resolve && resolve(result);

    });


  });

};