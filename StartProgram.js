var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var clientId;
var clientSecret;
var redirectUrl;
var oauth2Client;
const http = require('https');
const axios = require('axios');
const { DownloaderHelper } = require('node-downloader-helper');
var SCOPES = ['https://www.googleapis.com/auth/youtube.upload','https://www.googleapis.com/auth/youtube.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the YouTube API.
  authorize(JSON.parse(content));
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
  console.log(credentials);
  clientSecret = credentials.web.client_secret;
  clientId = credentials.web.client_id;
  console.log(clientId);
  console.log(clientSecret);
  redirectUrl = credentials.web.redirect_uris[0];
  oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
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
function getNewToken(oauth2Client, callback) {
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
      callback(oauth2Client);
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
var url = (`https://id.twitch.tv/oauth2/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`);
console.log(url);
axios
  .post(url)
  .then(res => {
    var access_token = res.data.access_token;
    var options = {
        host: "api.twitch.tv",
        port: 443,
        path: "/helix/games/top",
        method: "GET",
        headers: {
            "Client-Id": clientId,
            "Authorization": `Bearer ${access_token}` 
        }
    }
    // A chunk of data has been received.
    callback = function(response) {
        var str = ''
        response.on('data', function (chunk) {
          str += chunk;
        });
        response.on('end', function () {
            console.log(typeof str);
            str = JSON.parse(str);
            console.log(typeof str);
            var data = str.data;
            for(var i = 0; i < data.length; i++) {
               var id = data[i].id;
               var name = data[i].name;
               if(name==="Fortnite") {
                 console.log("Id of "+id+" and name of "+name)
                  var op = {
                    host: "api.twitch.tv",
                    port: 443,
                    path: `/helix/clips?game_id=${id}`,
                    method: "GET",
                    headers: {
                        "Client-Id": clientId,
                        "Authorization": `Bearer ${access_token}` 
                    }
                  }
                  cbak = function(respo) {
                    var st = ''
                    respo.on('data', function (chk) {
                      st += chk;
                    }); 
                    respo.on('end', function () {
                        st = JSON.parse(st);
                        var d = st.data;
                        for(var i = 0; i < d.length; i++) {
                            var dp = d[i].thumbnail_url.split("-preview")[0];
                            console.log(dp);
                            var downloadname = dp.split("https://clips-media-assets2.twitch.tv/")[1];
                            dp+=".mp4"
                            var nm3 = data[i].name;
                            console.log("theree")
                            const dl = new DownloaderHelper(dp , "/Users/rahilshariff/Downloads");
                            dl.on('end', () => console.log('Download Completed'))
                            dl.start();
                            break;
                            var opti = {
                                host: "youtube.googleapis.com",
                                path: `/youtube/v3/videos?part=id&notifySubscribers=true&key=${access_token}`,
                                port: 443,
                                method: "POST",
                                headers: {
                                'Authorization': 'Bearer [YOUR_ACCESS_TOKEN]',
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                                },
                                data: {
                                "snippet":
                                    {"title": nm3,"description": `Thank you for watching! Check out ${d[i].creator_name} on twitch for more videos by him! Like and Subscribe for more!`,"tags":["Clips","Twitch", "Youtube", "Video", "Awesome", "Short", "Fortnite", "Awe-Inspiring"]},"status":{"privacyStatus":"public"},"fileDetails":{"fileName": `/Users/rahilshariff/Downloads/${downloadname}`}
                                }
                            }
                            const req = https.request(opti, res => {
                                console.log(res)
                                /*res.on('data', d => {
                                process.stdout.write(d)
                                })*/
                            })
                            req.on('error', error => {
                                console.error(error)
                            })
                            req.end();
                            console.log("th5")
                            console.log(data[i]);
                            console.log("The downloadable link is "+dp+" and thumbnail is "+d[i].thumbnail_url+" and name is "+nm3+" in "+i);
                            break;
                        }
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
});
