
var background = chrome.extension.getBackgroundPage();

$(function(){

  chrome.runtime.sendMessage({ msg: "BackgroundUpdate" });
  chrome.runtime.sendMessage({ msg: "animatedBadge" });

  country = background.country;

  function UTFC (){
    chrome.storage.sync.get(['setSettingFC', 'setSettingUT'], function(data) {
    setSettingFC = data.setSettingFC;
    setSettingUT = data.setSettingUT;


    if (typeof setSettingFC === 'undefined') {
         if (country == "US") {
             setSettingFC = "f";
             chrome.storage.sync.set({'setSettingFC': 'f'});
         } else {
            setSettingFC = "c";
            chrome.storage.sync.set({'setSettingFC': 'c'});
         }
      }

    if (typeof setSettingUT === 'undefined') {
        setSettingUT = "t";
        chrome.storage.sync.set({'setSettingUT': 't'});
      }

    if (setSettingUT == "u") {
        $("#setting_defualt_button_u").prop("checked", true);
        document.getElementById("setting_defualt_button_u").disabled = true;
      }
    else {
        $("#setting_defualt_button_t").prop("checked", true);
        document.getElementById("setting_defualt_button_t").disabled = true;
      };

    if (setSettingFC == "f") {
        $("#setting_defualt_button_f").prop("checked", true);
        document.getElementById("setting_defualt_button_f").disabled = true;
      }
    else {
        $("#setting_defualt_button_c").prop("checked", true);
        document.getElementById("setting_defualt_button_c").disabled = true;
      };

    if (setSettingFC == 'f'){
        ftemp();
      }
    else {
        ctemp(); 
      };

    return;
      });
    }
    utfc = UTFC(function(value){  
  });
  

  current_update_icon = background.current_update_icon;

  temperatureF = background.temperatureF;
  temperatureC = background.temperatureC;
  temperatureSign = background.temperatureSign;

  accufeelResultCsignTitle = "AccuFeel " + background.accufeelResultCsign;
  accufeelResultFsignTitle = "AccuFeel " + background.accufeelResultFsign;

  current_tempFsign_max = background.current_tempFsign_max;
  current_tempFsign_min = background.current_tempFsign_min;
  current_tempCsign_max = background.current_tempCsign_max;
  current_tempCsign_min = background.current_tempCsign_min;
  cityname = background.citys;
  current_uv = background.current_uv;
  current_uv_note = background.current_uv_note;
  uv1 = background.uv1;
  
  update_tomorrow = background.update_tomorrow;

  forecast_1_day1 = background.forecast_1_day;
  forecast_2_day1 = background.forecast_2_day;
  forecast_3_day1 = background.forecast_3_day;

  forecast_1_temp = background.forecast_1_tempF_sign;
  forecast_2_temp = background.forecast_2_tempF_sign;
  forecast_3_temp = background.forecast_3_tempF_sign;

  forecast_1_tempC_sign = background.forecast_1_tempC_sign;
  forecast_2_tempC_sign = background.forecast_2_tempC_sign;
  forecast_3_tempC_sign = background.forecast_3_tempC_sign;

  forecast_1_uv = background.forecast_1_uv;
  forecast_2_uv = background.forecast_2_uv;
  forecast_3_uv = background.forecast_3_uv;

  forecast_1_icon = background.forecast_1_icon;
  forecast_2_icon = background.forecast_2_icon;
  forecast_3_icon = background.forecast_3_icon;

  forecast_1_update_icon = background.forecast_1_update_icon;
  forecast_2_update_icon = background.forecast_2_update_icon;
  forecast_3_update_icon = background.forecast_3_update_icon;

  isDay = background.isDay;
  isNight = background.isNight;

  icon = background.icon;

  updateTime = background.updateTime;
  updateTimeRelative = "Updated " + moment.unix(updateTime).fromNow();
  console.log("updateTime " + updateTimeRelative);


  $('.current_temp_Class').powerTip({ placement: 's' });
  $('#current_temp').data('powertip', updateTimeRelative);
  $('.current_uv_group_Class').powerTip({ placement: 's' });
  $('#current_uv_group').data('powertip', updateTimeRelative);
  
  $('.icon_uv_Class').powerTip({ placement: 's' });

  $('.forecast_1_temp_Class').powerTip({ placement: 'nw' });
  $('.forecast_2_temp_Class').powerTip({ placement: 'nw' });
  $('.forecast_3_temp_Class').powerTip({ placement: 'nw' });

  $('.current_temp_max_Class').powerTip({ placement: 's' });
  $('.current_temp_min_Class').powerTip({ placement: 's' });

  $('.current_accufeel_Class').powerTip({ placement: 's' });

  $('.title_powered_Class').powerTip({placement: 's', mouseOnToPopup: 'true' });
  
  if (uv1 == 0) {
      $("#icon_uv_1").css('opacity', '.3');
      $("#icon_uv_2").css('opacity', '.3');
      $("#icon_uv_3").css('opacity', '.3');
      $("#icon_uv_4").css('opacity', '.3');
      $("#icon_uv_5").css('opacity', '.3');
      $("#icon_uv_6").css('opacity', '.3');
    }
  else if (uv1 >= 1 && uv1 <= 2) {
      $("#icon_uv_1").css('opacity', '1');
      $("#icon_uv_2").css('opacity', '1');
      $("#icon_uv_3").css('opacity', '.3');
      $("#icon_uv_4").css('opacity', '.3');
      $("#icon_uv_5").css('opacity', '.3');
      $("#icon_uv_6").css('opacity', '.3');
    }
  else if (uv1 >= 3 && uv1 <= 5) {
      $("#icon_uv_1").css('opacity', '1');
      $("#icon_uv_2").css('opacity', '1');
      $("#icon_uv_3").css('opacity', '1');
      $("#icon_uv_4").css('opacity', '.3');
      $("#icon_uv_5").css('opacity', '.3');
      $("#icon_uv_6").css('opacity', '.3');
    }
  else if (uv1 >= 6 && uv1 <= 7) {
      $("#icon_uv_1").css('opacity', '1');
      $("#icon_uv_2").css('opacity', '1');
      $("#icon_uv_3").css('opacity', '1');
      $("#icon_uv_4").css('opacity', '1');
      $("#icon_uv_5").css('opacity', '.3');
      $("#icon_uv_6").css('opacity', '.3');
    }
  else if (uv1 >= 8) {
      $("#icon_uv_1").css('opacity', '1');
      $("#icon_uv_2").css('opacity', '1');
      $("#icon_uv_3").css('opacity', '1');
      $("#icon_uv_4").css('opacity', '1');
      $("#icon_uv_5").css('opacity', '1');
      $("#icon_uv_6").css('opacity', '1');
    }


switch(icon) {
    case 'clear-day':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_sun.svg")');   
      $(".image_background").css('background-image', 'url("images/background/clear-day.jpg")');
      $('#current_icon_update').data('powertip', 'Clear Day');
      break;
    case 'clear-night':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_moon.svg")');
      $('.current_icon_update').powerTip({ followMouse: 'true' });
      $('#current_icon_update').data('powertip', 'Clear Night');
      $(".image_background").css('background-image', 'url("images/background/clear-night.jpg")');
      break;
    case 'rain':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud_rain.svg")');
      $('.current_icon_update').powerTip({ followMouse: 'true' });
      $('#current_icon_update').data('powertip', 'Rainy');
            if (isDay) {
            $(".image_background").css('background-image', 'url("images/background/rain-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/rain-night.jpg")');
              }     
      break;
    case 'snow':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud_snow.svg")');
      $('.current_icon_update').powerTip({ followMouse: 'true' });
      $('#current_icon_update').data('powertip', 'Snowy');
            if (isDay) {
            $(".image_background").css('background-image', 'url("images/background/snow-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/snow-night.jpg")');
              }
      break;
    case 'sleet':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud_snow_alt.svg")');
      $('.current_icon_update').powerTip({ followMouse: 'true' });
      $('#current_icon_update').data('powertip', 'Sleety');
            if (isDay) {
            $(".image_background").css('background-image', 'url("images/background/sleet-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/sleet-night.jpg")');
              }
      break;
    case 'wind':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_wind.svg")');
      $('.current_icon_update').powerTip({ followMouse: 'true' });
      $('#current_icon_update').data('powertip', 'Windy');
            if (isDay) {
            $(".image_background").css('background-image', 'url("images/background/wind-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/wind-night.jpg")');
              }     
      break;
    case 'fog':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud_fog_alt.svg")');
      $('.current_icon_update').powerTip({ followMouse: 'true' });
      $('#current_icon_update').data('powertip', 'Foggy');
            if (isDay) {
            $(".image_background").css('background-image', 'url("images/background/fog-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/fog-night.jpg")');
              }
      break;
    case 'cloudy':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud.svg")');
      $('.current_icon_update').powerTip({ followMouse: 'true' });
      $('#current_icon_update').data('powertip', 'Cloudy');
            if (isDay) {
            $(".image_background").css('background-image', 'url("images/background/cloudy-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/cloudy-night.jpg")');
              }
      break;
    case 'partly-cloudy-day':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud_sun.svg")');
      $(".image_background").css('background-image', 'url("images/background/partly-cloudy-day.jpg")');
      $('.current_icon_update').powerTip({ followMouse: 'true' });
      $('#current_icon_update').data('powertip', 'Partly Cloudy');
      break;
    case 'partly-cloudy-night':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud_moon.svg")');
      $(".image_background").css('background-image', 'url("images/background/partly-cloudy-night.jpg")');
      $('.current_icon_update').powerTip({ followMouse: 'true' });
      $('#current_icon_update').data('powertip', 'Partly Cloudy');
      break;
    default:
      $(".current_icon_update").css('background-image', 'url("images/w_sun.svg")');
      $('.current_icon_update').powerTip({ followMouse: 'true' });
      $('#current_icon_update').data('powertip', 'Sunny');
      $(".image_background").css('background-image', 'url("images/background/default.png")');
    break;
  }

     
switch(forecast_1_icon) {
    case 'clear-day':
      $(".forecast_1_icon_Class").css('background-image', 'url("images/weather_icon/b_sun.svg")');
      $('#forecast_1_icon').data('powertip', 'Clear Day');
      $('.forecast_1_icon_Class').powerTip({ placement: 'nw' });      
      break;
    case 'clear-night':
      $(".forecast_1_icon_Class").css('background-image', 'url("images/weather_icon/b_moon.svg")');
      $('#forecast_1_icon').data('powertip', 'Clear Night');
      $('.forecast_1_icon_Class').powerTip({ placement: 'nw' });      
     break;
    case 'rain':
      $(".forecast_1_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_rain.svg")');
      $('#forecast_1_icon').data('powertip', 'Rainy');
      $('.forecast_1_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'snow':
      $(".forecast_1_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_snow.svg")');
      $('#forecast_1_icon').data('powertip', 'Snowy');
      $('.forecast_1_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'sleet':
      $(".forecast_1_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_snow_alt.svg")');
      $('#forecast_1_icon').data('powertip', 'Sleety');
      $('.forecast_1_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'wind':
      $(".forecast_1_icon_Class").css('background-image', 'url("images/weather_icon/b_wind.svg")');
      $('#forecast_1_icon').data('powertip', 'Windy');
      $('.forecast_1_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'fog':
      $(".forecast_1_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_fog_alt.svg")');
      $('#forecast_1_icon').data('powertip', 'Foggy');
      $('.forecast_1_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'cloudy':
      $(".forecast_1_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud.svg")');
      $('#forecast_1_icon').data('powertip', 'Cloudy');
      $('.forecast_1_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'partly-cloudy-day':
      $(".forecast_1_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_sun.svg")');
      $('#forecast_1_icon').data('powertip', 'Partly Cloudy');
      $('.forecast_1_icon_Class').powerTip({ placement: 'nw' });
     break;
     case 'partly-cloudy-night':
      $(".forecast_1_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_moon.svg")');
      $('#forecast_1_icon').data('powertip', 'Partly Cloudy');
      $('.forecast_1_icon_Class').powerTip({ placement: 'nw' });      
     break;
     default:
      $(".forecast_1_icon_Class").css('background-image', 'url("images/b_sun.svg")');
      $('#forecast_1_icon').data('powertip', 'Sunny');
      $('.forecast_1_icon_Class').powerTip({ placement: 'nw' });          
    break;
  }


switch(forecast_2_icon) {
    case 'clear-day':
      $(".forecast_2_icon_Class").css('background-image', 'url("images/weather_icon/b_sun.svg")');
      $('#forecast_2_icon').data('powertip', 'Clear Day');
      $('.forecast_2_icon_Class').powerTip({ placement: 'nw' });      
      break;
    case 'clear-night':
      $(".forecast_2_icon_Class").css('background-image', 'url("images/weather_icon/b_moon.svg")');
      $('#forecast_2_icon').data('powertip', 'Clear Night');
      $('.forecast_2_icon_Class').powerTip({ placement: 'nw' });      
     break;
    case 'rain':
      $(".forecast_2_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_rain.svg")');
      $('#forecast_2_icon').data('powertip', 'Rainy');
      $('.forecast_2_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'snow':
      $(".forecast_2_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_snow.svg")');
      $('#forecast_2_icon').data('powertip', 'Snowy');
      $('.forecast_2_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'sleet':
      $(".forecast_2_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_snow_alt.svg")');
      $('#forecast_2_icon').data('powertip', 'Sleety');
      $('.forecast_2_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'wind':
      $(".forecast_2_icon_Class").css('background-image', 'url("images/weather_icon/b_wind.svg")');
      $('#forecast_2_icon').data('powertip', 'Windy');
      $('.forecast_2_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'fog':
      $(".forecast_2_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_fog_alt.svg")');
      $('#forecast_2_icon').data('powertip', 'Foggy');
      $('.forecast_2_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'cloudy':
      $(".forecast_2_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud.svg")');
      $('#forecast_2_icon').data('powertip', 'Cloudy');
      $('.forecast_2_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'partly-cloudy-day':
      $(".forecast_2_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_sun.svg")');
      $('#forecast_2_icon').data('powertip', 'Partly Cloudy');
      $('.forecast_2_icon_Class').powerTip({ placement: 'nw' });
     break;
     case 'partly-cloudy-night':
      $(".forecast_2_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_moon.svg")');
      $('#forecast_2_icon').data('powertip', 'Partly Cloudy');
      $('.forecast_2_icon_Class').powerTip({ placement: 'nw' });      
     break;
     default:
      $(".forecast_2_icon_Class").css('background-image', 'url("images/b_sun.svg")');
      $('#forecast_2_icon').data('powertip', 'Sunny');
      $('.forecast_2_icon_Class').powerTip({ placement: 'nw' });          
    break;
  }


switch(forecast_3_icon) {
    case 'clear-day':
      $(".forecast_3_icon_Class").css('background-image', 'url("images/weather_icon/b_sun.svg")');
      $('#forecast_3_icon').data('powertip', 'Clear Day');
      $('.forecast_3_icon_Class').powerTip({ placement: 'nw' });      
      break;
    case 'clear-night':
      $(".forecast_3_icon_Class").css('background-image', 'url("images/weather_icon/b_moon.svg")');
      $('#forecast_3_icon').data('powertip', 'Clear Night');
      $('.forecast_3_icon_Class').powerTip({ placement: 'nw' });      
     break;
    case 'rain':
      $(".forecast_3_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_rain.svg")');
      $('#forecast_3_icon').data('powertip', 'Rainy');
      $('.forecast_3_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'snow':
      $(".forecast_3_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_snow.svg")');
      $('#forecast_3_icon').data('powertip', 'Snowy');
      $('.forecast_3_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'sleet':
      $(".forecast_3_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_snow_alt.svg")');
      $('#forecast_3_icon').data('powertip', 'Sleety');
      $('.forecast_3_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'wind':
      $(".forecast_3_icon_Class").css('background-image', 'url("images/weather_icon/b_wind.svg")');
      $('#forecast_3_icon').data('powertip', 'Windy');
      $('.forecast_3_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'fog':
      $(".forecast_3_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_fog_alt.svg")');
      $('#forecast_3_icon').data('powertip', 'Foggy');
      $('.forecast_3_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'cloudy':
      $(".forecast_3_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud.svg")');
      $('#forecast_3_icon').data('powertip', 'Cloudy');
      $('.forecast_3_icon_Class').powerTip({ placement: 'nw' });      
     break;
     case 'partly-cloudy-day':
      $(".forecast_3_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_sun.svg")');
      $('#forecast_3_icon').data('powertip', 'Partly Cloudy');
      $('.forecast_3_icon_Class').powerTip({ placement: 'nw' });
     break;
     case 'partly-cloudy-night':
      $(".forecast_3_icon_Class").css('background-image', 'url("images/weather_icon/b_cloud_moon.svg")');
      $('#forecast_3_icon').data('powertip', 'Partly Cloudy');
      $('.forecast_3_icon_Class').powerTip({ placement: 'nw' });      
     break;
     default:
      $(".forecast_3_icon_Class").css('background-image', 'url("images/b_sun.svg")');
      $('#forecast_3_icon').data('powertip', 'Sunny');
      $('.forecast_3_icon_Class').powerTip({ placement: 'nw' });          
    break;
  }
         
   
  $("#location").html(cityname);
  $("#current_uv").html(current_uv);
  $("#current_uv_note").html(current_uv_note);

  $("#forecast_tomorrow").html(update_tomorrow);

  $("#forecast_1_day").html(forecast_1_day1);
	$("#forecast_1_uv").html(forecast_1_uv); 
 
  $("#forecast_2_day").html(forecast_2_day1);
	$("#forecast_2_uv").html(forecast_2_uv);

  $("#forecast_3_day").html(forecast_3_day1);
  $("#forecast_3_uv").html(forecast_3_uv);


  function ctemp(){
      $("#current_temp").html(temperatureC);
      $("#temp_sign").html("°C");
      $("#current_accufeel").html(accufeelResultCsignTitle);
      $("#current_temp_max").html(current_tempCsign_max);
      $("#current_temp_min").html(current_tempCsign_min);
      $("#forecast_1_temp").html(forecast_1_tempC_sign);
      $("#forecast_2_temp").html(forecast_2_tempC_sign);
      $("#forecast_3_temp").html(forecast_3_tempC_sign);      
    }

  function ftemp(){
      $("#current_temp").html(temperatureF);
      $("#temp_sign").html("°F");
      $("#current_accufeel").html(accufeelResultFsignTitle);
      $("#current_temp_max").html(current_tempFsign_max);
      $("#current_temp_min").html(current_tempFsign_min);
      $("#forecast_1_temp").html(forecast_1_temp);
      $("#forecast_2_temp").html(forecast_2_temp);
      $("#forecast_3_temp").html(forecast_3_temp);    
    }


  if (uv1 == 0 || isNight) {
      $("#link_qsun_text").html("Track your vitamin D intake");
   }
  else{
      $("#link_qsun_text").html("Track your sun exposure");
    }


  var manifest = chrome.runtime.getManifest();
  version_manifest = manifest.version;
  $("#title_version").html("Version " + version_manifest);





//Click events
  $("#setting_defualt_button_u").click(function () {  
    setSettingUT = "u";
    chrome.storage.sync.set({'setSettingUT': 'u'});
    chrome.browserAction.setBadgeText({"text": "UV "+ uv1 });
    chrome.runtime.sendMessage({ msg: "BackgroundUpdate" });
    document.getElementById("setting_defualt_button_u").disabled = true;
    document.getElementById("setting_defualt_button_t").disabled = false;
  });

  $("#setting_defualt_button_t").click(function () {  
    setSettingUT = "t"
    chrome.runtime.sendMessage({ msg: "BackgroundUpdate" });
    chrome.storage.sync.set({'setSettingUT': 't'});
    document.getElementById("setting_defualt_button_t").disabled = true;
    document.getElementById("setting_defualt_button_u").disabled = false;
  });

  $("#setting_defualt_button_c").click(function() {
      setSettingFC = "c";
      chrome.runtime.sendMessage({ msg: "BackgroundUpdate" });
      chrome.storage.sync.set({'setSettingFC': 'c'});
     ctemp(); 
     document.getElementById("setting_defualt_button_c").disabled = true;
    document.getElementById("setting_defualt_button_f").disabled = false;
   });

  $("#setting_defualt_button_f").click(function() {
      setSettingFC = "f";
      chrome.runtime.sendMessage({ msg: "BackgroundUpdate" });
      chrome.storage.sync.set({'setSettingFC': 'f'});
      ftemp();
      document.getElementById("setting_defualt_button_f").disabled = true;
      document.getElementById("setting_defualt_button_c").disabled = false;
  });




});

