var ClientId = "xxvz2mqd0a3dz1v6kxyr9et4dueukh";
var ClientSecret = "dz04478gkk40xmzerpnm02c9zjd9m5";
var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var sleep = require('sleep')
var redirectUrl;
var oauth2Client;
var OAuth2 = google.auth.OAuth2;
const http = require('https');
const axios = require('axios')
const { DownloaderHelper } = require('node-downloader-helper');
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
    callback = function(response) {
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
                console.log("Id of "+id+" and name of "+name)
                  var op = {
                    host: "api.twitch.tv",
                    port: 443,
                    path: `/helix/clips?game_id=${id}&limit=100&period=day&trending=true`,
                    method: "GET",
                    headers: {
                        "Client-Id": ClientId,
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
                              const dl = new DownloaderHelper(dp , "/Users/rahilshariff/newd");
                              dl.on('end', () => comp(info, counter, downloadname))
                              dl.start();
                              console.log("The downloadable link is "+dp+" and thumbnail is "+d[i].thumbnail_url+" and path is "+downloadname+"and name is "+nm3+" in "+i);
                        }
                    });  
                  }
                  http.request(op, cbak).end(); 
            }
        });
    }  
    http.request(options, callback).end(); 
  })
  .catch(error => {
    console.error(error)
})

function comp(info, ctr, path) {
  counter = 0;
  for(var i = 0; i < ctr; i++) {
    var dn = info[counter][0];
    var dl = info[counter][1];
    var at = info[counter][2];
    var cn = info[counter][3];
    console.log(`download name is ${dn} download link is ${dl} access_token is ${at} creator name is ${cn}`)
    counter++;
  }
  try {
    fs.unlinkSync("./"+path+".mp4");
    console.log("File removed:", path);
  } catch (err) {
    console.error(err);
  }
  return;
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
          {"title": nm3,"description": `Thank you for watching! Check out ${creatername} on twitch for more videos by him! Like and Subscribe for more!`,"tags":["Clips","Twitch", "Youtube", "Video", "Awesome", "Short", "Fortnite", "Awe-Inspiring"]},"status":{"privacyStatus":"public"},"fileDetails":{"fileName": `/Users/rahilshariff/Downloads/${downloadname}`}
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

}
