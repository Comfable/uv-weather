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
}

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