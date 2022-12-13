const express = require('express');
const webpack = require('webpack');
const path = require("path");
const open  = require("open");
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
const config = require('../webpack.config.dev.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  overlay: true,
  publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.use(express.static(path.resolve(__dirname, '../src')));

app.get("*", function(req, res){
  res.sendFile(path.join(__dirname, "../src/index.html"));
})

// Serve the files on port 9020.
app.listen(9020, function (err) {
  if(err){
    console.log(err);
    return;
  }
  console.log('App listening on port 9020!\n');
  open(`http://localhost:9020`);
});
