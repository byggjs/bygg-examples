/* global require, process */
'use strict';

var bygg = require('bygg');

var autoprefixer = require('bygg-plugins/autoprefixer');
var csswring = require('bygg-plugins/csswring');
var rev = require('bygg-plugins/rev');
var serve = require('bygg-plugins/serve');
var stats = require('bygg-plugins/stats');
var uglify = require('bygg-plugins/uglify');

bygg.task('serve', function (optimize) {
    return build(optimize)
        .pipe(bygg.write('build/'))
        .pipe(serve(3000));
});

bygg.task('build', function (optimize) {
    return build(optimize)
        .pipe(bygg.write('build/'))
        .pipe(stats());
});

var build = function (optimize) {
    var html = bygg.files('*.html');

    var styles = bygg
        .files('app.css')
        .pipe(autoprefixer('last 2 versions', 'ie 9'))
        .pipe(optimize ? csswring() : bygg.noop());

    var scripts = bygg
        .files('app.js')
        .pipe(optimize ? uglify() : bygg.noop());

    return bygg.combine(
        html,
        styles,
        scripts
    )
    .pipe(optimize ? rev() : bygg.noop());
};
