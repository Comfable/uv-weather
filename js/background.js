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
					cityName = (city.split('"'))[1].charAt(0).toUpperCase() + (city.split('"'))[1].slice(1);
					if(cityName && cityName.length > 15) {
						citys = cityName.substr(0,15)
					}
					else {
						citys = cityName
					}
					region = (JSON.stringify(result.region).split('"'))[1];
					latandlong = JSON.stringify(result.loc);
					latlong = (latandlong.split('"'))[1];
					fullname = ((city.split('"'))[1].charAt(0).toUpperCase() + (city.split('"'))[1].slice(1)) + ", " + region.toUpperCase() + ", " + country;
					chrome.storage.local.set({'citys': citys});
					chrome.storage.local.set({'latlong': latlong});
					chrome.storage.local.set({'country': country});
					chrome.storage.local.set({'fullname': fullname});
					chrome.storage.local.set({'verUpdate': 1});
					chrome.storage.local.set({'firstTimePopup': 0});					
					badgeTemp(latlong,citys,country);
				}
				else{
					city = '"Toronto"';
					citys = 'Toronto';
					latandlong = '"43.6629,-79.3987"';
					latlong = '43.6629,-79.3987';
					country = 'CA';											
					chrome.storage.local.set({'citys': 'Toronto'});
					chrome.storage.local.set({'latlong': '43.6629,-79.3987'});
					chrome.storage.local.set({'country': 'CA'});
					chrome.storage.local.set({'fullname': 'Toronto, ONTARIO, CA'});
					chrome.storage.local.set({'verUpdate': 1});
					chrome.storage.local.set({'firstTimePopup': 0});					
					badgeTemp(latlong,citys,country);
				}
			})
	}

});



chrome.runtime.onStartup.addListener(function(details) {
	chrome.storage.local.get(['latlong', 'country', 'setSettingUT', 'citys'], function(data) { 
  			latlong = data.latlong;
 			country = data.country;
		 	citys = data.citys;
		 	if(navigator.onLine) {
				if(data.setSettingUT == 'u') {
						badgeUV(latlong,citys,country);
				}
				else {
						badgeTemp(latlong,citys,country);
				}		 		
		 	}

	});
});


chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason == "update" && navigator.onLine) {
			chrome.storage.local.get(['latlong', 'country', 'setSettingUT', 'citys', 'city', 'windUnit'], function(data) {
		 			if(typeof data.citys !== 'undefined' && data.citys !== 'undefined') {
		 				citys = data.citys;
		 			} 
		 			else {
		 				city = data.city;
						citys = (city.split('"'))[1].charAt(0).toUpperCase() + (city.split('"'))[1].slice(1);
						chrome.storage.local.set({'citys': citys});
		 			}

		  			latlong = data.latlong;
		 			country = data.country;
		 			if(latlong.includes('"')) {
		 				latlong = (latlong.split('"'))[1];
		 				chrome.storage.local.set({'latlong': latlong});
		 			}
					if(data.setSettingUT == 'u') {
							badgeUV(latlong,citys,country);
					}
					else {
							badgeTemp(latlong,citys,country);
					}

					windUnit = data.windUnit;
					if(typeof windUnit == 'undefined') {
						if(country == "US" || country == "us" || country == "United States of America") {
							chrome.storage.local.set({'windUnit': 'mph'}); 
						} 
						else if (country == "CA" || country == "ca" || country == "Canada") {
							chrome.storage.local.set({'windUnit': 'kmh'}); 
						}
						else{
							chrome.storage.local.set({'windUnit': 'ms'}); 
						}
					}

			});
	}
});


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.msg == "intervalUpdateMessage" && navigator.onLine) {
			intervalUpdateFunction();
		}
	}
);

function intervalUpdateFunction() {
	chrome.storage.local.get(['IntervalUpdate', 'setSettingUT'], function(data) {
		intervalUpdateNumber = data.IntervalUpdate;
		if(typeof intervalUpdateNumber == 'undefined') {
			var intervalUpdateNumber = 90;
			chrome.storage.local.set({'IntervalUpdate': '90'});
		};
		intervalUpdateTime = 1000 * 60 * intervalUpdateNumber; //miliseconds * seconds * minutes

		var intervalUpdateTimes = window.setInterval(_ => {

				chrome.storage.local.get(['latlong', 'country', 'setSettingUT', 'citys'], function(data){
					latlong = data.latlong;
					country = data.country;
					citys = data.citys;
					if(data.setSettingUT == 'u') {
							badgeUV(latlong,citys,country);
					}
					else {
							badgeTemp(latlong,citys,country);
					}
				});
		}, intervalUpdateTime);
	});
};
intervalUpdateFunction();


//badgeDisplay----------------------------------------------------------------------------------
function badgeGeneral(isDay,isNight,sunnyDayBadge,cloudyBadge,rainyBadge,snowyBadge,temperatureFbadge,temperatureCbadge,updateTimeBadge,citys,uv1) {
		// animatedBadgeInterval = setInterval(function() {animatedBadge(isDay,sunnyDayBadge,cloudyBadge,rainyBadge,snowyBadge); }, 1000 / 30);
		// setTimeout(function(){
		// 	clearInterval(animatedBadgeInterval);   
		// }, 485);
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
							chrome.storage.local.set({'windUnit': 'mph'}); 
						} else {
							setSettingFC = "c";
							chrome.storage.local.set({'setSettingFC': 'c'});
							if(country == "CA" || country == "ca" || country == "Canada") {
								chrome.storage.local.set({'TimeFormat': '12h'});
								chrome.storage.local.set({'windUnit': 'kmh'}); 
							}
							else{
								chrome.storage.local.set({'TimeFormat': '24h'});
								chrome.storage.local.set({'windUnit': 'ms'}); 
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
					updateTimeRelativeBadge = moment.unix(updateTimeBadge).format('HH:mm');
				}
				else{
					updateTimeRelativeBadge = moment.unix(updateTimeBadge).format('h:mm A');
				}
				
				if(setSettingUT == "u") {
					toolTipBadge = uv1 + " UVI " + uv_note(uv1) + " - " + citys + "\n" + "Updated at " + updateTimeRelativeBadge;
					chrome.browserAction.setTitle({title: toolTipBadge});
					}
				else if(setSettingUT == "t" && setSettingFC == "f") {
					toolTipBadge = temperatureFbadge + "° " + capital_letter(summaryBadge) + " - " + citys  + "\n" + "Updated at " + updateTimeRelativeBadge;
					chrome.browserAction.setTitle({title: toolTipBadge});
					}
				else if(setSettingUT == "t" && setSettingFC == "c") {
					toolTipBadge = temperatureCbadge + "° " + capital_letter(summaryBadge) + " - " + citys + "\n"  + "Updated at " + updateTimeRelativeBadge;
					chrome.browserAction.setTitle({title: toolTipBadge});
					};						
			});
		};
		
			utfc = UTFC(function(value){	
				});

};


function badgeTemp(latlong,citys,country) {

    if(country == "CA" || country == "ca" || country == "Canada") {
	  	weatherCA(latlong,citys);
     }

    else if(country == "US" || country == "us" || country == "United States of America") {
	  	weatherUS(latlong,citys);
    }
    
    else{
		weatherOWM(latlong,citys)
    }

};


function badgeUV(latlong,citys,country) {

	weatherDS(latlong,citys,country);

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