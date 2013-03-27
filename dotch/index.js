var child_process = require("child_process");
var fs = require("fs");
var path = require("path");

var watch = path.join(__dirname, "../assets/javascripts/main.js");
var run = path.join(__dirname, "../build.sh");
var command = 'sh '+'"'+run+'"';

fs.watchFile(watch, function (curr, prev) {
    child_process.exec(command, function (error, stdout, stderr){
        if(!error) console.log("success");
        if(error) console.log("failure");
    });
});