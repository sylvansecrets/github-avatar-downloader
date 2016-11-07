const request = require('request');
const git_auth = require('./git_auth');
const GITHUB_USER = git_auth.user_name;
const GITHUB_TOKEN = git_auth.token;

console.log('Welcome to the GitHub Avatar Downloader!')

function getRepoContributors(repoOwner, repoName, cb){
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  request.get({
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    },
    uri: requestURL
  })
  return true;
}



getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});

