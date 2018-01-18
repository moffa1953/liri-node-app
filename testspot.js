var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: "c3a5af1d275243dbb0687bedef2105ba",
  secret: "393bd896d1c34a6eb5b73ba8ba0c0204"
});
 
spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 
console.log(JSON.stringify(data,null,2)); 
});