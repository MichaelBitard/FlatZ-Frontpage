// Settings
$.domoticzurl = "http://192.168.1.88:8080";//domoticz url (can be with username:password@ip:port)
$.degreesUnit = " C";
$.percentUnit = " %";
$.theme = "main.css"; //possible values: 'main.css', 'mainPurple.css', 'mainLight.css'
$.rss = "http://www.nu.nl/rss/Algemeen"; //rss feed, like: http://feeds.bbci.co.uk/news/rss.xml?edition=int

$.enableSwitchPopup = true; //false or true

//Weather settings
$.location = "Krommenie, NH"; //city and region *required
$.country = "Netherlands"; //country *required
$.units = "metric"; //"metric" or "imperial" default: "auto"


//Traffic settings
$.Address = 'Krommenie, NL';
$.ZoomLevel = 10;


//Menu settings
$.Graph = true; //false or true
$.News = false; //false or true
$.Log = true; //false or true
$.Lights = true; //false or true
$.Weather = true; //false or true
$.Camera = false; //false or true
$.Traffic = true; //false or true



// Switches Sidebar User settings >>>
// format: idx, value (from json), replace label, description, chart label, chart color
$.PageSwitchArray = [
    //switches (left sidebar)
    {"idx": "163", "jsonField": "Data", "cell": 1, "label": 'Lampen Uit', 'pushButton': true},
    {"idx": "161", "jsonField": "Data", "cell": 2, "label": 'Theme Logan', 'pushButton': true},
    {"idx": "159", "jsonField": "Data", "cell": 3, "label": 'Theme X-Men', 'pushButton': true},
    {"idx": "162", "jsonField": "Data", "cell": 4, "label": 'Theme Aurora', 'pushButton': true},
    {"idx": "160", "jsonField": "Data", "cell": 5, "label": 'Theme TitanFall', 'pushButton': true},
    {"idx": "158", "jsonField": "Data", "cell": 6, "label": 'Theme SunSet', 'pushButton': true},


	// example for scenes & groups
	//{ "idx": 1, "jsonField": "Status", "cell" : 111, "label": "Group Example", "type": "group"}
  //{ "idx": 1, "jsonField": "Status", "cell" : 111, "label": "Scene Example", "type": "scene"}
];


// Dashboard screen User settings >>>
// format: idx, value (from json), replace label, description, chart label, chart color
$.PageDashboardArray = [
    //other devices
    {"idx": "68", "jsonField": "Humidity", "cell" : 7, "label" : 'Vocht Badkamer', "donut": true, "donutColor": '#b2c831'},
    {"idx": "68", "jsonField": "LastUpdate", "cell" : 70, "label" : 'Vocht Badkamer'},

    {"idx": "14", "jsonField": "Temp", "cell" : 8, "label" : 'Temperatuur Woonkamer', "donut": true, "donutColor": '#2980B9'},
    {"idx": "14", "jsonField": "LastUpdate", "cell" : 80, "label" : 'Temperatuur Woonkamer'},

    {"idx": "58", "jsonField": "Usage", "cell" : 9, "label" : 'Zonnepanelen (Watt)'},
    {"idx": "58", "jsonField": "Data", "cell" : 29, "label" : 'Zonnepanelen'},
    {"idx": "58", "jsonField": "CounterToday", "cell" : 39, "label" : 'Zonnepanelen'},
    {"idx": "58", "jsonField": "LastUpdate", "cell" : 19, "label" : 'Zonnepanelen'},

    {"idx": "47", "jsonField": "Temp", "cell" : 10, "label" : 'Temperatuur Buiten', "donut": true, "donutColor": '#C0382B'},
    {"idx": "47", "jsonField": "LastUpdate", "cell" : 100, "label" : 'Temperatuur Buiten'},

    {"idx": "53", "jsonField": "Data", "cell" : 11, "label" : 'SabNZB Status'},
    {"idx": "57", "jsonField": "Data", "cell" : 12, "label" : 'Plex Status'},
    {"idx": "41", "jsonField": "Status", "cell" : 13, "label" : 'Ventilatie', 'arrow': true},
];


// Graph screen User settings >>> (max 3 on screen)
//format: idx, value (from json), replace label, description, chart label, chart color
$.GraphTemperatureArray = [
    //graph screen (3 fields)
    ['58', 'counter&method=1', 'day', 'cell7', 'Zonnepanelen (Watt)', 'graph100', '#b2c831', 'v'],
    ['68', 'temp', 'day', 'cell8', 'Vocht Badkamer', 'graph200', '#C0382B', 'hu'],
    ['14', 'temp', 'day', 'cell10', 'Temperatuur Woonkamer', 'graph300', '#2980B9', 'te'],
];


// Light screen User settings >>>
$.LightArray = [
    //format: idx, 'Hue' (color lamp) or 'Dimmer' (for normal dimmer), replace label, description, maxdimlevel
    ['113', 'Hue', 'cell7', 'Tafel 1'],
    ['110', 'Hue', 'cell8', 'Tafel 2'],
    ['107', 'Hue', 'cell10', 'Tafel 3'],
    ['109', 'Hue', 'cell11', 'Tafel 4'],
    ['111', 'Hue', 'cell12', 'Spot 1 (TV)'],
    ['112', 'Hue', 'cell13', 'Spot 1 (Bank)'],
];


// Camera screen User settings >>>
$.CameraArray = [
    //format: html replace label, camera Image URL, description
    ['cell7', 'http://images.opentopia.com/cams/9694/big.jpg', 'Buiten 1'],
    ['cell8', 'http://images.opentopia.com/cams/10359/big.jpg', 'Buiten 2'],
    ['cell10', 'http://images.opentopia.com/cams/8034/big.jpg', 'Buiten 3'],
    ['cell11', 'http://images.opentopia.com/cams/15104/big.jpg', 'Buiten 4'],
    ['cell12', 'http://images.opentopia.com/cams/16584/big.jpg', 'Gang'],
    ['cell13', 'http://images.opentopia.com/cams/16577/big.jpg', 'Extra'],
];
