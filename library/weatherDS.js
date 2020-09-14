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
            windSpeedMS = windSpeedMS10 * 0.33; // on humun hieght an urban area
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
            precipProbability = result.currently.hasOwnProperty('precipProbability') ? Math.round(result.currently.precipProbability * 100) : '-';

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

            daily_tempF_max_1 = result.daily.data[1].temperatureMax;
            daily_tempF_max_2 = result.daily.data[2].temperatureMax;
            daily_tempF_max_3 = result.daily.data[3].temperatureMax;
            daily_tempF_max_4 = result.daily.data[4].temperatureMax;
            daily_tempF_max_5 = result.daily.data[5].temperatureMax;
            daily_tempF_max_6 = result.daily.data[6].temperatureMax;
            daily_tempF_max_7 = result.daily.data[7].temperatureMax;

            daily_tempF_min_1 = result.daily.data[1].temperatureMin;
            daily_tempF_min_2 = result.daily.data[2].temperatureMin;
            daily_tempF_min_3 = result.daily.data[3].temperatureMin;
            daily_tempF_min_4 = result.daily.data[4].temperatureMin;
            daily_tempF_min_5 = result.daily.data[5].temperatureMin;
            daily_tempF_min_6 = result.daily.data[6].temperatureMin;
            daily_tempF_min_7 = result.daily.data[7].temperatureMin;

            hourly_tempF_1 = result.hourly.data[1].temperature;
            hourly_tempF_2 = result.hourly.data[2].temperature;
            hourly_tempF_3 = result.hourly.data[3].temperature;
            hourly_tempF_4 = result.hourly.data[4].temperature;
            hourly_tempF_5 = result.hourly.data[5].temperature;
            hourly_tempF_6 = result.hourly.data[6].temperature;
            hourly_tempF_7 = result.hourly.data[7].temperature;
            hourly_tempF_8 = result.hourly.data[8].temperature;
            hourly_tempF_9 = result.hourly.data[9].temperature;
            hourly_tempF_10 = result.hourly.data[10].temperature;
            hourly_tempF_11 = result.hourly.data[11].temperature;
            hourly_tempF_12 = result.hourly.data[12].temperature;
            hourly_tempF_13 = result.hourly.data[13].temperature;
            hourly_tempF_14 = result.hourly.data[14].temperature;
            hourly_tempF_15 = result.hourly.data[15].temperature;
            hourly_tempF_16 = result.hourly.data[16].temperature;
            hourly_tempF_17 = result.hourly.data[17].temperature;
            hourly_tempF_18 = result.hourly.data[18].temperature;
            hourly_tempF_19 = result.hourly.data[19].temperature;
            hourly_tempF_20 = result.hourly.data[20].temperature;
            hourly_tempF_21 = result.hourly.data[21].temperature;
            hourly_tempF_22 = result.hourly.data[22].temperature;
            hourly_tempF_23 = result.hourly.data[23].temperature;
            hourly_tempF_24 = result.hourly.data[24].temperature;
            hourly_tempF_25 = result.hourly.data[25].temperature;
            hourly_tempF_26 = result.hourly.data[26].temperature;
            hourly_tempF_27 = result.hourly.data[27].temperature;
            hourly_tempF_28 = result.hourly.data[28].temperature;
            hourly_tempF_29 = result.hourly.data[29].temperature;
            hourly_tempF_30 = result.hourly.data[30].temperature;
            hourly_tempF_31 = result.hourly.data[31].temperature;
            hourly_tempF_32 = result.hourly.data[32].temperature;
            hourly_tempF_33 = result.hourly.data[33].temperature;
            hourly_tempF_34 = result.hourly.data[34].temperature;
            hourly_tempF_35 = result.hourly.data[35].temperature;
            hourly_tempF_36 = result.hourly.data[36].temperature;
            hourly_tempF_37 = result.hourly.data[37].temperature;
            hourly_tempF_38 = result.hourly.data[38].temperature;
            hourly_tempF_39 = result.hourly.data[39].temperature;
            hourly_tempF_40 = result.hourly.data[40].temperature;
            hourly_tempF_41 = result.hourly.data[41].temperature;
            hourly_tempF_42 = result.hourly.data[42].temperature;
            hourly_tempF_43 = result.hourly.data[43].temperature;
            hourly_tempF_44 = result.hourly.data[44].temperature;
            hourly_tempF_45 = result.hourly.data[45].temperature;
            hourly_tempF_46 = result.hourly.data[46].temperature;
            hourly_tempF_47 = result.hourly.data[47].temperature;
            hourly_tempF_48 = result.hourly.data[48].temperature;

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


            hourly_time_1 = result.hourly.data[1].time;
            hourly_time_2 = result.hourly.data[2].time;
            hourly_time_3 = result.hourly.data[3].time;
            hourly_time_4 = result.hourly.data[4].time;
            hourly_time_5 = result.hourly.data[5].time;
            hourly_time_6 = result.hourly.data[6].time;
            hourly_time_7 = result.hourly.data[7].time;
            hourly_time_8 = result.hourly.data[8].time;
            hourly_time_9 = result.hourly.data[9].time;
            hourly_time_10 = result.hourly.data[10].time;
            hourly_time_11 = result.hourly.data[11].time;
            hourly_time_12 = result.hourly.data[12].time;
            hourly_time_13 = result.hourly.data[13].time;
            hourly_time_14 = result.hourly.data[14].time;
            hourly_time_15 = result.hourly.data[15].time;
            hourly_time_16 = result.hourly.data[16].time;
            hourly_time_17 = result.hourly.data[17].time;
            hourly_time_18 = result.hourly.data[18].time;
            hourly_time_19 = result.hourly.data[19].time;
            hourly_time_20 = result.hourly.data[20].time;
            hourly_time_21 = result.hourly.data[21].time;
            hourly_time_22 = result.hourly.data[22].time;
            hourly_time_23 = result.hourly.data[23].time;
            hourly_time_24 = result.hourly.data[24].time;
            hourly_time_25 = result.hourly.data[25].time;
            hourly_time_26 = result.hourly.data[26].time;
            hourly_time_27 = result.hourly.data[27].time;
            hourly_time_28 = result.hourly.data[28].time;
            hourly_time_29 = result.hourly.data[29].time;
            hourly_time_30 = result.hourly.data[30].time;
            hourly_time_31 = result.hourly.data[31].time;
            hourly_time_32 = result.hourly.data[32].time;
            hourly_time_33 = result.hourly.data[33].time;
            hourly_time_34 = result.hourly.data[34].time;
            hourly_time_35 = result.hourly.data[35].time;
            hourly_time_36 = result.hourly.data[36].time;
            hourly_time_37 = result.hourly.data[37].time;
            hourly_time_38 = result.hourly.data[38].time;
            hourly_time_39 = result.hourly.data[39].time;
            hourly_time_40 = result.hourly.data[40].time;
            hourly_time_41 = result.hourly.data[41].time;
            hourly_time_42 = result.hourly.data[42].time;
            hourly_time_43 = result.hourly.data[43].time;
            hourly_time_44 = result.hourly.data[44].time;
            hourly_time_45 = result.hourly.data[45].time;
            hourly_time_46 = result.hourly.data[46].time;
            hourly_time_47 = result.hourly.data[47].time;
            hourly_time_48 = result.hourly.data[48].time;

            hourly_uvIndex_1 = result.hourly.data[1].uvIndex;
            hourly_icon_1 = result.hourly.data[1].icon;
            hourly_cloudCover_1 = result.hourly.data[1].cloudCover;
            hourly_precipProbability_1 = result.hourly.data[1].precipProbability;

            hourly_uvIndex_2 = result.hourly.data[2].uvIndex;
            hourly_icon_2 = result.hourly.data[2].icon;
            hourly_cloudCover_2 = result.hourly.data[2].cloudCover;
            hourly_precipProbability_2 = result.hourly.data[2].precipProbability;

            hourly_uvIndex_3 = result.hourly.data[3].uvIndex;
            hourly_icon_3 = result.hourly.data[3].icon;
            hourly_cloudCover_3 = result.hourly.data[3].cloudCover;
            hourly_precipProbability_3 = result.hourly.data[3].precipProbability;

            hourly_uvIndex_4 = result.hourly.data[4].uvIndex;
            hourly_icon_4 = result.hourly.data[4].icon;
            hourly_cloudCover_4 = result.hourly.data[4].cloudCover;
            hourly_precipProbability_4 = result.hourly.data[4].precipProbability;

            hourly_uvIndex_5 = result.hourly.data[5].uvIndex;
            hourly_icon_5 = result.hourly.data[5].icon;
            hourly_cloudCover_5 = result.hourly.data[5].cloudCover;
            hourly_precipProbability_5 = result.hourly.data[5].precipProbability;

            hourly_uvIndex_6 = result.hourly.data[6].uvIndex;
            hourly_icon_6 = result.hourly.data[6].icon;
            hourly_cloudCover_6 = result.hourly.data[6].cloudCover;
            hourly_precipProbability_6 = result.hourly.data[6].precipProbability;

            hourly_uvIndex_7 = result.hourly.data[7].uvIndex;
            hourly_icon_7 = result.hourly.data[7].icon;
            hourly_cloudCover_7 = result.hourly.data[7].cloudCover;
            hourly_precipProbability_7 = result.hourly.data[7].precipProbability;

            hourly_uvIndex_8 = result.hourly.data[8].uvIndex;
            hourly_icon_8 = result.hourly.data[8].icon;
            hourly_cloudCover_8 = result.hourly.data[8].cloudCover;
            hourly_precipProbability_8 = result.hourly.data[8].precipProbability;

            hourly_uvIndex_9 = result.hourly.data[9].uvIndex;
            hourly_icon_9 = result.hourly.data[9].icon;
            hourly_cloudCover_9 = result.hourly.data[9].cloudCover;
            hourly_precipProbability_9 = result.hourly.data[9].precipProbability;

            hourly_uvIndex_10 = result.hourly.data[10].uvIndex;
            hourly_icon_10 = result.hourly.data[10].icon;
            hourly_cloudCover_10 = result.hourly.data[10].cloudCover;
            hourly_precipProbability_10 = result.hourly.data[10].precipProbability;

            hourly_uvIndex_11 = result.hourly.data[11].uvIndex;
            hourly_icon_11 = result.hourly.data[11].icon;
            hourly_cloudCover_11 = result.hourly.data[11].cloudCover;
            hourly_precipProbability_11 = result.hourly.data[11].precipProbability;

            hourly_uvIndex_12 = result.hourly.data[12].uvIndex;
            hourly_icon_12 = result.hourly.data[12].icon;
            hourly_cloudCover_12 = result.hourly.data[12].cloudCover;
            hourly_precipProbability_12 = result.hourly.data[12].precipProbability;

            hourly_uvIndex_13 = result.hourly.data[13].uvIndex;
            hourly_icon_13 = result.hourly.data[13].icon;
            hourly_cloudCover_13 = result.hourly.data[13].cloudCover;
            hourly_precipProbability_13 = result.hourly.data[13].precipProbability;

            hourly_uvIndex_14 = result.hourly.data[14].uvIndex;
            hourly_icon_14 = result.hourly.data[14].icon;
            hourly_cloudCover_14 = result.hourly.data[14].cloudCover;
            hourly_precipProbability_14 = result.hourly.data[14].precipProbability;

            hourly_uvIndex_15 = result.hourly.data[15].uvIndex;
            hourly_icon_15 = result.hourly.data[15].icon;
            hourly_cloudCover_15 = result.hourly.data[15].cloudCover;
            hourly_precipProbability_15 = result.hourly.data[15].precipProbability;

            hourly_uvIndex_16 = result.hourly.data[16].uvIndex;
            hourly_icon_16 = result.hourly.data[16].icon;
            hourly_cloudCover_16 = result.hourly.data[16].cloudCover;
            hourly_precipProbability_16 = result.hourly.data[16].precipProbability;

            hourly_uvIndex_17 = result.hourly.data[17].uvIndex;
            hourly_icon_17 = result.hourly.data[17].icon;
            hourly_cloudCover_17 = result.hourly.data[17].cloudCover;
            hourly_precipProbability_17 = result.hourly.data[17].precipProbability;

            hourly_uvIndex_18 = result.hourly.data[18].uvIndex;
            hourly_icon_18 = result.hourly.data[18].icon;
            hourly_cloudCover_18 = result.hourly.data[18].cloudCover;
            hourly_precipProbability_18 = result.hourly.data[18].precipProbability;

            hourly_uvIndex_19 = result.hourly.data[19].uvIndex;
            hourly_icon_19 = result.hourly.data[19].icon;
            hourly_cloudCover_19 = result.hourly.data[19].cloudCover;
            hourly_precipProbability_19 = result.hourly.data[19].precipProbability;

            hourly_uvIndex_20 = result.hourly.data[20].uvIndex;
            hourly_icon_20 = result.hourly.data[20].icon;
            hourly_cloudCover_20 = result.hourly.data[20].cloudCover;
            hourly_precipProbability_20 = result.hourly.data[20].precipProbability;

            hourly_uvIndex_21 = result.hourly.data[21].uvIndex;
            hourly_icon_21 = result.hourly.data[21].icon;
            hourly_cloudCover_21 = result.hourly.data[21].cloudCover;
            hourly_precipProbability_21 = result.hourly.data[21].precipProbability;

            hourly_uvIndex_22 = result.hourly.data[22].uvIndex;
            hourly_icon_22 = result.hourly.data[22].icon;
            hourly_cloudCover_22 = result.hourly.data[22].cloudCover;
            hourly_precipProbability_22 = result.hourly.data[22].precipProbability;

            hourly_uvIndex_23 = result.hourly.data[23].uvIndex;
            hourly_icon_23 = result.hourly.data[23].icon;
            hourly_cloudCover_23 = result.hourly.data[23].cloudCover;
            hourly_precipProbability_23 = result.hourly.data[23].precipProbability;

            hourly_uvIndex_24 = result.hourly.data[24].uvIndex;
            hourly_icon_24 = result.hourly.data[24].icon;
            hourly_cloudCover_24 = result.hourly.data[24].cloudCover;
            hourly_precipProbability_24 = result.hourly.data[24].precipProbability;

            hourly_uvIndex_25 = result.hourly.data[25].uvIndex;
            hourly_icon_25 = result.hourly.data[25].icon;
            hourly_cloudCover_25 = result.hourly.data[25].cloudCover;
            hourly_precipProbability_25 = result.hourly.data[25].precipProbability;

            hourly_uvIndex_26 = result.hourly.data[26].uvIndex;
            hourly_icon_26 = result.hourly.data[26].icon;
            hourly_cloudCover_26 = result.hourly.data[26].cloudCover;
            hourly_precipProbability_26 = result.hourly.data[26].precipProbability;

            hourly_uvIndex_27 = result.hourly.data[27].uvIndex;
            hourly_icon_27 = result.hourly.data[27].icon;
            hourly_cloudCover_27 = result.hourly.data[27].cloudCover;
            hourly_precipProbability_27 = result.hourly.data[27].precipProbability;

            hourly_uvIndex_28 = result.hourly.data[28].uvIndex;
            hourly_icon_28 = result.hourly.data[28].icon;
            hourly_cloudCover_28 = result.hourly.data[28].cloudCover;
            hourly_precipProbability_28 = result.hourly.data[28].precipProbability;

            hourly_uvIndex_29 = result.hourly.data[29].uvIndex;
            hourly_icon_29 = result.hourly.data[29].icon;
            hourly_cloudCover_29 = result.hourly.data[29].cloudCover;
            hourly_precipProbability_29 = result.hourly.data[29].precipProbability;

            hourly_uvIndex_30 = result.hourly.data[30].uvIndex;
            hourly_icon_30 = result.hourly.data[30].icon;
            hourly_cloudCover_30 = result.hourly.data[30].cloudCover;
            hourly_precipProbability_30 = result.hourly.data[30].precipProbability;

            hourly_uvIndex_31 = result.hourly.data[31].uvIndex;
            hourly_icon_31 = result.hourly.data[31].icon;
            hourly_cloudCover_31 = result.hourly.data[31].cloudCover;
            hourly_precipProbability_31 = result.hourly.data[31].precipProbability;

            hourly_uvIndex_32 = result.hourly.data[32].uvIndex;
            hourly_icon_32 = result.hourly.data[32].icon;
            hourly_cloudCover_32 = result.hourly.data[32].cloudCover;
            hourly_precipProbability_32 = result.hourly.data[32].precipProbability;

            hourly_uvIndex_33 = result.hourly.data[33].uvIndex;
            hourly_icon_33 = result.hourly.data[33].icon;
            hourly_cloudCover_33 = result.hourly.data[33].cloudCover;
            hourly_precipProbability_33 = result.hourly.data[33].precipProbability;

            hourly_uvIndex_34 = result.hourly.data[34].uvIndex;
            hourly_icon_34 = result.hourly.data[34].icon;
            hourly_cloudCover_34 = result.hourly.data[34].cloudCover;
            hourly_precipProbability_34 = result.hourly.data[34].precipProbability;

            hourly_uvIndex_35 = result.hourly.data[35].uvIndex;
            hourly_icon_35 = result.hourly.data[35].icon;
            hourly_cloudCover_35 = result.hourly.data[35].cloudCover;
            hourly_precipProbability_35 = result.hourly.data[35].precipProbability;

            hourly_uvIndex_36 = result.hourly.data[36].uvIndex;
            hourly_icon_36 = result.hourly.data[36].icon;
            hourly_cloudCover_36 = result.hourly.data[36].cloudCover;
            hourly_precipProbability_36 = result.hourly.data[36].precipProbability;

            hourly_uvIndex_37 = result.hourly.data[37].uvIndex;
            hourly_icon_37 = result.hourly.data[37].icon;
            hourly_cloudCover_37 = result.hourly.data[37].cloudCover;
            hourly_precipProbability_37 = result.hourly.data[37].precipProbability;

            hourly_uvIndex_38 = result.hourly.data[38].uvIndex;
            hourly_icon_38 = result.hourly.data[38].icon;
            hourly_cloudCover_38 = result.hourly.data[38].cloudCover;
            hourly_precipProbability_38 = result.hourly.data[38].precipProbability;

            hourly_uvIndex_39 = result.hourly.data[39].uvIndex;
            hourly_icon_39 = result.hourly.data[39].icon;
            hourly_cloudCover_39 = result.hourly.data[39].cloudCover;
            hourly_precipProbability_39 = result.hourly.data[39].precipProbability;

            hourly_uvIndex_40 = result.hourly.data[40].uvIndex;
            hourly_icon_40 = result.hourly.data[40].icon;
            hourly_cloudCover_40 = result.hourly.data[40].cloudCover;
            hourly_precipProbability_40 = result.hourly.data[40].precipProbability;

            hourly_uvIndex_41 = result.hourly.data[41].uvIndex;
            hourly_icon_41 = result.hourly.data[41].icon;
            hourly_cloudCover_41 = result.hourly.data[41].cloudCover;
            hourly_precipProbability_41 = result.hourly.data[41].precipProbability;

            hourly_uvIndex_42 = result.hourly.data[42].uvIndex;
            hourly_icon_42 = result.hourly.data[42].icon;
            hourly_cloudCover_42 = result.hourly.data[42].cloudCover;
            hourly_precipProbability_42 = result.hourly.data[42].precipProbability;

            hourly_uvIndex_43 = result.hourly.data[43].uvIndex;
            hourly_icon_43 = result.hourly.data[43].icon;
            hourly_cloudCover_43 = result.hourly.data[43].cloudCover;
            hourly_precipProbability_43 = result.hourly.data[43].precipProbability;

            hourly_uvIndex_44 = result.hourly.data[44].uvIndex;
            hourly_icon_44 = result.hourly.data[44].icon;
            hourly_cloudCover_44 = result.hourly.data[44].cloudCover;
            hourly_precipProbability_44 = result.hourly.data[44].precipProbability;

            hourly_uvIndex_45 = result.hourly.data[45].uvIndex;
            hourly_icon_45 = result.hourly.data[45].icon;
            hourly_cloudCover_45 = result.hourly.data[45].cloudCover;
            hourly_precipProbability_45 = result.hourly.data[45].precipProbability;

            hourly_uvIndex_46 = result.hourly.data[46].uvIndex;
            hourly_icon_46 = result.hourly.data[46].icon;
            hourly_cloudCover_46 = result.hourly.data[46].cloudCover;
            hourly_precipProbability_46 = result.hourly.data[46].precipProbability;

            hourly_uvIndex_47 = result.hourly.data[47].uvIndex;
            hourly_icon_47 = result.hourly.data[47].icon;
            hourly_cloudCover_47 = result.hourly.data[47].cloudCover;
            hourly_precipProbability_47 = result.hourly.data[47].precipProbability;

            hourly_uvIndex_48 = result.hourly.data[48].uvIndex;
            hourly_icon_48 = result.hourly.data[48].icon;
            hourly_cloudCover_48 = result.hourly.data[48].cloudCover;
            hourly_precipProbability_48 = result.hourly.data[48].precipProbability;


            uvCurrently = result.currently.hasOwnProperty('uvIndex') ? result.currently.uvIndex : '-'

            uv1 = Math.floor(uvCurrently * cloudAdjUV(iconDS, cloudCover));

            systemTime = new Date();
            utcSystemTime = new Date(new Date().toUTCString()).toISOString();
            updateTimeBadge = toTimestamp(utcSystemTime);


            chrome.storage.local.get(['setSettingUT', 'failedHTTP', 'country'], function(data) {
                setSettingUT = data.setSettingUT;
                failedHTTP = data.failedHTTP;
                country = data.country;

                if ((setSettingUT == 'u' && failedHTTP == '0') || (failedHTTP == '1')) {
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