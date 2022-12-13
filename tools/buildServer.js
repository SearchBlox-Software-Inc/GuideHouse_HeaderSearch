const express = require('express');
const webpack = require('webpack');
const path = require("path");
const open  = require("open");

const app = express();


app.use(express.static('dist'));

app.get("*", function(req, res){
  res.sendFile(path.join(__dirname, "../dist/index.html"));
})

// Serve the files on port 3000.
app.listen(9010, function (err) {
  if(err){
    console.log(err);
    return;
  }
  console.log('Example app listening on port 9010!\n');
  open(`http://localhost:9010`);
});
