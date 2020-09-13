chrome.storage.local.get(['verUpdate'], function(data) {
	verUpdate = data.verUpdate;

	if(verUpdate !== 1 && verUpdate !== 2) {
			fetch('https://us-central1-uv-weather.cloudfunctions.net/geolocation')
		  	.then((resp) => resp.json())
		  	 .then(function(result) {
				countryAPI = JSON.stringify(result.country);
				country = (countryAPI.split('"'))[1];
				if(country == "ZZ") {
						country = " "
					}
				city = JSON.stringify(result.city);
				region = (JSON.stringify(result.region).split('"'))[1];
				latandlong = JSON.stringify(result.cityLatLong);
				fullname = ((city.split('"'))[1].charAt(0).toUpperCase() + (city.split('"'))[1].slice(1)) + ", " + region.toUpperCase() + ", " + country;
				chrome.storage.local.set({'city': city});
				chrome.storage.local.set({'latlong': latandlong});
				chrome.storage.local.set({'country': country});
				chrome.storage.local.set({'fullname': fullname});
				chrome.storage.local.set({'verUpdate': 1});
				uvReader(city,latandlong,country);
			})
	}
	else{
		chrome.storage.local.get(['latlong', 'city', 'country'], function(data) {
	  		latandlong = data.latlong;
	 		city = data.city;
	 		country = data.country;
	 		uvReader(city,latandlong,country);
		});	
	}
});


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.msg == "backgroundUpdate" && (navigator.onLine)) {
			chrome.storage.local.get(['latlong', 'city', 'country'], function(data) {
				latandlong = data.latlong;
		 		city = data.city;
		 		country = data.country;
				uvReader(city,latandlong,country);
			});
		}
	}
);


intervalUpdateTime = 1000 * 60 * 60; //miliseconds * seconds * minutes
var intervalUpdateTimes = window.setInterval(_ => {
	if(navigator.onLine) {
		chrome.storage.local.get(['latlong', 'city', 'country'], function(data){
			latandlong = data.latlong;
			city = data.city;
			country = data.country;
			uvReader(city,latandlong,country)
		});
	}
}, intervalUpdateTime);




//uvReader----------------------------------------------------------------------------------
function uvReader(city,latandlong,country) {

	country = country;

	cityName = (city.split('"'))[1].charAt(0).toUpperCase() + (city.split('"'))[1].slice(1);
	if(cityName && cityName.length > 15) {
		citys = cityName.substr(0,15)
	}
	else {
		citys = cityName
	}

	latlong = (latandlong.split('"'))[1];
	lat = (latlong.split(','))[0];
	lng = (latlong.split(','))[1];

	var weather_url = new URL('https://api.uvweather.net/uvweather');
		params = {lat: lat.toString(), lng: lng.toString()}
	Object.keys(params).forEach(key => weather_url.searchParams.append(key, params[key]))
	fetch(weather_url)
	.then((resp) => resp.json())
	.then(function(result) {				
		window.result = result;
		isDay = false;
		isNight = false;
		cloudy = false;
		sunnyDay = false;
		rainy = false;
		snowy = false;

			systemTime = new Date();
			systemTimeUnix = Math.round((systemTime).getTime() / 1000);
			DeviceTimeDifferenceFromGMT = systemTime.getTimezoneOffset() / 60;
		offsetTime = DeviceTimeDifferenceFromGMT + result.offset;
			offsetUnix = offsetTime * 3600;
		cloudCover = Math.round(result.currently.cloudCover * 100);
		icon = result.currently.icon;
		updateTime = result.currently.time;

		temperatureF =  Math.round(result.currently.temperature);
		temperatureC =  f2c(temperatureF);
		humidity = Math.round(100 * (result.currently.humidity));
		dewPointF = Math.round(result.currently.dewPoint);
		dewPointC = f2c(dewPointF);
		pressure = result.currently.hasOwnProperty('pressure') ? Math.round(result.currently.pressure) : '-';
		windSpeedMPH = Math.round(result.currently.windSpeed);
		windSpeedKMH = Math.round(windSpeedMPH * 1.609334);
			windSpeedMS10 = windSpeedMPH * 0.4470389;
			windSpeedMS10R = Math.round(windSpeedMPH * 0.4470389 * 10) / 10;
			windSpeedMS = windSpeedMS10 * 0.33; // on humun hieght an urban area
		windGustMPH = Math.round(result.currently.windGust);
		windGustKMH = Math.round(windGustMPH * 1.609334);
		windGustMS = Math.round(windGustMPH * 0.4470389 * 10) / 10;
		weatherEmojiIcon = weatherEmoji(icon);

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

		if(temperatureF > current_tempF_max) {
			temperatureF = current_tempF_max
			} 
		if(temperatureF < current_tempF_min) {
		temperatureF = current_tempF_min
			} 

		sunriseTime = result.daily.data[0].sunriseTime;
		sunsetTime = result.daily.data[0].sunsetTime;

		forecast_0_tempF = Math.round(result.daily.data[0].temperatureMax);
		forecast_1_tempF = Math.round(result.daily.data[1].temperatureMax);

		if(updateTime > sunriseTime && updateTime < sunsetTime) {

				isDay = true;					     	
			}
				else {
				isNight = true;							     	
			};

		if(icon === "cloudy" || icon === "partly-cloudy-day" || icon === "partly-cloudy-night") {
				cloudy = true;							
			}
				else if (icon=== "rain"){
				rainy = true; 
			}
				else if (icon=== "snow" || icon=== "sleet"){
				snowy = true; 
			}			else {
				sunnyDay = true;
		};


		animatedBadgeInterval = setInterval(function() {animatedBadge(isDay,sunnyDay,cloudy,rainy,snowy); }, 1000 / 30);


		function accufeelCalc() {

			if(result.hourly.data[0].hasOwnProperty('solar')) {
				ghiSolarClearSki = result.hourly.data[0].solar.ghi; //GHI = DHI + DNI * cos (θ)

				if (ghiSolarClearSki >=250) { 
					cloudAdj_hourly = uv_adj_daily(icon);
					ghiSolarCloud = ghiSolarClearSki * cloudAdj_hourly;
					TglobeC = 0.01498*ghiSolarCloud + 1.184*temperatureC - 0.0789*humidity - 2.739;	//day
				}
				 else {	//Low GHI
					TglobeC = temperatureC;
				}
			}
			else {
				TglobeC = temperatureC;	//night
			};
											
			Tmrta =	Math.pow(TglobeC + 273.15, 4) + (2.5 * 100000000 * Math.pow(windSpeedMS, 0.60) * (TglobeC - temperatureC));
			TmrtC =	Math.pow(Tmrta, 1/4) - 273.15;
							
			accufeelResultC = Math.round(accufeel(temperatureC, TmrtC, windSpeedMS, humidity));

			accufeelResultF = c2f(accufeelResultC);
		}
		accufeelCalc();

		//Solar Times --------------------------------------------------------------------------------------------------------------
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

			dusk = timesSolar.dusk;
			dawn = timesSolar.dawn;
			nightStarts = timesSolar.night;
			nightEnds = timesSolar.nightEnd;



		iconTitleWeather(icon);

		update_tomorrow_is_f(forecast_1_tempF,forecast_0_tempF);

		update_tomorrow_is_c(forecast_1_tempF,forecast_0_tempF);

		
		if(icon === "rain" || icon === "sleet" || icon === "snow")
			{cloudAdj = 0.31;}
		else if(cloudCover < 20)
			{cloudAdj = 1;}
		else if(cloudCover >= 20 && cloudCover < 70)
			{cloudAdj = 0.89;}
		else if(cloudCover >= 70 && cloudCover < 90)
			{cloudAdj = 0.73;}
		else if(cloudCover >= 90)
			{cloudAdj = 0.31;}
		else {cloudAdj = 1;}

		uv1 = Math.round(uvCurrently * cloudAdj);

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
			};
		  	

		currentWhiteIcon = 0;

		function badgeBackgroundImage(currentWhiteIcon) {
			
			if(isDay && sunnyDay && temperatureF >= 50 && currentWhiteIcon == 0) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#fc923b'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/sun-128.png"}})
				}
			else if(isDay && sunnyDay && temperatureF < 50 && currentWhiteIcon == 0) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#f8bd90'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/sun-cold-128.png"}})
				}			
			else if(isDay && cloudy && currentWhiteIcon == 0) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#549dd0'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/cloud-day-128.png"}});
				}
			else if(isNight && cloudy && currentWhiteIcon == 0) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/cloud-night-128.png"}});							     		
				}
			else if(isDay && rainy && currentWhiteIcon == 0) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#549dd0'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/rain-day-128.png"}});
				}
			else if(isNight && rainy && currentWhiteIcon == 0) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/rain-night-128.png"}});
				}
			else if(isDay && snowy && currentWhiteIcon == 0) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#549dd0'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/snow-day-128.png"}});
				}
			else if(isNight && snowy && currentWhiteIcon == 0) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/snow-night-128.png"}});
				}			
			else if(currentWhiteIcon == 0) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/moon-128.png"}});
			}


			else if(isDay && sunnyDay && temperatureF >= 50 && currentWhiteIcon == 1) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#fc923b'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/sun-dark-128.png"}})
				}
			else if(isDay && sunnyDay && temperatureF < 50 && currentWhiteIcon == 1) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#f8bd90'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/sun-dark-128.png"}})
				}			
			else if(isDay && cloudy && currentWhiteIcon == 1) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#549dd0'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/cloud-dark-128.png"}});
				}
			else if(isNight && cloudy && currentWhiteIcon == 1) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/cloud-dark-128.png"}});							     		
				}
			else if(isDay && rainy && currentWhiteIcon == 1) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#549dd0'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/rain-dark-128.png"}});
				}
			else if(isNight && rainy && currentWhiteIcon == 1) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/rain-dark-128.png"}});
				}
			else if(isDay && snowy && currentWhiteIcon == 1) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#549dd0'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/snow-dark-128.png"}});
				}
			else if(isNight && snowy && currentWhiteIcon == 1) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/snow-dark-128.png"}});
				}			
			else if(currentWhiteIcon == 1) {
				chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
				chrome.browserAction.setIcon({path : { "128": "images/badge/moon-dark-128.png"}});
			}
		}



		function tempc() {
			chrome.browserAction.setBadgeText({"text":temperatureC +"°C" });
			
			chrome.storage.local.get('whiteIcon', function(data) {
			  var currentWhiteIcon = data.whiteIcon;
			  if(currentWhiteIcon == 0 || (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
			  	var currentWhiteIcon = 0;
			  } else{
			  	var currentWhiteIcon = 1;
			  }
				badgeBackgroundImage(currentWhiteIcon);
			});

		}
									 
		function tempf() {
			chrome.browserAction.setBadgeText({"text":temperatureF +"°F" });

			chrome.storage.local.get('whiteIcon', function(data) {
			  var currentWhiteIcon = data.whiteIcon;
			  if(currentWhiteIcon == 0 || (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
			  	var currentWhiteIcon = 0;
			  } else{
			  	var currentWhiteIcon = 1;
			  }
				badgeBackgroundImage(currentWhiteIcon);
			});

		}

		function uvi() {
			if(uv1>9) {
	          chrome.browserAction.setBadgeText({"text": "UV"+ uv1});
	        }
	        else {
	          chrome.browserAction.setBadgeText({"text": "UV "+ uv1});
	        }

			chrome.storage.local.get('whiteIcon', function(data) {
			  var currentWhiteIcon = data.whiteIcon;
			  if(currentWhiteIcon == 0 || (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
			  	var currentWhiteIcon = 0;
			  } else{
			  	var currentWhiteIcon = 1;
			  }
				badgeBackgroundImage(currentWhiteIcon);
			});

		}


		function UTFC() {
		
			chrome.storage.local.get(['setSettingFC', 'setSettingUT'], function(data) {
			setSettingFC = data.setSettingFC;
			setSettingUT = data.setSettingUT;
	   		

			if(typeof setSettingFC === 'undefined') {
				if (country == "US" || country == "us" || country == "United States of America") {
					setSettingFC = "f";
					chrome.storage.local.set({'setSettingFC': 'f'});
					} else {
					setSettingFC = "c";
					chrome.storage.local.set({'setSettingFC': 'c'});
				}
			}

			if(typeof setSettingUT === 'undefined') {
				setSettingUT = "t";
				chrome.storage.local.set({'setSettingUT': 't'});
				if (country == "US" || country == "us" || country == "United States of America") {
					tempf ();
					} else {
						tempc ();
					 }
				}
			else {
				if(setSettingUT == "t") {
					if (setSettingFC == "f") {
						tempf ();}
					else {
					tempc ();}
				}
				else {
					uvi ();
				};
			}
										
				updateTimeRelativeBadge = dayjs.unix(updateTime + offsetUnix).format('h:mm A');
				if(setSettingUT == "u" && setSettingFC == "f") {
					toolTipBadge = temperatureF + "° " + summary + "\n" + accufeelResultF + "° " + " AccuFeel " + "\n" + uv1 + " UVI " + current_uv_note + "\n" + "Updated at " + updateTimeRelativeBadge;
					chrome.browserAction.setTitle({title: toolTipBadge});
					}
				else if(setSettingUT == "u" && setSettingFC == "c") {
					toolTipBadge = temperatureC + "° " + summary + "\n" + accufeelResultC + "° " + " AccuFeel " + "\n" + uv1 + " UVI " + current_uv_note + "\n" + "Updated at " + updateTimeRelativeBadge;
					chrome.browserAction.setTitle({title: toolTipBadge});
					}
				else if(setSettingUT == "t" && setSettingFC == "f") {
					toolTipBadge = temperatureF + "° " + summary + "\n" + accufeelResultF + "° " + " AccuFeel " + "\n" + uv1 + " UVI " + current_uv_note + "\n" + "Updated at " + updateTimeRelativeBadge;
					chrome.browserAction.setTitle({title: toolTipBadge});
					}
				else if(setSettingUT == "t" && setSettingFC == "c") {
					toolTipBadge = temperatureC + "° " + summary + "\n" + accufeelResultC + "° " + " AccuFeel " + "\n" + uv1 + " UVI " + current_uv_note + "\n" + "Updated at " + updateTimeRelativeBadge;
					chrome.browserAction.setTitle({title: toolTipBadge});
					};
				return;
			});

		}
		
		if(navigator.onLine) {						
			utfc = UTFC(function(value){	
				});

			setTimeout(function(){
				clearInterval(animatedBadgeInterval);   
				}, 500);


			chrome.storage.local.get('whiteIcon', function(data) {
			  var currentWhiteIcon = data.whiteIcon;
			  if((window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) && (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
			  	var currentWhiteIcon = 0;
			  }
			  else if((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) && (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
			  	var currentWhiteIcon = 1;
			  	chrome.storage.local.set({'whiteIcon': '1'});
			  }
			  else if((window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) && currentWhiteIcon == 0) {
			  	var currentWhiteIcon = 0;
			  } 
			  else if((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) && currentWhiteIcon == 1) {
			  	var currentWhiteIcon = 1;
			  	chrome.storage.local.set({'whiteIcon': '1'});
			  }

			setTimeout(function(){
				badgeBackgroundImage(currentWhiteIcon);   
				}, 550);
			});

		}


	})

}; 


			


/* Check whether new version is installed */
chrome.runtime.onInstalled.addListener(function(details) {
    /* other 'reason's include 'update' */
    if(details.reason == "install" && (navigator.onLine)) {
        /* If first install, set uninstall URL */
        var uninstallGoogleFormLink = 'https://uvweather.net/goodbye/';
        /* If Chrome version supports it... */
        if(chrome.runtime.setUninstallURL) {
        	chrome.storage.local.clear();
            chrome.runtime.setUninstallURL(uninstallGoogleFormLink);
        }
    }
});