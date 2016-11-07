const request = require('request');
const gitAuth = require('./git_auth');
const fs = require('fs');
const GITHUB_USER = gitAuth.user_name;
const GITHUB_TOKEN = gitAuth.token;

console.log('Welcome to the GitHub Avatar Downloader!');

// String, String, function -> undefined
// calls callback function on the request GET of the repo
function getRepoContributors(repoOwner, repoName, cb){
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  console.log(requestURL);
  request.get({
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project',
      'Content-Type': 'applicaiton/JSON'
    },
    uri: requestURL
  }, (error, response, body) => { cb(error, response, body); });
}


// error, response, body (from request) -> undefined
// side effects only
// calls downloadImageByURL on each contributor's login and avatar_url
function getImages(error, response, body){
  if (error){
    throw error;
  }
  console.log('Response Status Code: ', response.statusCode);
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
// writes the content of the url
function downloadImageByURL(url, filePath){
  var filename = filePath.substring(filePath.lastIndexOf('/') + 1);
  request.get(url)
  .on('error', (err) => { console.log("Error " + err); throw err; })
  .on('response', (response) => {
    console.log('Downloading image for ' + filename + " ...");
  })
  .pipe(fs.createWriteStream(filePath))
  .on('finish', () => { console.log('Downloading complete for ' + filename); });
}


// takes input from the command line
// recommends input format if input not of length 2
input = process.argv.slice(2);
if (input.length !== 2){
  console.log("Please enter :owner :repo \nThe overall command should look like \nnode download_avatars <owner> <repo>");
} else {
  getRepoContributors(input[0], input[1], getImages);
}