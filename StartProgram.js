const { resolve } = require('path');

var callfuncagain = false;
var dlen = 0;
function runProgram() {
  var ClientId = "xxvz2mqd0a3dz1v6kxyr9et4dueukh";
  var ClientSecret = "dz04478gkk40xmzerpnm02c9zjd9m5";
  var fs = require('fs');
  var Youtube = require('youtube-video-api')
  var readline = require('readline');
  var {google} = require('googleapis');
  var sleep = require('sleep')
  var biginfo = [];
  var redirectUrl;
  var oauth2Client;
  var tv = 0;
  var clientid2;
  var clientsecret2;
  var OAuth2 = google.auth.OAuth2;
  const http = require('https');
  const axios = require('axios')
  const { DownloaderHelper } = require('node-downloader-helper');
  const { time } = require('console');
  var SCOPES = ['https://www.googleapis.com/auth/youtube.upload','https://www.googleapis.com/auth/youtube.readonly'];
  var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
      process.env.USERPROFILE) + '/.credentials/';
  var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';
  var url = (`https://id.twitch.tv/oauth2/token?grant_type=client_credentials&client_id=${ClientId}&client_secret=${ClientSecret}`);
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the YouTube API.
    authorize(JSON.parse(content));
  });
  
  function authorize(credentials) {
    console.log(credentials);
    clientSecret2 = credentials.web.client_secret;
    clientId2 = credentials.web.client_id;
    console.log(clientId2);
    console.log(clientSecret2);
    redirectUrl = credentials.web.redirect_uris[0];
    oauth2Client = new OAuth2(clientId2, clientSecret2, redirectUrl);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
      if (err) {
        console.log('getting new token')
        getNewToken(oauth2Client);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        console.log("Successful")
      }
    });
  }
  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback to call with the authorized
   *     client.
   */
  function getNewToken(oauth2Client) {
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
      rl.close();
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          return;
        }
        oauth2Client.credentials = token;
        storeToken(token);
      });
    });
  }
  /**
   * Store token to disk be used in later program executions.
   *
   * @param {Object} token The token to store to disk.
   */
  function storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) throw err;
      console.log('Token stored to ' + TOKEN_PATH);
    });
  }
  
  /**
   * Lists the names and IDs of up to 10 files.
   *
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  

  axios
    .post(url)
    .then(res => {
      var access_token = res.data.access_token;
      console.log(access_token)
      var options = {
          host: "api.twitch.tv",
          port: 443,
          path: "/helix/games/top",
          method: "GET",
          headers: {
              "Client-Id": ClientId,
              "Authorization": `Bearer ${access_token}` 
          }
      }
      // A chunk of data has been received.
      callback = async function(response) {
          var str = ''
          response.on('data', function (chunk) {
            str += chunk;
          });
          response.on('end', function () {
              str = JSON.parse(str);
              var data = str.data;
              for(var i = 0; i < data.length; i++) {
                var id = data[i].id;
                var name = data[i].name;
                if(name==="Fortnite") {
                  console.log("Id of "+id+" and name of "+name)
                  debugger;
                  var dts2 = new Date().toISOString();
                  var dts = new Date();
                  dts.setDate(dts.getDate() - 1);
                  dts=dts.toISOString()
                  console.log(dts2);
                  console.log(dts)
                  var op = {
                      host: "api.twitch.tv",
                      port: 443,
                      path: `/helix/clips?game_id=${id}&first=100&started_at=${dts}&ended_at=${dts2}`,
                      method: "GET",
                      headers: {
                          "Client-Id": ClientId,
                          "Authorization": `Bearer ${access_token}` 
                      }
                    }
                    cbak = async function(respo) {
                      var st = ''
                      respo.on('data', async function (chk) {
                        st += chk;
                      }); 
                      respo.on('end', async function () {
                          st = JSON.parse(st);
                          d = st.data;
                          var info = {};
                          console.log("ACCESS_TOKEN"+access_token)
                          dlen=d.length;
                          console.log(dlen);
                          const annoying = new Promise((resolve, reject) => {
                            for(var i = 0; i < d.length; i++) {
                              var dp = d[i].thumbnail_url.split("-preview")[0]
                              dp+=".mp4";
                              var nam_e = d[i].title;
                              if(/[a-z]+/.test(nam_e)) {
                              var creatername = d[i].creator_name;
                              var url = d[i].thumbnail_url;
                              var downloadname = dp.split(".tv/")[1].split(".mp4")[0];
                              var enter = [dp, nam_e, creatername, downloadname, url];
                              biginfo.push(enter);
                              }
                            }
                            var t = isthereanyleft(access_token);
                            if(t === "DONE") {
                              console.log("done");
                              resolve("done");
                            }
                          })
                          await annoying;
                      });  
                    }
                    http.request(op, cbak).end(); 
              }
            }
          });
      }  
      http.request(options, callback).end(); 
    })
    .catch(error => {
      console.error(error)
  })
  async function isthereanyleft(access_token/*need dp, access_token, and url*/) {
    if(biginfo.length>0) {
      var dp = biginfo[0][0];
      var url = biginfo[0][4];
      console.log(dp);
      comp(access_token, url);
      console.log("Ended?")
      biginfo.shift();
      return isthereanyleft(access_token);
    } else {
      console.log("The function is over, 24 hours has past call function again");
      callfuncagain = true;
      return;
    }
  }

  async function comp(at, url) {
    //need to do this after download
      console.log("in comp")
      var dn = biginfo[0][3];
      dn+=".mp4"
      var dl = biginfo[0][0];
      var cn = biginfo[0][2];
      var nm3 = biginfo[0][1];
      console.log(dn);
      console.log(`download name is ${dn} download link is ${dl} access_token is ${at} creator name is ${cn}`)
      const dir = '/Users/rahilshariff/newd';
    // delete directory recursively
    //upload HERE before deleting directory
      var youtube = Youtube({ 
        video: {
          part: 'status,snippet' 
        }
      })
      var params = {
        resource: {
            "snippet": {
                "description": `Thank you for watching! \n Check out ${cn} on twitch for more videos by him! \n Shoutouts EVERY WEEK to people who like, subscribe, and comment to my youtube videos! \n ❤️❤️❤️ Subscribe and I will love you forever ❤️❤️❤️.  \n If you are a streamer and want your clip removed, please let me know on my discord or by email. Enjoy!`,
                "title": nm3,
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
                    "url": url
                  }
              }
            }
        }
      }
      console.log(params);
      youtube.authenticate(clientId2, clientSecret2, function (err, tokens) {
        if (err) return console.error('Cannot authenticate:', err)
        uploadVideo()
      })
      function uploadVideo() {
        if(tv>3) {
          tv=0;
          return console.log("Failed to upload")
        }
        console.log("Uploading")
        var t = new Date();
        const path = `/Users/rahilshariff/newd/${dn}`
        try {
          if (fs.existsSync(path)) {
            console.log("File exists, go to next video")
            isthereanyleft();
            return;
          } else {
            console.log("FILE DOESN'T EXIST");
            const dl = new DownloaderHelper(dn, "/Users/rahilshariff/newd");
            dl.on('end', () => {
            sleep.sleep(Math.floor(60/(dlen/24)*60))
            youtube.upload(`/Users/rahilshariff/newd/${dn}`, params, function (err, video) {
            // 'path/to/video.mp4' can be replaced with readable stream. 
            // When passing stream adding mediaType to params is advised.
              if (err) {
                tv++;
                uploadVideo();
              } else {
                console.log(t);
                //Can't delete otherwise can't see if file already exists
            }
            /*// this is just a test! delete it
            youtube.delete(video.id, function (err) {
              if (!err) console.log('Video was deleted')
            })*/
            })
          })
          dl.start();
          }
        } catch(err) {
          console.error(err)
        }
      }
      return;
  }
}
runProgram();
setInterval(() => {  
  if(callfuncagain===true) {
    console.log("RERUNNING")
    callfuncagain = false;
    runProgram();
  } 
}, 1000);
