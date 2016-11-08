const fs = require('fs');
const request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');

var gitUtils = require('./getRepoContributors')

// error, response, body (from request) -> undefined
// side effects only
// calls downloadImageByURL on each contributor's login and avatar_url
function getImages(error, response, body){
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
  var avatarUrls = {};
  var parsedBody = JSON.parse(body);
  for (contributor of parsedBody){
    if (contributor.avatar_url){
      avatarUrls[contributor.login] = contributor.avatar_url;
    }
  }
  for (name in avatarUrls){
    if (avatarUrls.hasOwnProperty(name)){
      downloadImageByURL(avatarUrls[name], './avatars/' + name);
    }
  }
}

// url, filePath -> undefined
// side effects only
// writes image at url to filePath
function downloadImageByURL(url, filePath){
  var filename = filePath.substring(filePath.lastIndexOf('/') + 1);
  var filedir = filePath.substring(0, filePath.lastIndexOf('/'));
  // make the parent directory
  fs.mkdir(filedir, (e) => { });
  request.get({url:url, encoding: "binary"}, (error, response, body) => {
    response.setEncoding('binary');
    if (error) { throw err; }
    var suffix = response.headers['content-type'];
    suffix = suffix.substring(suffix.lastIndexOf('/') + 1);
    var writePath = filePath+"."+suffix;
  fs.writeFile(writePath, body, 'binary', (err) => { });
  console.log("Image retreived for " + filename);
  })
}

// takes input from the command line
// recommends input format if input not of length 2
input = process.argv.slice(2);
if (input.length !== 2){
  console.log("Please enter :owner :repo \nThe overall command should look like \nnode download_avatars <owner> <repo>");
} else {
  gitUtils.getRepoContributors(input[0], input[1], getImages, gitUtils.buildRepoContributors(input[0], input[1], gitUtils.authComplete()));
}