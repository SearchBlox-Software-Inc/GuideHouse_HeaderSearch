/* eslint-disable no-console */

import webpack from 'webpack';
import webpackConfig from '../webpack.config.prod';
import colors from 'colors';
const fs = require('fs');
import path from 'path';


process.env.NODE_ENV = 'production';

console.log("Generating minified bundle for production. takes few minutes...".blue);

webpack(webpackConfig).run((err, stats) => {
  if(err){
    console.log(err);
    // console.log(err.bold.red);
    return 1;
  }

  const jsonStats = stats.toJson();

  if(jsonStats.hasErrors){
    return jsonStats.errors.map(err => console.log(err.red));
  }

  if(jsonStats.hasWarnings){
    console.log('Webpack generated following warninngs:'.bold.yellow);
    jsonStats.warnings.map(warn => console.log(warn.yellow));
  }

  console.log(`webapck stats: ${stats}`);

  console.log('Your app has been compiled in production mode and written to dist'.green);

  return 0;
});
