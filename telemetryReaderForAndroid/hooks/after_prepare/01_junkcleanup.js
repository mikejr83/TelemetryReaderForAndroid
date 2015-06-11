#!/usr/bin/env node
 
var fs = require('fs');
var path = require('path');
 
var foldersToProcess = [
    "js",
    "css"
];

var baseFolders = ['platforms/android/assets/www/'];
 
foldersToProcess.forEach(function(folder) {
    baseFolders.forEach(function(baseFolder) {
      processFiles(baseFolder + folder);
    });
});
 
function processFiles(dir) {
    fs.readdir(dir, function(err, list) {
        if(err) {
            console.log('processFiles err: ' + err);
            return;
        }
        list.forEach(function(file) {
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if(!stat.isDirectory()) {
                    var basename = path.basename(file);
                    
                    var regex = /flight\d_data\.json|data\.json|data2\.json|file_data\.json/;
                    
                    if (regex.test(basename)) {
                      fs.unlink(file, function(error) {
                          console.log("Removed test data file " + file);
                      });
                    } else {
                      switch(basename) {
                          case ".DS_Store":
                              fs.unlink(file, function(error) {
                                  console.log("Removed file " + file);
                              });
                              break;
                          case "Thumbs.db":
                              fs.unlink(file, function(error) {
                                  console.log("Removed file " + file);
                              });
                              break;
                          default:
                              console.log("Skipping file " + file);
                              break;
                      }
                    }
                    
                    
                    
                } else {
                  processFiles(file);
                }
            });
        });
    });
}