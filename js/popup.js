var b = chrome.extension.getBackgroundPage();
chrome.runtime.sendMessage({ msg: "backgroundUpdate" });

document.addEventListener("DOMContentLoaded", function(event) {

  window.onload = function() { 
    refreshPopup();
  };

  country = b.country;

  chrome.storage.local.get('fullname', function(data) {
    document.querySelector("#setting_currentLocation_text").textContent = data.fullname;
  });


    

    function groundFlickr() {

    galleryID = b.galleryID;

    var f_url = "https://api.flickr.com/services/rest";
    var key = '9105bad4b97cbb0f3dab8c9f340dd82f';
    var f_data = "" +
      "api_key="  + key +
      "&format=json" +
      "&nojsoncallback=1" +
      "&method=flickr.galleries.getPhotos" +
      "&gallery_id=" + galleryID +
      "&extras=owner_name,path_alias,url_c";





  new Promise(function(resolve, reject) {
      var timeout = setTimeout(function() {
          reject(new Error('Request timed out'));
      }, 800);


    fetch(f_url + "?" + f_data)
    .then(function(result) {
        clearTimeout(timeout);
        if (result && result.status == 200) return result.json();
        else reject(new Error('Response error'));
    })
     .then(function(result) {
          resolve();
          var ImageNum = Math.floor(Math.random() * 10);
              
          if(result.stat === 'ok' && (typeof result.photos.photo[ImageNum] !== 'undefined'))  {
              flickrID = result.photos.photo[ImageNum].hasOwnProperty('id') ? result.photos.photo[ImageNum].id : '-';
              owner = result.photos.photo[ImageNum].hasOwnProperty('owner') ? result.photos.photo[ImageNum].owner : '-';
              url_c = result.photos.photo[ImageNum].hasOwnProperty('url_c') ? result.photos.photo[ImageNum].url_c : '-';
              pathalias = result.photos.photo[ImageNum].hasOwnProperty('pathalias') ? result.photos.photo[ImageNum].pathalias : '-';
              ownername = result.photos.photo[ImageNum].hasOwnProperty('ownername') ? result.photos.photo[ImageNum].ownername : '-';
          }
          else {
            flickrID = '-';
          }

          if(flickrID !== '-' && pathalias !== null) {
            url_owner = 'https://www.flickr.com/photos/' + pathalias + '/' + flickrID;
          }
          else {
            url_owner =  'https://www.flickr.com/photos/' + owner + '/' + flickrID;
          }


    })
     .catch(function(error){
        reject(error);
        groundCurrent();
     });



  })
  .then(function() {
      document.querySelector('.image_background_Class').style.backgroundImage = 'url(' + url_c + ')';
      setTimeout(function() {
        document.querySelector('.image_background_Class').style.filter = 'brightness(60%)';
      }, 250);

      if(pathalias !== null) {
          document.querySelector("#link_flickr_text").textContent = 'Photo by ' + pathalias + ' on Flickr';
          document.querySelector("#link_flickr").addEventListener("click", (e) => {
          window.open(url_owner, "_blank");
        })
      }
      else{
          document.querySelector("#link_flickr_text").textContent = 'Photo by ' + ownername + ' on Flickr';
          document.querySelector("#link_flickr").addEventListener("click", (e) => {
          window.open(url_owner, "_blank");
        })
      }
  })
  .catch(function(err) {
        groundCurrent();
  });



  };


  function UTFC (){
    chrome.storage.local.get(['setSettingFC', 'setSettingUT'], function(data) {
    setSettingFC = data.setSettingFC;
    setSettingUT = data.setSettingUT;

    if (typeof setSettingFC === 'undefined') {
         if (country == "US") {
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
      }

    if (setSettingUT == "u") {
        document.getElementById("setting_defualt_button_u").checked = true;
        document.getElementById("setting_defualt_button_u").disabled = true;
      }
    else {
        document.getElementById("setting_defualt_button_t").checked = true;
        document.getElementById("setting_defualt_button_t").disabled = true;
      }

    if (setSettingFC == "f") {
        document.getElementById("setting_defualt_button_f").checked = true;      
        document.getElementById("setting_defualt_button_f").disabled = true;
      }
    else {
        document.getElementById("setting_defualt_button_c").checked = true;     
        document.getElementById("setting_defualt_button_c").disabled = true;
      }

    if (setSettingFC == 'f'){
        ftemp();
      }
    else {
        ctemp(); 
      }

    return;
      });
    }
    utfc = UTFC(function(value){  
          });
    

  updateTimeRelative = "Updated " + dayjs.unix(b.updateTime).format("h:mm A");
  document.querySelector("#location").textContent = b.citys;
  document.querySelector("#current_uv").textContent = b.uv1;
  document.querySelector("#current_uv_note").textContent = b.current_uv_note;


  function uvRecommendation() {
    resUV0 = document.querySelectorAll('#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_4, #icon_uv_5, #icon_uv_6, #icon_uv_1_tooltip, #icon_uv_2_tooltip, #icon_uv_3_tooltip, #icon_uv_4_tooltip, #icon_uv_5_tooltip, #icon_uv_6_tooltip')
    for (var i = 0; i < resUV0.length; i++){
      resUV0[i].style.opacity = ".3";
    }

    if (b.uv1 == 1) {
        document.querySelector("#icon_uv_1").style.opacity = "1";
        document.querySelector("#icon_uv_1_tooltip").style.opacity = "1";
      }
    else if (b.uv1 == 2) {
        resUV2 = document.querySelectorAll('#icon_uv_1, #icon_uv_2, #icon_uv_1_tooltip, #icon_uv_2_tooltip')
        for (var i = 0; i < resUV2.length; i++){
          resUV2[i].style.opacity = "1";
          resUV2[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
        }       
      }
    else if (b.uv1 >= 3 && b.uv1 <= 5) {
        resUV3 = document.querySelectorAll('#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_1_tooltip, #icon_uv_2_tooltip, #icon_uv_3_tooltip')
        for (var i = 0; i < resUV3.length; i++){
          resUV3[i].style.opacity = "1";
          resUV3[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
        }
      }
    else if (b.uv1 >= 6 && b.uv1 <= 7) {
        resUV6 = document.querySelectorAll('#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_4, #icon_uv_1_tooltip, #icon_uv_2_tooltip, #icon_uv_3_tooltip, #icon_uv_4_tooltip')
        for (var i = 0; i < resUV6.length; i++){
          resUV6[i].style.opacity = "1";
          resUV6[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
        }
      }
    else if (b.uv1 >= 8) {
        resUV8 = document.querySelectorAll('#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_4, #icon_uv_5, #icon_uv_6, #icon_uv_1_tooltip, #icon_uv_2_tooltip, #icon_uv_3_tooltip, #icon_uv_4_tooltip, #icon_uv_5_tooltip, #icon_uv_6_tooltip')
        for (var i = 0; i < resUV8.length; i++){
          resUV8[i].style.opacity = "1";
          resUV8[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
        }
      }
  }
  uvRecommendation();

  function iconCurrent() {
  switch(b.icon) {
    case 'clear-day':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_clear-day.svg")';
      break;
    case 'clear-night':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_clear-night.svg")';
      break;
    case 'rain':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_rain.svg")';
      break;
    case 'snow':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_snow.svg")';
      break;
    case 'sleet':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_snow.svg")';
      break;
    case 'wind':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_wind.svg")';  
      break;
    case 'fog':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_fog.svg")';
      break;
    case 'cloudy':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_cloudy.svg")';
      break;
    case 'partly-cloudy-day':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_partly-cloudy-day.svg")';
      break;
    case 'partly-cloudy-night':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_partly-cloudy-night.svg")';
      break;
    default:
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/a_clear-day.svg")';
    break;
   }
  }
iconCurrent();

   function groundCurrent() {
  switch(b.icon) {
    case 'clear-day':
      document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/clear-day.jpg")';
      break;
    case 'clear-night':
      document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/clear-night.jpg")';      
      break;
    case 'rain':
            if (b.isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/rain-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/rain-night.jpg")';
              }     
      break;
    case 'snow':
            if (b.isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/snow-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/snow-night.jpg")';
              }
      break;
    case 'sleet':
            if (b.isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/sleet-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/sleet-night.jpg")';
              }
      break;
    case 'wind':
            if (b.isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/wind-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/wind-night.jpg")';
              }     
      break;
    case 'fog':
            if (b.isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/fog-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/fog-night.jpg")';
              }
      break;
    case 'cloudy':
            if (b.isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/cloudy-day.jpg")';
              }
            else {
              document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/cloudy-night.jpg")';
              }
      break;
    case 'partly-cloudy-day':
      document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/partly-cloudy-day.jpg")';
      break;
    case 'partly-cloudy-night':
      document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/partly-cloudy-night.jpg")';
      break;
    default:
      document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/default.png")';
    break;
   }
    document.querySelector("#link_flickr_text").textContent = '';
    document.querySelector('.image_background_Class').style.filter = 'brightness(60%)';
  }




  function ctemp(){
      document.querySelector("#current_report_dewPoint").textContent = b.dewPointC + "° C";
      document.querySelector("#current_temp").textContent = b.temperatureC;
      document.querySelector("#current_report_temp").textContent = b.temperatureC + "° C";
      document.querySelector("#temp_sign").textContent = "°C"
      document.querySelector("#current_accufeel").textContent = "AccuFeel " + b.accufeelResultC + "°";
      document.querySelector("#current_report_accufeel").textContent = b.accufeelResultC + "° C";
      document.querySelector("#current_temp_max").textContent = b.current_tempC_max + "°";
      document.querySelector("#current_temp_min").textContent = b.current_tempC_min + "°";
      document.querySelector("#forecast_tomorrow").textContent = b.update_tomorrow_c;

      for (i=1;i<4;i++){
        document.querySelector(`#forecast_${i}_temp`).textContent = f2c(Math.round(b.result.daily.data[i].temperatureMax)) + "°";
      }

      for(i=1;i<8;i++){
        document.querySelector(`#forecast_${i*10}_temp`).textContent = f2c(Math.round(b.result.daily.data[i].temperatureMax)) + "°";
        document.querySelector(`#forecast_${i*10}_temp_min`).textContent = f2c(Math.round(b.result.daily.data[i].temperatureMin)) + "°";
      }

      for (i=1;i<25;i++){
        document.querySelector(`#forecast_${i}_hours_temp`).textContent = Math.round(((b.result.hourly.data[i].temperature)-32) * 5/9) + "°";
      }

      document.querySelector("#summery_next7_text").textContent = b.summaryDailyC;
      document.querySelector("#summery_next48_text").textContent = b.summaryHourlyC;
  }

  function ftemp(){
    document.querySelector("#current_report_dewPoint").textContent = b.dewPointF + "° F";
    document.querySelector("#current_temp").textContent = b.temperatureF;
    document.querySelector("#current_report_temp").textContent = b.temperatureF + "° F";
    document.querySelector("#temp_sign").textContent = "°F"
    document.querySelector("#current_accufeel").textContent = "AccuFeel " + b.accufeelResultF + "°";
    document.querySelector("#current_report_accufeel").textContent = b.accufeelResultF + "° F";    
    document.querySelector("#current_temp_max").textContent = b.current_tempF_max + "°";
    document.querySelector("#current_temp_min").textContent = b.current_tempF_min + "°";
    document.querySelector("#forecast_tomorrow").textContent = b.update_tomorrow_f;

   for (i=1;i<4;i++){
        document.querySelector(`#forecast_${i}_temp`).textContent = Math.round(b.result.daily.data[i].temperatureMax) + "°";
    }

    for(i=1;i<8;i++){
      document.querySelector(`#forecast_${i*10}_temp`).textContent = Math.round(b.result.daily.data[i].temperatureMax) + "°";
      document.querySelector(`#forecast_${i*10}_temp_min`).textContent = Math.round(b.result.daily.data[i].temperatureMin) + "°";
    }

    for (i=1;i<25;i++){
      document.querySelector(`#forecast_${i}_hours_temp`).textContent = Math.round(b.result.hourly.data[i].temperature) + "°";
    }
    document.querySelector("#summery_next7_text").textContent = b.summaryDailyF;
    document.querySelector("#summery_next48_text").textContent = b.summaryHourlyF;
  }

  
  function solarFunction(){
    document.querySelector("#solar_now_date").textContent = dayjs.unix(b.updateTime + b.offsetUnix).format('MMMM DD, h:mm A');
    document.querySelector("#solar_1_time").textContent = dayjs.unix(b.sunriseTimeSolar + b.offsetUnix).format('h:mm A');
    document.querySelector("#solar_2_time").textContent = dayjs.unix(b.sunsetTimeSolar + b.offsetUnix).format('h:mm A');
    document.querySelector("#solar_3_time").textContent = dayjs.unix(b.solarNoon + b.offsetUnix).format('h:mm A');
    document.querySelector("#solar_4_time").textContent = b.dayLength;
    document.querySelector("#solar_5_time").textContent = dayjs.unix(b.goldenHourEnd + b.offsetUnix).format('h:mm A');
    document.querySelector("#solar_6_time").textContent = dayjs.unix(b.goldenHour + b.offsetUnix).format('h:mm A');
    document.querySelector("#solar_7_time").textContent = dayjs.unix(b.dusk + b.offsetUnix).format('h:mm A');
    document.querySelector("#solar_8_time").textContent = dayjs.unix(b.dawn + b.offsetUnix).format('h:mm A');
    document.querySelector("#solar_9_time").textContent = dayjs.unix(b.nightStarts + b.offsetUnix).format('h:mm A');

  }   
   A = Date.now();

  solarFunction();

  
  function next7Function(){
    document.querySelector("#next7_update_date").textContent = 'Updated at ' + dayjs.unix(b.updateTime + b.offsetUnix).format('MMM DD, h:mm A');

    for (i=1;i<4;i++){
      document.querySelector(`#forecast_${i}_day`).textContent = dayjs.unix(b.result.daily.data[i].time).format('dddd');
      document.querySelector(`#forecast_${i}_uv`).textContent = "UVI " + (Math.round ((b.result.daily.data[i].uvIndex) * uv_adj_daily(b.result.daily.data[i].icon)));
    }

    for (i=1;i<8;i++){
      document.querySelector(`#forecast_${i*10}_day`).textContent = dayjs.unix(b.result.daily.data[i].time).format('dddd');
      document.querySelector(`#forecast_${i*10}_uv`).textContent = "UVI " + (Math.round ((b.result.daily.data[i].uvIndex) * uv_adj_daily(b.result.daily.data[i].icon)));
    }

    var i;
    for (i = 1; i < 8; i++) {
      forecast_icon = b.result.daily.data[i].icon; 
      switch(forecast_icon) {
        case 'clear-day':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_sun.svg")';
          if(i<4) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_sun.svg")';
          }
          break;
        case 'clear-night':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_moon.svg")';
          if(i<4) {          
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_moon.svg")';
          }
         break;
        case 'rain':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_rain.svg")';
          if(i<4) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_rain.svg")';
          }
         break;
         case 'snow':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_snow.svg")';
          if(i<4) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_snow.svg")';
          }
         break;
         case 'sleet':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_snow_alt.svg")';
          if(i<4) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_snow_alt.svg")';
          }
         break;
         case 'wind':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_wind.svg")';
          if(i<4) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_wind.svg")';
          }
         break;
         case 'fog':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_fog_alt.svg")';
          if(i<4) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_fog_alt.svg")';
          }
         break;
         case 'cloudy':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud.svg")';
          if(i<4) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud.svg")';
          }
         break;
         case 'partly-cloudy-day':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_sun.svg")';
          if(i<4) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_sun.svg")';
          }
         break;
         case 'partly-cloudy-night':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_moon.svg")';
          if(i<4) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_moon.svg")';
          }
         break;
         default:
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_sun.svg")';
          if(i<4) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_sun.svg")';
          }
        break;
        }
    }

  }
  next7Function();


 function reportFunction() {
    document.querySelector("#title_report_text").textContent = b.citys;
    document.querySelector("#current_report_summary").textContent = b.summaryMinutely;
    document.querySelector("#report_update_date").textContent = dayjs.unix(b.updateTime + b.offsetUnix).format('MMM DD, h:mm A');
    document.querySelector("#current_report_uv").textContent = b.uv1 + " " + b.current_uv_note;
    document.querySelector("#current_report_wind").textContent = b.windSpeedMPH + " mph (" + b.windSpeedKMH + " km/h)";
    document.querySelector("#current_report_windBearing").textContent = b.windBearing + "° (" + b.windCompass + ")";
    document.querySelector("#current_report_windGust").textContent = b.windGustMPH + " mph (" + b.windGustKMH + " km/h)";
    document.querySelector("#current_report_humidity").textContent = b.humidity + "%";
    document.querySelector("#current_report_visibility").textContent = b.visibility + " mi (" + b.visibilityKM + " km)";
    document.querySelector("#current_report_pressure").textContent = b.pressure + " mb (hPa)";
    document.querySelector("#current_report_cloud").textContent = b.cloudCover + "%";
    document.querySelector("#current_report_ozone").textContent = b.ozone + " du";
    document.querySelector("#current_report_precipitation").textContent =  b.precipProbability + "%";
  }
  reportFunction();

  function next48Function() {
    document.querySelector("#next48_update_date").textContent = 'Updated at ' + dayjs.unix(b.updateTime + b.offsetUnix).format('MMM DD, h:mm A');

    for(i=1;i<25;i++){
      document.querySelector(`#forecast_${i}_hours`).textContent = dayjs.unix(b.result.hourly.data[i].time + b.offsetUnix).format('h A');
      document.querySelector(`#forecast_${i}_hours_uv`).textContent = "UVI " + Math.round((b.result.hourly.data[i].uvIndex) * uv_adj_daily(b.result.hourly.data[i].icon, b.result.hourly.data[i].cloudCover));
      document.querySelector(`#forecast_${i}_hours_rain`).textContent = Math.round(((b.result.hourly.data[i].precipProbability) * 100)/5)*5 + "%";
    }
  
    var i;
    for (i = 1; i < 25; i++) {
      forecast_hours_icon = b.result.hourly.data[i].icon;
    switch(forecast_hours_icon) {
      case 'clear-day':
        document.querySelector('.forecast_'+ i +'_hours_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_sun.svg")';        
        break;
      case 'clear-night':
        document.querySelector('.forecast_'+ i +'_hours_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_moon.svg")';
       break;
      case 'rain':
        document.querySelector('.forecast_'+ i +'_hours_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_rain.svg")';
       break;
       case 'snow':
        document.querySelector('.forecast_'+ i +'_hours_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_snow.svg")';
       break;
       case 'sleet':
        document.querySelector('.forecast_'+ i +'_hours_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_snow_alt.svg")';
       break;
       case 'wind':
        document.querySelector('.forecast_'+ i +'_hours_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_wind.svg")';
       break;
       case 'fog':
        document.querySelector('.forecast_'+ i +'_hours_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_fog_alt.svg")';
       break;
       case 'cloudy':
        document.querySelector('.forecast_'+ i +'_hours_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud.svg")';
       break;
       case 'partly-cloudy-day':
        document.querySelector('.forecast_'+ i +'_hours_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_sun.svg")';
       break;
       case 'partly-cloudy-night':
        document.querySelector('.forecast_'+ i +'_hours_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_moon.svg")';
       break;
       default:
        document.querySelector('.forecast_'+ i +'_hours_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_sun.svg")';
      break;
      }
    }
  }
  next48Function();

  function trackSunExposure() {
    if (b.uv1 == 0 || b.isNight) {
        document.querySelector("#link_qsun_text").textContent = 'UV Weather App for iOS & Android';
     }
    else{
        document.querySelector("#link_qsun_text").textContent = "UV Weather App for iOS & Android";
      }
  }  
  trackSunExposure();

  version_manifest = chrome.runtime.getManifest().version;
  document.querySelector("#title_version_setting").textContent = "Version " + version_manifest;




  const autoCompletejs = new autoComplete({
      data: {
          src: async () => {
            const token = 'pk.eyJ1IjoiY29tZmFibGUiLCJhIjoiY2sybTF6Z3FpMGRkeTNscWxhMnNybnU3cyJ9.VDvM0a0jaMlLMwlqBI8kUw';
            const query = document.querySelector("#autoComplete").value;

              if (typeof ((b.latandlong.split('"'))[1]) !== 'undefined') {
                latandlongMapBox = ((b.latandlong.split('"'))[1]).split(',').reverse().join(',');
              }
              else {
                latandlongMapBox = "-79.3832,43.6532";
              } 

          if (query !== '') {
            const source = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?types=place&proximity=${latandlongMapBox}&limit=7&autocomplete=true&language=en,de,fr,nl,it,ja,ar,es,zh,sv,ko&access_token=${token}`);

            const data = await source.json();
            return data.features;
          }
          },
          key: ["place_name"],
          cache: false
      },

      threshold: 1, 
      debounce: 300,
      searchEngine: "strict",
      highlight: true,
      maxResults: 7,
      resultsList: {
          render: true,
          container: source => {
        source.setAttribute("id", "autoComplete_list");
          },
          destination: document.querySelector("#autoComplete"),
          position: "afterend",
          element: "ul"
      },
      resultItem: {
          content: (data, source) => {
          cityProvince = (data.match).split(',').splice(0,2).join(',');

          if (data.value.context[0].hasOwnProperty('short_code')) {
            shortCountryCode = data.value.context[0].short_code;
            shortCountryAPI = (shortCountryCode).split('-').splice(0,1).join('');
            shortCountry = shortCountryAPI.toUpperCase();
          }
          else {
            if (data.value.context[1].hasOwnProperty('short_code')) {
              shortCountryCode = data.value.context[1].short_code;
              shortCountryAPI = (shortCountryCode).split('-').splice(0,1).join('');
              shortCountry = shortCountryAPI.toUpperCase();
            }
          }

          if (typeof(cityProvince) !== 'undefined' && typeof(shortCountryCode) !== 'undefined') {
              cityShortCountry = (cityProvince + ', ' + shortCountry).slice(0, 85);
          }
          else if (typeof(shortCountryCode) === 'undefined') {
              cityShortCountry = cityProvince;
          }    
          else {
              cityShortCountry = "";
          }


           source.innerHTML = cityShortCountry;

          },
          element: "li"
      },
      noResults: () => {
          const result = document.createElement("li");
          result.setAttribute("class", "no_result");
          result.setAttribute("tabindex", "1");
          result.innerHTML = "No Results";
          document.querySelector("#autoComplete_list").appendChild(result);
      },
      onSelection: feedback => {

          var cityProvince = (feedback.selection.value.place_name_en).split(',').splice(0,2).join(',');
          var shortCountryCode = feedback.selection.value.context[0].short_code;
          var fullname = feedback.selection.value.place_name_en;

          if (typeof (shortCountryCode) !== 'undefined') {
            shortCountryAPI = (shortCountryCode).split('-').splice(0,1).join('');
            shortCountry = shortCountryAPI.toUpperCase();
          }


          if (typeof(shortCountryCode) !== 'undefined' && typeof(shortCountryCode) !== 'undefined') {
              cityShortCountry = cityProvince;
          }    
          else {
              cityShortCountry = "";
          }


          document.querySelector("#autoComplete").value = cityShortCountry;

          var cityAPI = feedback.selection.value.text;
          var lat = feedback.selection.value.geometry.coordinates[1];
          var lng = feedback.selection.value.geometry.coordinates[0];
          
          latlong =  '"' + lat + ',' + lng + '"';
          city =  '"' + cityAPI + '"';

          if (((feedback.selection.value.place_name_en).split(','))[2]) {
              country = ((feedback.selection.value.place_name_en).split(','))[2];
          }
          else {
            country = ((feedback.selection.value.place_name_en).split(','))[1];
          }


          chrome.storage.local.set({'fullname': fullname});
          chrome.storage.local.set({'latlongPopup': latlong});
          chrome.storage.local.set({'cityPopup': city});
          chrome.storage.local.set({'countryPopup': country});
          chrome.storage.local.set({'fromSearch': "locationSearch"});

          document.querySelector("#setting_currentLocation_text").textContent = fullname;

          setTimeout(function(){
            chrome.runtime.sendMessage({ msg: "fromSearchUpdate" });
          }, 50);

           setTimeout(function(){
              refreshPopup();
           }, 1050); 

      }
  });

  


     




  document.querySelector("#setting_defualt_button_u").addEventListener("click", (e) => { 
      setSettingUT = "u";
      chrome.runtime.sendMessage({ msg: "backgroundUpdate" });
      chrome.storage.local.set({'setSettingUT': 'u'});
        if (b.uv1>9) {
          chrome.browserAction.setBadgeText({"text": "UV"+ b.uv1});
        }
        else {
          chrome.browserAction.setBadgeText({"text": "UV "+ b.uv1});
        }        
      document.getElementById("setting_defualt_button_u").disabled = true;
      document.getElementById("setting_defualt_button_t").disabled = false;
  });
  
  document.querySelector("#setting_defualt_button_t").addEventListener("click", (e) => { 
      setSettingUT = "t";
      chrome.runtime.sendMessage({ msg: "backgroundUpdate" });
      chrome.storage.local.set({'setSettingUT': 't'});
          if (setSettingFC == "f") {
              chrome.browserAction.setBadgeText({"text":temperatureF +"°F" });
            }
          else {
            chrome.browserAction.setBadgeText({"text":temperatureC +"°C" });
          }
      document.getElementById("setting_defualt_button_t").disabled = true;
      document.getElementById("setting_defualt_button_u").disabled = false;
  });
  document.querySelector("#setting_defualt_button_c").addEventListener("click", (e) => { 
      setSettingFC = "c";
      chrome.runtime.sendMessage({ msg: "backgroundUpdate" });
      chrome.storage.local.set({'setSettingFC': 'c'});
      if (setSettingUT == "t") {
        chrome.browserAction.setBadgeText({"text":temperatureC +"°C" });
      }
      ctemp();
      document.getElementById("setting_defualt_button_c").disabled = true;
      document.getElementById("setting_defualt_button_f").disabled = false;
   });

document.querySelector("#setting_defualt_button_f").addEventListener("click", (e) => { 
      setSettingFC = "f";
      chrome.runtime.sendMessage({ msg: "backgroundUpdate" });
      chrome.storage.local.set({'setSettingFC': 'f'});
      if (setSettingUT == "t") {   
        chrome.browserAction.setBadgeText({"text":temperatureF +"°F" });
      }      
      ftemp();
      document.getElementById("setting_defualt_button_f").disabled = true;
      document.getElementById("setting_defualt_button_c").disabled = false;
   });


var element = document.getElementById("home_icon_popup_page");
element.classList.add("sub_menu_icon_active_Class");

var currentIcon = document.getElementById("home_icon_popup_page");
currentIcon.classList.add("sub_menu_current_icon_Class");

var currentSubMenu = document.getElementById("sub_menu_home");
currentSubMenu.classList.add("sub_menu_current_Class");

function closeAllPopup() {
    modalSetting.style.display = "none";
    modal48hours.style.display = "none";
    modal7days.style.display = "none";
    modalSolar.style.display = "none";
    modalCurrent.style.display = "none";   
  }; 

function removeClassIcons() {
    var settingIcon = document.getElementById("setting_icon_popup_page");
    var solarIcon = document.getElementById("solar_icon_popup_page");
    var homeIcon = document.getElementById("home_icon_popup_page"); 
    var next7Icon = document.getElementById("next7_icon_popup_page");
    var next48Icon = document.getElementById("next48_icon_popup_page"); 
    settingIcon.classList.remove("sub_menu_icon_active_Class");
    solarIcon.classList.remove("sub_menu_icon_active_Class");
    homeIcon.classList.remove("sub_menu_icon_active_Class");
    next7Icon.classList.remove("sub_menu_icon_active_Class");
    next48Icon.classList.remove("sub_menu_icon_active_Class");
    settingIcon.classList.remove("sub_menu_current_icon_Class");
    solarIcon.classList.remove("sub_menu_current_icon_Class");
    homeIcon.classList.remove("sub_menu_current_icon_Class");
    next7Icon.classList.remove("sub_menu_current_icon_Class");
    next48Icon.classList.remove("sub_menu_current_icon_Class");

    var settingSub = document.getElementById("sub_menu_setting");
    var solarSub = document.getElementById("sub_menu_solar");
    var homeSub = document.getElementById("sub_menu_home"); 
    var next7Sub = document.getElementById("sub_menu_next7");
    var next48Sub = document.getElementById("sub_menu_next48"); 
    settingSub.classList.remove("sub_menu_current_Class");
    solarSub.classList.remove("sub_menu_current_Class");
    homeSub.classList.remove("sub_menu_current_Class");
    next7Sub.classList.remove("sub_menu_current_Class");
    next48Sub.classList.remove("sub_menu_current_Class");
  };


var modalSetting = document.getElementById("setting_popup");
var modalSolar = document.getElementById("solar_popup");
var modalInfo = document.getElementById("info_popup");
var modal7days = document.getElementById("next7_popup");
var modal48hours = document.getElementById("next48_popup");
var location = document.getElementById("location");

var mapInner = document.getElementById("mapWeather");
var mapTitle = document.getElementById("map_popup_title");

var modalCurrent = document.getElementById("currentReport_popup");

document.querySelector("#map_popup_page").addEventListener("click", (e) => {
    removeClassIcons();
    setTimeout(function(){
      document.getElementById("map_popup_close").style.visibility = "visible";
    }, 300);
    mapTitle.style.visibility = "visible";
    mapInner.style.visibility = "visible";
    weatherMap();

    var currentIcon = document.getElementById("home_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_home");
    currentSubMenu.classList.add("sub_menu_current_Class");
  });

document.querySelector("#setting_popup_page").addEventListener("click", (e) => {
    closeAllPopup();
    removeClassIcons();    
    modalSetting.style.display = "block";
    var element = document.getElementById("setting_icon_popup_page");
    element.classList.add("sub_menu_icon_active_Class");

    var currentIcon = document.getElementById("setting_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_setting");
    currentSubMenu.classList.add("sub_menu_current_Class");
  });

document.querySelector("#solar_popup_page").addEventListener("click", (e) => { 
    closeAllPopup();
    removeClassIcons();   
    modalSolar.style.display = "block";
    var element = document.getElementById("solar_icon_popup_page");
    element.classList.add("sub_menu_icon_active_Class");    

    var currentIcon = document.getElementById("solar_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_solar");
    currentSubMenu.classList.add("sub_menu_current_Class");
  });

document.querySelector("#home_popup_page").addEventListener("click", (e) => { 
    closeAllPopup();
    removeClassIcons();
    var element = document.getElementById("home_icon_popup_page");
    element.classList.add("sub_menu_icon_active_Class");

    var currentIcon = document.getElementById("home_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_home");
    currentSubMenu.classList.add("sub_menu_current_Class");
  });

document.querySelector("#next7_day").addEventListener("click", (e) => { 
    closeAllPopup();
    removeClassIcons();
    modal7days.style.display = "block";
    var element = document.getElementById("next7_icon_popup_page");
    element.classList.add("sub_menu_icon_active_Class");    
    
    var currentIcon = document.getElementById("next7_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_next7");
    currentSubMenu.classList.add("sub_menu_current_Class");
  });

document.querySelector("#next48").addEventListener("click", (e) => {
    closeAllPopup();
    removeClassIcons();
    modal48hours.style.display = "block";
    var element = document.getElementById("next48_icon_popup_page");
    element.classList.add("sub_menu_icon_active_Class");    
    
    var currentIcon = document.getElementById("next48_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_next48");
    currentSubMenu.classList.add("sub_menu_current_Class");
  });

document.querySelector("#location").addEventListener("click", (e) => { 
    closeAllPopup();
    removeClassIcons();
    modalSetting.style.display = "block";
    var element = document.getElementById("setting_icon_popup_page");
    element.classList.add("sub_menu_icon_active_Class");

    var currentIcon = document.getElementById("setting_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_setting");
    currentSubMenu.classList.add("sub_menu_current_Class");
  });

document.querySelector("#report_button").addEventListener("click", (e) => {
    closeAllPopup();
    removeClassIcons();
    modalCurrent.style.display = "block";

    var currentIcon = document.getElementById("home_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_home");
    currentSubMenu.classList.add("sub_menu_current_Class");
  });


document.querySelector("#report_popup_close").addEventListener("click", (e) => {
    closeAllPopup();
    removeClassIcons();
    var element = document.getElementById("home_icon_popup_page");
    element.classList.add("sub_menu_icon_active_Class");

    var currentIcon = document.getElementById("home_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_home");
    currentSubMenu.classList.add("sub_menu_current_Class");    
  });

document.querySelector("#map_popup_close").addEventListener("click", (e) => {
    document.getElementById("map_popup_close").style.transition = "all 0s";
    document.getElementById("map_popup_close").style.visibility = "hidden";
    mapTitle.style.visibility = "hidden";
    mapInner.style.visibility = "hidden";
    closeAllPopup();
    removeClassIcons();
    var element = document.getElementById("home_icon_popup_page");
    element.classList.add("sub_menu_icon_active_Class");

    var currentIcon = document.getElementById("home_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_home");
    currentSubMenu.classList.add("sub_menu_current_Class");    
  });

document.querySelector("#image_background").addEventListener("click", (e) => {
    closeAllPopup();
    removeClassIcons();

    var element = document.getElementById("home_icon_popup_page");
    element.classList.add("sub_menu_icon_active_Class");

    var currentIcon = document.getElementById("home_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");
    
    var currentSubMenu = document.getElementById("sub_menu_home");
    currentSubMenu.classList.add("sub_menu_current_Class");    
  });


  function weatherMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29tZmFibGUiLCJhIjoiY2sybTF6Z3FpMGRkeTNscWxhMnNybnU3cyJ9.VDvM0a0jaMlLMwlqBI8kUw';
    if (typeof ((b.latandlong.split('"'))[1]) !== 'undefined') {
      latandlongMapBox = ((b.latandlong.split('"'))[1]).split(',').reverse().join(',');
      latandlongMapBox = JSON.parse("[" + latandlongMapBox + "]");
    }
    else {
      latandlongMapBox = [-79.3832,43.6532];
    } 
   
    var mapWeather = new mapboxgl.Map({
        container: 'mapWeather',
        style: 'mapbox://styles/mapbox/light-v10',
        center: latandlongMapBox,
        minZoom: 2,
        maxZoom: 7,
        zoom: 2
    });

    mapWeather.on('load', function(){
      mapWeather.addLayer({
        "id": "simple-tiles",
        "type": "raster",
        "paint" : {
            "raster-opacity" : 0.3,
            "raster-saturation" : 0.15,
            "raster-contrast" : 0,
            "raster-resampling" : 'nearest',
            "raster-hue-rotate": 350,
            "raster-fade-duration" : 500       
          },
        "source": {
          "type": "raster",
          "tiles": ["https://tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=c33b87de15e56ce0b4a4a0fef54d8ecd"],
          "tileSize": 256
        },
        "minzoom": 1,
        "maxzoom": 8
      });
    });
    document.querySelector("#map_popup_title").textContent = 'PRECIPITATION FORECAST | UV WEATHER | ' + dayjs.unix(b.updateTime + b.offsetUnix).format('MMMM DD, YYYY h:mm A');
  }; 


  function refreshPopup() {

    groundFlickr();

    setTimeout(function() {
      updateTimeRelative = "Updated " + dayjs.unix(b.updateTime).format("h:mm A");

      if (setSettingFC == "c") {
          ctemp();
        }
        else{
           ftemp();
        }

      document.querySelector("#location").textContent = b.citys;
      document.querySelector("#current_uv").textContent = b.uv1;
      document.querySelector("#current_uv_note").textContent = b.current_uv_note;

      iconCurrent();
      
      uvRecommendation();
      solarFunction();
      next48Function();
      next7Function();
      reportFunction();
      trackSunExposure();
    }, 250);
  }


});