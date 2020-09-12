	//chrome.runtime.onInstalled.addListener(function (){

 		function geoReader(){
			
			var url = "https://us-central1-swift-district-134123.cloudfunctions.net/geolocation";
			$.ajax({
				type: "GET",
				dataType: "json",
				url: url,
				success: function (result) {
				  
				    var city = JSON.stringify(result.city);
				    var latandlong = JSON.stringify(result.cityLatLong);

					if (city == null || city == undefined || latandlong == null || latandlong == undefined ) {
        				var city = "Totonto";
						var latandlong = '"43.653226,-79.383184"';
    				}
    				else {
						var latlong = (latandlong.split('"'))[1];
					}


				 	 function uvReader(){

						var url = 'https://api.darksky.net/forecast/c6f8f1ec6de2f17011eb59c6a0e4db7a/' + latlong + '?solar';
						$.ajax({
							type: "GET",
							dataType: "json",
							url: url,
							success: function (result) {
							   	
							   	
							    
							    citys = ( "in " + (city.split('"'))[1].charAt(0).toUpperCase() + (city.split('"'))[1].slice(1));					
							    cloudCover = result.currently.cloudCover;
							    icon = result.currently.icon;
							    currentTime = result.currently.time;
							    updateTime = result.currently.time;
							    feelsLikeF = Math.round(result.currently.apparentTemperature);
							    temperatureF = result.currently.temperature;
							    humidity = 100*(result.currently.humidity);
							    dewPoint = Math.round(result.currently.dewPoint);
							    pressure = result.currently.pressure;
							    windSpeed = result.currently.windSpeed;
							    cloudCover = result.currently.cloudCover;
							    visibility = result.currently.visibility;
							    ozone = result.currently.ozone;

							    sunriseTime = result.daily.data[0].sunriseTime;
							    sunsetTime = result.daily.data[0].sunsetTime;
							    temperatureF =  Math.round(result.currently.temperature);
							    current_tempF_max = Math.round(result.daily.data[0].temperatureMax);
							    current_tempF_min = Math.round(result.daily.data[0].temperatureMin);							   
							    current_tempFsign_max = current_tempF_max + "°";
							    current_tempFsign_min = current_tempF_min + "°";

							    current_tempC_max = Math.round((current_tempF_max-32) * 5/9);
							    current_tempC_min = Math.round((current_tempF_min-32) * 5/9);
							    current_tempCsign_max = current_tempC_max + "°";
							    current_tempCsign_min = current_tempC_min + "°";

							    if (temperatureF > current_tempF_max)
							    {
							    	temperatureF = current_tempF_max
							    }; 
							 	if (temperatureF < current_tempF_min)
							    {
							    	temperatureF = current_tempF_min
							    } 

							    temperatureFsign = temperatureF +"°F" 

							    temperatureC =  Math.round((temperatureF-32) * 5/9);
							    temperatureCsign = temperatureC + "°C"; 

							    temperatureSign = "°F";

							    forecast_1_days = result.daily.data[1].time;							 
							    forecast_1_tempF = Math.round(result.daily.data[1].temperatureMax);
							    forecast_1_tempC = Math.round((forecast_1_tempF-32) * 5/9);
							    forecast_1_tempF_sign = forecast_1_tempF + "°";
							    forecast_1_tempC_sign = forecast_1_tempC + "°";
							    forecast_1_uv = ( "UVI " + result.daily.data[1].uvIndex);
							    forecast_1_icon = result.daily.data[1].icon;

							    forecast_2_days = result.daily.data[2].time;
							    forecast_2_tempF = Math.round(result.daily.data[2].temperatureMax);
							    forecast_2_tempC = Math.round((forecast_2_tempF-32) * 5/9);
							    forecast_2_tempF_sign = forecast_2_tempF + "°";
							    forecast_2_tempC_sign = forecast_2_tempC + "°";
							    forecast_2_uv = ( "UVI " + result.daily.data[2].uvIndex);
							    forecast_2_icon = result.daily.data[2].icon;

							    forecast_3_days = result.daily.data[3].time;
							    forecast_3_tempF =Math.round( result.daily.data[3].temperatureMax);
							    forecast_3_tempC = Math.round((forecast_3_tempF-32) * 5/9);
							    forecast_3_tempF_sign = forecast_3_tempF + "°";
							    forecast_3_tempC_sign = forecast_3_tempC + "°";
							    forecast_3_uv = ( "UVI " + result.daily.data[3].uvIndex);
							    forecast_3_icon = result.daily.data[3].icon;


								function update_tomorrow_is() {

								    temp_difference = (parseInt(Math.round(result.daily.data[1].temperatureMax)) - parseInt(Math.round(result.daily.data[0].temperatureMax)));
								    if(temp_difference > 12.6) {
								      update_tomorrow = 'Tomorrow is much warmer than today.'; 
								    }
								    else if(temp_difference >= 5.4) {
								      update_tomorrow = 'Tomorrow is warmer than today.'; 
								    }
								    else if(temp_difference > -5.4 && temp_difference < 5.4) {
								      if(Math.round(result.daily.data[1].temperatureMax) >= 64) {
								      update_tomorrow = 'Tomorrow is as warm as today.'; 
								      }
								      else {
								      update_tomorrow = 'Tomorrow is as cool as today.'; 
								      }
								    }
								    else if(temp_difference > -12.6 && temp_difference <= -5.4) {
								      update_tomorrow = 'Tomorrow is cooler than today.'; 
								    }
								    else if(temp_difference <= -12.6) {
								      update_tomorrow = 'Tomorrow is much cooler than today.'; 
								    }
								    else {
								    }

									return (update_tomorrow);
								};

								update_tomorrow = update_tomorrow_is();


							    function daynames(day){

								 if(isNaN(day) || typeof day === 'string') {day = parseInt(day)};
								 if(day < 1000000000000) {day *= 1000};     
									var d = new Date(day);   						   
									var dStr = d.toString();
									var dArr = dStr.split(' ');								      								    	
									var dayname= dArr[0];								   								    								    								        
								  
								  	    if (dArr[0] === 'Wed') {dayname  = 'Wednesday'}
								        if (dArr[0] === 'Thu') { dayname = 'Thursday'}
								        if (dArr[0] === 'Fri') {dayname  = 'Friday'}
								        if (dArr[0] === 'Sat') { dayname = 'Saturday'}
								        if (dArr[0] === 'Sun') {dayname = 'Sunday'}
								        if (dArr[0] === 'Mon') {dayname  = 'Monday'}
								        if (dArr[0] === 'Tue') { dayname = 'Tuesday'}
								       
								   return (dayname);
								    };

								forecast_1_day = daynames(forecast_1_days);
								forecast_2_day = daynames(forecast_2_days);
								forecast_3_day = daynames(forecast_3_days);

							     isDay = false;
							     isNight = false;
							     cloudy = false;
							     sunnyDay = false;
							     rainy = false;

							     if (currentTime > sunriseTime && currentTime < sunsetTime) {
							     	isDay = true;							     	
							     }
							     else {
							     	isNight = true;							     	
							     };

							     if (icon === "cloudy" || icon === "partly-cloudy-day" || icon === "partly-cloudy-night"){
							     	cloudy = true;							
							     }
							     else if (icon=== "rain" || icon=== "snow" || icon=== "sleet"){
							     	rainy = true; 
							     }
							     else {
							     	sunnyDay = true;
							     };


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
							        else
							            {cloudAdj = 1;}

							    uv1 = Math.round ((JSON.stringify ( result.currently.uvIndex)) * cloudAdj);

							    if (isNight) {
								     	current_uv = ("UV Index " + uv1);
								   		current_uv_note = (" (Night)");
								     	}
								    else if (uv1 >= 0 && uv1 <= 2) {
								     	current_uv = ("UV Index " + uv1);
								     	current_uv_note = (" (Low)");
								 		}
								    else if (uv1 >= 3 && uv1 <= 5) {
								     	current_uv = ("UV Index " + uv1);
								     	current_uv_note = (" (Moderate)");
								 		}
								    else if (uv1 >= 6 && uv1 <= 7) {
								     	current_uv = ("UV Index " + uv1);
								     	current_uv_note = (" (High)");
								 		}
								    else if (uv1 >= 8 && uv1 <= 10) {
								     	current_uv = ("UV Index " + uv1);
								     	current_uv_note = (" (Very High)");
								 		}
								    else if (uv1 >= 11) {
								     	current_uv = ("UV Index " + uv1);
								     	current_uv_note = (" (Extreme)");
								 		};

							    function badgeBackgroundImage(){
							     	if (isDay && sunnyDay){
							     		chrome.browserAction.setBadgeBackgroundColor({color: '#fc923b'});
							     		chrome.browserAction.setIcon({path : { "128": "images/sun-128.png"}});						    	
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
							     	else {
							     		chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
							     		chrome.browserAction.setIcon({path : { "128": "images/moon-128.png"}});
							     	}

							     }

								function tempc (){
				                  chrome.browserAction.setBadgeText({"text":temperatureC +"°C" });
				  				  badgeBackgroundImage();			  
								 };
								 
								function tempf (){
				                  chrome.browserAction.setBadgeText({"text":temperatureF +"°F" });
				  				  badgeBackgroundImage();  
								 };

								 function uvi (){
				                  newTotal = uv1;
				                  chrome.browserAction.setBadgeText({"text": "UV " + uv1});
								  badgeBackgroundImage();
								 };


								 function UTFC (){
								  chrome.storage.sync.get(['setSettingFC', 'setSettingUT'], function(data) {
								    setSettingFC = data.setSettingFC;
								    setSettingUT = data.setSettingUT;
								   
								    if (typeof setSettingFC === 'undefined') {
								 	 setSettingFC = "f";
								 	}

								 	if (typeof setSettingUT === 'undefined') {
								 	 setSettingUT = "u";
									uvi ();
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

								 return;
								  });
								}						

									utfc = UTFC(function(value){	
									});

								chrome.runtime.onMessage.addListener(
										    function(request, sender, sendResponse){
										        if(request.msg == "startFunc") uvi();
										    }
										);
							},

							error: function (jqXHR, textStatus) {
								
							}
							
						});
									   
					}	
						uvReader();
						setInterval(uvReader, 180000);     
				},
				

				error: function (jqXHR, textStatus) {
					
				}
				
			}); 
		}
		geoReader();