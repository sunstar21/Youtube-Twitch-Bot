var ClientId = "xxvz2mqd0a3dz1v6kxyr9et4dueukh";
var ClientSecret = "dz04478gkk40xmzerpnm02c9zjd9m5";
const http = require('https');
const axios = require('axios')
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
                            var url = d[i].url;
                            var dp = d[i].thumbnail_url.split("-preview")[0];
                            dp+=".mp4"
                            var nm = d[i].creator_name;
                            console.log("The url is "+url+" and link is "+dp+" and name is "+nm+" in "+i);
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
