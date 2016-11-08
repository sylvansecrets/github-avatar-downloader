var dotenv = require('dotenv');
dotenv.load();
const GITHUB_USER = process.env.GIT_USER;
const GITHUB_TOKEN = process.env.TOKEN;
const request = require('request');

// String, String, function -> undefined
// calls callback function on the request GET of the repo
function getRepoContributors(repoOwner, repoName, cb, url){
  var requestURL = url;
  request.get(gitHead(requestURL), (error, response, body) => { cb(error, response, body); });
}

// checks if both the user and the token exist
// prints a warning if the authentication information is incomplete
// returns a boolean
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

// builds the url based on repoOwner and repoName
// String, String, boolean ->  String
function buildRepoContributors(repoOwner, repoName, auth){
  var requestURL;
  if (auth) {
    requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  } else {
    requestURL = 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  }
  return requestURL;
}

// adds authentication to a url
// returns original url if authentication is incomplete
// String, boolean -> String
function addAuth(url, auth){
  var requestURL;
  if (auth) {
    requestURL = url.replace('https://', '');
    requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + "@" + requestURL;
  } else {
    requestURL = url;
  }
  return requestURL;
}

// creates a request object from a url and a header
// by default uses the github header
// String, Object -> Object
function gitHead(url, header){
  header = header || { 'User-Agent': 'GitHub Avatar Downloader - Student Project' };
  return { headers: header, url: url };
}

module.exports = { getRepoContributors: getRepoContributors, buildRepoContributors:buildRepoContributors, authComplete:authComplete, addAuth:addAuth, gitHead:gitHead }