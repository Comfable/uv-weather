var context = document.createElement('canvas').getContext('2d');
var start = new Date();
var lines = 16,
cW = 40,
cH = 40;
function animatedBadge(isDay,sunnyDay,cloudy,rainy) {
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