var nothing = false;
var cron = require('node-cron');

const GoogleClientId = '474053386923-b6kocudm72efpo7jp41rn9losglfnll4.apps.googleusercontent.com';
const GoogleProjectId = 'javascript-319714';
const GoogleClientSecret = 'GNeEsXNMO_oSEy7JWVUwjLfq';

const YoutubeAuthCreds = `{"web":{"client_id":"${GoogleClientId}","project_id":"${GoogleProjectId}","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"${GoogleClientSecret}","redirect_uris":["https://localhost"]}}`;

var Authenticate = require("./authenticate.js");
var googleAuth = new Authenticate(JSON.parse(YoutubeAuthCreds));
var ProcessVideo = require("./ProcessVideo.js");
var process2 = new ProcessVideo();

var videoObjs;
console.log("Running every 6 hours")
async function doIt() {
    googleAuth.authorize().then(function() {
        callRerunning();
    });
}

async function callRerunning() {
    process2.getTwitchVid().then(function(tmpVideoObjs) {
        videoObjs = tmpVideoObjs;
        logIt('Got video objects');
        nothing = Math.ceil(60/(videoObjs.length/24)*60000)
        logIt(nothing);
        process2.processVideo(googleAuth.getYoutube(), videoObjs, nothing).then(function() {
            console.log("Rerunning after 6 hours or whenever cron shedule finishes")
        });
    });
}

doIt();

function logIt() {
    console.log(new Date(), arguments);
}
