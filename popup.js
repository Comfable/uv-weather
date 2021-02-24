// console.log("Main Thread - popup");

const pageBody = document.body;
const ready = (callback) => {
  if (document.readyState != "loading") callback();
  else document.addEventListener("DOMContentLoaded", callback);
};

ready(() => {
  activePopup();
});

const activePopup = () => {
  // chrome.runtime.sendMessage({
  //   msg: "intervalUpdateMessage",
  // });

  popupOpen = "1";
  const options = {
    duration: 0.9,
  };
  const toggleSwitch = document.querySelector(
    '.theme-switch input[type="checkbox"]'
  );
  var element = document.getElementById("home_icon_popup_page");
  element.classList.add("sub_menu_icon_active_Class");
  var currentIcon = document.getElementById("home_icon_popup_page");
  currentIcon.classList.add("sub_menu_current_icon_Class");
  var currentSubMenu = document.getElementById("sub_menu_home");
  currentSubMenu.classList.add("sub_menu_current_Class");
  var modalSetting = document.getElementById("setting_popup");
  var modalAqi = document.getElementById("aqi_popup");
  var modalFeedback = document.getElementById("feedback_popup");
  var modalSolar = document.getElementById("solar_popup");
  var modal7days = document.getElementById("next7_popup");
  var modal48hours = document.getElementById("next48_popup");
  var location = document.getElementById("location");
  var mapInner = document.getElementById("mapWeather");
  var mapTitle = document.getElementById("map_popup_title");
  var searchInner = document.getElementById("mapSearch");
  var searchTitle = document.getElementById("search_popup_title");
  var modalCurrent = document.getElementById("currentReport_popup");
  var modalSearch = document.getElementById("search_popup");

  var C_sign_elementStyle = document.getElementById("C_sign").style;
  var F_sign_elementStyle = document.getElementById("F_sign").style;
  const toggleSwitchBadgeSize = document.querySelector(
    '.badge_size_switch_setting input[type="checkbox"]'
  );
  var loadingIconBadgeDelay = 1;

  mapStyle = "mapbox://styles/mapbox/light-v10?optimize=true";
  weathermapStyle = "mapbox://styles/mapbox/light-v10?optimize=true";

  var locationToast = Toastify({
    className: "locationToast",
    text: "Get data specific to your location →", //Change your location here
    gravity: "top",
    position: "right",
    close: false,
    stopOnFocus: false,
    backgroundColor: "#3B4149",
    duration: 60000,
  });

  version_manifest = chrome.runtime.getManifest().version;
  document.querySelector("#title_version_setting").textContent =
    "Version " + version_manifest;
  document.getElementById("preload_body").style.display = "block";

  document.querySelector("#giveUsFeedback_sub").textContent =
    "UV Weather " + version_manifest;

  chrome.storage.local.set({
    firstTimeSaerchPopupInSession: 0,
  });

  chrome.storage.local.get(["IntervalUpdate", "setSettingUT"], function (data) {
    if (data.IntervalUpdate == "120") {
      document.getElementById("setting_defualt_button_120").checked = true;
    } else if (data.IntervalUpdate == "90") {
      document.getElementById("setting_defualt_button_90").checked = true;
    } else if (data.IntervalUpdate == "60") {
      document.getElementById("setting_defualt_button_60").checked = true;
    } else if (data.IntervalUpdate == "30") {
      document.getElementById("setting_defualt_button_30").checked = true;
    } else if (data.IntervalUpdate == "15") {
      document.getElementById("setting_defualt_button_15").checked = true;
    }
  });

  chrome.storage.local.get("windUnit", function (data) {
    if (data.windUnit == "mph" || typeof data.windUnit == "undefined") {
      document.getElementById("setting_defualt_button_mph").checked = true;
    } else if (data.windUnit == "kmh") {
      document.getElementById("setting_defualt_button_kmh").checked = true;
    } else if (data.windUnit == "ms") {
      document.getElementById("setting_defualt_button_ms").checked = true;
    }
  });

  chrome.storage.local.get("closeAds", function (data) {
    if (data.closeAds == 1) {
      var donateButton = document.getElementById("donate_button");
      var donateClose = document.getElementById("icon_close_box");
      var donateCard = document.getElementById("cardMain");
      donateButton.style.display = "none";
      donateClose.style.display = "none";
      donateCard.style.display = "none";
    }
  });

  chrome.storage.local.get("badgeSize", function (data) {
    if (data.badgeSize) {
      if (data.badgeSize === "1") {
        toggleSwitchBadgeSize.checked = true;
        chrome.storage.local.set({
          badgeSize: "1",
        });
      } else {
        toggleSwitchBadgeSize.checked = false;
        chrome.storage.local.set({
          badgeSize: "0",
        });
      }
    }

    function switchBadgeSize(e) {
      if (e.target.checked) {
        chrome.storage.local.set({
          badgeSize: "1",
        });
        document.getElementById("checkbox_largIcon").checked = true;
        document.getElementById("checkbox_largIcon").disabled = true;
        document.getElementById("checkbox_whiteIcon").checked = false;
        chrome.storage.local.set({
          whiteIcon: "0",
        });
        updateBadge();
        delayButtonBadgeSize();
        delayButtonSetting();
        delayReleaseButtonSetting();
      } else {
        chrome.storage.local.set({
          badgeSize: "0",
        });
        document.getElementById("checkbox_largIcon").checked = false;
        document.getElementById("checkbox_largIcon").disabled = true;
        updateBadge();
        delayButtonBadgeSize();
        delayButtonSetting();
        delayReleaseButtonSetting();
      }
    }
    toggleSwitchBadgeSize.addEventListener("change", switchBadgeSize, false);
  });

  const toggleSwitchAnimatedIcon = document.querySelector(
    '.theme-switch_setting_animated_icon input[type="checkbox"]'
  );
  chrome.storage.local.get("animatedIcon", function (data) {
    currentAnimatedIcon = data.animatedIcon;

    if (currentAnimatedIcon) {
      if (currentAnimatedIcon === "1") {
        toggleSwitchAnimatedIcon.checked = true;
        chrome.storage.local.set({
          animatedIcon: "1",
        });
      } else {
        chrome.storage.local.set({
          animatedIcon: "0",
        });
      }
    } else {
      toggleSwitchAnimatedIcon.checked = true;
      chrome.storage.local.set({
        animatedIcon: "1",
      });
    }

    function switchAnimatedIcon(e) {
      if (e.target.checked) {
        chrome.storage.local.set({
          animatedIcon: "1",
        });
        document.getElementById("checkbox_animatedIcon").checked = true;
        document.getElementById("checkbox_animatedIcon").disabled = true;
        iconCurrent_animated();
        delayButtonAnimatedIcon();
      } else {
        chrome.storage.local.set({
          animatedIcon: "0",
        });
        document.getElementById("checkbox_animatedIcon").checked = false;
        document.getElementById("checkbox_animatedIcon").disabled = true;
        iconCurrent();
        delayButtonAnimatedIcon();
      }
    }
    toggleSwitchAnimatedIcon.addEventListener(
      "change",
      switchAnimatedIcon,
      false
    );
  });

  const toggleSwitchWhiteIcon = document.querySelector(
    '.theme-switch_setting input[type="checkbox"]'
  );
  chrome.storage.local.get("whiteIcon", function (data) {
    currentWhiteIcon = data.whiteIcon;
    if (currentWhiteIcon) {
      if (currentWhiteIcon === "1") {
        toggleSwitchWhiteIcon.checked = true;
        chrome.storage.local.set({
          whiteIcon: "1",
        });
      } else {
        chrome.storage.local.set({
          whiteIcon: "0",
        });
      }
    }

    function switchWhiteIcon(e) {
      if (e.target.checked) {
        chrome.storage.local.set({
          whiteIcon: "1",
        });
        document.getElementById("checkbox_whiteIcon").checked = true;
        document.getElementById("checkbox_whiteIcon").disabled = true;
        document.getElementById("checkbox_largIcon").checked = false;
        chrome.storage.local.set({
          badgeSize: "0",
        });
        updateBadge();
        delayButtonWhiteIcon();
      } else {
        chrome.storage.local.set({
          whiteIcon: "0",
        });
        document.getElementById("checkbox_whiteIcon").checked = false;
        document.getElementById("checkbox_whiteIcon").disabled = true;
        updateBadge();
        delayButtonWhiteIcon();
      }
    }
    toggleSwitchWhiteIcon.addEventListener("change", switchWhiteIcon, false);
  });

  chrome.storage.local.get(
    ["theme", "autoDark", "timeZoneBadge", "latlong"],
    function (data) {
      currentTheme = data.theme;
      autoDarkTheme = data.autoDark;
      timeZoneBadge = data.timeZoneBadge;
      latlong = data.latlong;

      solarNighDay(timeZoneBadge, latlong);

      if (currentTheme || autoDarkTheme) {
        document.documentElement.setAttribute("data-theme", currentTheme);

        if (autoDarkTheme == "1" && isNight) {
          darkDisplay();
        } else if (autoDarkTheme == "1" && isDay) {
          lightDisplay();
        } else if (currentTheme === "dark") {
          toggleSwitch.checked = true;
          darkDisplay();
        } else {
          lightDisplay();
        }
      } else {
        document.getElementById("setting_defualt_theme_l").checked = true;
      }

      function switchTheme(e) {
        if (e.target.checked) {
          darkDisplay();
          delayButtonDarkmode();
        } else {
          lightDisplay();
          delayButtonDarkmode();
        }
      }

      toggleSwitch.addEventListener("change", switchTheme, false);
    }
  );

  const toggleSwitchAutoDark = document.querySelector(
    '.theme-switch_setting_auto_dark input[type="checkbox"]'
  );
  chrome.storage.local.get("autoDark", function (data) {
    currentAutoDark = data.autoDark;

    if (currentAutoDark) {
      if (currentAutoDark === "1") {
        toggleSwitchAutoDark.checked = true;
        chrome.storage.local.set({
          autoDark: "1",
        });
      } else {
        chrome.storage.local.set({
          autoDark: "0",
        });
      }
    }

    function switchAutoDark(e) {
      if (e.target.checked) {
        chrome.storage.local.set({
          autoDark: "1",
        });
        document.getElementById("checkbox_autoDark").checked = true;
        document.getElementById("checkbox_autoDark").disabled = true;
        if (isNight) {
          darkDisplay();
        } else {
          lightDisplay();
        }

        delayButtonAutoDarkmode();
      } else {
        chrome.storage.local.set({
          autoDark: "0",
        });
        document.getElementById("checkbox_autoDark").checked = false;
        document.getElementById("checkbox_autoDark").disabled = true;
        delayButtonAutoDarkmode();
      }
    }
    toggleSwitchAutoDark.addEventListener("change", switchAutoDark, false);
  });

  function popup() {
    document.querySelector("#aqi").style.opacity = ".2";
    document.querySelector(".aqi-arrow").style.visibility = "hidden";
    document.querySelector("#aqi-current-svg").style.visibility = "hidden";

    chrome.storage.local.get(
      ["latlong", "citys", "country", "timeZoneBadge", "failedHTTP"],
      function (data) {
        latlong = data.latlong;
        country = data.country;
        citys = data.citys;
        failedHTTP = data.failedHTTP;
        timeZoneBadge = data.timeZoneBadge;

        var promise = () =>
          new Promise((resolve) => {
            if (country == "CA" || country == "ca" || country == "Canada") {
              weatherCA(latlong, citys, resolve);
            } else if (
              country == "US" ||
              country == "us" ||
              country == "United States of America"
            ) {
              weatherUS2(latlong, citys, resolve);
            } else {
              resolve && resolve("result of Promise()");
            }
          });

        var promise2 = () =>
          new Promise((resolve) => {
            if (
              failedHTTP !== "1" ||
              (country !== "US" &&
                country !== "us" &&
                country !== "United States of America" &&
                country !== "CA" &&
                country !== "ca" &&
                country !== "Canada")
            ) {
              weatherNO(latlong, citys, timeZoneBadge, resolve);
            } else {
              resolve && resolve("result of NO()");
            }
          });

        var promise3 = () =>
          new Promise((resolve) => {
            resolve && resolve("result of NO()");
          });

        promise()
          .then(() => {
            promise2()
              .then(() => {})
              .then(function () {
                promise3()
                  .then(() => {})
                  .then(function () {
                    UTFC();
                    refreshPopup();
                    updateBadge();
                    const preloader = document.querySelector(".preloader");
                    const fadeEffect = setInterval(() => {
                      if (!preloader.style.opacity) {
                        return (preloader.style.opacity = 1);
                      }
                      if (preloader.style.opacity > 0) {
                        return (preloader.style.opacity -= 0.1);
                      } else {
                        clearInterval(fadeEffect);
                      }
                    }, 50);

                    chrome.storage.local.get("firstTimePopup", function (data) {
                      if (typeof data.firstTimePopup == "undefined") {
                        chrome.storage.local.set({
                          firstTimePopup: 1,
                        });
                      }
                      if (data.firstTimePopup == 0) {
                        locationToast.showToast();
                        chrome.storage.local.set({
                          firstTimePopup: 1,
                        });
                      }
                    });
                  });
              });
          })
          .catch((error) => {
            // console.log( 'promise error: ', error );
          });
      }
    );
  }

  popup();

  /// Functions----------------------------------------------------------
  function UTFC() {
    chrome.storage.local.get(["setSettingFC", "setSettingUT"], function (data) {
      setSettingFC = data.setSettingFC;
      setSettingUT = data.setSettingUT;

      if (typeof setSettingFC === "undefined") {
        if (country == "US") {
          setSettingFC = "f";
          chrome.storage.local.set({
            setSettingFC: "f",
          });
        } else {
          setSettingFC = "c";
          chrome.storage.local.set({
            setSettingFC: "c",
          });
        }
      }

      if (typeof setSettingUT === "undefined") {
        setSettingUT = "t";
        chrome.storage.local.set({
          setSettingUT: "t",
        });
      }

      if (setSettingUT == "u") {
        document.getElementById("setting_defualt_button_u").checked = true;
      } else {
        document.getElementById("setting_defualt_button_t").checked = true;
      }

      if (setSettingFC == "f") {
        document.getElementById("setting_defualt_button_f").checked = true;
      } else {
        document.getElementById("setting_defualt_button_c").checked = true;
      }

      if (setSettingFC == "f") {
        ftemp();
      } else {
        ctemp();
      }
    });
  }

  function delayButtonDarkmode() {
    setTimeout(function () {
      document.getElementById("checkbox").disabled = false;
    }, 1000);
  }

  function delayButtonAutoDarkmode() {
    setTimeout(function () {
      document.getElementById("checkbox_autoDark").disabled = false;
    }, 1000);
  }

  function delayButtonWhiteIcon() {
    setTimeout(function () {
      document.getElementById("checkbox_whiteIcon").disabled = false;
    }, 1000);
  }

  function delayButtonAnimatedIcon() {
    setTimeout(function () {
      document.getElementById("checkbox_animatedIcon").disabled = false;
    }, 1000);
  }

  function loadingIconBadge() {
    if (loadingIconBadgeDelay == "1") {
      loadingIconBadgeDelay = "0";
      animatedBadgeInterval = setInterval(function () {
        animatedBadge();
      }, 1000 / 30);
      setTimeout(function () {
        clearInterval(animatedBadgeInterval);
        loadingIconBadgeDelay = "1";
      }, 485);
    }
  }

  function refreshPopup() {
    chrome.storage.local.get(["verUpdate"], function (data) {
      if (data.verUpdate == 1) {
        chrome.storage.local.set({
          verUpdate: 2,
        });
        groundCurrent();
      } else {
        groundFlickr();
      }
    });

    chrome.storage.local.get("setSettingFC", function (data) {
      if (data.setSettingFC == "c") {
        ctemp();
      } else {
        ftemp();
      }
    });

    if (citys.length > 15) {
      document.querySelector("#location").textContent =
        citys.slice(0, 12) + "...";
    } else {
      document.querySelector("#location").textContent = citys;
    }

    document.querySelector("#current_uv").textContent = uv1;

    if (
      typeof country !== "undefined" &&
      country !== "undefined" &&
      country !== " "
    ) {
      countryShortName = country.trim().substring(0, 2);
      countryShortLowerCase = countryShortName.toLowerCase();
      countryFlagURL = "images/flag/" + countryShortLowerCase + ".png";
      document.querySelector(".countryflagsClass").style.backgroundImage =
        "url(" + countryFlagURL + ")";
    } else {
      document.querySelector(".countryflagsClass").style.backgroundImage =
        'url("images/blank.svg")';
    }

    chrome.storage.local.get("animatedIcon", function (data) {
      if (data.animatedIcon === "1") {
        iconCurrent_animated();
      } else {
        iconCurrent();
      }
    });

    uvRecommendation();
    next48Function();
    next7Function();
    refresh24h12h();
    reportFunction();
    trackSunExposure();
    refreshWindSpeedUnit();
  }

  function aqi_popup() {
    document.querySelector(".aqi-loading-dots").style.display = "none";
    document.querySelector(".aqi-current-text").textContent = aqi_index;
    document.querySelector(".aqi-arrow").style.visibility = "visible";
    document.querySelector("#aqi-current-svg").style.visibility = "visible";
    document.querySelector("#aqi").style.opacity = "1";

    if (aqi_index == "-") {
      document.querySelector(".aqi-arrow").style.transform = "translateY(0px)";
      document.querySelector("#aqi-current-svg").style.fill = "#27AE60";
    } else if (aqi_index <= 50) {
      document.querySelector(".aqi-arrow").style.transform = "translateY(0px)";
      document.querySelector("#aqi-current-svg").style.fill = "#27AE60";
    } else if (aqi_index >= 51 && aqi_index <= 100) {
      document.querySelector(".aqi-arrow").style.transform = "translateY(52px)";
      document.querySelector("#aqi-current-svg").style.fill = "#2ECC71";
    } else if (aqi_index >= 101 && aqi_index <= 150) {
      document.querySelector(".aqi-arrow").style.transform =
        "translateY(104px)";
      document.querySelector("#aqi-current-svg").style.fill = "#F1C40F";
    } else if (aqi_index >= 151 && aqi_index <= 200) {
      document.querySelector(".aqi-arrow").style.transform =
        "translateY(156px)";
      document.querySelector("#aqi-current-svg").style.fill = "#F39C12";
    } else if (aqi_index >= 201 && aqi_index <= 300) {
      document.querySelector(".aqi-arrow").style.transform =
        "translateY(208px)";
      document.querySelector("#aqi-current-svg").style.fill = "#9B59B6";
    } else {
      document.querySelector(".aqi-arrow").style.transform =
        "translateY(260px)";
      document.querySelector("#aqi-current-svg").style.fill = "#E74C3C";
    }
  }

  function groundCurrent() {
    switch (iconBadge) {
      case "clear-day":
        if (isDay) {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage = 'url("images/background/clear-day.jpg")';
        } else {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage = 'url("images/background/clear-night.jpg")';
        }
        break;
      case "clear-night":
        document.querySelector(
          ".image_background_Class"
        ).style.backgroundImage = 'url("images/background/clear-night.jpg")';
        break;
      case "rain":
        if (isDay) {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage = 'url("images/background/rain-day.jpg")';
        } else {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage = 'url("images/background/rain-night.jpg")';
        }
        break;
      case "snow":
        if (isDay) {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage = 'url("images/background/snow-day.jpg")';
        } else {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage = 'url("images/background/snow-night.jpg")';
        }
        break;
      case "sleet":
        if (isDay) {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage = 'url("images/background/sleet-day.jpg")';
        } else {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage = 'url("images/background/sleet-night.jpg")';
        }
        break;
      case "wind":
        if (isDay) {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage = 'url("images/background/wind-day.jpg")';
        } else {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage = 'url("images/background/wind-night.jpg")';
        }
        break;
      case "fog":
        if (isDay) {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage = 'url("images/background/fog-day.jpg")';
        } else {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage = 'url("images/background/fog-night.jpg")';
        }
        break;
      case "cloudy":
        if (isDay) {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage = 'url("images/background/cloudy-day.jpg")';
        } else {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage = 'url("images/background/cloudy-night.jpg")';
        }
        break;
      case "partly-cloudy-day":
        if (isDay) {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage =
            'url("images/background/partly-cloudy-day.jpg")';
        } else {
          document.querySelector(
            ".image_background_Class"
          ).style.backgroundImage =
            'url("images/background/partly-cloudy-night.jpg")';
        }
        break;
      case "partly-cloudy-night":
        document.querySelector(
          ".image_background_Class"
        ).style.backgroundImage =
          'url("images/background/partly-cloudy-night.jpg")';
        break;
      default:
        document.querySelector(
          ".image_background_Class"
        ).style.backgroundImage = 'url("images/background/default.png")';
        break;
    }
    document.querySelector("#link_flickr_text").textContent = "";
    document.querySelector(".image_background_Class").style.filter =
      "brightness(60%)";
  }

  function groundFlickr() {
    switch (iconBadge) {
      case "clear-day":
        if (isDay) {
          galleryID = "72157711948824252";
        } else {
          galleryID = "72157711948534226";
        }
        break;
      case "clear-night":
        galleryID = "72157711948534226";
        break;
      case "rain":
        if (isDay) {
          galleryID = "72157711948916072";
        } else {
          galleryID = "72157711948918142";
        }
        break;
      case "snow":
        if (isDay) {
          galleryID = "72157711948582321";
        } else {
          galleryID = "72157711948925407";
        }
        break;
      case "sleet":
        if (isDay) {
          galleryID = "72157711948578771";
        } else {
          galleryID = "72157711948921797";
        }
        break;
      case "wind":
        if (isDay) {
          galleryID = "72157711950448603";
        } else {
          galleryID = "72157711948587066";
        }
        break;
      case "fog":
        if (isDay) {
          galleryID = "72157711948567181";
        } else {
          galleryID = "72157711950432483";
        }
        break;
      case "cloudy":
        if (isDay) {
          galleryID = "72157711950426443";
        } else {
          galleryID = "72157711948906242";
        }
        break;
      case "partly-cloudy-day":
        if (isDay) {
          galleryID = "72157711950434293";
        } else {
          galleryID = "72157711948913902";
        }
        break;
      case "partly-cloudy-night":
        galleryID = "72157711948913902";
        break;
      default:
        galleryID = "72157711948824252";
        break;
    }

    var f_url = "https://api.flickr.com/services/rest";
    var key = "9105bad4b97cbb0f3dab8c9f340dd82f";
    var f_data =
      "" +
      "api_key=" +
      key +
      "&format=json" +
      "&nojsoncallback=1" +
      "&method=flickr.galleries.getPhotos" +
      "&gallery_id=" +
      galleryID +
      "&extras=owner_name,path_alias,url_c";

    new Promise(function (resolve, reject) {
      var timeout = setTimeout(function () {
        reject(new Error("Request timed out"));
      }, 800);

      fetch(f_url + "?" + f_data)
        .then(function (result) {
          clearTimeout(timeout);
          if (result && result.status == 200) return result.json();
          else reject(new Error("Response error"));
        })
        .then(function (result) {
          resolve();
          var ImageNum = Math.floor(Math.random() * 10);

          if (
            result.stat === "ok" &&
            typeof result.photos.photo[ImageNum] !== "undefined"
          ) {
            flickrID = result.photos.photo[ImageNum].hasOwnProperty("id")
              ? result.photos.photo[ImageNum].id
              : "-";
            owner = result.photos.photo[ImageNum].hasOwnProperty("owner")
              ? result.photos.photo[ImageNum].owner
              : "-";
            url_c = result.photos.photo[ImageNum].hasOwnProperty("url_c")
              ? result.photos.photo[ImageNum].url_c
              : "-";
            pathalias = result.photos.photo[ImageNum].hasOwnProperty(
              "pathalias"
            )
              ? result.photos.photo[ImageNum].pathalias
              : "-";
            ownername = result.photos.photo[ImageNum].hasOwnProperty(
              "ownername"
            )
              ? result.photos.photo[ImageNum].ownername
              : "-";
          } else {
            flickrID = "-";
          }

          if (flickrID !== "-" && pathalias !== null) {
            url_owner =
              "https://www.flickr.com/photos/" + pathalias + "/" + flickrID;
          } else {
            url_owner =
              "https://www.flickr.com/photos/" + owner + "/" + flickrID;
          }
        })
        .catch(function (error) {
          reject(error);
          groundCurrent();
        });
    })
      .then(function () {
        document.querySelector(
          ".image_background_Class"
        ).style.backgroundImage = "url(" + url_c + ")";
        setTimeout(function () {
          document.querySelector(".image_background_Class").style.filter =
            "brightness(60%)";
        }, 250);

        if (pathalias !== null) {
          document.querySelector("#link_flickr_text").textContent =
            "Photo by " + pathalias.substr(0, 10) + " on Flickr";
          document
            .querySelector("#link_flickr")
            .addEventListener("click", (e) => {
              window.open(url_owner, "_blank");
            });
        } else {
          document.querySelector("#link_flickr_text").textContent =
            "Photo by " + ownername.substr(0, 10) + " on Flickr";
          document
            .querySelector("#link_flickr")
            .addEventListener("click", (e) => {
              window.open(url_owner, "_blank");
            });
        }

        document.querySelector("#link_flickr_text").textContent =
          "Photo by " + ownername.substr(0, 10) + " on Flickr";
        document
          .querySelector("#link_flickr")
          .addEventListener("click", (e) => {
            window.open(url_owner, "_blank");
          });
      })
      .catch(function (err) {
        groundCurrent();
      });
  }

  function iconCurrent_animated() {
    switch (iconBadge) {
      case "clear-day":
        if (isDay) {
          document.querySelector(".current_icon_update").style.backgroundImage =
            'url("images/weather_icon/a_clear-day.svg")';
        } else {
          document.querySelector(".current_icon_update").style.backgroundImage =
            'url("images/weather_icon/a_clear-night.svg")';
        }
        break;
      case "clear-night":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/a_clear-night.svg")';
        break;
      case "rain":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/a_rain.svg")';
        break;
      case "snow":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/a_snow.svg")';
        break;
      case "sleet":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/a_snow.svg")';
        break;
      case "wind":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/a_wind.svg")';
        break;
      case "fog":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/a_fog.svg")';
        break;
      case "cloudy":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/a_cloudy.svg")';
        break;
      case "partly-cloudy-day":
        if (isDay) {
          document.querySelector(".current_icon_update").style.backgroundImage =
            'url("images/weather_icon/a_partly-cloudy-day.svg")';
        } else {
          document.querySelector(".current_icon_update").style.backgroundImage =
            'url("images/weather_icon/a_partly-cloudy-night.svg")';
        }
        break;
      case "partly-cloudy-night":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/a_partly-cloudy-night.svg")';
        break;
      default:
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/a_clear-day.svg")';
        break;
    }
  }

  function iconCurrent() {
    switch (iconBadge) {
      case "clear-day":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/wi_sun.svg")';
        break;
      case "clear-night":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/wi_moon.svg")';
        break;
      case "rain":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/wi_cloud_rain.svg")';
        break;
      case "snow":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/wi_cloud_snow.svg")';
        break;
      case "sleet":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/wi_cloud_snow_alt.svg")';
        break;
      case "wind":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/wi_wind.svg")';
        break;
      case "fog":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/wi_cloud_fog_alt.svg")';
        break;
      case "cloudy":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/wi_cloud.svg")';
        break;
      case "partly-cloudy-day":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/wi_cloud_sun.svg")';
        break;
      case "partly-cloudy-night":
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/wi_cloud_moon.svg")';
        break;
      default:
        document.querySelector(".current_icon_update").style.backgroundImage =
          'url("images/weather_icon/wi_sun.svg")';
        break;
    }
  }

  function ctemp() {
    if (temperatureCbadge > current_tempC_max) {
      current_tempC_max = temperatureCbadge;
    }
    if (temperatureCbadge < current_tempC_min) {
      current_tempC_min = temperatureCbadge;
    }
    document.querySelector("#current_report_dewPoint").textContent =
      dewPointC + "° C";
    if (temperatureCbadge >= 6 || temperatureCbadge <= -6) {
      const countUptemperatureCbadge = new CountUp(
        "current_temp",
        temperatureCbadge,
        options
      );
      countUptemperatureCbadge.start();
    } else {
      document.querySelector("#current_temp").textContent = temperatureCbadge;
    }
    document.querySelector("#current_report_temp").textContent =
      temperatureCbadge + "° C";
    document.querySelector("#current_accufeel").textContent =
      "AccuFeel " + accufeelResultC + "°";
    document.querySelector("#current_report_accufeel").textContent =
      accufeelResultC + "° C";
    document.querySelector("#current_temp_max").textContent =
      current_tempC_max + "°";

    document.querySelector("#current_temp_min").textContent =
      current_tempC_min + "°";

    document.querySelector("#forecast_1_temp").textContent =
      daily_tempC_max_1 + "°";
    document.querySelector("#forecast_2_temp").textContent =
      daily_tempC_max_2 + "°";

    document.querySelector("#forecast_1_temp_min").textContent =
      daily_tempC_min_1 + "°";
    document.querySelector("#forecast_2_temp_min").textContent =
      daily_tempC_min_2 + "°";

    document.querySelector("#forecast_10_temp").textContent =
      daily_tempC_max_1 + "°";
    document.querySelector("#forecast_20_temp").textContent =
      daily_tempC_max_2 + "°";
    document.querySelector("#forecast_30_temp").textContent =
      daily_tempC_max_3 + "°";
    document.querySelector("#forecast_40_temp").textContent =
      daily_tempC_max_4 + "°";
    document.querySelector("#forecast_50_temp").textContent =
      daily_tempC_max_5 + "°";
    document.querySelector("#forecast_60_temp").textContent =
      daily_tempC_max_6 + "°";
    document.querySelector("#forecast_70_temp").textContent =
      daily_tempC_max_7 + "°";

    document.querySelector("#forecast_10_temp_min").textContent =
      daily_tempC_min_1 + "°";
    document.querySelector("#forecast_20_temp_min").textContent =
      daily_tempC_min_2 + "°";
    document.querySelector("#forecast_30_temp_min").textContent =
      daily_tempC_min_3 + "°";
    document.querySelector("#forecast_40_temp_min").textContent =
      daily_tempC_min_4 + "°";
    document.querySelector("#forecast_50_temp_min").textContent =
      daily_tempC_min_5 + "°";
    document.querySelector("#forecast_60_temp_min").textContent =
      daily_tempC_min_6 + "°";
    document.querySelector("#forecast_70_temp_min").textContent =
      daily_tempC_min_7 + "°";

    if (
      (country == "US" ||
        country == "us" ||
        country == "United States of America") &&
      failedHTTP !== "1"
    ) {
      for (i = 1; i < 49; i++) {
        document.querySelector(`#forecast_${i}_hours_temp`).textContent =
          Math.round(f2c(usHourlyTempXML[i])) + "°";
      }
    } else {
      var hourlyArray = [];
      for (i = 1; i < 49; i++) {
        hourlyArray.push(
          resultNO.properties.timeseries[i].data.instant.details.air_temperature
        );
      }
      for (i = 0; i < 48; i++) {
        document.querySelector(`#forecast_${i + 1}_hours_temp`).textContent =
          Math.round(hourlyArray[i]) + "°";
      }
    }

    document.querySelector("#summery_next7_text").textContent = summaryDailyC;
    document.querySelector("#summery_next48_text").textContent = summaryHourlyC;

    document.getElementById("setting_defualt_button_c").disabled = true;
    document.getElementById("setting_defualt_button_f").disabled = false;
    document.getElementById("setting_defualt_button_c").checked = true;

    F_sign_elementStyle.filter = "opacity(65%)";
    C_sign_elementStyle.filter = "opacity(100%)";
    C_sign_elementStyle.position = "absolute";
    C_sign_elementStyle.top = "0px";
    F_sign_elementStyle.position = "absolute";
    F_sign_elementStyle.top = "22px";
    C_sign_elementStyle.fontSize = "20px";
    F_sign_elementStyle.fontSize = "15px";
  }

  function uvRecommendation() {
    resUV0 = document.querySelectorAll(
      "#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_4, #icon_uv_5, #icon_uv_6, #icon_uv_1_tooltip, #icon_uv_2_tooltip, #icon_uv_3_tooltip, #icon_uv_4_tooltip, #icon_uv_5_tooltip, #icon_uv_6_tooltip"
    );
    for (var i = 0; i < resUV0.length; i++) {
      resUV0[i].style.opacity = ".3";
    }

    if (uv1 == 1) {
      document.querySelector("#icon_uv_1").style.opacity = "1";
      document.querySelector("#icon_uv_1_tooltip").style.opacity = "1";
    } else if (uv1 == 2) {
      resUV2 = document.querySelectorAll(
        "#icon_uv_1, #icon_uv_2, #icon_uv_1_tooltip, #icon_uv_2_tooltip"
      );
      for (var i = 0; i < resUV2.length; i++) {
        resUV2[i].style.opacity = "1";
        resUV2[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
      }
    } else if (uv1 >= 3 && uv1 <= 5) {
      resUV3 = document.querySelectorAll(
        "#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_1_tooltip, #icon_uv_2_tooltip, #icon_uv_3_tooltip"
      );
      for (var i = 0; i < resUV3.length; i++) {
        resUV3[i].style.opacity = "1";
        resUV3[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
      }
    } else if (uv1 >= 6 && uv1 <= 7) {
      resUV6 = document.querySelectorAll(
        "#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_4, #icon_uv_1_tooltip, #icon_uv_2_tooltip, #icon_uv_3_tooltip, #icon_uv_4_tooltip"
      );
      for (var i = 0; i < resUV6.length; i++) {
        resUV6[i].style.opacity = "1";
        resUV6[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
      }
    } else if (uv1 >= 8) {
      resUV8 = document.querySelectorAll(
        "#icon_uv_1, #icon_uv_2, #icon_uv_3, #icon_uv_4, #icon_uv_5, #icon_uv_6, #icon_uv_1_tooltip, #icon_uv_2_tooltip, #icon_uv_3_tooltip, #icon_uv_4_tooltip, #icon_uv_5_tooltip, #icon_uv_6_tooltip"
      );
      for (var i = 0; i < resUV8.length; i++) {
        resUV8[i].style.opacity = "1";
        resUV8[i].style.filter = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .5))";
      }
    }
  }

  function ftemp() {
    if (temperatureFbadge > current_tempF_max) {
      current_tempF_max = temperatureFbadge;
    }
    if (temperatureFbadge < current_tempF_min) {
      current_tempF_min = temperatureFbadge;
    }
    document.querySelector("#current_report_dewPoint").textContent =
      dewPointF + "° F";
    if (temperatureFbadge >= 6 || temperatureFbadge <= -6) {
      const countUptemperatureFbadge = new CountUp(
        "current_temp",
        temperatureFbadge,
        options
      );
      countUptemperatureFbadge.start();
    } else {
      document.querySelector("#current_temp").textContent = temperatureFbadge;
    }
    document.querySelector("#current_report_temp").textContent =
      temperatureFbadge + "° F";
    document.querySelector("#current_accufeel").textContent =
      "AccuFeel " + accufeelResultF + "°";
    document.querySelector("#current_report_accufeel").textContent =
      accufeelResultF + "° F";
    document.querySelector("#current_temp_max").textContent =
      current_tempF_max + "°";
    document.querySelector("#current_temp_min").textContent =
      current_tempF_min + "°";

    document.querySelector("#forecast_1_temp").textContent =
      daily_tempF_max_1 + "°";
    document.querySelector("#forecast_2_temp").textContent =
      daily_tempF_max_2 + "°";

    document.querySelector("#forecast_1_temp_min").textContent =
      daily_tempF_min_1 + "°";
    document.querySelector("#forecast_2_temp_min").textContent =
      daily_tempF_min_2 + "°";

    document.querySelector("#forecast_10_temp").textContent =
      daily_tempF_max_1 + "°";
    document.querySelector("#forecast_20_temp").textContent =
      daily_tempF_max_2 + "°";
    document.querySelector("#forecast_30_temp").textContent =
      daily_tempF_max_3 + "°";
    document.querySelector("#forecast_40_temp").textContent =
      daily_tempF_max_4 + "°";
    document.querySelector("#forecast_50_temp").textContent =
      daily_tempF_max_5 + "°";
    document.querySelector("#forecast_60_temp").textContent =
      daily_tempF_max_6 + "°";
    document.querySelector("#forecast_70_temp").textContent =
      daily_tempF_max_7 + "°";

    document.querySelector("#forecast_10_temp_min").textContent =
      daily_tempF_min_1 + "°";
    document.querySelector("#forecast_20_temp_min").textContent =
      daily_tempF_min_2 + "°";
    document.querySelector("#forecast_30_temp_min").textContent =
      daily_tempF_min_3 + "°";
    document.querySelector("#forecast_40_temp_min").textContent =
      daily_tempF_min_4 + "°";
    document.querySelector("#forecast_50_temp_min").textContent =
      daily_tempF_min_5 + "°";
    document.querySelector("#forecast_60_temp_min").textContent =
      daily_tempF_min_6 + "°";
    document.querySelector("#forecast_70_temp_min").textContent =
      daily_tempF_min_7 + "°";

    if (
      (country == "US" ||
        country == "us" ||
        country == "United States of America") &&
      failedHTTP !== "1"
    ) {
      for (i = 1; i < 49; i++) {
        document.querySelector(`#forecast_${i}_hours_temp`).textContent =
          Math.round(usHourlyTempXML[i]) + "°";
      }
    } else {
      var hourlyArray = [];
      for (i = 1; i < 49; i++) {
        hourlyArray.push(
          resultNO.properties.timeseries[i].data.instant.details.air_temperature
        );
      }
      for (i = 0; i < 48; i++) {
        document.querySelector(`#forecast_${i + 1}_hours_temp`).textContent =
          Math.round(c2f(hourlyArray[i])) + "°";
      }
    }

    document.querySelector("#summery_next7_text").textContent = summaryDailyF;
    document.querySelector("#summery_next48_text").textContent = summaryHourlyF;

    document.getElementById("setting_defualt_button_f").disabled = true;
    document.getElementById("setting_defualt_button_c").disabled = false;
    document.getElementById("setting_defualt_button_f").checked = true;

    C_sign_elementStyle.filter = "opacity(65%)";
    F_sign_elementStyle.filter = "opacity(100%)";
    F_sign_elementStyle.position = "absolute";
    F_sign_elementStyle.top = "0px";
    C_sign_elementStyle.position = "absolute";
    C_sign_elementStyle.top = "22px";
    F_sign_elementStyle.fontSize = "20px";
    C_sign_elementStyle.fontSize = "15px";
  }

  function darkDisplay() {
    document.documentElement.setAttribute("data-theme", "dark");
    mapStyle = "mapbox://styles/mapbox/dark-v10?optimize=true";
    weathermapStyle = "mapbox://styles/mapbox/dark-v10?optimize=true";
    document.getElementById("setting_defualt_theme_d").checked = true;
    document.getElementById("checkbox").checked = true;
    chrome.storage.local.set({
      theme: "dark",
    });
  }

  function lightDisplay() {
    document.documentElement.setAttribute("data-theme", "light");
    mapStyle = "mapbox://styles/mapbox/light-v10?optimize=true";
    weathermapStyle = "mapbox://styles/mapbox/light-v10?optimize=true";
    document.getElementById("setting_defualt_theme_l").checked = true;
    document.getElementById("checkbox").checked = false;
    chrome.storage.local.set({
      theme: "light",
    });
  }

  function solarFunction12H() {
    document.querySelector("#solar_now_date").textContent =
      moment.unix(updateTimeBadge + offsetUnix).format("MMMM DD, h:mm A") +
      " (LT)";
    document.querySelector("#aqi_now_date").textContent =
      moment.unix(updateTimeBadge + offsetUnix).format("MMMM DD, h:mm A") +
      " (LT)";
    document.querySelector("#solar_1_time").textContent = moment
      .unix(sunriseTimeSolar + offsetUnix)
      .format("h:mm A");
    document.querySelector("#solar_2_time").textContent = moment
      .unix(sunsetTimeSolar + offsetUnix)
      .format("h:mm A");
    document.querySelector("#solar_3_time").textContent = moment
      .unix(solarNoon + offsetUnix)
      .format("h:mm A");
    document.querySelector("#solar_4_time").textContent = dayLength;
    document.querySelector("#solar_5_time").textContent = moment
      .unix(goldenHourEnd + offsetUnix)
      .format("h:mm A");
    document.querySelector("#solar_6_time").textContent = moment
      .unix(goldenHour + offsetUnix)
      .format("h:mm A");
    document.querySelector("#solar_7_time").textContent = moment
      .unix(dusk + offsetUnix)
      .format("h:mm A");
    document.querySelector("#solar_8_time").textContent = moment
      .unix(dawn + offsetUnix)
      .format("h:mm A");
    document.querySelector("#solar_9_time").textContent = moment
      .unix(nightStarts + offsetUnix)
      .format("h:mm A");
  }

  function solarFunction24H() {
    document.querySelector("#solar_now_date").textContent =
      moment.unix(updateTimeBadge + offsetUnix).format("MMMM DD, HH:mm") +
      " (LT)";
    document.querySelector("#aqi_now_date").textContent =
      moment.unix(updateTimeBadge + offsetUnix).format("MMMM DD, HH:mm") +
      " (LT)";
    document.querySelector("#solar_1_time").textContent = moment
      .unix(sunriseTimeSolar + offsetUnix)
      .format("HH:mm");
    document.querySelector("#solar_2_time").textContent = moment
      .unix(sunsetTimeSolar + offsetUnix)
      .format("HH:mm");
    document.querySelector("#solar_3_time").textContent = moment
      .unix(solarNoon + offsetUnix)
      .format("HH:mm");
    document.querySelector("#solar_4_time").textContent = dayLength;
    document.querySelector("#solar_5_time").textContent = moment
      .unix(goldenHourEnd + offsetUnix)
      .format("HH:mm");
    document.querySelector("#solar_6_time").textContent = moment
      .unix(goldenHour + offsetUnix)
      .format("HH:mm");
    document.querySelector("#solar_7_time").textContent = moment
      .unix(dusk + offsetUnix)
      .format("HH:mm");
    document.querySelector("#solar_8_time").textContent = moment
      .unix(dawn + offsetUnix)
      .format("HH:mm");
    document.querySelector("#solar_9_time").textContent = moment
      .unix(nightStarts + offsetUnix)
      .format("HH:mm");
  }

  function refresh24h12h() {
    chrome.storage.local.get("TimeFormat", function (dataTime) {
      if (dataTime.TimeFormat == "24h") {
        solarFunction24H();
        document.querySelector("#next7_update_date").textContent =
          moment.unix(updateTimeBadge + offsetUnix).format("MMM DD, HH:mm") +
          " (LT)";
        document.querySelector("#report_update_date").textContent =
          moment.unix(updateTimeBadge + offsetUnix).format("MMM DD, HH:mm") +
          " (LT)";
        document.querySelector("#next48_update_date").textContent =
          moment.unix(updateTimeBadge + offsetUnix).format("MMM DD, HH:mm") +
          " (LT)";

        for (i = 1; i < 49; i++) {
          document.querySelector(`#forecast_${i}_hours`).textContent =
            moment
              .unix(
                moment(resultNO.properties.timeseries[i].time).unix() +
                  offsetUnix
              )
              .format("HH") + ":00";
          document.querySelector(`#forecast_${i}_hours_uv`).textContent =
            "UVI " +
            Math.round(
              resultNO.properties.timeseries[i].data.instant.details
                .ultraviolet_index_clear_sky *
                uv_adj_daily(
                  resultNO.properties.timeseries[i].data.instant.details
                    .cloud_area_fraction
                )
            );
          document.querySelector(`#forecast_${i}_hours_rain`).textContent =
            resultNO.properties.timeseries[
              i
            ].data.next_1_hours.details.precipitation_amount;
          document.querySelector(`#forecast_${i}_hours_rain_unit`).textContent =
            "mm";
        }

        document.querySelector("#map_popup_title").textContent =
          "PRECIPITATION FORECAST | UV WEATHER | " +
          moment
            .unix(updateTimeBadge + offsetUnix)
            .format("MMMM DD, YYYY HH:mm") +
          " (LT)";
        document.getElementById("setting_defualt_button_24h").checked = true;
        document.getElementById("setting_defualt_button_12h").checked = false;
        document.getElementById("setting_defualt_button_24h").disabled = true;
        document.getElementById("setting_defualt_button_12h").disabled = false;
      } else {
        solarFunction12H();
        document.querySelector("#next7_update_date").textContent =
          moment.unix(updateTimeBadge + offsetUnix).format("MMM DD, h:mm A") +
          " (LT)";
        document.querySelector("#report_update_date").textContent =
          moment.unix(updateTimeBadge + offsetUnix).format("MMM DD, h:mm A") +
          " (LT)";
        document.querySelector("#next48_update_date").textContent =
          moment.unix(updateTimeBadge + offsetUnix).format("MMM DD, h:mm A") +
          " (LT)";

        for (i = 1; i < 49; i++) {
          document.querySelector(
            `#forecast_${i}_hours`
          ).textContent = moment
            .unix(
              moment(resultNO.properties.timeseries[i].time).unix() + offsetUnix
            )
            .format("h A");
          document.querySelector(`#forecast_${i}_hours_uv`).textContent =
            "UVI " +
            Math.round(
              resultNO.properties.timeseries[i].data.instant.details
                .ultraviolet_index_clear_sky *
                uv_adj_daily(
                  resultNO.properties.timeseries[i].data.instant.details
                    .cloud_area_fraction
                )
            );
          document.querySelector(`#forecast_${i}_hours_rain`).textContent =
            resultNO.properties.timeseries[
              i
            ].data.next_1_hours.details.precipitation_amount;
          document.querySelector(`#forecast_${i}_hours_rain_unit`).textContent =
            "mm";
        }

        document.querySelector("#map_popup_title").textContent =
          "PRECIPITATION FORECAST | UV WEATHER | " +
          moment
            .unix(updateTimeBadge + offsetUnix)
            .format("MMMM DD, YYYY h:mm A") +
          " (LT)";
        document.getElementById("setting_defualt_button_12h").checked = true;
        document.getElementById("setting_defualt_button_24h").checked = false;
        document.getElementById("setting_defualt_button_12h").disabled = true;
        document.getElementById("setting_defualt_button_24h").disabled = false;
      }
    });
  }

  function windFunctionMPH() {
    document.querySelector("#current_report_wind").textContent =
      windSpeedMPH + " mph";

    document.querySelector("#forecast_10_wind").textContent = Math.round(
      daily_wind_1
    );
    document.querySelector("#forecast_10_wind_unit").textContent = "mph";
    document.querySelector("#forecast_20_wind").textContent = Math.round(
      daily_wind_2
    );
    document.querySelector("#forecast_20_wind_unit").textContent = "mph";
    document.querySelector("#forecast_30_wind").textContent = Math.round(
      daily_wind_3
    );
    document.querySelector("#forecast_30_wind_unit").textContent = "mph";
    document.querySelector("#forecast_40_wind").textContent = Math.round(
      daily_wind_4
    );
    document.querySelector("#forecast_40_wind_unit").textContent = "mph";
    document.querySelector("#forecast_50_wind").textContent = Math.round(
      daily_wind_5
    );
    document.querySelector("#forecast_50_wind_unit").textContent = "mph";
    document.querySelector("#forecast_60_wind").textContent = Math.round(
      daily_wind_6
    );
    document.querySelector("#forecast_60_wind_unit").textContent = "mph";
    document.querySelector("#forecast_70_wind").textContent = Math.round(
      daily_wind_7
    );
    document.querySelector("#forecast_70_wind_unit").textContent = "mph";
  }

  function windFunctionKMH() {
    document.querySelector("#current_report_wind").textContent =
      windSpeedKMH + " km/h";

    document.querySelector("#forecast_10_wind").textContent = Math.round(
      daily_wind_1 * 1.609334
    );
    document.querySelector("#forecast_10_wind_unit").textContent = "km/h";
    document.querySelector("#forecast_20_wind").textContent = Math.round(
      daily_wind_2 * 1.609334
    );
    document.querySelector("#forecast_20_wind_unit").textContent = "km/h";
    document.querySelector("#forecast_30_wind").textContent = Math.round(
      daily_wind_3 * 1.609334
    );
    document.querySelector("#forecast_30_wind_unit").textContent = "km/h";
    document.querySelector("#forecast_40_wind").textContent = Math.round(
      daily_wind_4 * 1.609334
    );
    document.querySelector("#forecast_40_wind_unit").textContent = "km/h";
    document.querySelector("#forecast_50_wind").textContent = Math.round(
      daily_wind_5 * 1.609334
    );
    document.querySelector("#forecast_50_wind_unit").textContent = "km/h";
    document.querySelector("#forecast_60_wind").textContent = Math.round(
      daily_wind_6 * 1.609334
    );
    document.querySelector("#forecast_60_wind_unit").textContent = "km/h";
    document.querySelector("#forecast_70_wind").textContent = Math.round(
      daily_wind_7 * 1.609334
    );
    document.querySelector("#forecast_70_wind_unit").textContent = "km/h";
  }

  function windFunctionMS() {
    document.querySelector("#current_report_wind").textContent =
      windSpeedMS + " m/s";

    document.querySelector("#forecast_10_wind").textContent = Math.round(
      daily_wind_1 * 0.4470389
    );
    document.querySelector("#forecast_10_wind_unit").textContent = "m/s";
    document.querySelector("#forecast_20_wind").textContent = Math.round(
      daily_wind_2 * 0.4470389
    );
    document.querySelector("#forecast_20_wind_unit").textContent = "m/s";
    document.querySelector("#forecast_30_wind").textContent = Math.round(
      daily_wind_3 * 0.4470389
    );
    document.querySelector("#forecast_30_wind_unit").textContent = "m/s";
    document.querySelector("#forecast_40_wind").textContent = Math.round(
      daily_wind_4 * 0.4470389
    );
    document.querySelector("#forecast_40_wind_unit").textContent = "m/s";
    document.querySelector("#forecast_50_wind").textContent = Math.round(
      daily_wind_5 * 0.4470389
    );
    document.querySelector("#forecast_50_wind_unit").textContent = "m/s";
    document.querySelector("#forecast_60_wind").textContent = Math.round(
      daily_wind_6 * 0.4470389
    );
    document.querySelector("#forecast_60_wind_unit").textContent = "m/s";
    document.querySelector("#forecast_70_wind").textContent = Math.round(
      daily_wind_7 * 0.4470389
    );
    document.querySelector("#forecast_70_wind_unit").textContent = "m/s";
  }

  function refreshWindSpeedUnit() {
    chrome.storage.local.get("windUnit", function (dataWind) {
      if (dataWind.windUnit == "mph") {
        windFunctionMPH();
      } else if (dataWind.windUnit == "kmh") {
        windFunctionKMH();
      } else if (dataWind.windUnit == "ms") {
        windFunctionMS();
      }
    });
  }

  function next48Function() {
    for (i = 1; i < 49; i++) {
      forecast_hours_icon_no =
        resultNO.properties.timeseries[i].data.next_1_hours.summary.symbol_code;
      forecast_hours_icon = iconConvertNO_HD(
        forecast_hours_icon_no.split("_")[0],
        forecast_hours_icon_no.split("_")[1]
      );

      switch (forecast_hours_icon) {
        case "clear-day":
          document.querySelector(
            ".forecast_" + i + "_hours_icon_Class"
          ).style.backgroundImage = 'url("images/weather_icon/b_sun.svg")';
          break;
        case "clear-night":
          document.querySelector(
            ".forecast_" + i + "_hours_icon_Class"
          ).style.backgroundImage = 'url("images/weather_icon/b_moon.svg")';
          break;
        case "rain":
          document.querySelector(
            ".forecast_" + i + "_hours_icon_Class"
          ).style.backgroundImage =
            'url("images/weather_icon/b_cloud_rain.svg")';
          break;
        case "snow":
          document.querySelector(
            ".forecast_" + i + "_hours_icon_Class"
          ).style.backgroundImage =
            'url("images/weather_icon/b_cloud_snow.svg")';
          break;
        case "sleet":
          document.querySelector(
            ".forecast_" + i + "_hours_icon_Class"
          ).style.backgroundImage =
            'url("images/weather_icon/b_cloud_snow_alt.svg")';
          break;
        case "wind":
          document.querySelector(
            ".forecast_" + i + "_hours_icon_Class"
          ).style.backgroundImage = 'url("images/weather_icon/b_wind.svg")';
          break;
        case "fog":
          document.querySelector(
            ".forecast_" + i + "_hours_icon_Class"
          ).style.backgroundImage =
            'url("images/weather_icon/b_cloud_fog_alt.svg")';
          break;
        case "cloudy":
          document.querySelector(
            ".forecast_" + i + "_hours_icon_Class"
          ).style.backgroundImage = 'url("images/weather_icon/b_cloud.svg")';
          break;
        case "partly-cloudy-day":
          document.querySelector(
            ".forecast_" + i + "_hours_icon_Class"
          ).style.backgroundImage =
            'url("images/weather_icon/b_cloud_sun.svg")';
          break;
        case "partly-cloudy-night":
          document.querySelector(
            ".forecast_" + i + "_hours_icon_Class"
          ).style.backgroundImage =
            'url("images/weather_icon/b_cloud_moon.svg")';
          break;
        default:
          document.querySelector(
            ".forecast_" + i + "_hours_icon_Class"
          ).style.backgroundImage = 'url("images/weather_icon/b_sun.svg")';
          break;
      }
    }
  }

  function next7Function() {
    document.querySelector("#forecast_1_day").textContent = moment
      .unix(daily_date_1)
      .format("dddd");
    document.querySelector("#forecast_2_day").textContent = moment
      .unix(daily_date_2)
      .format("dddd");

    document.querySelector("#forecast_10_day").textContent = moment
      .unix(daily_date_1)
      .format("dddd");

    document.querySelector("#forecast_10_wind_arrow").style.transform =
      "rotate(" + daily_windBearing_1 + "deg)";

    document.querySelector("#forecast_20_day").textContent = moment
      .unix(daily_date_2)
      .format("dddd");

    document.querySelector("#forecast_20_wind_arrow").style.transform =
      "rotate(" + daily_windBearing_2 + "deg)";

    document.querySelector("#forecast_30_day").textContent = moment
      .unix(daily_date_3)
      .format("dddd");

    document.querySelector("#forecast_30_wind_arrow").style.transform =
      "rotate(" + daily_windBearing_3 + "deg)";

    document.querySelector("#forecast_40_day").textContent = moment
      .unix(daily_date_4)
      .format("dddd");

    document.querySelector("#forecast_40_wind_arrow").style.transform =
      "rotate(" + daily_windBearing_4 + "deg)";

    document.querySelector("#forecast_50_day").textContent = moment
      .unix(daily_date_5)
      .format("dddd");

    document.querySelector("#forecast_50_wind_arrow").style.transform =
      "rotate(" + daily_windBearing_5 + "deg)";

    document.querySelector("#forecast_60_day").textContent = moment
      .unix(daily_date_6)
      .format("dddd");

    document.querySelector("#forecast_60_wind_arrow").style.transform =
      "rotate(" + daily_windBearing_6 + "deg)";

    document.querySelector("#forecast_70_day").textContent = moment
      .unix(daily_date_7)
      .format("dddd");

    document.querySelector("#forecast_70_wind_arrow").style.transform =
      "rotate(" + daily_windBearing_7 + "deg)";

    document.querySelector(
      ".forecast_10_homePage_icon_Class"
    ).style.backgroundImage = daily_icon_url[1];
    document.querySelector(
      ".forecast_20_homePage_icon_Class"
    ).style.backgroundImage = daily_icon_url[2];

    document.querySelector(".forecast_1_icon_Class").style.backgroundImage =
      daily_icon_url[1];
    document.querySelector(".forecast_2_icon_Class").style.backgroundImage =
      daily_icon_url[2];
    document.querySelector(".forecast_3_icon_Class").style.backgroundImage =
      daily_icon_url[3];
    document.querySelector(".forecast_4_icon_Class").style.backgroundImage =
      daily_icon_url[4];
    document.querySelector(".forecast_5_icon_Class").style.backgroundImage =
      daily_icon_url[5];
    document.querySelector(".forecast_6_icon_Class").style.backgroundImage =
      daily_icon_url[6];
    document.querySelector(".forecast_7_icon_Class").style.backgroundImage =
      daily_icon_url[7];
  }

  function reportFunction() {
    document.querySelector("#title_report_text").textContent = citys.slice(
      0,
      30
    );
    document.querySelector(
      "#current_report_summary"
    ).textContent = summaryMinutely;
    document.querySelector("#current_report_uv").textContent = uv1;
    document.querySelector("#current_report_uv_note").textContent =
      " " + uv_note(uv1);
    document.querySelector("#current_report_windBearing").textContent =
      windBearing + "° ";
    document.querySelector(
      "#current_report_windBearing_windCompass"
    ).textContent = " (" + windCompass + ")";
    document.querySelector("#current_report_humidity").textContent =
      humidity + "%";
    document.querySelector("#current_report_pressure").textContent =
      pressure + " mb (hPa)";
    document.querySelector("#current_report_cloud").textContent =
      cloudCoverBadge + "%";
    document.querySelector(
      "#current_report_precipitation"
    ).textContent = precipProbability;
    document.querySelector(
      "#current_report_precipitation_unit"
    ).textContent = precipProbabilityUnit;
  }

  function trackSunExposure() {
    if (uv1 == 0 || isNight) {
      document.querySelector("#link_qsun_text").textContent =
        "UV Weather App for iOS & Android";
    } else {
      document.querySelector("#link_qsun_text").textContent =
        "UV Weather App for iOS & Android";
    }
  }

  function updateBadge() {
    var capitalize = (s) => {
      if (typeof s !== "string") return "";
      return s.charAt(0).toUpperCase() + s.slice(1);
    };

    chrome.storage.local.get(
      [
        "setSettingFC",
        "setSettingUT",
        "whiteIcon",
        "badgeSize",
        "TimeFormat",
        "cloudyBadge",
        "rainyBadge",
        "snowyBadge",
        "sunnyDayBadge",
        "isDay",
        "isNight",
      ],
      function (data) {
        setSettingFC = data.setSettingFC;
        setSettingUT = data.setSettingUT;
        currentWhiteIcon = data.whiteIcon;
        currentBadgeSize = data.badgeSize;
        TimeFormat = data.TimeFormat;
        cloudyBadge = data.cloudyBadge;
        rainyBadge = data.rainyBadge;
        snowyBadge = data.snowyBadge;
        sunnyDayBadge = data.sunnyDayBadge;
        isDay = data.isDay;
        isNight = data.isNight;

        if (
          currentWhiteIcon == 0 ||
          typeof currentWhiteIcon == "undefined" ||
          currentWhiteIcon == "undefined"
        ) {
          currentWhiteIcon = 0;
        } else {
          currentWhiteIcon = 1;
        }
        if (setSettingUT == "t" && setSettingFC == "c") {
          if (currentBadgeSize == 1) {
            largBadgeNumber(temperatureCbadge, currentWhiteIcon);
          } else {
            badgeBackgroundColor(
              isDay,
              isNight,
              sunnyDayBadge,
              cloudyBadge,
              rainyBadge,
              snowyBadge,
              temperatureFbadge,
              currentWhiteIcon
            );
            chrome.action.setBadgeText({
              text: temperatureCbadge + "°C",
            });
            badgeBackgroundImage(
              isDay,
              isNight,
              sunnyDayBadge,
              cloudyBadge,
              rainyBadge,
              snowyBadge,
              temperatureFbadge,
              currentWhiteIcon
            );
          }
        } else if (setSettingUT == "t" && setSettingFC == "f") {
          if (currentBadgeSize == 1) {
            largBadgeNumber(temperatureFbadge, currentWhiteIcon);
          } else {
            badgeBackgroundColor(
              isDay,
              isNight,
              sunnyDayBadge,
              cloudyBadge,
              rainyBadge,
              snowyBadge,
              temperatureFbadge,
              currentWhiteIcon
            );
            chrome.action.setBadgeText({
              text: temperatureFbadge + "°F",
            });
            badgeBackgroundImage(
              isDay,
              isNight,
              sunnyDayBadge,
              cloudyBadge,
              rainyBadge,
              snowyBadge,
              temperatureFbadge,
              currentWhiteIcon
            );
          }
        } else if (setSettingUT == "u") {
          chrome.storage.local.set({
            setSettingUT: "u",
          });
          if (uv1 > 9) {
            if (currentBadgeSize == 1) {
              largBadgeNumber(uv1, currentWhiteIcon);
            } else {
              badgeBackgroundColor(
                isDay,
                isNight,
                sunnyDayBadge,
                cloudyBadge,
                rainyBadge,
                snowyBadge,
                temperatureFbadge,
                currentWhiteIcon
              );
              chrome.action.setBadgeText({
                text: "UV" + uv1,
              });
              badgeBackgroundImage(
                isDay,
                isNight,
                sunnyDayBadge,
                cloudyBadge,
                rainyBadge,
                snowyBadge,
                temperatureFbadge,
                currentWhiteIcon
              );
            }
          } else {
            if (currentBadgeSize == 1) {
              largBadgeNumber(uv1, currentWhiteIcon);
            } else {
              badgeBackgroundColor(
                isDay,
                isNight,
                sunnyDayBadge,
                cloudyBadge,
                rainyBadge,
                snowyBadge,
                temperatureFbadge,
                currentWhiteIcon
              );
              chrome.action.setBadgeText({
                text: "UV " + uv1,
              });
              badgeBackgroundImage(
                isDay,
                isNight,
                sunnyDayBadge,
                cloudyBadge,
                rainyBadge,
                snowyBadge,
                temperatureFbadge,
                currentWhiteIcon
              );
            }
          }
        }

        if (TimeFormat == "24h") {
          updateTimeRelativeBadge = moment
            .unix(updateTimeBadge)
            .format("HH:mm");
        } else {
          updateTimeRelativeBadge = moment
            .unix(updateTimeBadge)
            .format("h:mm A");
        }

        if (setSettingUT == "u") {
          toolTipBadge =
            uv1 +
            " UVI " +
            uv_note(uv1) +
            " - " +
            citys +
            "\n" +
            "Updated at " +
            updateTimeRelativeBadge;
          chrome.action.setTitle({
            title: toolTipBadge,
          });
        } else if (setSettingUT == "t" && setSettingFC == "f") {
          toolTipBadge =
            temperatureFbadge +
            "° " +
            capitalize(summaryBadge) +
            " - " +
            citys +
            "\n" +
            "Updated at " +
            updateTimeRelativeBadge;
          chrome.action.setTitle({
            title: toolTipBadge,
          });
        } else if (setSettingUT == "t" && setSettingFC == "c") {
          toolTipBadge =
            temperatureCbadge +
            "° " +
            capitalize(summaryBadge) +
            " - " +
            citys +
            "\n" +
            "Updated at " +
            updateTimeRelativeBadge;
          chrome.action.setTitle({
            title: toolTipBadge,
          });
        }
      }
    );
  }

  function delayButtonDarkmodeSetting() {
    setTimeout(function () {
      document.querySelector(
        "#setting_defualt_theme_d_all"
      ).style.pointerEvents = "auto";
      document.querySelector(
        "#setting_defualt_theme_l_all"
      ).style.pointerEvents = "auto";
    }, 1000);
  }

  function closeAllPopup() {
    modalSetting.style.display = "none";
    modalAqi.style.display = "none";
    modalFeedback.style.display = "none";
    modal48hours.style.display = "none";
    modal7days.style.display = "none";
    modalSolar.style.display = "none";
    modalCurrent.style.display = "none";
    modalSearch.style.display = "none";
    if (document.querySelector(".toastify-top") !== null) {
      locationToast.hideToast();
    }
  }

  function removeClassIcons() {
    var aqiIcon = document.getElementById("aqi_icon_popup_page");
    var solarIcon = document.getElementById("solar_icon_popup_page");
    var homeIcon = document.getElementById("home_icon_popup_page");
    var next7Icon = document.getElementById("next7_icon_popup_page");
    var next48Icon = document.getElementById("next48_icon_popup_page");
    aqiIcon.classList.remove("sub_menu_icon_active_Class");
    solarIcon.classList.remove("sub_menu_icon_active_Class");
    homeIcon.classList.remove("sub_menu_icon_active_Class");
    next7Icon.classList.remove("sub_menu_icon_active_Class");
    next48Icon.classList.remove("sub_menu_icon_active_Class");
    aqiIcon.classList.remove("sub_menu_current_icon_Class");
    solarIcon.classList.remove("sub_menu_current_icon_Class");
    homeIcon.classList.remove("sub_menu_current_icon_Class");
    next7Icon.classList.remove("sub_menu_current_icon_Class");
    next48Icon.classList.remove("sub_menu_current_icon_Class");

    var aqiSub = document.getElementById("sub_menu_aqi");
    var solarSub = document.getElementById("sub_menu_solar");
    var homeSub = document.getElementById("sub_menu_home");
    var next7Sub = document.getElementById("sub_menu_next7");
    var next48Sub = document.getElementById("sub_menu_next48");
    aqiSub.classList.remove("sub_menu_current_Class");
    solarSub.classList.remove("sub_menu_current_Class");
    homeSub.classList.remove("sub_menu_current_Class");
    next7Sub.classList.remove("sub_menu_current_Class");
    next48Sub.classList.remove("sub_menu_current_Class");
  }

  function delayButtonBadgeSize() {
    setTimeout(function () {
      document.getElementById("checkbox_largIcon").disabled = false;
    }, 1000);
  }

  function delayButtonIntervalUpdate() {
    setTimeout(function () {
      document.querySelector(
        "#setting_defualt_button_15_all"
      ).style.pointerEvents = "auto";
      document.querySelector(
        "#setting_defualt_button_30_all"
      ).style.pointerEvents = "auto";
      document.querySelector(
        "#setting_defualt_button_60_all"
      ).style.pointerEvents = "auto";
      document.querySelector(
        "#setting_defualt_button_90_all"
      ).style.pointerEvents = "auto";
      document.querySelector(
        "#setting_defualt_button_120_all"
      ).style.pointerEvents = "auto";
    }, 750);
  }

  function delayReleaseButtonSetting() {
    setTimeout(function () {
      document.getElementById(
        "setting_defualt_button_c_all"
      ).style.pointerEvents = "auto";
      document.getElementById(
        "setting_defualt_button_f_all"
      ).style.pointerEvents = "auto";
      document.getElementById(
        "setting_defualt_button_u_all"
      ).style.pointerEvents = "auto";
      document.getElementById(
        "setting_defualt_button_t_all"
      ).style.pointerEvents = "auto";
      document.getElementById(
        "setting_defualt_button_12h_all"
      ).style.pointerEvents = "auto";
      document.getElementById(
        "setting_defualt_button_24h_all"
      ).style.pointerEvents = "auto";
      document.querySelector(
        ".setting_section_badge_size_Class"
      ).style.pointerEvents = "auto";
      document.getElementById(
        "setting_defualt_button_mph_all"
      ).style.pointerEvents = "auto";
      document.getElementById(
        "setting_defualt_button_kmh_all"
      ).style.pointerEvents = "auto";
      document.getElementById(
        "setting_defualt_button_ms_all"
      ).style.pointerEvents = "auto";
    }, 1000);
  }

  function delayButtonSetting() {
    document.getElementById(
      "setting_defualt_button_c_all"
    ).style.pointerEvents = "none";
    document.getElementById(
      "setting_defualt_button_f_all"
    ).style.pointerEvents = "none";
    document.getElementById(
      "setting_defualt_button_u_all"
    ).style.pointerEvents = "none";
    document.getElementById(
      "setting_defualt_button_t_all"
    ).style.pointerEvents = "none";
    document.getElementById(
      "setting_defualt_button_12h_all"
    ).style.pointerEvents = "none";
    document.getElementById(
      "setting_defualt_button_24h_all"
    ).style.pointerEvents = "none";
    document.querySelector(
      ".setting_section_badge_size_Class"
    ).style.pointerEvents = "none";
    document.getElementById(
      "setting_defualt_button_mph_all"
    ).style.pointerEvents = "none";
    document.getElementById(
      "setting_defualt_button_kmh_all"
    ).style.pointerEvents = "none";
    document.getElementById(
      "setting_defualt_button_ms_all"
    ).style.pointerEvents = "none";
  }

  /// Click event ------------------------------------------------------------------------------

  document
    .querySelector(".sidebarIconToggle")
    .addEventListener("click", (e) => {
      if (document.querySelector(".toastify-top") !== null) {
        locationToast.hideToast();
      }
    });

  document
    .querySelector(".forecast_day1_link_Class")
    .addEventListener("click", (e) => {
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

  document
    .querySelector(".forecast_day2_link_Class")
    .addEventListener("click", (e) => {
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

  document
    .querySelector("#setting_defualt_theme_d_all")
    .addEventListener("click", (e) => {
      darkDisplay();
      document.querySelector(
        "#setting_defualt_theme_d_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_theme_l_all"
      ).style.pointerEvents = "none";
      delayButtonDarkmodeSetting();
    });

  document
    .querySelector("#setting_defualt_theme_l_all")
    .addEventListener("click", (e) => {
      lightDisplay();
      document.querySelector(
        "#setting_defualt_theme_d_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_theme_l_all"
      ).style.pointerEvents = "none";
      delayButtonDarkmodeSetting();
    });

  document
    .querySelector("#setting_defualt_button_u_all")
    .addEventListener("click", (e) => {
      setSettingUT = "u";
      chrome.storage.local.set({
        setSettingUT: "u",
      });
      delayButtonSetting();
      updateBadge();
      document.getElementById("setting_defualt_button_u").checked = true;
      document.getElementById("setting_defualt_button_t").checked = false;
      delayReleaseButtonSetting();
    });

  document
    .querySelector("#setting_defualt_button_t_all")
    .addEventListener("click", (e) => {
      setSettingUT = "t";
      chrome.storage.local.set({
        setSettingUT: "t",
      });
      delayButtonSetting();
      updateBadge();
      document.getElementById("setting_defualt_button_t").checked = true;
      document.getElementById("setting_defualt_button_u").checked = false;
      delayReleaseButtonSetting();
    });

  document
    .querySelector("#setting_defualt_button_c_all")
    .addEventListener("click", (e) => {
      chrome.storage.local.get("setSettingFC", function (data) {
        if (data.setSettingFC !== "c") {
          setSettingFC = "c";
          chrome.storage.local.set({
            setSettingFC: "c",
          });
          ctemp();
          updateBadge();
        }
        delayButtonSetting();
        delayReleaseButtonSetting();
      });
    });

  document
    .querySelector("#setting_defualt_button_f_all")
    .addEventListener("click", (e) => {
      chrome.storage.local.get("setSettingFC", function (data) {
        if (data.setSettingFC !== "f") {
          setSettingFC = "f";
          chrome.storage.local.set({
            setSettingFC: "f",
          });
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
    setTimeout(function () {
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

  document
    .querySelector("#search_popup_page")
    .addEventListener("click", (e) => {
      if (modalSearch.style.display !== "block") {
        chrome.storage.local.set({
          firstTimeSaerchPopupInSession: 1,
        });
        closeAllPopup();
        removeClassIcons();
        modalSearch.style.display = "block";
        setTimeout(function () {
          document.getElementById("search_popup_close").style.visibility =
            "visible";
          searchTitle.style.visibility = "visible";
          searchInner.style.visibility = "visible";
          searchMap(mapStyle);
        }, 300);

        var currentIcon = document.getElementById("home_icon_popup_page");
        currentIcon.classList.add("sub_menu_current_icon_Class");

        var currentSubMenu = document.getElementById("sub_menu_home");
        currentSubMenu.classList.add("sub_menu_current_Class");
      }
    });

  document.querySelector("#location").addEventListener("click", (e) => {
    if (modalSearch.style.display !== "block") {
      chrome.storage.local.set({
        firstTimeSaerchPopupInSession: 1,
      });
      document.getElementById("openSidebarMenu").checked = false;
      closeAllPopup();
      removeClassIcons();
      modalSearch.style.display = "block";
      setTimeout(function () {
        document.getElementById("search_popup_close").style.visibility =
          "visible";
        searchTitle.style.visibility = "visible";
        searchInner.style.visibility = "visible";
      }, 300);
      searchMap(mapStyle);

      var currentIcon = document.getElementById("home_icon_popup_page");
      currentIcon.classList.add("sub_menu_current_icon_Class");

      var currentSubMenu = document.getElementById("sub_menu_home");
      currentSubMenu.classList.add("sub_menu_current_Class");
    }
  });

  document.querySelector("#sidebar_search").addEventListener("click", (e) => {
    chrome.storage.local.set({
      firstTimeSaerchPopupInSession: 1,
    });
    document.getElementById("openSidebarMenu").checked = false;
    closeAllPopup();
    removeClassIcons();
    modalSearch.style.display = "block";
    setTimeout(function () {
      document.getElementById("search_popup_close").style.visibility =
        "visible";
      searchTitle.style.visibility = "visible";
      searchInner.style.visibility = "visible";
    }, 300);
    searchMap(mapStyle);

    var currentIcon = document.getElementById("home_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_home");
    currentSubMenu.classList.add("sub_menu_current_Class");
  });

  document.querySelector("#aqi_popup_page").addEventListener("click", (e) => {
    closeAllPopup();
    removeClassIcons();
    document.querySelector(".aqi-loading-dots").style.display = "block";
    document.querySelector("#aqi").style.opacity = ".2";

    modalAqi.style.display = "block";
    var element = document.getElementById("aqi_icon_popup_page");
    element.classList.add("sub_menu_icon_active_Class");

    var currentIcon = document.getElementById("aqi_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_aqi");
    currentSubMenu.classList.add("sub_menu_current_Class");

    aqi(latlong);
  });

  document.querySelector("#sidebar_setting").addEventListener("click", (e) => {
    document.getElementById("openSidebarMenu").checked = false;
    closeAllPopup();
    removeClassIcons();
    modalSetting.style.display = "block";
  });

  document.querySelector("#sidebar_feedback").addEventListener("click", (e) => {
    document.getElementById("openSidebarMenu").checked = false;
    closeAllPopup();
    removeClassIcons();
    modalFeedback.style.display = "flex";
    var element = document.getElementById("aqi_icon_popup_page");
    element.classList.add("sub_menu_icon_active_Class");

    var currentIcon = document.getElementById("aqi_icon_popup_page");
    currentIcon.classList.add("sub_menu_current_icon_Class");

    var currentSubMenu = document.getElementById("sub_menu_aqi");
    currentSubMenu.classList.add("sub_menu_current_Class");
  });

  document.querySelector("#sidebar_map").addEventListener("click", (e) => {
    document.getElementById("openSidebarMenu").checked = false;
    closeAllPopup();
    removeClassIcons();
    setTimeout(function () {
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

  document
    .querySelector("#report_popup_close")
    .addEventListener("click", (e) => {
      closeAllPopup();
      removeClassIcons();
      var element = document.getElementById("home_icon_popup_page");
      element.classList.add("sub_menu_icon_active_Class");

      var currentIcon = document.getElementById("home_icon_popup_page");
      currentIcon.classList.add("sub_menu_current_icon_Class");

      var currentSubMenu = document.getElementById("sub_menu_home");
      currentSubMenu.classList.add("sub_menu_current_Class");
    });

  document
    .querySelector("#setting_popup_close")
    .addEventListener("click", (e) => {
      closeAllPopup();
      removeClassIcons();
      var element = document.getElementById("home_icon_popup_page");
      element.classList.add("sub_menu_icon_active_Class");

      var currentIcon = document.getElementById("home_icon_popup_page");
      currentIcon.classList.add("sub_menu_current_icon_Class");

      var currentSubMenu = document.getElementById("sub_menu_home");
      currentSubMenu.classList.add("sub_menu_current_Class");
    });

  document
    .querySelector("#feedback_popup_close")
    .addEventListener("click", (e) => {
      closeAllPopup();
      removeClassIcons();
      var element = document.getElementById("home_icon_popup_page");
      element.classList.add("sub_menu_icon_active_Class");

      var currentIcon = document.getElementById("home_icon_popup_page");
      currentIcon.classList.add("sub_menu_current_icon_Class");

      var currentSubMenu = document.getElementById("sub_menu_home");
      currentSubMenu.classList.add("sub_menu_current_Class");
    });

  const feedback_popup = document.getElementById("feedback_popup");
  const emailFeedback = document.getElementById("emailFeedback");
  const submitFeedback = document.getElementById("submitFeedback");
  const nameFeedback = document.getElementById("nameFeedback");
  const messageFeedback = document.getElementById("messageFeedback");

  var feedbackFunction = function (event) {
    isValidEmail = emailFeedback.checkValidity();
    isValidName = nameFeedback.checkValidity();
    isValidMessage = messageFeedback.checkValidity();

    if (isValidEmail && isValidName && isValidMessage) {
      submitFeedback.disabled = false;
      submitFeedback.style.cursor = "pointer";
      submitFeedback.style.color = "#ff662b";
      submitFeedback.style.fontWeight = "500";
    } else {
      submitFeedback.disabled = true;
      submitFeedback.style.cursor = "not-allowed";
      submitFeedback.style.color = "#b3aca7";
      submitFeedback.style.fontWeight = "400";
    }
  };

  emailFeedback.addEventListener("keyup", feedbackFunction, false);
  nameFeedback.addEventListener("keyup", feedbackFunction, false);
  messageFeedback.addEventListener("keyup", feedbackFunction, false);

  document.querySelector("#submitFeedback").addEventListener("click", (e) => {
    setTimeout(function () {
      closeAllPopup();
      removeClassIcons();
      var element = document.getElementById("home_icon_popup_page");
      element.classList.add("sub_menu_icon_active_Class");

      var currentIcon = document.getElementById("home_icon_popup_page");
      currentIcon.classList.add("sub_menu_current_icon_Class");

      var currentSubMenu = document.getElementById("sub_menu_home");
      currentSubMenu.classList.add("sub_menu_current_Class");
    }, 400);
  });

  document
    .querySelector("#search_popup_close")
    .addEventListener("click", (e) => {
      setTimeout(function () {
        document.getElementById("search_popup_close").style.transition =
          "all 0s";
        document.getElementById("search_popup_close").style.visibility =
          "hidden";
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
    setTimeout(function () {
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
    chrome.storage.local.get("setSettingFC", function (data) {
      if (data.setSettingFC !== "f") {
        ftemp();
        setSettingFC = "f";
        chrome.storage.local.set({
          setSettingFC: "f",
        });
        updateBadge();
      }
    });
  });

  document.querySelector("#C_sign").addEventListener("click", (e) => {
    chrome.storage.local.get("setSettingFC", function (data) {
      if (data.setSettingFC !== "c") {
        ctemp();
        setSettingFC = "c";
        chrome.storage.local.set({
          setSettingFC: "c",
        });
        updateBadge();
      }
    });
  });

  document.querySelector("#donate_button").addEventListener("click", (e) => {
    window.open("https://uvweather.net/donate");
  });

  document.querySelector("#icon_close_box").addEventListener("click", (e) => {
    chrome.storage.local.set({
      closeAds: "1",
    });
    if (document.querySelector(".toastify-top") !== null) {
      locationToast.hideToast();
    }
    var donateButton = document.getElementById("donate_button");
    var donateClose = document.getElementById("icon_close_box");
    var donateCard = document.getElementById("cardMain");
    donateButton.style.display = "none";
    donateClose.style.display = "none";
    donateCard.style.display = "none";
  });

  document
    .querySelector("#setting_defualt_button_12h_all")
    .addEventListener("click", (e) => {
      chrome.storage.local.set({
        TimeFormat: "12h",
      });
      document.getElementById("setting_defualt_button_12h").checked = true;
      solarFunction12H();
      refresh24h12h();
      delayButtonSetting();
      delayReleaseButtonSetting();
    });

  document
    .querySelector("#setting_defualt_button_24h_all")
    .addEventListener("click", (e) => {
      chrome.storage.local.set({
        TimeFormat: "24h",
      });
      document.getElementById("setting_defualt_button_24h").checked = true;
      solarFunction24H();
      refresh24h12h();
      delayButtonSetting();
      delayReleaseButtonSetting();
    });

  document
    .querySelector("#setting_defualt_button_mph_all")
    .addEventListener("click", (e) => {
      chrome.storage.local.set({
        windUnit: "mph",
      });
      document.getElementById("setting_defualt_button_mph").checked = true;
      refreshWindSpeedUnit();
      delayButtonSetting();
      delayReleaseButtonSetting();
    });

  document
    .querySelector("#setting_defualt_button_kmh_all")
    .addEventListener("click", (e) => {
      chrome.storage.local.set({
        windUnit: "kmh",
      });
      document.getElementById("setting_defualt_button_kmh").checked = true;
      refreshWindSpeedUnit();
      delayButtonSetting();
      delayReleaseButtonSetting();
    });

  document
    .querySelector("#setting_defualt_button_ms_all")
    .addEventListener("click", (e) => {
      chrome.storage.local.set({
        windUnit: "ms",
      });
      document.getElementById("setting_defualt_button_ms").checked = true;
      refreshWindSpeedUnit();
      delayButtonSetting();
      delayReleaseButtonSetting();
    });

  document
    .querySelector("#setting_defualt_button_15_all")
    .addEventListener("click", (e) => {
      chrome.storage.local.set({
        IntervalUpdate: "15",
      });
      chrome.runtime.sendMessage({
        msg: "intervalUpdateMessage",
      });
      document.querySelector(
        "#setting_defualt_button_15_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_30_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_60_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_90_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_120_all"
      ).style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_15").checked = true;
      delayButtonIntervalUpdate();
    });

  document
    .querySelector("#setting_defualt_button_30_all")
    .addEventListener("click", (e) => {
      chrome.storage.local.set({
        IntervalUpdate: "30",
      });
      chrome.runtime.sendMessage({
        msg: "intervalUpdateMessage",
      });
      document.querySelector(
        "#setting_defualt_button_15_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_30_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_60_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_90_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_120_all"
      ).style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_30").checked = true;
      delayButtonIntervalUpdate();
    });

  document
    .querySelector("#setting_defualt_button_60_all")
    .addEventListener("click", (e) => {
      chrome.storage.local.set({
        IntervalUpdate: "60",
      });
      chrome.runtime.sendMessage({
        msg: "intervalUpdateMessage",
      });
      document.querySelector(
        "#setting_defualt_button_15_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_30_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_60_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_90_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_120_all"
      ).style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_60").checked = true;
      delayButtonIntervalUpdate();
    });

  document
    .querySelector("#setting_defualt_button_90_all")
    .addEventListener("click", (e) => {
      chrome.storage.local.set({
        IntervalUpdate: "90",
      });
      chrome.runtime.sendMessage({
        msg: "intervalUpdateMessage",
      });
      document.querySelector(
        "#setting_defualt_button_15_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_30_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_60_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_90_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_120_all"
      ).style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_90").checked = true;
      delayButtonIntervalUpdate();
    });

  document
    .querySelector("#setting_defualt_button_120_all")
    .addEventListener("click", (e) => {
      chrome.storage.local.set({
        IntervalUpdate: "120",
      });
      chrome.runtime.sendMessage({
        msg: "intervalUpdateMessage",
      });
      document.querySelector(
        "#setting_defualt_button_15_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_30_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_60_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_90_all"
      ).style.pointerEvents = "none";
      document.querySelector(
        "#setting_defualt_button_120_all"
      ).style.pointerEvents = "none";
      document.getElementById("setting_defualt_button_120").checked = true;
      delayButtonIntervalUpdate();
    });

  /// Search & Map-------------------------------------------------------------------------------
  function searchMap(mapStyle) {
    var element = document.getElementById("mapSearch");
    element.classList.add("blurIn");
    setTimeout(function () {
      element.classList.add("blurOut");
    }, 400);

    mapboxgl.accessToken =
      "pk.eyJ1IjoidXZ3IiwiYSI6ImNrOTY4dzRiMTAyMnUzZXBheHppanV2MXIifQ.jFdHCvYe2u-LUw-_9mcw_g";
    if (typeof latlong !== "undefined") {
      latandlongMapBox = latlong.split(",").reverse().join(",");
      latandlongMapBox = JSON.parse("[" + latandlongMapBox + "]");
    } else {
      latandlongMapBox = [-79.3832, 43.6532];
    }

    function updateGeocoderProximity() {
      var center = map.getCenter().wrap();
      geocoder.setProximity({
        longitude: center.lng,
        latitude: center.lat,
      });
    }

    function onDragEnd() {
      var lngLat = marker.getLngLat();
      latClick = lngLat.lat;
      lngClick = lngLat.lng;

      latlong = latClick + "," + lngClick;
      latandlongbyClick = [lngClick, latClick];

      popupSeachPin.remove();

      token =
        "pk.eyJ1IjoidXZ3IiwiYSI6ImNrOTY4dzRiMTAyMnUzZXBheHppanV2MXIifQ.jFdHCvYe2u-LUw-_9mcw_g";
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${latandlongbyClick}.json?types=place,locality&limit=1&access_token=${token}`
      )
        .then((resp) => resp.json())
        .then(function (result) {
          if (result.hasOwnProperty("features")) {
            if (result.features.hasOwnProperty("0")) {
              if (
                result.features[0].hasOwnProperty("place_name") &&
                result.features[0].hasOwnProperty("text")
              ) {
                var fullname = result.features[0].place_name;
                var cityAPI = result.features[0].text;
                latlong = latClick + "," + lngClick;

                if (lat >= 90) {
                  timezone = "Etc/GMT";
                } else {
                  timezone = tzlookup(latClick, lngClick);
                }
                timeZoneBadge = timezone2offset(timezone);

                citys = cityAPI;

                if (result.features[0].place_name.split(",")[2]) {
                  countryFull = result.features[0].place_name.split(",")[2];
                } else {
                  countryFull = result.features[0].place_name.split(",")[1];
                }

                if (result.features[0].hasOwnProperty("context")) {
                  for (var i = 0; i <= result.features[0].context.length; i++) {
                    if (
                      result.features[0].context[i].hasOwnProperty("short_code")
                    ) {
                      country = result.features[0].context[
                        i
                      ].short_code.substring(0, 2);
                      break;
                    }
                  }
                }

                chrome.storage.local.set({
                  fullname: fullname,
                });
                chrome.storage.local.set({
                  latlong: latlong,
                });
                chrome.storage.local.set({
                  citys: citys,
                });
                chrome.storage.local.set({
                  country: country,
                });
                chrome.storage.local.set({
                  timeZoneBadge: timeZoneBadge,
                });
                chrome.storage.local.set({
                  IntervalUpdate: "60",
                });
                document.getElementById(
                  "setting_defualt_button_60"
                ).checked = true;
                popup();
              }
            }
          }
        });
    }

    var map = new mapboxgl.Map({
      container: "mapSearch",
      animate: false,
      style: mapStyle,
      center: latandlongMapBox,
      minZoom: 2,
      maxZoom: 12,
      zoom: 10,
      interactive: true,
    });

    map.on("load", updateGeocoderProximity);
    map.on("moveend", updateGeocoderProximity);

    var center = map.getCenter().wrap();

    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      flyTo: false,
      essential: false, //If true , then the animation is considered essential
      types: "place, locality, postcode",
      limit: 8,
      placeholder: "Enter the city or ZIP code",
      proximity: {
        longitude: center.lng,
        latitude: center.lat,
      },
      marker: {
        color: "#ff662b",
        draggable: true,
      },

      render: function (item) {
        return (
          "<div class='geocoder-dropdown-item'>" +
          item.text +
          "<div class='geocoder-dropdown-text'>" +
          item.place_name.split(", ").slice(1).join(", ").slice(0, 38) +
          "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          "</div></div>"
        );
      },
    });

    var marker = new mapboxgl.Marker({
      color: "#ff662b",
      draggable: true,
    })
      .setLngLat(latandlongMapBox)
      .addTo(map);

    var popupSeachPin = new mapboxgl.Popup({
      closeButton: false,
      closeOnMove: true,
      offset: 38,
    })
      .setLngLat(latandlongMapBox)
      .setHTML(
        "Drag and drop the pin to your location<br>to get accurate weather data."
      )
      .addTo(map);

    map.addControl(geocoder);
    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", function () {
      map.addSource("single-point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      marker.on("dragend", onDragEnd);

      geocoder.on("result", function (ev) {
        updateGeocoderProximity();

        var fullname = ev.result.place_name;
        var cityAPI = ev.result.place_name.split(",")[0];
        var lat = ev.result.geometry.coordinates[1];
        var lng = ev.result.geometry.coordinates[0];

        map.jumpTo({
          center: ev.result.center,
          zoom: 10,
        });

        // Special case the north pole. tz-lookup
        if (lat >= 90) {
          timezone = "Etc/GMT";
        } else {
          timezone = tzlookup(lat, lng);
        }
        timeZoneBadge = timezone2offset(timezone);
        latlong = lat + "," + lng;
        citys = cityAPI;
        if (ev.result.place_name.split(",")[2]) {
          countryFull = ev.result.place_name.split(",")[2];
        } else {
          countryFull = ev.result.place_name.split(",")[1];
        }

        if (ev.result.hasOwnProperty("context")) {
          for (var i = 0; i <= ev.result.context.length; i++) {
            if (ev.result.context[i].hasOwnProperty("short_code")) {
              country = ev.result.context[i].short_code.substring(0, 2);
              break;
            }
          }
        } else {
          country = " ";
        }

        marker.remove();

        chrome.storage.local.set({
          fullname: fullname,
        });
        chrome.storage.local.set({
          latlong: latlong,
        });
        chrome.storage.local.set({
          citys: citys,
        });
        chrome.storage.local.set({
          country: country,
        });
        chrome.storage.local.set({
          timeZoneBadge: timeZoneBadge,
        });

        popup();

        map.on("moveend", function (e) {
          searchMap(mapStyle);
        });
      });

      geocoder.on("error", function (ev) {});
    });
  }

  function weatherMap(weathermapStyle) {
    mapboxgl.accessToken =
      "pk.eyJ1IjoidXZ3IiwiYSI6ImNrOTY4dzRiMTAyMnUzZXBheHppanV2MXIifQ.jFdHCvYe2u-LUw-_9mcw_g";
    if (typeof latlong !== "undefined") {
      latandlongMapBox = latlong.split(",").reverse().join(",");
      latandlongMapBox = JSON.parse("[" + latandlongMapBox + "]");
    } else {
      latandlongMapBox = [-79.3832, 43.6532];
    }

    var mapWeather = new mapboxgl.Map({
      container: "mapWeather",
      style: weathermapStyle,
      center: latandlongMapBox,
      minZoom: 1,
      maxZoom: 7,
      zoom: 2,
    });

    mapWeather.on("load", function () {
      mapWeather.addLayer({
        id: "simple-tiles",
        type: "raster",
        paint: {
          "raster-opacity": 0.3,
          "raster-saturation": 0.15,
          "raster-contrast": 0,
          "raster-resampling": "nearest",
          "raster-hue-rotate": 350,
          "raster-fade-duration": 500,
        },
        source: {
          type: "raster",
          tiles: [
            "https://tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=6761dd7f8d0c3c216f9af6813064f867",
          ],
          tileSize: 256,
        },
        minzoom: 1,
        maxzoom: 8,
      });
    });
  }

  function aqi(latlong) {
    lat = latlong.split(",")[0];
    lng = latlong.split(",")[1];

    fetchWithTimeout(
      `https://www.uvw.workers.dev/?https://api.waqi.info/feed/geo:${lat};${lng}/?token=9311857ccf3e488b86121268b016304e3c5ca3b4`,
      3000
    )
      .then(CheckError)
      .then(function (resultWaqi) {
        if (JSON.stringify(resultWaqi) !== "[]" && resultWaqi.status == "ok") {
          aqi_dominant_pollutant = resultWaqi.data.hasOwnProperty("dominentpol")
            ? resultWaqi.data.dominentpol
            : "-";
          aqi_index = resultWaqi.data.hasOwnProperty("aqi")
            ? resultWaqi.data.aqi
            : "-";

          if (aqi_index <= 50) {
            aqi_name = "Good";
          } else if (aqi_index >= 51 && aqi_index <= 100) {
            aqi_name = "Moderate";
          } else if (aqi_index >= 101 && aqi_index <= 150) {
            aqi_name = "Unhealthy for Sensitive Groups";
          } else if (aqi_index >= 151 && aqi_index <= 200) {
            aqi_name = "Unhealthy";
          } else if (aqi_index >= 201 && aqi_index <= 300) {
            aqi_name = "Very Unhealthy";
          } else {
            aqi_name = "Hazardous";
          }

          aqi_popup();
        } else {
          AQIair(latlong);
        }
      })
      .catch(function (err) {
        AQIair(latlong);
      });

    function AQIair(latlong) {
      fetchWithTimeout(
        `https://www.uvw.workers.dev/?http://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lng}&key=dcb6e387-e96b-424e-87fb-b2201c95d25c`,
        3000
      )
        .then(CheckError)
        .then(function (resultAQIair) {
          if (
            JSON.stringify(resultAQIair) !== "[]" &&
            resultAQIair.status == "success"
          ) {
            // Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy, Hazardous, Unavailable
            aqi_dominant_pollutant = resultAQIair.data.current.pollution.hasOwnProperty(
              "mainus"
            )
              ? resultAQIair.data.current.pollution.mainus
              : "-";
            aqi_index = resultAQIair.data.current.pollution.hasOwnProperty(
              "aqius"
            )
              ? resultAQIair.data.current.pollution.aqius
              : "-";

            if (aqi_index <= 50) {
              aqi_name = "Good";
            } else if (aqi_index >= 51 && aqi_index <= 100) {
              aqi_name = "Moderate";
            } else if (aqi_index >= 101 && aqi_index <= 150) {
              aqi_name = "Unhealthy for Sensitive Groups";
            } else if (aqi_index >= 151 && aqi_index <= 200) {
              aqi_name = "Unhealthy";
            } else if (aqi_index >= 201 && aqi_index <= 300) {
              aqi_name = "Very Unhealthy";
            } else {
              aqi_name = "Hazardous";
            }
          } else {
            aqi_dominant_pollutant = "-";
            aqi_index = "-";
            aqi_name = "-";
          }

          aqi_popup();
        })
        .catch(function (err) {
          aqi_dominant_pollutant = "-";
          aqi_index = "-";
          aqi_name = "-";
          aqi_popup();
        });
    }
  }

  setTimeout(function () {
    chrome.storage.local.get("failedHTTP_NO", function (data) {
      if (navigator.onLine && data.failedHTTP_NO == "1") {
        document.querySelector("#overloaded_popup").style.visibility =
          "visible";
      }
      if (!navigator.onLine) {
        document.querySelector("#noInternet_popup").style.visibility =
          "visible";
      }
    });
  }, 6500);
};
