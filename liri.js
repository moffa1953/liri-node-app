var dotenv   	= require("dotenv").config()
var fs       	= require("fs")
var Spotify  	= require("node-spotify-api");
var request  	= require("request");
var Twitter  	= require("twitter");
var omdb     	= require("omdb");
var keys     	= require("./keys.js");
var workString 	= []
var formattedArr = [];
var twitMsgarr 	= [];

var spotify 	= new Spotify(keys.spotify)
var client 		= new Twitter(keys.twitter)

		whatTodo = process.argv[2]

		if(whatTodo == "do-what-it-says") {
				fs.readFile("random.txt", "utf8", function(err, data) {
    				if (err) {
      					console.log("Can't find anything to do");
    				}
    				dataArray = data.split(",")   				
    				whatTodo = dataArray[0]
    				workString.push(dataArray[1])
    				workString.toString();
    			})
		} else {
		// pull all of the augments from the command line
			workString = []
			if(process.argv[3] != null) {
				// consolidate the augments			
				for(i=3; i < process.argv.length; i++) {
					workString[(i-3)] = process.argv[i] 
				}
				workString.toString();
			}
		}

		switch (whatTodo) {
		    case "my-tweets":
		        getTwitter()
		        break;
		    case "spotify-this-song":
		        getSpotify(workString)
		        break;
		    case "movie-this":
		        movies(workString)
		        break;
		    default:
		        console.log("Unidentified request entered");

		}            // end of switch whatTodo


		function movies(movieName) {
		    console.log("")
		    console.log("")
		    console.log("")
		    console.log("")
		    console.log("")
		    console.log("Movie Results")
		    console.log("--------------------------------------------")

		  	request("http://www.omdbapi.com/?apikey=trilogy&t=" + movieName + "&y=&plot=full&r=json", function(error, response, body) {
		  		// If there were no errors and the response code was 200 (i.e. the request was successful)...
		  		//console.log(response)
		  	    var movieData = JSON.parse(body)

		  	    // the next two lines will determine if a movie is found. Since a string
		  	    // is always return, we need to parse through the object for an error tag.
		  	    // if we we did not do this, we would get and undefined variable
		  	    labels = Object.keys(movieData)
		  	    found = labels.indexOf("Error")
	
		  	    //console.log(JSON.stringify(body))
			  	if (found < 0 && response.statusCode === 200) {
	
				    console.log( "Title: " + "\t\t" + movieData.Title +
				          "\n" + "Year: " + "\t\t" + movieData.Year +
				          "\n" + "IMDB Rating: " + "\t" + movieData.Ratings[0].Value +
				          "\n" + "Rotten Tomatoes: " + "\t" + movieData.Ratings[1].Value +
				          "\n" + "Country: " + "\t" + movieData.Country +
				          "\n" + "Lanuage: " + "\t" + movieData.Language +
				          "\n" + "Actors: " + "\t" + movieData.Actors +
				          "\n" + "Awards: " + "\t" + movieData.Awards  +
				          "\n" + "The Plot: " + 
				          "\n" + "---------------------------------------") 
				          
					formattedText = formatText(movieData.Plot,75)
					for(t=0; t < formattedText.length; t++) {
							console.log("\t"+formattedText[t])
					}
				  	console.log("")
			   	} else {
				  	console.log("")
				  	console.log("Sorry - We did not find this title ("+movieName)+")"
				  	console.log("")
				  	console.log("")
				  	console.log("")
			   	}
			});
		}


		function getTwitter() {
 
		      	// get user keys.login
		      	var params = {
		      		screen_name: keys.login.screen_name
		      	}

		      	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		      		if (!error) {
		         	 	// parse message for formatting
		          		for (i = 0; i < tweets.length; i++) {
		          			fromPerson = "";
		          			returnPerson = "";
		          			twitterMsg = "";
		          			hashTag = "";
		          			tweetLine = [];
		          			tweetLine = tweets[i].text.split(" ")
		          			for(t=0; t < tweetLine.length; t++) {

		          				// return message
		          				if(tweetLine[t] == "RT") {
		          					returnPerson = tweetLine[1];
		          					t++
		          					continue
		          				}

		          				// check for senders
		          				if(tweetLine[t].startsWith('@')) {
		          					fromPerson += (tweetLine[t]+"  ");
		          					continue
		          				}

		          				// check for hashtags
		          				if(tweetLine[t].startsWith('#')) {
		          					hashTag += (tweetLine[t]+"  ");
		          					continue
		          				}

		          				// get message body
		          				twitterMsg += (tweetLine[t] + " ")	          				
		          			}

		          			// format message body to 75 characters per line
		          			twitMsgarr = formatText(twitterMsg,75)

		          			// display results
		            		console.log("\t--------------------")
		            		console.log("\tTo: \t\t" +fromPerson+" ")

		            		// do not display return if none is found
		            		if(returnPerson != "") {
		            			console.log('\tResponse: \t' + returnPerson)
		            		}

		            		// do not display hashtag if none is found
		            		if(hashTag != "") {
		            			console.log('\tHashtag: \t' + hashTag)
		            		}

		            		console.log('\tMessage: \t'+twitMsgarr[0])
		            		for(m=1; m < twitMsgarr.length; m++) {
		            			console.log('\t\t\t'+twitMsgarr[m])
		            		}
		          		}
		      		} else {
		          	 	console.log("twitter error"+JSON.stringify(error))
		      		}
		      	});
		}

		function getSpotify(song) {

				console.log("Results for the song "+song)
				console.log("------------------------------------------")
		        spotify.search({ type: 'track', query: song }, function(err, data) {
			        if (err) {
			             console.log('Error occurred: ' + err);
			             return;
			        }

			        for(i=0; i < data.tracks.items.length; i++) {

			           artist = data.tracks.items[i].album.artists[0].name
			           albumName = data.tracks.items[i].album.name
			           songName = data.tracks.items[i].name
			           spotifyLink = data.tracks.items[i].external_urls.spotify

			           console.log("Song Name:" + "\t\t" + songName +
			               "\n" + "Album Name:" + "\t\t" + albumName +
			               "\n" + "Artist:" + "\t\t\t" + artist +
			               "\n" + "Preview Link:" + "\t\t" + spotifyLink +
			               "\n" + "---"
			            )
			        }


		})};

		function formatText(rawText,textWidth) {
			formattedArr = [];
			var workText = "";
			rawTextArr = rawText.split(' ')
			for(s=0; s < rawTextArr.length; s++) {
				// the following line will check if the added word will put
				// the sentence past the textwidth - if so, add the word to
				// the next sentence - the +1 is needed to anticipate a space
				if((workText.length + rawTextArr[s].length + 1) > textWidth) {
					formattedArr.push(workText)
					workText = rawTextArr[s] + " ";
				} else {
					workText += (rawTextArr[s] + " ")
				}
			}

			formattedArr.push(workText);

			return formattedArr
		}


				       //  for(i=0; i < data.tracks.items.length; i++) {

		         //   artist = data.tracks.items[i].album.artists[0].name
		         //   albumName = data.tracks.items[i].album.name
		         //   songName = data.tracks.items[i].name
		         //   spotifyLink = data.tracks.items[i].external_urls.spotify

		         //   console.log("Song Name:" + "\t\t" + songName +
		         //       "\n" + "Album Name:" + "\t\t" + albumName +
		         //       "\n" + "Artist:" + "\t\t\t" + artist +
		         //       "\n" + "Preview Link:" + "\t\t" + spotifyLink +
		         //       "\n" + "---"
		         //    )
		         // }
