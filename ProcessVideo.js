const fs = require('fs');
const http = require('https');
const axios = require('axios');
const { DownloaderHelper } = require('node-downloader-helper');
const { resolve } = require('path');
const { time } = require('console');
var nothing = false;
const uploadType = "Fortnite";

const TwitchClientId = "xxvz2mqd0a3dz1v6kxyr9et4dueukh";
const TwitchClientSecret = "dz04478gkk40xmzerpnm02c9zjd9m5";

var method = getTwitchVideos.prototype;

function getTwitchVideos() {
    this.logIt('Authorizing twitch');
}

method.processVideo = async function (youtube, videoObjs, nothing) {
    this.videoObjs = videoObjs;
    var x = this;
    this.nothing = 900000;
    return new Promise((resolve, reject) => {
        while (x.videoObjs.length) {
            var videoObj = x.videoObjs.shift();
            x.logIt('Processing video', videoObj);
            var dn = videoObj.download_name;
            var vidFolder = `${__dirname}/newd`;
            var vidPath = `${vidFolder}/${dn}`;
            if (!fs.existsSync(vidPath)) {
                // download it and upload it
                x.logIt('Downloading', vidPath, vidFolder);
                const dl = new DownloaderHelper(videoObj.file_url, vidFolder);
                dl.on('end', () => {
                    x.logIt('Downloaded - now uploading');
                    x.uploadVideo(youtube, videoObj, vidPath, x.nothing);
                });
                dl.on('error', () => {
                    x.logIt("Download Error");
                    x.processVideo(youtube, x.videoObjs, x.nothing);
                })
                dl.start();
                return;
            } 
        } if(this.videoObjs.length<=0) {
            resolve("Done");
        }
    })
}

method.uploadVideo = function (youtube, videoObj, vidPath, nothing) {
    this.videoObj = videoObj;
    this.vidPath = vidPath;
    this.nothing = nothing;
    var cn = this.videoObj.creator_name;
    var params = {
        resource: {
            "snippet": {
                "description": `Thank you for watching! \n Check out ${cn} on twitch for more videos by him! \n Shoutouts EVERY WEEK to people who like, subscribe, and comment to my youtube videos! \n ❤️❤️❤️ Subscribe and I will love you forever ❤️❤️❤️.  \n If you are a streamer and want your clip removed, please let me know on my discord or by email. Enjoy! \n 8/1/2021: This weeks shoutout goes to Eesa: https://www.youtube.com/channel/UCoHAs8QCa19Q01O0esEDLAw/, and Tum: https://www.youtube.com/c/Tumytum/videos, thank you for subscribing and commenting on my videos! \n To get a shoutout of your own, subscribe, comment, and like any of my videos, and you might get a shoutout too!`,
                "title": this.videoObj.title,
                "tags": [
                  "Clips",
                  "Twitch",
                  "Youtube",
                  "Video",
                  "Awesome",
                  "Short",
                  uploadType,
                  "Awe-Inspiring",
                ],
                "thumbnails": {
                  "medium": {
                    "url": this.videoObj.thumbnail_url
                  }
              }
            }
        }
    };
    var t = this;
    youtube.upload(t.vidPath, params, function (err, video) {
        if (err) {
           t.processVideo(youtube, t.videoObjs, t.nothing)
           t.logIt('ERROR!!!!! during youtube upload', err);
        } else {
            t.logIt('Success - youtube upload');
            setTimeout(function() {
                t.logIt("Going to sleep")
                t.processVideo(youtube, t.videoObjs, 900000)
            }, 900000);
        }
    });
}

method.callTwitch = function(access_token, uri) {
    this.access_token = access_token;
    this.uri = uri;
    return new Promise((resolve, reject) => {
        var options = {
            host: "api.twitch.tv",
            port: 443,
            path: this.uri,
            method: "GET",
            headers: {
                "Client-Id": TwitchClientId,
                "Authorization": `Bearer ${this.access_token}` 
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

method.getTwitchVid = function(youtube) {
    var _this = this;
    return new Promise((resolve, reject) => {
        _this.logIt('In twitch authorize promise');
        axios
        .post(`https://id.twitch.tv/oauth2/token?grant_type=client_credentials&client_id=${TwitchClientId}&client_secret=${TwitchClientSecret}`)
        .then(res => {
            _this.logIt('Twitch access token', access_token);
            var access_token = res.data.access_token;
            _this.callTwitch(access_token, "/helix/games/top").then(function(obj) {
            this.obj = obj;
            var gameId = 0;
            for (var i  = 0; i < this.obj.data.length; i++) {
                if (this.obj.data[i].name == uploadType) {
                    gameId = this.obj.data[i].id;
                    break;
                }
            }
            _this.logIt('Game id is', gameId);
            if (gameId) {
                var dts2 = new Date().toISOString();
                var dts = new Date();
                dts.setDate(dts.getDate() - 1);
                dts=dts.toISOString()
                _this.callTwitch(access_token, `/helix/clips?game_id=${gameId}&first=100&started_at=${dts}&ended_at=${dts2}`).then(function(obj) {
                    this.obj = obj
                    var d = this.obj.data;
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
                    console.log(ret[0]);
                    resolve(ret);
                });
            } else {
                // game not found
                resolve([]);
            }
          });
        }).catch((error) => {
            console.log("ERRRORRRR"+error)
        });
    });
}

method.logIt = function() {
    console.log(new Date(), arguments);
}

module.exports = getTwitchVideos;
