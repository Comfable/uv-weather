chrome.storage.local.get(['verUpdate'], function(data) {
	verUpdate = data.verUpdate;

	if(verUpdate !== 1 && verUpdate !== 2) {
			fetch('https://ipinfo.io/?token=6d819142de4288')
		  	.then((resp) => resp.json())
		  	 .then(function(result) {
		  	 	if(result) {
					countryAPI = JSON.stringify(result.country);
					country = (countryAPI.split('"'))[1];
					if(country == "ZZ") {
							country = " "
						}
					city = JSON.stringify(result.city);
					region = (JSON.stringify(result.region).split('"'))[1];
					latandlong = JSON.stringify(result.loc);
					fullname = ((city.split('"'))[1].charAt(0).toUpperCase() + (city.split('"'))[1].slice(1)) + ", " + region.toUpperCase() + ", " + country;
					chrome.storage.local.set({'city': city});
					chrome.storage.local.set({'latlong': latandlong});
					chrome.storage.local.set({'country': country});
					chrome.storage.local.set({'fullname': fullname});
					chrome.storage.local.set({'verUpdate': 1});					
						popupPage(city,latandlong,country);
				}
				else{
					city = '"Toronto"';
					latandlong = '"43.6629,-79.3987"';
					country = 'CA';											
					chrome.storage.local.set({'city': '"Toronto"'});
					chrome.storage.local.set({'latlong': '"43.6629,-79.3987"'});
					chrome.storage.local.set({'country': 'CA'});
					chrome.storage.local.set({'fullname': 'Toronto, ONTARIO, CA'});
					chrome.storage.local.set({'verUpdate': 1});
					popupPage(city,latandlong,country);
				}
			})
	}

});


chrome.runtime.onStartup.addListener(function(details) {
	chrome.storage.local.get(['latlong', 'city', 'country', 'setSettingUT'], function(data) { //update the extension
  			latandlong = data.latlong;
 			city = data.city;
 			country = data.country;

			if(data.setSettingUT == 'u') {
					popupPage(city,latandlong,country);
			}
			else {
					badgeTemp(city,latandlong,country);
			}

	});
});


chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason == "update" && (navigator.onLine)) {
			chrome.storage.local.get(['latlong', 'city', 'country'], function(data) { //update the extension
		  			latandlong = data.latlong;
		 			city = data.city;
		 			country = data.country;
					popupPage(city,latandlong,country);
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
				popupPage(city,latandlong,country);
			});
		}
	}
);


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.msg == "intervalUpdateMessage") {
			intervalUpdateFunction();
		}
	}
);

function intervalUpdateFunction() {
	chrome.storage.local.get(['IntervalUpdate', ''], function(data) {
		intervalUpdateNumber = data.IntervalUpdate;
		if(typeof intervalUpdateNumber == 'undefined') {
			var intervalUpdateNumber = 120;
			chrome.storage.local.set({'IntervalUpdate': '120'});
		};
		intervalUpdateTime = 1000 * 60 * intervalUpdateNumber; //miliseconds * seconds * minutes

		var intervalUpdateTimes = window.setInterval(_ => {

			if(navigator.onLine) {
				chrome.storage.local.get(['latlong', 'city', 'country', 'setSettingUT'], function(data){
					latandlong = data.latlong;
					city = data.city;
					country = data.country;
					if(data.setSettingUT == 'u') {
							popupPage(city,latandlong,country);
					}
					else {
							badgeTemp(city,latandlong,country);
					}
				});
			}
		}, intervalUpdateTime);
	});
};
intervalUpdateFunction();


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


//badgeDisplay----------------------------------------------------------------------------------
function badgeGeneral(isDay,isNight,sunnyDayBadge,cloudyBadge,rainyBadge,snowyBadge,temperatureFbadge,temperatureCbadge,uv1) {
		animatedBadgeInterval = setInterval(function() {animatedBadge(isDay,sunnyDayBadge,cloudyBadge,rainyBadge,snowyBadge); }, 1000 / 30);
		setTimeout(function(){
			clearInterval(animatedBadgeInterval);   
		}, 485);

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
		});


		currentWhiteIcon = 0;
		function badgeBackgroundImage(currentWhiteIcon) {
			
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
		}

		function badgeBackgroundColor() {
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
		}

		function tempc() {
			chrome.storage.local.get(['whiteIcon','badgeSize'], function(data) {
			  var currentWhiteIcon = data.whiteIcon;
			  var currentBadgeSize = data.badgeSize;
			  if(currentWhiteIcon == 0 || (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
			  	var currentWhiteIcon = 0;
			  } else{
			  	var currentWhiteIcon = 1;
			  }
			  	if(currentBadgeSize == 1) {
				  	setTimeout(function(){
				  		largBadgeNumber(temperatureCbadge, currentWhiteIcon)
					}, 550);
				  }
				  else{
					chrome.browserAction.setBadgeText({"text":temperatureCbadge +"°C" });
					badgeBackgroundColor();
					setTimeout(function(){
						badgeBackgroundImage(currentWhiteIcon);
					}, 550);   
				  }
			});

		};
									 
		function tempf() {
			chrome.storage.local.get(['whiteIcon','badgeSize'], function(data) {
			  var currentWhiteIcon = data.whiteIcon;
			  var currentBadgeSize = data.badgeSize;
			  if(currentWhiteIcon == 0 || (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
			  	var currentWhiteIcon = 0;
			  } else{
			  	var currentWhiteIcon = 1;
			  }
			  	if(currentBadgeSize == 1) {
				  	setTimeout(function(){
				  		largBadgeNumber(temperatureFbadge, currentWhiteIcon)
					}, 550);
				  }
				  else{
				  	chrome.browserAction.setBadgeText({"text":temperatureFbadge +"°F" });
				  	badgeBackgroundColor();
					setTimeout(function(){
						badgeBackgroundImage(currentWhiteIcon);
					}, 550);   
				  }
			});
		};

		function uvi() {
			chrome.storage.local.get(['whiteIcon','badgeSize'], function(data) {
			  var currentWhiteIcon = data.whiteIcon;
			  var currentBadgeSize = data.badgeSize;
			  if(currentWhiteIcon == 0 || (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
			  	var currentWhiteIcon = 0;
			  } else{
			  	var currentWhiteIcon = 1;
			  }
			  	if(currentBadgeSize == 1) {
				  	setTimeout(function(){
				  		largBadgeNumber(uv1, currentWhiteIcon)
					}, 550);
				  }
				  else{
				  	if(uv1>9) {
			          chrome.browserAction.setBadgeText({"text": "UV"+ uv1});
			        }
			        else {
			          chrome.browserAction.setBadgeText({"text": "UV "+ uv1});
			        }
			        badgeBackgroundColor();
			        setTimeout(function(){
						badgeBackgroundImage(currentWhiteIcon);
					}, 550);
				  }
			});

		}

		function UTFC() {
			chrome.storage.local.get(['setSettingFC', 'setSettingUT', 'TimeFormat'], function(data) {
				setSettingFC = data.setSettingFC;
				setSettingUT = data.setSettingUT;
		   		TimeFormat = data.TimeFormat;

				if(typeof setSettingFC === 'undefined') {
					if (country == "US" || country == "us" || country == "United States of America") {
							setSettingFC = "f";
							chrome.storage.local.set({'setSettingFC': 'f'});
							chrome.storage.local.set({'TimeFormat': '12h'});
						} else {
							setSettingFC = "c";
							chrome.storage.local.set({'setSettingFC': 'c'});
						if (country == "CA" || country == "ca" || country == "Canada") {
							chrome.storage.local.set({'TimeFormat': '12h'});
						}
						else {
							chrome.storage.local.set({'TimeFormat': '24h'});
						}
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
				

				if(TimeFormat == "24h") {						
					updateTimeRelativeBadge = dayjs.unix(updateTimeBadge).format('HH:mm');
				}
				else{
					updateTimeRelativeBadge = dayjs.unix(updateTimeBadge).format('h:mm A');
				}
				
				if(setSettingUT == "u" && setSettingFC == "f") {
					toolTipBadge = temperatureFbadge + "° " + capital_letter(descriptionBadge) + " - " + citys + "\n" + "Updated at " + updateTimeRelativeBadge;
					chrome.browserAction.setTitle({title: toolTipBadge});
					}
				else if(setSettingUT == "u" && setSettingFC == "c") {
					toolTipBadge = temperatureCbadge + "° " + capital_letter(descriptionBadge) + " - " + citys  + "\n" + "Updated at " + updateTimeRelativeBadge;
					chrome.browserAction.setTitle({title: toolTipBadge});
					}
				else if(setSettingUT == "t" && setSettingFC == "f") {
					toolTipBadge = temperatureFbadge + "° " + capital_letter(descriptionBadge) + " - " + citys  + "\n" + "Updated at " + updateTimeRelativeBadge;
					chrome.browserAction.setTitle({title: toolTipBadge});
					}
				else if(setSettingUT == "t" && setSettingFC == "c") {
					toolTipBadge = temperatureCbadge + "° " + capital_letter(descriptionBadge) + " - " + citys + "\n"  + "Updated at " + updateTimeRelativeBadge;
					chrome.browserAction.setTitle({title: toolTipBadge});
					};						

			});

		};
		

		if(navigator.onLine) {						
			utfc = UTFC(function(value){	
				});
		}

};


function badgeTemp(city,latandlong,country) {
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

	fetch('https://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + lng + '&appid=6761dd7f8d0c3c216f9af6813064f867')
	.then((resp) => resp.json())
	.then(function(resultBadge) {
		window.resultBadge = resultBadge;
		temperatureCbadge = Math.round((resultBadge.main.temp) - 273.15);
		temperatureFbadge = Math.round((1.8*temperatureCbadge) + 32);
		if(temperatureCbadge == '-0') {temperatureCbadge = 0};
		if(temperatureFbadge == '-0') {temperatureFbadge = 0};
		summaryBadge = resultBadge.weather[0].main;
		descriptionBadge = resultBadge.weather[0].description;
		updateTimeBadge = resultBadge.dt;
		timeZoneBadge = resultBadge.timezone;
		cloudCoverBadge = resultBadge.clouds.all;
		solarNighDay(timeZoneBadge,lat,lng);
		iconBadgeConvert(descriptionBadge,summaryBadge);
		badgeGeneral(isDay,isNight,sunnyDayBadge,cloudyBadge,rainyBadge,snowyBadge,temperatureFbadge,temperatureCbadge);	
	});	
};


//popupPage----------------------------------------------------------------------------------
function popupPage(city,latandlong,country) {
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

		fetch('https://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + lng + '&appid=6761dd7f8d0c3c216f9af6813064f867')
		.then((resp) => resp.json())
		.then(function(resultBadge) {
			window.resultBadge = resultBadge;
			temperatureCbadge = Math.round((resultBadge.main.temp) - 273.15);
			temperatureFbadge = Math.round((1.8*temperatureCbadge) + 32);
			if(temperatureCbadge == '-0') {temperatureCbadge = 0};
			if(temperatureFbadge == '-0') {temperatureFbadge = 0};
			summaryBadge = resultBadge.weather[0].main;
			descriptionBadge = resultBadge.weather[0].description;
			updateTimeBadge = resultBadge.dt;
			timeZoneBadge = resultBadge.timezone;
			cloudCoverBadge = resultBadge.clouds.all;
			solarNighDay(timeZoneBadge,lat,lng);
			iconBadgeConvert(descriptionBadge,summaryBadge);

				//popupPage
				const ads = '3dfc8ba9095bfa87462f459fc85238c6';	
				return fetch('https://uv-weather.herokuapp.com/https://api.darksky.net/forecast/' + ads +'/' + latlong + '?solar')
				.then((resp) => resp.json())
				.then(function(result) {				
					window.result = result;
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

					ghiSolarClearSki = result.hourly.data[0].hasOwnProperty('solar') ? result.hourly.data[0].solar.ghi : '-'; //GHI = DHI + DNI * cos (θ)

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

					forecast_0_tempF = Math.round(result.daily.data[0].temperatureMax);
					forecast_1_tempF = Math.round(result.daily.data[1].temperatureMax);

					update_tomorrow_is_f(forecast_1_tempF,forecast_0_tempF);
					update_tomorrow_is_c(forecast_1_tempF,forecast_0_tempF);

					if(iconBadge === "rain" || iconBadge === "sleet" || iconBadge === "snow")
						{cloudAdj = 0.31;}
					else if(cloudCoverBadge < 20)
						{cloudAdj = 1;}
					else if(cloudCoverBadge >= 20 && cloudCoverBadge < 70)
						{cloudAdj = 0.89;}
					else if(cloudCoverBadge >= 70 && cloudCoverBadge < 90)
						{cloudAdj = 0.73;}
					else if(cloudCoverBadge >= 90)
						{cloudAdj = 0.31;}
					else {cloudAdj = 1;}

					if(isNight) {
						uvCurrently = 0;
					}

					uv1 = Math.floor(uvCurrently * cloudAdj);

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

					badgeGeneral(isDay,isNight,sunnyDayBadge,cloudyBadge,rainyBadge,snowyBadge,temperatureFbadge,temperatureCbadge,uv1);

				})
				//popupPage
		})


};


chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install" && (navigator.onLine)) {
        var uninstallWebAddress = 'https://uvweather.net/goodbye/';
        var installWebAddress = 'https://uvweather.net/welcome/';
        chrome.tabs.create({ url: installWebAddress });
        if(chrome.runtime.setUninstallURL) {
        	chrome.storage.local.clear();
            chrome.runtime.setUninstallURL(uninstallWebAddress);
        }
    }
});