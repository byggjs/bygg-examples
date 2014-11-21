/* global require, process */

var mix = require('mix');
var autoprefixer = require('mix/autoprefixer');
var browserify = require('mix/browserify');
var csswring = require('mix/csswring');
var files = require('mix/files');
var jshint = require('mix/jshint');
var mv = require('mix/mv');
var rev = require('mix/rev');
var sass = require('mix/sass');
var serve = require('mix/serve');
var stats = require('mix/stats');
var svgo = require('mix/svgo');
var svgSprite = require('mix/svg-sprite');
var uglify = require('mix/uglify');
var write = require('mix/write');

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
    process.env.NODE_ENV = optimize ? "production" : "development";

    var html = files({ base: 'src', src: '*.html'});

    var styles = files({ base: 'src', src: 'styles/app.scss'})
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions', 'ie 9'));

    if (optimize) {
        styles = styles.pipe(csswring());
    }

    var scripts = files({ base: 'src', src: 'scripts/main.jsx' })
        .pipe(browserify({
            dest: 'scripts/app.js',
            extensions: ['.js', '.jsx'],
            configure: function (b) {
                b.transform('6to5-browserify');
            }
        }));

    if (optimize) {
        scripts = scripts.pipe(uglify());
    }

    var app = mix.combine(
        html,
        styles,
        scripts
    );

    if (optimize) {
        app = app.pipe(rev());
    }

    return app;
};
