//
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

function solarNighDay(timeZoneBadge,latlong) {
	isDay = false;
	isNight = false;
	cloudyBadge = false;
	sunnyDayBadge = false;
	rainyBadge = false;
	snowyBadge = false;
	lat = (latlong.split(','))[0];
	lng = (latlong.split(','))[1];

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
		totalSeconds  = moment(moment.unix(sunsetTimeSolar)).diff(moment(moment.unix(sunriseTimeSolar)), 'second');
		dayLengthHours = totalSeconds/3600;
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


		localTimeUnixDD = moment.unix(systemTimeUnix + offsetUnix).format('DD');
		localTimeUnixHH = moment.unix(systemTimeUnix + offsetUnix).format('HH');

		dawnDD = moment.unix(sunriseTimeSolar + offsetUnix).format('DD');

		localTimeString = moment.unix(systemTimeUnix + offsetUnix);
		if(localTimeUnixDD !== dawnDD) {
			dawnDayjs = moment.unix(((dawn + sunriseTimeSolar)/2) + offsetUnix - 86400);
			duskDayjs = moment.unix(((dusk + sunsetTimeSolar)/2) + offsetUnix - 86400);
		}
		else{
			dawnDayjs = moment.unix(((dawn + sunriseTimeSolar)/2) + offsetUnix);
			duskDayjs = moment.unix(((dusk + sunsetTimeSolar)/2) + offsetUnix);
		}

		if(localTimeString >= dawnDayjs && localTimeString <= duskDayjs) {
		   	isDay = true;
		} 
		else {
		    isNight = true;
		}
};


function iconBadgeConvertCA(iconCodeCA) {
	if(iconCodeCA == "03" || iconCodeCA == "10" || iconCodeCA == "33") {
		iconBadge = 'cloudy';
	}
	else if(iconCodeCA == "23" || iconCodeCA == "24" || iconCodeCA == "44" || iconCodeCA == "45" || iconCodeCA == "48") {
		iconBadge = 'fog';
	}
	else if(iconCodeCA == "06" || iconCodeCA == "07" || iconCodeCA == "11" || iconCodeCA == "12" || iconCodeCA == "13" || iconCodeCA == "19" || iconCodeCA == "28" || iconCodeCA == "36" || iconCodeCA == "37" || iconCodeCA == "38" || iconCodeCA == "39" || iconCodeCA == "46" || iconCodeCA == "47") {
		iconBadge = 'rain'; 
	}
	else if(iconCodeCA == "08" || iconCodeCA == "16" || iconCodeCA == "17" || iconCodeCA == "18" || iconCodeCA == "25" || iconCodeCA == "40") {
		iconBadge = 'snow';
	}
	else if(iconCodeCA == "41" || iconCodeCA == "42" || iconCodeCA == "43") {
		iconBadge = 'wind';
	}
	else if(iconCodeCA == "14" || iconCodeCA == "15" || iconCodeCA == "26" || iconCodeCA == "27") {
		iconBadge = 'sleet';
	}
	else if((iconCodeCA == "02" || iconCodeCA == "32") && isDay) {
		iconBadge = 'partly-cloudy-day';
	}
	else if((iconCodeCA == "02" || iconCodeCA == "32") && isNight) {
		iconBadge = 'partly-cloudy-night';
	}
	else if((iconCodeCA == "00" || iconCodeCA == "01" || iconCodeCA == "30" || iconCodeCA == "31" || iconCodeCA == "") && isNight) {
		iconBadge = 'clear-night';
	}
	else if((iconCodeCA == "00" || iconCodeCA == "01" || iconCodeCA == "30" || iconCodeCA == "31" || iconCodeCA == "") && isDay) {
		iconBadge = 'clear-day';
	}


	if(iconBadge === "cloudy" || iconBadge === "partly-cloudy-day" || iconBadge === "partly-cloudy-night" || iconBadge === "fog") {
		cloudyBadge  = true;							
	}
		else if(iconBadge === "rain") {
		rainyBadge  = true; 
	}
		else if(iconBadge === "snow" || iconBadge === "sleet") {
		snowyBadge  = true; 
	}	else {
		sunnyDayBadge  = true;
	};

};



function iconBadgeConvert(summaryBadge,summaryBadgeMain) {
	if(summaryBadge === "overcast clouds" || summaryBadge === "broken clouds") {
		iconBadge = 'cloudy';							
	}
	else if(summaryBadgeMain === "Ash" || summaryBadgeMain === "Sand" || summaryBadgeMain === "Fog" || summaryBadgeMain === "Dust" || summaryBadgeMain === "Haze" || summaryBadgeMain === "Smoke" || summaryBadgeMain === "Mist") {
		iconBadge = 'fog';							
	}
	else if(summaryBadgeMain === "Rain" || summaryBadgeMain === "Thunderstorm" || summaryBadgeMain === "Drizzle") {
		iconBadge = 'rain'; 
	}
	else if(summaryBadgeMain === "Snow") {
		iconBadge = 'snow'; 
	}
	else if(summaryBadgeMain === "Squall" || summaryBadgeMain === "Tornado") {
		iconBadge = 'wind'; 
	}
	else if(summaryBadge === "Sleet") {
		iconBadge = 'sleet'; 
	}
	else if((summaryBadge === "few clouds" || summaryBadge === "scattered clouds") && isDay) {
		iconBadge = 'partly-cloudy-day'; 
	}
	else if((summaryBadge === "few clouds" || summaryBadge === "scattered clouds") && isNight) {
		iconBadge = 'partly-cloudy-night'; 
	}
	else if((summaryBadgeMain === "Clear" && isNight)) {
		iconBadge = 'clear-night'; 
	}
	else if(summaryBadgeMain === "Clear" && isDay) {
		iconBadge = 'clear-day'; 
	}


	if(iconBadge === "cloudy" || iconBadge === "partly-cloudy-day" || iconBadge === "partly-cloudy-night" || iconBadge === "fog") {
		cloudyBadge  = true;							
	}
		else if(iconBadge === "rain") {
		rainyBadge  = true; 
	}
		else if(iconBadge === "snow" || iconBadge === "sleet") {
		snowyBadge  = true; 
	}	else {
		sunnyDayBadge  = true;
	};

};


function iconBadgeConvertDS(iconBadge) {
	if(iconBadge === "cloudy" || iconBadge === "partly-cloudy-day" || iconBadge === "partly-cloudy-night" || iconBadge === "fog") {
			cloudyBadge = true;							
		}
			else if(iconBadge=== "rain") {
			rainyBadge = true; 
		}
			else if(iconBadge=== "snow" || iconBadge=== "sleet") {
			snowyBadge = true; 
		}			
			else{
			sunnyDayBadge = true;
	};
};


function iconBadgeConvertUS(iconUS) {
	if(iconUS === "bkn" || iconUS === "ovc" || iconUS === "wind_bkn" || iconUS === "wind_ovc" || iconUS === "tsra" || iconUS === "tsra_sct") {
		iconBadge = 'cloudy';							
	}
	else if(iconUS === "dust" || iconUS === "smoke" || iconUS === "haze" || iconUS === "fog") {
		iconBadge = 'fog';							
	}
	else if(iconUS === "rain_snow" || iconUS === "rain_fzra" || iconUS === "rain" || iconUS === "rain_showers" || iconUS === "rain_showers_hi") {
		iconBadge = 'rain'; 
	}
	else if(iconUS === "snow" || iconUS === "snow_fzra" || iconUS === "blizzard") {
		iconBadge = 'snow'; 
	}
	else if(iconUS === "wind_skc" || iconUS === "wind_few" || iconUS === "tsra_hi" || iconUS === "tornado" || iconUS === "hurricane" || iconUS === "tropical_storm") {
		iconBadge = 'wind'; 
	}
	else if(iconUS === "rain_sleet" || iconUS === "fzra" || iconUS === "snow_sleet" || iconUS === "sleet") {
		iconBadge = 'sleet'; 
	}
	else if((iconUS === "wind_sct" || iconUS === "sct") && isDay) {
		iconBadge = 'partly-cloudy-day'; 
	}
	else if((iconUS === "wind_sct" || iconUS === "sct") && isNight) {
		iconBadge = 'partly-cloudy-night'; 
	}
	else if((iconUS === "skc" || iconUS === "few" || iconUS === "hot" || iconUS === "cold" || iconUS === "") && isNight) {
		iconBadge = 'clear-night'; 
	}
	else if((iconUS === "skc" || iconUS === "few" || iconUS === "hot" || iconUS === "cold" || iconUS === "") && isDay) {
		iconBadge = 'clear-day'; 
	}


	if(iconBadge === "cloudy" || iconBadge === "partly-cloudy-day" || iconBadge === "partly-cloudy-night" || iconBadge === "fog") {
		cloudyBadge  = true;							
	}
		else if(iconBadge === "rain") {
		rainyBadge  = true; 
	}
		else if(iconBadge === "snow" || iconBadge === "sleet") {
		snowyBadge  = true; 
	}	
		else{
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
		chrome.browserAction.setBadgeBackgroundColor({color: '#ffa25b'});
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
	return TempC;
};


function c2f(TempC) {
	var TempF = Math.round((1.8 * Number(TempC)) + 32);
	return TempF;
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


function degToCompass(num) { 
    while( num < 0 ) num += 360 ;
    while( num >= 360 ) num -= 360 ; 
    val= Math.round( (num -11.25 ) / 22.5 ) ;
    arr=["North","North-northeast","Northeast","East-northeast","East","East-southeast", "Southeast", 
          "South-southeast","South","South-southwest","Southwest","West-southwest","West","West-northwest","Northwest","North-northwest"] ;
    return arr[ Math.abs(val) ] ;
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
};


function xml2json(srcDOM) {
  let children = [...srcDOM.children];  
  if (!children.length) {
    return srcDOM.innerHTML
  }
  
  let jsonResult = {};  
  for (let child of children) {    
    let childIsArray = children.filter(eachChild => eachChild.nodeName === child.nodeName).length > 1;
    if (childIsArray) {
      if (jsonResult[child.nodeName] === undefined) {
        jsonResult[child.nodeName] = [xml2json(child)];
      } else {
        jsonResult[child.nodeName].push(xml2json(child));
      }
    } else {
      jsonResult[child.nodeName] = xml2json(child);
    }
  }  
  return jsonResult;
};


function closestLocation(targetLocation, locationData) {
    function vectorDistance(dx, dy) {
        return Math.sqrt(dx * dx + dy * dy);
    }

    function locationDistance(location1, location2) {
        var dx = location1.latitude - location2.latitude,
            dy = location1.longitude - location2.longitude;

        return vectorDistance(dx, dy);
    }

    return locationData.reduce(function(prev, curr) {
        var prevDistance = locationDistance(targetLocation , prev),
            currDistance = locationDistance(targetLocation , curr);
        return (prevDistance < currDistance) ? prev : curr;
    });
};


function cloudAdjUV(iconBadge,cloudCoverBadge) {
	if(iconBadge === "rain" || iconBadge === "sleet" || iconBadge === "snow") {
		cloudAdj = 0.31;
	}
	else if(cloudCoverBadge < 20) {
		cloudAdj = 1;
	}
	else if(cloudCoverBadge >= 20 && cloudCoverBadge < 70) {
		cloudAdj = 0.89;
	}
	else if(cloudCoverBadge >= 70 && cloudCoverBadge < 90) {
		cloudAdj = 0.73;
	}
	else if(cloudCoverBadge >= 90) {
		cloudAdj = 0.31;
	}
	else {cloudAdj = 1;
	}
	return cloudAdj;
};


function uv_note(uv1) {
	if(isNight) {
	  current_uv_note = (" (night)");
	  }
	else if(uv1 >= 0 && uv1 <= 2) {
	  current_uv_note = (" (Low)");
	  }
	else if(uv1 >= 3 && uv1 <= 5) {
	  current_uv_note = (" (Moderate)");
	  }
	else if(uv1 >= 6 && uv1 <= 7) {
	  current_uv_note = (" (High)");
	  }
	else if(uv1 >= 8 && uv1 <= 10) {
	  current_uv_note = (" (Very High)");
	  }
	else if(uv1 >= 11) {
	  current_uv_note = (" (Extreme)");
	  } 
	return current_uv_note;     
};


function toTimestamp(strDate){
  var datum = Date.parse(strDate);
  return datum/1000;
};

function CheckError(resp) {
  if (resp.status >= 200 && resp.status <= 299) {
    return resp.json();
  } else {
    throw Error(resp.statusText);
  }
};


const fetchWithTimeout = (uri, options = {}, time = 5000) => {
  // Lets set up our `AbortController`, and create a request options object
  // that includes the controller's `signal` to pass to `fetch`.
  const controller = new AbortController()
  const config = { ...options, signal: controller.signal }
  // Set a timeout limit for the request using `setTimeout`. If the body
  // of this timeout is reached before the request is completed, it will
  // be cancelled.
  const timeout = setTimeout(() => {
    controller.abort()
  }, time)
  return fetch(uri, config)
    .then((response) => {
      // Because _any_ response is considered a success to `fetch`, we
      // need to manually check that the response is in the 200 range.
      // This is typically how I handle that.
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }
      return response
    })
    .catch((error) => {
      // When we abort our `fetch`, the controller conveniently throws
      // a named error, allowing us to handle them separately from
      // other errors.
      if (error.name === 'AbortError') {
        throw new Error('Response timed out')
      }
      throw new Error(error.message)
    })
};