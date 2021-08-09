const http = require('https')
const axios = require('axios')
const TwitchClientId = "xxvz2mqd0a3dz1v6kxyr9et4dueukh";
const TwitchClientSecret = "dz04478gkk40xmzerpnm02c9zjd9m5";
var videoid;
var options = {
    host: 'www.googleapis.com',
    port: 443,
    path: '/youtube/v3/search?key=AIzaSyDHxUC5OnFc8zKoxKpoR9GtKby-pNvncI0&channelId=UCke6I9N4KfC968-yRcd5YRg&part=snippet,id&order=date&maxResults=1',
    method: "GET",
}
callback = async function(response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
        videoid = JSON.parse(str).items[0].id.videoId;
        console.log(videoid);
        hello();
    });
};
http.request(options, callback).end()
function hello() {
    console.log("HELLO")
    var options2 = {
        host: 'id.twitch.tv',
        port: 443,
        path: `/oauth2/token?grant_type=client_credentials&client_id=${TwitchClientId}&client_secret=${TwitchClientSecret}`,
        method: "POST",
    }
    callback2 = async function(response) {
        var str = ''
        response.on('data', function (chunk) {
          str += chunk;
        });
        response.on('end', function () {
            var access_token = JSON.parse(str).access_token;
            callcomment(access_token);
        });
    };
    http.request(options2, callback2).end();
}
function callcomment(access_token) {
    console.log(access_token)
    const data = new TextEncoder().encode(
        JSON.stringify({
            "snippet":
                {"topLevelComment":
                    {"snippet":
                        {"textOriginal":"If you sub to me, ill sub to you too!! Plz sub!"}
                    },"channelId":"UCke6I9N4KfC968-yRcd5YRg","videoId":"HnDutffKsgQ"
                }
        })
    )
    var options3 = {
        host: 'youtube.googleapis.com',
        port: 443,
        path: `/youtube/v3/commentThreads?part=snippet&key=AIzaSyDHxUC5OnFc8zKoxKpoR9GtKby-pNvncI0`,
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    const req = http.request(options3, res => {
        console.log(`statusCode: ${res.statusCode}`)
      
        res.on('data', d => {
          process.stdout.write(d)
        })
      })
      
      req.on('error', error => {
        console.error(error)
      })
      req.write(data)
      req.end()      
}
hello();
