/* global require, process */
'use strict';

var mix = require('mix');
var autoprefixer = require('mix/autoprefixer');
var csswring = require('mix/csswring');
var files = require('mix/files');
var rev = require('mix/rev');
var serve = require('mix/serve');
var stats = require('mix/stats');
var uglify = require('mix/uglify');
var write = require('mix/write');
var noop = require('mix/noop');

mix.task('serve', function (optimize) {
    return build(optimize)
        .pipe(write('build/'))
        .pipe(serve(3000));
}, [{ name: 'optimize', default: false, flag: true, abbr: 'o' }]);

mix.task('build', function (optimize) {
    return build(optimize)
        .pipe(write('build/'))
        .pipe(stats());
}, [{ name: 'optimize', default: true, flag: true, abbr: 'o' }]);

var build = function (optimize) {
    var html = files('*.html');

    var styles = files('app.css')
        .pipe(autoprefixer('last 2 versions', 'ie 9'))
        .pipe(optimize ? csswring() : noop());

    var scripts = files('app.js')
        .pipe(optimize ? uglify() : noop());

    return mix.combine(
        html,
        styles,
        scripts
    )
    .pipe(optimize ? rev() : noop());
};
