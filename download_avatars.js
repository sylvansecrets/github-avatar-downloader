const request = require('request');
const git_auth = require('./git_auth');
const fs = require('fs');
const GITHUB_USER = git_auth.user_name;
const GITHUB_TOKEN = git_auth.token;

console.log('Welcome to the GitHub Avatar Downloader!')

function getRepoContributors(repoOwner, repoName, cb){
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  console.log(requestURL);
  request.get({
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project',
      'Content-Type': 'applicaiton/JSON'
    },
    uri: requestURL
  }, (error, response, body) => {cb(error, response, body)})


  return null;
}

function getHandler(error, response, body){
  if (error){
    throw error;
  }
  console.log('Response Status Code: ', response.statusCode);
  console.log('Response Content Type: ', response.headers['content-type']);
  // Array of Objects -> Array
  // Takes the body, which is an array of objects, and returns the values of avatar_url in each object
  var avatar_urls = [];
  var parsedBody = JSON.parse(body);
  for (contributor of parsedBody){
    if (contributor.avatar_url){
      avatar_urls.push(contributor.avatar_url);
    }
  }


  // console.log(avatar_urls);
  console.log(avatar_urls);
}

function downloadImageByURL(url, filePath){
  request.get(url)
  .on ('error', (err) => {console.log("Error "+err); throw(err);})
  .on ('response', (response) => {
    console.log('Response Status Code: ', response.statusCode);
    console.log('Response Content Type: ', response.headers['content-type']);
    console.log('Downloading image...')
  })
  .pipe(fs.createWriteStream(filePath))
  .on ('finish', () => {console.log('Downloading complete');})
}

// getRepoContributors("jquery", "jquery", function(err, result) {
//   console.log("Errors:", err);
//   console.log("Result:", result);
// });

getRepoContributors("jquery", "jquery", getHandler);

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "./avatars/kvirani.jpg")