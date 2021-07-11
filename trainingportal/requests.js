const express = require('express');
const path = require('path');
const util = require(path.join(__dirname, 'util'));
const config = util.getConfig();
const crypto = require('crypto');
const app = express();
const aesCrypto = require(path.join(__dirname, 'aescrypto'));
const session = require('express-session');
const passport = require('passport');
const validator = require('validator');
const uid = require('uid-safe');
var LocalStorage = require('node-localstorage').LocalStorage;
const db = require(path.join(__dirname, 'db'));
const challenges = require(path.join(__dirname, 'challenges'));
const captchapng = require('captchapng');
const fs = require('fs');
var challengesHtml = fs.readFileSync(path.join(__dirname, 'static/challenges.html'), 'utf8');
const blackBeltPath = util.getDataDir() + "/static/lessons/blackBelt/definitions.json";
var challengeRequestName = "";
var challengeRequestId = "";
var belt = "";
const alert = require('alert');


if (!util.isNullOrUndefined(config.samlProviderCertFilePath)) {
    var samlProviderCert = fs.readFileSync(path.join(__dirname, config.samlProviderCertFilePath), 'utf-8');
}
if (!util.isNullOrUndefined(config.encSamlProviderPvkFilePath)) {
    var encSamlProviderPvk = fs.readFileSync(path.join(__dirname, config.encSamlProviderPvkFilePath), 'utf-8');
    var samlProviderPvk = aesCrypto.decrypt(encSamlProviderPvk);
}

var requestSolutions = null;
var requestSolutionsPath = "";
var approvedUsers = null;
var approvedUsersPath = "";

try {
    if (!util.isNullOrUndefined(config.requestSolutionsPath)) {
        let dataDir = util.getDataDir() + "/static";
        requestSolutionsPath = path.join(dataDir, config.requestSolutionsPath);

        if (!fs.existsSync(requestSolutionsPath)) {
            //create the request soltions file if not already there
            var obj = { users: [] };
            fs.writeFileSync(requestSolutionsPath, JSON.stringify(obj), 'utf8');
        }
        requestSolutions = require(requestSolutionsPath);
    }
}
catch (ex) {
    util.log(ex);
}

try {
    if (!util.isNullOrUndefined(config.approvedUsersPath)) {
        let dataDir = util.getDataDir() + "/static";
        approvedUsersPath = path.join(dataDir, config.approvedUsersPath);

        if (!fs.existsSync(approvedUsersPath)) {
            //create the approved users file if not already there
            var obj = { approvedUsers: [] };
            fs.writeFileSync(approvedUsersPath, JSON.stringify(obj), 'utf8');
        }
        approvedUsers = require(approvedUsersPath);
    }
}
catch (ex) {
    util.log(ex);
}

let getChallengeInfo = function (challengeId) {
    var blackBeltfile = fs.readFileSync(blackBeltPath, 'utf-8');
    var arrayOfObjectsBB = JSON.parse(blackBeltfile);
    //console.log("Black Belt : " + JSON.stringify(arrayOfObjects));
    //console.log("Object : "+ JSON.stringify(arrayOfObjects[1].challenges[1]));
    for (var i = 0; i < arrayOfObjectsBB.length; i++) {
        for (var j = 0; j < arrayOfObjectsBB[i].challenges.length; j++) {
            if (arrayOfObjectsBB[i].challenges[j].id == challengeId) {
                challengeRequestName = arrayOfObjectsBB[i].challenges[j].name;
                challengeRequestId = challengeId;
                belt = arrayOfObjectsBB[i].name;
            }
        }
    }
}

// add new user on click on Request Solution
let createRequestSolution = function (challengeId) {
    getChallengeInfo(challengeId);
    var localStorage = new LocalStorage('./scratch');
    var userName = localStorage.getItem('loggedInUser');
    console.log(userName);
    var requestsfile = fs.readFileSync(requestSolutionsPath, 'utf-8');
    var arrayOfObjects = JSON.parse(requestsfile);
    if (userExists(userName, challengeId, arrayOfObjects)) {
        alert("The solution have already been requested before");
    } else {
        arrayOfObjects.users.push({
            name: userName,
            challengeRequestName: challengeRequestName,
            challengeRequestId: challengeRequestId,
            belt: belt,
            approve: "no"
        });
        console.log(arrayOfObjects);
        fs.writeFileSync(requestSolutionsPath, JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
            if (err) throw err
            console.log('Done!');
        });
    }
}

// check if user exists in array of objects
function userExists(username, id, arrayOfUsers) {
    return arrayOfUsers.users.some(function (el) {
        return (el.name === username) && (el.challengeRequestId === id);
    });
}

module.exports = {
    createRequestSolution,
    getChallengeInfo
};