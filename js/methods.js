$.isFrontPage = (window.location.href.indexOf("frontpage.html") !== -1);
function RefreshSwitchData() {
    clearInterval($.refreshTimer);
    var jurl = $.domoticzurl + "/json.htm?type=devices&jsoncallback=?";
    $.getJSON(jurl, {
            format: "json"
        },
        function(data) {
            if (typeof data.result != 'undefined') {
                $.each(data.result, function(i, item) {
                  if ($.isFrontPage) {
                    for (var ii = 0, len = $.PageDashboardArray.length; ii < len; ii++) {
                      RefreshSwitch(item, $.PageDashboardArray[ii]);
                    }
                  }
                  for (var ii = 0, len = $.PageSwitchArray.length; ii < len; ii++) {
                    RefreshSwitch(item, $.PageSwitchArray[ii]);
                  }
                });
            }
        });

    RefreshScenes();

    $.refreshTimer = setInterval(RefreshSwitchData, 8000);
}

function RefreshSwitch(item, element) {
  if (element.idx === item.idx) { // Domoticz idx
      var jsonField = element.jsonField; // Domotitcz type (like Temp, Humidity)
      var cellId = element.cell; // cell number from HTML layout
      var label = (typeof element.label == 'undefined') ? item.Name : element.label; // description
      var pushButton = (typeof element.pushButton == 'undefined') ? false : element.pushButton;
      var button = (typeof element.button == 'undefined') ? false : element.button;
      var type = element.type;
      var arrow = (typeof element.arrow == 'undefined') ? false : element.arrow;
      var extraCss = (typeof element.extracss == 'undefined') ? false : element.extracss;
      var donut = (typeof element.donut == 'undefined') ? false : element.donut;
      var onlyDonut = (typeof element.onlyDonut == 'undefined') ? false : element.onlyDonut;
      var donutColor = element.donutColor;
      var maxDonut = (typeof element.maxDonut == 'undefined') ? 100 : element.maxDonut;

      var alarmThreshold = element.alarmThreshold; // alarm value to turn text to red
      var vdata = item[jsonField];
      var vunit = "";

      if (typeof type == 'undefined' || (type != 'scene' && type != 'group')) {
          if (typeof vdata == 'undefined') {
              vdata = "??";
          } else {
              // remove too much text
              //vdata=new String(vdata).split("Watt",1)[0];
              //vdata=new String(vdata).split("kWh",1)[0];
              if (jsonField == "Temp") {
                  vunit = $.degreesUnit;
              }
              if (jsonField == "Humidity") {
                  vunit = $.percentUnit;
              }
          }

          // create switchable value when item is switch
          switchclick = '';
          if (item.Protected == false) {
              if (vdata == 'Off' || pushButton == true) {
                  switchclick = 'onclick="SwitchToggle(' + item.idx + ', \'On\');"';
              } else if (vdata == 'On') {
                  switchclick = 'onclick="SwitchToggle(' + item.idx + ', \'Off\');"';
              }
          }

          // if alarm threshold is defined, make value red
          alarmcss = '';
          if (typeof alarmThreshold != 'undefined') {
              if (eval(vdata + alarmThreshold)) { // note orig:  vdata > alarm
                  alarmcss = ';color:red;';
              }
          }


          if (arrow) {
              if (vdata == 'Off') {
                  $('#cell' + cellId).html('<img src="images/down.png" alt=""><div ' + switchclick + ' style=' + alarmcss + '>' + vdata + '</div>');
              } else {
                  $('#cell' + cellId).html('<img src="images/up.png" alt=""><div ' + switchclick + ' style=' + alarmcss + '>' + vdata + '</div>');
              }
          }

          if (pushButton) {
              $('#cell' + cellId).html('<div class="switch" style="margin-top:5px;width:60px;"><label class="switch-selection" ><div ' + switchclick + ' style=' + alarmcss + '>' + vdata + '</div></label></div>');
          }

          if (button) {
              if (vdata == 'Off') {
                  $('#cell' + cellId).html('<div class="switch switch-blue" style="margin-top:5px;width:60px;"><label class="switch-selection" ><div ' + switchclick + ' style=' + alarmcss + '>' + vdata + '</div></label></div>');
              } else {
                  $('#cell' + cellId).html('<div class="switch" style="margin-top:5px;width:60px;"><label class="switch-selection" ><div ' + switchclick + ' style=' + alarmcss + '>' + vdata + '</div></label></div>');
              }
          }

          if (!arrow && !pushButton && !button && !onlyDonut) {
            var display=(vunit != "") ? vdata + ' ' + vunit : vdata;
            $('#cell' + cellId).html('<div ' + switchclick + ' style=' + extraCss + alarmcss + '>' + display + '</div>');
          }

          $('#desc_cell' + cellId).html(label);
          if (donut) {

              var chart = $('#cell' + cellId + 'donut').highcharts();
              if (typeof chart == 'undefined') {
                $('#cell' + cellId + 'donut').highcharts({
                    chart: {
                        margin: [30, 30, 30, 30],
                        backgroundColor: null,
                        plotBackgroundColor: 'none',
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    tooltip: {
                        formatter: function() {
                            var addUnit = vunit === "" ? ' %' : ' ' + vunit;
                            return this.point.name + ': ' + this.y + addUnit;
                        }
                    },
                    series: [{
                        borderWidth: 2,
                        borderColor: '#F1F3EB',
                        shadow: false,
                        type: 'pie',
                        name: 'Income',
                        innerSize: '65%',
                        data: [{
                            name: label,
                            y: vdata,
                            color: donutColor
                        }, {
                            name: 'total',
                            y: (maxDonut - vdata),
                            color: '#3d3d3d'
                        }],
                        dataLabels: {
                            enabled: false,
                            color: '#000000',
                            connectorColor: '#000000'
                        }
                    }]
                });
              } else {
                chart.series[0].data[0].update(vdata);
                chart.series[0].data[1].update(maxDonut - vdata);
              }
          }
      }
  }
}

function RefreshScenes() {
    var jurl_scenes = $.domoticzurl + "/json.htm?type=scenes&jsoncallback=?";
    $.getJSON(jurl_scenes, {
            format: "json"
        },
        function(data) {
            if (typeof data.result != 'undefined') {
                $.each(data.result, function(i, item) {
                  if ($.isFrontPage) {
                    for (var ii = 0, len = $.PageDashboardArray.length; ii < len; ii++) {
                      RefreshScene(item, $.PageDashboardArray[ii]);
                    }
                  }
                  for (var ii = 0, len = $.PageSwitchArray.length; ii < len; ii++) {
                    RefreshScene(item, $.PageSwitchArray[ii]);
                  }
                });
            }
        });
}

function RefreshScene(item, element) {
  if (element.idx === item.idx) { // Domoticz idx number
      var jsonField = element.jsonField; // Domotitcz type (like Temp, Humidity)
      var cellId = element.cell; // cell number from HTML layout
      var label = (typeof element.label == 'undefined') ? item.Name : element.label; // description
      var type = element.type;

      var alarmThreshold = element.alarmThreshold;
      var vdata = item[jsonField];
      var vunit = "";

      // create switchable value when item is switch
      switchclick = '';
      // if alarm threshold is defined, make value red
      alarmcss = '';
      if (typeof alarmThreshold != 'undefined') {
          if (eval(vdata + alarmThreshold)) { // note orig:  vdata > alarm
              alarmcss = ';color:red;';
          }
      }

      // if extra css attributes
      if (typeof type == 'undefined') {
          $('#cell' + cellId).html('<div ' + switchclick + ' style=' + alarmcss + '>' + vdata + '</div>');
      } else {
          if (type == 'scene') {
              switchclick = 'onclick="SwitchScene(' + item.idx + ', \'On\');"';
              $('#cell' + cellId).html('<div class="switch" style="margin-top:5px;width:60px;"><label class="switch-selection" ><div ' + switchclick + ' style=' + alarmcss + '>' + vdata + '</div></label></div>');
          } else if (type == 'group') {
              if (vdata == 'Off') {
                  switchclick = 'onclick="SwitchScene(' + item.idx + ', \'On\');"';
              } else if (vdata == 'On') {
                  switchclick = 'onclick="SwitchScene(' + item.idx + ', \'Off\');"';
              }
              if (vdata == 'Off') {
                  $('#cell' + cellId).html('<div class="switch switch-blue" style="margin-top:5px;width:60px;"><label class="switch-selection" ><div ' + switchclick + ' style=' + alarmcss + '>' + vdata + '</div></label></div>');

              } else {
                  $('#cell' + cellId).html('<div class="switch" style="margin-top:5px;width:60px;"><label class="switch-selection" ><div ' + switchclick + ' style=' + alarmcss + '>' + vdata + '</div></label></div>');
              }
          }
      }
      $('#desc_cell' + cellId).html(label);
  }
}

function RefreshLightData() {
    //clearInterval($.refreshTimerLight);
    var jurl = $.domoticzurl + "/json.htm?type=devices&filter=light&used=true&order=Name&jsoncallback=?";
    console.log(jurl);

    $.getJSON(jurl, {
            format: "json"
        },
        function(data) {
            if (typeof data.result != 'undefined') {
                $.each(data.result, function(i, item) {
                    for (var bb = 0, len = $.LightArray.length; bb < len; bb++) {
                        if ($.LightArray[bb][0] === item.idx) {
                            var switchStatus = item.Status;
                            var switchLevel = item.Level;
                            var subType = item.SubType;
                            var switchDimmer = item.HaveDimmer;
                            //console.log("light info: "+switchStatus +" "+switchLevel+" "+switchDimmer);

                            //example: ['11', 'Dimmer', 'cell7', 'Licht - Tafel 1'],
                            var vtype = $.LightArray[bb][1]; // type description (like Dimmer)
                            var vlabel = $.LightArray[bb][2]; // cell number from HTML layout
                            var vdesc = $.LightArray[bb][3]; // description

                            $('#desc_' + vlabel).html(vdesc + " | " + switchLevel + $.percentUnit);

                            $("#slider_" + vlabel).slider({
                                orientation: 'horizontal',
                                range: false,
                                value: switchLevel,
                                idx: item.idx,
                                stop: function(event, ui) {
                                    for (var tt = 0, len = $.LightArray.length; tt < len; tt++) {
                                        console.log(("slider_" + $.LightArray[tt][2]));
                                        if (("slider_" + $.LightArray[tt][2]) == event.target.id) {
                                            if ($.LightArray[tt][1] == 'Dimmer') {
                                                setLightDimmer($.LightArray[tt][0], ui.value, $.LightArray[tt][4]);
                                            } else {
                                                setLightColors($.LightArray[tt][0], ui.value);
                                            }
                                        }
                                    }
                                }
                            });
                            $("#color_" + vlabel).empty();


                            // create switchable value when item is switch
                            switchclick = '';
                            if (switchStatus == 'Off') {
                                if (item.Protected == false) {
                                    switchclick = 'onclick="SwitchToggle(' + item.idx + ', \'On\');"';
                                }

                                $('#' + vlabel).html('<div class="switch switch-blue" style="margin-top:5px;width:60px;"><label class="switch-selection" ><div ' + switchclick + ' >Off</div></label></div>');
                                $("#slider_" + vlabel).slider('disable');
                            } else {
                                if (item.Protected == false) {
                                    switchclick = 'onclick="SwitchToggle(' + item.idx + ', \'Off\');"';
                                }

                                $('#' + vlabel).html('<div class="switch" style="margin-top:5px;width:60px;"><label class="switch-selection" ><div ' + switchclick + ' >On</div></label></div>');

                                if (subType == 'RGBW') {
                                    $("#color_" + vlabel).kendoFlatColorPicker({
                                        preview: true,
                                        value: "#e15613",
                                        change: changeColorTriggered,
                                    });
                                }

                                $("#slider_" + vlabel).slider('enable');
                            }
                        }
                    }
                });
            }
        });

    //$.refreshTimerLight = setInterval(RefreshLightData, 8000);
}

//http://192.168.0.124:8084/json.htm?type=command&param=switchlight&idx=90&switchcmd=Set%20Level&level=8
function setLightDimmer(idx, bright, maxlevel) {
    if (typeof maxlevel != 'undefined') {
        var dimlevel = bright * (maxlevel / 100);
    } else {
        var dimlevel = bright;
    }

    var jurl = $.domoticzurl + "/json.htm?type=command&param=switchlight&idx=" + idx + "&switchcmd=Set%20Level&level=" + dimlevel;
    console.log(jurl);
    $.ajax({
        url: jurl,
        async: false,
        dataType: 'json',
        success: function() {
            console.log('SUCCES');
        },
        error: function() {
            console.log('ERROR');
        }
    });
    //RefreshLightData();
}

function setLightColors(idx, bright, hue, sat) {
    var jurl = $.domoticzurl + "/json.htm?type=command&param=setcolbrightnessvalue&hue=" + hue + "&idx=" + idx + "&brightness=" + bright + "&iswhite=false";
    console.log(jurl);
    $.ajax({
        url: jurl,
        async: false,
        dataType: 'json',
        success: function() {
            console.log('SUCCES');
        },
        error: function() {
            console.log('ERROR');
        }
    });
    //RefreshLightData();
}

function changeColorTriggered(e) {
    clearInterval($.refreshchangeColorTriggered);
    console.log('interval added');

    var elementName = this.element.attr("id");
    //trigger new interval
    $.refreshchangeColorTriggered = setInterval(function() {
        changeColor(e, elementName)
    }, 3000);
}

function changeColor(e, elementName) {
    clearInterval($.refreshchangeColorTriggered);
    //console.log(hexToRgb(e.value).r+" "+hexToRgb(e.value).g+" "+hexToRgb(e.value).b);
    //process color change
    // http://192.168.1.88:8080/json.htm?type=command&param=setcolbrightnessvalue&idx=11&hue=54&brightness=100&iswhite=false
    var slidername = "#slider_" + elementName.replace("color_", "");
    var sliderValue = $(slidername).slider('value');
    var hvs = rgb2hsv(hexToRgb(e.value).r, hexToRgb(e.value).g, hexToRgb(e.value).b);
    //console.log(hvs);

    for (var tt = 0, len = $.LightArray.length; tt < len; tt++) {
        console.log(("slider_" + $.LightArray[tt][2]));
        if (("#slider_" + $.LightArray[tt][2]) == slidername) {
            console.log($.LightArray[tt][0] + " " + sliderValue + " " + hvs[0] + " " + hvs[1]);
            setLightColors($.LightArray[tt][0], sliderValue, hvs[0], hvs[1]);
        }
    }

    RefreshLightData();
}


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

var dataArray = [];

function RefreshGraphData() {
    clearInterval($.refreshTimerGraph);

    for (var aa = 0, len = $.GraphTemperatureArray.length; aa < len; aa++) {
        var xIDX = $.GraphTemperatureArray[aa][0]; // idx of temp device
        var vtype = $.GraphTemperatureArray[aa][1]; // Domotitcz type (like Temp, Humidity)
        var vlabel = $.GraphTemperatureArray[aa][3]; // cell id from HTML layout
        var vdesc = $.GraphTemperatureArray[aa][4]; // description
        var vchart = $.GraphTemperatureArray[aa][5]; // chart id from HTML layout
        var vchartcolor = $.GraphTemperatureArray[aa][6]; // color for chart
        var vrange = $.GraphTemperatureArray[aa][2]; // range (day, week, month)
        var vpara = $.GraphTemperatureArray[aa][7]; // json parameter (hu, te, d)
        var vunit = "";

        if (typeof vdata == 'undefined') {
            vdata = "??";
        } else {
            if (vtype == "temp") {
                vunit = $.degreesUnit;
            }
            if (vtype == "humidity") {
                vunit = $.percentUnit;
            }
        }

        //console.log('Getting: ' + vdesc + "|" + vpara);
        var jgurl = $.domoticzurl + "/json.htm?type=graph&sensor=" + vtype + "&idx=" + xIDX + "&range=" + vrange;
        console.log(jgurl);

        $.ajax({
            dataType: "json",
            async: false,
            url: jgurl + '&jsoncallback=?',
            xIDX: xIDX,
            vtype: vtype,
            vlabel: vlabel,
            vchart: vchart,
            vchartcolor: vchartcolor,
            vrange: vrange,
            vunit: vunit,
            vdesc: vdesc,
            vpara: vpara,
        }).done(function(data) {
            var arrData = [];
            var nameData = [];
            var tmpPara = this.vpara;
            $.each(data.result, function(i, item) {
                var year = parseInt(item.d.substring(0, 4));
                var month = parseInt(item.d.substring(5, 7));
                var day = parseInt(item.d.substring(8, 10));
                var hour = parseInt(item.d.substring(11, 13));
                var minutes = parseInt(item.d.substring(14, 16));
                var xVal = Date.UTC(year, month-1, day, hour, minutes);
                var x = [xVal, parseFloat(item[tmpPara])];
                arrData.push(x);
            });
            createGraph(arrData, nameData, this.vchart, this.vunit, this.vchartcolor, this.vdesc, this.vlabel);
        });
    }
    $.refreshTimerGraph = setInterval(RefreshGraphData, 8000);
}


function createGraph(arrData, nameData, vchart, vunit, vchartcolor, vdesc, vlabel) {
    $('#desc_' + vlabel).html(vdesc);

    console.log('#' + vchart + ' ' + vdesc);
    //console.log(arrData);

    $('#' + vchart).highcharts({
        chart: {
            backgroundColor: null,
            plotBackgroundColor: 'none',
            type: 'line',
            zoomType: 'xy',
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: false
                },
                states: {
                    hover: {
                        enabled: false
                    }
                }
            },
            series: {
                allowPointSelect: false,
                point: {
                    events: {
                        click: function() {
                            //console.log(this);
                        }
                    }
                }
            }
        },
        subtitle: {
            text: ''
        },
        title: {
            text: ''
        },
        tooltip: {
            formatter: function() {
                return '<b>' + this.y + '</b>';
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            minRange: 3600000,
            title: {

                text: 'time',
                style: {
                    font: 'bold 13px Tahoma, sans-serif'
                },
                opposite: true
            }
        },
        yAxis: {
            title: {
                text: vunit,
                style: {
                    font: 'bold 13px Tahoma, sans-serif'
                },
                opposite: true
            }
        },

        series: [{
            data: arrData,
            color: vchartcolor,
            borderWidth: 2,
        }]
    });
}


function RefreshLogData() {
    clearInterval($.refreshTimerGraph);

    //console.log('Getting: Logs');
    var jgurl = $.domoticzurl + "/json.htm?type=command&param=getlog";
    //console.log(jgurl);

    $.ajax({
        dataType: "json",
        async: false,
        url: jgurl + '&jsoncallback=?',
    }).done(function(data) {
        var arrData = [];
        $.each(data.result, function(i, item) {
            var x = [item['level'], item['message']];
            arrData.push(x);
        });

        var filter = document.getElementById('filterlog').value;
        var text = "";
        //show logs
        for (i = (arrData.length - 1); i > 0; i--) {
            var totalText = arrData[i][1];
            var lowerText = totalText.toLowerCase();
            if (filter.length <= 0 || lowerText.indexOf(filter.toLowerCase()) >= 0) {
                var res = totalText.split(" ");
                text += "<font color='#8bc34a' style='padding-right:10px'>" + res[0] + "  " + res[1] + "  </font>";
                totalText = totalText.replace(res[0] + " " + res[1], "")
                    .replace("User:", "<font color='#81d4fa'>User: </font>")
                    .replace("LUA:", "<font color='#fff176'>LUA: </font>")
                    .replace("(Weather Underground)", "<font color='#eceff1'>Weather Underground: </font>")
                    .replace("(RFXCOM 433 Transceiver)", "<font color='#ec407a'>RFXCOM 433 Transceiver: </font>")
                    .replace("Hardware Monitor", "<font color='#ffa726'>Hardware Monitor: </font>")
                    .replace("Error:", "<font color='red'>Error: </font>")
                    .replace("EventSystem", "<font color='#ffa726'>EventSystem: </font>")
                    .replace("(Philips Hue Bridge)", "<font color='#dce775'>Philips Hue: </font>");

                text += totalText;
                text += "<br>";
            }
        }

        $('#showlog').html(text);
        ////console.log(text);
    });

    $.refreshTimerGraph = setInterval(RefreshLogData, 2000);
}


/**
 * function to load a given css file
 */
loadCSS = function(href) {
    var cssLink = $("<link rel='stylesheet' type='text/css' href='" + href + "'>");
    $("head").append(cssLink);
};

/**
 * function to load a given js file
 */
loadJS = function(src) {
    var jsLink = $("<script type='text/javascript' src='" + src + "'>");
    $("head").append(jsLink);
};


function SwitchToggle(idx, switchcmd) {
    $.ajax({
        url: $.domoticzurl + "/json.htm?type=command&param=switchlight" + "&idx=" + idx + "&switchcmd=" + switchcmd + "&level=0&passcode=&jsoncallback=?",
        async: false,
        dataType: 'json',
        success: function() {
            //console.log('SUCCES');
            var n = noty({
                text: 'Switch toggled',
                type: 'success'
            });

            RefreshSwitchData();
        },
        error: function() {
            //console.log('ERROR');
            var n = noty({
                text: 'Failed to toggle switch...',
                type: 'error'
            });
        }
    });
}

function SwitchScene(idx, switchcmd) {
    //console.log($.domoticzurl + "/json.htm?type=command&param=switchscene" + "&idx=" + idx + "&switchcmd=" + switchcmd + "&passcode=&jsoncallback=?");
    $.ajax({
        url: $.domoticzurl + "/json.htm?type=command&param=switchscene" + "&idx=" + idx + "&switchcmd=" + switchcmd + "&passcode=&jsoncallback=?",
        async: false,
        dataType: 'json',
        success: function() {
            //console.log('SUCCES');
            var n = noty({
                text: 'Switch toggled',
                type: 'success'
            });

            RefreshScenes();
        },
        error: function() {
            //console.log('ERROR');
            var n = noty({
                text: 'Failed to toggle switch...',
                type: 'error'
            });
        }
    });
}

function RefreshCameraSnapshot() {
    clearInterval($.refreshTimerCamera);

    for (var counterCamera = 0, len = $.CameraArray.length; counterCamera < len; counterCamera++) {
        var vlabel = $.CameraArray[counterCamera][0];
        var vurl = $.CameraArray[counterCamera][1];
        var vdesc = $.CameraArray[counterCamera][2];

        var divCamera = document.createElement('div');
        divCamera.className = 'camera';
        divCamera.innerHTML = '<a href="' + vurl + '" data-lightbox="' + vlabel + '" data-title="' + vdesc + '" ><img src="' + vurl + '" width="100%" /></a>';

        $('#desc_' + vlabel).html(vdesc);
        $(vlabel).empty();

        document.getElementById(vlabel).innerHTML = "";
        document.getElementById(vlabel).appendChild(divCamera);
    }

    $.refreshTimerCamera = setInterval(RefreshCameraSnapshot, 8000);

}
