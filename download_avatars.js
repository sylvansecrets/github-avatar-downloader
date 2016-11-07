const request = require('request');
const git_auth = require('./git_auth');
const GITHUB_USER = git_auth.user_name;
const GITHUB_TOKEN = git_auth.token;

console.log('Welcome to the GitHub Avatar Downloader!')

function getRepoContributors(repoOwner, repoName, cb){
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  console.log(requestURL);
  request.get({
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
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

// getRepoContributors("jquery", "jquery", function(err, result) {
//   console.log("Errors:", err);
//   console.log("Result:", result);
// });

getRepoContributors("jquery", "jquery", getHandler);