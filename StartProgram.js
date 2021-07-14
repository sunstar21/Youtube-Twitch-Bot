var ClientId = "xxvz2mqd0a3dz1v6kxyr9et4dueukh";
var ClientSecret = "dz04478gkk40xmzerpnm02c9zjd9m5";
const http = require('https');
const axios = require('axios')
var Youtube = require('youtube-video-api')
const { DownloaderHelper } = require('node-downloader-helper');
var url = (`https://id.twitch.tv/oauth2/token?grant_type=client_credentials&client_id=${ClientId}&client_secret=${ClientSecret}`);
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
                        for(var i = 0; i < d.length; i++) {
                            var dp = d[i].thumbnail_url.split("-preview")[0];
                            dp+=".mp4"
                            var nm3 = data[i].name;
                            //onst dl = new DownloaderHelper(dp , "/Users/rahilshariff/Downloads");
                            //dl.on('end', () => console.log('Download Completed'))
                            //dl.start(); 
                            
                            var youtube = Youtube({ 
                                video: {
                                    part: 'status,snippet' 
                                }
                            })
                            var params = {
                                resource: {
                                snippet: {
                                    title: nm3,
                                    description: `Thank you for watching! Check out ${d[i].creator_name} on twitch for more videos by him! Like and Subscribe for more!`
                                },
                                status: {
                                    privacyStatus: 'public'
                                    }
                                }
                            }
                            youtube.authenticate(ClientId, ClientSecret, function (err, tokens) {
                                    if (err) return console.error('Cannot authenticate:', err)
                                        console.log("Here")
                                        //youtube.upload(dp, params, function (err, video) {
                                    //if (err) {
                                      //  return console.error('Cannot upload video:', err)
                                   // }
                                    //console.log('Video was uploaded with ID:', video.id)
                                //})
                            })
                            console.log(data[i]);
                            console.log("The downloadable link is "+dp+" and thumbnail is "+d[i].thumbnail_url+" and name is "+nm3+" in "+i);
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
})
