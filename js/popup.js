
var b = chrome.extension.getBackgroundPage();
chrome.runtime.sendMessage({ msg: "backgroundUpdate" });

$(document).ready(function(){

  window.onload = function() { 
    refreshPopup();
  };

  country = b.country;

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
        $("#setting_defualt_button_u").prop("checked", true);
        document.getElementById("setting_defualt_button_u").disabled = true;
      }
    else {
        $("#setting_defualt_button_t").prop("checked", true);
        document.getElementById("setting_defualt_button_t").disabled = true;
      }

    if (setSettingFC == "f") {
        $("#setting_defualt_button_f").prop("checked", true);
        document.getElementById("setting_defualt_button_f").disabled = true;
      }
    else {
        $("#setting_defualt_button_c").prop("checked", true);
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
    

  updateTimeRelative = "Updated " + dayjs.unix(b.updateTime).format("h:mm:ss A");
  $('.current_temp_Class, .current_uv_group_Class, .current_temp_max_Class, .current_temp_min_Class, .current_accufeel_Class, .location_Class').powerTip({ placement: 'e' });
  $('#current_temp').data('powertip', updateTimeRelative);
  $('.icon_uv_Class').powerTip({ placement: 's' });
  $('.forecast_temp_Class').powerTip({ placement: 'w' });
  $('.title_powered_Class').powerTip({placement: 's', mouseOnToPopup: 'true' });
   $('.current_icon_update').powerTip({ followMouse: 'true' });
  
  $('#current_icon_update').data('powertip', b.summary);
  $("#location").html(b.citys);
  $("#current_uv").html(b.uv1);
  $("#current_uv_note").html(b.current_uv_note);

  function uvRecommendation() {
    $("#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_4, #icon_uv_5, #icon_uv_6").css('opacity', '.3');
    if (b.uv1 == 1) {
        $("#icon_uv_1").css('opacity', '1');
      }
    else if (b.uv1 == 2) {
        $("#icon_uv_1, #icon_uv_2").css('opacity', '1');
      }
    else if (b.uv1 >= 3 && b.uv1 <= 5) {
        $("#icon_uv_1, #icon_uv_2, #icon_uv_3").css('opacity', '1');
      }
    else if (b.uv1 >= 6 && b.uv1 <= 7) {
        $("#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_4").css('opacity', '1');
      }
    else if (b.uv1 >= 8) {
        $("#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_4, #icon_uv_5, #icon_uv_6").css('opacity', '1');
      }
  }
  uvRecommendation();


  function iconCurrent() {
  switch(b.icon) {
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
            if (b.isDay) {
            $(".image_background").css('background-image', 'url("images/background/rain-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/rain-night.jpg")');
              }     
      break;
    case 'snow':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud_snow.svg")');
            if (b.isDay) {
            $(".image_background").css('background-image', 'url("images/background/snow-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/snow-night.jpg")');
              }
      break;
    case 'sleet':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud_snow_alt.svg")');
            if (b.isDay) {
            $(".image_background").css('background-image', 'url("images/background/sleet-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/sleet-night.jpg")');
              }
      break;
    case 'wind':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_wind.svg")');
            if (b.isDay) {
            $(".image_background").css('background-image', 'url("images/background/wind-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/wind-night.jpg")');
              }     
      break;
    case 'fog':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud_fog_alt.svg")');
            if (b.isDay) {
            $(".image_background").css('background-image', 'url("images/background/fog-day.jpg")');
              }
            else {
            $(".image_background").css('background-image', 'url("images/background/fog-night.jpg")');
              }
      break;
    case 'cloudy':
      $(".current_icon_update").css('background-image', 'url("images/weather_icon/w_cloud.svg")');
            if (b.isDay) {
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
  }
  iconCurrent();



  function ctemp(){
      $("#current_temp").html(b.temperatureC);
      $("#temp_sign").html("°C");
      $("#current_accufeel").html("AccuFeel " + b.accufeelResultC + "°");
      $("#current_temp_max").html(b.current_tempC_max + "°");
      $("#current_temp_min").html(b.current_tempC_min + "°");
      $("#forecast_tomorrow").html(b.update_tomorrow_c);


      for (i=1;i<4;i++){
        $(`#forecast_${i}_temp`).html(f2c(Math.round(b.result.daily.data[i].temperatureMax)) + "°");
        $(`#forecast_${i}_temp_min`).html(f2c(Math.round(b.result.daily.data[i].temperatureMin)) + "°");
      }

      for(i=1;i<8;i++){
        $(`#forecast_${i*10}_temp`).html(f2c(Math.round(b.result.daily.data[i].temperatureMax)) + "°");
        $(`#forecast_${i*10}_temp_min`).html(f2c(Math.round(b.result.daily.data[i].temperatureMin)) + "°");
      }

      for (i=1;i<25;i++){
          $(`#forecast_${i}_hours_temp`).html(Math.round(((b.result.hourly.data[i].temperature)-32) * 5/9) + "°");
      }

      $("#summery_next7_text").html(b.summaryDailyC);
      $("#summery_next48_text").html(b.summaryHourlyC);
  }

  function ftemp(){
    $("#current_temp").html(b.temperatureF);
    $("#temp_sign").html("°F");
    $("#current_accufeel").html("AccuFeel " + b.accufeelResultF + "°");
    $("#current_temp_max").html(b.current_tempF_max + "°");
    $("#current_temp_min").html(b.current_tempF_min + "°");
    $("#forecast_tomorrow").html(b.update_tomorrow_f);

   for (i=1;i<4;i++){
        $(`#forecast_${i}_temp`).html(Math.round(b.result.daily.data[i].temperatureMax) + "°");
        $(`#forecast_${i}_temp_min`).html(Math.round(b.result.daily.data[i].temperatureMin) + "°");
    }

    for(i=1;i<8;i++){
        $(`#forecast_${i*10}_temp`).html(Math.round(b.result.daily.data[i].temperatureMax) + "°");
        $(`#forecast_${i*10}_temp_min`).html(Math.round(b.result.daily.data[i].temperatureMin) + "°");
    }

    for (i=1;i<25;i++){
        $(`#forecast_${i}_hours_temp`).html(Math.round(b.result.hourly.data[i].temperature) + "°");
    }

    $("#summery_next7_text").html(b.summaryDailyF);
    $("#summery_next48_text").html(b.summaryHourlyF);
  }

  
  function solarFunction(){
    $("#solar_now_date").html(dayjs.unix(b.updateTime + b.offsetUnix).format('MMMM DD, h:mm A'));
    $("#solar_1_time").html(dayjs.unix(b.sunriseTimeSolar + b.offsetUnix).format('h:mm A'));
    $("#solar_2_time").html(dayjs.unix(b.sunsetTimeSolar + b.offsetUnix).format('h:mm A'));
    $("#solar_3_time").html(dayjs.unix(b.solarNoon + b.offsetUnix).format('h:mm A'));
    $("#solar_4_time").html(b.dayLength);
    $("#solar_5_time").html(dayjs.unix(b.goldenHourEnd + b.offsetUnix).format('h:mm A'));
    $("#solar_6_time").html(dayjs.unix(b.goldenHour + b.offsetUnix).format('h:mm A')); 
    $("#solar_7_time").html(dayjs.unix(b.dusk + b.offsetUnix).format('h:mm A'));
    $("#solar_8_time").html(dayjs.unix(b.dawn + b.offsetUnix).format('h:mm A'));
    $("#solar_9_time").html(dayjs.unix(b.nightStarts + b.offsetUnix).format('h:mm A'));

    $('.solar_Class').powerTip({ placement: 'w' });      
  }   
   A = Date.now();

  solarFunction();

  
  function next7Function(){
    $("#next7_update_date").html('Updated at ' + dayjs.unix(b.updateTime + b.offsetUnix).format('MMM DD, h:mm A'));

    for (i=1;i<4;i++){
        $(`#forecast_${i}_day`).html(dayjs.unix(b.result.daily.data[i].time).format('dddd'));
        $(`#forecast_${i}_uv`).html( "UVI " + (Math.round ((b.result.daily.data[i].uvIndex) * uv_adj_daily(b.result.daily.data[i].icon))));
    }

    for(i=1;i<8;i++){
        $(`#forecast_${i*10}_day`).html(dayjs.unix(b.result.daily.data[i].time).format('dddd'));
        $(`#forecast_${i*10}_uv`).html( "UVI " + (Math.round ((b.result.daily.data[i].uvIndex) * uv_adj_daily(b.result.daily.data[i].icon))));
    }

    var p;
    for (p = 1; p < 8; p++) {    
      $('.forecast_'+ p +'_icon_Class').powerTip({ placement: 'nw' });      
    }

    var i;
    for (i = 1; i < 8; i++) {
      forecast_icon = b.result.daily.data[i].icon; 
      switch(forecast_icon) {
        case 'clear-day':
          $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_sun.svg")');
          $('#forecast_'+ i +'_icon').data('powertip', 'Clear Day');
          $('#forecast_'+ i*10 +'_icon').data('powertip', 'Clear Day');
          break;
        case 'clear-night':
          $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_moon.svg")');
          $('#forecast_'+ i +'_icon').data('powertip', 'Clear Night');
          $('#forecast_'+ i*10 +'_icon').data('powertip', 'Clear Night');
         break;
        case 'rain':
          $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_rain.svg")');
          $('#forecast_'+ i +'_icon').data('powertip', 'Rainy');
          $('#forecast_'+ i*10 +'_icon').data('powertip', 'Rainy');
         break;
         case 'snow':
          $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_snow.svg")');
          $('#forecast_'+ i +'_icon').data('powertip', 'Snowy');
          $('#forecast_'+ i*10 +'_icon').data('powertip', 'Snowy');
         break;
         case 'sleet':
          $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_snow_alt.svg")');
          $('#forecast_'+ i +'_icon').data('powertip', 'Sleety');
          $('#forecast_'+ i*10 +'_icon').data('powertip', 'Sleety');
         break;
         case 'wind':
          $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_wind.svg")');
          $('#forecast_'+ i +'_icon').data('powertip', 'Windy');
          $('#forecast_'+ i*10 +'_icon').data('powertip', 'Windy');      
         break;
         case 'fog':
          $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_fog_alt.svg")');
          $('#forecast_'+ i +'_icon').data('powertip', 'Foggy');
          $('#forecast_'+ i*10 +'_icon').data('powertip', 'Foggy');      
         break;
         case 'cloudy':
          $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud.svg")');
          $('#forecast_'+ i +'_icon').data('powertip', 'Cloudy');
          $('#forecast_'+ i*10 +'_icon').data('powertip', 'Cloudy');      
         break;
         case 'partly-cloudy-day':
          $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_sun.svg")');
          $('#forecast_'+ i +'_icon').data('powertip', 'Partly Cloudy');
          $('#forecast_'+ i*10 +'_icon').data('powertip', 'Partly Cloudy');      
         break;
         case 'partly-cloudy-night':
          $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_moon.svg")');
          $('#forecast_'+ i +'_icon').data('powertip', 'Partly Cloudy');
          $('#forecast_'+ i*10 +'_icon').data('powertip', 'Partly Cloudy');      
         break;
         default:
          $('.forecast_'+ i +'_icon_Class').css('background-image', 'url("images/b_sun.svg")');
          $('#forecast_'+ i +'_icon').data('powertip', 'Sunny');
          $('#forecast_'+ i*10 +'_icon').data('powertip', 'Sunny');      
        break;
        }
    }

  }
  next7Function();


  function next48Function(){
    $("#next48_update_date").html('Updated at ' + dayjs.unix(b.updateTime + b.offsetUnix).format('MMM DD, h:mm A'));
    for(i=1;i<25;i++){
        $(`#forecast_${i}_hours`).html(dayjs.unix(b.result.hourly.data[i].time + b.offsetUnix).format('h A'));
        $(`#forecast_${i}_hours_uv`).html("UVI " + Math.round((b.result.hourly.data[i].uvIndex) * uv_adj_daily(b.result.hourly.data[i].icon, b.result.hourly.data[i].cloudCover)));
    }
  
    var i;
    for (i = 1; i < 25; i++) {
      forecast_hours_icon = b.result.hourly.data[i].icon;
    switch(forecast_hours_icon) {
      case 'clear-day':
        $('.forecast_'+ i +'_hours_icon_Class').css('background-image', 'url("images/weather_icon/b_sun.svg")');
        break;
      case 'clear-night':
        $('.forecast_'+ i +'_hours_icon_Class').css('background-image', 'url("images/weather_icon/b_moon.svg")');
       break;
      case 'rain':
        $('.forecast_'+ i +'_hours_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_rain.svg")');
       break;
       case 'snow':
        $('.forecast_'+ i +'_hours_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_snow.svg")');
       break;
       case 'sleet':
        $('.forecast_'+ i +'_hours_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_snow_alt.svg")');
       break;
       case 'wind':
        $('.forecast_'+ i +'_hours_icon_Class').css('background-image', 'url("images/weather_icon/b_wind.svg")');
       break;
       case 'fog':
        $('.forecast_'+ i +'_hours_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_fog_alt.svg")');
       break;
       case 'cloudy':
        $('.forecast_'+ i +'_hours_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud.svg")');
       break;
       case 'partly-cloudy-day':
        $('.forecast_'+ i +'_hours_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_sun.svg")');
       break;
       case 'partly-cloudy-night':
        $('.forecast_'+ i +'_hours_icon_Class').css('background-image', 'url("images/weather_icon/b_cloud_moon.svg")');
       break;
       default:
        $('.forecast_'+ i +'_hours_icon_Class').css('background-image', 'url("images/b_sun.svg")');
      break;
      }
    }
  }
  next48Function();


  if (b.uv1 == 0 || b.isNight) {
      $("#link_qsun_text").html("Track your vitamin D intake");
   }
  else{
      $("#link_qsun_text").html("Track your sun exposure");
    }

  var manifest = chrome.runtime.getManifest();
  version_manifest = manifest.version;
  $(".title_version_Class").html("Version " + version_manifest);

  var options = {

    url: function(phrase, latandlongMapBox) {
      if (typeof ((b.latandlong.split('"'))[1]) !== 'undefined') {
        latandlongMapBox = ((b.latandlong.split('"'))[1]).split(',').reverse().join(',');
      }
      else {
        latandlongMapBox = "-79.3832,43.6532";
      } 
        if (phrase !== "") {
            return "https://api.mapbox.com/geocoding/v5/mapbox.places/" + phrase + ".json?types=place&proximity=" + latandlongMapBox + "&limit=5&autocomplete=true&language=en,de,fr,nl,it,ja,ar,es,zh,sv,ko&access_token=pk.eyJ1IjoiY29tZmFibGUiLCJhIjoiY2sybTF6Z3FpMGRkeTNscWxhMnNybnU3cyJ9.VDvM0a0jaMlLMwlqBI8kUw";
          } else {
            return "https://api.mapbox.com/geocoding/v5/mapbox.places/" + "Toronto" + ".json?types=place&proximity=-79.3832,43.6532&limit=5&autocomplete=true&language=en,de,fr,nl,it,ja,ar,es,zh,sv,ko&access_token=pk.eyJ1IjoiY29tZmFibGUiLCJhIjoiY2sybTF6Z3FpMGRkeTNscWxhMnNybnU3cyJ9.VDvM0a0jaMlLMwlqBI8kUw";
        }
      },

    getValue: function(element) {
      if (typeof ((element.place_name_en).split(',').splice(0,2).join(',')) !== 'undefined') {
        cityProvince = (element.place_name_en).split(',').splice(0,2).join(',');
          if (typeof (element.context[0].short_code) !== 'undefined') {
            countryShort = (element.context[0].short_code).split('-').splice(0,1).join('');
            countryShort = countryShort.toUpperCase();
            cityCountry = (cityProvince + ', ' + countryShort).slice(0, 35);
          }
          else {
            cityCountry = cityProvince;
          }
      }
      else {
        cityCountry = "Toronto, Ontario, CA";
      }      
      return cityCountry;
    },

    ajaxSettings: {
      dataType: "json",
      method: "GET",
      data: {
        dataType: "json"
      }
    },
    listLocation: "features",
    preparePostData: function(data) {
      data.phrase = $("#citySearch").val();
      return data;
    },

      list: {
        showAnimation: {
          type: "fade",
          time: 200,
          callback: function() {}
        },
        hideAnimation: {
          type: "normal",
          time: 200,
          callback: function() {}
        },
        maxNumberOfElements: 5,
        match: {
          enabled: true
        },


        onChooseEvent: function() {
          var cityFull = $("#citySearch").getSelectedItemData().text;

          var lat = $("#citySearch").getSelectedItemData().geometry.coordinates[1];
          var lng = $("#citySearch").getSelectedItemData().geometry.coordinates[0];
          var countryCode = $("#citySearch").getSelectedItemData().place_name;
          countryFull = (countryCode.split(','))[2];
       
          city =  '"' + cityFull + '"';
          latlong =  '"' + lat + ',' + lng + '"';

          chrome.storage.local.set({'latlongPopup': latlong});
          chrome.storage.local.set({'cityPopup': city});
          chrome.storage.local.set({'countryPopup': country});
          chrome.storage.local.set({'fromSearch': "locationSearch"});
          chrome.runtime.sendMessage({ msg: "fromSearchUpdate" });
           
           setTimeout(function(){
              refreshPopup();
           }, 750); 

           setTimeout(function(){
              $.modal.close();
           }, 1500); 

        },

  },
    adjustWidth: false,
    requestDelay: 400,
    theme: "square"
  };
  $("#citySearch").easyAutocomplete(options);


  $("#setting_defualt_button_u").click(function(){  
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

  $("#setting_defualt_button_t").click(function (){  
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

  $("#setting_defualt_button_c").click(function(){
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

  $("#setting_defualt_button_f").click(function(){
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



  function refreshPopup(){
    setTimeout(function(){

    updateTimeRelative = "Updated " + dayjs.unix(b.updateTime).format("h:mm:ss A");
    $('#current_temp').data('powertip', updateTimeRelative);

    if (setSettingFC == "c"){
      ctemp();
    }
    else{
       ftemp();
    }

    $("#location").html(b.citys);
    $("#current_uv").html(b.uv1);
    $("#current_uv_note").html(b.current_uv_note);
    $('#current_icon_update').data('powertip', b.summary);

    iconCurrent();
    uvRecommendation();
    solarFunction();
    next48Function();
    next7Function();

    }, 250);
  }


});