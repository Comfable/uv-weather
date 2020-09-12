 		function geoReader(){
			
			var url = "https://us-central1-swift-district-134123.cloudfunctions.net/geolocation";
			$.ajax({
				type: "GET",
				dataType: "json",
				url: url,
				success: function (result) {
				  
				    var city = JSON.stringify(result.city);
				    var countryAPI = JSON.stringify(result.country);
				    var latandlong = JSON.stringify(result.cityLatLong);

					if (city == null || city == undefined || city == "?" || latandlong == null || latandlong == undefined || countryAPI == undefined || countryAPI == null || countryAPI == "?") {
        				var city = "Totonto";
						var latandlong = '"43.653226,-79.383184"';
    				}
    				else {
						//var latandlong = '"-33.8686,151.2094"'; //Sydney
						//var latandlong = '"52.5233,13.4138"'; //Berlin
						//var latandlong = '"37.8267,-122.4233"'; //LA
						//var latandlong = '"-22.935,-43.5182"'; //Rio
						//var latandlong = '"28.7095,77.184"'; //Delhi
						//var latandlong = '"35.6751,139.3933"'; //Tokyo
						//var latandlong = '"35.5407,51.5103"'; //Tehran
						//var latandlong = '"34.5,69.4167"'; //Kabul
						//var latandlong = '"34.6385,108.4026"'; //Shaanxi, China
						//var latandlong = '"25.6193,85.1064"'; //Patna, India
						//var latandlong = '"23.7104,90.4074"'; //Dhaka
						//var latandlong = '"21.3919,95.7911"'; //Mandalay
						//var latandlong = '"-33.5829,19.7606"'; //Cape Town
						var latlong = (latandlong.split('"'))[1];
					}


				 	 function uvReader(){
						var url = 'https://api.darksky.net/forecast/c6f8f1ec6de2f17011eb59c6a0e4db7a/' + latlong + '?solar';
						$.ajax({
							type: "GET",
							dataType: "json",
							url: url,
							success: function (result) {
							 
							function animatedBadge() {
							   	var context=document.createElement('canvas').getContext('2d');
								var start = new Date();
								var lines = 16,
								cW = 40,
								cH = 40;

								var animatedBadgeInterval = setInterval(function() {
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
								    if (isDay && sunnyDay) {
								    	context.strokeStyle = 'rgba(254, 102, 1,' + i / lines + ')';
									}
									else if (isDay && (cloudy || rainy)) {
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
								}, 1000 / 30);

								function stopAnimatedBadge() {
								  clearInterval(animatedBadgeInterval);
								};
								setTimeout(stopAnimatedBadge, 500);

							};

							   	country = (countryAPI.split('"'))[1];
							    cityName = (city.split('"'))[1].charAt(0).toUpperCase() + (city.split('"'))[1].slice(1);
							    citys = ( "in " + cityName);										
							    cloudCover = result.currently.cloudCover;
							    icon = result.currently.icon;

							    currentTime = result.currently.time;
							    updateTime = result.currently.time;

							    feelsLikeF = Math.round(result.currently.apparentTemperature);
							    feelsLikeFsign = feelsLikeF + "°";
							    feelsLikeC = Math.round((feelsLikeF-32) * 5/9);
							    feelsLikeCsign = feelsLikeC + "°";
							    temperatureF = result.currently.temperature;
							    temperatureC =  Math.round((temperatureF-32) * 5/9);
							    humidity = 100*(result.currently.humidity);
							    dewPoint = Math.round(result.currently.dewPoint);
							    pressure = result.currently.pressure;
							    windSpeedMPH = result.currently.windSpeed; //miles per hour
							    windSpeedMS10 = result.currently.windSpeed * 0.4470389; //meter per second
							    windSpeedMS = windSpeedMS10 * 0.33; // on humun hieght an urban area
							    cloudCover = result.currently.cloudCover;
							    visibility = result.currently.visibility;
							    ozone = result.currently.ozone;

								if (result.hourly.data[0].hasOwnProperty('solar')) {
									ghiSolarClearSki = result.hourly.data[0].solar.ghi; //GHI = DHI + DNI * cos (θ)
									//console.log ("ghiSolarClearSki " + ghiSolarClearSki);

									if (ghiSolarClearSki >=250) { 
										cloudAdj_hourly = uv_adj_daily(icon);
										ghiSolarCloud = ghiSolarClearSki * cloudAdj_hourly;
										//console.log ("ghiSolarCloud " + ghiSolarCloud);
								    	TglobeC = 0.01498*ghiSolarCloud + 1.184*temperatureC - 0.0789*humidity - 2.739;	//day
								    }
								    else {	//Low GHI
								    	TglobeC = temperatureC;
								    }

								}
								else {
									TglobeC = temperatureC;	//night
								};
									
								//console.log ("TglobeC " + TglobeC);

							    Tmrt1 = Math.pow(TglobeC+273.15, 4);
								Tmrt2 =	Math.pow(windSpeedMS, 0.60);
								Tmrt3 =	2.5 * 100000000 * Tmrt2;
								Tmrt4 =	TglobeC-temperatureC;
								Tmrt5 =	Tmrt3 * Tmrt4;
								Tmrt6 =	Tmrt1 + Tmrt5;
								Tmrt7 =	Math.pow(Tmrt6, 1/4);
							    TmrtC = Tmrt7 - 273.15;
							    //console.log ("TmrtC " + TmrtC);
							    
							    accufeelResultC = Math.round(accufeel(temperatureC, TmrtC, windSpeedMS, humidity));
							    //console.log ("accufeelResultC " + accufeelResultC);

							    accufeelResultF = Math.round((accufeelResultC * 9/5) + 32);
								accufeelResultCsign = accufeelResultC + "°";
								accufeelResultFsign = accufeelResultF + "°";

							    uvMax = Math.round(result.daily.data[0].uvIndex);
							    uvMaxTimeUnix = result.daily.data[0].uvIndexTime;
								uvMaxTime = moment.unix(uvMaxTimeUnix).format('h:mm A');

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
							    temperatureCsign = temperatureC + "°C"; 

							    temperatureSign = "°F";

							    forecast_1_days = result.daily.data[1].time;							 
							    forecast_1_tempF = Math.round(result.daily.data[1].temperatureMax);
							    forecast_1_tempC = Math.round((forecast_1_tempF-32) * 5/9);
							    forecast_1_tempF_sign = forecast_1_tempF + "°";
							    forecast_1_tempC_sign = forecast_1_tempC + "°";
							    forecast_1_icon = result.daily.data[1].icon;
								
								cloudAdj_daily_1 = uv_adj_daily(forecast_1_icon);
							    forecast_1_uv = ( "UVI " + Math.round ((result.daily.data[1].uvIndex) * cloudAdj_daily_1));


							    forecast_2_days = result.daily.data[2].time;
							    forecast_2_tempF = Math.round(result.daily.data[2].temperatureMax);
							    forecast_2_tempC = Math.round((forecast_2_tempF-32) * 5/9);
							    forecast_2_tempF_sign = forecast_2_tempF + "°";
							    forecast_2_tempC_sign = forecast_2_tempC + "°";
							    forecast_2_icon = result.daily.data[2].icon;
								
								cloudAdj_daily_2 = uv_adj_daily(forecast_2_icon);
							    forecast_2_uv = ( "UVI " + Math.round ((result.daily.data[2].uvIndex) * cloudAdj_daily_2));


							    forecast_3_days = result.daily.data[3].time;
							    forecast_3_tempF =Math.round( result.daily.data[3].temperatureMax);
							    forecast_3_tempC = Math.round((forecast_3_tempF-32) * 5/9);
							    forecast_3_tempF_sign = forecast_3_tempF + "°";
							    forecast_3_tempC_sign = forecast_3_tempC + "°";
							    forecast_3_icon = result.daily.data[3].icon;
								
								cloudAdj_daily_3 = uv_adj_daily(forecast_3_icon);
							    forecast_3_uv = ( "UVI " + Math.round ((result.daily.data[3].uvIndex) * cloudAdj_daily_3));


							    if (icon == 'clear-day' || icon == 'clear-night') {iconTitle = 'Clear'}
							    else if  (icon == 'rain') {iconTitle = 'Rainy'}
							    else if (icon == 'snow') {iconTitle = 'Snowy'}
							    else if (icon == 'sleet') {iconTitle = 'Sleety'}
							    else if (icon == 'wind') {iconTitle = 'Windy'}
							    else if (icon == 'fog') {iconTitle = 'Foggy'}
							    else if (icon == 'cloudy') {iconTitle = 'Cloudy'}
							    else if (icon == 'partly-cloudy-day' || icon == 'partly-cloudy-night') {iconTitle = 'Partly Cloudy'}
							    else {iconTitle = 'Sunny'}


								function uv_adj_daily(icon) {
								    if (icon === "rain" || icon === "sleet" || icon === "snow")
							            {cloudAdj_daily = 0.73;}
							        else if (cloudCover < 0.2)
							            {cloudAdj_daily = 1;}
							        else if (cloudCover >= 0.2 && cloudCover < 0.7)
							            {cloudAdj_daily = 0.89;}
							        else if (cloudCover >= 0.7 && cloudCover < 0.9)
							            {cloudAdj_daily = 0.73;}
							        else if (cloudCover >= 0.9)
							            {cloudAdj_daily = 0.73;}
							        else
							            {cloudAdj_daily = 1;}

							        return (cloudAdj_daily);
						    };


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

								forecast_1_day = moment.unix(forecast_1_days).format('dddd');												 
								forecast_2_day = moment.unix(forecast_2_days).format('dddd');												 
								forecast_3_day = moment.unix(forecast_3_days).format('dddd');												 

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
								    	if (country == "US") {
										 	 setSettingFC = "f";
										 	} else {
										 	 setSettingFC = "c";
										 }
									}


								 	if (typeof setSettingUT === 'undefined') {
									 	 setSettingUT = "t";
								    	if (country == "US") {
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
									
									updateTimeRelativeBadge = moment.unix(updateTime).format('h:mm:ss A');
								if (setSettingUT == "u" && setSettingFC == "f") {
									toolTipBadge = temperatureF + "° " + iconTitle + "\n" + accufeelResultFsign + " AccuFeel " + "\n" + uv1 + " UVI " + current_uv_note + "\n" + "Updated at " + updateTimeRelativeBadge;
									chrome.browserAction.setTitle({title: toolTipBadge});
									}
								else if (setSettingUT == "u" && setSettingFC == "c") {
									toolTipBadge = temperatureC + "° " + iconTitle + "\n" + accufeelResultCsign + " AccuFeel " + "\n" + uv1 + " UVI " + current_uv_note + "\n" + "Updated at " + updateTimeRelativeBadge;
									chrome.browserAction.setTitle({title: toolTipBadge});
									}
								else if (setSettingUT == "t" && setSettingFC == "f") {
									toolTipBadge = temperatureF + "° " + iconTitle + "\n" + accufeelResultFsign + " AccuFeel " + "\n" + uv1 + " UVI " + current_uv_note + "\n" + "Updated at " + updateTimeRelativeBadge;
									chrome.browserAction.setTitle({title: toolTipBadge});
									}
								else if (setSettingUT == "t" && setSettingFC == "c") {
									toolTipBadge = temperatureC + "° " + iconTitle + "\n" + accufeelResultCsign + " AccuFeel " + "\n" + uv1 + " UVI " + current_uv_note + "\n" + "Updated at " + updateTimeRelativeBadge;
									chrome.browserAction.setTitle({title: toolTipBadge});
									};


								 return;
								  });
								}						

									utfc = UTFC(function(value){	
									});


								setTimeout(badgeBackgroundImage, 550);
								chrome.runtime.onMessage.addListener(
									function(request, sender, sendResponse){
										if(request.msg == "animatedBadge") animatedBadge();
									}
								);


							},

							error: function (jqXHR, textStatus) {
								
							}
							
						});

 		
									   
					}	
						uvReader();
						intervalUpdateTime = 1000 * 60 * 30;//miliseconds * seconds * minutes
						var intervalUpdateTimes = setInterval(uvReader, intervalUpdateTime);

						chrome.runtime.onMessage.addListener(
										    function(request, sender, sendResponse){
										        if(request.msg == "BackgroundUpdate") {
										        	//clearInterval(intervalUpdateTimes);
										        	uvReader();
										        }
										    }
										);	

					},
				

				error: function (jqXHR, textStatus) {
					
				}
				
			}); 
		}

		geoReader();