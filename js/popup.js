document.addEventListener("DOMContentLoaded", function() {

const options = {duration: 0.9,};
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
var element = document.getElementById("home_icon_popup_page");
element.classList.add("sub_menu_icon_active_Class");
var currentIcon = document.getElementById("home_icon_popup_page");
currentIcon.classList.add("sub_menu_current_icon_Class");
var currentSubMenu = document.getElementById("sub_menu_home");
currentSubMenu.classList.add("sub_menu_current_Class");
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

var C_sign_elementStyle = document.getElementById('C_sign').style;
var F_sign_elementStyle = document.getElementById('F_sign').style;
const toggleSwitchBadgeSize = document.querySelector('.badge_size_switch_setting input[type="checkbox"]');

const preloader = document.querySelector('.preloader');
const fadeEffect = setInterval(() => {
  if(!preloader.style.opacity) {
    return preloader.style.opacity = 1;
  }
  if(preloader.style.opacity > 0) {
    return preloader.style.opacity -= 0.1;
  } else {
    clearInterval(fadeEffect);
  }
}, 100);


chrome.storage.local.get(['latlong', 'city', 'country'], function(data) {
  latandlong = data.latlong;
  city = data.city;
  country = data.country;
  popupPage(city,latandlong,country);
});


function popupPage(city,latandlong,country) {
  cityName = (city.split('"'))[1].charAt(0).toUpperCase() + (city.split('"'))[1].slice(1);
  if(cityName && cityName.length > 15) {
    citys = cityName.substr(0,15)
  }
  else {
    citys = cityName
  }

  latlong = (latandlong.split('"'))[1];
  lat = (latlong.split(','))[0];
  lng = (latlong.split(','))[1];

    fetch('https://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + lng + '&appid=6761dd7f8d0c3c216f9af6813064f867')
    .then((resp) => resp.json())
    .then(function(resultBadge) {
      window.resultBadge = resultBadge;
      temperatureCbadge = Math.round((resultBadge.main.temp) - 273.15);
      temperatureFbadge = Math.round((1.8*temperatureCbadge) + 32);
      if(temperatureCbadge == '-0') {temperatureCbadge = 0};
      if(temperatureFbadge == '-0') {temperatureFbadge = 0};
      summaryBadge = resultBadge.weather[0].main;
      descriptionBadge = resultBadge.weather[0].description;
      updateTimeBadge = resultBadge.dt;
      timeZoneBadge = resultBadge.timezone;
      cloudCoverBadge = resultBadge.clouds.all;
      solarNighDay(timeZoneBadge,lat,lng);
      iconBadgeConvert(descriptionBadge,summaryBadge);


        const ads = '3dfc8ba9095bfa87462f459fc85238c6'; 
        return fetch('https://uv-weather.herokuapp.com/https://api.darksky.net/forecast/' + ads +'/' + latlong + '?solar')
        .then((resp) => resp.json())
        .then(function(result) {        
          window.result = result;

          updateTime = result.currently.time;
          temperatureF =  Math.round(result.currently.temperature);
          temperatureC =  f2c(temperatureF);
          humidity = Math.round(100 * (result.currently.humidity));
          dewPointF = Math.round(result.currently.dewPoint);
          dewPointC = f2c(dewPointF);
          pressure = result.currently.hasOwnProperty('pressure') ? Math.round(result.currently.pressure) : '-';
          windSpeedMPH = Math.round(result.currently.windSpeed);
          windSpeedKMH = Math.round(windSpeedMPH * 1.609334);
            windSpeedMS10 = windSpeedMPH * 0.4470389;
            windSpeedMS10R = Math.round(windSpeedMPH * 0.4470389 * 10) / 10;
            windSpeedMS = windSpeedMS10 * 0.33; // on humun hieght an urban area
          windGustMPH = Math.round(result.currently.windGust);
          windGustKMH = Math.round(windGustMPH * 1.609334);
          windGustMS = Math.round(windGustMPH * 0.4470389 * 10) / 10;

          ghiSolarClearSki = result.hourly.data[0].hasOwnProperty('solar') ? result.hourly.data[0].solar.ghi : '-'; //GHI = DHI + DNI * cos (θ)

            if(result.currently.windSpeed > 0) {
              windBearing = Math.round(result.currently.windBearing); //true north at 0° and progressing clockwise
              windCompass = degToCompass(result.currently.windBearing);
            }
            else {
              windBearing = "-";
              windCompass = "-";
            }

            visibility = result.currently.hasOwnProperty('visibility') ? Math.round(result.currently.visibility *10)/10 : '-';
            visibilityKM = result.currently.hasOwnProperty('visibility') ? Math.round(result.currently.visibility * 1.60934 *10)/10 : '-';

            if(visibility >= 10) {
              visibility = "+10";
              visibilityKM = "+16";
            }

          ozone = result.currently.hasOwnProperty('ozone') ? Math.round(result.currently.ozone) : '-';
          precipProbability = result.currently.hasOwnProperty('precipProbability') ? Math.round(result.currently.precipProbability * 100) : '-';

          summary = result.currently.hasOwnProperty('summary') ? result.currently.summary : '-'

          if(result.hasOwnProperty('minutely')) {
            if(result.minutely.hasOwnProperty('summary')) {
              summaryMinutely = result.minutely.summary;
            }
          }
          else {
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

          uvCurrently = result.currently.hasOwnProperty('uvIndex') ? result.currently.uvIndex : '-'

          forecast_0_tempF = Math.round(result.daily.data[0].temperatureMax);
          forecast_1_tempF = Math.round(result.daily.data[1].temperatureMax);

          update_tomorrow_is_f(forecast_1_tempF,forecast_0_tempF);
          update_tomorrow_is_c(forecast_1_tempF,forecast_0_tempF);

          if(iconBadge === "rain" || iconBadge === "sleet" || iconBadge === "snow")
            {cloudAdj = 0.31;}
          else if(cloudCoverBadge < 20)
            {cloudAdj = 1;}
          else if(cloudCoverBadge >= 20 && cloudCoverBadge < 70)
            {cloudAdj = 0.89;}
          else if(cloudCoverBadge >= 70 && cloudCoverBadge < 90)
            {cloudAdj = 0.73;}
          else if(cloudCoverBadge >= 90)
            {cloudAdj = 0.31;}
          else {cloudAdj = 1;}

          if(isNight) {
            uvCurrently = 0;
          }

          uv1 = Math.floor(uvCurrently * cloudAdj);

          if(isNight) {
            current_uv_note = (" (night)");
            }
          else if(uv1 >= 0 && uv1 <= 2) {
            current_uv_note = (" (Low)");
            }
          else if(uv1 >= 3 && uv1 <= 5) {
            current_uv_note = (" (Moderate)");
            }
          else if(uv1 >= 6 && uv1 <= 7) {
            current_uv_note = (" (High)");
            }
          else if(uv1 >= 8 && uv1 <= 10) {
            current_uv_note = (" (Very High)");
            }
          else if(uv1 >= 11) {
            current_uv_note = (" (Extreme)");
            };

          badgeGeneral(isDay,isNight,sunnyDayBadge,cloudyBadge,rainyBadge,snowyBadge,temperatureFbadge,temperatureCbadge,uv1);








chrome.storage.local.get(['theme', 'autoDark'], function(data) {
    const currentTheme = data.theme;
    const autoDarkTheme = data.autoDark;

      if(currentTheme || autoDarkTheme) {
          document.documentElement.setAttribute('data-theme', currentTheme);
          
          if(autoDarkTheme == '1' && isNight) {
              darkDisplay();
          }
          else if(autoDarkTheme == '1' && isDay) {
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
        if(isNight) {
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

  accufeelCalc();
  uvRecommendation();
  refresh24h12h();
  next7Function();
  reportFunction();
  next48Function();
  trackSunExposure();

  chrome.storage.local.get('IntervalUpdate', function(data) {
    if(data.IntervalUpdate == "120") {
      document.getElementById("setting_defualt_button_120").checked = true;
    } 
    else if(data.IntervalUpdate == "90") {
      document.getElementById("setting_defualt_button_90").checked = true;
    }
    else if(data.IntervalUpdate == "60") {
      document.getElementById("setting_defualt_button_60").checked = true;
    }
  })

mapStyleLight = 'mapbox://styles/comfable/ck540l8q22n1n1cpb2uceu4we';
weathermapStyleLight = 'mapbox://styles/mapbox/light-v10';
mapStyleDark = 'mapbox://styles/comfable/ck53akus306vq1cn1vqcqmlbt';
weathermapStyleDark = 'mapbox://styles/comfable/ck53akus306vq1cn1vqcqmlbt';

mapStyle = mapStyleLight;
weathermapStyle = weathermapStyleLight;

chrome.storage.local.get('closeAds', function(data) {
    if(data.closeAds == 1) {
      var donateButton = document.getElementById("donate_button");
      var donateClose = document.getElementById("icon_close_box");
      var donateCard = document.getElementById("cardMain");
      donateButton.style.display = "none";
      donateClose.style.display = "none";
      donateCard.style.display = "none";
    }
});



 const toggleSwitchAnimatedIcon = document.querySelector('.theme-switch_setting_animated_icon input[type="checkbox"]');
  chrome.storage.local.get('animatedIcon', function(data) {
    const currentAnimatedIcon = data.animatedIcon;

      if(currentAnimatedIcon) {      
          if(currentAnimatedIcon === '1') {
              toggleSwitchAnimatedIcon.checked = true;
              chrome.storage.local.set({'animatedIcon': '1'});
          }
          else {
              chrome.storage.local.set({'animatedIcon': '0'});
          }
      }
      else {
              toggleSwitchAnimatedIcon.checked = true;
              chrome.storage.local.set({'animatedIcon': '1'});
      }

    function switchAnimatedIcon(e) {
      if(e.target.checked) {
        chrome.storage.local.set({'animatedIcon': '1'});
        document.getElementById("checkbox_animatedIcon").checked = true;
        document.getElementById("checkbox_animatedIcon").disabled = true;
        iconCurrent_animated();
        delayButtonAnimatedIcon();
      }
      else {
        chrome.storage.local.set({'animatedIcon': '0'});
        document.getElementById("checkbox_animatedIcon").checked = false;
        document.getElementById("checkbox_animatedIcon").disabled = true;
        iconCurrent();
        delayButtonAnimatedIcon();
      }    
    }
    toggleSwitchAnimatedIcon.addEventListener('change', switchAnimatedIcon, false);
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
          updateBadge();
          delayButtonWhiteIcon();
      }
      else {
        chrome.storage.local.set({'whiteIcon': '0'});
        document.getElementById("checkbox_whiteIcon").checked = false;
        document.getElementById("checkbox_whiteIcon").disabled = true;
        updateBadge();
        delayButtonWhiteIcon();
      }    
    }
    toggleSwitchWhiteIcon.addEventListener('change', switchWhiteIcon, false);
  });

  function delayButtonDarkmode() {
      setTimeout(function() {
      document.getElementById("checkbox").disabled = false;
    }, 1500);
  };

  function delayButtonAutoDarkmode() {
      setTimeout(function() {
      document.getElementById("checkbox_autoDark").disabled = false;
    }, 1500);
  };

  function delayButtonWhiteIcon() {
      setTimeout(function() {
      document.getElementById("checkbox_whiteIcon").disabled = false;
    }, 1500);
  };

  function delayButtonAnimatedIcon() {
      setTimeout(function() {
      document.getElementById("checkbox_animatedIcon").disabled = false;
    }, 1500);
  };

  function UTFC() {
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
      }
    else {
        document.getElementById("setting_defualt_button_t").checked = true;
      }

    if(setSettingFC == "f") {
        document.getElementById("setting_defualt_button_f").checked = true;      
      }
    else {
        document.getElementById("setting_defualt_button_c").checked = true;     
      }

    if(setSettingFC == 'f') {
        ftemp();
      }
    else {
        ctemp();
      }
      });
  }
  UTFC();

  chrome.storage.local.get('badgeSize', function(data) {
      if(data.badgeSize) {
          if(data.badgeSize === '1') {
              toggleSwitchBadgeSize.checked = true;
              chrome.storage.local.set({'badgeSize': '1'});
          }
          else {
              toggleSwitchBadgeSize.checked = false;
              chrome.storage.local.set({'badgeSize': '0'});
          }
      }
      function switchBadgeSize(e) {
        if(e.target.checked) {
          chrome.storage.local.set({'badgeSize': '1'});
          document.getElementById("checkbox_largIcon").checked = true;
          document.getElementById("checkbox_largIcon").disabled = true;
          updateBadge();
          delayButtonBadgeSize();
        }
        else {
          chrome.storage.local.set({'badgeSize': '0'});
          document.getElementById("checkbox_largIcon").checked = false;
          document.getElementById("checkbox_largIcon").disabled = true;
          updateBadge();
          delayButtonBadgeSize();
        }    
      }
      toggleSwitchBadgeSize.addEventListener('change', switchBadgeSize, false);
  });

  refreshPopup();
  document.getElementById("preload_body").style.display = "block";

        })
    })

};



/// Functions----------------------------------------------------------
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

    chrome.storage.local.get('setSettingFC', function(data) {
        if(data.setSettingFC == "c") {
            ctemp();
          }
          else{
             ftemp();
          }
      });
      document.querySelector("#location").textContent = citys;
      document.querySelector("#current_uv").textContent = uv1;
      document.querySelector("#current_uv_note").textContent = current_uv_note;
      if(typeof country !== 'undefined' && country !== 'undefined' && country !== ' ') {
            country = (country.trim()).substring(0, 2);
            url_flags = 'https://www.countryflags.io/' + country + '/flat/64.png';
            var img = new Image();
            img.src = url_flags;
            img.addEventListener("error", function(){
                  document.querySelector('.countryflagsClass').style.backgroundImage = 'url("images/heart.svg")';
            });
            img.addEventListener("load", function(){
                  document.querySelector('.countryflagsClass').style.backgroundImage = 'url(' + url_flags + ')';
            });            
      }
      else{
          document.querySelector('.countryflagsClass').style.backgroundImage = 'url("images/heart.svg")';
      }
    chrome.storage.local.get('animatedIcon', function(data) {
        if(data.animatedIcon === '1') {
              iconCurrent_animated();
          }
          else {
              iconCurrent();
          }
      });
      accufeelCalc();
      uvRecommendation();
      next48Function();
      next7Function();
      refresh24h12h();
      reportFunction();
      trackSunExposure();
  };

  function groundCurrent() {
  switch(iconBadge) {
    case 'clear-day':
            if (isDay) {
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
            if(isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/rain-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/rain-night.jpg")';
              }     
      break;
    case 'snow':
            if(isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/snow-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/snow-night.jpg")';
              }
      break;
    case 'sleet':
            if(isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/sleet-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/sleet-night.jpg")';
              }
      break;
    case 'wind':
            if(isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/wind-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/wind-night.jpg")';
              }     
      break;
    case 'fog':
            if(isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/fog-day.jpg")';
              }
            else {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/fog-night.jpg")';
              }
      break;
    case 'cloudy':
            if(isDay) {
            document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/cloudy-day.jpg")';
              }
            else {
              document.querySelector('.image_background_Class').style.backgroundImage = 'url("images/background/cloudy-night.jpg")';
              }
      break;
    case 'partly-cloudy-day':
            if(isDay) {
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
  };

  function groundFlickr() {
    switch(iconBadge) {
      case 'clear-day':
            if (isDay) {
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
              if (isDay) {
          galleryID = '72157711948916072';
                }
              else {
          galleryID = '72157711948918142';
                }
        break;
      case 'snow':
              if (isDay) {
          galleryID = '72157711948582321';
                }
              else {
          galleryID = '72157711948925407';
                }
        break;
      case 'sleet':
              if (isDay) {
          galleryID = '72157711948578771';
                }
              else {
          galleryID = '72157711948921797';
                }
        break;
      case 'wind':
              if (isDay) {
          galleryID = '72157711950448603';
                }
              else {
          galleryID = '72157711948587066';
                }     
        break;
      case 'fog':
              if (isDay) {
          galleryID = '72157711948567181';
                }
              else {
          galleryID = '72157711950432483';
                }
        break;
      case 'cloudy':
              if (isDay) {
          galleryID = '72157711950426443';
                }
              else {
          galleryID = '72157711948906242';
                }
        break;
      case 'partly-cloudy-day':
            if (isDay) {
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

  function iconCurrent_animated() {
  switch(iconBadge) {
    case 'clear-day':
      if(isDay) {
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
      if(isDay) {
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
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/a_clear-day.svg")';
    break;
   }
  };

  function iconCurrent() {
  switch(iconBadge) {
    case 'clear-day':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/wi_sun.svg")';
      break;
    case 'clear-night':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/wi_moon.svg")';
      break;
    case 'rain':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/wi_cloud_rain.svg")'; 
      break;
    case 'snow':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/wi_cloud_snow.svg")';
      break;
    case 'sleet':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/wi_cloud_snow_alt.svg")';
      break;
    case 'wind':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/wi_wind.svg")';   
      break;
    case 'fog':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/wi_cloud_fog_alt.svg")';
      break;
    case 'cloudy':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/wi_cloud.svg")';
      break;
    case 'partly-cloudy-day':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/wi_cloud_sun.svg")';
      break;
    case 'partly-cloudy-night':
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/wi_cloud_moon.svg")';
      break;
    default:
      document.querySelector('.current_icon_update').style.backgroundImage = 'url("images/weather_icon/wi_sun.svg")';
    break;
   }
  };

  function ctemp(){
      if(temperatureCbadge > current_tempC_max) {
          current_tempC_max =  temperatureCbadge
        } 
      if(temperatureCbadge < current_tempC_min) {
          current_tempC_min = temperatureCbadge
        }
      document.querySelector("#current_report_dewPoint").textContent = dewPointC + "° C";
      if(temperatureCbadge >= 6 || temperatureCbadge <= -6) {
        const countUptemperatureCbadge = new CountUp('current_temp', temperatureCbadge, options);
        countUptemperatureCbadge.start();
      }
      else{
        document.querySelector("#current_temp").textContent = temperatureCbadge;
      }
      document.querySelector("#current_report_temp").textContent = temperatureCbadge + "° C";
      document.querySelector("#current_accufeel").textContent = "AccuFeel " + accufeelResultC + "°";
      document.querySelector("#current_report_accufeel").textContent = accufeelResultC + "° C";
      document.querySelector("#current_temp_max").textContent = current_tempC_max + "°";

      document.querySelector("#current_temp_min").textContent = current_tempC_min + "°";
      document.querySelector("#forecast_tomorrow").textContent = update_tomorrow_c;

      for (i=1;i<3;i++){
          document.querySelector(`#forecast_${i}_temp`).textContent = f2c(Math.round(result.daily.data[i].temperatureMax)) + "°";
      }

      for(i=1;i<8;i++){
          document.querySelector(`#forecast_${i*10}_temp`).textContent = f2c(Math.round(result.daily.data[i].temperatureMax)) + "°";
          document.querySelector(`#forecast_${i*10}_temp_min`).textContent = f2c(Math.round(result.daily.data[i].temperatureMin)) + "°";
      }

      for (i=1;i<49;i++){
          document.querySelector(`#forecast_${i}_hours_temp`).textContent = Math.round(((result.hourly.data[i].temperature)-32) * 5/9) + "°";
      }

      document.querySelector("#summery_next7_text").textContent = summaryDailyC;
      document.querySelector("#summery_next48_text").textContent = summaryHourlyC;

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
        chrome.storage.local.get(['whiteIcon','badgeSize'], function(data) {
          var currentWhiteIcon = data.whiteIcon;
          var currentBadgeSize = data.badgeSize;
            if(currentBadgeSize == 1) {
              setTimeout(function(){
                largBadgeNumber(temperatureCbadge, currentWhiteIcon)
              }, 550);
            }
            else{
              chrome.browserAction.setBadgeText({"text":temperatureCbadge +"°C" });
            }
         });
      };     
  };

  function accufeelCalc() {
    if(ghiSolarClearSki !== '-') {
      if (ghiSolarClearSki >=250) { 
        cloudAdj_hourly = uv_adj_daily(iconBadge,cloudCoverBadge);
        ghiSolarCloud = ghiSolarClearSki * cloudAdj_hourly;
        TglobeC = 0.01498*ghiSolarCloud + 1.184*temperatureCbadge - 0.0789*humidity - 2.739; //day
      }
       else { //Low GHI
        TglobeC = temperatureCbadge;
      }
    }
    else {
      TglobeC = temperatureCbadge; //night
    };
                    
    Tmrta = Math.pow(TglobeC + 273.15, 4) + (2.5 * 100000000 * Math.pow(windSpeedMS, 0.60) * (TglobeC - temperatureCbadge));
    TmrtC = Math.pow(Tmrta, 1/4) - 273.15;
    accufeelResultC = Math.round(accufeel(temperatureCbadge, TmrtC, windSpeedMS, humidity));
    accufeelResultF = c2f(accufeelResultC);
  };

  function uvRecommendation() {
    resUV0 = document.querySelectorAll('#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_4, #icon_uv_5, #icon_uv_6, #icon_uv_1_tooltip, #icon_uv_2_tooltip, #icon_uv_3_tooltip, #icon_uv_4_tooltip, #icon_uv_5_tooltip, #icon_uv_6_tooltip')
    for (var i = 0; i < resUV0.length; i++){
      resUV0[i].style.opacity = ".3";
    }

    if(uv1 == 1) {
        document.querySelector("#icon_uv_1").style.opacity = "1";
        document.querySelector("#icon_uv_1_tooltip").style.opacity = "1";
      }
    else if(uv1 == 2) {
        resUV2 = document.querySelectorAll('#icon_uv_1, #icon_uv_2, #icon_uv_1_tooltip, #icon_uv_2_tooltip')
        for (var i = 0; i < resUV2.length; i++){
          resUV2[i].style.opacity = "1";
          resUV2[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
        }       
      }
    else if(uv1 >= 3 && uv1 <= 5) {
        resUV3 = document.querySelectorAll('#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_1_tooltip, #icon_uv_2_tooltip, #icon_uv_3_tooltip')
        for (var i = 0; i < resUV3.length; i++){
          resUV3[i].style.opacity = "1";
          resUV3[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
        }
      }
    else if(uv1 >= 6 && uv1 <= 7) {
        resUV6 = document.querySelectorAll('#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_4, #icon_uv_1_tooltip, #icon_uv_2_tooltip, #icon_uv_3_tooltip, #icon_uv_4_tooltip')
        for (var i = 0; i < resUV6.length; i++){
          resUV6[i].style.opacity = "1";
          resUV6[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
        }
      }
    else if(uv1 >= 8) {
        resUV8 = document.querySelectorAll('#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_4, #icon_uv_5, #icon_uv_6, #icon_uv_1_tooltip, #icon_uv_2_tooltip, #icon_uv_3_tooltip, #icon_uv_4_tooltip, #icon_uv_5_tooltip, #icon_uv_6_tooltip')
        for (var i = 0; i < resUV8.length; i++){
          resUV8[i].style.opacity = "1";
          resUV8[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
        }
      }
  };

  function ftemp() {
    if(temperatureFbadge > current_tempF_max) {
        current_tempF_max =  temperatureFbadge
      } 
    if(temperatureFbadge < current_tempF_min) {
        current_tempF_min = temperatureFbadge
      }
    document.querySelector("#current_report_dewPoint").textContent = dewPointF + "° F";
      if(temperatureFbadge >= 6 || temperatureFbadge <= -6) {
        const countUptemperatureFbadge = new CountUp('current_temp', temperatureFbadge, options);
        countUptemperatureFbadge.start();
      }
      else{
        document.querySelector("#current_temp").textContent = temperatureFbadge;
      }
    document.querySelector("#current_report_temp").textContent = temperatureFbadge + "° F";
    document.querySelector("#current_accufeel").textContent = "AccuFeel " + accufeelResultF + "°";
    document.querySelector("#current_report_accufeel").textContent = accufeelResultF + "° F";    
    document.querySelector("#current_temp_max").textContent = current_tempF_max + "°";
    document.querySelector("#current_temp_min").textContent = current_tempF_min + "°";
    document.querySelector("#forecast_tomorrow").textContent = update_tomorrow_f;

    for(i=1;i<3;i++) {
        document.querySelector(`#forecast_${i}_temp`).textContent = Math.round(result.daily.data[i].temperatureMax) + "°";
    }

    for(i=1;i<8;i++) {
        document.querySelector(`#forecast_${i*10}_temp`).textContent = Math.round(result.daily.data[i].temperatureMax) + "°";
        document.querySelector(`#forecast_${i*10}_temp_min`).textContent = Math.round(result.daily.data[i].temperatureMin) + "°";
    }

    for(i=1;i<49;i++) {
        document.querySelector(`#forecast_${i}_hours_temp`).textContent = Math.round(result.hourly.data[i].temperature) + "°";
    }
    document.querySelector("#summery_next7_text").textContent = summaryDailyF;
    document.querySelector("#summery_next48_text").textContent = summaryHourlyF;
    
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
      chrome.storage.local.get(['whiteIcon','badgeSize'], function(data) {
        var currentWhiteIcon = data.whiteIcon;
        var currentBadgeSize = data.badgeSize;
          if(currentBadgeSize == 1) {
            setTimeout(function(){
              largBadgeNumber(temperatureFbadge, currentWhiteIcon)
            }, 550);
          }
          else{
            chrome.browserAction.setBadgeText({"text":temperatureFbadge +"°F" });
          }
       });
    }    
  };

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

  function solarFunction12H() {
    document.querySelector("#solar_now_date").textContent = dayjs.unix(updateTimeBadge + offsetUnix).format('MMMM DD, h:mm A') + ' (LT)';
    document.querySelector("#solar_1_time").textContent = dayjs.unix(sunriseTimeSolar + offsetUnix).format('h:mm A');
    document.querySelector("#solar_2_time").textContent = dayjs.unix(sunsetTimeSolar + offsetUnix).format('h:mm A');
    document.querySelector("#solar_3_time").textContent = dayjs.unix(solarNoon + offsetUnix).format('h:mm A');
    document.querySelector("#solar_4_time").textContent = dayLength;
    document.querySelector("#solar_5_time").textContent = dayjs.unix(goldenHourEnd + offsetUnix).format('h:mm A');
    document.querySelector("#solar_6_time").textContent = dayjs.unix(goldenHour + offsetUnix).format('h:mm A');
    document.querySelector("#solar_7_time").textContent = dayjs.unix(dusk + offsetUnix).format('h:mm A');
    document.querySelector("#solar_8_time").textContent = dayjs.unix(dawn + offsetUnix).format('h:mm A');
    document.querySelector("#solar_9_time").textContent = dayjs.unix(nightStarts + offsetUnix).format('h:mm A');
  };

  function solarFunction24H() {
    document.querySelector("#solar_now_date").textContent = dayjs.unix(updateTimeBadge + offsetUnix).format('MMMM DD, HH:mm') + ' (LT)';
    document.querySelector("#solar_1_time").textContent = dayjs.unix(sunriseTimeSolar + offsetUnix).format('HH:mm');
    document.querySelector("#solar_2_time").textContent = dayjs.unix(sunsetTimeSolar + offsetUnix).format('HH:mm');
    document.querySelector("#solar_3_time").textContent = dayjs.unix(solarNoon + offsetUnix).format('HH:mm');
    document.querySelector("#solar_4_time").textContent = dayLength;
    document.querySelector("#solar_5_time").textContent = dayjs.unix(goldenHourEnd + offsetUnix).format('HH:mm');
    document.querySelector("#solar_6_time").textContent = dayjs.unix(goldenHour + offsetUnix).format('HH:mm');
    document.querySelector("#solar_7_time").textContent = dayjs.unix(dusk + offsetUnix).format('HH:mm');
    document.querySelector("#solar_8_time").textContent = dayjs.unix(dawn + offsetUnix).format('HH:mm');
    document.querySelector("#solar_9_time").textContent = dayjs.unix(nightStarts + offsetUnix).format('HH:mm');
  };

  function refresh24h12h() {
    chrome.storage.local.get('TimeFormat', function(dataTime) {
      if(dataTime.TimeFormat == "24h") {
        solarFunction24H();
        document.querySelector("#next7_update_date").textContent = 'Updated at ' + dayjs.unix(updateTimeBadge + offsetUnix).format('MMM DD, HH:mm') + ' (LT)';
        document.querySelector("#report_update_date").textContent = dayjs.unix(updateTimeBadge + offsetUnix).format('MMM DD, HH:mm') + ' (LT)';
        document.querySelector("#next48_update_date").textContent = 'Updated at ' + dayjs.unix(updateTimeBadge + offsetUnix).format('MMM DD, HH:mm') + ' (LT)';
          for(i=1;i<49;i++) {
              document.querySelector(`#forecast_${i}_hours`).textContent = dayjs.unix(result.hourly.data[i].time + offsetUnix).format('HH')+':00';
              document.querySelector(`#forecast_${i}_hours_uv`).textContent = "UVI " + Math.round((result.hourly.data[i].uvIndex) * uv_adj_daily(result.hourly.data[i].icon, result.hourly.data[i].cloudCover));
              document.querySelector(`#forecast_${i}_hours_rain`).textContent = Math.round(((result.hourly.data[i].precipProbability) * 100)/5)*5 + "%";
          }
        document.querySelector("#map_popup_title").textContent = 'PRECIPITATION FORECAST | UV WEATHER | ' + dayjs.unix(updateTimeBadge + offsetUnix).format('MMMM DD, YYYY HH:mm') + ' (LT)';  
        document.getElementById("setting_defualt_button_24h").checked = true;
        document.getElementById("setting_defualt_button_12h").checked = false;
        document.getElementById("setting_defualt_button_24h").disabled = true;
        document.getElementById("setting_defualt_button_12h").disabled = false;
      } 
      else {
        solarFunction12H();
        document.querySelector("#next7_update_date").textContent = 'Updated at ' + dayjs.unix(updateTimeBadge + offsetUnix).format('MMM DD, h:mm A') + ' (LT)';
        document.querySelector("#report_update_date").textContent = dayjs.unix(updateTimeBadge + offsetUnix).format('MMM DD, h:mm A') + ' (LT)';
        document.querySelector("#next48_update_date").textContent = 'Updated at ' + dayjs.unix(updateTimeBadge + offsetUnix).format('MMM DD, h:mm A') + ' (LT)';
          for(i=1;i<49;i++) {
              document.querySelector(`#forecast_${i}_hours`).textContent = dayjs.unix(result.hourly.data[i].time + offsetUnix).format('h A');
              document.querySelector(`#forecast_${i}_hours_uv`).textContent = "UVI " + Math.round((result.hourly.data[i].uvIndex) * uv_adj_daily(result.hourly.data[i].icon, result.hourly.data[i].cloudCover));
              document.querySelector(`#forecast_${i}_hours_rain`).textContent = Math.round(((result.hourly.data[i].precipProbability) * 100)/5)*5 + "%";
          }
        document.querySelector("#map_popup_title").textContent = 'PRECIPITATION FORECAST | UV WEATHER | ' + dayjs.unix(updateTimeBadge + offsetUnix).format('MMMM DD, YYYY h:mm A') + ' (LT)';
        document.getElementById("setting_defualt_button_12h").checked = true;
        document.getElementById("setting_defualt_button_24h").checked = false;
        document.getElementById("setting_defualt_button_12h").disabled = true;
        document.getElementById("setting_defualt_button_24h").disabled = false;
      }
    });
  };

  function next48Function() {
    var i;
    for(i = 1; i < 49; i++) {
      forecast_hours_icon = result.hourly.data[i].icon;
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
  };

  function next7Function(){
    for(i=1;i<3;i++) {
        document.querySelector(`#forecast_${i}_day`).textContent = dayjs.unix(result.daily.data[i].time).format('dddd');
        document.querySelector(`#forecast_${i}_uv`).textContent = "UVI " + (Math.round ((result.daily.data[i].uvIndex) * uv_adj_daily(result.daily.data[i].icon)));
    }

    for(i=1;i<8;i++) {
        document.querySelector(`#forecast_${i*10}_day`).textContent = dayjs.unix(result.daily.data[i].time).format('dddd');
        document.querySelector(`#forecast_${i*10}_uv`).textContent = "UVI " + (Math.round ((result.daily.data[i].uvIndex) * uv_adj_daily(result.daily.data[i].icon)));
    }

    var i;
    for(i = 1; i < 8; i++) {
      forecast_icon = result.daily.data[i].icon; 
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
  };

  function reportFunction() {
    document.querySelector("#title_report_text").textContent = citys;
    document.querySelector("#current_report_summary").textContent = summaryMinutely;
    document.querySelector("#current_report_uv").textContent = uv1 + " " + current_uv_note;
    document.querySelector("#current_report_wind").textContent = windSpeedMPH + " mph (" + windSpeedKMH + " km/h)";
    document.querySelector("#current_report_windBearing").textContent = windBearing + "° (" + windCompass + ")";
    document.querySelector("#current_report_windGust").textContent = windGustMPH + " mph (" + windGustKMH + " km/h)";
    document.querySelector("#current_report_humidity").textContent = humidity + "%";
    document.querySelector("#current_report_visibility").textContent = visibility + " mi (" + visibilityKM + " km)";
    document.querySelector("#current_report_pressure").textContent = pressure + " mb (hPa)";
    document.querySelector("#current_report_cloud").textContent = cloudCoverBadge + "%";
    document.querySelector("#current_report_ozone").textContent = ozone + " du";
    document.querySelector("#current_report_precipitation").textContent =  precipProbability + "%";
  };

  function trackSunExposure() {
    if(uv1 == 0 || isNight) {
        document.querySelector("#link_qsun_text").textContent = 'UV Weather App for iOS & Android';
     }
    else{
        document.querySelector("#link_qsun_text").textContent = "UV Weather App for iOS & Android";
      }
  };

  function updateBadge() {
    chrome.storage.local.get(['setSettingFC', 'setSettingUT', 'whiteIcon', 'badgeSize'], function(data) {
    setSettingFC = data.setSettingFC;
    setSettingUT = data.setSettingUT;
    currentWhiteIcon = data.whiteIcon;
    currentBadgeSize = data.badgeSize;

      if(setSettingUT == "t" && setSettingFC == "c") {
            if(currentBadgeSize == 1) {
              setTimeout(function(){
                largBadgeNumber(temperatureCbadge, currentWhiteIcon)
              }, 550);
            }
            else {
              badgeBackgroundColor();
              badgeBackgroundImage(currentWhiteIcon);
              chrome.browserAction.setBadgeText({"text":temperatureCbadge +"°C" });
            }
      }

      else if(setSettingUT == "t" && setSettingFC == "f") {
          if(currentBadgeSize == 1) {
            setTimeout(function(){
              largBadgeNumber(temperatureFbadge, currentWhiteIcon)
            }, 550);
          }
          else {
            badgeBackgroundColor();
            badgeBackgroundImage(currentWhiteIcon);
            chrome.browserAction.setBadgeText({"text":temperatureFbadge +"°F" });
          }
      }  

      else if(setSettingUT == "u") {
      chrome.storage.local.set({'setSettingUT': 'u'});
        if(uv1>9) {
                  if(currentBadgeSize == 1) {
                    setTimeout(function() {
                      largBadgeNumber(uv1, currentWhiteIcon)
                    }, 550);
                  }
                  else{
                    badgeBackgroundColor();
                    badgeBackgroundImage(currentWhiteIcon);
                    chrome.browserAction.setBadgeText({"text": "UV"+ uv1});
                  }
        }
        else {
                  if(currentBadgeSize == 1) {
                    setTimeout(function() {
                      largBadgeNumber(uv1, currentWhiteIcon)
                    }, 550);
                  }
                  else{
                    badgeBackgroundColor();
                    badgeBackgroundImage(currentWhiteIcon);
                    chrome.browserAction.setBadgeText({"text": "UV "+ uv1});
                  }
        } 
      }

    });
  };

  function delayButtonDarkmodeSetting() {
      setTimeout(function() {
      document.querySelector("#setting_defualt_theme_d_all").style.pointerEvents = "auto";
      document.querySelector("#setting_defualt_theme_l_all").style.pointerEvents = "auto"
    }, 1000);
  };

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

  function delayButton12h24h() {
      setTimeout(function() {
      document.querySelector("#setting_defualt_button_12h_all").style.pointerEvents = "auto";
      document.querySelector("#setting_defualt_button_24h_all").style.pointerEvents = "auto";
    }, 1500);
  };

  function delayButtonBadgeSize() {
      setTimeout(function() {
      document.getElementById("checkbox_largIcon").disabled = false;
    }, 1500);
  };

  function delayButtonIntervalUpdate() {
      setTimeout(function() {
        document.querySelector("#setting_defualt_button_60_all").style.pointerEvents = "auto";
        document.querySelector("#setting_defualt_button_90_all").style.pointerEvents = "auto";
        document.querySelector("#setting_defualt_button_120_all").style.pointerEvents = "auto";
    }, 1500);
  };

/// Click event ------------------------------------------------------------------------------
  document.querySelector("#setting_defualt_theme_d_all").addEventListener("click", (e) => {
    darkDisplay();
      document.querySelector("#setting_defualt_theme_d_all").style.pointerEvents = "none";
      document.querySelector("#setting_defualt_theme_l_all").style.pointerEvents = "none";
      delayButtonDarkmodeSetting();
  });

  document.querySelector("#setting_defualt_theme_l_all").addEventListener("click", (e) => {
    lightDisplay();
      document.querySelector("#setting_defualt_theme_d_all").style.pointerEvents = "none";
      document.querySelector("#setting_defualt_theme_l_all").style.pointerEvents = "none";
      delayButtonDarkmodeSetting();   
  });

  document.querySelector("#setting_defualt_button_u_all").addEventListener("click", (e) => { 
      setSettingUT = "u";
      chrome.storage.local.set({'setSettingUT': 'u'});
        if(uv1>9) {
                chrome.storage.local.get(['whiteIcon','badgeSize'], function(data) {
                var currentWhiteIcon = data.whiteIcon;
                var currentBadgeSize = data.badgeSize;
                  if(currentBadgeSize == 1) {
                    setTimeout(function() {
                      largBadgeNumber(uv1, currentWhiteIcon)
                    }, 550);
                  }
                  else{
                    chrome.browserAction.setBadgeText({"text": "UV"+ uv1});
                  }
               });
        }
        else {
                chrome.storage.local.get(['whiteIcon','badgeSize'], function(data) {
                var currentWhiteIcon = data.whiteIcon;
                var currentBadgeSize = data.badgeSize;
                  if(currentBadgeSize == 1) {
                    setTimeout(function() {
                      largBadgeNumber(uv1, currentWhiteIcon)
                    }, 550);
                  }
                  else{
                    chrome.browserAction.setBadgeText({"text": "UV "+ uv1});
                  }
               });
        }        
      document.getElementById("setting_defualt_button_u_all").disabled = true;
      document.getElementById("setting_defualt_button_t_all").disabled = false;
      document.getElementById("setting_defualt_button_u").checked = true;
      document.getElementById("setting_defualt_button_t").checked = false;
  });
  
  document.querySelector("#setting_defualt_button_t_all").addEventListener("click", (e) => { 
      setSettingUT = "t";
      chrome.storage.local.set({'setSettingUT': 't'});
          if (setSettingFC == "f") {
                  chrome.storage.local.get(['whiteIcon','badgeSize'], function(data) {
                    var currentWhiteIcon = data.whiteIcon;
                    var currentBadgeSize = data.badgeSize;
                      if(currentBadgeSize == 1) {
                        setTimeout(function(){
                          largBadgeNumber(temperatureFbadge, currentWhiteIcon)
                        }, 550);
                      }
                      else{
                        chrome.browserAction.setBadgeText({"text":temperatureFbadge +"°F" });
                      }
                   });
            }
          else {
                  chrome.storage.local.get(['whiteIcon','badgeSize'], function(data) {
                    var currentWhiteIcon = data.whiteIcon;
                    var currentBadgeSize = data.badgeSize;
                      if(currentBadgeSize == 1) {
                        setTimeout(function(){
                          largBadgeNumber(temperatureCbadge, currentWhiteIcon)
                        }, 550);
                      }
                      else{
                        chrome.browserAction.setBadgeText({"text":temperatureCbadge +"°C" });
                      }
                   });
          }
      document.getElementById("setting_defualt_button_t_all").disabled = true;
      document.getElementById("setting_defualt_button_u_all").disabled = false;
      document.getElementById("setting_defualt_button_t").checked = true;
      document.getElementById("setting_defualt_button_u").checked = false;
  });

  document.querySelector("#setting_defualt_button_c_all").addEventListener("click", (e) => { 
      chrome.storage.local.get('setSettingFC', function(data) {
      if(data.setSettingFC !== 'c') {

        setSettingFC = "c";
        chrome.storage.local.set({'setSettingFC': 'c'});
        if(setSettingUT == "t") {
        chrome.storage.local.get(['whiteIcon','badgeSize'], function(data) {
          var currentWhiteIcon = data.whiteIcon;
          var currentBadgeSize = data.badgeSize;
            if(currentBadgeSize == 1) {
              setTimeout(function(){
                largBadgeNumber(temperatureCbadge, currentWhiteIcon)
              }, 550);
            }
            else{
              chrome.browserAction.setBadgeText({"text":temperatureCbadge +"°C" });
            }
         });
        }
        ctemp();
    }
   });
   });

  document.querySelector("#setting_defualt_button_f_all").addEventListener("click", (e) => { 
      chrome.storage.local.get('setSettingFC', function(data) {
      if(data.setSettingFC !== 'f') {

        setSettingFC = "f";
        chrome.storage.local.set({'setSettingFC': 'f'});
        if(setSettingUT == "t") {   
        chrome.storage.local.get(['whiteIcon','badgeSize'], function(data) {
          var currentWhiteIcon = data.whiteIcon;
          var currentBadgeSize = data.badgeSize;
            if(currentBadgeSize == 1) {
              setTimeout(function(){
                largBadgeNumber(temperatureFbadge, currentWhiteIcon)
              }, 550);
            }
            else{
              chrome.browserAction.setBadgeText({"text":temperatureFbadge +"°F" });
            }
         });
        }      
        ftemp();
    }

   });
   });

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

  document.querySelector("#setting_popup_close").addEventListener("click", (e) => {
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

  document.querySelector("#F_sign").addEventListener("click", (e) => { 
      chrome.storage.local.get('setSettingFC', function(data) {
        if(data.setSettingFC !== 'f') {
          ftemp();
          setSettingFC = "f";
          chrome.storage.local.set({'setSettingFC': 'f'});
        }
      });
  });

  document.querySelector("#C_sign").addEventListener("click", (e) => { 
      chrome.storage.local.get('setSettingFC', function(data) {
        if(data.setSettingFC !== 'c') {
          ctemp();
          setSettingFC = "c";
          chrome.storage.local.set({'setSettingFC': 'c'});
        }
      });
  });

  document.querySelector("#donate_button").addEventListener("click", (e) => {
      window.open("https://uvweather.net/donate");
  });

  document.querySelector("#icon_close_box").addEventListener("click", (e) => {
      chrome.storage.local.set({'closeAds': '1'});
      var donateButton = document.getElementById("donate_button");
      var donateClose = document.getElementById("icon_close_box");
      var donateCard = document.getElementById("cardMain");
      donateButton.style.display = "none";
      donateClose.style.display = "none";
      donateCard.style.display = "none";
      setTimeout(function() {
        window.open("https://uvweather.net/donate");
      }, 1000);
  });

  document.querySelector("#setting_defualt_button_12h_all").addEventListener("click", (e) => {
      chrome.storage.local.set({'TimeFormat': '12h'});
      document.querySelector("#setting_defualt_button_12h_all").style.pointerEvents = "none";
      document.querySelector("#setting_defualt_button_24h_all").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_12h").checked = true;
      solarFunction12H();
      refresh24h12h();
      delayButton12h24h();
  });

  document.querySelector("#setting_defualt_button_24h_all").addEventListener("click", (e) => {
      chrome.storage.local.set({'TimeFormat': '24h'});
      document.querySelector("#setting_defualt_button_12h_all").style.pointerEvents = "none";
      document.querySelector("#setting_defualt_button_24h_all").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_24h").checked = true;
      solarFunction24H();
      refresh24h12h()
      delayButton12h24h();
  });

  document.querySelector("#setting_defualt_button_60_all").addEventListener("click", (e) => { 
      chrome.storage.local.set({'IntervalUpdate': '60'});
      chrome.runtime.sendMessage({ msg: "intervalUpdateMessage" });
      document.querySelector("#setting_defualt_button_60_all").style.pointerEvents = "none";
      document.querySelector("#setting_defualt_button_90_all").style.pointerEvents = "none";
      document.querySelector("#setting_defualt_button_120_all").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_60").checked = true;
      setTimeout(function() {
        window.open("https://uvweather.net/donate");
      }, 1000);
      delayButtonIntervalUpdate();
    })

  document.querySelector("#setting_defualt_button_90_all").addEventListener("click", (e) => { 
      chrome.storage.local.set({'IntervalUpdate': '90'});
      chrome.runtime.sendMessage({ msg: "intervalUpdateMessage" });
      document.querySelector("#setting_defualt_button_60_all").style.pointerEvents = "none";
      document.querySelector("#setting_defualt_button_90_all").style.pointerEvents = "none";
      document.querySelector("#setting_defualt_button_120_all").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_90").checked = true;
      delayButtonIntervalUpdate();
    })
  
  document.querySelector("#setting_defualt_button_120_all").addEventListener("click", (e) => { 
      chrome.storage.local.set({'IntervalUpdate': '120'});
      chrome.runtime.sendMessage({ msg: "intervalUpdateMessage" });      
      document.querySelector("#setting_defualt_button_60_all").style.pointerEvents = "none";
      document.querySelector("#setting_defualt_button_90_all").style.pointerEvents = "none";
      document.querySelector("#setting_defualt_button_120_all").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_120").checked = true;
      delayButtonIntervalUpdate();
    })


/// Search & Map-------------------------------------------------------------------------------
  function searchMap(mapStyle) {
    var element = document.getElementById("mapSearch");
    element.classList.add("blurIn");
    setTimeout(function() {
      element.classList.add("blurOut");
    }, 2000);

    mapboxgl.accessToken = 'pk.eyJ1IjoiY29tZmFibGUiLCJhIjoiY2sybTF6Z3FpMGRkeTNscWxhMnNybnU3cyJ9.VDvM0a0jaMlLMwlqBI8kUw';
    if(typeof ((latandlong.split('"'))[1]) !== 'undefined') {
      latandlongMapBox = ((latandlong.split('"'))[1]).split(',').reverse().join(',');
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
     
    map.addControl(geocoder);
  map.addControl(new mapboxgl.NavigationControl());

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
          var latClick = lnglatclick.lat;
          var lngClick = lnglatclick.lng;

          chrome.storage.local.get(['latPre','lngPre'], function(data) {
            latPre = data.latPre;
            lngPre = data.lngPre;

          if((typeof latPre == 'undefined' || typeof lngPre == 'undefined')) {
            latPre = 0;
            lngPre = 0;
          }

          if((Math.abs(latClick - latPre) >= 0.05) || (Math.abs(lngClick - lngPre) >= 0.05)) {
          chrome.storage.local.set({'latPre': latClick});
          chrome.storage.local.set({'lngPre': lngClick});

          latlong =  '"' + latClick + ',' + lngClick + '"';
          latandlongbyClick = [lngClick,latClick];

          token = 'pk.eyJ1IjoiY29tZmFibGUiLCJhIjoiY2sybTF6Z3FpMGRkeTNscWxhMnNybnU3cyJ9.VDvM0a0jaMlLMwlqBI8kUw';
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${latandlongbyClick}.json?types=place,locality&limit=1&access_token=${token}`)
            .then((resp) => resp.json())
             .then(function(result) {
              
              if(result.hasOwnProperty('features')) {
                if(result.features.hasOwnProperty('0')) {
                if(result.features[0].hasOwnProperty('place_name') && result.features[0].hasOwnProperty('text')) {
                  var fullname = result.features[0].place_name;
                  var cityAPI = result.features[0].text;

                    latandlong =  '"' + latClick + ',' + lngClick + '"';
                    city =  '"' + cityAPI + '"';

                    if(((result.features[0].place_name).split(','))[2]) {
                        countryFull = ((result.features[0].place_name).split(','))[2];
                    }
                    else {
                      countryFull = ((result.features[0].place_name).split(','))[1];
                    }

                    for(var i = 0; i <= result.features[0].context.length; i++) {
                          if(result.features[0].context[i].hasOwnProperty('short_code')) {
                          country = (result.features[0].context[i].short_code).substring(0, 2);
                          break;
                        }                    
                    }

                    chrome.storage.local.set({'fullname': fullname});
                    chrome.storage.local.set({'latlong': latandlong});
                    chrome.storage.local.set({'city': city});
                    chrome.storage.local.set({'country': country});

                    setTimeout(function(){
                      popupPage(city,latandlong,country);
                    }, 150);

                        chrome.storage.local.get('autoDark', function(data) {
                        var autoDarkTheme = data.autoDark;
                          if(autoDarkTheme == '1' && isNight) {
                              darkDisplay();
                              map.setStyle(mapStyleDark);
                          }
                           else if(autoDarkTheme == '1' && isDay) {
                              lightDisplay();
                              map.setStyle(mapStyleLight);
                          }
                        });

                }
              }
            }
            });
        }
      });

      });

      geocoder.on('result', function(ev) {
          updateGeocoderProximity();
          var fullname = ev.result.place_name;
          var cityAPI = ev.result.text;
          var lat = ev.result.geometry.coordinates[1];
          var lng = ev.result.geometry.coordinates[0];

          latandlong =  '"' + lat + ',' + lng + '"';
          city =  '"' + cityAPI + '"';

          if(((ev.result.place_name).split(','))[2]) {
              countryFull = ((ev.result.place_name).split(','))[2];
          }
          else {
            countryFull = ((ev.result.place_name).split(','))[1];
          }
          
          for(var i = 0; i <= ev.result.context.length; i++) {
                if(ev.result.context[i].hasOwnProperty('short_code')) {
                country = (ev.result.context[i].short_code).substring(0, 2);
                break;
              }                    
          }

          chrome.storage.local.set({'fullname': fullname});
          chrome.storage.local.set({'latlong': latandlong});
          chrome.storage.local.set({'city': city});
          chrome.storage.local.set({'country': country});

            setTimeout(function(){
              popupPage(city,latandlong,country);
            }, 150);

                chrome.storage.local.get('autoDark', function(data) {
                var autoDarkTheme = data.autoDark;
                  if(autoDarkTheme == '1' && isNight) {
                      darkDisplay();
                      map.setStyle(mapStyleDark);
                  }
                   else if(autoDarkTheme == '1' && isDay) {
                      lightDisplay();
                      map.setStyle(mapStyleLight);
                  }
                });

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
    if(typeof ((latandlong.split('"'))[1]) !== 'undefined') {
      latandlongMapBox = ((latandlong.split('"'))[1]).split(',').reverse().join(',');
      latandlongMapBox = JSON.parse("[" + latandlongMapBox + "]");
    }
    else {
      latandlongMapBox = [-79.3832,43.6532];
    } 
   
    var mapWeather = new mapboxgl.Map({
        container: 'mapWeather',
        style: weathermapStyle,
        center: latandlongMapBox,
        minZoom: 1,
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
          "tiles": ["https://tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=a080c7a5e8cbf016d7fa32f33f975880"],
          "tileSize": 256
        },
        "minzoom": 1,
        "maxzoom": 8
      });
    });
  }; 


// }
// else {
//     document.getElementById("noInternet_popup").style.visibility = "visible";
// }

});