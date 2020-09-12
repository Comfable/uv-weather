
var b = chrome.extension.getBackgroundPage();
chrome.runtime.sendMessage({ msg: "BackgroundUpdate" });

$(function(){
  
window.onload = function() { 
refreshPopup();
};

  country = b.country;

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
  

  current_update_icon = b.current_update_icon;

  temperatureF = b.temperatureF;
  temperatureC = b.temperatureC;
  temperatureSign = b.temperatureSign;

  accufeelResultCsignTitle = "AccuFeel " + b.accufeelResultCsign;
  accufeelResultFsignTitle = "AccuFeel " + b.accufeelResultFsign;

  current_tempFsign_max = b.current_tempFsign_max;
  current_tempFsign_min = b.current_tempFsign_min;
  current_tempCsign_max = b.current_tempCsign_max;
  current_tempCsign_min = b.current_tempCsign_min;
  cityname = b.citys;
  current_uv = b.current_uv;
  current_uv_note = b.current_uv_note;
  uv1 = b.uv1;
  
  update_tomorrow_c = b.update_tomorrow_c;
  update_tomorrow_f = b.update_tomorrow_f;

  forecast_1_day1 = b.forecast_1_day;
  forecast_2_day1 = b.forecast_2_day;
  forecast_3_day1 = b.forecast_3_day;

  forecast_1_temp = b.forecast_1_tempF_sign;
  forecast_2_temp = b.forecast_2_tempF_sign;
  forecast_3_temp = b.forecast_3_tempF_sign;

  forecast_1_tempC_sign = b.forecast_1_tempC_sign;
  forecast_2_tempC_sign = b.forecast_2_tempC_sign;
  forecast_3_tempC_sign = b.forecast_3_tempC_sign;

  forecast_1_uv = b.forecast_1_uv;
  forecast_2_uv = b.forecast_2_uv;
  forecast_3_uv = b.forecast_3_uv;

  forecast_1_icon = b.forecast_1_icon;
  forecast_2_icon = b.forecast_2_icon;
  forecast_3_icon = b.forecast_3_icon;

  forecast_1_update_icon = b.forecast_1_update_icon;
  forecast_2_update_icon = b.forecast_2_update_icon;
  forecast_3_update_icon = b.forecast_3_update_icon;

  isDay = b.isDay;
  isNight = b.isNight;

  icon = b.icon;
  summary = b.summary;
  updateTime = b.updateTime;

  //updateTimeRelative = moment.unix(updateTime).format('h:mm:ss a');
  updateTimeRelative = "Updated " + moment.unix(updateTime).fromNow();


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
  

  function uvIconFunction() {
    $("#icon_uv_1").css('opacity', '.3');
    $("#icon_uv_2").css('opacity', '.3');
    $("#icon_uv_3").css('opacity', '.3');
    $("#icon_uv_4").css('opacity', '.3');
    $("#icon_uv_5").css('opacity', '.3');
    $("#icon_uv_6").css('opacity', '.3');

    // $(".icon_uv_10").css('display', 'none');
    // $(".icon_uv_20").css('display', 'none');
    // $(".icon_uv_30").css('display', 'none');
    // $(".icon_uv_40").css('display', 'none');
    // $(".icon_uv_50").css('display', 'none');
    // $(".icon_uv_60").css('display', 'none');
    
    if (uv1 == 1) {
        $("#icon_uv_1").css('opacity', '1');
      }
    else if (uv1 == 2) {
        $("#icon_uv_1").css('opacity', '1');
        $("#icon_uv_2").css('opacity', '1');
      }
    else if (uv1 >= 3 && uv1 <= 5) {
        $("#icon_uv_1").css('opacity', '1');
        $("#icon_uv_2").css('opacity', '1');
        $("#icon_uv_3").css('opacity', '1');
      }
    else if (uv1 >= 6 && uv1 <= 7) {
        $("#icon_uv_1").css('opacity', '1');
        $("#icon_uv_2").css('opacity', '1');
        $("#icon_uv_3").css('opacity', '1');
        $("#icon_uv_4").css('opacity', '1');
      }
    else if (uv1 >= 8) {
        $("#icon_uv_1").css('opacity', '1');
        $("#icon_uv_2").css('opacity', '1');
        $("#icon_uv_3").css('opacity', '1');
        $("#icon_uv_4").css('opacity', '1');
        $("#icon_uv_5").css('opacity', '1');
        $("#icon_uv_6").css('opacity', '1');
      }
  };
   uvIconFunction();

$('.current_icon_update').powerTip({ followMouse: 'true' });
$('#current_icon_update').data('powertip', summary);

function iconRefreshFunction() {
switch(icon) {
    case 'clear-day':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_sun.svg")');   
      $(".image_background").css('background-image', 'url("images/background/clear-day.jpg")');
      break;
    case 'clear-night':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_moon.svg")');
      $(".image_background").css('background-image', 'url("images/background/clear-night.jpg")');
      break;
    case 'rain':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud_rain.svg")');
            if (isDay) {
            $(".image_background").css('background-image', 'url("images/background/rain-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/rain-night.jpg")');
              }     
      break;
    case 'snow':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud_snow.svg")');
            if (isDay) {
            $(".image_background").css('background-image', 'url("images/background/snow-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/snow-night.jpg")');
              }
      break;
    case 'sleet':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud_snow_alt.svg")');
            if (isDay) {
            $(".image_background").css('background-image', 'url("images/background/sleet-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/sleet-night.jpg")');
              }
      break;
    case 'wind':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_wind.svg")');
            if (isDay) {
            $(".image_background").css('background-image', 'url("images/background/wind-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/wind-night.jpg")');
              }     
      break;
    case 'fog':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud_fog_alt.svg")');
            if (isDay) {
            $(".image_background").css('background-image', 'url("images/background/fog-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/fog-night.jpg")');
              }
      break;
    case 'cloudy':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud.svg")');
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
      break;
    case 'partly-cloudy-night':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud_moon.svg")');
      $(".image_background").css('background-image', 'url("images/background/partly-cloudy-night.jpg")');
      break;
    default:
      $(".current_icon_update").css('background-image', 'url("images/w_sun.svg")');
      $(".image_background").css('background-image', 'url("images/background/default.png")');
    break;
  }

};

iconRefreshFunction();
    
$('.forecast_1_icon_Class').powerTip({ placement: 'nw' });      
$('.forecast_2_icon_Class').powerTip({ placement: 'nw' });      
$('.forecast_3_icon_Class').powerTip({ placement: 'nw' });      


var i;
for (i = 1; i < 4; i++) {

  if (i == 1) {forecast_icon = forecast_1_icon;}
  else if (i == 2) {forecast_icon = forecast_2_icon;}
  else {forecast_icon = forecast_3_icon;}

switch(forecast_icon) {
    case 'clear-day':
      $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_sun.svg")');
      $('#forecast_'+ i +'_icon').data('powertip', 'Clear Day');
      break;
    case 'clear-night':
      $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_moon.svg")');
      $('#forecast_'+ i +'_icon').data('powertip', 'Clear Night');
     break;
    case 'rain':
      $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_rain.svg")');
      $('#forecast_'+ i +'_icon').data('powertip', 'Rainy');
     break;
     case 'snow':
      $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_snow.svg")');
      $('#forecast_'+ i +'_icon').data('powertip', 'Snowy');
     break;
     case 'sleet':
      $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_snow_alt.svg")');
      $('#forecast_'+ i +'_icon').data('powertip', 'Sleety');
     break;
     case 'wind':
      $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_wind.svg")');
      $('#forecast_'+ i +'_icon').data('powertip', 'Windy');
     break;
     case 'fog':
      $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_fog_alt.svg")');
      $('#forecast_'+ i +'_icon').data('powertip', 'Foggy');
     break;
     case 'cloudy':
      $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud.svg")');
      $('#forecast_'+ i +'_icon').data('powertip', 'Cloudy');
     break;
     case 'partly-cloudy-day':
      $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_sun.svg")');
      $('#forecast_'+ i +'_icon').data('powertip', 'Partly Cloudy');
     break;
     case 'partly-cloudy-night':
      $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_moon.svg")');
      $('#forecast_'+ i +'_icon').data('powertip', 'Partly Cloudy');
     break;
     default:
      $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/b_sun.svg")');
      $('#forecast_'+ i +'_icon').data('powertip', 'Sunny');
    break;
  }
}


  $("#location").html(cityname);
  $("#current_uv").html(current_uv);
  $("#current_uv_note").html(current_uv_note);

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
      $("#forecast_tomorrow").html(update_tomorrow_c);
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
      $("#forecast_tomorrow").html(update_tomorrow_f);
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
  $(".title_version_Class").html("Version " + version_manifest);


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

function refreshPopup(){
  setTimeout(function() {

    var b = chrome.extension.getBackgroundPage();

      updateTimeRelative = "Updated " + moment.unix(updateTime).fromNow();
      $('#current_temp').data('powertip', updateTimeRelative);
      $('#current_uv_group').data('powertip', updateTimeRelative);


      temperatureF = b.temperatureF;
      temperatureC = b.temperatureC;
      accufeelResultCsignTitle = "AccuFeel " + b.accufeelResultCsign;
      accufeelResultFsignTitle = "AccuFeel " + b.accufeelResultFsign;

      if (setSettingFC == "c") {
        ctemp();
      }
      else{
        ftemp();
      };


      current_uv = b.current_uv;
      current_uv_note = b.current_uv_note;
      uv1 = b.uv1;
      $("#current_uv").html(current_uv);
      $("#current_uv_note").html(current_uv_note);

     summary = b.summary;
     $('#current_icon_update').data('powertip', summary);

     icon = b.icon;
     iconRefreshFunction();

     uvIconFunction();



  }, 500);

}

});





