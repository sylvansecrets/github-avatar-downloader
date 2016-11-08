var dotenv = require('dotenv');
dotenv.load();
const GITHUB_USER = process.env.GIT_USER;
const GITHUB_TOKEN = process.env.TOKEN;
const request = require('request');


// String, String, function -> undefined
// calls callback function on the request GET of the repo
module.exports = function getRepoContributors(repoOwner, repoName, cb){
  var requestURL;
  var authBool = authComplete();
  if (authBool){
    requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  } else {
    requestURL = 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  }
  request.get({
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project',
      'Content-Type': 'applicaiton/JSON'
    },
    uri: requestURL
  }, (error, response, body) => { cb(error, response, body); });
}


// checks if both the user and the token exist
function authComplete(){
  var authBool;
  if (typeof(GITHUB_USER) !== "undefined" && typeof(GITHUB_TOKEN) !== "undefined"){
    authBool = true;
  } else {
    console.log('Credentials incomplete, USER:' + GITHUB_USER + ' AUTHENTICATION TOKEN: ' + GITHUB_TOKEN);
    authBool = false;
  }
  return authBool;
}
