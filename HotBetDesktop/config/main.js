var LobbyUrl = 'https://demo.hotbet777.com/web/#/casino';
var getgwtgameurl="https://demo.hotbet777.com/api/casino/GetDWAuthToken";
var gwtimgpath= "https://demo.hotbet777.com/web/gwt/icons/";
var GwtWrUrl = 'https://demo.hotbet777.com/web/GwtWrapper.html';
var sblobbyurl='https://demo.morix.co';

var gamesettings = {
	gwt:true
};

var favoritelist=[];

var favoritegameids=[
'ar','ko','war'
];

var apiURL = "https://demo.hotbet777.com/api/";
var siteURL = "https://demo.hotbet777.com/";
var oddspaperURL = "https://demo.hotbet777.com/";
var infoDomain = "https://demo.hotbet777.com/web";
var companyname = "hotbet777.com";
var supportmail = "support@hotbet777.com";
var useLMT = false;
var LMTUrl = "";
var defaultLang = 'de';
var defaultZone = 'Europe/Amsterdam';
var multibetSelection = true;
var netsports = [3, 5, 10, 16, 21, 22, 23, 34];
var othersports = [2];
var casinolink = "/casino";
var showCategoryFlags = true;
var useAllLiveSports = true;
var liveSportSliderMode = "basic";
var showinfopages = false;
var useregistration = false;
var usecasino = true;
var usemorebets = true;
var homescreenappID = 'hotbet777.app';
var onlinepayment = true;
var defaultrememberme = true;
var navshortcutcount = 0;
var startpage = 'hbsport';
var showoutrightsingames = true;
var usefavorites = true;
var useticketconfirmation = true;
var useownstakeinput = false;
var sliderUrl = "https://slider.hotbet777.com/Images/";
var sliderGroup = 2;
var idleTimeout =  60 * 15;      //in seconds
var idleTimeoutFinal = 60;      //in seconds
var realityCheckTimeout = 60 * 15;   //in seconds
var iapixelpath = "";

var bettypesettings = [];
bettypesettings.push({ name: 'tip', selected: true, main: true, netsport: true, othersport: true, bt: 8, gt: 1, sort:1, prematch:true });
bettypesettings.push({ name: 'restofmatch', selected: true, main: true, bt: 1, gt: 1, onlyballsport: true, sort: 2, prematch: false });
bettypesettings.push({ name: 'overunder', selected: true, main: true, netsport: true, othersport: true, bt: 2, gt: 1, sort: 3, prematch: true });
bettypesettings.push({ name: 'nextgoal', selected: false, main: !usemorebets, bt: 3, gt: 1, onlyballsport: true, sort: 4, prematch: false });
bettypesettings.push({ name: 'setwinner', selected: false, main: true, netsport: true, onlynetsport: true, bt: 3, gt: 1, sort: 5 });
bettypesettings.push({ name: 'halftime', selected: false, main: true, othersport: true, onlyothersport: true, bt: 3, gt: 1, sort: 6 });
bettypesettings.push({ name: 'ht_tip', selected: true, bt: 8, gt: 2, onlyballsport: true, sort: 7 });
bettypesettings.push({ name: 'ht_restofmatch', selected: true, bt: 1, gt: 2, onlyballsport: true, sort: 8 });
bettypesettings.push({ name: 'ht_overunder', selected: true, bt: 2, gt: 2, onlyballsport: true, sort: 9 });
bettypesettings.push({ name: 'ht_nextgoal', selected: false, bt: 3, gt: 2, onlyballsport: true, sort: 10 });




function NewSalt() {
  var now = new Date();
  return Math.round(1e6 * Math.random()) + ':' + 1e6 * Math.random() + ':' + 1e6 * Math.random() + ':' + now.getMilliseconds() + ':' + now.getSeconds();
}


function getParameterByName(name) //courtesy Artem
{
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}



function playGame(url, fullscreen, redirect) {
    var target, options;
    
    var parameters = { 
        //default configuration
        default : {
            target : '',
            options : ['resizable=yes'] // resizable required for ie
        },
        // window configuration
        window : { 
            target : 'mywindow',
            options : [ 
                        'width=960',
                        'height=600',
                        'left=40',
                        'top=100',
                        'screenX=40',
                        'screenY=100' 
                      ]
        },
        // fullscreen configuration
        fullscreen : {
            target : '_self',
            options : []
        } 
    };

    switch (fullscreen) {
        case 'fullscreen':
            target = parameters.fullscreen.target;
            options = parameters.fullscreen.options;
            break;
        default:
            target = parameters.window.target;
            options = parameters.window.options;
    }
    
    // merge default config
    options = options.concat(parameters.default.options);
    
    if (typeof redirect !== 'undefined') {
        window.location.replace(redirect);
    } else {
        unityWindow = window.open(url , target, options.join());
        unityWindow.focus();
    }
    
}

var gpath  ='https://static.wazdanep.com/games/';
var qr = getParameterByName('src_path');
if(qr && qr.length>0)
{
	gpath = qr;
}

window.addEventListener("message", function (e) {
                try {
					
					if(e.data=="requestAuthorization"){
						
					}
					
                    if (e.data.credits !== undefined && e.data.credits !== null) {
					console.log('credit changed');
                    }
                    if (e.data.autologout_time !== undefined && e.data.autologout_time !== null) {
					console.log('autologout_time changed');
                    }
                } catch (e) { }
            });

