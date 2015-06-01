/* global require, process */
'use strict';

var bygg = require('bygg');

var autoprefixer = require('bygg-plugins/autoprefixer');
var browserify = require('bygg-plugins/browserify');
var csswring = require('bygg-plugins/csswring');
var rev = require('bygg-plugins/rev');
var sass = require('bygg-plugins/sass');
var serve = require('bygg-plugins/serve');
var stats = require('bygg-plugins/stats');
var uglify = require('bygg-plugins/uglify');
var imagemin = require('bygg-plugins/imagemin');
var rename = require('bygg-plugins/rename');
var svgSprite = require('bygg-plugins/svg-sprite');

bygg.task('serve', function (optimize) {
    return build(optimize)
        .pipe(bygg.write('build/'))
        .pipe(serve(3000));
}, [{ name: 'optimize', default: false, flag: true, abbr: 'o' }]);

bygg.task('build', function (optimize) {
    return build(optimize)
        .pipe(bygg.write('build/'))
        .pipe(stats());
}, [{ name: 'optimize', default: true, flag: true, abbr: 'o' }]);

var build = function (optimize) {
    // Useful for React minification
    process.env.NODE_ENV = optimize ? "production" : "development";

    var html = bygg.files('*.html');

    var styles = bygg
        .files('styles/app.scss')
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions', 'ie 9'))
        .pipe(optimize ? csswring() : bygg.noop());

    var scripts = bygg
        .files('scripts/main.jsx')
        .pipe(browserify({
            extensions: ['.js', '.jsx'],
            configure: function (b) {
                b.transform('babelify');
            }
        }))
        .pipe(rename('main.js', 'demo.js'))
        .pipe(optimize ? uglify() : bygg.noop());

    var sprite = bygg
        .files('images/*.svg')
        .pipe(imagemin())
        .pipe(svgSprite({ dest: 'images/sprite.svg' }));

    return bygg.combine(
        html,
        styles,
        scripts,
        sprite
    )
    .pipe(optimize ? rev() : bygg.noop());
};
