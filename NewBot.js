const Youtube = require('youtube-video-api')
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const fs = require('fs');
const http = require('https');
const axios = require('axios');
const { DownloaderHelper } = require('node-downloader-helper');
const { resolve } = require('path');
var nothing = false;


const TwitchClientId = "xxvz2mqd0a3dz1v6kxyr9et4dueukh";
const TwitchClientSecret = "dz04478gkk40xmzerpnm02c9zjd9m5";

const GoogleClientId = '474053386923-b6kocudm72efpo7jp41rn9losglfnll4.apps.googleusercontent.com';
const GoogleProjectId = 'javascript-319714';
const GoogleClientSecret = 'GNeEsXNMO_oSEy7JWVUwjLfq';

const YoutubeAuthCreds = `{"web":{"client_id":"${GoogleClientId}","project_id":"${GoogleProjectId}","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"${GoogleClientSecret}","redirect_uris":["https://localhost"]}}`;
const GOOGLE_API_TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
const GOOGLE_API_TOKEN_PATH = GOOGLE_API_TOKEN_DIR + 'other_youtube-nodejs-quickstart.json';
const GOOGLE_API_SCOPES = ['https://www.googleapis.com/auth/youtube.upload','https://www.googleapis.com/auth/youtube.readonly'];

var videoObjs;
var youtube = Youtube({ 
    video: {
      part: 'status,snippet' 
    },
    file: GOOGLE_API_TOKEN_PATH
});

async function doIt() {
    await authorizeGoogle(JSON.parse(YoutubeAuthCreds));
    videoObjs = await getTwitchVideos();
    logIt('Got video objects');
    nothing = Math.ceil(60/(videoObjs.length/24)*60000)
    logIt(nothing);
    processVideo();
}

doIt();

function logIt() {
    console.log(new Date(), arguments);
}

function processVideo() {
    while (videoObjs.length) {
        var videoObj = videoObjs.shift();
        logIt('Processing video', videoObj);
        var dn = videoObj.download_name;
        var vidFolder = `${__dirname}/newd`;
        var vidPath = `${vidFolder}/${dn}`;
        if (!fs.existsSync(vidPath) && /[a-z]+/.test(videoObj.title)) {
            // download it and upload it
            logIt('Downloading', vidPath, vidFolder);
            const dl = new DownloaderHelper(videoObj.file_url, vidFolder);
            dl.on('end', () => {
                logIt('Downloaded - now uploading');
                uploadVideo(videoObj, vidPath);
            });
            dl.on('error', () => {
                logIt("Download Error");
                processVideo();
            })
            dl.start();
            return;
        }
    }
}

function uploadVideo(videoObj, vidPath) {
    var cn = videoObj.creator_name;
    var params = {
        resource: {
            "snippet": {
                "description": `Thank you for watching! \n Check out ${cn} on twitch for more videos by him! \n Shoutouts EVERY WEEK to people who like, subscribe, and comment to my youtube videos! \n ❤️❤️❤️ Subscribe and I will love you forever ❤️❤️❤️.  \n If you are a streamer and want your clip removed, please let me know on my discord or by email. Enjoy!`,
                "title": videoObj.title,
                "tags": [
                  "Clips",
                  "Twitch",
                  "Youtube",
                  "Video",
                  "Awesome",
                  "Short",
                  "Fortnite",
                  "Awe-Inspiring",
                ],
                "thumbnails": {
                  "medium": {
                    "url": videoObj.thumbnail_url
                  }
              }
            }
        }
    };
    youtube.upload(vidPath, params, function (err, video) {
        if (err) {
            logIt('ERROR!!!!! during youtube upload', err);
        } else {
            logIt('Success - youtube upload');
            setTimeout(processVideo, nothing);
        }
    });
}

function callTwitch(access_token, uri) {
    return new Promise((resolve, reject) => {
        var options = {
            host: "api.twitch.tv",
            port: 443,
            path: uri,
            method: "GET",
            headers: {
                "Client-Id": TwitchClientId,
                "Authorization": `Bearer ${access_token}` 
            }
        }
        callback = async function(response) {
            var str = ''
            response.on('data', function (chunk) {
              str += chunk;
            });
            response.on('end', function () {
                resolve(JSON.parse(str));
            });
        };
        http.request(options, callback).end(); 
    });
}

function getTwitchVideos() {
    logIt('Authorizing twitch');
    return new Promise((resolve, reject) => {
        logIt('In twitch authorize promise');
        axios
        .post(`https://id.twitch.tv/oauth2/token?grant_type=client_credentials&client_id=${TwitchClientId}&client_secret=${TwitchClientSecret}`)
        .then(res => {
            logIt('Twitch access token', access_token);
            var access_token = res.data.access_token;
            callTwitch(access_token, "/helix/games/top").then(function(obj) {
            var gameId = 0;
            for (var i  = 0; i < obj.data.length; i++) {
                if (obj.data[i].name == 'Fortnite') {
                    gameId = obj.data[i].id;
                    break;
                }
            }
            logIt('Game id is', gameId);
            if (gameId) {
                var dts2 = new Date().toISOString();
                var dts = new Date();
                dts.setDate(dts.getDate() - 1);
                dts=dts.toISOString()

                // do work
                callTwitch(access_token, `/helix/clips?game_id=${gameId}&first=100&started_at=${dts}&ended_at=${dts2}`).then(function(obj) {
                    var d = obj.data;
                    var ret  = [];
                    for(var i = 0; i < d.length; i++) {
                        var dp = d[i].thumbnail_url.split("-preview")[0] + '.mp4';
                        ret.push({
                            file_url: dp,
                            title: d[i].title,
                            creator_name: d[i].creator_name,
                            thumbnail_url: d[i].thumbnail_url,
                            download_name: dp.split(".tv/")[1]
                        });
                    }
                    resolve(ret);
                });
            } else {
                // game not found
                resolve([]);
            }
          });
        }).catch((error) => {
            logIt('errored', error);
        });
    });
}
function authorizeGoogle(credentials) {
    logIt(credentials);
    redirectUrl = credentials.web.redirect_uris[0];
    oauth2Client = new OAuth2(credentials.web.client_id, credentials.web.client_secret, redirectUrl);

    logIt('Getting token from', GOOGLE_API_TOKEN_PATH);

    return new Promise((resolve, reject) => {
        // Check if we have previously stored a token.
        fs.promises.readFile(GOOGLE_API_TOKEN_PATH).then(function() {
            logIt('google already authenticated');
            youtube.authenticate(
                credentials.web.client_id, credentials.web.client_secret,
                function(err, tokens) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        }).catch(function() {
            logIt('Google API Token does not exist - getting it');
            getNewToken(oauth2Client).then(function()  {
                logIt('After get new token');
                youtube.authenticate(
                    credentials.web.client_id, credentials.web.client_secret,
                    function(err, tokens) {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            }).catch(function() {
                logIt('Did not get a token');
                reject();
            });
        });
    });
  }

  async function getNewToken(oauth2Client) {
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: GOOGLE_API_SCOPES
    });
    logIt('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise((resolve, reject) => {
        rl.question('Enter the code from that page here: ', function(code) {
            rl.close();
            oauth2Client.getToken(code, function(err, token) {
              if (err) {
                logIt('Error while trying to retrieve access token', err);
                reject();
                return;
              }
              oauth2Client.credentials = token;
              storeToken(token).then(function() {
                  resolve();
              });
            });
        });
    });
  }

  function storeToken(token) {
      return new Promise((resolve, reject) => {
        fs.promises.mkdir(GOOGLE_API_TOKEN_DIR).then(function() {
            fs.promises.writeFile(GOOGLE_API_TOKEN_PATH, JSON.stringify(token)).then(function() {
                resolve();
            });
        }).catch(function(err)  {
            if (err.code == 'EEXIST')  {
                fs.promises.writeFile(GOOGLE_API_TOKEN_PATH, JSON.stringify(token)).then(function() {
                    resolve();
                });
            } else {
                logIt('Got err', JSON.stringify(err));
                reject();
            }
        });
      });
  }
