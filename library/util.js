//
var context = document.createElement('canvas').getContext('2d');
var start = new Date();
var lines = 16,
    cW = 40,
    cH = 40;

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
};

function timezone2offset(timeZone) {
    utcSystemTime = new Date(new Date().toUTCString()).toISOString();   
    var utcSystemTimeM = moment(utcSystemTime);
    timeZoneBadge = (utcSystemTimeM.tz(timeZone).utcOffset())*60;
    chrome.storage.local.set({'timeZoneBadge': timeZoneBadge});
    return timeZoneBadge;
};

function solarNighDay(timeZoneBadge, latlong) {
    isDay = false;
    isNight = false;
    cloudyBadge = false;
    sunnyDayBadge = false;
    rainyBadge = false;
    snowyBadge = false;
    windyBadge = false;
    lat = (latlong.split(','))[0];
    lng = (latlong.split(','))[1];

    //Solar Times --------------------------------------------------------------------------------------------------------------
    systemTime = new Date();
    systemTimeUnix = Math.round((systemTime).getTime() / 1000);
    DeviceTimeDifferenceFromGMT = systemTime.getTimezoneOffset() / 60;
    offsetTime = DeviceTimeDifferenceFromGMT + timeZoneBadge / 3600;
    offsetUnix = offsetTime * 3600;
    localTimeUnix = Math.round(systemTimeUnix + offsetUnix);
    localTimeDate = moment.unix(localTimeUnix);
    timesSolar = SunCalc.getTimes(localTimeDate, lat, lng);
    sunriseTimeSolar = moment(timesSolar.sunrise).unix();
    sunsetTimeSolar = moment(timesSolar.sunset).unix();
    solarNoon = moment(timesSolar.solarNoon).unix();
    goldenHourEnd = moment(timesSolar.goldenHourEnd).unix();
    goldenHour = moment(timesSolar.goldenHour).unix();
    totalSeconds = moment(moment.unix(sunsetTimeSolar)).diff(moment(moment.unix(sunriseTimeSolar)), 'second');
    dayLengthHours = totalSeconds / 3600;
    totalHours = Math.floor(totalSeconds / (60 * 60));
    totalSeconds = totalSeconds - (totalHours * 60 * 60);
    totalMinutes = Math.ceil(totalSeconds / 60);
    if (totalHours < 10) {
        totalHours = "0" + totalHours
    };
    if (totalMinutes < 10) {
        totalMinutes = "0" + totalMinutes
    };
    dayLength = totalHours + ":" + totalMinutes + " HH:MM";

    dawn = moment(timesSolar.dawn).unix();
    dusk = moment(timesSolar.dusk).unix();
    nightStarts = moment(timesSolar.night).unix();
    nightEnds = moment(timesSolar.nightEnd).unix();


    localTimeUnixDD = moment.unix(systemTimeUnix + offsetUnix).format('DD');
    localTimeUnixHH = moment.unix(systemTimeUnix + offsetUnix).format('HH');

    dawnDD = moment.unix(sunriseTimeSolar + offsetUnix).format('DD');

    localTimeString = moment.unix(systemTimeUnix + offsetUnix);
    if (localTimeUnixDD !== dawnDD) {
        dawnDayjs = moment.unix(((dawn + sunriseTimeSolar) / 2) + offsetUnix - 86400);
        duskDayjs = moment.unix(((dusk + sunsetTimeSolar) / 2) + offsetUnix - 86400);
    } else {
        dawnDayjs = moment.unix(((dawn + sunriseTimeSolar) / 2) + offsetUnix);
        duskDayjs = moment.unix(((dusk + sunsetTimeSolar) / 2) + offsetUnix);
    }

    if (localTimeString >= dawnDayjs && localTimeString <= duskDayjs) {
        isDay = true;
        chrome.storage.local.set({'isDay': true});
        chrome.storage.local.set({'isNight': false});        
    } else {
        isNight = true;
        chrome.storage.local.set({'isNight': true});
        chrome.storage.local.set({'isDay': false});
    }
};

function code2description_no(iconCodeNO) {
    switch (iconCodeNO) {
        case 'lightssnowshowersandthunder':
            summaryBadge = 'Lights snow showers and thunder'
            break;

        case 'heavysleetshowers':
            summaryBadge = 'Heavy sleet showers';
            break;

        case 'rainshowersandthunder':
            summaryBadge = 'Rain showers and thunder';
            break;

        case 'lightssleetshowersandthunder':
            summaryBadge = 'Lights sleet showers and thunder';
            break;

        case 'cloudy':
            summaryBadge = 'Cloudy';
            break;

        case 'rainshowers':
            summaryBadge = 'Rain showers';
            break;

        case 'lightsnow':
            summaryBadge = 'Light snow';
            break;

        case 'sleetandthunder':
            summaryBadge = 'Sleet and thunder';
            break;

        case 'lightsleetandthunder':
            summaryBadge = 'Light sleet and thunder';
            break;

        case 'heavyrainandthunder':
            summaryBadge = 'Heavy rain and thunder';
            break;

        case 'heavysleetshowersandthunder':
            summaryBadge = 'Heavy sleet showers and thunder';
            break;

        case 'sleetshowers':
            summaryBadge = 'Sleet showers';
            break;

        case 'clearsky':
            summaryBadge = 'Clear sky';
            break;

        case 'lightsnowshowers':
            summaryBadge = 'Light snow showers';
            break;

        case 'heavyrainshowers':
            summaryBadge = 'Heavy rain showers';
            break;

        case 'lightsnowandthunder':
            summaryBadge = 'Light snow and thunder';
            break;

        case 'snow':
            summaryBadge = 'Snow';
            break;

        case 'heavysnowshowers':
            summaryBadge = 'Heavy snow showers';
            break;

        case 'heavysleet':
            summaryBadge = 'Heavy sleet';
            break;

        case 'rain':
            summaryBadge = 'Rain';
            break;

        case 'heavysnowandthunder':
            summaryBadge = 'Heavy snow and thunder';
            break;

        case 'lightrainshowers':
            summaryBadge = 'Light rain showers';
            break;

        case 'fair':
            summaryBadge = 'Fair';
            break;

        case 'lightrain':
            summaryBadge = 'Light rain';
            break;

        case 'lightsleet':
            summaryBadge = 'Light sleet';
            break;

        case 'snowshowers':
            summaryBadge = 'Snow showers';
            break;

        case 'lightsleetshowers':
            summaryBadge = 'Light sleet showers';
            break;

        case 'partlycloudy':
            summaryBadge = 'Partly cloudy';
            break;

        case 'lightrainshowersandthunder':
            summaryBadge = 'Light rain showers and thunder';
            break;

        case 'lightrainandthunder':
            summaryBadge = 'Light rain and thunder';
            break;

        case 'heavyrainshowersandthunder':
            summaryBadge = 'Heavy rain showers and thunder';
            break;

        case 'fog':
            summaryBadge = 'Fog';
            break;

        case 'snowandthunder':
            summaryBadge = 'Snow and thunder';
            break;

        case 'rainandthunder':
            summaryBadge = 'Rain and thunder';
            break;

        case 'sleet':
            summaryBadge = 'Sleet';
            break;

        case 'snowshowersandthunder':
            summaryBadge = 'Snow showers and thunder';
            break;

        case 'heavyrain':
            summaryBadge = 'Heavy rain';
            break;

        case 'heavysleetandthunder':
            summaryBadge = 'Heavy sleet and thunder';
            break;

        case 'heavysnowshowersandthunder':
            summaryBadge = 'Heavy snow showers and thunder';
            break;

        case 'heavysnow':
            summaryBadge = 'Heavy snow';
            break;

        case 'sleetshowersandthunder':
            summaryBadge = 'Sleet showers and thunder';
            break;
        default:
            summaryBadge = 'Fair';
            break;
    }

    return summaryBadge;

};


function iconBadgeConvertDS(iconBadge) {
    chrome.storage.local.set({'cloudyBadge': false});
    chrome.storage.local.set({'rainyBadge': false});
    chrome.storage.local.set({'snowyBadge': false});
    chrome.storage.local.set({'sunnyDayBadge': false});

    if (iconBadge === "cloudy" || iconBadge === "partly-cloudy-day" || iconBadge === "partly-cloudy-night" || iconBadge === "fog") {
        cloudyBadge = true;
        chrome.storage.local.set({'cloudyBadge': true});
    } else if (iconBadge === "rain") {
        rainyBadge = true;
        chrome.storage.local.set({'rainyBadge': true});
    } else if (iconBadge === "snow" || iconBadge === "sleet") {
        snowyBadge = true;
        chrome.storage.local.set({'snowyBadge': true});
    } else {
        sunnyDayBadge = true;
        chrome.storage.local.set({'sunnyDayBadge': true});
    };
};

function iconBadgeConvertNO(iconNO, nightNO) {
    chrome.storage.local.set({'cloudyBadge': false});
    chrome.storage.local.set({'rainyBadge': false});
    chrome.storage.local.set({'snowyBadge': false});
    chrome.storage.local.set({'sunnyDayBadge': false});
    chrome.storage.local.set({'clearNightBadge': false});

    if (iconNO == "cloudy") {
        iconBadge = 'cloudy';
        cloudyBadge = true;
        chrome.storage.local.set({'cloudyBadge': true});
    } else if (iconNO == "fog") {
        iconBadge = 'fog';
        cloudyBadge = true;
        chrome.storage.local.set({'cloudyBadge': true});
    } else if (iconNO == "rainandthunder" || iconNO == "heavyrain" || iconNO == "lightrainshowers" || iconNO == "lightrain" || iconNO == "lightrainshowersandthunder" || iconNO == "lightrainandthunder" || iconNO == "heavyrainshowersandthunder" || iconNO == "lightssnowshowersandthunder" || iconNO == "rainshowersandthunder" || iconNO == "rainshowers" || iconNO == "heavyrainandthunder" || iconNO == "heavyrainshowers" || iconNO == "rain") {
        iconBadge = 'rain';
        rainyBadge = true;
        chrome.storage.local.set({'rainyBadge': true});
    } else if (iconNO == "snowshowers" || iconNO == "snowandthunder" || iconNO == "heavysnow" || iconNO == "heavysnowshowersandthunder" || iconNO == "snowshowersandthunder" || iconNO == "lightsnow" || iconNO == "lightsnowshowers" || iconNO == "lightsnowandthunder" || iconNO == "snow" || iconNO == "heavysnowshowers" || iconNO == "heavysnowandthunder") {
        iconBadge = 'snow';
        snowyBadge = true;
        chrome.storage.local.set({'snowyBadge': true});
    } else if (iconNO == "lightsleet" || iconNO == "lightsleetshowers" || iconNO == "sleet" || iconNO == "heavysleetandthunder" || iconNO == "sleetshowersandthunder" || iconNO == "heavysleetshowersHeavy" || iconNO == "lightssleetshowersandthunder" || iconNO == "sleetandthunder" || iconNO == "lightsleetandthunder" || iconNO == "heavysleetshowersandthunder" || iconNO == "sleetshowers" || iconNO == "heavysleet") {
        iconBadge = 'sleet';
        snowyBadge = true;
        chrome.storage.local.set({'snowyBadge': true});
    } else if ((iconNO == "partlycloudy") && (nightNO !== 'night')) {
        iconBadge = 'partly-cloudy-day';
        cloudyBadge = true;
        chrome.storage.local.set({'cloudyBadge': true});
    } else if ((iconNO == "partlycloudy") && (nightNO == 'night')) {
        iconBadge = 'partly-cloudy-night';
        cloudyBadge = true;
        chrome.storage.local.set({'cloudyBadge': true});
    } else if ((iconNO == "clearsky" || iconNO == "fair") && (nightNO == 'night')) {
        iconBadge = 'clear-night';
        clearNightBadge = true;
        chrome.storage.local.set({'clearNightBadge': true});
    } else if ((iconNO == "clearsky" || iconNO == "fair") && (nightNO !== 'night')) {
        iconBadge = 'clear-day';
        sunnyDayBadge = true;
        chrome.storage.local.set({'sunnyDayBadge': true});
    } 
    else {
        if (nightNO == 'night') {
            iconBadge = 'clear-night';
            clearNightBadge = true;
        chrome.storage.local.set({'clearNightBadge': true});
        } else {
            iconBadge = 'clear-day';
            sunnyDayBadge = true;
            chrome.storage.local.set({'sunnyDayBadge': true});
        }
    }

    //return iconBadge;
};

function iconConvertNO_HD(iconNO, nightNO) {

    if (iconNO == "cloudy") {
        iconNO_HD = 'cloudy';
    } else if (iconNO == "fog") {
        iconNO_HD = 'fog';
    } else if (iconNO == "rainandthunder" || iconNO == "heavyrain" || iconNO == "lightrainshowers" || iconNO == "lightrain" || iconNO == "lightrainshowersandthunder" || iconNO == "lightrainandthunder" || iconNO == "heavyrainshowersandthunder" || iconNO == "lightssnowshowersandthunder" || iconNO == "rainshowersandthunder" || iconNO == "rainshowers" || iconNO == "heavyrainandthunder" || iconNO == "heavyrainshowers" || iconNO == "rain") {
        iconNO_HD = 'rain';
    } else if (iconNO == "snowshowers" || iconNO == "snowandthunder" || iconNO == "heavysnow" || iconNO == "heavysnowshowersandthunder" || iconNO == "snowshowersandthunder" || iconNO == "lightsnow" || iconNO == "lightsnowshowers" || iconNO == "lightsnowandthunder" || iconNO == "snow" || iconNO == "heavysnowshowers" || iconNO == "heavysnowandthunder") {
        iconNO_HD = 'snow';
    } else if (iconNO == "lightsleet" || iconNO == "lightsleetshowers" || iconNO == "sleet" || iconNO == "heavysleetandthunder" || iconNO == "sleetshowersandthunder" || iconNO == "heavysleetshowersHeavy" || iconNO == "lightssleetshowersandthunder" || iconNO == "sleetandthunder" || iconNO == "lightsleetandthunder" || iconNO == "heavysleetshowersandthunder" || iconNO == "sleetshowers" || iconNO == "heavysleet") {
        iconNO_HD = 'sleet';
    } else if ((iconNO == "partlycloudy") && (nightNO !== 'night')) {
        iconNO_HD = 'partly-cloudy-day';
    } else if ((iconNO == "partlycloudy") && (nightNO == 'night')) {
        iconNO_HD = 'partly-cloudy-night';
    } else if ((iconNO == "clearsky" || iconNO == "fair") && (nightNO == 'night')) {
        iconNO_HD = 'clear-night';
    } else if ((iconNO == "clearsky" || iconNO == "fair") && (nightNO !== 'night')) {
        iconNO_HD = 'clear-day';
    } 
    else {
        if (nightNO == 'night') {
            iconNO_HD = 'clear-night';
        } else {
            iconNO_HD = 'clear-day';
        }
    }

    return iconNO_HD;
};

function iconBadgeConvertCA(iconCodeCA) {
    chrome.storage.local.set({'cloudyBadge': false});
    chrome.storage.local.set({'rainyBadge': false});
    chrome.storage.local.set({'snowyBadge': false});
    chrome.storage.local.set({'sunnyDayBadge': false});
    chrome.storage.local.set({'clearNightBadge': false});
    chrome.storage.local.set({'windyBadge': false});

    if (iconCodeCA == "03" || iconCodeCA == "10" || iconCodeCA == "33") {
        iconBadge = 'cloudy';
        cloudyBadge = true;
        chrome.storage.local.set({'cloudyBadge': true});
    } else if (iconCodeCA == "23" || iconCodeCA == "24" || iconCodeCA == "44" || iconCodeCA == "45" || iconCodeCA == "48") {
        iconBadge = 'fog';
        cloudyBadge = true;
        chrome.storage.local.set({'cloudyBadge': true});
    } else if (iconCodeCA == "06" || iconCodeCA == "07" || iconCodeCA == "11" || iconCodeCA == "12" || iconCodeCA == "13" || iconCodeCA == "19" || iconCodeCA == "28" || iconCodeCA == "36" || iconCodeCA == "37" || iconCodeCA == "38" || iconCodeCA == "39" || iconCodeCA == "46" || iconCodeCA == "47") {
        iconBadge = 'rain';
        rainyBadge = true;
        chrome.storage.local.set({'rainyBadge': true});
    } else if (iconCodeCA == "08" || iconCodeCA == "16" || iconCodeCA == "17" || iconCodeCA == "18" || iconCodeCA == "25" || iconCodeCA == "40") {
        iconBadge = 'snow';
        snowyBadge = true;
        chrome.storage.local.set({'snowyBadge': true});
    } else if (iconCodeCA == "41" || iconCodeCA == "42" || iconCodeCA == "43") {
        iconBadge = 'wind';
        windyBadge = true;
        chrome.storage.local.set({'windyBadge': true});
    } else if (iconCodeCA == "14" || iconCodeCA == "15" || iconCodeCA == "26" || iconCodeCA == "27") {
        iconBadge = 'sleet';
        snowyBadge = true;
        chrome.storage.local.set({'snowyBadge': true});
    } else if ((iconCodeCA == "02" || iconCodeCA == "32") && isDay) {
        iconBadge = 'partly-cloudy-day';
        cloudyBadge = true;
        chrome.storage.local.set({'cloudyBadge': true});
    } else if ((iconCodeCA == "02" || iconCodeCA == "32") && isNight) {
        iconBadge = 'partly-cloudy-night';
        cloudyBadge = true;
        chrome.storage.local.set({'cloudyBadge': true});
    } else if ((iconCodeCA == "00" || iconCodeCA == "01" || iconCodeCA == "30" || iconCodeCA == "31" || iconCodeCA == "") && isNight) {
        iconBadge = 'clear-night';
        clearNightBadge = true;
        chrome.storage.local.set({'clearNightBadge': true});
    } else if ((iconCodeCA == "00" || iconCodeCA == "01" || iconCodeCA == "30" || iconCodeCA == "31" || iconCodeCA == "") && isDay) {
        iconBadge = 'clear-day';
        sunnyDayBadge = true;
        chrome.storage.local.set({'sunnyDayBadge': true});
    } else {
        if (isNight) {
            iconBadge = 'clear-night';
            clearNightBadge = true;
            chrome.storage.local.set({'clearNightBadge': true});
        } else {
            iconBadge = 'clear-day';
            sunnyDayBadge = true;
            chrome.storage.local.set({'sunnyDayBadge': true});
        }
    }

    //return iconBadge;
};

function iconBadgeConvertUS(iconUS) {
    chrome.storage.local.set({'cloudyBadge': false});
    chrome.storage.local.set({'rainyBadge': false});
    chrome.storage.local.set({'snowyBadge': false});
    chrome.storage.local.set({'sunnyDayBadge': false});
    chrome.storage.local.set({'clearNightBadge': false});
    chrome.storage.local.set({'windyBadge': false});

    if (iconUS === "scttsra" || iconUS === "nscttsra" || iconUS === "hi_tsra" || iconUS === "hi_ntsra" || iconUS === "fc" || iconUS === "nfc" || iconUS === "wind_ovc" || iconUS === "nwind_ovc" || iconUS === "bkn" || iconUS === "ovc" || iconUS === "novc" || iconUS === "nbkn" || iconUS === "wind_bkn" || iconUS === "nwind_bkn" || iconUS === "wind_ovc" || iconUS === "nwind_ovc" || iconUS === "tsra" || iconUS === "tsra_sct") {
        iconBadge = 'cloudy';
        cloudyBadge = true;
        chrome.storage.local.set({'cloudyBadge': true});
    } else if (iconUS === "dust" || iconUS === "smoke" || iconUS === "haze" || iconUS === "fog" || iconUS === "du" || iconUS === "ndu" || iconUS === "fu" || iconUS === "nfu" || iconUS === "hz" || iconUS === "fg" || iconUS === "nfg") {
        iconBadge = 'fog';
        cloudyBadge = true;
        chrome.storage.local.set({'cloudyBadge': true});        
    } else if (iconUS === "minus_ra" || iconUS === "shra" || iconUS === "nshra" || iconUS === "hi_shwrs" || iconUS === "hi_nshwrs" || iconUS === "rain_snow" || iconUS === "tsra" || iconUS === "ntsra" || iconUS === "rain_fzra" || iconUS === "ra_sn" || iconUS === "nra_sn" || iconUS === "rain" || iconUS === "rain_showers" || iconUS === "rain_showers_hi" || iconUS === "ra" || iconUS === "nra") {
        iconBadge = 'rain';
        rainyBadge = true;
        chrome.storage.local.set({'rainyBadge': true});        
    } else if (iconUS === "snow" || iconUS === "snow_fzra" || iconUS === "blizzard" || iconUS === "nblizzard" || iconUS === "sn" || iconUS === "nsn") {
        iconBadge = 'snow';
        snowyBadge = true;
        chrome.storage.local.set({'snowyBadge': true});        
    } else if (iconUS === "hur_warn" || iconUS === "hur_watch" || iconUS === "ts_warn" || iconUS === "ts_watch" || iconUS === "ts_nowarn" || iconUS === "wind_skc" || iconUS === "nwind_skc" || iconUS === "wind_few" || iconUS === "nwind_few" || iconUS === "tsra_hi" || iconUS === "tornado" || iconUS === "tor" || iconUS === "ntor" || iconUS === "hurricane" || iconUS === "tropical_storm") {
        iconBadge = 'wind';
        windyBadge = true;
        chrome.storage.local.set({'windyBadge': true});        
    } else if (iconUS === "ip" || iconUS === "nip" || iconUS === "snip" || iconUS === "nsnip" || iconUS === "fzra_sn" || iconUS === "nfzra_sn" || iconUS === "raip" || iconUS === "nraip" || iconUS === "rain_sleet" || iconUS === "fzra" || iconUS === "nfzra" || iconUS === "ra_fzra" || iconUS === "nra_fzra" || iconUS === "snow_sleet" || iconUS === "sleet") {
        iconBadge = 'sleet';
        snowyBadge = true;
        chrome.storage.local.set({'snowyBadge': true});        
    } else if ((iconUS === "wind_sct" || iconUS === "nwind_sct" || iconUS === "sct" || iconUS === "nsct") && isDay) {
        iconBadge = 'partly-cloudy-day';
        cloudyBadge = true;
        chrome.storage.local.set({'cloudyBadge': true});        
    } else if ((iconUS === "wind_sct" || iconUS === "nwind_sct" || iconUS === "sct" || iconUS === "nsct") && isNight) {
        iconBadge = 'partly-cloudy-night';
        cloudyBadge = true;
        chrome.storage.local.set({'cloudyBadge': true});        
    } else if ((iconUS === "skc" || iconUS === "nskc" || iconUS === "few" || iconUS === "nfew" || iconUS === "hot" || iconUS === "cold" || iconUS === "") && isNight) {
        iconBadge = 'clear-night';
        clearNightBadge = true;
        chrome.storage.local.set({'clearNightBadge': true});         
    } else if ((iconUS === "skc" || iconUS === "nskc" || iconUS === "few" || iconUS === "nfew" || iconUS === "hot" || iconUS === "cold" || iconUS === "") && isDay) {
        iconBadge = 'clear-day';
        sunnyDayBadge = true;
        chrome.storage.local.set({'sunnyDayBadge': true});
    } else {
        if (isNight) {
            iconBadge = 'clear-night';
            clearNightBadge = true;
            chrome.storage.local.set({'clearNightBadge': true});
        } else {
            iconBadge = 'clear-day';
            sunnyDayBadge = true;
            chrome.storage.local.set({'sunnyDayBadge': true});
        }
    }
    
    //return iconBadge;
};

function badgeBackgroundImage(isDay, isNight, sunnyDayBadge, cloudyBadge, rainyBadge, snowyBadge, temperatureFbadge, currentWhiteIcon) {

    if (isDay && sunnyDayBadge && temperatureFbadge >= 50 && currentWhiteIcon == 0) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/sun-128.png"
            }
        })
    } else if (isDay && sunnyDayBadge && temperatureFbadge < 50 && currentWhiteIcon == 0) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/sun-cold-128.png"
            }
        })
    } else if (isDay && cloudyBadge && currentWhiteIcon == 0) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/cloud-day-128.png"
            }
        });
    } else if (isNight && cloudyBadge && currentWhiteIcon == 0) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/cloud-night-128.png"
            }
        });
    } else if (isDay && rainyBadge && currentWhiteIcon == 0) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/rain-day-128.png"
            }
        });
    } else if (isNight && rainyBadge && currentWhiteIcon == 0) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/rain-night-128.png"
            }
        });
    } else if (isDay && snowyBadge && currentWhiteIcon == 0) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/snow-day-128.png"
            }
        });
    } else if (isNight && snowyBadge && currentWhiteIcon == 0) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/snow-night-128.png"
            }
        });
    } else if (windyBadge && currentWhiteIcon == 0) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/wind-128.png"
            }
        });
    } else if (currentWhiteIcon == 0) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/moon-128.png"
            }
        });
    } else if (isDay && sunnyDayBadge && temperatureFbadge >= 50 && currentWhiteIcon == 1) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/sun-dark-128.png"
            }
        })
    } else if (isDay && sunnyDayBadge && temperatureFbadge < 50 && currentWhiteIcon == 1) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/sun-dark-128.png"
            }
        })
    } else if (isDay && cloudyBadge && currentWhiteIcon == 1) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/cloud-dark-128.png"
            }
        });
    } else if (isNight && cloudyBadge && currentWhiteIcon == 1) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/cloud-dark-128.png"
            }
        });
    } else if (isDay && rainyBadge && currentWhiteIcon == 1) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/rain-dark-128.png"
            }
        });
    } else if (isNight && rainyBadge && currentWhiteIcon == 1) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/rain-dark-128.png"
            }
        });
    } else if (isDay && snowyBadge && currentWhiteIcon == 1) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/snow-dark-128.png"
            }
        });
    } else if (isNight && snowyBadge && currentWhiteIcon == 1) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/snow-dark-128.png"
            }
        });
    } else if (windyBadge && currentWhiteIcon == 1) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/wind-dark-128.png"
            }
        });        
    } else if (currentWhiteIcon == 1) {
        chrome.browserAction.setIcon({
            path: {
                "128": "images/badge/moon-dark-128.png"
            }
        });
    }
};

function badgeBackgroundColor(isDay, isNight, sunnyDayBadge, cloudyBadge, rainyBadge, snowyBadge, temperatureFbadge, currentWhiteIcon) {


    if (isDay && sunnyDayBadge && temperatureFbadge >= 50) {
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#fc923b'
        });
    } else if (isDay && sunnyDayBadge && temperatureFbadge < 50) {
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#ffa25b'
        });
    } else if (isDay && cloudyBadge) {
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#549dd0'
        });
    } else if (isNight && cloudyBadge) {
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#000000'
        });
    } else if (isDay && rainyBadge) {
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#549dd0'
        });
    } else if (isNight && rainyBadge) {
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#000000'
        });
    } else if (isDay && snowyBadge) {
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#549dd0'
        });
    } else if (isNight && snowyBadge) {
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#000000'
        });
    } else {
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#000000'
        });
    }
};

function animatedBadge() {
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

        context.strokeStyle = 'rgba(119, 136, 153,' + i / lines + ')';
        // if (isDayBadge && sunnyDayBadge) {
        // 	context.strokeStyle = 'rgba(254, 102, 1,' + i / lines + ')';
        // }
        // else if (isDayBadge && (cloudyBadge || rainyBadge || snowyBadge)) {
        // 	context.strokeStyle = 'rgba(31, 97, 143,' + i / lines + ')';
        // }
        // else {
        // 	context.strokeStyle = 'rgba(0, 0, 0,' + i / lines + ')';
        // }
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

    if (lightBadge == 1) {
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
    var result = '';
    var temperatureInC;
    var tempString = summaryString.split(' ');
    for (var i = 0; i < tempString.length; i++) {
        if (tempString[i].match(/F$/)) {
            var x = tempString[i].split('');
            var evalNum = '';
            for (var j = 0; j < x.length; j++) {
                var isItNumber = Number(x[j]);
                if (!isNaN(isItNumber)) { // if number, add
                    evalNum += isItNumber.toString();
                }
            }
            temperatureInC = f2c(evalNum);
            tempString[i] = temperatureInC + "°C";
            break;
        }
    }
    // merge again
    for (i = 0; i < tempString.length; i++) {
        result = result + tempString[i] + ' ';
    }
    return result;
};

function iconTitleWeather(icon) {
    if (icon == 'clear-day' || icon == 'clear-night') {
        iconTitle = 'Clear'
    } else if (icon == 'rain') {
        iconTitle = 'Rainy'
    } else if (icon == 'snow') {
        iconTitle = 'Snowy'
    } else if (icon == 'sleet') {
        iconTitle = 'Sleety'
    } else if (icon == 'wind') {
        iconTitle = 'Windy'
    } else if (icon == 'fog') {
        iconTitle = 'Foggy'
    } else if (icon == 'cloudy') {
        iconTitle = 'Cloudy'
    } else if (icon == 'partly-cloudy-day' || icon == 'partly-cloudy-night') {
        iconTitle = 'Partly Cloudy'
    } else {
        iconTitle = 'Sunny'
    }
    return iconTitle;
};

function uv_adj_daily(cloudCover) {
    if (cloudCover < 20) {
        cloudAdj_daily = 1;
    } else if (cloudCover >= 20 && cloudCover < 70) {
        cloudAdj_daily = 0.89;
    } else if (cloudCover >= 70 && cloudCover < 90) {
        cloudAdj_daily = 0.73;
    } else if (cloudCover >= 90) {
        cloudAdj_daily = 0.73;
    } else {
        cloudAdj_daily = 1;
    }

    return (cloudAdj_daily);
};

function degToCompass(num) {
    while (num < 0) num += 360;
    while (num >= 360) num -= 360;
    val = Math.round((num - 11.25) / 22.5);
    arr = ["North", "North-northeast", "Northeast", "East-northeast", "East", "East-southeast", "Southeast",
        "South-southeast", "South", "South-southwest", "Southwest", "West-southwest", "West", "West-northwest", "Northwest", "North-northwest"
    ];
    return arr[Math.abs(val)];
};

function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }

        const varA = (typeof a[key] === 'string') ?
            a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ?
            b[key].toUpperCase() : b[key];

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
        var prevDistance = locationDistance(targetLocation, prev),
            currDistance = locationDistance(targetLocation, curr);
        return (prevDistance < currDistance) ? prev : curr;
    });
};


function cloudAdjUV(cloudCoverBadge) {
   if (cloudCoverBadge < 20) {
        cloudAdj = 1;
    } else if (cloudCoverBadge >= 20 && cloudCoverBadge < 70) {
        cloudAdj = 0.89;
    } else if (cloudCoverBadge >= 70 && cloudCoverBadge < 90) {
        cloudAdj = 0.73;
    } else if (cloudCoverBadge >= 90) {
        cloudAdj = 0.31;
    } else {
        cloudAdj = 1;
    }
    return cloudAdj;
};

function uv_note(uv1) {
    if (isNight) {
        current_uv_note = (" (night)");
    } else if (uv1 >= 0 && uv1 <= 2) {
        current_uv_note = (" (Low)");
    } else if (uv1 >= 3 && uv1 <= 5) {
        current_uv_note = (" (Moderate)");
    } else if (uv1 >= 6 && uv1 <= 7) {
        current_uv_note = (" (High)");
    } else if (uv1 >= 8 && uv1 <= 10) {
        current_uv_note = (" (Very High)");
    } else if (uv1 >= 11) {
        current_uv_note = (" (Extreme)");
    }
    return current_uv_note;
};

function toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
};

function CheckError(resp) {
    if (resp.status >= 200 && resp.status <= 299) {
        return resp.json();
    } else {
        throw Error(resp.statusText);
    }
};

const fetchWithTimeout = (uri, options = {}, time = 5000) => {

    const controller = new AbortController()
    const config = {
        ...options,
        signal: controller.signal
    }
    const timeout = setTimeout(() => {
        controller.abort()
    }, time)
    return fetch(uri, config)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`${response.status}: ${response.statusText}`)
            }
            return response
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                throw new Error('Response timed out')
            }
            throw new Error(error.message)
        })
};

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

function mode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
};

function solarcalc(lat,localTimeMoment) {
    latituteInRadians = lat * Math.PI / 180;
    numberOfDaysSinceFirstOfJanuary = localTimeMoment.dayOfYear();
    mmtMidnight = localTimeMoment.clone().startOf('day');
    numberOfMinutesThisDay = localTimeMoment.diff(mmtMidnight, 'minutes');
    
    if(moment(localTimeMoment).isLeapYear()) {
        dayNumberOfYear = 366;
    }
    else{
        dayNumberOfYear = 365;
    }

    declanationOfTheSun = Math.asin(-0.39795 * Math.cos(2.0 * Math.PI * (numberOfDaysSinceFirstOfJanuary + 10.0) / 365.0));
    sinSunPosition = Math.sin(latituteInRadians) * Math.sin(declanationOfTheSun);
    cosSunPosition = Math.cos(latituteInRadians) * Math.cos(declanationOfTheSun);
    sinSunHeight = sinSunPosition + cosSunPosition * Math.cos(2.0 * Math.PI * (numberOfMinutesThisDay + 720.0) / 1440.0) + 0.08;
    sunCorrection = 1370.0 * (1.0 + (0.033 * Math.cos(2.0 * Math.PI * dayNumberOfYear)));

    if((sinSunHeight > 0.0) && Math.abs(0.25 / sinSunHeight) < 50.0) {
        ghiSolarClearSki = sunCorrection * sinSunHeight * Math.exp(-0.25 / sinSunHeight);
    }
    else{
        ghiSolarClearSki = 0;
    }
    return ghiSolarClearSki;
};

function mode2(arr) {
    const nMap = [];
    for (var i of arr) {
        var check = false;
        for (var j of nMap) {
            if (j['key'] === i) {
                check = true;
                j['frequency'] += 1;
            }
        }

        if (!check) {
            nMap.push({ key: i, frequency: 1 })
        }
    }
    const nMap2 = nMap.filter(e => e.key !== '' && e.key !== null && e.key !== undefined);
    nMap2.sort((e1, e2) => e2.frequency - e1.frequency);
    return nMap2;
};


function badgeGeneral(isDay, isNight, sunnyDayBadge, cloudyBadge, rainyBadge, snowyBadge, temperatureFbadge, temperatureCbadge, updateTimeBadge, citys, uv1) {
    chrome.storage.local.get('whiteIcon', function(data) {
        var currentWhiteIcon = data.whiteIcon;
        if ((window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) && (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
            var currentWhiteIcon = 0;
        } else if ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) && (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
            var currentWhiteIcon = 1;
            chrome.storage.local.set({
                'whiteIcon': '1'
            });
        } else if ((window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) && currentWhiteIcon == 0) {
            var currentWhiteIcon = 0;
        } else if ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) && currentWhiteIcon == 1) {
            var currentWhiteIcon = 1;
            chrome.storage.local.set({
                'whiteIcon': '1'
            });
        }
    });


    function tempc() {
        chrome.storage.local.get(['whiteIcon', 'badgeSize'], function(data) {
            currentWhiteIcon = data.whiteIcon;
            currentBadgeSize = data.badgeSize;

            if (currentWhiteIcon == 0 || (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
                currentWhiteIcon = 0;
            } else {
                currentWhiteIcon = 1;
            }
            if (currentBadgeSize == 1) {
                //setTimeout(function() {
                    largBadgeNumber(temperatureCbadge, currentWhiteIcon)
                //}, 550);
            } else {
                chrome.browserAction.setBadgeText({
                    "text": temperatureCbadge + "°C"
                });

                badgeBackgroundColor(isDay, isNight, sunnyDayBadge, cloudyBadge, rainyBadge, snowyBadge, temperatureFbadge, currentWhiteIcon);
                //setTimeout(function() {
                    badgeBackgroundImage(isDay, isNight, sunnyDayBadge, cloudyBadge, rainyBadge, snowyBadge, temperatureFbadge, currentWhiteIcon);
                //}, 550);
            }
        });
    };

    function tempf() {
        chrome.storage.local.get(['whiteIcon', 'badgeSize'], function(data) {
            currentWhiteIcon = data.whiteIcon;
            currentBadgeSize = data.badgeSize;
            if (currentWhiteIcon == 0 || (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
                currentWhiteIcon = 0;
            } else {
                currentWhiteIcon = 1;
            }
            if (currentBadgeSize == 1) {
                //setTimeout(function() {
                    largBadgeNumber(temperatureFbadge, currentWhiteIcon)
                //}, 550);
            } else {
                chrome.browserAction.setBadgeText({
                    "text": temperatureFbadge + "°F"
                });
                badgeBackgroundColor(isDay, isNight, sunnyDayBadge, cloudyBadge, rainyBadge, snowyBadge, temperatureFbadge, currentWhiteIcon);
               //setTimeout(function() {
                    badgeBackgroundImage(isDay, isNight, sunnyDayBadge, cloudyBadge, rainyBadge, snowyBadge, temperatureFbadge, currentWhiteIcon);
                //}, 550);
            }
        });
    };

    function uvi() {
        chrome.storage.local.get(['whiteIcon', 'badgeSize'], function(data) {
            currentWhiteIcon = data.whiteIcon;
            currentBadgeSize = data.badgeSize;
            if (currentWhiteIcon == 0 || (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
                currentWhiteIcon = 0;
            } else {
                currentWhiteIcon = 1;
            }
            if (currentBadgeSize == 1) {
                //setTimeout(function() {
                    largBadgeNumber(uv1, currentWhiteIcon)
                //}, 550);
            } else {
                if (uv1 > 9) {
                    chrome.browserAction.setBadgeText({
                        "text": "UV" + uv1
                    });
                } else {
                    chrome.browserAction.setBadgeText({
                        "text": "UV " + uv1
                    });
                }
                badgeBackgroundColor(isDay, isNight, sunnyDayBadge, cloudyBadge, rainyBadge, snowyBadge, temperatureFbadge, currentWhiteIcon);
                //setTimeout(function() {
                    badgeBackgroundImage(isDay, isNight, sunnyDayBadge, cloudyBadge, rainyBadge, snowyBadge, temperatureFbadge, currentWhiteIcon);
                //}, 550);
            }
        });

    }

    function UTFC() {
        chrome.storage.local.get(['setSettingFC', 'setSettingUT', 'TimeFormat'], function(data) {
            setSettingFC = data.setSettingFC;
            setSettingUT = data.setSettingUT;
            TimeFormat = data.TimeFormat;

            if (typeof setSettingFC === 'undefined') {
                if (country == "US" || country == "us" || country == "United States of America") {
                    setSettingFC = "f";
                    chrome.storage.local.set({
                        'setSettingFC': 'f'
                    });
                    chrome.storage.local.set({
                        'TimeFormat': '12h'
                    });
                    chrome.storage.local.set({
                        'windUnit': 'mph'
                    });
                } else {
                    setSettingFC = "c";
                    chrome.storage.local.set({
                        'setSettingFC': 'c'
                    });
                    if (country == "CA" || country == "ca" || country == "Canada") {
                        chrome.storage.local.set({
                            'TimeFormat': '12h'
                        });
                        chrome.storage.local.set({
                            'windUnit': 'kmh'
                        });
                    } else {
                        chrome.storage.local.set({
                            'TimeFormat': '24h'
                        });
                        chrome.storage.local.set({
                            'windUnit': 'ms'
                        });
                    }
                }
            }

            if (typeof setSettingUT === 'undefined') {
                setSettingUT = "t";
                chrome.storage.local.set({
                    'setSettingUT': 't'
                });
                if (country == "US" || country == "us" || country == "United States of America") {
                    tempf();
                } else {
                    tempc();
                }
            } else {
                if (setSettingUT == "t") {
                    if (setSettingFC == "f") {
                        tempf();
                    } else {
                        tempc();
                    }
                } else {
                    uvi();
                };
            }


            if (TimeFormat == "24h") {
                updateTimeRelativeBadge = moment.unix(updateTimeBadge).format('HH:mm');
            } else {
                updateTimeRelativeBadge = moment.unix(updateTimeBadge).format('h:mm A');
            }

            if (setSettingUT == "u") {
                toolTipBadge = uv1 + " UVI " + uv_note(uv1) + " - " + citys + "\n" + "Updated at " + updateTimeRelativeBadge;
                chrome.browserAction.setTitle({
                    title: toolTipBadge
                });
            } else if (setSettingUT == "t" && setSettingFC == "f") {
                toolTipBadge = temperatureFbadge + "° " + capitalize(summaryBadge) + " - " + citys + "\n" + "Updated at " + updateTimeRelativeBadge;
                chrome.browserAction.setTitle({
                    title: toolTipBadge
                });
            } else if (setSettingUT == "t" && setSettingFC == "c") {
                toolTipBadge = temperatureCbadge + "° " + capitalize(summaryBadge) + " - " + citys + "\n" + "Updated at " + updateTimeRelativeBadge;
                chrome.browserAction.setTitle({
                    title: toolTipBadge
                });
            };
        });
    };

    utfc = UTFC(function(value) {});

};