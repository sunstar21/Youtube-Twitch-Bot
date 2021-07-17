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
  clientSecret = credentials.web.client_secret;
  clientId = credentials.web.client_id;
  redirectUrl = credentials.web.redirect_uris[0];
  oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
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
                var dts2 = new Date();
                var dts = new Date();
                dts.setDate(dts.getDate() - 1);
                var styr = JSON.stringify(dts2.getUTCFullYear());
                var stmn = JSON.stringify(dts2.getUTCMonth());
                var stdy = JSON.stringify(dts2.getUTCDate());
                var dhr = JSON.stringify(dts2.getUTCHours());
                var dm = JSON.stringify(dts2.getUTCMinutes());
                var ds = JSON.stringify(dts2.getUTCSeconds());
                if (stmn.length === 1) stmn = "0" + stmn;
                if (stdy.length === 1) stdy = "0" + stdy;
                if (dhr.length === 1) stdy = "0" + dhr;
                if (dm.length === 1) stdm = "0" + dm;
                if (ds.length === 1) ds = "0" + ds;
                var styr2 = JSON.stringify(dts.getUTCFullYear());
                var stmn2 = JSON.stringify(dts.getUTCMonth());
                var stdy2 = JSON.stringify(dts.getUTCDate());
                var dhr2 = JSON.stringify(dts.getUTCHours())
                var dm2 = JSON.stringify(dts.getUTCMinutes())
                var ds2 = JSON.stringify(dts.getUTCSeconds());
                if (stmn2.length === 1) stmn2 = "0" + stmn2;
                if (stdy2.length === 1) stdy2 = "0" + stdy2;
                if (dhr2.length === 1) stdy2 = "0" + dhr2;
                if (dm2.length === 1) stdm2 = "0" + dm2;
                if (ds2.length === 1) ds2 = "0" + ds2;
                var start_date = styr + "-" + stmn + "-" + stdy + "T" + dhr + ":" + dm + ":" + ds + "Z";
                var end_date = styr2 + "-" + stmn2 + "-" + stdy2 + "T" + dhr2 + ":" + dm2 + ":" + ds2 + "Z";
                var op = {
                    host: "api.twitch.tv",
                    port: 443,
                    path: `/helix/clips?game_id=${id}&first=100&started_at=${end_date}&ended_at=${start_date}`,
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
                        console.log("CLINET ID"+clientId+" "+ClientId);
                        console.log("ACCESS_TOKEN"+access_token)
                        console.log(d);
                        const annoying = new Promise((resolve, reject) => {
                          for(var i = 0; i < d.length; i++) {
                            if(i>100) break;
                            var dp = d[i].thumbnail_url.split("-preview")[0]
                            dp+=".mp4";
                            var nam_e = d[i].title;
                            if(/[a-z]+/.test(nam_e)) {
                            var creatername = d[i].creator_name;
                            var url = d[i].thumbnail_url;
                            var downloadname = dp.split(".tv/")[1].split(".mp4")[0];
                            var enter = [dp, nam_e, creatername, downloadname, url];
                            console.log(enter)
                            biginfo.push(enter);
                            break;
                            }
                          }
                          resolve("Done")
                          //var t = isthereanyleft(access_token);
                          //if(t === "DONE") {
                            //console.log("done");
                            //resolve("done");
                          //}
                        })
                        await annoying;
                        /*st = JSON.parse(st);
                        var d = st.data;
                        var info = {};
                        var counter = 0;
                        for(var i = 0; i < d.length; i++) {
                            sleep.sleep(10)
                              var dp = d[i].thumbnail_url.split("-preview")[0];
                              dp+=".mp4"
                              var nm3 = d[i].title;
                              console.log('test')
                              console.log(d[i].title);
                              var download = dp.split(".tv/")[1];
                              var downloadname = download.split(".mp4")[0];
                              console.log(downloadname);
                              var creatername = d[i].creator_name;
                              console.log(creatername);
                              info[counter]=[downloadname, dp, access_token, creatername];
                              counter++;
                              //need to do this not aysnc with a promise
                              const dl = new DownloaderHelper(dp , "/Users/rahilshariff/newd");
                              dl.on('end', () => comp(info, counter))
                              dl.start();
                              console.log("The downloadable link is "+dp+" and thumbnail is "+d[i].thumbnail_url+" and path is "+downloadname+"and name is "+nm3+" in "+i);
                              
                        }*/
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
    const dl = new DownloaderHelper(dp, "/Users/rahilshariff/newd");
    console.log(dp);
      dl.on('end', () => {
        comp(access_token, url);
        console.log("Ended?")
        biginfo.shift();
        return isthereanyleft(access_token);
      })
    dl.start();
  } else /*FINALLY DONE*/ return "DONE"
}

async function comp(at, url) {
  //need to do this after download
  sleep.sleep(900)
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
              "description": `Thank you for watching! Check out ${cn} on twitch for more videos by him! Like and Subscribe for more!`,
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
                cn, 
                nm3
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
    youtube.authenticate(clientId, clientSecret, function (err, tokens) {
      if (err) return console.error('Cannot authenticate:', err)
      uploadVideo()
    })
    function uploadVideo() {
      youtube.upload(`/Users/rahilshariff/newd/${dn}`, params, function (err, video) {
      // 'path/to/video.mp4' can be replaced with readable stream. 
      // When passing stream adding mediaType to params is advised.
        if (err) {
          return console.error('Cannot upload video:', err)
        }
        console.log('Video was uploaded with ID:', video.id)    
      /*// this is just a test! delete it
      youtube.delete(video.id, function (err) {
        if (!err) console.log('Video was deleted')
      })*/
      })
    }
  return;
}
