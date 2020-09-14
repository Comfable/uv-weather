//
document.addEventListener("DOMContentLoaded", function() {

if(navigator.onLine) {
  document.querySelector(".noInternet_popup_Class").style.visibility = "hidden";
}
else{
  document.querySelector(".noInternet_popup_Class").style.visibility = "visible";
}

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
var modalCurrent = document.getElementById("currentReport_popup");
var modalSearch = document.getElementById("search_popup");
var F_C_display = document.getElementById("F_C"); 

var C_sign_elementStyle = document.getElementById('C_sign').style;
var F_sign_elementStyle = document.getElementById('F_sign').style;
const toggleSwitchBadgeSize = document.querySelector('.badge_size_switch_setting input[type="checkbox"]');
var loadingIconBadgeDelay = 1;

var mapStyleLight = 'mapbox://styles/mapbox/light-v10';
var weathermapStyleLight = 'mapbox://styles/mapbox/light-v10';
var mapStyleDark = 'mapbox://styles/mapbox/dark-v10';
var weathermapStyleDark = 'mapbox://styles/mapbox/dark-v10';

mapStyle = 'mapbox://styles/mapbox/light-v10';
weathermapStyle = 'mapbox://styles/mapbox/light-v10';

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
}, 50);

var locationToast = Toastify({
 className: "locationToast",
 text: "Get data specific to your location →",  //Change your location here
 gravity: 'top',
 position: 'right',
 close: false,
 stopOnFocus: false,
 backgroundColor: '#3B4149',
 duration: 60000,
})

version_manifest = chrome.runtime.getManifest().version;
document.querySelector("#title_version_setting").textContent = 'Version ' + version_manifest;
document.getElementById("preload_body").style.display = "block";

chrome.storage.local.get('firstTimePopup', function(data) {
  if(typeof data.firstTimePopup == 'undefined') {
    chrome.storage.local.set({'firstTimePopup': 1});
  }
  if(data.firstTimePopup == 0) {
    setTimeout(function() {
      locationToast.showToast();
    }, 1500);
    chrome.storage.local.set({'firstTimePopup': 1}); 

  }
});


chrome.storage.local.set({'firstTimeSaerchPopupInSession': 0});

chrome.storage.local.get(['IntervalUpdate', 'setSettingUT', 'country'], function(data) {
   if(data.country == "US" || data.country == "us" || data.country == "United States of America" || data.country == "CA" || data.country == "ca" || data.country == "Canada"){
     document.querySelector(".setting_defualt_button_30_sub").style.opacity = "1";
     document.querySelector(".setting_defualt_button_15_sub").style.opacity = "1";
     document.querySelector(".setting_defualt_button_30_sub_label").style.opacity = "1";
     document.querySelector(".setting_defualt_button_15_sub_label").style.opacity = "1";     
     document.getElementById("setting_defualt_button_30_all").style.pointerEvents = "auto";
     document.getElementById("setting_defualt_button_15_all").style.pointerEvents = "auto";
    }
    else{
     document.querySelector(".setting_defualt_button_30_sub_label").style.opacity = ".3";
     document.querySelector(".setting_defualt_button_15_sub_label").style.opacity = ".3";
     document.querySelector(".setting_defualt_button_30_sub").style.opacity = ".3";
     document.querySelector(".setting_defualt_button_15_sub").style.opacity = ".3";
    }

  if(data.IntervalUpdate == "120") {
    document.getElementById("setting_defualt_button_120").checked = true;
  }
  else if(data.IntervalUpdate == "90") {
    document.getElementById("setting_defualt_button_90").checked = true;
  }
  else if(data.IntervalUpdate == "60") {
    document.getElementById("setting_defualt_button_60").checked = true;
  }
  else if(data.IntervalUpdate == "30" && data.setSettingUT == 't' && (data.country == "US" || data.country == "us" || data.country == "United States of America" || data.country == "CA" || data.country == "ca" || data.country == "Canada") ) {
    document.getElementById("setting_defualt_button_30").checked = true;
    document.querySelector(".setting_defualt_button_30_sub").style.opacity = "1";
    document.querySelector(".setting_defualt_button_30_sub_label").style.opacity = "1";
    document.getElementById("setting_defualt_button_30_all").style.pointerEvents = "auto";    
  }
  else if(data.IntervalUpdate == "15" && data.setSettingUT == 't' && (data.country == "US" || data.country == "us" || data.country == "United States of America" || data.country == "CA" || data.country == "ca" || data.country == "Canada") ) {
    document.getElementById("setting_defualt_button_15").checked = true;
    document.querySelector(".setting_defualt_button_15_sub").style.opacity = "1";
    document.querySelector(".setting_defualt_button_15_sub_label").style.opacity = "1"; 
    document.getElementById("setting_defualt_button_15_all").style.pointerEvents = "auto";       
  }
})

chrome.storage.local.get('windUnit', function(data) {
  if(data.windUnit == "mph" || typeof(data.windUnit) == 'undefined') {
    document.getElementById("setting_defualt_button_mph").checked = true;
  } 
  else if(data.windUnit == "kmh") {
    document.getElementById("setting_defualt_button_kmh").checked = true;
  }
  else if(data.windUnit == "ms") {
    document.getElementById("setting_defualt_button_ms").checked = true;
  }
})

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
      delayButtonSetting();
      delayReleaseButtonSetting();
    }
    else {
      chrome.storage.local.set({'badgeSize': '0'});
      document.getElementById("checkbox_largIcon").checked = false;
      document.getElementById("checkbox_largIcon").disabled = true;
      updateBadge();
      delayButtonBadgeSize();
      delayButtonSetting();
      delayReleaseButtonSetting();
    }    
  }
  toggleSwitchBadgeSize.addEventListener('change', switchBadgeSize, false);
});

sidebarMenu

const toggleSwitchAnimatedIcon = document.querySelector('.theme-switch_setting_animated_icon input[type="checkbox"]');
chrome.storage.local.get('animatedIcon', function(data) {
  currentAnimatedIcon = data.animatedIcon;

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
  currentWhiteIcon = data.whiteIcon;
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


chrome.storage.local.get(['theme', 'autoDark', 'timeZoneBadge', 'latlong'], function(data) {
  currentTheme = data.theme;
  autoDarkTheme = data.autoDark;
  timeZoneBadge = data.timeZoneBadge;
  latlong = data.latlong;

    solarNighDay(timeZoneBadge,latlong);

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
  currentAutoDark = data.autoDark;

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


function popup() {

  chrome.storage.local.get(['latlong', 'citys', 'country', 'failedHTTP', 'setSettingUT'], function(data) {
    latlong = data.latlong;
    country = data.country;
    citys = data.citys;
    setSettingUT = data.setSettingUT;
    failedHTTP = data.failedHTTP;

    if(setSettingUT == "u" && navigator.onLine) {
      var promise = new Promise(function (resolve, reject) {
          weatherDS(latlong,citys,country,resolve);
      });
      Promise.all([promise]).then(function () {
              accufeelCalc(ghiSolarClearSki,iconDS,cloudCoverBadge,temperatureCbadge,humidity,windSpeedMS);
            }).then(function () {
                  UTFC();
                  refreshPopup();
                  updateBadge();   
            });
    }

    if((typeof setSettingUT === 'undefined' || setSettingUT == "t") && navigator.onLine) {

      if(country == "CA" || country == "ca" || country == "Canada") {
          var promise = new Promise(function (resolve, reject) {
                  weatherCA(latlong,citys,resolve);
          });
          var promise2 = new Promise(function (resolve, reject) {
                  weatherDS(latlong,citys,country,resolve);
          });
          Promise.all([promise, promise2]).then(function () {
                  accufeelCalc(ghiSolarClearSki,iconDS,cloudCoverBadge,temperatureCbadge,humidity,windSpeedMS);
                }).then(function () {
                      UTFC();
                      refreshPopup();
                      updateBadge();   
                });
      }
      
      else if(country == "US" || country == "us" || country == "United States of America") {

          var promise = new Promise(function (resolve, reject) {
                  weatherUS2(latlong,citys,resolve);
          });
          var promise2 = new Promise(function (resolve, reject) {
                  weatherDS(latlong,citys,country,resolve);
          });      
          Promise.all([promise, promise2]).then(function () {
                  accufeelCalc(ghiSolarClearSki,iconDS,cloudCoverBadge,temperatureCbadge,humidity,windSpeedMS);
                }).then(function () {
                      UTFC();
                      refreshPopup();
                      updateBadge();  
                });
      }

      else {
          var promise = new Promise(function (resolve, reject) {
                  weatherOWM(latlong,citys,resolve);
          });
          var promise2 = new Promise(function (resolve, reject) {
                  weatherDS(latlong,citys,country,resolve);
          });
          Promise.all([promise, promise2]).then(function () {
                  accufeelCalc(ghiSolarClearSki,iconDS,cloudCoverBadge,temperatureCbadge,humidity,windSpeedMS);
                }).then(function () {
                      UTFC();
                      refreshPopup();
                      updateBadge();
                });
      }

    }

  });

};

popup();


/// Functions----------------------------------------------------------
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
  };

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

  function loadingIconBadge() {
    if(loadingIconBadgeDelay == '1') {
      loadingIconBadgeDelay = '0';
      animatedBadgeInterval = setInterval(function() {animatedBadge(); }, 1000 / 30);
      setTimeout(function() {
        clearInterval(animatedBadgeInterval);
        loadingIconBadgeDelay = '1';  
      }, 485);
    };
  };

  function refreshPopup() {
    i_er = 1; //weatherUS
    chrome.storage.local.set({'failedHTTP': '0'});

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

      if(citys.length > 15) {
        document.querySelector("#location").textContent = citys.slice(0, 12) +'...';
      }
      else{
        document.querySelector("#location").textContent = citys;
      }
      
      document.querySelector("#current_uv").textContent = uv1;
      
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

    chrome.storage.local.get(['country', 'setSettingUT'], function(data) {
      if(data.setSettingUT == 'u') {
          document.querySelector(".tooltip-bottom-interval-display-15").style.display = "none";
          document.querySelector(".tooltip-bottom-interval-display-30").style.display = "none";
          document.querySelector(".setting_defualt_button_30_sub").style.opacity = ".3";
          document.querySelector(".setting_defualt_button_15_sub").style.opacity = ".3";
          document.querySelector(".setting_defualt_button_30_sub_label").style.opacity = ".3";
          document.querySelector(".setting_defualt_button_15_sub_label").style.opacity = ".3";
      }      
      else if(data.setSettingUT == 't' && (data.country == "US" || data.country == "us" || data.country == "United States of America" || data.country == "CA" || data.country == "ca" || data.country == "Canada") ) {
          document.querySelector(".setting_defualt_button_30_sub").style.opacity = "1";
          document.querySelector(".setting_defualt_button_15_sub").style.opacity = "1";
          document.querySelector(".setting_defualt_button_30_sub_label").style.opacity = "1";
          document.querySelector(".setting_defualt_button_15_sub_label").style.opacity = "1";          
          document.getElementById("setting_defualt_button_30_all").style.pointerEvents = "auto";
          document.getElementById("setting_defualt_button_15_all").style.pointerEvents = "auto";
          document.querySelector(".tooltip-bottom-interval-display-15").style.display = "none";
          document.querySelector(".tooltip-bottom-interval-display-30").style.display = "none";          
        }
      else{
          document.querySelector(".setting_defualt_button_30_sub").style.opacity = ".3";
          document.querySelector(".setting_defualt_button_15_sub").style.opacity = ".3";
          document.querySelector(".setting_defualt_button_30_sub_label").style.opacity = ".3";
          document.querySelector(".setting_defualt_button_15_sub_label").style.opacity = ".3";
          document.querySelector(".tooltip-bottom-interval-display-15").style.display = "block";
          document.querySelector(".tooltip-bottom-interval-display-30").style.display = "block";          

          chrome.storage.local.set({'IntervalUpdate': '60'});
          chrome.runtime.sendMessage({ msg: "intervalUpdateMessage" });
          document.getElementById("setting_defualt_button_60").checked = true;
        }

      });

      //accufeelCalc();
      uvRecommendation();
      next48Function();
      next7Function();
      refresh24h12h();
      reportFunction();
      trackSunExposure();
      refreshWindSpeedUnit();
      loadingIconBadge();
  };

  function accufeelCalc(ghiSolarClearSki,iconDS,cloudCoverBadge,temperatureCbadge,humidity,windSpeedMS) {
    if(ghiSolarClearSki !== '-') {
      if (ghiSolarClearSki >=250) { 
        cloudAdj_hourly = uv_adj_daily(iconDS,cloudCoverBadge);
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

      document.querySelector('#forecast_1_temp').textContent = Math.round(f2c(daily_tempF_max_1)) + "°";
      document.querySelector('#forecast_2_temp').textContent = Math.round(f2c(daily_tempF_max_2)) + "°";

      document.querySelector('#forecast_1_temp_min').textContent = Math.round(f2c(daily_tempF_min_1)) + "°";
      document.querySelector('#forecast_2_temp_min').textContent = Math.round(f2c(daily_tempF_min_2)) + "°";


      document.querySelector('#forecast_10_temp').textContent = Math.round(f2c(daily_tempF_max_1)) + "°";
      document.querySelector('#forecast_20_temp').textContent = Math.round(f2c(daily_tempF_max_2)) + "°";
      document.querySelector('#forecast_30_temp').textContent = Math.round(f2c(daily_tempF_max_3)) + "°";
      document.querySelector('#forecast_40_temp').textContent = Math.round(f2c(daily_tempF_max_4)) + "°";
      document.querySelector('#forecast_50_temp').textContent = Math.round(f2c(daily_tempF_max_5)) + "°";
      document.querySelector('#forecast_60_temp').textContent = Math.round(f2c(daily_tempF_max_6)) + "°";
      document.querySelector('#forecast_70_temp').textContent = Math.round(f2c(daily_tempF_max_7)) + "°";

      document.querySelector('#forecast_10_temp_min').textContent = Math.round(f2c(daily_tempF_min_1)) + "°";
      document.querySelector('#forecast_20_temp_min').textContent = Math.round(f2c(daily_tempF_min_2)) + "°";
      document.querySelector('#forecast_30_temp_min').textContent = Math.round(f2c(daily_tempF_min_3)) + "°";
      document.querySelector('#forecast_40_temp_min').textContent = Math.round(f2c(daily_tempF_min_4)) + "°";
      document.querySelector('#forecast_50_temp_min').textContent = Math.round(f2c(daily_tempF_min_5)) + "°";
      document.querySelector('#forecast_60_temp_min').textContent = Math.round(f2c(daily_tempF_min_6)) + "°";
      document.querySelector('#forecast_70_temp_min').textContent = Math.round(f2c(daily_tempF_min_7)) + "°";


      document.querySelector('#forecast_1_hours_temp').textContent = Math.round(f2c(hourly_tempF_1)) + "°";
      document.querySelector('#forecast_2_hours_temp').textContent = Math.round(f2c(hourly_tempF_2)) + "°";
      document.querySelector('#forecast_3_hours_temp').textContent = Math.round(f2c(hourly_tempF_3)) + "°";
      document.querySelector('#forecast_4_hours_temp').textContent = Math.round(f2c(hourly_tempF_4)) + "°";
      document.querySelector('#forecast_5_hours_temp').textContent = Math.round(f2c(hourly_tempF_5)) + "°";
      document.querySelector('#forecast_6_hours_temp').textContent = Math.round(f2c(hourly_tempF_6)) + "°";
      document.querySelector('#forecast_7_hours_temp').textContent = Math.round(f2c(hourly_tempF_7)) + "°";
      document.querySelector('#forecast_8_hours_temp').textContent = Math.round(f2c(hourly_tempF_8)) + "°";
      document.querySelector('#forecast_9_hours_temp').textContent = Math.round(f2c(hourly_tempF_9)) + "°";
      document.querySelector('#forecast_10_hours_temp').textContent = Math.round(f2c(hourly_tempF_10)) + "°";
      document.querySelector('#forecast_11_hours_temp').textContent = Math.round(f2c(hourly_tempF_11)) + "°";
      document.querySelector('#forecast_12_hours_temp').textContent = Math.round(f2c(hourly_tempF_12)) + "°";
      document.querySelector('#forecast_13_hours_temp').textContent = Math.round(f2c(hourly_tempF_13)) + "°";
      document.querySelector('#forecast_14_hours_temp').textContent = Math.round(f2c(hourly_tempF_14)) + "°";
      document.querySelector('#forecast_15_hours_temp').textContent = Math.round(f2c(hourly_tempF_15)) + "°";
      document.querySelector('#forecast_16_hours_temp').textContent = Math.round(f2c(hourly_tempF_16)) + "°";
      document.querySelector('#forecast_17_hours_temp').textContent = Math.round(f2c(hourly_tempF_17)) + "°";
      document.querySelector('#forecast_18_hours_temp').textContent = Math.round(f2c(hourly_tempF_18)) + "°";
      document.querySelector('#forecast_19_hours_temp').textContent = Math.round(f2c(hourly_tempF_19)) + "°";
      document.querySelector('#forecast_20_hours_temp').textContent = Math.round(f2c(hourly_tempF_20)) + "°";
      document.querySelector('#forecast_21_hours_temp').textContent = Math.round(f2c(hourly_tempF_21)) + "°";
      document.querySelector('#forecast_22_hours_temp').textContent = Math.round(f2c(hourly_tempF_22)) + "°";
      document.querySelector('#forecast_23_hours_temp').textContent = Math.round(f2c(hourly_tempF_23)) + "°";
      document.querySelector('#forecast_24_hours_temp').textContent = Math.round(f2c(hourly_tempF_24)) + "°";
      document.querySelector('#forecast_25_hours_temp').textContent = Math.round(f2c(hourly_tempF_25)) + "°";
      document.querySelector('#forecast_26_hours_temp').textContent = Math.round(f2c(hourly_tempF_26)) + "°";
      document.querySelector('#forecast_27_hours_temp').textContent = Math.round(f2c(hourly_tempF_27)) + "°";
      document.querySelector('#forecast_28_hours_temp').textContent = Math.round(f2c(hourly_tempF_28)) + "°";
      document.querySelector('#forecast_29_hours_temp').textContent = Math.round(f2c(hourly_tempF_29)) + "°";
      document.querySelector('#forecast_30_hours_temp').textContent = Math.round(f2c(hourly_tempF_30)) + "°";
      document.querySelector('#forecast_31_hours_temp').textContent = Math.round(f2c(hourly_tempF_31)) + "°";
      document.querySelector('#forecast_32_hours_temp').textContent = Math.round(f2c(hourly_tempF_32)) + "°";
      document.querySelector('#forecast_33_hours_temp').textContent = Math.round(f2c(hourly_tempF_33)) + "°";
      document.querySelector('#forecast_34_hours_temp').textContent = Math.round(f2c(hourly_tempF_34)) + "°";
      document.querySelector('#forecast_35_hours_temp').textContent = Math.round(f2c(hourly_tempF_35)) + "°";
      document.querySelector('#forecast_36_hours_temp').textContent = Math.round(f2c(hourly_tempF_36)) + "°";
      document.querySelector('#forecast_37_hours_temp').textContent = Math.round(f2c(hourly_tempF_37)) + "°";
      document.querySelector('#forecast_38_hours_temp').textContent = Math.round(f2c(hourly_tempF_38)) + "°";
      document.querySelector('#forecast_39_hours_temp').textContent = Math.round(f2c(hourly_tempF_39)) + "°";
      document.querySelector('#forecast_40_hours_temp').textContent = Math.round(f2c(hourly_tempF_40)) + "°";
      document.querySelector('#forecast_41_hours_temp').textContent = Math.round(f2c(hourly_tempF_41)) + "°";
      document.querySelector('#forecast_42_hours_temp').textContent = Math.round(f2c(hourly_tempF_42)) + "°";
      document.querySelector('#forecast_43_hours_temp').textContent = Math.round(f2c(hourly_tempF_43)) + "°";
      document.querySelector('#forecast_44_hours_temp').textContent = Math.round(f2c(hourly_tempF_44)) + "°";
      document.querySelector('#forecast_45_hours_temp').textContent = Math.round(f2c(hourly_tempF_45)) + "°";
      document.querySelector('#forecast_46_hours_temp').textContent = Math.round(f2c(hourly_tempF_46)) + "°";
      document.querySelector('#forecast_47_hours_temp').textContent = Math.round(f2c(hourly_tempF_47)) + "°";
      document.querySelector('#forecast_48_hours_temp').textContent = Math.round(f2c(hourly_tempF_48)) + "°";

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
    // document.querySelector("#forecast_tomorrow").textContent = update_tomorrow_f;

    document.querySelector('#forecast_1_temp').textContent = Math.round(daily_tempF_max_1) + "°";
    document.querySelector('#forecast_2_temp').textContent = Math.round(daily_tempF_max_2) + "°";

    document.querySelector('#forecast_1_temp_min').textContent = Math.round(daily_tempF_min_1) + "°";
    document.querySelector('#forecast_2_temp_min').textContent = Math.round(daily_tempF_min_2) + "°";

    document.querySelector('#forecast_10_temp').textContent = Math.round(daily_tempF_max_1) + "°";
    document.querySelector('#forecast_20_temp').textContent = Math.round(daily_tempF_max_2) + "°";
    document.querySelector('#forecast_30_temp').textContent = Math.round(daily_tempF_max_3) + "°";
    document.querySelector('#forecast_40_temp').textContent = Math.round(daily_tempF_max_4) + "°";
    document.querySelector('#forecast_50_temp').textContent = Math.round(daily_tempF_max_5) + "°";
    document.querySelector('#forecast_60_temp').textContent = Math.round(daily_tempF_max_6) + "°";
    document.querySelector('#forecast_70_temp').textContent = Math.round(daily_tempF_max_7) + "°";

    document.querySelector('#forecast_10_temp_min').textContent = Math.round(daily_tempF_min_1) + "°";
    document.querySelector('#forecast_20_temp_min').textContent = Math.round(daily_tempF_min_2) + "°";
    document.querySelector('#forecast_30_temp_min').textContent = Math.round(daily_tempF_min_3) + "°";
    document.querySelector('#forecast_40_temp_min').textContent = Math.round(daily_tempF_min_4) + "°";
    document.querySelector('#forecast_50_temp_min').textContent = Math.round(daily_tempF_min_5) + "°";
    document.querySelector('#forecast_60_temp_min').textContent = Math.round(daily_tempF_min_6) + "°";
    document.querySelector('#forecast_70_temp_min').textContent = Math.round(daily_tempF_min_7) + "°";

    document.querySelector('#forecast_1_hours_temp').textContent = Math.round(hourly_tempF_1) + "°";
    document.querySelector('#forecast_2_hours_temp').textContent = Math.round(hourly_tempF_2) + "°";
    document.querySelector('#forecast_3_hours_temp').textContent = Math.round(hourly_tempF_3) + "°";
    document.querySelector('#forecast_4_hours_temp').textContent = Math.round(hourly_tempF_4) + "°";
    document.querySelector('#forecast_5_hours_temp').textContent = Math.round(hourly_tempF_5) + "°";
    document.querySelector('#forecast_6_hours_temp').textContent = Math.round(hourly_tempF_6) + "°";
    document.querySelector('#forecast_7_hours_temp').textContent = Math.round(hourly_tempF_7) + "°";
    document.querySelector('#forecast_8_hours_temp').textContent = Math.round(hourly_tempF_8) + "°";
    document.querySelector('#forecast_9_hours_temp').textContent = Math.round(hourly_tempF_9) + "°";
    document.querySelector('#forecast_10_hours_temp').textContent = Math.round(hourly_tempF_10) + "°";
    document.querySelector('#forecast_11_hours_temp').textContent = Math.round(hourly_tempF_11) + "°";
    document.querySelector('#forecast_12_hours_temp').textContent = Math.round(hourly_tempF_12) + "°";
    document.querySelector('#forecast_13_hours_temp').textContent = Math.round(hourly_tempF_13) + "°";
    document.querySelector('#forecast_14_hours_temp').textContent = Math.round(hourly_tempF_14) + "°";
    document.querySelector('#forecast_15_hours_temp').textContent = Math.round(hourly_tempF_15) + "°";
    document.querySelector('#forecast_16_hours_temp').textContent = Math.round(hourly_tempF_16) + "°";
    document.querySelector('#forecast_17_hours_temp').textContent = Math.round(hourly_tempF_17) + "°";
    document.querySelector('#forecast_18_hours_temp').textContent = Math.round(hourly_tempF_18) + "°";
    document.querySelector('#forecast_19_hours_temp').textContent = Math.round(hourly_tempF_19) + "°";
    document.querySelector('#forecast_20_hours_temp').textContent = Math.round(hourly_tempF_20) + "°";
    document.querySelector('#forecast_21_hours_temp').textContent = Math.round(hourly_tempF_21) + "°";
    document.querySelector('#forecast_22_hours_temp').textContent = Math.round(hourly_tempF_22) + "°";
    document.querySelector('#forecast_23_hours_temp').textContent = Math.round(hourly_tempF_23) + "°";
    document.querySelector('#forecast_24_hours_temp').textContent = Math.round(hourly_tempF_24) + "°";
    document.querySelector('#forecast_25_hours_temp').textContent = Math.round(hourly_tempF_25) + "°";
    document.querySelector('#forecast_26_hours_temp').textContent = Math.round(hourly_tempF_26) + "°";
    document.querySelector('#forecast_27_hours_temp').textContent = Math.round(hourly_tempF_27) + "°";
    document.querySelector('#forecast_28_hours_temp').textContent = Math.round(hourly_tempF_28) + "°";
    document.querySelector('#forecast_29_hours_temp').textContent = Math.round(hourly_tempF_29) + "°";
    document.querySelector('#forecast_30_hours_temp').textContent = Math.round(hourly_tempF_30) + "°";
    document.querySelector('#forecast_31_hours_temp').textContent = Math.round(hourly_tempF_31) + "°";
    document.querySelector('#forecast_32_hours_temp').textContent = Math.round(hourly_tempF_32) + "°";
    document.querySelector('#forecast_33_hours_temp').textContent = Math.round(hourly_tempF_33) + "°";
    document.querySelector('#forecast_34_hours_temp').textContent = Math.round(hourly_tempF_34) + "°";
    document.querySelector('#forecast_35_hours_temp').textContent = Math.round(hourly_tempF_35) + "°";
    document.querySelector('#forecast_36_hours_temp').textContent = Math.round(hourly_tempF_36) + "°";
    document.querySelector('#forecast_37_hours_temp').textContent = Math.round(hourly_tempF_37) + "°";
    document.querySelector('#forecast_38_hours_temp').textContent = Math.round(hourly_tempF_38) + "°";
    document.querySelector('#forecast_39_hours_temp').textContent = Math.round(hourly_tempF_39) + "°";
    document.querySelector('#forecast_40_hours_temp').textContent = Math.round(hourly_tempF_40) + "°";
    document.querySelector('#forecast_41_hours_temp').textContent = Math.round(hourly_tempF_41) + "°";
    document.querySelector('#forecast_42_hours_temp').textContent = Math.round(hourly_tempF_42) + "°";
    document.querySelector('#forecast_43_hours_temp').textContent = Math.round(hourly_tempF_43) + "°";
    document.querySelector('#forecast_44_hours_temp').textContent = Math.round(hourly_tempF_44) + "°";
    document.querySelector('#forecast_45_hours_temp').textContent = Math.round(hourly_tempF_45) + "°";
    document.querySelector('#forecast_46_hours_temp').textContent = Math.round(hourly_tempF_46) + "°";
    document.querySelector('#forecast_47_hours_temp').textContent = Math.round(hourly_tempF_47) + "°";
    document.querySelector('#forecast_48_hours_temp').textContent = Math.round(hourly_tempF_48) + "°";

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
   
  };

  function darkDisplay() {
    document.documentElement.setAttribute('data-theme', 'dark');
    mapStyle = 'mapbox://styles/mapbox/dark-v10';
    weathermapStyle = 'mapbox://styles/mapbox/dark-v10';
    document.getElementById("setting_defualt_theme_d").checked = true;
    document.getElementById("checkbox").checked = true;
    chrome.storage.local.set({'theme': 'dark'});
  };

  function lightDisplay() {
    document.documentElement.setAttribute('data-theme', 'light');
    mapStyle = 'mapbox://styles/mapbox/light-v10';
    weathermapStyle = 'mapbox://styles/mapbox/light-v10';
    document.getElementById("setting_defualt_theme_l").checked = true;
    document.getElementById("checkbox").checked = false;
    chrome.storage.local.set({'theme': 'light'}); 
  };

  function solarFunction12H() {
    document.querySelector("#solar_now_date").textContent = moment.unix(updateTimeBadge + offsetUnix).format('MMMM DD, h:mm A') + ' (LT)';
    document.querySelector("#solar_1_time").textContent = moment.unix(sunriseTimeSolar + offsetUnix).format('h:mm A');
    document.querySelector("#solar_2_time").textContent = moment.unix(sunsetTimeSolar + offsetUnix).format('h:mm A');
    document.querySelector("#solar_3_time").textContent = moment.unix(solarNoon + offsetUnix).format('h:mm A');
    document.querySelector("#solar_4_time").textContent = dayLength;
    document.querySelector("#solar_5_time").textContent = moment.unix(goldenHourEnd + offsetUnix).format('h:mm A');
    document.querySelector("#solar_6_time").textContent = moment.unix(goldenHour + offsetUnix).format('h:mm A');
    document.querySelector("#solar_7_time").textContent = moment.unix(dusk + offsetUnix).format('h:mm A');
    document.querySelector("#solar_8_time").textContent = moment.unix(dawn + offsetUnix).format('h:mm A');
    document.querySelector("#solar_9_time").textContent = moment.unix(nightStarts + offsetUnix).format('h:mm A');
  };

  function solarFunction24H() {
    document.querySelector("#solar_now_date").textContent = moment.unix(updateTimeBadge + offsetUnix).format('MMMM DD, HH:mm') + ' (LT)';
    document.querySelector("#solar_1_time").textContent = moment.unix(sunriseTimeSolar + offsetUnix).format('HH:mm');
    document.querySelector("#solar_2_time").textContent = moment.unix(sunsetTimeSolar + offsetUnix).format('HH:mm');
    document.querySelector("#solar_3_time").textContent = moment.unix(solarNoon + offsetUnix).format('HH:mm');
    document.querySelector("#solar_4_time").textContent = dayLength;
    document.querySelector("#solar_5_time").textContent = moment.unix(goldenHourEnd + offsetUnix).format('HH:mm');
    document.querySelector("#solar_6_time").textContent = moment.unix(goldenHour + offsetUnix).format('HH:mm');
    document.querySelector("#solar_7_time").textContent = moment.unix(dusk + offsetUnix).format('HH:mm');
    document.querySelector("#solar_8_time").textContent = moment.unix(dawn + offsetUnix).format('HH:mm');
    document.querySelector("#solar_9_time").textContent = moment.unix(nightStarts + offsetUnix).format('HH:mm');
  };

  function refresh24h12h() {
    chrome.storage.local.get('TimeFormat', function(dataTime) {
      if(dataTime.TimeFormat == "24h") {
        solarFunction24H();
        document.querySelector("#next7_update_date").textContent = moment.unix(updateTimeBadge + offsetUnix).format('MMM DD, HH:mm') + ' (LT)';
        document.querySelector("#report_update_date").textContent = moment.unix(updateTimeBadge + offsetUnix).format('MMM DD, HH:mm') + ' (LT)';
        document.querySelector("#next48_update_date").textContent = moment.unix(updateTimeBadge + offsetUnix).format('MMM DD, HH:mm') + ' (LT)';
        
        document.querySelector('#forecast_1_hours').textContent = moment.unix(hourly_time_1 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_2_hours').textContent = moment.unix(hourly_time_2 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_3_hours').textContent = moment.unix(hourly_time_3 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_4_hours').textContent = moment.unix(hourly_time_4 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_5_hours').textContent = moment.unix(hourly_time_5 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_6_hours').textContent = moment.unix(hourly_time_6 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_7_hours').textContent = moment.unix(hourly_time_7 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_8_hours').textContent = moment.unix(hourly_time_8 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_9_hours').textContent = moment.unix(hourly_time_9 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_10_hours').textContent = moment.unix(hourly_time_10 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_11_hours').textContent = moment.unix(hourly_time_11 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_12_hours').textContent = moment.unix(hourly_time_12 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_13_hours').textContent = moment.unix(hourly_time_13 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_14_hours').textContent = moment.unix(hourly_time_14 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_15_hours').textContent = moment.unix(hourly_time_15 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_16_hours').textContent = moment.unix(hourly_time_16 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_17_hours').textContent = moment.unix(hourly_time_17 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_18_hours').textContent = moment.unix(hourly_time_18 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_19_hours').textContent = moment.unix(hourly_time_19 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_20_hours').textContent = moment.unix(hourly_time_20 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_21_hours').textContent = moment.unix(hourly_time_21 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_22_hours').textContent = moment.unix(hourly_time_22 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_23_hours').textContent = moment.unix(hourly_time_23 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_24_hours').textContent = moment.unix(hourly_time_24 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_25_hours').textContent = moment.unix(hourly_time_25 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_26_hours').textContent = moment.unix(hourly_time_26 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_27_hours').textContent = moment.unix(hourly_time_27 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_28_hours').textContent = moment.unix(hourly_time_28 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_29_hours').textContent = moment.unix(hourly_time_29 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_30_hours').textContent = moment.unix(hourly_time_30 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_31_hours').textContent = moment.unix(hourly_time_31 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_32_hours').textContent = moment.unix(hourly_time_32 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_33_hours').textContent = moment.unix(hourly_time_33 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_34_hours').textContent = moment.unix(hourly_time_34 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_35_hours').textContent = moment.unix(hourly_time_35 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_36_hours').textContent = moment.unix(hourly_time_36 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_37_hours').textContent = moment.unix(hourly_time_37 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_38_hours').textContent = moment.unix(hourly_time_38 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_39_hours').textContent = moment.unix(hourly_time_39 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_40_hours').textContent = moment.unix(hourly_time_40 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_41_hours').textContent = moment.unix(hourly_time_41 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_42_hours').textContent = moment.unix(hourly_time_42 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_43_hours').textContent = moment.unix(hourly_time_43 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_44_hours').textContent = moment.unix(hourly_time_44 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_45_hours').textContent = moment.unix(hourly_time_45 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_46_hours').textContent = moment.unix(hourly_time_46 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_47_hours').textContent = moment.unix(hourly_time_47 + offsetUnix).format('HH')+':00';
        document.querySelector('#forecast_48_hours').textContent = moment.unix(hourly_time_48 + offsetUnix).format('HH')+':00';

        document.querySelector("#map_popup_title").textContent = 'PRECIPITATION FORECAST | UV WEATHER | ' + moment.unix(updateTimeBadge + offsetUnix).format('MMMM DD, YYYY HH:mm') + ' (LT)';  
        document.getElementById("setting_defualt_button_24h").checked = true;
        document.getElementById("setting_defualt_button_12h").checked = false;
        document.getElementById("setting_defualt_button_24h").disabled = true;
        document.getElementById("setting_defualt_button_12h").disabled = false;
      } 
      else {
        solarFunction12H();
        document.querySelector("#next7_update_date").textContent = moment.unix(updateTimeBadge + offsetUnix).format('MMM DD, h:mm A') + ' (LT)';
        document.querySelector("#report_update_date").textContent = moment.unix(updateTimeBadge + offsetUnix).format('MMM DD, h:mm A') + ' (LT)';
        document.querySelector("#next48_update_date").textContent = moment.unix(updateTimeBadge + offsetUnix).format('MMM DD, h:mm A') + ' (LT)';

        document.querySelector('#forecast_1_hours').textContent = moment.unix(hourly_time_1 + offsetUnix).format('h A');
        document.querySelector('#forecast_2_hours').textContent = moment.unix(hourly_time_2 + offsetUnix).format('h A');
        document.querySelector('#forecast_3_hours').textContent = moment.unix(hourly_time_3 + offsetUnix).format('h A');
        document.querySelector('#forecast_4_hours').textContent = moment.unix(hourly_time_4 + offsetUnix).format('h A');
        document.querySelector('#forecast_5_hours').textContent = moment.unix(hourly_time_5 + offsetUnix).format('h A');
        document.querySelector('#forecast_6_hours').textContent = moment.unix(hourly_time_6 + offsetUnix).format('h A');
        document.querySelector('#forecast_7_hours').textContent = moment.unix(hourly_time_7 + offsetUnix).format('h A');
        document.querySelector('#forecast_8_hours').textContent = moment.unix(hourly_time_8 + offsetUnix).format('h A');
        document.querySelector('#forecast_9_hours').textContent = moment.unix(hourly_time_9 + offsetUnix).format('h A');
        document.querySelector('#forecast_10_hours').textContent = moment.unix(hourly_time_10 + offsetUnix).format('h A');
        document.querySelector('#forecast_11_hours').textContent = moment.unix(hourly_time_11 + offsetUnix).format('h A');
        document.querySelector('#forecast_12_hours').textContent = moment.unix(hourly_time_12 + offsetUnix).format('h A');
        document.querySelector('#forecast_13_hours').textContent = moment.unix(hourly_time_13 + offsetUnix).format('h A');
        document.querySelector('#forecast_14_hours').textContent = moment.unix(hourly_time_14 + offsetUnix).format('h A');
        document.querySelector('#forecast_15_hours').textContent = moment.unix(hourly_time_15 + offsetUnix).format('h A');
        document.querySelector('#forecast_16_hours').textContent = moment.unix(hourly_time_16 + offsetUnix).format('h A');
        document.querySelector('#forecast_17_hours').textContent = moment.unix(hourly_time_17 + offsetUnix).format('h A');
        document.querySelector('#forecast_18_hours').textContent = moment.unix(hourly_time_18 + offsetUnix).format('h A');
        document.querySelector('#forecast_19_hours').textContent = moment.unix(hourly_time_19 + offsetUnix).format('h A');
        document.querySelector('#forecast_20_hours').textContent = moment.unix(hourly_time_20 + offsetUnix).format('h A');
        document.querySelector('#forecast_21_hours').textContent = moment.unix(hourly_time_21 + offsetUnix).format('h A');
        document.querySelector('#forecast_22_hours').textContent = moment.unix(hourly_time_22 + offsetUnix).format('h A');
        document.querySelector('#forecast_23_hours').textContent = moment.unix(hourly_time_23 + offsetUnix).format('h A');
        document.querySelector('#forecast_24_hours').textContent = moment.unix(hourly_time_24 + offsetUnix).format('h A');
        document.querySelector('#forecast_25_hours').textContent = moment.unix(hourly_time_25 + offsetUnix).format('h A');
        document.querySelector('#forecast_26_hours').textContent = moment.unix(hourly_time_26 + offsetUnix).format('h A');
        document.querySelector('#forecast_27_hours').textContent = moment.unix(hourly_time_27 + offsetUnix).format('h A');
        document.querySelector('#forecast_28_hours').textContent = moment.unix(hourly_time_28 + offsetUnix).format('h A');
        document.querySelector('#forecast_29_hours').textContent = moment.unix(hourly_time_29 + offsetUnix).format('h A');
        document.querySelector('#forecast_30_hours').textContent = moment.unix(hourly_time_30 + offsetUnix).format('h A');
        document.querySelector('#forecast_31_hours').textContent = moment.unix(hourly_time_31 + offsetUnix).format('h A');
        document.querySelector('#forecast_32_hours').textContent = moment.unix(hourly_time_32 + offsetUnix).format('h A');
        document.querySelector('#forecast_33_hours').textContent = moment.unix(hourly_time_33 + offsetUnix).format('h A');
        document.querySelector('#forecast_34_hours').textContent = moment.unix(hourly_time_34 + offsetUnix).format('h A');
        document.querySelector('#forecast_35_hours').textContent = moment.unix(hourly_time_35 + offsetUnix).format('h A');
        document.querySelector('#forecast_36_hours').textContent = moment.unix(hourly_time_36 + offsetUnix).format('h A');
        document.querySelector('#forecast_37_hours').textContent = moment.unix(hourly_time_37 + offsetUnix).format('h A');
        document.querySelector('#forecast_38_hours').textContent = moment.unix(hourly_time_38 + offsetUnix).format('h A');
        document.querySelector('#forecast_39_hours').textContent = moment.unix(hourly_time_39 + offsetUnix).format('h A');
        document.querySelector('#forecast_40_hours').textContent = moment.unix(hourly_time_40 + offsetUnix).format('h A');
        document.querySelector('#forecast_41_hours').textContent = moment.unix(hourly_time_41 + offsetUnix).format('h A');
        document.querySelector('#forecast_42_hours').textContent = moment.unix(hourly_time_42 + offsetUnix).format('h A');
        document.querySelector('#forecast_43_hours').textContent = moment.unix(hourly_time_43 + offsetUnix).format('h A');
        document.querySelector('#forecast_44_hours').textContent = moment.unix(hourly_time_44 + offsetUnix).format('h A');
        document.querySelector('#forecast_45_hours').textContent = moment.unix(hourly_time_45 + offsetUnix).format('h A');
        document.querySelector('#forecast_46_hours').textContent = moment.unix(hourly_time_46 + offsetUnix).format('h A');
        document.querySelector('#forecast_47_hours').textContent = moment.unix(hourly_time_47 + offsetUnix).format('h A');
        document.querySelector('#forecast_48_hours').textContent = moment.unix(hourly_time_48 + offsetUnix).format('h A');

        document.querySelector("#map_popup_title").textContent = 'PRECIPITATION FORECAST | UV WEATHER | ' + moment.unix(updateTimeBadge + offsetUnix).format('MMMM DD, YYYY h:mm A') + ' (LT)';
        document.getElementById("setting_defualt_button_12h").checked = true;
        document.getElementById("setting_defualt_button_24h").checked = false;
        document.getElementById("setting_defualt_button_12h").disabled = true;
        document.getElementById("setting_defualt_button_24h").disabled = false;
      }

        document.querySelector('#forecast_1_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_1) * uv_adj_daily(hourly_icon_1, hourly_cloudCover_1));
        document.querySelector('#forecast_1_hours_rain').textContent = Math.round(((hourly_precipProbability_1) * 100)/5)*5 + "%";

        document.querySelector('#forecast_2_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_2) * uv_adj_daily(hourly_icon_2, hourly_cloudCover_2));
        document.querySelector('#forecast_2_hours_rain').textContent = Math.round(((hourly_precipProbability_2) * 100)/5)*5 + "%";

        document.querySelector('#forecast_3_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_3) * uv_adj_daily(hourly_icon_3, hourly_cloudCover_3));
        document.querySelector('#forecast_3_hours_rain').textContent = Math.round(((hourly_precipProbability_3) * 100)/5)*5 + "%";

        document.querySelector('#forecast_4_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_4) * uv_adj_daily(hourly_icon_4, hourly_cloudCover_4));
        document.querySelector('#forecast_4_hours_rain').textContent = Math.round(((hourly_precipProbability_4) * 100)/5)*5 + "%";

        document.querySelector('#forecast_5_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_5) * uv_adj_daily(hourly_icon_5, hourly_cloudCover_5));
        document.querySelector('#forecast_5_hours_rain').textContent = Math.round(((hourly_precipProbability_5) * 100)/5)*5 + "%";

        document.querySelector('#forecast_6_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_6) * uv_adj_daily(hourly_icon_6, hourly_cloudCover_6));
        document.querySelector('#forecast_6_hours_rain').textContent = Math.round(((hourly_precipProbability_6) * 100)/5)*5 + "%";

        document.querySelector('#forecast_7_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_7) * uv_adj_daily(hourly_icon_7, hourly_cloudCover_7));
        document.querySelector('#forecast_7_hours_rain').textContent = Math.round(((hourly_precipProbability_7) * 100)/5)*5 + "%";

        document.querySelector('#forecast_8_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_8) * uv_adj_daily(hourly_icon_8, hourly_cloudCover_8));
        document.querySelector('#forecast_8_hours_rain').textContent = Math.round(((hourly_precipProbability_8) * 100)/5)*5 + "%";

        document.querySelector('#forecast_9_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_9) * uv_adj_daily(hourly_icon_9, hourly_cloudCover_9));
        document.querySelector('#forecast_9_hours_rain').textContent = Math.round(((hourly_precipProbability_9) * 100)/5)*5 + "%";

        document.querySelector('#forecast_10_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_10) * uv_adj_daily(hourly_icon_10, hourly_cloudCover_10));
        document.querySelector('#forecast_10_hours_rain').textContent = Math.round(((hourly_precipProbability_10) * 100)/5)*5 + "%";

        document.querySelector('#forecast_11_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_11) * uv_adj_daily(hourly_icon_11, hourly_cloudCover_11));
        document.querySelector('#forecast_11_hours_rain').textContent = Math.round(((hourly_precipProbability_11) * 100)/5)*5 + "%";

        document.querySelector('#forecast_12_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_12) * uv_adj_daily(hourly_icon_12, hourly_cloudCover_12));
        document.querySelector('#forecast_12_hours_rain').textContent = Math.round(((hourly_precipProbability_12) * 100)/5)*5 + "%";

        document.querySelector('#forecast_13_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_13) * uv_adj_daily(hourly_icon_13, hourly_cloudCover_13));
        document.querySelector('#forecast_13_hours_rain').textContent = Math.round(((hourly_precipProbability_13) * 100)/5)*5 + "%";

        document.querySelector('#forecast_14_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_14) * uv_adj_daily(hourly_icon_14, hourly_cloudCover_14));
        document.querySelector('#forecast_14_hours_rain').textContent = Math.round(((hourly_precipProbability_14) * 100)/5)*5 + "%";

        document.querySelector('#forecast_15_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_15) * uv_adj_daily(hourly_icon_15, hourly_cloudCover_15));
        document.querySelector('#forecast_15_hours_rain').textContent = Math.round(((hourly_precipProbability_15) * 100)/5)*5 + "%";

        document.querySelector('#forecast_16_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_16) * uv_adj_daily(hourly_icon_16, hourly_cloudCover_16));
        document.querySelector('#forecast_16_hours_rain').textContent = Math.round(((hourly_precipProbability_16) * 100)/5)*5 + "%";

        document.querySelector('#forecast_17_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_17) * uv_adj_daily(hourly_icon_17, hourly_cloudCover_17));
        document.querySelector('#forecast_17_hours_rain').textContent = Math.round(((hourly_precipProbability_17) * 100)/5)*5 + "%";

        document.querySelector('#forecast_18_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_18) * uv_adj_daily(hourly_icon_18, hourly_cloudCover_18));
        document.querySelector('#forecast_18_hours_rain').textContent = Math.round(((hourly_precipProbability_18) * 100)/5)*5 + "%";

        document.querySelector('#forecast_19_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_19) * uv_adj_daily(hourly_icon_19, hourly_cloudCover_19));
        document.querySelector('#forecast_19_hours_rain').textContent = Math.round(((hourly_precipProbability_19) * 100)/5)*5 + "%";

        document.querySelector('#forecast_20_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_20) * uv_adj_daily(hourly_icon_20, hourly_cloudCover_20));
        document.querySelector('#forecast_20_hours_rain').textContent = Math.round(((hourly_precipProbability_20) * 100)/5)*5 + "%";

        document.querySelector('#forecast_21_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_21) * uv_adj_daily(hourly_icon_21, hourly_cloudCover_21));
        document.querySelector('#forecast_21_hours_rain').textContent = Math.round(((hourly_precipProbability_21) * 100)/5)*5 + "%";

        document.querySelector('#forecast_22_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_22) * uv_adj_daily(hourly_icon_22, hourly_cloudCover_22));
        document.querySelector('#forecast_22_hours_rain').textContent = Math.round(((hourly_precipProbability_22) * 100)/5)*5 + "%";

        document.querySelector('#forecast_23_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_23) * uv_adj_daily(hourly_icon_23, hourly_cloudCover_23));
        document.querySelector('#forecast_23_hours_rain').textContent = Math.round(((hourly_precipProbability_23) * 100)/5)*5 + "%";

        document.querySelector('#forecast_24_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_24) * uv_adj_daily(hourly_icon_24, hourly_cloudCover_24));
        document.querySelector('#forecast_24_hours_rain').textContent = Math.round(((hourly_precipProbability_24) * 100)/5)*5 + "%";

        document.querySelector('#forecast_25_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_25) * uv_adj_daily(hourly_icon_25, hourly_cloudCover_25));
        document.querySelector('#forecast_25_hours_rain').textContent = Math.round(((hourly_precipProbability_25) * 100)/5)*5 + "%";

        document.querySelector('#forecast_26_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_26) * uv_adj_daily(hourly_icon_26, hourly_cloudCover_26));
        document.querySelector('#forecast_26_hours_rain').textContent = Math.round(((hourly_precipProbability_26) * 100)/5)*5 + "%";

        document.querySelector('#forecast_27_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_27) * uv_adj_daily(hourly_icon_27, hourly_cloudCover_27));
        document.querySelector('#forecast_27_hours_rain').textContent = Math.round(((hourly_precipProbability_27) * 100)/5)*5 + "%";

        document.querySelector('#forecast_28_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_28) * uv_adj_daily(hourly_icon_28, hourly_cloudCover_28));
        document.querySelector('#forecast_28_hours_rain').textContent = Math.round(((hourly_precipProbability_28) * 100)/5)*5 + "%";

        document.querySelector('#forecast_29_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_29) * uv_adj_daily(hourly_icon_29, hourly_cloudCover_29));
        document.querySelector('#forecast_29_hours_rain').textContent = Math.round(((hourly_precipProbability_29) * 100)/5)*5 + "%";

        document.querySelector('#forecast_30_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_30) * uv_adj_daily(hourly_icon_30, hourly_cloudCover_30));
        document.querySelector('#forecast_30_hours_rain').textContent = Math.round(((hourly_precipProbability_30) * 100)/5)*5 + "%";

        document.querySelector('#forecast_31_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_31) * uv_adj_daily(hourly_icon_31, hourly_cloudCover_31));
        document.querySelector('#forecast_31_hours_rain').textContent = Math.round(((hourly_precipProbability_31) * 100)/5)*5 + "%";

        document.querySelector('#forecast_32_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_32) * uv_adj_daily(hourly_icon_32, hourly_cloudCover_32));
        document.querySelector('#forecast_32_hours_rain').textContent = Math.round(((hourly_precipProbability_32) * 100)/5)*5 + "%";

        document.querySelector('#forecast_33_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_33) * uv_adj_daily(hourly_icon_33, hourly_cloudCover_33));
        document.querySelector('#forecast_33_hours_rain').textContent = Math.round(((hourly_precipProbability_33) * 100)/5)*5 + "%";

        document.querySelector('#forecast_34_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_34) * uv_adj_daily(hourly_icon_34, hourly_cloudCover_34));
        document.querySelector('#forecast_34_hours_rain').textContent = Math.round(((hourly_precipProbability_34) * 100)/5)*5 + "%";

        document.querySelector('#forecast_35_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_35) * uv_adj_daily(hourly_icon_35, hourly_cloudCover_35));
        document.querySelector('#forecast_35_hours_rain').textContent = Math.round(((hourly_precipProbability_35) * 100)/5)*5 + "%";

        document.querySelector('#forecast_36_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_36) * uv_adj_daily(hourly_icon_36, hourly_cloudCover_36));
        document.querySelector('#forecast_36_hours_rain').textContent = Math.round(((hourly_precipProbability_36) * 100)/5)*5 + "%";

        document.querySelector('#forecast_37_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_37) * uv_adj_daily(hourly_icon_37, hourly_cloudCover_37));
        document.querySelector('#forecast_37_hours_rain').textContent = Math.round(((hourly_precipProbability_37) * 100)/5)*5 + "%";

        document.querySelector('#forecast_38_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_38) * uv_adj_daily(hourly_icon_38, hourly_cloudCover_38));
        document.querySelector('#forecast_38_hours_rain').textContent = Math.round(((hourly_precipProbability_38) * 100)/5)*5 + "%";

        document.querySelector('#forecast_39_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_39) * uv_adj_daily(hourly_icon_39, hourly_cloudCover_39));
        document.querySelector('#forecast_39_hours_rain').textContent = Math.round(((hourly_precipProbability_39) * 100)/5)*5 + "%";

        document.querySelector('#forecast_40_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_40) * uv_adj_daily(hourly_icon_40, hourly_cloudCover_40));
        document.querySelector('#forecast_40_hours_rain').textContent = Math.round(((hourly_precipProbability_40) * 100)/5)*5 + "%";

        document.querySelector('#forecast_41_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_41) * uv_adj_daily(hourly_icon_41, hourly_cloudCover_41));
        document.querySelector('#forecast_41_hours_rain').textContent = Math.round(((hourly_precipProbability_41) * 100)/5)*5 + "%";

        document.querySelector('#forecast_42_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_42) * uv_adj_daily(hourly_icon_42, hourly_cloudCover_42));
        document.querySelector('#forecast_42_hours_rain').textContent = Math.round(((hourly_precipProbability_42) * 100)/5)*5 + "%";

        document.querySelector('#forecast_43_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_43) * uv_adj_daily(hourly_icon_43, hourly_cloudCover_43));
        document.querySelector('#forecast_43_hours_rain').textContent = Math.round(((hourly_precipProbability_43) * 100)/5)*5 + "%";

        document.querySelector('#forecast_44_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_44) * uv_adj_daily(hourly_icon_44, hourly_cloudCover_44));
        document.querySelector('#forecast_44_hours_rain').textContent = Math.round(((hourly_precipProbability_44) * 100)/5)*5 + "%";

        document.querySelector('#forecast_45_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_45) * uv_adj_daily(hourly_icon_45, hourly_cloudCover_45));
        document.querySelector('#forecast_45_hours_rain').textContent = Math.round(((hourly_precipProbability_45) * 100)/5)*5 + "%";

        document.querySelector('#forecast_46_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_46) * uv_adj_daily(hourly_icon_46, hourly_cloudCover_46));
        document.querySelector('#forecast_46_hours_rain').textContent = Math.round(((hourly_precipProbability_46) * 100)/5)*5 + "%";

        document.querySelector('#forecast_47_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_47) * uv_adj_daily(hourly_icon_47, hourly_cloudCover_47));
        document.querySelector('#forecast_47_hours_rain').textContent = Math.round(((hourly_precipProbability_47) * 100)/5)*5 + "%";

        document.querySelector('#forecast_48_hours_uv').textContent = "UVI " + Math.round((hourly_uvIndex_48) * uv_adj_daily(hourly_icon_48, hourly_cloudCover_48));
        document.querySelector('#forecast_48_hours_rain').textContent = Math.round(((hourly_precipProbability_48) * 100)/5)*5 + "%";
    });
  };


  function windFunctionMPH() {
    document.querySelector("#current_report_wind").textContent = windSpeedMPH + " mph";
    document.querySelector("#current_report_windGust").textContent = windGustMPH + " mph"; 
    document.querySelector("#current_report_windGust").textContent = windGustMPH + " mph"; 
    
    document.querySelector('#forecast_10_wind').textContent = Math.round(daily_wind_1);
    document.querySelector('#forecast_10_wind_unit').textContent = 'mph';
    document.querySelector('#forecast_20_wind').textContent = Math.round(daily_wind_2);
    document.querySelector('#forecast_20_wind_unit').textContent = 'mph';
    document.querySelector('#forecast_30_wind').textContent = Math.round(daily_wind_3);
    document.querySelector('#forecast_30_wind_unit').textContent = 'mph';
    document.querySelector('#forecast_40_wind').textContent = Math.round(daily_wind_4);
    document.querySelector('#forecast_40_wind_unit').textContent = 'mph';
    document.querySelector('#forecast_50_wind').textContent = Math.round(daily_wind_5);
    document.querySelector('#forecast_50_wind_unit').textContent = 'mph';
    document.querySelector('#forecast_60_wind').textContent = Math.round(daily_wind_6);
    document.querySelector('#forecast_60_wind_unit').textContent = 'mph';
    document.querySelector('#forecast_70_wind').textContent = Math.round(daily_wind_7);
    document.querySelector('#forecast_70_wind_unit').textContent = 'mph';
  };

  function windFunctionKMH() {
    document.querySelector("#current_report_wind").textContent = windSpeedKMH + " km/h";
    document.querySelector("#current_report_windGust").textContent = windGustKMH + " km/h"; 
    document.querySelector("#current_report_windGust").textContent = windGustKMH + " km/h"; 

    document.querySelector('#forecast_10_wind').textContent = Math.round((daily_wind_1) * 1.609334);
    document.querySelector('#forecast_10_wind_unit').textContent = 'km/h';
    document.querySelector('#forecast_20_wind').textContent = Math.round((daily_wind_2) * 1.609334);
    document.querySelector('#forecast_20_wind_unit').textContent = 'km/h';
    document.querySelector('#forecast_30_wind').textContent = Math.round((daily_wind_3) * 1.609334);
    document.querySelector('#forecast_30_wind_unit').textContent = 'km/h';
    document.querySelector('#forecast_40_wind').textContent = Math.round((daily_wind_4) * 1.609334);
    document.querySelector('#forecast_40_wind_unit').textContent = 'km/h';
    document.querySelector('#forecast_50_wind').textContent = Math.round((daily_wind_5) * 1.609334);
    document.querySelector('#forecast_50_wind_unit').textContent = 'km/h';
    document.querySelector('#forecast_60_wind').textContent = Math.round((daily_wind_6) * 1.609334);
    document.querySelector('#forecast_60_wind_unit').textContent = 'km/h';
    document.querySelector('#forecast_70_wind').textContent = Math.round((daily_wind_7) * 1.609334);
    document.querySelector('#forecast_70_wind_unit').textContent = 'km/h';
  };

  function windFunctionMS() {
    document.querySelector("#current_report_wind").textContent = windSpeedMS10R + " m/s";
    document.querySelector("#current_report_windGust").textContent = windSpeedMS10R + " m/s"; 
    document.querySelector("#current_report_windGust").textContent = windSpeedMS10R + " m/s"; 
    
    document.querySelector('#forecast_10_wind').textContent = Math.round((daily_wind_1) * 0.4470389);
    document.querySelector('#forecast_10_wind_unit').textContent = 'm/s';
    document.querySelector('#forecast_20_wind').textContent = Math.round((daily_wind_2) * 0.4470389);
    document.querySelector('#forecast_20_wind_unit').textContent = 'm/s';
    document.querySelector('#forecast_30_wind').textContent = Math.round((daily_wind_3) * 0.4470389);
    document.querySelector('#forecast_30_wind_unit').textContent = 'm/s';
    document.querySelector('#forecast_40_wind').textContent = Math.round((daily_wind_4) * 0.4470389);
    document.querySelector('#forecast_40_wind_unit').textContent = 'm/s';
    document.querySelector('#forecast_50_wind').textContent = Math.round((daily_wind_5) * 0.4470389);
    document.querySelector('#forecast_50_wind_unit').textContent = 'm/s';
    document.querySelector('#forecast_60_wind').textContent = Math.round((daily_wind_6) * 0.4470389);
    document.querySelector('#forecast_60_wind_unit').textContent = 'm/s';
    document.querySelector('#forecast_70_wind').textContent = Math.round((daily_wind_7) * 0.4470389);
    document.querySelector('#forecast_70_wind_unit').textContent = 'm/s';
  };

function refreshWindSpeedUnit() {
    chrome.storage.local.get('windUnit', function(dataWind) {
      if(dataWind.windUnit == "mph") {
        windFunctionMPH();
      }
      else if(dataWind.windUnit == "kmh") {
        windFunctionKMH();
      }
      else if(dataWind.windUnit == "ms") {
        windFunctionMS();
      }      
    });
  };


  function next48Function() {
    var i;
    for(i = 1; i < 49; i++) {
      forecast_hours_icon = resultDS.hourly.data[i].icon;
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
    document.querySelector('#forecast_1_day').textContent = moment.unix(daily_date_1).format('dddd');
    document.querySelector('#forecast_2_day').textContent = moment.unix(daily_date_2).format('dddd');

    document.querySelector('#forecast_10_day').textContent = moment.unix(daily_date_1).format('ddd');
    document.querySelector('#forecast_10_uv').textContent = "UVI " + (Math.round ((daily_uvIndex_1) * uv_adj_daily(daily_icon_1)));
    document.querySelector('#forecast_10_wind_arrow').style.transform = 'rotate(' + daily_windBearing_1 + 'deg)';        

    document.querySelector('#forecast_20_day').textContent = moment.unix(daily_date_2).format('ddd');
    document.querySelector('#forecast_20_uv').textContent = "UVI " + (Math.round ((daily_uvIndex_2) * uv_adj_daily(daily_icon_2)));
    document.querySelector('#forecast_20_wind_arrow').style.transform = 'rotate(' + daily_windBearing_2 + 'deg)';  

    document.querySelector('#forecast_30_day').textContent = moment.unix(daily_date_3).format('ddd');
    document.querySelector('#forecast_30_uv').textContent = "UVI " + (Math.round ((daily_uvIndex_3) * uv_adj_daily(daily_icon_3)));
    document.querySelector('#forecast_30_wind_arrow').style.transform = 'rotate(' + daily_windBearing_3 + 'deg)';  

    document.querySelector('#forecast_40_day').textContent = moment.unix(daily_date_4).format('ddd');
    document.querySelector('#forecast_40_uv').textContent = "UVI " + (Math.round ((daily_uvIndex_4) * uv_adj_daily(daily_icon_4)));
    document.querySelector('#forecast_40_wind_arrow').style.transform = 'rotate(' + daily_windBearing_4 + 'deg)';  

    document.querySelector('#forecast_50_day').textContent = moment.unix(daily_date_5).format('ddd');
    document.querySelector('#forecast_50_uv').textContent = "UVI " + (Math.round ((daily_uvIndex_5) * uv_adj_daily(daily_icon_5)));
    document.querySelector('#forecast_50_wind_arrow').style.transform = 'rotate(' + daily_windBearing_5 + 'deg)';  

    document.querySelector('#forecast_60_day').textContent = moment.unix(daily_date_6).format('ddd');
    document.querySelector('#forecast_60_uv').textContent = "UVI " + (Math.round ((daily_uvIndex_6) * uv_adj_daily(daily_icon_6)));
    document.querySelector('#forecast_60_wind_arrow').style.transform = 'rotate(' + daily_windBearing_6 + 'deg)';  

    document.querySelector('#forecast_70_day').textContent = moment.unix(daily_date_7).format('ddd');
    document.querySelector('#forecast_70_uv').textContent = "UVI " + (Math.round ((daily_uvIndex_7) * uv_adj_daily(daily_icon_7)));
    document.querySelector('#forecast_70_wind_arrow').style.transform = 'rotate(' + daily_windBearing_7 + 'deg)';  

    var i;
    for(i = 1; i < 8; i++) {
      forecast_icon = resultDS.daily.data[i].icon; 
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
    document.querySelector("#title_report_text").textContent = citys.slice(0,30);
    document.querySelector("#current_report_summary").textContent = summaryMinutely;
    document.querySelector("#current_report_uv").textContent = uv1 + " " + uv_note(uv1); 
    document.querySelector("#current_report_windBearing").textContent = windBearing + "° (" + windCompass + ")";
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

    chrome.storage.local.get(['setSettingFC', 'setSettingUT', 'whiteIcon', 'badgeSize', 'TimeFormat'], function(data) {
    setSettingFC = data.setSettingFC;
    setSettingUT = data.setSettingUT;
    currentWhiteIcon = data.whiteIcon;
    currentBadgeSize = data.badgeSize;
    TimeFormat = data.TimeFormat;
    if(currentWhiteIcon == 0 || (typeof currentWhiteIcon == 'undefined') || currentWhiteIcon == 'undefined') {
      currentWhiteIcon = 0;
    } else{
      currentWhiteIcon = 1;
    }
      if(setSettingUT == "t" && setSettingFC == "c") {
            if(currentBadgeSize == 1) {
              setTimeout(function() {
                largBadgeNumber(temperatureCbadge, currentWhiteIcon)
              }, 550);
            }
            else {
              badgeBackgroundColor(currentWhiteIcon);
              setTimeout(function() {
                chrome.browserAction.setBadgeText({"text":temperatureCbadge +"°C" });              
                badgeBackgroundImage();
              }, 550);
            }
      }

      else if(setSettingUT == "t" && setSettingFC == "f") {
          if(currentBadgeSize == 1) {
            setTimeout(function() {
              largBadgeNumber(temperatureFbadge, currentWhiteIcon)
            }, 550);
          }
          else {
            badgeBackgroundColor(currentWhiteIcon);
            setTimeout(function() {
              chrome.browserAction.setBadgeText({"text":temperatureFbadge +"°F" });
              badgeBackgroundImage();
            }, 550);
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
                    badgeBackgroundColor(currentWhiteIcon);
                    setTimeout(function() {
                      chrome.browserAction.setBadgeText({"text": "UV"+ uv1});
                      badgeBackgroundImage();
                    }, 550);
                  }
        }
        else {
                  if(currentBadgeSize == 1) {
                    setTimeout(function() {
                      largBadgeNumber(uv1, currentWhiteIcon)
                    }, 550);
                  }
                  else{
                    badgeBackgroundColor(currentWhiteIcon);
                    setTimeout(function() {
                      chrome.browserAction.setBadgeText({"text": "UV "+ uv1});                    
                      badgeBackgroundImage();
                    }, 550);
                  }
        } 
      }

        if(TimeFormat == "24h") {
          updateTimeRelativeBadge = moment.unix(updateTimeBadge).format('HH:mm');
        }
        else{
          updateTimeRelativeBadge = moment.unix(updateTimeBadge).format('h:mm A');
        }
        
        if(setSettingUT == "u") {
          toolTipBadge = uv1 + " UVI " + uv_note(uv1) + " - " + citys + "\n" + "Updated at " + updateTimeRelativeBadge;
          chrome.browserAction.setTitle({title: toolTipBadge});
          }
        else if(setSettingUT == "t" && setSettingFC == "f") {
          toolTipBadge = temperatureFbadge + "° " + capitalize(summaryBadge) + " - " + citys  + "\n" + "Updated at " + updateTimeRelativeBadge;
          chrome.browserAction.setTitle({title: toolTipBadge});
          }
        else if(setSettingUT == "t" && setSettingFC == "c") {
          toolTipBadge = temperatureCbadge + "° " + capitalize(summaryBadge) + " - " + citys + "\n"  + "Updated at " + updateTimeRelativeBadge;
          chrome.browserAction.setTitle({title: toolTipBadge});
          };            
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
      if(document.querySelector('.toastify-top') !== null) {
        locationToast.hideToast();
      }
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

  function delayButtonBadgeSize() {
      setTimeout(function() {
      document.getElementById("checkbox_largIcon").disabled = false;
    }, 1500);
  };

  function delayButtonIntervalUpdate() {
      setTimeout(function() {
         document.querySelector("#setting_defualt_button_15_all").style.pointerEvents = "auto";       
        document.querySelector("#setting_defualt_button_30_all").style.pointerEvents = "auto";
        document.querySelector("#setting_defualt_button_60_all").style.pointerEvents = "auto";
        document.querySelector("#setting_defualt_button_90_all").style.pointerEvents = "auto";
        document.querySelector("#setting_defualt_button_120_all").style.pointerEvents = "auto";
    }, 750);
  };

  function delayReleaseButtonSetting() {
      setTimeout(function() {
      document.getElementById("setting_defualt_button_c_all").style.pointerEvents = "auto";
      document.getElementById("setting_defualt_button_f_all").style.pointerEvents = "auto";
      document.getElementById("setting_defualt_button_u_all").style.pointerEvents = "auto";
      document.getElementById("setting_defualt_button_t_all").style.pointerEvents = "auto";
      document.getElementById("setting_defualt_button_12h_all").style.pointerEvents = "auto";
      document.getElementById("setting_defualt_button_24h_all").style.pointerEvents = "auto";
      document.querySelector(".setting_section_badge_size_Class").style.pointerEvents = "auto";
      document.getElementById("setting_defualt_button_mph_all").style.pointerEvents = "auto";
      document.getElementById("setting_defualt_button_kmh_all").style.pointerEvents = "auto";
      document.getElementById("setting_defualt_button_ms_all").style.pointerEvents = "auto";

    }, 1500);
  };

  function delayButtonSetting() {
      document.getElementById("setting_defualt_button_c_all").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_f_all").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_u_all").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_t_all").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_12h_all").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_24h_all").style.pointerEvents = "none";
      document.querySelector(".setting_section_badge_size_Class").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_mph_all").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_kmh_all").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_ms_all").style.pointerEvents = "none";      
  };


/// Click event ------------------------------------------------------------------------------

  document.querySelector(".sidebarIconToggle").addEventListener("click", (e) => {
      if(document.querySelector('.toastify-top') !== null) {
        locationToast.hideToast();
      }
  });

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
      delayButtonSetting();
      updateBadge();       
      document.getElementById("setting_defualt_button_u").checked = true;
      document.getElementById("setting_defualt_button_t").checked = false;

      document.querySelector(".setting_defualt_button_30_sub_label").style.opacity = ".3";
      document.querySelector(".setting_defualt_button_15_sub_label").style.opacity = ".3";
      document.querySelector(".setting_defualt_button_30_sub").style.opacity = ".3";
      document.querySelector(".setting_defualt_button_15_sub").style.opacity = ".3";
      document.querySelector(".tooltip-bottom-interval-display-15").style.display = "none";
      document.querySelector(".tooltip-bottom-interval-display-30").style.display = "none";

      chrome.storage.local.set({'IntervalUpdate': '60'});
      chrome.runtime.sendMessage({ msg: "intervalUpdateMessage" });
      document.getElementById("setting_defualt_button_60").checked = true;

      delayReleaseButtonSetting();  
  });
  
  document.querySelector("#setting_defualt_button_t_all").addEventListener("click", (e) => { 
      setSettingUT = "t";
      chrome.storage.local.set({'setSettingUT': 't'});
      delayButtonSetting();
      updateBadge();
      document.getElementById("setting_defualt_button_t").checked = true;
      document.getElementById("setting_defualt_button_u").checked = false;
      chrome.storage.local.get('country', function(data) {
        if(data.country == "US" || data.country == "us" || data.country == "United States of America" || data.country == "CA" || data.country == "ca" || data.country == "Canada") {
          document.querySelector(".setting_defualt_button_30_sub_label").style.opacity = "1";
          document.querySelector(".setting_defualt_button_15_sub_label").style.opacity = "1";
          document.querySelector(".setting_defualt_button_30_sub").style.opacity = "1";
          document.querySelector(".setting_defualt_button_15_sub").style.opacity = "1";
          document.getElementById("setting_defualt_button_30_all").style.pointerEvents = "auto";
          document.getElementById("setting_defualt_button_15_all").style.pointerEvents = "auto";
          document.querySelector(".tooltip-bottom-interval-display-15").style.display = "none";
          document.querySelector(".tooltip-bottom-interval-display-30").style.display = "none";
        } else{
          document.querySelector(".tooltip-bottom-interval-display-15").style.display = "block";
          document.querySelector(".tooltip-bottom-interval-display-30").style.display = "block";          
        }
      });
      delayReleaseButtonSetting();    
  });

  document.querySelector("#setting_defualt_button_c_all").addEventListener("click", (e) => { 
      chrome.storage.local.get('setSettingFC', function(data) {
      if(data.setSettingFC !== 'c') {

        setSettingFC = "c";
        chrome.storage.local.set({'setSettingFC': 'c'});
        ctemp();
        updateBadge();
    }
      delayButtonSetting();
      delayReleaseButtonSetting();
   });
   });

  document.querySelector("#setting_defualt_button_f_all").addEventListener("click", (e) => { 
      chrome.storage.local.get('setSettingFC', function(data) {
      if(data.setSettingFC !== 'f') {

        setSettingFC = "f";
        chrome.storage.local.set({'setSettingFC': 'f'});    
        ftemp();
        updateBadge();
    }
      delayButtonSetting();
      delayReleaseButtonSetting();
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
    mapTitle.style.visibility = "visible";
    mapInner.style.visibility = "visible";
    weatherMap(weathermapStyle);

    var currentIcon = document.getElementById("home_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_home");
    currentSubMenu.classList.add("sub_menu_current_Class");
  });

  document.querySelector("#search_popup_page").addEventListener("click", (e) => {
    if(modalSearch.style.display !== 'block') {

      chrome.storage.local.set({'firstTimeSaerchPopupInSession': 1}); 
      closeAllPopup();
      removeClassIcons();
      modalSearch.style.display = "block";
      setTimeout(function() {
        document.getElementById("search_popup_close").style.visibility = 'visible';
        searchTitle.style.visibility = "visible";
        searchInner.style.visibility = "visible";
        searchMap(mapStyle);
      }, 300);

      var currentIcon = document.getElementById("home_icon_popup_page");
      currentIcon.classList.add("sub_menu_current_icon_Class");

      var currentSubMenu = document.getElementById("sub_menu_home");
      currentSubMenu.classList.add("sub_menu_current_Class");
    };  
  });

  document.querySelector("#location").addEventListener("click", (e) => { 
    if(modalSearch.style.display !== 'block') {
      chrome.storage.local.set({'firstTimeSaerchPopupInSession': 1}); 
      document.getElementById("openSidebarMenu").checked = false;
        closeAllPopup();
        removeClassIcons();
        modalSearch.style.display = "block";
        setTimeout(function() {
          document.getElementById("search_popup_close").style.visibility = "visible";
          searchTitle.style.visibility = "visible";
          searchInner.style.visibility = "visible";
        }, 300);
        searchMap(mapStyle);

        var currentIcon = document.getElementById("home_icon_popup_page");
        currentIcon.classList.add("sub_menu_current_icon_Class");

        var currentSubMenu = document.getElementById("sub_menu_home");
        currentSubMenu.classList.add("sub_menu_current_Class"); 

    };          
  });

  document.querySelector("#sidebar_search").addEventListener("click", (e) => {
    chrome.storage.local.set({'firstTimeSaerchPopupInSession': 1}); 
    document.getElementById("openSidebarMenu").checked = false;
    closeAllPopup();
    removeClassIcons();
    modalSearch.style.display = "block";
    setTimeout(function() {
      document.getElementById("search_popup_close").style.visibility = "visible";
      searchTitle.style.visibility = "visible";
      searchInner.style.visibility = "visible";
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
    setTimeout(function() {
      document.getElementById("search_popup_close").style.transition = "all 0s";
      document.getElementById("search_popup_close").style.visibility = "hidden";
      searchTitle.style.visibility = "hidden";
      searchInner.style.visibility = "hidden";
      closeAllPopup();
      removeClassIcons();
      var element = document.getElementById("home_icon_popup_page");
      element.classList.add("sub_menu_icon_active_Class");

      var currentIcon = document.getElementById("home_icon_popup_page");
      currentIcon.classList.add("sub_menu_current_icon_Class");

      var currentSubMenu = document.getElementById("sub_menu_home");
      currentSubMenu.classList.add("sub_menu_current_Class");
    }, 500);
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
    setTimeout(function() {
      document.getElementById("openSidebarMenu").checked = false;
      closeAllPopup();
      removeClassIcons();

      var element = document.getElementById("home_icon_popup_page");
      element.classList.add("sub_menu_icon_active_Class");

      var currentIcon = document.getElementById("home_icon_popup_page");
      currentIcon.classList.add("sub_menu_current_icon_Class");
      
      var currentSubMenu = document.getElementById("sub_menu_home");
      currentSubMenu.classList.add("sub_menu_current_Class");
    }, 500);
  });

  document.querySelector("#F_sign").addEventListener("click", (e) => { 
      chrome.storage.local.get('setSettingFC', function(data) {
        if(data.setSettingFC !== 'f') {
          ftemp();
          setSettingFC = "f";
          chrome.storage.local.set({'setSettingFC': 'f'});
          updateBadge();
        }
      });
  });

  document.querySelector("#C_sign").addEventListener("click", (e) => { 
      chrome.storage.local.get('setSettingFC', function(data) {
        if(data.setSettingFC !== 'c') {
          ctemp();
          setSettingFC = "c";
          chrome.storage.local.set({'setSettingFC': 'c'});
          updateBadge();
        }
      });
  });

  document.querySelector("#donate_button").addEventListener("click", (e) => {
      window.open("https://uvweather.net/donate");
  });

  document.querySelector("#icon_close_box").addEventListener("click", (e) => {
      chrome.storage.local.set({'closeAds': '1'});
      if(document.querySelector('.toastify-top') !== null) {
        locationToast.hideToast();
      }
      var donateButton = document.getElementById("donate_button");
      var donateClose = document.getElementById("icon_close_box");
      var donateCard = document.getElementById("cardMain");
      donateButton.style.display = "none";
      donateClose.style.display = "none";
      donateCard.style.display = "none";
  });

  document.querySelector("#setting_defualt_button_12h_all").addEventListener("click", (e) => {
      chrome.storage.local.set({'TimeFormat': '12h'});
      document.getElementById("setting_defualt_button_12h").checked = true;
      solarFunction12H();
      refresh24h12h();
      delayButtonSetting();
      delayReleaseButtonSetting();
  });

  document.querySelector("#setting_defualt_button_24h_all").addEventListener("click", (e) => {
      chrome.storage.local.set({'TimeFormat': '24h'});
      document.getElementById("setting_defualt_button_24h").checked = true;
      solarFunction24H();
      refresh24h12h()
      delayButtonSetting();
      delayReleaseButtonSetting();
  });


  document.querySelector("#setting_defualt_button_mph_all").addEventListener("click", (e) => {
      chrome.storage.local.set({'windUnit': 'mph'});
      document.getElementById("setting_defualt_button_mph").checked = true;
      refreshWindSpeedUnit();
      delayButtonSetting();
      delayReleaseButtonSetting();
  });

  document.querySelector("#setting_defualt_button_kmh_all").addEventListener("click", (e) => {
      chrome.storage.local.set({'windUnit': 'kmh'});
      document.getElementById("setting_defualt_button_kmh").checked = true;
      refreshWindSpeedUnit();
      delayButtonSetting();
      delayReleaseButtonSetting();      
  });

  document.querySelector("#setting_defualt_button_ms_all").addEventListener("click", (e) => {
      chrome.storage.local.set({'windUnit': 'ms'});
      document.getElementById("setting_defualt_button_ms").checked = true;
      refreshWindSpeedUnit();      
      delayButtonSetting();
      delayReleaseButtonSetting();      
  });

  document.querySelector("#setting_defualt_button_15_all").addEventListener("click", (e) => { 
    chrome.storage.local.get(['setSettingUT', 'country'], function(data) {
      if(data.setSettingUT == 't' && (data.country == "US" || data.country == "us" || data.country == "United States of America" || data.country == "CA" || data.country == "ca" || data.country == "Canada") ) {
        chrome.storage.local.set({'IntervalUpdate': '15'});
        chrome.runtime.sendMessage({ msg: "intervalUpdateMessage" });
        document.querySelector("#setting_defualt_button_15_all").style.pointerEvents = "none";            
        document.querySelector("#setting_defualt_button_30_all").style.pointerEvents = "none";      
        document.querySelector("#setting_defualt_button_60_all").style.pointerEvents = "none";
        document.querySelector("#setting_defualt_button_90_all").style.pointerEvents = "none";
        document.querySelector("#setting_defualt_button_120_all").style.pointerEvents = "none";
        document.getElementById("setting_defualt_button_15").checked = true;
        delayButtonIntervalUpdate();
      }
    })
    })

  document.querySelector("#setting_defualt_button_30_all").addEventListener("click", (e) => { 
    chrome.storage.local.get(['setSettingUT', 'country'], function(data) {
      if(data.setSettingUT == 't' && (data.country == "US" || data.country == "us" || data.country == "United States of America" || data.country == "CA" || data.ountry == "ca" || data.country == "Canada") ) {    
        chrome.storage.local.set({'IntervalUpdate': '30'});
        chrome.runtime.sendMessage({ msg: "intervalUpdateMessage" });
        document.querySelector("#setting_defualt_button_15_all").style.pointerEvents = "none";                  
        document.querySelector("#setting_defualt_button_30_all").style.pointerEvents = "none";      
        document.querySelector("#setting_defualt_button_60_all").style.pointerEvents = "none";
        document.querySelector("#setting_defualt_button_90_all").style.pointerEvents = "none";
        document.querySelector("#setting_defualt_button_120_all").style.pointerEvents = "none";
        document.getElementById("setting_defualt_button_30").checked = true;
        delayButtonIntervalUpdate();
      }
    })        
    })

  document.querySelector("#setting_defualt_button_60_all").addEventListener("click", (e) => { 
      chrome.storage.local.set({'IntervalUpdate': '60'});
      chrome.runtime.sendMessage({ msg: "intervalUpdateMessage" });
      document.querySelector("#setting_defualt_button_15_all").style.pointerEvents = "none";                  
      document.querySelector("#setting_defualt_button_30_all").style.pointerEvents = "none";            
      document.querySelector("#setting_defualt_button_60_all").style.pointerEvents = "none";
      document.querySelector("#setting_defualt_button_90_all").style.pointerEvents = "none";
      document.querySelector("#setting_defualt_button_120_all").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_60").checked = true;
      delayButtonIntervalUpdate();
    })

  document.querySelector("#setting_defualt_button_90_all").addEventListener("click", (e) => { 
      chrome.storage.local.set({'IntervalUpdate': '90'});
      chrome.runtime.sendMessage({ msg: "intervalUpdateMessage" });
      document.querySelector("#setting_defualt_button_15_all").style.pointerEvents = "none";                  
      document.querySelector("#setting_defualt_button_30_all").style.pointerEvents = "none";            
      document.querySelector("#setting_defualt_button_60_all").style.pointerEvents = "none";
      document.querySelector("#setting_defualt_button_90_all").style.pointerEvents = "none";
      document.querySelector("#setting_defualt_button_120_all").style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_90").checked = true;
      delayButtonIntervalUpdate();
    })
  
  document.querySelector("#setting_defualt_button_120_all").addEventListener("click", (e) => { 
      chrome.storage.local.set({'IntervalUpdate': '120'});
      chrome.runtime.sendMessage({ msg: "intervalUpdateMessage" });
      document.querySelector("#setting_defualt_button_15_all").style.pointerEvents = "none";            
      document.querySelector("#setting_defualt_button_30_all").style.pointerEvents = "none";                
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
    }, 400);

    mapboxgl.accessToken = 'pk.eyJ1IjoidXZ3IiwiYSI6ImNrOTY4dzRiMTAyMnUzZXBheHppanV2MXIifQ.jFdHCvYe2u-LUw-_9mcw_g';
    if(typeof (latlong) !== 'undefined') {
      latandlongMapBox = (latlong).split(',').reverse().join(',');
      latandlongMapBox = JSON.parse("[" + latandlongMapBox + "]");
    }
    else {
      latandlongMapBox = [-79.3832,43.6532];
    } 

    function updateGeocoderProximity() {
            var center = map.getCenter().wrap();
            geocoder.setProximity({ longitude: center.lng, latitude: center.lat });
    };

    function onDragEnd() {
        var lngLat = marker.getLngLat();  
        latClick = lngLat.lat;
        lngClick = lngLat.lng;

        latlong = latClick + ',' + lngClick;
        latandlongbyClick = [lngClick,latClick];

        popupSeachPin.remove();

        token = 'pk.eyJ1IjoidXZ3IiwiYSI6ImNrOTY4dzRiMTAyMnUzZXBheHppanV2MXIifQ.jFdHCvYe2u-LUw-_9mcw_g';
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${latandlongbyClick}.json?types=place,locality&limit=1&access_token=${token}`)
          .then((resp) => resp.json())
           .then(function(result) {
            
            if(result.hasOwnProperty('features')) {
              if(result.features.hasOwnProperty('0')) {
              if(result.features[0].hasOwnProperty('place_name') && result.features[0].hasOwnProperty('text')) {
                var fullname = result.features[0].place_name;
                var cityAPI = result.features[0].text;
                  latlong =  latClick + ',' + lngClick;
                  citys = cityAPI;

                  if(((result.features[0].place_name).split(','))[2]) {
                      countryFull = ((result.features[0].place_name).split(','))[2];
                  }
                  else {
                    countryFull = ((result.features[0].place_name).split(','))[1];
                  }

                  if(result.features[0].hasOwnProperty('context')) {
                    for(var i = 0; i <= result.features[0].context.length; i++) {
                          if(result.features[0].context[i].hasOwnProperty('short_code')) {
                          country = (result.features[0].context[i].short_code).substring(0, 2);
                          break;
                        }                    
                    }
                  }

                  chrome.storage.local.set({'fullname': fullname});
                  chrome.storage.local.set({'latlong': latlong});
                  chrome.storage.local.set({'citys': citys});
                  chrome.storage.local.set({'country': country});

                  setTimeout(function(){
                    popup();
                  }, 150);

              }
            }
          }
          });
    };

    var map = new mapboxgl.Map({
        container: 'mapSearch',
        style: mapStyle,
        center: latandlongMapBox,
        minZoom: 2,
        maxZoom: 12,
        zoom: 10,
        interactive: true
    });

    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    map.on('load', updateGeocoderProximity);
    map.on('moveend', updateGeocoderProximity);

    var center = map.getCenter().wrap();

    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      flyTo: true,
      essential: true,
      types: 'place, locality, postcode',
      limit: 8,
      placeholder: 'Enter the city or ZIP code',
      proximity: {
        longitude: center.lng,
        latitude: center.lat
      },
      marker: {
        color: '#ff662b',
        draggable: true
      },

      // render: function(item) {
      //   console.log(item);
      // return (
      // "<div class='geocoder-dropdown-item'>" +
      //   item.text +
      // "<div class='geocoder-dropdown-text'>" +
      //   item.place_name +
      // '</div></div>'
      // );
      // },      

    });

    var marker = new mapboxgl.Marker({
        color: '#ff662b',
        draggable: true
    })
    .setLngLat(latandlongMapBox)
    .addTo(map);

    var popupSeachPin = new mapboxgl.Popup({closeButton: false, closeOnMove: true, offset: 38  })
    .setLngLat(latandlongMapBox)
    .setHTML('<h4>Drag and drop the pin to your location<br>to get accurate weather data.</h4>')
    .addTo(map);

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

      marker.on('dragend', onDragEnd);
 

      geocoder.on('result', function(ev) {
          updateGeocoderProximity();
          var fullname = ev.result.place_name;
          var cityAPI = ev.result.text;
          var lat = ev.result.geometry.coordinates[1];
          var lng = ev.result.geometry.coordinates[0];

          latlong =  lat + ',' + lng;
          citys =  cityAPI;

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

          marker.remove();

          chrome.storage.local.set({'fullname': fullname});
          chrome.storage.local.set({'latlong': latlong});
          chrome.storage.local.set({'citys': citys});
          chrome.storage.local.set({'country': country});

            setTimeout(function(){
              popup();
            }, 150);

          map.flyTo({
            center: [lng,lat],
            zoom: 10,
            speed: .8,
            curve: 1.42,
            essential: true,
            easing(t) {
              return t;
            }
          });

          map.on('moveend', function(e){
              searchMap(mapStyle);
          });

      });

      geocoder.on('error', function(ev) {

      });

    });
  };


  function weatherMap(weathermapStyle) {
    mapboxgl.accessToken = 'pk.eyJ1IjoidXZ3IiwiYSI6ImNrOTY4dzRiMTAyMnUzZXBheHppanV2MXIifQ.jFdHCvYe2u-LUw-_9mcw_g';
    if(typeof (latlong) !== 'undefined') {
      latandlongMapBox = (latlong).split(',').reverse().join(',');
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
          "tiles": ["https://tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=6761dd7f8d0c3c216f9af6813064f867"],
          "tileSize": 256
        },
        "minzoom": 1,
        "maxzoom": 8
      });
    });
  };



});