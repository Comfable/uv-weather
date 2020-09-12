	var fromSearchs;

	chrome.runtime.onInstalled.addListener(function(details){
	    if(details.reason == "install"){
			chrome.storage.local.set({'fromSearch': "locationIP"});
	        //console.log("This is a first install!");
	    }else if(details.reason == "update"){
	        var thisVersion = chrome.runtime.getManifest().version;
	        //console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
	    }
	});

//geoReader----------------------------------------------------------------------------------
 function geoReader(){
  		return new Promise((resolve, reject) => {
		var url = "https://us-central1-swift-district-134123.cloudfunctions.net/gfc-geo";
		$.ajax({
			type: "GET",
			dataType: "json",
			url: url,
			success: function(result) {
				resolve(result);
				},

			// error: function(error) {
			// 	reject(error)
			// 	}
			})
		})
  }


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
			if(request.msg == "fromSearchUpdate"){
					chrome.storage.local.get(['latlongPopup', 'cityPopup', 'countryPopup'], function(data){
					  		latandlong = data.latlongPopup;
					 		city = data.cityPopup;
					 		country = data.countryPopup;		 		
					 		uvReader(city,latandlong,country);
					 			
				});
			}
	}
);

chrome.storage.local.get('fromSearch', function(data){
fromSearchs = data.fromSearch;
				
	if (fromSearchs !== "locationSearch"){

		async function geoReaderResult(){

				var geoReaderResponse = await geoReader();
				countryAPI = JSON.stringify(geoReaderResponse.country);
				country = (countryAPI.split('"'))[1];
				city = JSON.stringify(geoReaderResponse.city);
				latandlong = JSON.stringify(geoReaderResponse.cityLatLong);
				uvReader(city,latandlong,country);
		}
		geoReaderResult();
	}

else{

	chrome.storage.local.get(['latlongPopup', 'cityPopup', 'countryPopup'], function(data){
		latandlong = data.latlongPopup;
		city = data.cityPopup;
		country = data.countryPopup;		 		
		uvReader(city,latandlong,country);				 			
	});
}	


});


//uvReader----------------------------------------------------------------------------------
function uvReader(city,latandlong,country) {

	country = country;

		cityName = (city.split('"'))[1].charAt(0).toUpperCase() + (city.split('"'))[1].slice(1);
		if (cityName && cityName.length > 15) {
			citys = cityName.substr(0,15)
		}
		else {
			citys = cityName
		}

		latlong = (latandlong.split('"'))[1];
		lat = (latlong.split(','))[0];
		lon = (latlong.split(','))[1];

		//return new Promise((resolve, reject) => {
			var url = 'https://api.darksky.net/forecast/c6f8f1ec6de2f17011eb59c6a0e4db7a/' + latlong + '?solar';

			$.ajax({
				type: "GET",
				dataType: "json",
				url: url,
				success: function(result) {
				
	
	window.result = result;

	var isDay = false;
	var isNight = false;
	var cloudy = false;
	var sunnyDay = false;
	var rainy = false;
	var snowy = false;

		systemTime = new Date();
		systemTimeUnix = Math.round((systemTime).getTime() / 1000);
		DeviceTimeDifferenceFromGMT = Math.round(systemTime.getTimezoneOffset() / 60);
		
	offsetTime = DeviceTimeDifferenceFromGMT + result.offset;
		offsetUnix = offsetTime * 3600;
	cloudCover = result.currently.cloudCover;
	icon = result.currently.icon;
	updateTime = result.currently.time;

	temperatureF =  Math.round(result.currently.temperature);
	temperatureC =  f2c(temperatureF);
	humidity = 100 * (result.currently.humidity);
	dewPoint = Math.round(result.currently.dewPoint);
	pressure = result.currently.pressure;
	windSpeedMPH = result.currently.windSpeed; //miles per hour
		windSpeedMS10 = windSpeedMPH * 0.4470389; //meter per second
		windSpeedMS = windSpeedMS10 * 0.33; // on humun hieght an urban area
	cloudCover = result.currently.cloudCover;
	summary = result.currently.summary;
	summaryHourlyF = result.hourly.summary;
	summaryDailyF = result.daily.summary;
	summaryHourlyC = summaryUnitConvertor(result.hourly.summary);
	summaryDailyC = summaryUnitConvertor(result.daily.summary);
	current_tempF_max = Math.round(result.daily.data[0].temperatureMax);
	current_tempF_min = Math.round(result.daily.data[0].temperatureMin);							   

	current_tempC_max = f2c(current_tempF_max);
	current_tempC_min = f2c(current_tempF_min);

	uvCurrently = result.currently.uvIndex;

	if (temperatureF > current_tempF_max){
		temperatureF = current_tempF_max
		} 
	if (temperatureF < current_tempF_min){
	temperatureF = current_tempF_min
		} 

	sunriseTime = result.daily.data[0].sunriseTime;
	sunsetTime = result.daily.data[0].sunsetTime;

	forecast_0_tempF = Math.round(result.daily.data[0].temperatureMax);
	forecast_1_tempF = Math.round(result.daily.data[1].temperatureMax);

	if (updateTime > sunriseTime && updateTime < sunsetTime) {
			isDay = true;							     	
		}
			else {
			isNight = true;							     	
		};

	if (icon === "cloudy" || icon === "partly-cloudy-day" || icon === "partly-cloudy-night") {
			cloudy = true;							
		}
			else if (icon=== "rain" || icon=== "sleet"){
			rainy = true; 
		}
			else if (icon=== "snow"){
			snowy = true; 
		}			else {
			sunnyDay = true;
	};


	animatedBadgeInterval = setInterval(function() {animatedBadge(isDay,sunnyDay,cloudy,rainy,snowy); }, 1000 / 30);


	function accufeelCalc() {

		if (result.hourly.data[0].hasOwnProperty('solar')) {
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
	timesSolar = SunCalc.getTimes(localTimeUnix, lat, lon);
		sunriseTimeSolar = timesSolar.sunrise;
		sunsetTimeSolar = timesSolar.sunset;
		solarNoon = timesSolar.solarNoon;
		goldenHourEnd = timesSolar.goldenHourEnd;
		goldenHour = timesSolar.goldenHour;
		//dayLength = moment.utc(dayjs.unix(sunsetTimeSolar).diff(dayjs.unix(sunriseTimeSolar))).format("HH:mm") + " HH:MM";
		totalSeconds  = dayjs(dayjs.unix(sunsetTimeSolar)).diff(dayjs(dayjs.unix(sunriseTimeSolar)), 'second');
		totalHours = Math.floor(totalSeconds/(60*60));
		totalSeconds = totalSeconds - (totalHours*60*60);
		totalMinutes = Math.ceil(totalSeconds/60);
		if (totalHours<10) {totalHours = "0"+totalHours};
		if (totalMinutes<10) {totalMinutes = "0"+totalMinutes};
		dayLength =  totalHours + ":" + totalMinutes + " HH:MM";

		dusk = timesSolar.dusk;
		dawn = timesSolar.dawn;
		nightStarts = timesSolar.night;
		nightEnds = timesSolar.nightEnd;

		


	iconTitleWeather(icon);

	update_tomorrow_is_f(forecast_1_tempF,forecast_0_tempF);

	update_tomorrow_is_c(forecast_1_tempF,forecast_0_tempF);

	
	if (icon === "rain" || icon === "sleet" || icon === "snow")
		{cloudAdj = 0.31;}
	else if (cloudCover < 0.2)
		{cloudAdj = 1;}
	else if (cloudCover >= 0.2 && cloudCover < 0.7)
		{cloudAdj = 0.89;}
	else if (cloudCover >= 0.7 && cloudCover < 0.9)
		{cloudAdj = 0.73;}
	else if (cloudCover >= 0.9)
		{cloudAdj = 0.31;}
	else {cloudAdj = 1;}

	uv1 = Math.round(uvCurrently * cloudAdj);

	if (isNight) {
		current_uv_note = (" (Night)");
		}
	else if (uv1 >= 0 && uv1 <= 2) {
		current_uv_note = (" (Low)");
		}
	else if (uv1 >= 3 && uv1 <= 5) {
		current_uv_note = (" (Moderate)");
		}
	else if (uv1 >= 6 && uv1 <= 7) {
		current_uv_note = (" (High)");
		}
	else if (uv1 >= 8 && uv1 <= 10) {
		current_uv_note = (" (Very High)");
		}
	else if (uv1 >= 11) {
		current_uv_note = (" (Extreme)");
		};



	function badgeBackgroundImage(){
		if (isDay && sunnyDay){
			chrome.browserAction.setBadgeBackgroundColor({color: '#fc923b'});
			chrome.browserAction.setIcon({path : { "128": "images/sun-128.png"}})
			}
		else if (isDay && cloudy){
			chrome.browserAction.setBadgeBackgroundColor({color: '#549dd0'});
			chrome.browserAction.setIcon({path : { "128": "images/cloud-day-128.png"}});
			}
		else if (isNight && cloudy){
			chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
			chrome.browserAction.setIcon({path : { "128": "images/cloud-night-128.png"}});							     		
			}
		else if (isDay && rainy){
			chrome.browserAction.setBadgeBackgroundColor({color: '#549dd0'});
			chrome.browserAction.setIcon({path : { "128": "images/rain-day-128.png"}});
			}
		else if (isNight && rainy){
			chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
			chrome.browserAction.setIcon({path : { "128": "images/rain-night-128.png"}});
			}
		else if (isDay && snowy){
			chrome.browserAction.setBadgeBackgroundColor({color: '#549dd0'});
			chrome.browserAction.setIcon({path : { "128": "images/snow-day-128.png"}});
			}
		else if (isNight && snowy){
			chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
			chrome.browserAction.setIcon({path : { "128": "images/snow-night-128.png"}});
			}			
		else {
			chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
			chrome.browserAction.setIcon({path : { "128": "images/moon-128.png"}});
		}
	}


	function tempc(){
		chrome.browserAction.setBadgeText({"text":temperatureC +"°C" });
		badgeBackgroundImage();
	}
								 
	function tempf(){
		chrome.browserAction.setBadgeText({"text":temperatureF +"°F" });
		badgeBackgroundImage();
	}

	function uvi(){
		if (uv1>9) {
          chrome.browserAction.setBadgeText({"text": "UV"+ uv1});
        }
        else {
          chrome.browserAction.setBadgeText({"text": "UV "+ uv1});
        }
		badgeBackgroundImage();
	}


	function UTFC() {
	
		chrome.storage.local.get(['setSettingFC', 'setSettingUT'], function(data) {
		setSettingFC = data.setSettingFC;
		setSettingUT = data.setSettingUT;
   		

		if (typeof setSettingFC === 'undefined') {
			if (country == "US" || country == "us" || country == "United States of America") {
				setSettingFC = "f";
				chrome.storage.local.set({'setSettingFC': 'f'});
				} else {
				setSettingFC = "c";
				chrome.storage.local.set({'setSettingFC': 'c'});
			}
		}

		if (typeof setSettingUT === 'undefined') {
			setSettingUT = "t";
			chrome.storage.local.set({'setSettingUT': 't'});
			if (country == "US" || country == "us" || country == "United States of America") {
				tempf ();
				} else {
					tempc ();
				 }
			}
		else {
			if (setSettingUT == "t") {
				if (setSettingFC == "f") {
					tempf ();}
				else {
				tempc ();}
			}
			else {
				uvi ();
			};
		}
									
			updateTimeRelativeBadge = dayjs.unix(updateTime + offsetUnix).format('h:mm:ss A');
			if (setSettingUT == "u" && setSettingFC == "f") {
				toolTipBadge = temperatureF + "° " + summary + "\n" + accufeelResultF + "° " + " AccuFeel " + "\n" + uv1 + " UVI " + current_uv_note + "\n" + "Updated at " + updateTimeRelativeBadge;
				chrome.browserAction.setTitle({title: toolTipBadge});
				}
			else if (setSettingUT == "u" && setSettingFC == "c") {
				toolTipBadge = temperatureC + "° " + summary + "\n" + accufeelResultC + "° " + " AccuFeel " + "\n" + uv1 + " UVI " + current_uv_note + "\n" + "Updated at " + updateTimeRelativeBadge;
				chrome.browserAction.setTitle({title: toolTipBadge});
				}
			else if (setSettingUT == "t" && setSettingFC == "f") {
				toolTipBadge = temperatureF + "° " + summary + "\n" + accufeelResultF + "° " + " AccuFeel " + "\n" + uv1 + " UVI " + current_uv_note + "\n" + "Updated at " + updateTimeRelativeBadge;
				chrome.browserAction.setTitle({title: toolTipBadge});
				}
			else if (setSettingUT == "t" && setSettingFC == "c") {
				toolTipBadge = temperatureC + "° " + summary + "\n" + accufeelResultC + "° " + " AccuFeel " + "\n" + uv1 + " UVI " + current_uv_note + "\n" + "Updated at " + updateTimeRelativeBadge;
				chrome.browserAction.setTitle({title: toolTipBadge});
				};
			return;
	});

}						
	utfc = UTFC(function(value){	
			});

	setTimeout(function(){
		clearInterval(animatedBadgeInterval);   
		}, 500);
	setTimeout(badgeBackgroundImage, 550)

}, //---- uvReader success 

	// error: function(error) {
	// 					reject(error);
	// }
//})
})
} 

	


intervalUpdateTime = 1000 * 60 * 30; //miliseconds * seconds * minutes
var intervalUpdateTimes = window.setInterval(_ => {
	uvReader(city,latandlong,country)
	}, intervalUpdateTime);


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
			if(request.msg == "backgroundUpdate") {
			uvReader(city,latandlong,country);
			}
	}
);	