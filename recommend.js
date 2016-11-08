var gitUtils = require('./getRepoContributors');
const request = require('request');
var dotenv = require('dotenv');
dotenv.load();
const GITHUB_USER = process.env.GIT_USER;
const GITHUB_TOKEN = process.env.TOKEN;

var fullStars = [];

function getRecommends(error, response, body){
  if (error){
    throw error;
  }
  console.log('Response Status Code: ', response.statusCode);
  if (response.statusCode == 401){
    console.log('The credentials entered are not valid.');
  } else if (response.statusCode == 404) {
    console.log('The provided owner/repo does not exist');
  }
  // Array of Objects -> Objects
  // Takes the body, which is an array of objects, and retreives/saves login:avatar_url
  var starredUrls = {};
  var parsedBody = JSON.parse(body);
  for (contributor of parsedBody){
    if (contributor.starred_url){
      starredUrls[contributor.login] = contributor.starred_url.substring(0, contributor.starred_url.length - 15);
    }
  }
  starredArr = [];
  starCount = Object.keys(starredUrls).length;
  for (name in starredUrls){
    fetchStars(starredUrls[name]);
  }
  // console.log(starredArr2);
  // ask about this
}

function fetchStars(url){
  var requestURL;
  requestURL = gitUtils.addAuth(url, gitUtils.authComplete());
  request.get({
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project',
      'Content-Type': 'applicaiton/JSON'
    },
    uri: requestURL}, (error, response, body) => {
    if (error){
      throw error;
    }
    var parseBody = JSON.parse(body);
    var starDict = {};
    starCount -= 1;
    // iterate over each starred repo
    for (star of parseBody){
      starredArr.push(star.full_name);
    }
    // at the last contributor, tally the stars
    if (starCount === 0){
      for (hoshi of starredArr){
        if (starDict[hoshi]){
          starDict[hoshi] += 1;
        } else {
          starDict[hoshi] = 1;
        }
      }
      // sort the dictionary after converting it to an array
      var starAA = [];
      for (key in starDict){
        starAA.push([key, starDict[key]])
      }
      starAA.sort((a,b) => {
        return b[1] - a[1];
      })

      for (line of starAA.slice(0, 5)){
        console.log('[ ' + line[1] + " stars " + '] ' + line[0] + "\n")
      }
    }
  });
}





// takes input from the command line
// recommends input format if input not of length 2
input = process.argv.slice(2);
if (input.length !== 2){
  console.log("Please enter :owner :repo \nThe overall command should look like \nnode download_avatars <owner> <repo>");
} else {
  gitUtils.getRepoContributors(input[0], input[1], getRecommends, gitUtils.buildRepoContributors(input[0], input[1], gitUtils.authComplete()));
}

// console.log(fetchStars('https://api.github.com/users/pbakaus/starred'));