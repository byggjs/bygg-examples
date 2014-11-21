/* global require, process */
'use strict';

var mix = require('mix');

var autoprefixer = require('mix-plugins/autoprefixer');
var csswring = require('mix-plugins/csswring');
var files = require('mix-plugins/files');
var rev = require('mix-plugins/rev');
var serve = require('mix-plugins/serve');
var stats = require('mix-plugins/stats');
var uglify = require('mix-plugins/uglify');
var write = require('mix-plugins/write');
var noop = require('mix-plugins/noop');

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
