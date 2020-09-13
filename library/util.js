var context = document.createElement('canvas').getContext('2d');
var start = new Date();
var lines = 16,
cW = 40,
cH = 40;

function capital_letter(str) {
    str = str.split(" ");
    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }
    return str.join(" ");
};

function solarNighDay(timeZoneBadge,lat,lng) {
	isDay = false;
	isNight = false;
	cloudyBadge = false;
	sunnyDayBadge = false;
	rainyBadge = false;
	snowyBadge = false;

	//Solar Times --------------------------------------------------------------------------------------------------------------
		systemTime = new Date();
		systemTimeUnix = Math.round((systemTime).getTime() / 1000);
		DeviceTimeDifferenceFromGMT = systemTime.getTimezoneOffset() / 60;
	offsetTime = DeviceTimeDifferenceFromGMT + timeZoneBadge/3600;
		offsetUnix = offsetTime * 3600;
	localTimeUnix = Math.round(systemTimeUnix + offsetUnix);

	timesSolar = SunCalc.getTimes(localTimeUnix, lat, lng);
		sunriseTimeSolar = timesSolar.sunrise;
		sunsetTimeSolar = timesSolar.sunset;
		solarNoon = timesSolar.solarNoon;
		goldenHourEnd = timesSolar.goldenHourEnd;
		goldenHour = timesSolar.goldenHour;
		totalSeconds  = dayjs(dayjs.unix(sunsetTimeSolar)).diff(dayjs(dayjs.unix(sunriseTimeSolar)), 'second');
		totalHours = Math.floor(totalSeconds/(60*60));
		totalSeconds = totalSeconds - (totalHours*60*60);
		totalMinutes = Math.ceil(totalSeconds/60);
		if(totalHours<10) {totalHours = "0"+totalHours};
		if(totalMinutes<10) {totalMinutes = "0"+totalMinutes};
		dayLength =  totalHours + ":" + totalMinutes + " HH:MM";
		
		dawn = timesSolar.dawn;
		dusk = timesSolar.dusk;
		nightStarts = timesSolar.night;
		nightEnds = timesSolar.nightEnd;


		localTimeUnixDD = dayjs.unix(systemTimeUnix + offsetUnix).format('DD');
		localTimeUnixHH = dayjs.unix(systemTimeUnix + offsetUnix).format('HH');

		dawnDD = dayjs.unix(dawn + offsetUnix).format('DD');

		localTimeUnix = dayjs.unix(systemTimeUnix + offsetUnix);
		if(localTimeUnixDD !== dawnDD) {
			dawnDayjs = dayjs.unix(dawn + offsetUnix - 86400);
			duskDayjs = dayjs.unix(dusk + offsetUnix - 86400);
		}
		else{
			dawnDayjs = dayjs.unix(dawn + offsetUnix);
			duskDayjs = dayjs.unix(dusk + offsetUnix);
		}

		if(localTimeUnix >= dawnDayjs && localTimeUnix <= duskDayjs) {
		   	isDay = true;	
		} 
		else {
		    isNight = true;	
		}
};

function iconBadgeConvert(descriptionBadge,summaryBadge) {
	if(descriptionBadge === "overcast clouds" || descriptionBadge === "broken clouds") {
		iconBadge = 'cloudy';							
	}
	else if(summaryBadge === "Ash" || summaryBadge === "Sand" || summaryBadge === "Fog" || summaryBadge === "Dust" || summaryBadge === "Haze" || summaryBadge === "Smoke" || summaryBadge === "Mist") {
		iconBadge = 'fog';							
	}
	else if(summaryBadge === "Rain" || summaryBadge === "Thunderstorm" || summaryBadge === "Drizzle") {
		iconBadge = 'rain'; 
	}
	else if(summaryBadge === "Snow") {
		iconBadge = 'snow'; 
	}
	else if(summaryBadge === "Squall" || summaryBadge === "Tornado") {
		iconBadge = 'wind'; 
	}
	else if(descriptionBadge === "Sleet") {
		iconBadge = 'sleet'; 
	}
	else if((descriptionBadge === "few clouds" || descriptionBadge === "scattered clouds") && isDay) {
		iconBadge = 'partly-cloudy-day'; 
	}
	else if((descriptionBadge === "few clouds" || descriptionBadge === "scattered clouds") && isNight) {
		iconBadge = 'partly-cloudy-night'; 
	}
	else if(summaryBadge === "Clear" && isNight) {
		iconBadge = 'clear-night'; 
	}
	else if(summaryBadge === "Clear" && isDay) {
		iconBadge = 'clear-day'; 
	}


	if(iconBadge === "cloudy" || iconBadge === "partly-cloudy-day" || iconBadge === "partly-cloudy-night") {
		cloudyBadge  = true;							
	}
		else if (iconBadge === "rain"){
		rainyBadge  = true; 
	}
		else if (iconBadge === "snow" || iconBadge === "sleet"){
		snowyBadge  = true; 
	}	else {
		sunnyDayBadge  = true;
	};
};

function badgeBackgroundImage() {
	if(isDay && sunnyDayBadge && temperatureFbadge >= 50 && currentWhiteIcon == 0) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/sun-128.png"}})
		}
	else if(isDay && sunnyDayBadge && temperatureFbadge < 50 && currentWhiteIcon == 0) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/sun-cold-128.png"}})
		}
	else if(isDay && cloudyBadge && currentWhiteIcon == 0) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/cloud-day-128.png"}});
		}
	else if(isNight && cloudyBadge && currentWhiteIcon == 0) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/cloud-night-128.png"}});							     		
		}
	else if(isDay && rainyBadge && currentWhiteIcon == 0) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/rain-day-128.png"}});
		}
	else if(isNight && rainyBadge && currentWhiteIcon == 0) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/rain-night-128.png"}});
		}
	else if(isDay && snowyBadge && currentWhiteIcon == 0) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/snow-day-128.png"}});
		}
	else if(isNight && snowyBadge && currentWhiteIcon == 0) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/snow-night-128.png"}});
		}
	else if(currentWhiteIcon == 0) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/moon-128.png"}});
	}

	else if(isDay && sunnyDayBadge && temperatureFbadge >= 50 && currentWhiteIcon == 1) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/sun-dark-128.png"}})
		}
	else if(isDay && sunnyDayBadge && temperatureFbadge < 50 && currentWhiteIcon == 1) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/sun-dark-128.png"}})
		}	
	else if(isDay && cloudyBadge && currentWhiteIcon == 1) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/cloud-dark-128.png"}});
		}
	else if(isNight && cloudyBadge && currentWhiteIcon == 1) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/cloud-dark-128.png"}});							     		
		}
	else if(isDay && rainyBadge && currentWhiteIcon == 1) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/rain-dark-128.png"}});
		}
	else if(isNight && rainyBadge && currentWhiteIcon == 1) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/rain-dark-128.png"}});
		}
	else if(isDay && snowyBadge && currentWhiteIcon == 1) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/snow-dark-128.png"}});
		}
	else if(isNight && snowyBadge && currentWhiteIcon == 1) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/snow-dark-128.png"}});
		}	
	else if(currentWhiteIcon == 1) {
		chrome.browserAction.setIcon({path : { "128": "images/badge/moon-dark-128.png"}});
	}
};

function badgeBackgroundColor(currentWhiteIcon) {
	if(isDay && sunnyDayBadge && temperatureFbadge >= 50) {
		chrome.browserAction.setBadgeBackgroundColor({color: '#fc923b'});
		}
	else if(isDay && sunnyDayBadge && temperatureFbadge < 50) {
		chrome.browserAction.setBadgeBackgroundColor({color: '#f8bd90'});
		}			
	else if(isDay && cloudyBadge && currentWhiteIcon == 0) {
		chrome.browserAction.setBadgeBackgroundColor({color: '#549dd0'});
		}
	else if(isNight && cloudyBadge && currentWhiteIcon == 0) {
		chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
		}
	else if(isDay && rainyBadge && currentWhiteIcon == 0) {
		chrome.browserAction.setBadgeBackgroundColor({color: '#549dd0'});
		}
	else if(isNight && rainyBadge && currentWhiteIcon == 0) {
		chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
		}
	else if(isDay && snowyBadge && currentWhiteIcon == 0) {
		chrome.browserAction.setBadgeBackgroundColor({color: '#549dd0'});
		}
	else if(isNight && snowyBadge && currentWhiteIcon == 0) {
		chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
		}			
	else if(currentWhiteIcon == 0) {
		chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
	}
};


function animatedBadge(isDayBadge,sunnyDayBadge,cloudyBadge,rainyBadge,snowyBadge) {
	var rotation = parseInt(((new Date() - start) / 1000) * lines) / lines;
	context.save();
	context.clearRect(0, 0, cW, cH);
	context.translate(cW / 2, cH / 2);
	context.rotate(Math.PI * 2 * rotation);
	for (var i = 0; i < lines; i++) {
		context.beginPath();
		context.rotate(Math.PI * 2 / lines);
		context.moveTo(cW / 10, 0);
		context.lineTo(cW / 4, 0);
		context.lineWidth = cW / 30;
		if (isDayBadge && sunnyDayBadge) {
			context.strokeStyle = 'rgba(254, 102, 1,' + i / lines + ')';
		}
		else if (isDayBadge && (cloudyBadge || rainyBadge || snowyBadge)) {
			context.strokeStyle = 'rgba(31, 97, 143,' + i / lines + ')';
		}
		else {
			context.strokeStyle = 'rgba(0, 0, 0,' + i / lines + ')';
		}
		context.stroke();
	}

	var imageData = context.getImageData(10, 10, 19, 19);
	chrome.browserAction.setIcon({
		imageData: imageData
	});

	context.restore();
};

function largBadgeNumber(displayNumber, lightBadge) {
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.font = 'bold 18px Helvetica';

    if(lightBadge == 1) {
      ctx.fillStyle = 'rgb(255, 255, 255, 1)';
    } else {
      ctx.fillStyle = 'rgb(0, 0, 0, 0.8)';
    }

    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText(displayNumber, 9.5, 1, 19);
    chrome.browserAction.setIcon({
      imageData: ctx.getImageData(0, 0, 19, 19)
    });

	ctx.restore();
	
    chrome.browserAction.setBadgeText({
      text: ''
    });
};

function f2c(TempF) {
	var TempC = Math.round((Number(TempF) - 32) / 1.8);
	return (TempC);
};


function c2f(TempC) {
	var TempF = Math.round((1.8 * Number(TempC)) + 32);
	return (TempF);
};


function summaryUnitConvertor(summaryString) {
	var result = ''; var temperatureInC; 
	var tempString = summaryString.split(' ');
	for(var i = 0; i < tempString.length; i++){
		if(tempString[i].match(/F$/)){
			var x = tempString[i].split('');
			var evalNum = '';
			for(var j = 0; j < x.length; j++){
				var isItNumber = Number(x[j]);
				if(!isNaN(isItNumber)){  // if number, add
				evalNum += isItNumber.toString();
				}
			}
			temperatureInC = f2c(evalNum);
			tempString[i] = temperatureInC + "°C";
			break;
		}
	}
	// merge again
	for(i = 0; i < tempString.length; i++){
	result = result + tempString[i] + ' '; 
	}
	return result;
};


function iconTitleWeather(icon) {
	if (icon == 'clear-day' || icon == 'clear-night') {iconTitle = 'Clear'}
	else if  (icon == 'rain') {iconTitle = 'Rainy'}
	else if (icon == 'snow') {iconTitle = 'Snowy'}
	else if (icon == 'sleet') {iconTitle = 'Sleety'}
	else if (icon == 'wind') {iconTitle = 'Windy'}
	else if (icon == 'fog') {iconTitle = 'Foggy'}
	else if (icon == 'cloudy') {iconTitle = 'Cloudy'}
	else if (icon == 'partly-cloudy-day' || icon == 'partly-cloudy-night') {iconTitle = 'Partly Cloudy'}
	else {iconTitle = 'Sunny'}
	return iconTitle;
};


function uv_adj_daily(icon,cloudCover) {
	if (icon === "rain" || icon === "sleet" || icon === "snow")
			{cloudAdj_daily = 0.73;}
	else if (cloudCover < 20)
		{cloudAdj_daily = 1;}
	else if (cloudCover >= 20 && cloudCover < 70)
		{cloudAdj_daily = 0.89;}
	else if (cloudCover >= 70 && cloudCover < 90)
		{cloudAdj_daily = 0.73;}
	else if (cloudCover >= 90)
		{cloudAdj_daily = 0.73;}
	else
		{cloudAdj_daily = 1;}

	return (cloudAdj_daily);
};


function update_tomorrow_is_f(forecast_1_tempF,forecast_0_tempF) {
	temp_difference = (parseInt(Math.round(forecast_1_tempF)) - parseInt(Math.round(forecast_0_tempF)));

	if(temp_difference >= 2.4) {
		update_tomorrow_f = 'Tomorrow ' + Math.round(temp_difference)  + "°"+ ' warmer than today.'; 
	}
	else if(temp_difference > -2.4 && temp_difference < 2.4) {
			if(forecast_1_tempF >= 64) {
				update_tomorrow_f = 'Tomorrow is as warm as today.'; 
			}
			else {
				update_tomorrow_f = 'Tomorrow is as cool as today.'; 
			}
	}
	else if(temp_difference <= -2.4) {
		update_tomorrow_f = 'Tomorrow ' + Math.round(temp_difference)*-1 + "°"+' cooler than today.';  
	}
	else {
	 }
};


function update_tomorrow_is_c(forecast_1_tempF,forecast_0_tempF) {
	temp_difference = (parseInt(Math.round(forecast_1_tempF)) - parseInt(Math.round(forecast_0_tempF)));

	if(temp_difference >= 2.4) {
		update_tomorrow_c = 'Tomorrow ' + Math.round(temp_difference * 5/9)  + "°"+ ' warmer than today.'; 
		}
	else if(temp_difference > -2.4 && temp_difference < 2.4) {
			if(forecast_1_tempF >= 64) {
				update_tomorrow_c = 'Tomorrow is as warm as today.'; 
			}
			else {
				update_tomorrow_c = 'Tomorrow is as cool as today.'; 
			}
	}
	else if(temp_difference <= -2.4) {
		update_tomorrow_c = 'Tomorrow ' + Math.round(temp_difference * -5/9) + "°"+' cooler than today.';  
	}
	else {
	 }
};


function degToCompass(num) { 
    while( num < 0 ) num += 360 ;
    while( num >= 360 ) num -= 360 ; 
    val= Math.round( (num -11.25 ) / 22.5 ) ;
    arr=["North","North-northeast","Northeast","East-northeast","East","East-southeast", "Southeast", 
          "South-southeast","South","South-southwest","Southwest","West-southwest","West","West-northwest","Northwest","North-northwest"] ;
    return arr[ Math.abs(val) ] ;
};


function weatherEmoji(icon) {
	if (icon == 'clear-day') {currentEmoji = '😎'}
	else if (icon == 'clear-night') {currentEmoji = '🌚'}
	else if  (icon == 'rain') {currentEmoji = '☔️'}
	else if (icon == 'snow') {currentEmoji = '❄️'}
	else if (icon == 'sleet') {currentEmoji = '😱'}
	else if (icon == 'wind') {currentEmoji = '👻'}
	else if (icon == 'fog') {currentEmoji = '🌫'}
	else if (icon == 'cloudy') {currentEmoji = '☁️'}
	else if (icon == 'partly-cloudy-night') {currentEmoji = '☁️'}
	else if (icon == 'partly-cloudy-day') {currentEmoji = '🌤'}
	else {currentEmoji = '😎'}
	return currentEmoji;
};


function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}