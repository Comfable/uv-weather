var b = chrome.extension.getBackgroundPage();
chrome.runtime.sendMessage({ msg: "backgroundUpdate" });

document.addEventListener("DOMContentLoaded", function(event) {

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

mapStyleLight = 'mapbox://styles/comfable/ck540l8q22n1n1cpb2uceu4we';
weathermapStyleLight = 'mapbox://styles/mapbox/light-v10';
mapStyleDark = 'mapbox://styles/comfable/ck53akus306vq1cn1vqcqmlbt';
weathermapStyleDark = 'mapbox://styles/comfable/ck53akus306vq1cn1vqcqmlbt';

mapStyle = mapStyleLight;
weathermapStyle = weathermapStyleLight;


chrome.storage.local.get('closeAds', function(data) {
    if(data.closeAds == 1) {
      var donateButton = document.getElementById("donate_button");
      var donateClose = document.getElementById("icon_colse_box");
      var donateCard = document.getElementById("cardMain");
      donateButton.style.display = "none";
      donateClose.style.display = "none";
      donateCard.style.display = "none";
    }
});


chrome.storage.local.get(['theme', 'autoDark'], function(data) {
    const currentTheme = data.theme;
    const autoDarkTheme = data.autoDark;

      if(currentTheme || autoDarkTheme) {
          document.documentElement.setAttribute('data-theme', currentTheme);
          
          if(autoDarkTheme == '1' && b.isNight) {
              darkDisplay();
          }
          else if(autoDarkTheme == '1' && b.isDay) {
              lightDisplay();    
          }
          else if(currentTheme === 'dark') {
              toggleSwitch.checked = true;
              darkDisplay();     
          }
          else {
              lightDisplay();
          }
      }
      else{
        document.getElementById("setting_defualt_theme_l").checked = true;      
      }

      function switchTheme(e) {
          if(e.target.checked) {
              darkDisplay();    
              delayButtonDarkmode();
          }
          else {
              lightDisplay();    
              delayButtonDarkmode();
          }    
      }

      toggleSwitch.addEventListener('change', switchTheme, false);
  });

 
  document.querySelector("#setting_defualt_theme_d").addEventListener("click", (e) => {
    darkDisplay();
  });

  document.querySelector("#setting_defualt_theme_l").addEventListener("click", (e) => {
    lightDisplay();
  });


  const toggleSwitchAutoDark = document.querySelector('.theme-switch_setting_auto_dark input[type="checkbox"]');
  chrome.storage.local.get('autoDark', function(data) {
    const currentAutoDark = data.autoDark;

      if(currentAutoDark) {      
          if(currentAutoDark === '1') {
              toggleSwitchAutoDark.checked = true;
              chrome.storage.local.set({'autoDark': '1'});
          }
          else {
              chrome.storage.local.set({'autoDark': '0'});
          }
      }

    function switchAutoDark(e) {
      if(e.target.checked) {
        chrome.storage.local.set({'autoDark': '1'});
        document.getElementById("checkbox_autoDark").checked = true;
        document.getElementById("checkbox_autoDark").disabled = true;
        if(b.isNight) {
            darkDisplay();
        }
        else {
            lightDisplay();    
        }

        delayButtonAutoDarkmode();
      }
      else {
        chrome.storage.local.set({'autoDark': '0'});
        document.getElementById("checkbox_autoDark").checked = false;
        document.getElementById("checkbox_autoDark").disabled = true;
        delayButtonAutoDarkmode();
      }    
    }
    toggleSwitchAutoDark.addEventListener('change', switchAutoDark, false);
  });





  const toggleSwitchWhiteIcon = document.querySelector('.theme-switch_setting input[type="checkbox"]');
  chrome.storage.local.get('whiteIcon', function(data) {
    const currentWhiteIcon = data.whiteIcon;

      if(currentWhiteIcon) {      
          if(currentWhiteIcon === '1') {
              toggleSwitchWhiteIcon.checked = true;
              chrome.storage.local.set({'whiteIcon': '1'});
          }
          else {
              chrome.storage.local.set({'whiteIcon': '0'});
          }
      }

      if((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) && (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
          document.getElementById("checkbox_whiteIcon").checked = true;
      }
      else if((window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) && (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
          document.getElementById("checkbox_whiteIcon").checked = false;
      }

    function switchWhiteIcon(e) {
      if(e.target.checked) {
        chrome.storage.local.set({'whiteIcon': '1'});
        document.getElementById("checkbox_whiteIcon").checked = true;
        document.getElementById("checkbox_whiteIcon").disabled = true;
        chrome.runtime.sendMessage({ msg: "backgroundUpdate" });
        delayButtonWhiteIcon();
      }
      else {
        chrome.storage.local.set({'whiteIcon': '0'});
        document.getElementById("checkbox_whiteIcon").checked = false;
        document.getElementById("checkbox_whiteIcon").disabled = true;
        chrome.runtime.sendMessage({ msg: "backgroundUpdate" });
        delayButtonWhiteIcon();
      }    
    }
    toggleSwitchWhiteIcon.addEventListener('change', switchWhiteIcon, false);

  });


  function darkDisplay() {
    document.documentElement.setAttribute('data-theme', 'dark');
    mapStyle = mapStyleDark;
    weathermapStyle = weathermapStyleDark;
    document.getElementById("setting_defualt_theme_d").checked = true;
    document.getElementById("checkbox").checked = true;
    chrome.storage.local.set({'theme': 'dark'});
  };

  function lightDisplay() {
    document.documentElement.setAttribute('data-theme', 'light');
    mapStyle = mapStyleLight;
    weathermapStyle = weathermapStyleLight;
    document.getElementById("setting_defualt_theme_l").checked = true;
    document.getElementById("checkbox").checked = false;
    chrome.storage.local.set({'theme': 'light'}); 
  };

  function delayButtonDarkmode() {
      setTimeout(function() {
      document.getElementById("checkbox").disabled = false;
    }, 1500);
  };

  function delayButtonAutoDarkmode() {
      setTimeout(function() {
      document.getElementById("checkbox_autoDark").disabled = false;
    }, 3000);
  };


  function delayButtonWhiteIcon() {
      setTimeout(function() {
      document.getElementById("checkbox_whiteIcon").disabled = false;
    }, 3000);
  };


if(navigator.onLine) {

  //window.onload = function() { 
    refreshPopup();
  //};

  country = b.country;


  function groundFlickr() {

    switch(b.icon) {
      case 'clear-day':
            if (b.isDay) {
          galleryID = '72157711948824252';
        }
            else {
          galleryID = '72157711948534226';
            }
        break;
      case 'clear-night':
          galleryID = '72157711948534226';
        break;
      case 'rain':
              if (b.isDay) {
          galleryID = '72157711948916072';
                }
              else {
          galleryID = '72157711948918142';
                }
        break;
      case 'snow':
              if (b.isDay) {
          galleryID = '72157711948582321';
                }
              else {
          galleryID = '72157711948925407';
                }
        break;
      case 'sleet':
              if (b.isDay) {
          galleryID = '72157711948578771';
                }
              else {
          galleryID = '72157711948921797';
                }
        break;
      case 'wind':
              if (b.isDay) {
          galleryID = '72157711950448603';
                }
              else {
          galleryID = '72157711948587066';
                }     
        break;
      case 'fog':
              if (b.isDay) {
          galleryID = '72157711948567181';
                }
              else {
          galleryID = '72157711950432483';
                }
        break;
      case 'cloudy':
              if (b.isDay) {
          galleryID = '72157711950426443';
                }
              else {
          galleryID = '72157711948906242';
                }
        break;
      case 'partly-cloudy-day':
            if (b.isDay) {
          galleryID = '72157711950434293';
        }
        else {
          galleryID = '72157711948913902';
        }           
        break;
      case 'partly-cloudy-night':
          galleryID = '72157711948913902';
        break;
      default:
          galleryID = '72157711948824252';
      break;
     }

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
          document.querySelector("#link_flickr_text").textContent = 'Photo by ' + pathalias.substr(0,10) + ' on Flickr';
          document.querySelector("#link_flickr").addEventListener("click", (e) => {
          window.open(url_owner, "_blank");
        })
      }
      else {
          document.querySelector("#link_flickr_text").textContent = 'Photo by ' + ownername.substr(0,10) + ' on Flickr';
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

    if(typeof setSettingFC === 'undefined') {
         if(country == "US") {
             setSettingFC = "f";
             chrome.storage.local.set({'setSettingFC': 'f'});
         } else {
            setSettingFC = "c";
            chrome.storage.local.set({'setSettingFC': 'c'});
         }
      }

    if(typeof setSettingUT === 'undefined') {
        setSettingUT = "t";
        chrome.storage.local.set({'setSettingUT': 't'});
      }

    if(setSettingUT == "u") {
        document.getElementById("setting_defualt_button_u").checked = true;
        document.getElementById("setting_defualt_button_u").disabled = true;
      }
    else {
        document.getElementById("setting_defualt_button_t").checked = true;
        document.getElementById("setting_defualt_button_t").disabled = true;
      }

    if(setSettingFC == "f") {
        document.getElementById("setting_defualt_button_f").checked = true;      
        document.getElementById("setting_defualt_button_f").disabled = true;
      }
    else {
        document.getElementById("setting_defualt_button_c").checked = true;     
        document.getElementById("setting_defualt_button_c").disabled = true;
      }

    if(setSettingFC == 'f'){
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

    if(b.uv1 == 1) {
        document.querySelector("#icon_uv_1").style.opacity = "1";
        document.querySelector("#icon_uv_1_tooltip").style.opacity = "1";
      }
    else if(b.uv1 == 2) {
        resUV2 = document.querySelectorAll('#icon_uv_1, #icon_uv_2, #icon_uv_1_tooltip, #icon_uv_2_tooltip')
        for (var i = 0; i < resUV2.length; i++){
          resUV2[i].style.opacity = "1";
          resUV2[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
        }       
      }
    else if(b.uv1 >= 3 && b.uv1 <= 5) {
        resUV3 = document.querySelectorAll('#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_1_tooltip, #icon_uv_2_tooltip, #icon_uv_3_tooltip')
        for (var i = 0; i < resUV3.length; i++){
          resUV3[i].style.opacity = "1";
          resUV3[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
        }
      }
    else if(b.uv1 >= 6 && b.uv1 <= 7) {
        resUV6 = document.querySelectorAll('#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_4, #icon_uv_1_tooltip, #icon_uv_2_tooltip, #icon_uv_3_tooltip, #icon_uv_4_tooltip')
        for (var i = 0; i < resUV6.length; i++){
          resUV6[i].style.opacity = "1";
          resUV6[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
        }
      }
    else if(b.uv1 >= 8) {
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
      if(b.isDay) {
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_clear-day.svg")';
        }
        else {
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_clear-night.svg")';
        }
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
      if(b.isDay) {
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_partly-cloudy-day.svg")';
        }
        else {
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_partly-cloudy-night.svg")';
      }
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
            if (b.isDay) {
      document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/clear-day.jpg")';
              }
            else {
      document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/clear-night.jpg")'; 
            }     
      break;
    case 'clear-night':
      document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/clear-night.jpg")';      
      break;
    case 'rain':
            if(b.isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/rain-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/rain-night.jpg")';
              }     
      break;
    case 'snow':
            if(b.isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/snow-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/snow-night.jpg")';
              }
      break;
    case 'sleet':
            if(b.isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/sleet-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/sleet-night.jpg")';
              }
      break;
    case 'wind':
            if(b.isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/wind-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/wind-night.jpg")';
              }     
      break;
    case 'fog':
            if(b.isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/fog-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/fog-night.jpg")';
              }
      break;
    case 'cloudy':
            if(b.isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/cloudy-day.jpg")';
              }
            else {
              document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/cloudy-night.jpg")';
              }
      break;
    case 'partly-cloudy-day':
            if(b.isDay) {
      document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/partly-cloudy-day.jpg")';
              }
            else {
      document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/partly-cloudy-night.jpg")';
              }
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
      document.querySelector("#current_accufeel").textContent = "AccuFeel " + b.accufeelResultC + "°";
      document.querySelector("#current_report_accufeel").textContent = b.accufeelResultC + "° C";
      document.querySelector("#current_temp_max").textContent = b.current_tempC_max + "°";
      document.querySelector("#current_temp_min").textContent = b.current_tempC_min + "°";
      document.querySelector("#forecast_tomorrow").textContent = b.update_tomorrow_c;

      for (i=1;i<3;i++){
        document.querySelector(`#forecast_${i}_temp`).textContent = f2c(Math.round(b.result.daily.data[i].temperatureMax)) + "°";
      }

      for(i=1;i<8;i++){
        document.querySelector(`#forecast_${i*10}_temp`).textContent = f2c(Math.round(b.result.daily.data[i].temperatureMax)) + "°";
        document.querySelector(`#forecast_${i*10}_temp_min`).textContent = f2c(Math.round(b.result.daily.data[i].temperatureMin)) + "°";
      }

      for (i=1;i<49;i++){
        document.querySelector(`#forecast_${i}_hours_temp`).textContent = Math.round(((b.result.hourly.data[i].temperature)-32) * 5/9) + "°";
      }

      document.querySelector("#summery_next7_text").textContent = b.summaryDailyC;
      document.querySelector("#summery_next48_text").textContent = b.summaryHourlyC;

      document.getElementById("setting_defualt_button_c").disabled = true;
      document.getElementById("setting_defualt_button_f").disabled = false;
      document.getElementById("setting_defualt_button_c").checked = true;      

      F_sign_elementStyle.filter = 'opacity(65%)';
      C_sign_elementStyle.filter = 'opacity(100%)';
      C_sign_elementStyle.position = 'absolute';
      C_sign_elementStyle.top = '0px';
      F_sign_elementStyle.position = 'absolute';
      F_sign_elementStyle.top = '22px';
      C_sign_elementStyle.fontSize = '20px';
      F_sign_elementStyle.fontSize = '15px';

      if(setSettingUT == "t") {
        chrome.browserAction.setBadgeText({"text":b.temperatureC +"°C" });
      }      
  }


  function ftemp(){
    document.querySelector("#current_report_dewPoint").textContent = b.dewPointF + "° F";
    document.querySelector("#current_temp").textContent = b.temperatureF;
    document.querySelector("#current_report_temp").textContent = b.temperatureF + "° F";
    document.querySelector("#current_accufeel").textContent = "AccuFeel " + b.accufeelResultF + "°";
    document.querySelector("#current_report_accufeel").textContent = b.accufeelResultF + "° F";    
    document.querySelector("#current_temp_max").textContent = b.current_tempF_max + "°";
    document.querySelector("#current_temp_min").textContent = b.current_tempF_min + "°";
    document.querySelector("#forecast_tomorrow").textContent = b.update_tomorrow_f;

    for(i=1;i<3;i++) {
        document.querySelector(`#forecast_${i}_temp`).textContent = Math.round(b.result.daily.data[i].temperatureMax) + "°";
    }

    for(i=1;i<8;i++){
      document.querySelector(`#forecast_${i*10}_temp`).textContent = Math.round(b.result.daily.data[i].temperatureMax) + "°";
      document.querySelector(`#forecast_${i*10}_temp_min`).textContent = Math.round(b.result.daily.data[i].temperatureMin) + "°";
    }

    for (i=1;i<49;i++){
      document.querySelector(`#forecast_${i}_hours_temp`).textContent = Math.round(b.result.hourly.data[i].temperature) + "°";
    }
    document.querySelector("#summery_next7_text").textContent = b.summaryDailyF;
    document.querySelector("#summery_next48_text").textContent = b.summaryHourlyF;
    
    document.getElementById("setting_defualt_button_f").disabled = true;
    document.getElementById("setting_defualt_button_c").disabled = false;
    document.getElementById("setting_defualt_button_f").checked = true;      

    C_sign_elementStyle.filter = 'opacity(65%)';
    F_sign_elementStyle.filter = 'opacity(100%)';
    F_sign_elementStyle.position = 'absolute';
    F_sign_elementStyle.top = '0px';
    C_sign_elementStyle.position = 'absolute';
    C_sign_elementStyle.top = '22px';
    F_sign_elementStyle.fontSize = '20px';
    C_sign_elementStyle.fontSize = '15px';

    if(setSettingUT == "t") {
      chrome.browserAction.setBadgeText({"text":b.temperatureF +"°F" });
    }    
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

  solarFunction();

  
  function next7Function(){
    document.querySelector("#next7_update_date").textContent = 'Updated at ' + dayjs.unix(b.updateTime + b.offsetUnix).format('MMM DD, h:mm A');

    for(i=1;i<3;i++) {
      document.querySelector(`#forecast_${i}_day`).textContent = dayjs.unix(b.result.daily.data[i].time).format('dddd');
      document.querySelector(`#forecast_${i}_uv`).textContent = "UVI " + (Math.round ((b.result.daily.data[i].uvIndex) * uv_adj_daily(b.result.daily.data[i].icon)));
    }

    for(i=1;i<8;i++) {
      document.querySelector(`#forecast_${i*10}_day`).textContent = dayjs.unix(b.result.daily.data[i].time).format('dddd');
      document.querySelector(`#forecast_${i*10}_uv`).textContent = "UVI " + (Math.round ((b.result.daily.data[i].uvIndex) * uv_adj_daily(b.result.daily.data[i].icon)));
    }

    var i;
    for(i = 1; i < 8; i++) {
      forecast_icon = b.result.daily.data[i].icon; 
      switch(forecast_icon) {
        case 'clear-day':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_sun.svg")';
          if(i<3) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_sun.svg")';
          }
          break;
        case 'clear-night':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_moon.svg")';
          if(i<3) {          
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_moon.svg")';
          }
         break;
        case 'rain':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_rain.svg")';
          if(i<3) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_rain.svg")';
          }
         break;
         case 'snow':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_snow.svg")';
          if(i<3) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_snow.svg")';
          }
         break;
         case 'sleet':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_snow_alt.svg")';
          if(i<3) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_snow_alt.svg")';
          }
         break;
         case 'wind':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_wind.svg")';
          if(i<3) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_wind.svg")';
          }
         break;
         case 'fog':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_fog_alt.svg")';
          if(i<3) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_fog_alt.svg")';
          }
         break;
         case 'cloudy':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud.svg")';
          if(i<3) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud.svg")';
          }
         break;
         case 'partly-cloudy-day':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_sun.svg")';
          if(i<3) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_sun.svg")';
          }
         break;
         case 'partly-cloudy-night':
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_moon.svg")';
          if(i<3) {
            document.querySelector('.forecast_'+ i*10 +'_homePage_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_cloud_moon.svg")';
          }
         break;
         default:
          document.querySelector('.forecast_'+ i +'_icon_Class').style.backgroundImage = 'url("images/weather_icon/b_sun.svg")';
          if(i<3) {
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

    for(i=1;i<49;i++) {
      document.querySelector(`#forecast_${i}_hours`).textContent = dayjs.unix(b.result.hourly.data[i].time + b.offsetUnix).format('h A');
      document.querySelector(`#forecast_${i}_hours_uv`).textContent = "UVI " + Math.round((b.result.hourly.data[i].uvIndex) * uv_adj_daily(b.result.hourly.data[i].icon, b.result.hourly.data[i].cloudCover));
      document.querySelector(`#forecast_${i}_hours_rain`).textContent = Math.round(((b.result.hourly.data[i].precipProbability) * 100)/5)*5 + "%";
    }
  
    var i;
    for(i = 1; i < 49; i++) {
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
    if(b.uv1 == 0 || b.isNight) {
        document.querySelector("#link_qsun_text").textContent = 'UV Weather App for iOS & Android';
     }
    else{
        document.querySelector("#link_qsun_text").textContent = "UV Weather App for iOS & Android";
      }
  }  
  trackSunExposure();

  version_manifest = chrome.runtime.getManifest().version;
  document.querySelector("#title_version_home").textContent = "Version " + version_manifest;
  document.querySelector("#title_version_setting").textContent = "Version " + version_manifest;


  document.querySelector("#setting_defualt_button_u").addEventListener("click", (e) => { 
      setSettingUT = "u";
      chrome.storage.local.set({'setSettingUT': 'u'});
        if(b.uv1>9) {
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
      chrome.storage.local.set({'setSettingUT': 't'});
          if (setSettingFC == "f") {
              chrome.browserAction.setBadgeText({"text":b.temperatureF +"°F" });
            }
          else {
            chrome.browserAction.setBadgeText({"text":b.temperatureC +"°C" });
          }
      document.getElementById("setting_defualt_button_t").disabled = true;
      document.getElementById("setting_defualt_button_u").disabled = false;
  });
  document.querySelector("#setting_defualt_button_c").addEventListener("click", (e) => { 
      setSettingFC = "c";
      chrome.storage.local.set({'setSettingFC': 'c'});
      if(setSettingUT == "t") {
        chrome.browserAction.setBadgeText({"text":b.temperatureC +"°C" });
      }
      ctemp();
   });

document.querySelector("#setting_defualt_button_f").addEventListener("click", (e) => { 
      setSettingFC = "f";
      chrome.storage.local.set({'setSettingFC': 'f'});
      if(setSettingUT == "t") {   
        chrome.browserAction.setBadgeText({"text":b.temperatureF +"°F" });
      }      
      ftemp();
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
      modalSearch.style.display = "none";     
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

  var searchInner = document.getElementById("mapSearch");
  var searchTitle = document.getElementById("search_popup_title");
  var searchOnMap = document.getElementById("click_on_map");

  var modalCurrent = document.getElementById("currentReport_popup");
  var modalSearch = document.getElementById("search_popup");

  var F_C_display = document.getElementById("F_C");

  document.querySelector("#map_popup_page").addEventListener("click", (e) => {
    closeAllPopup();
    removeClassIcons();
    setTimeout(function() {
      document.getElementById("map_popup_close").style.visibility = "visible";
    }, 300);
    
    searchTitle.style.visibility = "hidden";
    searchInner.style.visibility = "hidden";
    searchOnMap.style.visibility = "hidden";

    mapTitle.style.visibility = "visible";
    mapInner.style.visibility = "visible";
    weatherMap(weathermapStyle);

    var currentIcon = document.getElementById("home_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_home");
    currentSubMenu.classList.add("sub_menu_current_Class");
  });

  document.querySelector("#search_popup_page").addEventListener("click", (e) => {
    closeAllPopup();
    removeClassIcons();
    modalSearch.style.display = "block";
    setTimeout(function() {
      document.getElementById("search_popup_close").style.visibility = 'visible';
      searchTitle.style.visibility = "visible";
      searchInner.style.visibility = "visible";
      searchOnMap.style.visibility = "visible";
      searchMap(mapStyle);
    }, 300);

    var currentIcon = document.getElementById("home_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_home");
    currentSubMenu.classList.add("sub_menu_current_Class");    
  });

  document.querySelector("#location").addEventListener("click", (e) => { 
    document.getElementById("openSidebarMenu").checked = false;
      closeAllPopup();
      removeClassIcons();
      modalSearch.style.display = "block";
      setTimeout(function() {
        document.getElementById("search_popup_close").style.visibility = "visible";
        searchTitle.style.visibility = "visible";
        searchInner.style.visibility = "visible";
        searchOnMap.style.visibility = "visible";
      }, 300);
      searchMap(mapStyle);

      var currentIcon = document.getElementById("home_icon_popup_page");
      currentIcon.classList.add("sub_menu_current_icon_Class");

      var currentSubMenu = document.getElementById("sub_menu_home");
      currentSubMenu.classList.add("sub_menu_current_Class");
  });

  document.querySelector("#sidebar_search").addEventListener("click", (e) => {
    document.getElementById("openSidebarMenu").checked = false;
    closeAllPopup();
    removeClassIcons();
    modalSearch.style.display = "block";
    setTimeout(function() {
      document.getElementById("search_popup_close").style.visibility = "visible";
      searchTitle.style.visibility = "visible";
      searchInner.style.visibility = "visible";
      searchOnMap.style.visibility = "visible";
    }, 300);    
    searchMap(mapStyle);

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

  document.querySelector("#sidebar_setting").addEventListener("click", (e) => {
    document.getElementById("openSidebarMenu").checked = false;
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


  document.querySelector("#sidebar_map").addEventListener("click", (e) => {
    document.getElementById("openSidebarMenu").checked = false;
    closeAllPopup();
    removeClassIcons();
    setTimeout(function() {
      document.getElementById("map_popup_close").style.visibility = "visible";
    }, 300);
    
    searchTitle.style.visibility = "hidden";
    searchInner.style.visibility = "hidden";
    searchOnMap.style.visibility = "hidden";

    mapTitle.style.visibility = "visible";
    mapInner.style.visibility = "visible";
    weatherMap(weathermapStyle);

    var currentIcon = document.getElementById("home_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_home");
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

  document.querySelector("#report_button").addEventListener("click", (e) => {
    document.getElementById("openSidebarMenu").checked = false;
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

  document.querySelector("#search_popup_close").addEventListener("click", (e) => {

    document.getElementById("search_popup_close").style.transition = "all 0s";
    document.getElementById("search_popup_close").style.visibility = "hidden";
    searchTitle.style.visibility = "hidden";
    searchInner.style.visibility = "hidden";
    searchOnMap.style.visibility = "hidden";
    closeAllPopup();
    //document.getElementById('geocoderID').remove();
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
    document.getElementById("openSidebarMenu").checked = false;
    closeAllPopup();
    removeClassIcons();

    var element = document.getElementById("home_icon_popup_page");
    element.classList.add("sub_menu_icon_active_Class");

    var currentIcon = document.getElementById("home_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");
    
    var currentSubMenu = document.getElementById("sub_menu_home");
    currentSubMenu.classList.add("sub_menu_current_Class");    
  });




  function searchMap(mapStyle) {
    
    var element = document.getElementById("mapSearch");
    element.classList.add("blurIn");
    setTimeout(function() {
      element.classList.add("blurOut");
    }, 2000);

    mapboxgl.accessToken = 'pk.eyJ1IjoiY29tZmFibGUiLCJhIjoiY2sybTF6Z3FpMGRkeTNscWxhMnNybnU3cyJ9.VDvM0a0jaMlLMwlqBI8kUw';
    if(typeof ((b.latandlong.split('"'))[1]) !== 'undefined') {
      latandlongMapBox = ((b.latandlong.split('"'))[1]).split(',').reverse().join(',');
      latandlongMapBox = JSON.parse("[" + latandlongMapBox + "]");
    }
    else {
      latandlongMapBox = [-79.3832,43.6532];
    } 

    var map = new mapboxgl.Map({
        container: 'mapSearch',
        style: mapStyle,
        center: latandlongMapBox,
        zoom: 10,
        // maxZoom: 13,
        // minZoom: 3,
        interactive: true
    });

    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    map.on('load', updateGeocoderProximity);
    map.on('moveend', updateGeocoderProximity);

    function updateGeocoderProximity() {
            var center = map.getCenter().wrap();
            geocoder.setProximity({ longitude: center.lng, latitude: center.lat });
    };

    var center = map.getCenter().wrap();

    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      flyTo: true,
      essential: true,
      types: 'place, locality, postcode',
      limit: 7,
      placeholder: 'Enter the city or ZIP code',
      proximity: {
        longitude: center.lng,
        latitude: center.lat
      } 
    });
     
    // if (document.getElementById('geocoderID').children.length === 0){
    //   document.getElementById('geocoderID').appendChild(geocoder.onAdd(map));
    // }
    map.addControl(geocoder);
	map.addControl(new mapboxgl.NavigationControl());
	
    //var nav = new mapboxgl.NavigationControl();
    //map.addControl(nav, 'bottom-right');

    map.on('load', function() {
      map.addSource('single-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }

      });



      map.on('dblclick', function(e) {
          locationByClick = map.queryRenderedFeatures(e.point);

          lnglatclick = e.lngLat.wrap();
          var lat = lnglatclick.lat;
          var lng = lnglatclick.lng;
          latlong =  '"' + lat + ',' + lng + '"';
          latandlongbyClick = [lng,lat];

          token = 'pk.eyJ1IjoiY29tZmFibGUiLCJhIjoiY2sybTF6Z3FpMGRkeTNscWxhMnNybnU3cyJ9.VDvM0a0jaMlLMwlqBI8kUw';
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${latandlongbyClick}.json?types=place,locality&limit=1&access_token=${token}`)
            .then((resp) => resp.json())
             .then(function(result) {
              
              if(result.hasOwnProperty('features')) {
                if(result.features.hasOwnProperty('0')) {
                if(result.features[0].hasOwnProperty('place_name') && result.features[0].hasOwnProperty('text')) {
                  var fullname = result.features[0].place_name;
                  var cityAPI = result.features[0].text;

                    latlong =  '"' + lat + ',' + lng + '"';
                    city =  '"' + cityAPI + '"';

                    if(((result.features[0].place_name).split(','))[2]) {
                        country = ((result.features[0].place_name).split(','))[2];
                    }
                    else {
                      country = ((result.features[0].place_name).split(','))[1];
                    }

                    chrome.storage.local.set({'fullname': fullname});
                    chrome.storage.local.set({'latlong': latlong});
                    chrome.storage.local.set({'city': city});
                    chrome.storage.local.set({'country': country});

                    setTimeout(function(){
                      chrome.runtime.sendMessage({ msg: "backgroundUpdate" });
                    }, 350);

                     setTimeout(function(){
                        refreshPopup();
                        chrome.storage.local.get('autoDark', function(data) {
                        var autoDarkTheme = data.autoDark;
                          if(autoDarkTheme == '1' && b.isNight) {
                              darkDisplay();
                              map.setStyle(mapStyleDark);
                          }
                          else if(autoDarkTheme == '1' && b.isDay) {
                              lightDisplay();
                              map.setStyle(mapStyleLight);
                          }
                        });
                     }, 1350); 

                }
              }
            }
            });

      });



      geocoder.on('result', function(ev) {
          map.getSource('single-point').setData(ev.result.geometry);
          updateGeocoderProximity();
          var fullname = ev.result.place_name;
          var cityAPI = ev.result.text;
          var lat = ev.result.geometry.coordinates[1];
          var lng = ev.result.geometry.coordinates[0];

          latlong =  '"' + lat + ',' + lng + '"';
          city =  '"' + cityAPI + '"';

          if(((ev.result.place_name).split(','))[2]) {
              country = ((ev.result.place_name).split(','))[2];
          }
          else {
            country = ((ev.result.place_name).split(','))[1];
          }

          chrome.storage.local.set({'fullname': fullname});
          chrome.storage.local.set({'latlong': latlong});
          chrome.storage.local.set({'city': city});
          chrome.storage.local.set({'country': country});

          setTimeout(function(){
            chrome.runtime.sendMessage({ msg: "backgroundUpdate" });
          }, 50);

           setTimeout(function(){
              refreshPopup();

              chrome.storage.local.get('autoDark', function(data) {
              var autoDarkTheme = data.autoDark;
                if(autoDarkTheme == '1' && b.isNight) {
                    darkDisplay();
                    map.setStyle(mapStyleDark);
                }
                else if(autoDarkTheme == '1' && b.isDay) {
                    lightDisplay();
                    map.setStyle(mapStyleLight);
                }
              });

           }, 1050);

          map.flyTo({
            center: [lng,lat],
            zoom: 10,
            speed: 1.2,
            curve: 1.42,
            easing(t) {
              return t;
            }
          });


      });

      geocoder.on('error', function(ev) {

      });

    });


  };



  function weatherMap(weathermapStyle) {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29tZmFibGUiLCJhIjoiY2sybTF6Z3FpMGRkeTNscWxhMnNybnU3cyJ9.VDvM0a0jaMlLMwlqBI8kUw';
    if(typeof ((b.latandlong.split('"'))[1]) !== 'undefined') {
      latandlongMapBox = ((b.latandlong.split('"'))[1]).split(',').reverse().join(',');
      latandlongMapBox = JSON.parse("[" + latandlongMapBox + "]");
    }
    else {
      latandlongMapBox = [-79.3832,43.6532];
    } 
   
    var mapWeather = new mapboxgl.Map({
        container: 'mapWeather',
        style: weathermapStyle,
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


  var C_sign_elementStyle = document.getElementById('C_sign').style;
  var F_sign_elementStyle = document.getElementById('F_sign').style;

  document.querySelector("#F_sign").addEventListener("click", (e) => { 
      setSettingFC = "f";
      chrome.storage.local.set({'setSettingFC': 'f'});
      ftemp();
  });


  document.querySelector("#C_sign").addEventListener("click", (e) => { 
      setSettingFC = "c";
      chrome.storage.local.set({'setSettingFC': 'c'});
      ctemp();
  });


  document.querySelector("#donate_button").addEventListener("click", (e) => {
      window.open("https://uvweather.net/donate");
  });

  document.querySelector("#icon_colse_box").addEventListener("click", (e) => {
      chrome.storage.local.set({'closeAds': '1'});
      var donateButton = document.getElementById("donate_button");
      var donateClose = document.getElementById("icon_colse_box");
      var donateCard = document.getElementById("cardMain");
      donateButton.style.display = "none";
      donateClose.style.display = "none";
      donateCard.style.display = "none";
      setTimeout(function() {
        window.open("https://uvweather.net/donate");
      }, 1000);
  });

  function refreshPopup() {
  
    chrome.storage.local.get(['verUpdate'], function(data) {
        if(data.verUpdate == 1) {
            chrome.storage.local.set({'verUpdate': 2});
            groundCurrent();
          }
        else {
            groundFlickr();
          }
      });

    setTimeout(function() {
      updateTimeRelative = "Updated " + dayjs.unix(b.updateTime).format("h:mm A");

    chrome.storage.local.get('setSettingFC', function(data) {
        if(data.setSettingFC == "c") {
            ctemp();
          }
          else{
             ftemp();
          }
      });

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


}
else {
    document.getElementById("noInternet_popup").style.visibility = "visible";
}


});