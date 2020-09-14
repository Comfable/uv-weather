function weatherDS(latlong, citys, country, resolve) {
    const ads = '3dfc8ba9095bfa87462f459fc85238c6';
    return fetch('https://uvweather.herokuapp.com/https://api.darksky.net/forecast/' + ads + '/' + latlong + '?solar')
        .then((resp) => resp.json())
        .then(function(result) {

            window.resultDS = result;
            
            updateTime = result.currently.time;
            temperatureF = Math.round(parseFloat(result.currently.temperature));
            temperatureC = Math.round(f2c(parseFloat(result.currently.temperature)));

            humidity = Math.round(100 * (parseFloat(result.currently.humidity)));
            dewPointF = Math.round(parseFloat(result.currently.dewPoint));
            dewPointC = f2c(dewPointF);
            pressure = result.currently.hasOwnProperty('pressure') ? Math.round(parseFloat(result.currently.pressure)) : '-';
            windSpeedMPH = Math.round(result.currently.windSpeed);
            windSpeedKMH = Math.round(windSpeedMPH * 1.609334);
            windSpeedMS10 = windSpeedMPH * 0.4470389;
            windSpeedMS10R = Math.round(windSpeedMPH * 0.4470389 * 10) / 10;
            windSpeedMS = Math.round(windSpeedMS10 * 0.33); // on humun hieght an urban area
            windGustMPH = Math.round(result.currently.windGust);
            windGustKMH = Math.round(windGustMPH * 1.609334);
            windGustMS = Math.round(windGustMPH * 0.4470389 * 10) / 10;
            cloudCover = Math.round(result.currently.cloudCover * 100);
            cloudCoverBadge = Math.round(result.currently.cloudCover * 100);
            iconDS = result.currently.icon;

            ghiSolarClearSki = result.hourly.data[0].hasOwnProperty('solar') ? result.hourly.data[0].solar.ghi : '-'; //GHI = DHI + DNI * cos (Î¸)

            if (result.currently.windSpeed > 0) {
                windBearing = Math.round(result.currently.windBearing); //true north at 0° and progressing clockwise
                windCompass = degToCompass(result.currently.windBearing);
            } else {
                windBearing = "-";
                windCompass = "-";
            }

            visibility = result.currently.hasOwnProperty('visibility') ? Math.round(result.currently.visibility * 10) / 10 : '-';
            visibilityKM = result.currently.hasOwnProperty('visibility') ? Math.round(result.currently.visibility * 1.60934 * 10) / 10 : '-';

            if (visibility >= 10) {
                visibility = "+10";
                visibilityKM = "+16";
            }

            ozone = result.currently.hasOwnProperty('ozone') ? Math.round(result.currently.ozone) : '-';
            precipProbability = result.currently.hasOwnProperty('precipProbability') ? (Math.round(result.currently.precipProbability * 100) + '%') : '-';

            summary = result.currently.hasOwnProperty('summary') ? result.currently.summary : '-'

            if (result.hasOwnProperty('minutely')) {
                if (result.minutely.hasOwnProperty('summary')) {
                    summaryMinutely = result.minutely.summary;
                }
            } else {
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

            daily_tempF_max_1 = Math.round(result.daily.data[1].temperatureMax);
            daily_tempF_max_2 = Math.round(result.daily.data[2].temperatureMax);
            daily_tempF_max_3 = Math.round(result.daily.data[3].temperatureMax);
            daily_tempF_max_4 = Math.round(result.daily.data[4].temperatureMax);
            daily_tempF_max_5 = Math.round(result.daily.data[5].temperatureMax);
            daily_tempF_max_6 = Math.round(result.daily.data[6].temperatureMax);
            daily_tempF_max_7 = Math.round(result.daily.data[7].temperatureMax);

            daily_tempF_min_1 = Math.round(result.daily.data[1].temperatureMin);
            daily_tempF_min_2 = Math.round(result.daily.data[2].temperatureMin);
            daily_tempF_min_3 = Math.round(result.daily.data[3].temperatureMin);
            daily_tempF_min_4 = Math.round(result.daily.data[4].temperatureMin);
            daily_tempF_min_5 = Math.round(result.daily.data[5].temperatureMin);
            daily_tempF_min_6 = Math.round(result.daily.data[6].temperatureMin);
            daily_tempF_min_7 = Math.round(result.daily.data[7].temperatureMin);

            daily_tempC_max_1 = Math.round(f2c(result.daily.data[1].temperatureMax));
            daily_tempC_max_2 = Math.round(f2c(result.daily.data[2].temperatureMax));
            daily_tempC_max_3 = Math.round(f2c(result.daily.data[3].temperatureMax));
            daily_tempC_max_4 = Math.round(f2c(result.daily.data[4].temperatureMax));
            daily_tempC_max_5 = Math.round(f2c(result.daily.data[5].temperatureMax));
            daily_tempC_max_6 = Math.round(f2c(result.daily.data[6].temperatureMax));
            daily_tempC_max_7 = Math.round(f2c(result.daily.data[7].temperatureMax));

            daily_tempC_min_1 = Math.round(f2c(result.daily.data[1].temperatureMin));
            daily_tempC_min_2 = Math.round(f2c(result.daily.data[2].temperatureMin));
            daily_tempC_min_3 = Math.round(f2c(result.daily.data[3].temperatureMin));
            daily_tempC_min_4 = Math.round(f2c(result.daily.data[4].temperatureMin));
            daily_tempC_min_5 = Math.round(f2c(result.daily.data[5].temperatureMin));
            daily_tempC_min_6 = Math.round(f2c(result.daily.data[6].temperatureMin));
            daily_tempC_min_7 = Math.round(f2c(result.daily.data[7].temperatureMin));

            daily_wind_1 = result.daily.data[1].windSpeed;
            daily_wind_2 = result.daily.data[2].windSpeed;
            daily_wind_3 = result.daily.data[3].windSpeed;
            daily_wind_4 = result.daily.data[4].windSpeed;
            daily_wind_5 = result.daily.data[5].windSpeed;
            daily_wind_6 = result.daily.data[6].windSpeed;
            daily_wind_7 = result.daily.data[7].windSpeed;

            daily_date_1 = result.daily.data[1].time;
            daily_date_2 = result.daily.data[2].time;
            daily_date_3 = result.daily.data[3].time;
            daily_date_4 = result.daily.data[4].time;
            daily_date_5 = result.daily.data[5].time;
            daily_date_6 = result.daily.data[6].time;
            daily_date_7 = result.daily.data[7].time;

            daily_uvIndex_1 = result.daily.data[1].uvIndex;
            daily_uvIndex_2 = result.daily.data[2].uvIndex;
            daily_uvIndex_3 = result.daily.data[3].uvIndex;
            daily_uvIndex_4 = result.daily.data[4].uvIndex;
            daily_uvIndex_5 = result.daily.data[5].uvIndex;
            daily_uvIndex_6 = result.daily.data[6].uvIndex;
            daily_uvIndex_7 = result.daily.data[7].uvIndex;

            daily_icon_1 = result.daily.data[1].icon;
            daily_icon_2 = result.daily.data[2].icon;
            daily_icon_3 = result.daily.data[3].icon;
            daily_icon_4 = result.daily.data[4].icon;
            daily_icon_5 = result.daily.data[5].icon;
            daily_icon_6 = result.daily.data[6].icon;
            daily_icon_7 = result.daily.data[7].icon;

            daily_windBearing_1 = result.daily.data[1].windBearing
            daily_windBearing_2 = result.daily.data[2].windBearing
            daily_windBearing_3 = result.daily.data[3].windBearing
            daily_windBearing_4 = result.daily.data[4].windBearing
            daily_windBearing_5 = result.daily.data[5].windBearing
            daily_windBearing_6 = result.daily.data[6].windBearing
            daily_windBearing_7 = result.daily.data[7].windBearing

            uvCurrently = result.currently.hasOwnProperty('uvIndex') ? result.currently.uvIndex : '0'

            uv1 = Math.floor(uvCurrently * cloudAdjUV(iconDS, cloudCover));

            utcSystemTime = new Date(new Date().toUTCString()).toISOString();
            updateTimeBadge = toTimestamp(utcSystemTime);

            chrome.storage.local.get(['setSettingUT', 'failedHTTP_NO', 'failedHTTP', 'country'], function(data) {
                setSettingUT = data.setSettingUT;
                failedHTTP_NO = data.failedHTTP_NO;
                failedHTTP = data.failedHTTP;
                country = data.country;

                if ((setSettingUT == 'u' && failedHTTP == '0') || failedHTTP_NO == '1' || failedHTTP == '1') {
                    iconBadge = iconDS;
                    timeZone = result.offset * 3600;
                    summaryBadge = summary;
                    temperatureCbadge = temperatureC;
                    temperatureFbadge = temperatureF;

                    solarNighDay(timeZone, latlong);
                    iconBadgeConvertDS(iconBadge);
                    badgeGeneral(isDay, isNight, sunnyDayBadge, cloudyBadge, rainyBadge, snowyBadge, temperatureFbadge, temperatureCbadge, updateTimeBadge, citys, uv1);
                }

                resolve && resolve(result["currently"]["uvIndex"]);
            });


        });

};