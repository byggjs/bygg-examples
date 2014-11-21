/* global require, process */
'use strict';

var mix = require('mix');

var autoprefixer = require('mix/autoprefixer');
var browserify = require('mix/browserify');
var csswring = require('mix/csswring');
var files = require('mix/files');
var noop = require('mix/noop');
var rev = require('mix/rev');
var sass = require('mix/sass');
var serve = require('mix/serve');
var stats = require('mix/stats');
var uglify = require('mix/uglify');
var write = require('mix/write');
var imagemin = require('mix/imagemin');
var rename = require('mix/rename');

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
    // Useful for React minification
    process.env.NODE_ENV = optimize ? "production" : "development";

    var html = files('*.html');

    var styles = files('styles/app.scss')
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions', 'ie 9'))
        .pipe(optimize ? csswring() : noop());

    var scripts = files('scripts/main.jsx')
        .pipe(browserify({
            dest: 'scripts/app.js',
            extensions: ['.js', '.jsx'],
            configure: function (b) {
                b.transform('6to5-browserify');
            }
        }))
        .pipe(rename('app.js', 'demo.js'))
        .pipe(optimize ? uglify() : noop());

    var images = files('images/*')
        .pipe(optimize ? imagemin() : noop());

    return mix.combine(
        html,
        styles,
        scripts,
        images
    )
    .pipe(optimize ? rev() : noop());
};
