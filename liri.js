require("dotenv").config();

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var keys = require('./keys');
var twitterkeys = keys.twitter;

var spotify = new Spotify(keys.spotify);

function getTweets() {
    var client = new Twitter(twitterkeys);
    var params = {screen_name: "@couturemonstre", count: 20};
    
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                var tweetContent = tweets[i].text;
                var tweetDate = tweets[i].created_at;
                console.log([i]);
                console.log("Tweet: " + tweetContent);
                console.log("Tweeted on: " + tweetDate);
                console.log("--------------------------\n")
            }
        }
    });

};

var getArtistNames = function(artist) {
    return artist.name;
};

function getSong(song) {    
    if (song === undefined) {
        song = "Oops I Did it Again"
    } 
    
    spotify.search(
        {
        type: "track", 
        query: song
        }, 
        function(error, data) {
            if (error) {
                console.log("ERROR unable to retrive song information" + error);
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        }
    );

};

function getMovie(movie) {
    if (movie === undefined) {
        movie = "A Walk to Remember"
    }

    var queryString = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&apikey=trilogy";
    
    request(queryString, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var jsonData = JSON.parse(body);
            
            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);      
        }
    });
};

function command() {
    fs.readFile("./random.txt", "utf-8", function(error, data) {
        console.log(data);

        var dataArr = data.split(",");

        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
};

var pick = function(caseData, functionData) {
    switch (caseData) {
        case "my-tweets":
            getTweets(functionData);
            break;
        case "spotify-this-song":
            getSong(functionData);
            break;
        case "movie-this":
            getMovie(functionData);
            break;
        default:
            console.log("LIRI does not comprehend\n Please choose a valid fuction:\n\n my-tweets\n spotify-this-song <enter a song>\n movie-this <enter a movie>");
    }
};

var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv.slice(3).join(" "));
