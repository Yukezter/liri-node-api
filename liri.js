require("dotenv").config();

const keys = require("./keys.js");

const fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

const command = process.argv[2];
const commandInput = process.argv[3];

// Bands in town
function concertThis(artist) {
    axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
    .then(function(response) {
        const events = response.data;
        events.forEach(event => {
            console.log('-----------------------------------------');
            console.log(event.venue.name);
            console.log(`${event.venue.city}, ${event.venue.country}`);
            console.log(moment(event.datetime).format('MM/DD/YYYY'));
        });
    }).catch(function(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
    })
}

// Spotify
function spotifyThisSong(song) {
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        const artists = data.tracks.items[0].artists.map(artist => artist.name);
        console.log('-----------------------------------------');
        console.log(data.tracks.items[0].name);
        console.log(artists.join(', '));
        console.log(data.tracks.items[0].album.name);
        console.log(data.tracks.items[0].external_urls.spotify);
    })
}

// OMDB
function movieThis(movie) {
    axios.get(`http://www.omdbapi.com/?apikey=trilogy&t=${movie}`)
    .then(function(response) {
        console.log('-----------------------------------------');
        console.log(response.data.Title);
        console.log(response.data.Year);
        console.log(response.data.imdbRating);
        console.log(response.data.Ratings[1].Value);
        console.log(response.data.Country);
        console.log(response.data.Language);
        console.log(response.data.Plot);
        console.log(response.data.Actors);
    }).catch(function(error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
    })
}

// Txt file
function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            return console.log(error);
        }
        const index = data.indexOf(',');
        const command = data.substr(0, index).trim();
        const commandInput = data.substr(index).trim();
        if (command === 'do-what-it-says') {
            return console.log('"do-what-it-says" cannot be called in text file!');
        }
        liri(command, commandInput);
    })
}

function liri(argOne, argTwo) {
    switch(argOne) {
        case 'concert-this':
            concertThis(argTwo);
            break;
        case 'spotify-this-song':
            spotifyThisSong(argTwo);
            break;
        case 'movie-this':
            movieThis(argTwo);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log('Not a valid command');
    }
}

liri(command, commandInput);