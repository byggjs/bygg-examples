/* global require, process */
'use strict';

var mix = require('mix');

var autoprefixer = require('mix-plugins/autoprefixer');
var browserify = require('mix-plugins/browserify');
var csswring = require('mix-plugins/csswring');
var rev = require('mix-plugins/rev');
var sass = require('mix-plugins/sass');
var serve = require('mix-plugins/serve');
var stats = require('mix-plugins/stats');
var uglify = require('mix-plugins/uglify');
var imagemin = require('mix-plugins/imagemin');
var rename = require('mix-plugins/rename');
var svgSprite = require('mix-plugins/svg-sprite');

mix.task('serve', function (optimize) {
    return build(optimize)
        .pipe(mix.write('build/'))
        .pipe(serve(3000));
}, [{ name: 'optimize', default: false, flag: true, abbr: 'o' }]);

mix.task('build', function (optimize) {
    return build(optimize)
        .pipe(mix.write('build/'))
        .pipe(stats());
}, [{ name: 'optimize', default: true, flag: true, abbr: 'o' }]);

var build = function (optimize) {
    // Useful for React minification
    process.env.NODE_ENV = optimize ? "production" : "development";

    var html = mix.files('*.html');

    var styles = mix
        .files('styles/app.scss')
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions', 'ie 9'))
        .pipe(optimize ? csswring() : mix.noop());

    var scripts = mix
        .files('scripts/main.jsx')
        .pipe(browserify({
            dest: 'scripts/app.js',
            extensions: ['.js', '.jsx'],
            configure: function (b) {
                b.transform('6to5-browserify');
            }
        }))
        .pipe(rename('app.js', 'demo.js'))
        .pipe(optimize ? uglify() : mix.noop());

    var sprite = mix
        .files('images/*.svg')
        .pipe(imagemin())
        .pipe(svgSprite({ dest: 'images/sprite.svg' }));

    return mix.combine(
        html,
        styles,
        scripts,
        sprite
    )
    .pipe(optimize ? rev() : mix.noop());
};
