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
					badgeUV(city,latandlong,country);
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
					badgeUV(city,latandlong,country);
				}
			})
	}

});


chrome.runtime.onStartup.addListener(function(details) {
	chrome.storage.local.get(['latlong', 'city', 'country', 'setSettingUT'], function(data) { 
  			latandlong = data.latlong;
 			city = data.city;
 			country = data.country;

			if(data.setSettingUT == 'u') {
					badgeUV(city,latandlong,country);
			}
			else {
					badgeTemp(city,latandlong,country);
			}

	});
});


chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason == "update") {
			chrome.storage.local.get(['latlong', 'city', 'country', 'setSettingUT'], function(data) {
		  			latandlong = data.latlong;
		 			city = data.city;
		 			country = data.country;
					if(data.setSettingUT == 'u') {
							badgeUV(city,latandlong,country);
					}
					else {
							badgeTemp(city,latandlong,country);
					}
			});
	}
});


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

				chrome.storage.local.get(['latlong', 'city', 'country', 'setSettingUT'], function(data){
					latandlong = data.latlong;
					city = data.city;
					country = data.country;
					if(data.setSettingUT == 'u') {
							badgeUV(city,latandlong,country);
					}
					else {
							badgeTemp(city,latandlong,country);
					}
				});
		}, intervalUpdateTime);
	});
};
intervalUpdateFunction();


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


		function tempc() {
			chrome.storage.local.get(['whiteIcon','badgeSize'], function(data) {
			  currentWhiteIcon = data.whiteIcon;
			  currentBadgeSize = data.badgeSize;

			  if(currentWhiteIcon == 0 || (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
			  	currentWhiteIcon = 0;
			  } else{
			  	currentWhiteIcon = 1;
			  }
			  	if(currentBadgeSize == 1) {
				  	setTimeout(function(){
				  		largBadgeNumber(temperatureCbadge, currentWhiteIcon)
					}, 550);
				  }
				  else{
					chrome.browserAction.setBadgeText({"text":temperatureCbadge +"°C" });
					badgeBackgroundColor(currentWhiteIcon);
					setTimeout(function(){
						badgeBackgroundImage();
					}, 550);   
				  }
			});
		};
									 
		function tempf() {
			chrome.storage.local.get(['whiteIcon','badgeSize'], function(data) {
			  currentWhiteIcon = data.whiteIcon;
			  currentBadgeSize = data.badgeSize;
			  if(currentWhiteIcon == 0 || (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
			  	currentWhiteIcon = 0;
			  } else{
			  	currentWhiteIcon = 1;
			  }
			  	if(currentBadgeSize == 1) {
				  	setTimeout(function(){
				  		largBadgeNumber(temperatureFbadge, currentWhiteIcon)
					}, 550);
				  }
				  else{
				  	chrome.browserAction.setBadgeText({"text":temperatureFbadge +"°F" });
				  	badgeBackgroundColor(currentWhiteIcon);
					setTimeout(function(){
						badgeBackgroundImage();
					}, 550);   
				  }
			});
		};

		function uvi() {
			chrome.storage.local.get(['whiteIcon','badgeSize'], function(data) {
			  currentWhiteIcon = data.whiteIcon;
			  currentBadgeSize = data.badgeSize;
			  if(currentWhiteIcon == 0 || (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
			  	currentWhiteIcon = 0;
			  } else{
			  	currentWhiteIcon = 1;
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
			        badgeBackgroundColor(currentWhiteIcon);
			        setTimeout(function(){
						badgeBackgroundImage();
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
					if(country == "US" || country == "us" || country == "United States of America") {
							setSettingFC = "f";
							chrome.storage.local.set({'setSettingFC': 'f'});
							chrome.storage.local.set({'TimeFormat': '12h'});
						} else {
							setSettingFC = "c";
							chrome.storage.local.set({'setSettingFC': 'c'});
						if(country == "CA" || country == "ca" || country == "Canada") {
							chrome.storage.local.set({'TimeFormat': '12h'});
						}
						else{
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
		
			utfc = UTFC(function(value){	
				});
};


function badgeTemp(city,latandlong,country) {
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

    if(country == "US" || country == "us" || country == "United States of America" || country == "CA" || country == "ca" || country == "Canada") {
      owmAPIback = 'https://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + lng + '&appid=6761dd7f8d0c3c216f9af6813064f867';
    }
    else{
      owmAPIback = 'https://uv-weather.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + lng + '&appid=6761dd7f8d0c3c216f9af6813064f867';
    }

	fetch(owmAPIback)
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


//badgeUV----------------------------------------------------------------------------------
function badgeUV(city,latandlong,country) {
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

	    if(country == "US" || country == "us" || country == "United States of America" || country == "CA" || country == "ca" || country == "Canada") {
	      owmAPIback = 'https://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + lng + '&appid=6761dd7f8d0c3c216f9af6813064f867';
	    }
	    else{
	      owmAPIback = 'https://uv-weather.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + lng + '&appid=6761dd7f8d0c3c216f9af6813064f867';
	    }

		fetch(owmAPIback)
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

				const ads = '3dfc8ba9095bfa87462f459fc85238c6';	
				return fetch('https://uv-weather.herokuapp.com/https://api.darksky.net/forecast/' + ads +'/' + latlong + '?solar')
				.then((resp) => resp.json())
				.then(function(result) {				
					window.result = result;

					uvCurrently = result.currently.hasOwnProperty('uvIndex') ? result.currently.uvIndex : '-'

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
					badgeGeneral(isDay,isNight,sunnyDayBadge,cloudyBadge,rainyBadge,snowyBadge,temperatureFbadge,temperatureCbadge,uv1);

				})
		})
};


chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install") {
        var uninstallWebAddress = 'https://uvweather.net/goodbye/';
        var installWebAddress = 'https://uvweather.net/welcome/';
        chrome.tabs.create({ url: installWebAddress });
        if(chrome.runtime.setUninstallURL) {
        	chrome.storage.local.clear();
            chrome.runtime.setUninstallURL(uninstallWebAddress);
        }
    }
});