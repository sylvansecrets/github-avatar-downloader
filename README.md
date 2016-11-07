# GitHub Avatar Downloader

## Problem Statement

Given a GitHub repository name and owner, download all the contributors' profile images and save them to a subdirectory, `avatars/`.

## Expected Usage

This program should be executed from the command line, in the following manner:

`node download_avatars.js jquery jquery`

or more generally
`node download_avatars.js <project name> <repo name>`

the avatars of all contributors will be downloaded to
`./avatars`